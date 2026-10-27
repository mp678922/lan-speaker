const {t} = I18n;
const urlLink = document.getElementById('receiverUrl');
const otherUrls = document.getElementById('otherUrls');
const status = document.getElementById('status');
const dot = document.getElementById('dot');
const diagnosticsStatus = document.getElementById('diagnosticsStatus');
const copy = document.getElementById('copy');
let addresses = [], addressError = false, addressesLoaded = false;
let healthData = null, healthFailed = false;
let primaryUrl = '', currentPort = '', machineDiagnostics = null, diagnosticsReady = false;
let diagnosticStatusKey = 'diag.loading', copyKey = 'guide.copy';

function languageUrl(value) {
  const url = new URL(value);
  if (I18n.hasExplicitLanguage) url.searchParams.set('lang', I18n.language);
  else url.searchParams.delete('lang');
  return url.toString();
}

function renderAddresses() {
  otherUrls.replaceChildren();
  primaryUrl = addresses.length ? languageUrl(addresses[0]) : '';
  urlLink.textContent = addressError ? t('guide.addressFailed') : primaryUrl || t(addressesLoaded ? 'guide.noAddress' : 'guide.loadingAddress');
  if (primaryUrl && !addressError) urlLink.href = primaryUrl;
  else urlLink.removeAttribute('href');
  for (const address of addresses.slice(1)) {
    const li = document.createElement('li'), link = document.createElement('a');
    link.href = languageUrl(address);
    link.textContent = link.href;
    li.append(link);
    otherUrls.append(li);
  }
  otherUrls.hidden = otherUrls.children.length === 0;
}

function renderStatus() {
  status.textContent = healthFailed ? t('guide.offline') : !healthData ? t('guide.checkingAudio') :
    healthData.error ? t('guide.captureError', {error: I18n.errorText(healthData.error)}) :
    healthData.device ? t('guide.ready', {device: healthData.device}) : t('player.finding');
  dot.className = 'dot ' + (healthFailed || healthData?.error ? 'error' : healthData?.device ? 'ready' : '');
}

async function loadAddresses() {
  try {
    const response = await fetch('/guide-data', {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (Number.isInteger(data.port) && data.port > 0 && data.port <= 65535) currentPort = data.port;
    addresses = data.urls;
    addressesLoaded = true;
    addressError = false;
  } catch (_) { addressError = true; }
  renderAddresses();
}

async function loadStatus() {
  try {
    const response = await fetch('/health', {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    healthData = await response.json();
    healthFailed = false;
  } catch (_) { healthFailed = true; }
  renderStatus();
}

async function loadDiagnostics() {
  diagnosticsReady = false;
  diagnosticStatusKey = 'diag.loading';
  diagnosticsStatus.textContent = t(diagnosticStatusKey);
  try {
    const response = await fetch('/diagnostics', {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    machineDiagnostics = await response.json();
    diagnosticStatusKey = machineDiagnostics.windowsNetwork?.error ? 'diag.partial' : 'diag.ready';
  } catch (_) { machineDiagnostics = null; diagnosticStatusKey = 'diag.failed'; }
  diagnosticsReady = true;
  diagnosticsStatus.textContent = t(diagnosticStatusKey);
}

copy.addEventListener('click', async () => {
  if (!primaryUrl || addressError) return;
  try {
    await navigator.clipboard.writeText(primaryUrl);
    copyKey = 'guide.copied';
    setTimeout(() => { copyKey = 'guide.copy'; copy.textContent = t(copyKey); }, 2000);
  } catch (_) { copyKey = 'guide.copyFallback'; }
  copy.textContent = t(copyKey);
});

const supportCases = {'receiver-timeout': 'receiver', 'both-timeout': 'both', 'no-sound': 'audio'};
function diagnosticSummary() {
  const data = machineDiagnostics;
  if (!data) return [
    t('diag.url', {value: primaryUrl || t('unknown')}),
    t('diag.port', {value: currentPort || t('unknown')}),
    t('diag.status', {value: status.textContent}), t('diag.fallback')
  ].join('\n');
  const network = data.windowsNetwork || {};
  const profiles = (network.networkProfiles || []).map(item => `${item.interface}: ${item.category}`).join('; ') || t('unknown');
  const ruleText = network.error || (network.namedFirewallRule ? t('diag.rule', network.namedFirewallRule) : t('diag.noRule'));
  return [
    t('diag.path', {value: data.projectPath}), t('diag.bind', {value: data.bind}),
    t('diag.port', {value: data.port}), t('diag.urls', {value: (data.urls || []).slice(0, 5).join(', ') || t('unknown')}),
    t('diag.device', {value: data.audioDevice || t('unknown')}), t('diag.audioError', {value: data.audioError || t('none')}),
    t('diag.profiles', {value: profiles}), t('diag.firewall', {value: ruleText})
  ].join('\n');
}

function buildSupportQuestion(caseKey) {
  const scenario = supportCases[caseKey];
  return [t('prompt.role'), t('prompt.about'),
    `${t('prompt.problem')}\n${t(`case.${scenario}.observation`)}\n${t(`case.${scenario}.request`)}`,
    `${t('prompt.data')}\n${diagnosticSummary()}`,
    t('prompt.limits'), t('prompt.unknown'), t('prompt.method')].join('\n\n');
}

document.querySelectorAll('[data-support-case]').forEach(link => {
  link.addEventListener('click', event => {
    if (!diagnosticsReady) {
      event.preventDefault();
      diagnosticStatusKey = 'diag.wait';
      diagnosticsStatus.textContent = t(diagnosticStatusKey);
      return;
    }
    const url = new URL('https://chatgpt.com/');
    url.searchParams.set('q', buildSupportQuestion(link.dataset.supportCase));
    url.searchParams.set('no_universal_links', '1');
    link.href = url.toString();
  });
});

window.addEventListener('languagechange', () => {
  renderAddresses(); renderStatus();
  diagnosticsStatus.textContent = t(diagnosticStatusKey);
  copy.textContent = t(copyKey);
});
document.getElementById('troubleshooting').addEventListener('toggle', event => {
  if (event.target.open) loadDiagnostics();
});
loadAddresses(); loadStatus(); loadDiagnostics();
setInterval(loadAddresses, 5000);
setInterval(loadStatus, 5000);
