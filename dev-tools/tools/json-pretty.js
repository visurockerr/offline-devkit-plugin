const input = document.getElementById('input');
const output = document.getElementById('output');
const error = document.getElementById('error');
let lastPlain = '';

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Colorize a formatted JSON string into HTML spans.
function colorize(json) {
  const esc = escapeHtml(json);
  return esc.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string';
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

function getIndent() {
  const v = document.getElementById('indent').value;
  return v === 'tab' ? '\t' : parseInt(v, 10);
}

function format(minify) {
  error.textContent = '';
  const raw = input.value.trim();
  if (!raw) { output.innerHTML = ''; lastPlain = ''; return; }
  try {
    const obj = JSON.parse(raw);
    if (minify) {
      lastPlain = JSON.stringify(obj);
      output.textContent = lastPlain;
    } else {
      lastPlain = JSON.stringify(obj, null, getIndent());
      output.innerHTML = colorize(lastPlain);
    }
  } catch (e) {
    output.innerHTML = '';
    lastPlain = '';
    error.textContent = 'Invalid JSON: ' + e.message;
  }
}

document.getElementById('formatBtn').onclick = () => format(false);
document.getElementById('minifyBtn').onclick = () => format(true);
document.getElementById('clearBtn').onclick = () => {
  input.value = ''; output.innerHTML = ''; error.textContent = ''; lastPlain = '';
};
document.getElementById('copyBtn').onclick = () => { if (lastPlain) copyText(lastPlain); };
document.getElementById('indent').onchange = () => { if (lastPlain) format(false); };
