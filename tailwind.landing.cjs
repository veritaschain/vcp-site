// Default-theme landing pages only. Pages with custom runtime configuration
// must use a matching build configuration before they can join this list.
module.exports = {
  content: [
    './vap/index.html', './vap/ja/index.html', './vap/zh/index.html',
    './what-is-vcp/index.html', './what-is-vcp/ja/index.html', './what-is-vcp/zh/index.html',
    './certified/index.html', './certified/ja/index.html', './certified/zh/index.html',
    './use-cases/index.html', './use-cases/ja/index.html', './use-cases/zh/index.html',
    './assets/js/*.js'
  ],
  theme: { extend: {} },
  plugins: []
};
