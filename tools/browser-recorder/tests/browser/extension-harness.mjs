// Helpers for actual extension action popups in temporary test profiles.
// Chrome APIs are exercised through CDP; no browser API mocks are installed.
import assert from 'node:assert/strict';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function until(probe, message) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    const result = await probe();
    if (result) return result;
    await sleep(25);
  }
  throw Error('Timed out: ' + message);
}

export async function openExtensionAction({ cdp, source, extensionId }) {
  await source.bringToFront();
  const tabs = await cdp.send('Target.getTargets', { filter: [{ type: 'tab', exclude: false }] });
  const tab = tabs.targetInfos.find(target => target.url === source.url());
  assert.ok(tab, 'source tab target exists');
  await cdp.send('Extensions.triggerAction', { id: extensionId, targetId: tab.targetId });
  const popup = await until(async () => (await cdp.send('Target.getTargets')).targetInfos.find(
    target => target.url === `chrome-extension://${extensionId}/popup.html`), 'extension action popup');
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: popup.targetId, flatten: false });
  let sequence = 1;
  const raw = (method, params = {}) => new Promise((resolve, reject) => {
    const id = sequence++;
    const cleanup = () => { clearTimeout(timer); cdp.off('Target.receivedMessageFromTarget', listener); };
    const listener = event => {
      if (event.sessionId !== sessionId) return;
      const value = JSON.parse(event.message);
      if (value.id !== id) return;
      cleanup();
      value.error ? reject(Error(JSON.stringify(value.error))) : resolve(value.result);
    };
    const timer = setTimeout(() => { cleanup(); reject(Error('Popup CDP request timed out')); }, 10000);
    cdp.on('Target.receivedMessageFromTarget', listener);
    cdp.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id, method, params }) })
      .catch(error => { cleanup(); reject(error); });
  });
  const evaluate = async expression => {
    const value = await raw('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (value.exceptionDetails) throw Error(JSON.stringify(value.exceptionDetails));
    return value.result.value;
  };
  await until(() => evaluate("document.readyState === 'complete' && !!document.querySelector('#capture')"), 'popup ready');
  return { evaluate, raw, close: () => cdp.send('Target.closeTarget', { targetId: popup.targetId }) };
}

export async function capture(popup) {
  await popup.evaluate("document.querySelector('#capture').click()");
  await until(() => popup.evaluate("!document.querySelector('#capture').disabled"), 'capture completed');
  return popup.evaluate("({status:document.querySelector('#status').textContent,preview:document.querySelector('#preview').textContent,hidden:document.querySelector('#draft').hidden,disabled:document.querySelector('#save').disabled})");
}

export async function save(popup) {
  await popup.evaluate("document.querySelector('#consent').click();document.querySelector('#save').click()");
  await until(() => popup.evaluate("!document.querySelector('#capture').disabled"), 'save completed');
  assert.match(await popup.evaluate("document.querySelector('#status').textContent"), /保存しました/);
}
