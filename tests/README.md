# Development checks

This folder stays in the Git repository and is excluded from GitHub source ZIP downloads by `.gitattributes`.

From the repository root:

- `node tests/test_language.cjs` checks default language, saved selections, support prompts, and switching language during simulated playback. It needs Node.js, which end users do not need.
- `.venv\Scripts\python.exe tests\smoke_test.py` checks the pages and audio WebSocket of an already running server. Start `start.bat` normally from File Explorer first; the check uses the port in `config.json`.
