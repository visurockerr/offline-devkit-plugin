const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/'
};
const AMBIG = /[0O l1I|]/g;

const lenSlider = document.getElementById('length');
const lenLabel = document.getElementById('lenLabel');
const output = document.getElementById('output');
const error = document.getElementById('error');
const strength = document.getElementById('strength');

lenSlider.addEventListener('input', () => lenLabel.textContent = lenSlider.value);

// Unbiased random index using crypto.
function randIndex(max) {
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  const buf = new Uint32Array(1);
  let x;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % max;
}

function generate() {
  error.textContent = '';
  let pool = '';
  const picked = [];
  if (document.getElementById('lower').checked) { pool += SETS.lower; picked.push(SETS.lower); }
  if (document.getElementById('upper').checked) { pool += SETS.upper; picked.push(SETS.upper); }
  if (document.getElementById('digits').checked) { pool += SETS.digits; picked.push(SETS.digits); }
  if (document.getElementById('symbols').checked) { pool += SETS.symbols; picked.push(SETS.symbols); }

  if (document.getElementById('noAmbig').checked) {
    pool = pool.replace(AMBIG, '');
  }
  if (!pool) {
    output.textContent = '';
    strength.textContent = '';
    error.textContent = 'Select at least one character set.';
    return;
  }

  const len = parseInt(lenSlider.value, 10);
  const chars = [];
  // Guarantee at least one char from each selected set (when it fits).
  for (const set of picked) {
    let s = document.getElementById('noAmbig').checked ? set.replace(AMBIG, '') : set;
    if (s && chars.length < len) chars.push(s[randIndex(s.length)]);
  }
  while (chars.length < len) chars.push(pool[randIndex(pool.length)]);
  // Shuffle (Fisher-Yates).
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const pw = chars.join('');
  output.textContent = pw;
  showStrength(pw, pool.length);
}

function showStrength(pw, poolSize) {
  const bits = Math.round(pw.length * Math.log2(poolSize || 1));
  let label = 'Weak', color = 'var(--red)';
  if (bits >= 128) { label = 'Very strong'; color = 'var(--green)'; }
  else if (bits >= 80) { label = 'Strong'; color = 'var(--green)'; }
  else if (bits >= 60) { label = 'Good'; color = 'var(--yellow)'; }
  else if (bits >= 40) { label = 'Fair'; color = 'var(--yellow)'; }
  strength.innerHTML = 'Entropy: ~' + bits + ' bits — <span style="color:' + color + '">' + label + '</span>';
}

document.getElementById('genBtn').onclick = generate;
document.getElementById('copyBtn').onclick = () => { if (output.textContent) copyText(output.textContent); };
generate();
