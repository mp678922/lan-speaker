"""Dependency bootstrap and idempotent launcher for start.bat."""

import argparse
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser
import localization as lang


ROOT = Path(__file__).resolve().parent
APP_ID = "lan-speaker-v1"
LEGACY_APP_ID = "lan-ipad-speaker-v1"
GUIDE_LANGUAGE = None


def get_port(value=None) -> int:
    try:
        value = value if value is not None else json.loads((ROOT / "config.json").read_text(encoding="utf-8"))["port"]
        port = int(value)
        if not 1 <= port <= 65535:
            raise ValueError("port out of range")
        return port
    except (OSError, KeyError, ValueError, json.JSONDecodeError) as exc:
        raise SystemExit(lang.message("invalid_port", error=exc))


def probe(port: int):
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/health", timeout=1) as response:
            return json.load(response).get("app")
    except (urllib.error.URLError, ValueError, TimeoutError):
        return None


def open_guide(port: int) -> None:
    url = f"http://127.0.0.1:{port}/guide"
    if GUIDE_LANGUAGE:
        url += f"?lang={GUIDE_LANGUAGE}"
    print(lang.message("opening", url=url), flush=True)
    if not webbrowser.open(url, new=2):
        print(lang.message("manual_url", url=url), flush=True)


def open_guide_when_ready(port: int) -> None:
    for _ in range(60):
        if probe(port) in {APP_ID, LEGACY_APP_ID}:
            open_guide(port)
            return
        time.sleep(0.25)


def main() -> int:
    global GUIDE_LANGUAGE
    parser = argparse.ArgumentParser(description="LAN Speaker launcher")
    parser.add_argument("port", nargs="?", help="Override the TCP port in config.json")
    parser.add_argument("--lang", choices=("en", "zh"), help="Override console and guide language (console defaults to en; guide remembers or detects browser language)")
    args = parser.parse_args()
    GUIDE_LANGUAGE = args.lang
    lang.set_language(args.lang or "en")
    port = get_port(args.port)
    existing = probe(port)
    if existing in {APP_ID, LEGACY_APP_ID}:
        print(lang.message("pass", port=port))
        open_guide(port)
        return 0
    if existing is not None:
        print(lang.message("other_service", port=port))
        return 1
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as check:
            check.bind(("0.0.0.0", port))
    except OSError:
        print(lang.message("occupied", port=port))
        return 1

    venv_dir = ROOT / ".venv"
    python = venv_dir / "Scripts" / "python.exe"
    if not python.exists():
        print(lang.message("venv"))
        subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], check=True)
    try:
        subprocess.run([str(python), "-c", "import aiohttp, numpy, soundcard"],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except subprocess.CalledProcessError:
        print(lang.message("install"))
        subprocess.run([str(python), "-m", "pip", "install", "-r", str(ROOT / "requirements.txt")], check=True)

    env = os.environ.copy()
    env["LAN_SPEAKER_PORT"] = str(port)
    env["LAN_SPEAKER_LANGUAGE"] = lang.LANGUAGE
    if GUIDE_LANGUAGE:
        env["LAN_SPEAKER_GUIDE_LANGUAGE"] = GUIDE_LANGUAGE
    else:
        env.pop("LAN_SPEAKER_GUIDE_LANGUAGE", None)
    try:
        threading.Thread(target=open_guide_when_ready, args=(port,), daemon=True).start()
        return subprocess.call([str(python), str(ROOT / "server.py")], cwd=ROOT, env=env)
    except KeyboardInterrupt:
        return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, subprocess.CalledProcessError) as exc:
        raise SystemExit(lang.message("failed", error=exc))
