"""English-default messages for the Windows launcher and server console."""

import os

LANGUAGE = os.environ.get("LAN_SPEAKER_LANGUAGE", "en")


def set_language(language):
    global LANGUAGE
    LANGUAGE = language if language in {"en", "zh"} else "en"


MESSAGES = {
    "invalid_port": ("Invalid port. Edit config.json or run start.bat <port>. ({error})", "Port 無效。請編輯 config.json 或執行 start.bat <port>。（{error}）"),
    "opening": ("Opening setup guide: {url}", "正在開啟引導頁：{url}"),
    "manual_url": ("Open this URL in your PC browser: {url}", "請在電腦瀏覽器開啟：{url}"),
    "pass": ("PASS: server is already running on port {port}.", "PASS：服務已在 port {port} 執行。"),
    "other_service": ("Port {port} responds as another service. Choose another port.", "Port {port} 已被其他服務使用，請選擇其他 port。"),
    "occupied": ("Port {port} is already in use. Edit config.json or run start.bat <port>.", "Port {port} 已被使用。請編輯 config.json 或執行 start.bat <port>。"),
    "venv": ("Creating local Python environment...", "正在建立本機 Python 環境……"),
    "install": ("Installing audio and web dependencies...", "正在安裝音訊與網頁套件……"),
    "failed": ("Could not start: {error}", "無法啟動：{error}"),
    "running": ("LAN Speaker is running. Open an address below on another device in the same LAN:", "區網喇叭已啟動。請在同一區網的接收裝置開啟下列網址："),
    "stop": ("Press Ctrl+C to stop. Your PC's normal audio output stays on.", "按 Ctrl+C 停止服務。電腦原本的聲音會繼續播放。"),
    "unavailable": ("Port {port} is unavailable: {error}. Edit config.json or run start.bat <port>.", "Port {port} 無法使用：{error}。請編輯 config.json 或執行 start.bat <port>。"),
}


def message(key, **values):
    return MESSAGES[key][1 if LANGUAGE == "zh" else 0].format(**values)
