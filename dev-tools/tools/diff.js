const escapeHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// Longest Common Subsequence over lines -> edit script.
function diffLines(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ t: 'eq', l: a[i], r: b[j] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: 'del', l: a[i] }); i++; }
    else { ops.push({ t: 'add', r: b[j] }); j++; }
  }
  while (i < n) { ops.push({ t: 'del', l: a[i++] }); }
  while (j < m) { ops.push({ t: 'add', r: b[j++] }); }
  return ops;
}

function render() {
  const ignoreWs = document.getElementById('ignoreWs').checked;
  const norm = s => ignoreWs ? s.trim() : s;
  let left = document.getElementById('left').value.split('\n');
  let right = document.getElementById('right').value.split('\n');

  const ops = diffLines(left.map(norm), right.map(norm));

  // Re-map normalized lines back to originals for display.
  let li = 0, ri = 0, added = 0, removed = 0;
  const leftHtml = [], rightHtml = [];
  for (const op of ops) {
    if (op.t === 'eq') {
      leftHtml.push('<span class="diff-line">' + escapeHtml(left[li++]) + '</span>');
      rightHtml.push('<span class="diff-line">' + escapeHtml(right[ri++]) + '</span>');
    } else if (op.t === 'del') {
      leftHtml.push('<span class="diff-line diff-removed">' + escapeHtml(left[li++]) + '</span>');
      rightHtml.push('<span class="diff-line">&nbsp;</span>');
      removed++;
    } else {
      leftHtml.push('<span class="diff-line">&nbsp;</span>');
      rightHtml.push('<span class="diff-line diff-added">' + escapeHtml(right[ri++]) + '</span>');
      added++;
    }
  }

  document.getElementById('outLeft').innerHTML = leftHtml.join('');
  document.getElementById('outRight').innerHTML = rightHtml.join('');
  const summary = document.getElementById('summary');
  if (added === 0 && removed === 0) {
    summary.textContent = 'The two texts are identical' + (ignoreWs ? ' (ignoring whitespace).' : '.');
  } else {
    summary.innerHTML = '<span style="color:var(--green)">+' + added + ' added</span> &nbsp; <span style="color:var(--red)">-' + removed + ' removed</span>';
  }
}

document.getElementById('compareBtn').onclick = render;
document.getElementById('clearBtn').onclick = () => {
  document.getElementById('left').value = '';
  document.getElementById('right').value = '';
  document.getElementById('outLeft').innerHTML = '';
  document.getElementById('outRight').innerHTML = '';
  document.getElementById('summary').textContent = '';
};
