"""Check that a running server exposes a browser page and audio WebSocket."""

import asyncio
import json
from pathlib import Path

from aiohttp import ClientSession, WSMsgType


async def main():
    port = json.loads((Path(__file__).resolve().parents[1] / "config.json").read_text(encoding="utf-8"))["port"]
    base = f"http://127.0.0.1:{port}"
    async with ClientSession() as session:
        async with session.get(base + "/") as response:
            assert response.status == 200
            assert "LAN Speaker" in await response.text()
        async with session.get(base + "/guide") as response:
            assert response.status == 200
            assert "Play your computer's audio on another device" in await response.text()
        for name in ("i18n.js", "guide.js"):
            async with session.get(base + "/assets/" + name) as response:
                assert response.status == 200
                assert "javascript" in response.headers.get("Content-Type", "")
        async with session.get(base + "/guide-data") as response:
            data = await response.json()
            assert data["port"] == port
            assert all(url.endswith(f":{port}/") for url in data["urls"])
            print("receiver URLs:", data["urls"])
        async with session.ws_connect(base + "/stream") as ws:
            status = await ws.receive(timeout=5)
            assert status.type == WSMsgType.TEXT
            info = json.loads(status.data)
            assert info["type"] == "status"
            print("capture status:", info)
            for _ in range(10):
                message = await ws.receive(timeout=5)
                if message.type == WSMsgType.BINARY:
                    assert len(message.data) > 0 and len(message.data) % 4 == 0
                    print("audio packet bytes:", len(message.data))
                    return
                if message.type == WSMsgType.TEXT:
                    print("capture status:", json.loads(message.data))
            raise AssertionError("no audio packet received")


if __name__ == "__main__":
    asyncio.run(main())
