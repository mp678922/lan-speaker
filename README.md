# LAN Speaker

[Download latest release](https://github.com/mp678922/lan-speaker/releases/latest) · [繁體中文說明](README.zh-TW.md)

Copy the audio currently playing on a Windows computer to a phone, tablet, or another computer on the same local network. The receiving device uses a browser; the Windows computer keeps playing its own audio.

## Player screenshot

Captured from the actual player while streaming a short demo audio clip.

![LAN Speaker playing audio in English, with a live spectrum and volume control](https://raw.githubusercontent.com/mp678922/lan-speaker/main/docs/screenshots/player-en.jpg)

## Before you start

Download **lan-speaker-v1.0.1.zip** from the [latest release](https://github.com/mp678922/lan-speaker/releases/latest), then extract the entire ZIP before running `start.bat`. Read [First-time setup](FIRST_USE.md). Keep the extracted files, `web`, and `assets` folders together; the launcher creates `.venv` on the first run. You can also use **Code → Download ZIP** for the current main branch.

Source ZIP downloads omit development tests and Git configuration through `.gitattributes`. A Git clone includes the tests for development. Python virtual environments, caches, and temporary files are excluded from version control by `.gitignore`.

## Use

1. Install Python 3.10 or later and make sure `python --version` works. Internet access is needed for the first package installation.
2. Double-click `start.bat` in Windows File Explorer. Keep the BAT window open. It creates the local Python environment, installs dependencies, and opens the setup guide.
3. Connect the receiving device to a local network that can reach the computer. Open the address shown in the guide using a browser that supports Web Audio and WebSocket.
4. Click **Start playback** and adjust the device and page volume. Keep the page open. Close the BAT window or press Ctrl+C there to stop the server.

On first use, the player and setup guide follow the browser's primary preferred language: Chinese locales use **Traditional Chinese**, and other or unavailable locales use **English**. A language explicitly set in the URL takes priority, followed by a saved manual choice. The language menu remembers your choice. Auto-detected choices are not saved or forced onto receiving devices; each device can detect its own language. Manually selected languages are included in shared player links. ChatGPT troubleshooting prompts follow the current page language.

The BAT console also defaults to English. To explicitly launch the console and guide in Chinese, run `start.bat --lang zh`; use `start.bat --lang en` for English. You can combine language and port options: `start.bat 38471 --lang zh`.

The default TCP port is `38471`. Change `config.json` or run `start.bat <port>` to override it. Update the firewall rule when changing ports. A second launch reports `PASS` and opens the guide if the same service is already running.

## Troubleshooting and privacy

See [User guide and troubleshooting](USER_GUIDE.md). The setup guide has symptom-specific ChatGPT buttons. Local read-only diagnostics may include LAN IP addresses, the program path, network profiles, and the program's named firewall rule. Clicking a ChatGPT button sends that information in its URL; ChatGPT provides written guidance and cannot operate your computer.

Start the BAT from File Explorer. Launching through an isolated command environment may allow the computer to open the site while blocking other devices. Stop that instance before starting the BAT normally; `PASS` means an existing instance was reused.

Use only a trusted LAN. There is no sign-in or encryption. Allow only the required TCP port from `LocalSubnet`; do not disable the whole firewall or forward the port to the internet. The computer's IP may change after reconnecting, so use the guide's current address.

Audio comes from the Windows default output using WASAPI loopback. The microphone is not captured. Echo is possible when both devices are audible. Background playback varies by device and browser and is not guaranteed after switching apps or tabs or locking the screen.
