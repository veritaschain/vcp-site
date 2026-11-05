// Serialized into Chrome's ISOLATED world: keep every helper inside the function.
// This is a light-DOM observation, not attested page or provider content.
export function captureSelection({ structuredResult = false } = {}) {
  // An exception inside executeScript may leave result undefined in Chrome.
  // Carry the user-facing rejection across the injection boundary explicitly.
  if (structuredResult) {
    try { return { ok: true, observation: captureSelection() }; }
    catch (error) { return { ok: false, error: String(error.message || '選択範囲を読み取れません。') }; }
  }
  const editError = '入力欄・編集領域を含む選択は保存対象外です。回答の本文だけを選択してください。';
  const treeError = '埋め込み・Shadow DOMなどの対応外領域を含む選択は取得できません。';
  if (!['http:', 'https:'].includes(location.protocol)) throw Error('HTTP/HTTPSページで使用してください。');
  if (document.designMode.toLowerCase() === 'on') throw Error(editError);
  const selected = window.getSelection();
  if (!selected || selected.isCollapsed || selected.rangeCount !== 1)
    throw Error('保存したい回答のテキストを先に選択してください。');
  const range = selected.getRangeAt(0);

  // Endpoints inside a shadow root are unsupported even when getRangeAt() is
  // re-scoped by the browser. Closed roots cannot be enumerated from light DOM.
  for (const node of [selected.anchorNode, selected.focusNode,
    range.startContainer, range.endContainer, range.commonAncestorContainer]) {
    if (!node || node.getRootNode() !== document) throw Error(treeError);
  }
  if (typeof selected.getComposedRanges === 'function') {
    const composed = selected.getComposedRanges();
    if (composed.length !== 1 || composed[0].startContainer !== range.startContainer ||
      composed[0].startOffset !== range.startOffset || composed[0].endContainer !== range.endContainer ||
      composed[0].endOffset !== range.endOffset) throw Error(treeError);
  }

  function checkElement(element) {
    // Check editing hosts, not only the endpoint's effective editability. A
    // contenteditable=false island within an editor is conservatively excluded.
    const editable = element.getAttribute('contenteditable');
    if (element.matches('input,textarea') || element.isContentEditable ||
      (editable !== null && ['', 'true', 'plaintext-only'].includes(editable.toLowerCase())))
      throw Error(editError);
    if (element.shadowRoot || element.matches('iframe,frame,object,embed')) throw Error(treeError);
  }
  for (const node of [range.startContainer, range.endContainer]) {
    for (let element = node.nodeType === 1 ? node : node.parentElement; element; element = element.parentElement)
      checkElement(element);
  }

  // Checking endpoints alone misses an editor between two ordinary text nodes.
  // Only inspect descendants that intersect the selected Range; nearby editors
  // outside the selection must not prevent capturing an ordinary answer.
  const root = range.commonAncestorContainer;
  const scope = root.nodeType === 1 || root.nodeType === 9 ? root : root.parentElement;
  // FILTER_REJECT prunes unselected subtrees. The budget counts only selected
  // descendants, not unrelated content elsewhere under the common ancestor.
  // Flat unselected siblings still need an intersection check, but cannot
  // exhaust the selected-element budget. Ancestors were checked above.
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT, {
    acceptNode: element => range.intersectsNode(element)
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  let scanned = 0;
  for (let element = walker.nextNode(); element; element = walker.nextNode()) {
    if (++scanned > 20000) throw Error('確認するDOMが多すぎます。選択範囲を狭くしてください。');
    checkElement(element);
  }
  const text = selected.toString();
  if (!text.trim() || new TextEncoder().encode(text).length > 32768)
    throw Error('選択範囲を32 KB以内にしてください。');
  return { origin: location.origin, text };
}
