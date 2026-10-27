/* Shared UI and support-prompt translations. English is the first-run default. */
(() => {
  const messages = {
    'app.title': ['LAN Speaker', '區網喇叭'],
    'player.title': ['LAN Speaker', '區網喇叭'],
    'player.intro': ["Play this computer's audio. Keep this page open and adjust both your device volume and the volume below.", '播放電腦目前輸出的聲音。請保持這個網頁開啟，並調整此裝置與網頁的音量。'],
    'player.visualizer': ['Audio-driven spectrum animation', '由實際音訊帶動的頻譜動畫'],
    'player.spectrum': ['LIVE SPECTRUM', '即時頻譜'],
    'player.live': ['LIVE', '播放中'],
    'player.standby': ['STANDBY', '待機'],
    'player.volume': ['Volume', '音量'],
    'player.start': ['Start playback', '開始播放'],
    'player.stop': ['Stop playback', '停止播放'],
    'player.idle': ['Not playing', '尚未播放'],
    'player.first': ['Click Start playback to begin.', '第一次播放需要點一下按鈕。'],
    'player.connecting': ['Connecting', '連線中'],
    'player.connectingInfo': ['Connecting to the computer…', '正在連接電腦…'],
    'player.connected': ['Connected', '已連線'],
    'player.waiting': ['Waiting for computer audio…', '等待電腦聲音…'],
    'player.source': ['Source: {device}. Waiting for audio…', '來源：{device}。等待電腦聲音…'],
    'player.finding': ['Looking for an audio device…', '正在尋找聲音裝置…'],
    'player.captureFailed': ['Audio capture failed', '擷取失敗'],
    'audio.noOutput': ['No default Windows output device found', '找不到 Windows 預設聲音輸出裝置'],
    'audio.noLoopback': ['Loopback capture is unavailable for {device}', '無法擷取 {device} 的輸出音訊'],
    'player.disconnected': ['Disconnected', '連線中斷'],
    'player.retry': ['Reconnecting in 2 seconds. Check that the computer server is still running.', '2 秒後自動重連；請確認電腦端仍在執行。'],
    'player.playing': ['Playing', '正在播放'],
    'player.receiving': ['Receiving computer audio.', '電腦聲音已傳入。'],
    'player.stopped': ['Stopped', '已停止'],
    'player.restart': ['Click Start playback to reconnect.', '點「開始播放」即可重新連線。'],
    'player.failed': ['Unable to play', '無法播放'],
    'player.paused': ['Playback paused', '播放已暫停'],
    'player.resume': ['Click Stop playback, then Start playback again.', '請點「停止播放」後再點「開始播放」。'],
    'raw': ['{value}', '{value}'],
    'guide.title': ['Device setup | LAN Speaker', '設定播放裝置｜區網喇叭'],
    'guide.heading': ["Play your computer's audio on another device", '讓另一台裝置播放電腦聲音'],
    'guide.lead': ['The computer server is running. Follow these three steps to listen on a phone, tablet, or another computer.', '電腦端已啟動。照下面三步，讓手機、平板或另一台電腦播放目前的聲音。'],
    'guide.prepHeading': ['First-time setup checklist', '第一次使用前，先確認環境'],
    'guide.prepServer': ['The Windows computer hosts the server. It needs Python 3.10 or later, a working default audio output, and a writable program folder. Internet access is needed to install packages on the first run.', '這台 Windows 電腦是區網伺服器：需有 Python 3.10 以上、可用的預設聲音輸出裝置，以及可寫入的程式資料夾。首次啟動需連網安裝套件。'],
    'guide.prepBrowser': ['Double-click start.bat in File Explorer and keep its window open. The receiving device needs a browser with Web Audio and WebSocket support, and a local network connection to the computer.', '請從檔案總管雙擊 start.bat，並保持 BAT 視窗開啟；接收裝置使用支援 Web Audio 與 WebSocket 的瀏覽器，和電腦位於能互連的同一區網。'],
    'guide.prepFirewall': ["If the receiving device times out, a computer administrator may need to allow incoming LAN connections to the current TCP port. The troubleshooting buttons below can help you ask ChatGPT for guidance.", '若接收裝置連線逾時，電腦管理員可能需允許目前 TCP port 的區網輸入連線；下方可按症狀請 ChatGPT 協助檢查。'],
    'guide.prepSecurity': ['This website has no sign-in or encryption. Use a trusted local network and do not forward its port to the internet. See FIRST_USE.md in the program folder for the full checklist.', '網站沒有登入或加密，請只在可信任的區網使用，不要設定路由器的對外 port 轉發。環境準備清單見程式資料夾 README.zh-TW.md。'],
    'guide.receiverHeading': ['On the receiving device', '在接收裝置上操作'],
    'guide.stepNetwork': ['Connect your phone, tablet, or other computer to a local network that can reach this computer.', '讓手機、平板或另一台電腦與這台電腦位於可互連的同一區網。'],
    'guide.stepBrowser': ['Open a browser on that device and enter this address:', '在接收裝置開啟瀏覽器，輸入下面的網址：'],
    'guide.stepPlay': ['Click Start playback on the player page, keep it open, and adjust the device and page volume.', '在播放頁點「開始播放」，保持網頁開啟，並調整接收裝置與網頁的音量。'],
    'guide.loadingAddress': ['Finding local network addresses…', '正在取得區網網址…'],
    'guide.noAddress': ['No local network IPv4 address was found.', '找不到可用的區網 IPv4 位址'],
    'guide.addressFailed': ['Unable to get the address. Refresh this page.', '無法取得區網網址，請重新整理此頁。'],
    'guide.copy': ['Copy address', '複製網址'],
    'guide.copied': ['Copied', '已複製'],
    'guide.copyFallback': ['Select the address above to copy it.', '請選取上方網址複製'],
    'guide.audioHeading': ['Computer audio status', '電腦端狀態'],
    'guide.checkingAudio': ['Checking the audio source…', '正在檢查聲音來源…'],
    'guide.audioNote': ["The computer's own audio continues playing. You may hear an echo if both devices are audible.", '這台電腦原本的聲音會繼續播放。兩台裝置同時出聲時，可能聽到些微回音。'],
    'guide.captureError': ['Audio capture failed: {error}', '聲音擷取失敗：{error}'],
    'guide.ready': ['Ready: {device}', '準備就緒：{device}'],
    'guide.offline': ['Server unavailable. Check the BAT window.', '服務未連線，請查看 BAT 視窗。'],
    'guide.faq': ['Troubleshooting', '常見問題排除'],
    'guide.expand': ['Expand', '展開'],
    'guide.collapse': ['Collapse', '收合'],
    'guide.faqIntro': ['First open the player address above on the computer, then choose the matching situation. This page collects local network and firewall information to include in your question to ChatGPT.', '引導頁已開啟。先在電腦點開上方的播放網址，依結果選一個情況。頁面會先讀取這台電腦的網路與防火牆狀態，一起交給 ChatGPT 判斷。'],
    'diag.loading': ['Reading local diagnostics…', '正在讀取本機診斷資訊…'],
    'diag.partial': ['Program information is ready. Windows network details are unavailable; ChatGPT can guide you to collect them.', '已取得程式資訊；Windows 網路資訊暫時讀不到，ChatGPT 會引導補查。'],
    'diag.ready': ['Local network profile and firewall rule information is ready.', '已取得這台電腦的網路設定檔與防火牆規則資訊。'],
    'diag.failed': ['Local diagnostics are unavailable. ChatGPT can guide you to collect them.', '本機診斷資訊暫時讀不到；ChatGPT 會引導你補查。'],
    'diag.wait': ['Diagnostics are still loading. Please click again in a moment.', '診斷資訊仍在讀取，請稍後再點一次。'],
    'guide.timeoutHeading': ['The receiving device cannot open the player page', '接收裝置的播放頁連線逾時／打不開'],
    'guide.timeoutHint': ['Try the player address on the computer first, then choose the result below.', '先看電腦能不能開啟上方的播放網址，再選符合的情況。'],
    'guide.receiverTimeout': ['Computer opens it; receiving device times out ↗', '電腦能開，接收裝置逾時 ↗'],
    'guide.bothTimeout': ['Neither device can open it ↗', '兩台裝置都打不開 ↗'],
    'guide.noSoundHeading': ['The player opens, but the receiving device has no sound', '播放頁能開，但接收裝置沒有聲音'],
    'guide.noSound': ['Ask ChatGPT about missing audio ↗', '請 ChatGPT 排查沒聲音 ↗'],
    'guide.disclosure': ['ChatGPT provides written guidance and cannot inspect or change your devices. Clicking a button sends diagnostic information in the ChatGPT URL, which may include local IP addresses, program paths, network profiles, and firewall rules. Review and send the conversation yourself.', 'ChatGPT 會根據資料引導你操作，無法直接查看或修改你的裝置。按鈕會把診斷資料（可能包含區網 IP、程式路徑、網路設定檔與防火牆規則）放進網址，開啟時即傳給 ChatGPT；對話仍由你確認後送出。'],
    'guide.footer': ['Close the BAT window or press Ctrl+C there to stop the server. This website has no sign-in; use it only on a trusted local network. For offline instructions, see USER_GUIDE.md in the program folder.', '關閉 BAT 視窗或在視窗按 Ctrl+C 可停止服務。這個網站沒有登入驗證，只適合在可信任的區網使用。完整中文手冊見程式資料夾 README.zh-TW.md。'],
    'unknown': ['Not available', '未取得'],
    'none': ['None reported', '無'],
    'diag.fallback': ['Local network and firewall diagnostics could not be read. Please guide me to collect the information you need.', '本機網路和防火牆診斷暫時無法讀取；請給我可直接照做的步驟取得需要的資料。'],
    'diag.url': ['Player address: {value}', '目前播放網址：{value}'],
    'diag.port': ['TCP port used by the program: {value}', '程式使用的 TCP port：{value}'],
    'diag.status': ['Computer audio status: {value}', '電腦端狀態：{value}'],
    'diag.path': ['Program folder on the Windows computer: {value}', 'Windows 電腦上的程式資料夾：{value}'],
    'diag.bind': ['Configured bind address (not an OS listener inspection): {value}', '程式設定的綁定位址（非作業系統監聽檢查結果）：{value}'],
    'diag.urls': ['Candidate player addresses (not all verified): {value}', '程式列出的候選播放網址（尚未全部驗證）：{value}'],
    'diag.device': ['Audio output device: {value}', '音訊裝置：{value}'],
    'diag.audioError': ['Audio error: {value}', '音訊錯誤：{value}'],
    'diag.profiles': ['Windows network profiles: {value}', 'Windows 網路設定檔：{value}'],
    'diag.firewall': ["Program's named firewall rule: {value}", '本程式具名防火牆規則：{value}'],
    'diag.rule': ['Enabled={enabled}; direction={direction}; action={action}; profiles={profile}; protocol={protocol}; local port={localPort}; source={remoteAddress}', '啟用={enabled}，方向={direction}，動作={action}，設定檔={profile}，協定={protocol}，本機 port={localPort}，來源={remoteAddress}'],
    'diag.noRule': ["No active-store rule with one of this program's usual names was found. Other rules may still apply.", '找不到本程式慣用名稱的作用中防火牆規則；可能仍有其他規則。'],
    'case.receiver.observation': ['Selected symptom: the Windows computer can open the LAN player address shown in the guide, but the receiving device times out. The exact error text has not been provided.', '我選擇的現象是：Windows 電腦能開啟引導頁上顯示的區網播放網址，但接收裝置開啟該網址時逾時。完整錯誤文字尚未提供。'],
    'case.receiver.request': ['Guide me to find why the receiving device cannot connect. Use evidence to check the address, both network connections, Windows Firewall, and client isolation. The cause is not yet established.', '請引導我找出接收裝置無法連入的原因。可依證據檢查網址、兩端網路、Windows 防火牆與裝置隔離；目前還不能確定是哪一項造成。'],
    'case.both.observation': ['Selected symptom: neither the Windows computer nor the receiving device can open the LAN player address, but the setup guide itself opens. The exact error text has not been provided.', '我選擇的現象是：Windows 電腦和接收裝置都打不開引導頁上顯示的區網播放網址，但這個引導頁本身可以開啟。完整錯誤文字尚未提供。'],
    'case.both.request': ['Guide me to find why the LAN player address does not open. A working local setup guide does not establish that the LAN IP, player address, or network route is correct.', '請引導我找出區網播放網址無法開啟的原因。注意本機引導頁可以開啟，不代表電腦的區網 IP、播放網址或網路路徑已確認正確。'],
    'case.audio.observation': ['Selected symptom: the player page opens on the receiving device, but no computer audio can be heard. Whether Start playback was pressed, both volumes, active computer audio, and stream connection status have not been checked.', '我選擇的現象是：接收裝置能開啟播放頁，但目前聽不到電腦聲音。是否已按「開始播放」、兩端音量、電腦是否正在播聲及播放頁連線狀態，都尚未確認。'],
    'case.audio.request': ['Guide me to find the cause of the missing audio. Start with simple playback and volume checks, then use the results to investigate the audio source, browser playback, or stream.', '請引導我找出沒有聲音的原因，先用簡單操作確認播放與音量，再根據結果判斷聲音來源、瀏覽器播放或串流問題。'],
    'prompt.role': ['Please guide me in English, one step at a time, to troubleshoot LAN Speaker. Your role is remote written guidance: you only know this prompt and my later replies. You cannot view or operate my devices, and you have no project files or previous conversation.', '請用繁體中文逐步引導我排除「區網喇叭」問題。你的角色是遠端文字指導：只知道本提問與我之後的回覆，無法查看或操作我的裝置，也沒有專案檔案或先前對話。'],
    'prompt.about': ['LAN Speaker is the name of this custom program. It copies audio playing on a Windows computer and sends it over the local network to a phone, tablet, or another computer. The receiving device opens the Windows computer\'s address in a browser and clicks Start playback to use its speakers; the original computer audio continues. start.bat launches the Python web server; no dedicated receiving app is needed. It uses aiohttp, HTTP, WebSocket, and Web Audio. Use this description, without assuming another similarly named product or undocumented features or settings.', '「區網喇叭」是這個自製程式的名稱：它把一台 Windows 電腦正在播放的聲音複製，透過區域網路傳給手機、平板或另一台電腦。接收裝置用瀏覽器開啟 Windows 電腦提供的網址，按「開始播放」，就能用該裝置的喇叭播放；Windows 原本的聲音仍會保留。電腦端由 start.bat 啟動 Python 網頁伺服器，接收端不用安裝專用 App。技術上使用 aiohttp、HTTP、WebSocket 與 Web Audio。請依這個描述協助排除，不要套用其他同名產品的操作方式或猜測未提供的功能與設定。'],
    'prompt.problem': ['Problem I need help with:', '我要協助排除的問題：'],
    'prompt.data': ['Data reported by the program:', '程式自動回報的資料：'],
    'prompt.limits': ['Data limits: this is one reading by the program. The firewall check covers usual rule names only, not other rules, application isolation, or third-party protection. An Allow rule does not prove connectivity. The program path is for guiding my actions; you cannot read it.', '資料限制：這只是程式本次讀到的結果；防火牆只查慣用名稱，未涵蓋其他規則、應用隔離或第三方防護，有允許規則不代表連線已通。程式路徑供引導我操作，你無法讀取該路徑。'],
    'prompt.unknown': ['Still unknown: receiving OS and browser, exact error or playback state, actual network, guest Wi-Fi/VPN use, and prior configuration. Do not assume the devices can already communicate or that I know how to find these details.', '仍未知的資訊：接收裝置系統與瀏覽器、完整錯誤或播放狀態、實際網路、訪客網路／VPN 和先前設定。不要假設兩端已可互通，或我知道如何查看這些資訊。'],
    'prompt.method': ['Choose one useful next step from the known facts. Ask for missing information only when needed and explain where to find it. State which device to use, exactly what to do, and what result to report; wait for my reply. Confirm the OS before giving settings paths. Provide complete copyable commands, where to run them, whether administrator access is needed, and which output to return. Separate facts from guesses. Do not list a whole checklist or claim you performed actions. Explain the reason and impact before firewall changes; allow only the required TCP port and LAN sources, without disabling the whole firewall.', '請如何引導：依已知現象選一個下一步，必要時才問缺少的資訊，並教我去哪裡查看。每次寫清楚「在哪台裝置、怎麼操作、回報什麼」，等我回覆再繼續。先確認系統再給設定路徑；指令須可直接複製，說明貼在哪裡、是否需管理員權限及要回報哪段輸出。區分事實與推測，別一次列整套清單或聲稱已替我操作。調整防火牆前先解釋原因與影響，只開必要的 TCP port 與區網來源，不要要求關閉整個防火牆。']
  };
  const storageKey = 'lan-speaker.language';
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  const requested = new URL(location.href).searchParams.get('lang');
  let language = ['en', 'zh'].includes(requested) ? requested : ['en', 'zh'].includes(saved) ? saved : 'en';
  function t(key, values = {}) {
    const entry = messages[key];
    if (!entry) throw new Error(`Missing translation: ${key}`);
    return entry[language === 'zh' ? 1 : 0].replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
  }
  function apply() {
    document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-expanded]').forEach(node => {
      node.dataset.expandLabel = t('guide.expand');
      node.dataset.collapseLabel = t('guide.collapse');
    });
    const titleKey = document.documentElement.dataset.pageTitle;
    if (titleKey) document.title = t(titleKey);
    document.querySelectorAll('[data-language-select]').forEach(node => { node.value = language; });
  }
  function setLanguage(value) {
    if (!['en', 'zh'].includes(value)) return;
    language = value;
    try { localStorage.setItem(storageKey, language); } catch (_) {}
    try { const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url); } catch (_) {}
    apply();
    window.dispatchEvent(new Event('languagechange'));
  }
  function errorText(value) {
    if (value === 'No default Windows output device found') return t('audio.noOutput');
    if (value.startsWith('No loopback capture for ')) return t('audio.noLoopback', {device: value.slice(24)});
    return value;
  }
  window.I18n = {t, errorText, setLanguage, get language() { return language; }};
  document.querySelectorAll('[data-language-select]').forEach(node => node.addEventListener('change', () => setLanguage(node.value)));
  if (requested === 'en' || requested === 'zh') { try { localStorage.setItem(storageKey, language); } catch (_) {} }
  apply();
})();
