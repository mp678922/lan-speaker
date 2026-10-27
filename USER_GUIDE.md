# LAN Speaker: use and troubleshooting

[繁體中文：常見問題排除](README.zh-TW.md#常見問題排除) · [First-time setup](FIRST_USE.md)

LAN Speaker copies a Windows computer's default audio output to browsers on other LAN devices. The original computer audio continues. Start with the setup checklist before running it on a new computer.

## Start and stop

Double-click `start.bat` in Windows File Explorer. Keep its window open, then use the setup guide's current address on the receiving device. Click **Start playback**. Close the BAT window or press Ctrl+C there when finished.

English is the first-run default. The language menu switches the player, setup guide, live status, and ChatGPT prompts between English and Traditional Chinese. The browser remembers your selection. For console language, use `start.bat --lang en` or `start.bat --lang zh`. A port override can be combined with it, such as `start.bat 38471 --lang zh`.

## Before the website opens

| Symptom | What to check |
| --- | --- |
| BAT cannot start or exits | Read the BAT error. Check `python --version`, folder write access, and internet access for the first installation. |
| BAT reports `PASS` | The same service is already running on that port. A new instance was not started. Stop the old instance before changing how it starts. |
| The port is occupied | Change `config.json` or use `start.bat <port>`, then update the firewall for the new port. |

## Receiving device times out

Retry after each step:

1. Check the current address in the computer guide. Enter the complete `http://computer-IP:port/` address. The computer IP can change after reconnecting.
2. Check that the two devices can communicate on the LAN. The receiver IP is usually available in its Wi-Fi connection details; settings vary by OS. Guest networks, VPNs, and client isolation can interfere even when Wi-Fi names match.
3. Open that same LAN player address in the computer's browser. If it works there but the receiver times out, investigate incoming firewall rules and network reachability. If neither device opens the LAN address, check the address and listener first.
4. In **Troubleshooting** on the guide, choose the matching symptom to open a prepared ChatGPT question. An administrator may need to allow the current TCP port from `LocalSubnet`; the whole firewall should stay enabled.
5. An instance started through an isolated IDE or Agent environment may be accessible locally while rejecting other devices. Stop it and double-click the BAT in File Explorer. `PASS` means the old instance is still being reused.

The ChatGPT question explains the program, server and receiver roles, selected symptom, available diagnostics, and unknown details. ChatGPT can only guide you from the supplied text and your replies. It cannot see your devices, read project files, or know past configuration. Ask it to explain one action at a time and wait for your result.

The guide reads local diagnostics, including player addresses, port, audio state, program path, network profiles, and a named firewall rule. **Clicking a ChatGPT button sends those details in its URL.** You still review and send the conversation yourself. Use the manual checks above if you do not want to share them.

## The player opens but has no audio

1. Click **Start playback** manually. Check both device and page volume.
2. Play known audible content on the computer. Check its default output and mute settings, plus the guide's capture status.
3. Check the receiving page's connection status. Keep it in the foreground, refresh, and click **Start playback** again if needed. Background audio can stop after switching apps or tabs or locking the screen, depending on the device and browser.
4. After changing the default computer output, wait for the capture status to update. Restart the BAT if needed, then reconnect using the current guide address.

## Network and privacy

The default port is `38471`, as configured in `config.json`. Keep firewall access limited to the required TCP port and `LocalSubnet`. Use a trusted LAN: there is no authentication or encryption, and another person on that LAN may open the player if they know its address. Do not forward the port to the internet.
