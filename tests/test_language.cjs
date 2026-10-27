/* Run with node tests/test_language.cjs. Uses actual page scripts with browser API stubs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

const report = {
  projectPath: 'D:\\Speaker', port: 38471, bind: '0.0.0.0',
  urls: ['http://192.168.1.20:38471/'], audioDevice: 'Speakers', audioError: '',
  windowsNetwork: {networkProfiles: [{interface: 'Wi-Fi', category: 'Public'}],
    namedFirewallRule: {enabled: 'True', direction: 'Inbound', action: 'Allow', profile: 'Public',
      protocol: 'TCP', localPort: '38471', remoteAddress: 'LocalSubnet'}}
};

function browser(page, {query = '', storage = new Map(), blockedStorage = false} = {}) {
  const html = fs.readFileSync(path.join(root, 'web', `${page}.html`), 'utf8');
  const nodes = [], ids = new Map(), events = {}, sockets = [];
  const painter = new Proxy({}, {get: (_, name) => name === 'createRadialGradient' ?
    () => ({addColorStop() {}}) : () => {}});
  function makeNode(tag, attrs = {}) {
    const handlers = {};
    const node = {tag, attrs, textContent: '', children: [], dataset: {}, value: '',
      clientWidth: 400, clientHeight: 200,
      addEventListener(name, handler) {(handlers[name] ||= []).push(handler);},
      async fire(name, extra = {}) {for (const fn of handlers[name] || []) await fn({target: node, currentTarget: node, ...extra});},
      setAttribute(name, value) {attrs[name] = value;}, removeAttribute(name) {delete attrs[name];},
      replaceChildren() {this.children = [];}, append(child) {this.children.push(child);},
      getBoundingClientRect() {return {width: 400, height: 200};}, getContext() {return painter;}
    };
    for (const [name, value] of Object.entries(attrs)) {
      if (name.startsWith('data-')) node.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
      else node[name] = value;
    }
    nodes.push(node);
    if (node.id) ids.set(node.id, node);
    return node;
  }
  for (const match of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/gi)) {
    const attrs = {};
    for (const attr of match[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[attr[1]] = attr[2] ?? '';
    makeNode(match[1], attrs);
  }
  ids.get('volume') && (ids.get('volume').value = '100');
  const document = {
    documentElement: nodes.find(node => node.tag === 'html'), title: '', hidden: false,
    getElementById: id => {assert(ids.has(id), `Missing element ${id}`); return ids.get(id);},
    querySelectorAll: selector => nodes.filter(node => Object.hasOwn(node.attrs, selector.slice(1, -1))),
    createElement: tag => makeNode(tag), addEventListener() {}
  };
  let audioContexts = 0;
  class AudioContext {
    constructor() {audioContexts++; this.state = 'running'; this.destination = {}; this.currentTime = 0; this.sampleRate = 48000;}
    createGain() {return {gain: {value: 1}, connect() {}};}
    createAnalyser() {return {frequencyBinCount: 1024, connect() {}, getByteFrequencyData() {}};}
    createBuffer(channels, frames, rate) {return {duration: frames / rate, getChannelData: () => new Float32Array(frames)};}
    createBufferSource() {return {connect() {}, start() {}};}
    async resume() {this.state = 'running';}
    async close() {this.state = 'closed';}
  }
  class WebSocket {
    static CLOSING = 2;
    constructor(url) {this.url = url; this.readyState = 0; sockets.push(this);}
    close() {this.readyState = 3;}
  }
  const location = new URL(`http://127.0.0.1:38471/${page === 'guide' ? 'guide' : ''}${query}`);
  const context = {
    document, location, URL, Event: class {constructor(type) {this.type = type;}},
    localStorage: {getItem(key) {if (blockedStorage) throw Error('denied'); return storage.get(key) || null;},
      setItem(key, value) {if (blockedStorage) throw Error('denied'); storage.set(key, value);}},
    history: {replaceState(_, __, value) {location.href = value.toString();}},
    navigator: {clipboard: {writeText: async () => {}}},
    fetch: async path => ({ok: true, json: async () => path === '/guide-data' ? {port: report.port, urls: report.urls} :
      path === '/health' ? {device: report.audioDevice, error: ''} : report}),
    addEventListener(name, fn) {(events[name] ||= []).push(fn);},
    dispatchEvent(event) {for (const fn of events[event.type] || []) fn(event);},
    setInterval() {}, setTimeout() {}, clearTimeout() {},
    matchMedia: () => ({matches: false}), devicePixelRatio: 1,
    requestAnimationFrame: () => 1, cancelAnimationFrame() {}, AudioContext, WebSocket
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'web/i18n.js'), 'utf8'), context);
  if (page === 'guide') vm.runInContext(fs.readFileSync(path.join(root, 'web/guide.js'), 'utf8'), context);
  else vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  return {context, document, ids, sockets, storage, get audioContexts() {return audioContexts;}};
}

(async () => {
  const guide = browser('guide');
  await new Promise(setImmediate);
  assert.equal(guide.context.I18n.language, 'en');
  assert.equal(guide.document.documentElement.lang, 'en');
  assert.match(guide.document.title, /Device setup/);
  assert.match(guide.ids.get('status').textContent, /Ready: Speakers/);
  assert.match(guide.ids.get('receiverUrl').href, /lang=en/);
  assert(!Object.hasOwn(guide.ids.get('troubleshooting').attrs, 'open'));
  for (const language of ['zh', 'en']) {
    guide.context.I18n.setLanguage(language);
    assert.match(guide.ids.get('receiverUrl').href, new RegExp(`lang=${language}`));
    for (const link of guide.document.querySelectorAll('[data-support-case]')) {
      await link.fire('click', {preventDefault() {throw Error('Diagnostics did not finish');}});
      const prompt = new URL(link.href).searchParams.get('q');
      assert(prompt.includes(language === 'zh' ? '遠端文字指導' : 'remote written guidance'));
      assert(prompt.includes('LocalSubnet'));
      assert(prompt.includes(language === 'zh' ? '仍未知的資訊' : 'Still unknown'));
      if (language === 'en') assert(!/[\u3400-\u9fff]/.test(prompt));
    }
  }
  guide.context.I18n.setLanguage('zh');
  assert.equal(browser('guide', {storage: guide.storage}).context.I18n.language, 'zh');
  assert.equal(browser('guide', {storage: guide.storage, query: '?lang=en'}).context.I18n.language, 'en');
  assert.equal(browser('guide', {blockedStorage: true}).context.I18n.language, 'en');
  const player = browser('index');
  assert.equal(player.ids.get('toggle').textContent, 'Start playback');
  await player.ids.get('toggle').fire('click');
  assert.equal(player.sockets.length, 1);
  const socket = player.sockets[0];
  socket.readyState = 1; socket.onopen();
  socket.onmessage({data: new Int16Array(3840).buffer});
  assert.equal(player.ids.get('state').textContent, 'Playing');
  player.context.I18n.setLanguage('zh');
  assert.equal(player.ids.get('state').textContent, '正在播放');
  assert.equal(player.ids.get('toggle').textContent, '停止播放');
  assert.equal(player.audioContexts, 1);
  assert.equal(player.sockets.length, 1);
  assert.equal(socket.readyState, 1);
  socket.onmessage({data: JSON.stringify({error: 'No default Windows output device found'})});
  assert.equal(player.ids.get('detail').textContent, '找不到 Windows 預設聲音輸出裝置');
  player.context.I18n.setLanguage('en');
  assert.equal(player.ids.get('detail').textContent, 'No default Windows output device found');
  await player.ids.get('toggle').fire('click');
  assert.equal(player.ids.get('state').textContent, 'Stopped');
  console.log('PASS: English default, saved/query language, bilingual prompts and status, and switching language during playback.');
})().catch(error => {console.error(error); process.exitCode = 1;});
