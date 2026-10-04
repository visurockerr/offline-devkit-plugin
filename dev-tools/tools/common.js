// Shared helpers for all tool pages.
(function () {
  // Toast
  let toastEl = document.querySelector('.copied-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'copied-toast';
    document.body.appendChild(toastEl);
  }
  let toastTimer;
  window.showToast = function (msg) {
    toastEl.textContent = msg || 'Copied!';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1400);
  };

  // Copy text to clipboard with fallback
  window.copyText = async function (text, msg) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
    }
    showToast(msg || 'Copied!');
  };
})();
