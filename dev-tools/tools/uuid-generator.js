const output = document.getElementById('output');

function uuidv4() {
  // Prefer the native crypto API when available.
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0,4).join('')}-${hex.slice(4,6).join('')}-${hex.slice(6,8).join('')}-${hex.slice(8,10).join('')}-${hex.slice(10,16).join('')}`;
}

function generate() {
  const count = Math.min(Math.max(parseInt(document.getElementById('count').value, 10) || 1, 1), 1000);
  const upper = document.getElementById('uppercase').checked;
  const braces = document.getElementById('braces').checked;
  const list = [];
  for (let i = 0; i < count; i++) {
    let id = uuidv4();
    if (upper) id = id.toUpperCase();
    if (braces) id = '{' + id + '}';
    list.push(id);
  }
  output.textContent = list.join('\n');
}

document.getElementById('genBtn').onclick = generate;
document.getElementById('copyBtn').onclick = () => {
  if (output.textContent) copyText(output.textContent);
};
generate();
