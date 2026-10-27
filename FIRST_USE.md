# LAN Speaker: first-time setup

[繁體中文：首次使用準備](README.zh-TW.md#首次使用準備) · [User guide](USER_GUIDE.md)

The **Windows computer is the server**. It copies its current default audio output and provides a player website on the LAN. A phone, tablet, or another computer receives the audio through a browser, without a dedicated app.

## Prepare the Windows computer

- A working default audio output. Confirm the computer plays sound normally first.
- Python 3.10 or later. Run `python --version` in PowerShell; it should show a version rather than an error or an installation-store window.
- Internet access on the first run to install `aiohttp`, `numpy`, and `SoundCard` from `requirements.txt`. Missing packages on later runs may also require internet access.
- A writable program folder. Keep `start.bat`, `launcher.py`, `localization.py`, `server.py`, `config.json`, `requirements.txt`, and the complete `web` folder together. The launcher creates `.venv` locally; do not transfer an existing `.venv` from another computer.
- An available TCP port. The default in `config.json` is `38471`. Choose an unused port if it conflicts with another service, and update the firewall rule accordingly.
- Access to a computer administrator if an incoming firewall rule is needed. Allow only the current TCP port from `LocalSubnet`. Do not turn off the entire firewall.

## Prepare the receiving device and network

- Use a browser supporting Web Audio and WebSocket. The device can be a phone, tablet, or another computer.
- Both devices must be able to communicate on the LAN. Wired Ethernet on the server and Wi-Fi on the receiver are fine if they are connected to the same reachable network. Guest Wi-Fi, VPNs, or router client isolation may prevent communication.
- Be ready to click **Start playback** manually and adjust the device volume. Playback in the background or with the screen locked is not guaranteed.
- Use a trusted LAN. This website has no login or encryption; do not set up internet port forwarding for it.

## First run

1. Double-click `start.bat` in Windows File Explorer and keep its window open. Avoid launching through an Agent or isolated command environment, which may prevent incoming LAN access.
2. Wait for the environment and packages to be installed. The browser opens the setup guide. Check that the computer audio status is ready.
3. Enter the guide's current player address on the receiving device, including `http://`, the computer IP, and the port. Use your own address rather than another person's example IP.
4. Click **Start playback**. Stop the server by closing the BAT window or pressing Ctrl+C there.

On first use, the pages detect the browser's primary preferred language: Chinese locales use Traditional Chinese, otherwise English. A URL language or saved manual choice takes priority. Automatic detection is not saved, so each receiving device can detect its own language. Use the language menu to save a choice. To explicitly start the console and guide in Chinese, run `start.bat --lang zh`.

If something fails, follow [User guide and troubleshooting](USER_GUIDE.md).
