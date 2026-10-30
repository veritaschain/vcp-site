// Site navigation only. The reviewed Explorer bundles and verification remain unchanged.
(() => {
  function updateDocsLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (/^https:\/\/docs\.veritaschain\.org\/?$/.test(link.getAttribute('href'))) {
        link.setAttribute('href', '/vcp/explorer-api/');
      }
    });
  }
  updateDocsLinks();
  new MutationObserver(updateDocsLinks).observe(document.getElementById('root'), {
    childList: true,
    subtree: true,
  });
})();
