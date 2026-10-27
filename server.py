"""Stream the current Windows output device to browsers on the local network."""

import asyncio
import json
import os
from pathlib import Path
import socket
import subprocess
import threading

from aiohttp import web, WSMsgType
import numpy as np
import soundcard as sc
import localization as lang


APP_ID = "lan-speaker-v1"
ROOT = Path(__file__).resolve().parent
RATE = 48000
FRAMES = 1920  # 40 ms packets


class AudioHub:
    def __init__(self, loop):
        self.loop = loop
        self.queues = set()
        self.device = ""
        self.error = ""
        self.stop = threading.Event()

    def status(self):
        return json.dumps({"type": "status", "device": self.device, "error": self.error,
                           "listeners": len(self.queues)}, ensure_ascii=False)

    def publish(self, packet):
        for queue in tuple(self.queues):
            if queue.full():
                try:
                    queue.get_nowait()  # Prefer recent sound to accumulating latency.
                except asyncio.QueueEmpty:
                    pass
            queue.put_nowait(packet)

    def set_capture_status(self, device="", error=""):
        self.device = device
        self.error = error
        message = self.status()
        for queue in tuple(self.queues):
            if queue.full():
                try:
                    queue.get_nowait()
                except asyncio.QueueEmpty:
                    pass
            queue.put_nowait(message)

    def capture(self):
        while not self.stop.is_set():
            try:
                speaker = sc.default_speaker()
                if speaker is None:
                    raise RuntimeError("No default Windows output device found")
                microphone = sc.get_microphone(speaker.id, include_loopback=True)
                if microphone is None:
                    raise RuntimeError(f"No loopback capture for {speaker.name}")
                with microphone.recorder(samplerate=RATE, channels=2, blocksize=FRAMES) as recorder:
                    self.loop.call_soon_threadsafe(self.set_capture_status, speaker.name, "")
                    while not self.stop.is_set():
                        samples = recorder.record(numframes=FRAMES)
                        if samples is None or len(samples) == 0:
                            continue
                        if samples.ndim == 1:
                            samples = samples[:, None]
                        if samples.shape[1] == 1:
                            samples = np.repeat(samples, 2, axis=1)
                        pcm = (np.clip(samples[:, :2], -1, 1) * 32767).astype("<i2", copy=False)
                        self.loop.call_soon_threadsafe(self.publish, pcm.tobytes())
                        # A changed default output device requires a new loopback source.
                        current = sc.default_speaker()
                        if current is None or current.id != speaker.id:
                            break
            except Exception as exc:
                self.loop.call_soon_threadsafe(self.set_capture_status, "", str(exc))
                self.stop.wait(2)


def lan_addresses():
    addresses = []
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            addresses.append(sock.getsockname()[0])
    except OSError:
        pass
    try:
        addresses.extend(info[4][0] for info in socket.getaddrinfo(socket.gethostname(), None,
                                                                       family=socket.AF_INET))
    except OSError:
        pass
    return list(dict.fromkeys(ip for ip in addresses if not ip.startswith("127.")))


async def index(_request):
    return web.FileResponse(ROOT / "web" / "index.html")


async def guide(_request):
    return web.FileResponse(ROOT / "web" / "guide.html")


async def browser_asset(request):
    name = request.match_info["name"]
    if name not in {"i18n.js", "guide.js"}:
        raise web.HTTPNotFound()
    return web.FileResponse(ROOT / "web" / name, headers={"Cache-Control": "no-cache"})


async def guide_data(request):
    port = request.app["port"]
    return web.json_response({"port": port, "urls": [f"http://{ip}:{port}/" for ip in lan_addresses()]})


async def health(request):
    hub = request.app["hub"]
    return web.json_response({"app": APP_ID, "port": request.app["port"],
                              "device": hub.device, "error": hub.error})


def windows_network_diagnostics(port):
    """Read only the active network profile and this app's named firewall rule."""
    if os.name != "nt":
        return {"error": "Windows network diagnostics unavailable"}
    script = f'''
$ErrorActionPreference = 'Stop'
$profiles = @(Get-NetConnectionProfile | ForEach-Object {{
    [pscustomobject]@{{interface = [string]$_.InterfaceAlias; category = [string]$_.NetworkCategory}}
}})
$rule = Get-NetFirewallRule -PolicyStore ActiveStore -DisplayName 'LAN Speaker TCP {port}' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $rule) {{
    $rule = Get-NetFirewallRule -PolicyStore ActiveStore -DisplayName 'LAN iPad Speaker TCP {port}' -ErrorAction SilentlyContinue | Select-Object -First 1
}}
$firewall = $null
if ($rule) {{
    $portFilter = Get-NetFirewallPortFilter -AssociatedNetFirewallRule $rule
    $addressFilter = Get-NetFirewallAddressFilter -AssociatedNetFirewallRule $rule
    $firewall = [pscustomobject]@{{
        name = [string]$rule.DisplayName
        enabled = [string]$rule.Enabled
        direction = [string]$rule.Direction
        action = [string]$rule.Action
        profile = [string]$rule.Profile
        protocol = [string]$portFilter.Protocol
        localPort = [string]$portFilter.LocalPort
        remoteAddress = [string]$addressFilter.RemoteAddress
    }}
}}
[pscustomobject]@{{networkProfiles = $profiles; namedFirewallRule = $firewall}} | ConvertTo-Json -Compress -Depth 4
'''
    try:
        result = subprocess.run(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script],
                                capture_output=True, text=True, timeout=6, check=True,
                                creationflags=subprocess.CREATE_NO_WINDOW)
        return json.loads(result.stdout)
    except (OSError, subprocess.CalledProcessError, subprocess.TimeoutExpired, ValueError) as exc:
        return {"error": f"Read-only Windows network check unavailable: {type(exc).__name__}"}


async def diagnostics(request):
    # The guide opens on 127.0.0.1. Do not expose machine details to LAN clients.
    if (request.remote not in {"127.0.0.1", "::1"}
            or request.host.split(":", 1)[0].lower() not in {"127.0.0.1", "localhost"}):
        raise web.HTTPForbidden()
    hub = request.app["hub"]
    return web.json_response({
        "projectPath": str(ROOT),
        "port": request.app["port"],
        "bind": "0.0.0.0",
        "urls": [f"http://{ip}:{request.app['port']}/" for ip in lan_addresses()],
        "audioDevice": hub.device,
        "audioError": hub.error,
        "windowsNetwork": await asyncio.to_thread(windows_network_diagnostics, request.app["port"]),
    })


async def stream(request):
    ws = web.WebSocketResponse(heartbeat=20, max_msg_size=1024)
    await ws.prepare(request)
    hub = request.app["hub"]
    queue = asyncio.Queue(maxsize=5)
    hub.queues.add(queue)
    await ws.send_str(hub.status())

    async def send_audio():
        while True:
            item = await queue.get()
            if isinstance(item, str):
                await ws.send_str(item)
            else:
                await ws.send_bytes(item)

    sender = asyncio.create_task(send_audio())
    try:
        async for message in ws:
            if message.type == WSMsgType.ERROR:
                break
    finally:
        sender.cancel()
        hub.queues.discard(queue)
        await ws.close()
    return ws


async def startup(app):
    loop = asyncio.get_running_loop()
    hub = AudioHub(loop)
    app["hub"] = hub
    thread = threading.Thread(target=hub.capture, name="wasapi-loopback", daemon=True)
    app["capture_thread"] = thread
    thread.start()
    print("\n" + lang.message("running"), flush=True)
    for address in lan_addresses():
        print(f"  http://{address}:{app['port']}/?lang={lang.LANGUAGE}", flush=True)
    print(f"  PC: http://127.0.0.1:{app['port']}/", flush=True)
    print(lang.message("stop") + "\n", flush=True)


async def shutdown(app):
    app["hub"].stop.set()


def main():
    port = int(os.environ.get("LAN_SPEAKER_PORT", "38471"))
    app = web.Application()
    app["port"] = port
    app.router.add_get("/", index)
    app.router.add_get("/guide", guide)
    app.router.add_get("/assets/{name}", browser_asset)
    app.router.add_get("/guide-data", guide_data)
    app.router.add_get("/health", health)
    app.router.add_get("/diagnostics", diagnostics)
    app.router.add_get("/stream", stream)
    app.on_startup.append(startup)
    app.on_shutdown.append(shutdown)
    try:
        web.run_app(app, host="0.0.0.0", port=port, print=None)
    except OSError as exc:
        raise SystemExit(lang.message("unavailable", port=port, error=exc))


if __name__ == "__main__":
    main()
