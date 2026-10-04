const input = document.getElementById('input');
const output = document.getElementById('output');
const error = document.getElementById('error');

/* ---------- JSON -> YAML ---------- */
function needsQuote(s) {
  if (s === '') return true;
  if (/^[\s]|[\s]$/.test(s)) return true;
  if (/[:#\[\]{}&*!|>'"%@`,]/.test(s)) return true;
  if (/^(true|false|null|yes|no|on|off|~)$/i.test(s)) return true;
  if (/^[-?]?\d/.test(s) && /^-?\d+(\.\d+)?$/.test(s)) return true; // looks numeric
  return false;
}
function scalarToYaml(v) {
  if (v === null) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  const s = String(v);
  return needsQuote(s) ? JSON.stringify(s) : s;
}
function jsonToYaml(value, indent) {
  indent = indent || 0;
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return pad + '[]';
    return value.map(item => {
      if (item !== null && typeof item === 'object') {
        const nested = jsonToYaml(item, indent + 1).replace(/^\s+/, '');
        return pad + '- ' + nested;
      }
      return pad + '- ' + scalarToYaml(item);
    }).join('\n');
  }
  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return pad + '{}';
    return keys.map(k => {
      const v = value[k];
      const key = needsQuote(k) ? JSON.stringify(k) : k;
      if (v !== null && typeof v === 'object' && (Array.isArray(v) ? v.length : Object.keys(v).length)) {
        return pad + key + ':\n' + jsonToYaml(v, indent + 1);
      }
      if (v !== null && typeof v === 'object') {
        return pad + key + ': ' + (Array.isArray(v) ? '[]' : '{}');
      }
      return pad + key + ': ' + scalarToYaml(v);
    }).join('\n');
  }
  return pad + scalarToYaml(value);
}

/* ---------- YAML -> JSON (minimal parser) ---------- */
function parseScalar(s) {
  s = s.trim();
  if (s === '' ) return '';
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    try { return JSON.parse(s.replace(/^'/, '"').replace(/'$/, '"')); }
    catch { return s.slice(1, -1); }
  }
  if (/^(null|~)$/i.test(s)) return null;
  if (/^(true|yes|on)$/i.test(s)) return true;
  if (/^(false|no|off)$/i.test(s)) return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  if (s === '[]') return [];
  if (s === '{}') return {};
  return s;
}

function yamlToJson(text) {
  const rawLines = text.replace(/\t/g, '  ').split('\n')
    .filter(l => l.trim() !== '' && !/^\s*#/.test(l));

  let pos = 0;
  function indentOf(line) { return line.match(/^ */)[0].length; }

  function parseBlock(minIndent) {
    // Decide list vs map by first line at this indent.
    const first = rawLines[pos];
    const curIndent = indentOf(first);
    const isList = /^\s*-\s?/.test(first);
    if (isList) {
      const arr = [];
      while (pos < rawLines.length) {
        const line = rawLines[pos];
        const ind = indentOf(line);
        if (ind < curIndent) break;
        if (ind > curIndent || !/^\s*-\s?/.test(line)) break;
        const after = line.slice(ind + 1).replace(/^\s/, '');
        pos++;
        if (after === '') {
          arr.push(parseBlock(curIndent + 1));
        } else if (/^[^:\s][^:]*:(\s|$)/.test(after) || after.includes(': ')) {
          // inline "key: value" starting a map item
          pos--; // reprocess, but treat remaining of line as a map entry
          rawLines[pos] = ' '.repeat(curIndent + 2) + after;
          arr.push(parseBlock(curIndent + 2));
        } else {
          arr.push(parseScalar(after));
        }
      }
      return arr;
    } else {
      const obj = {};
      while (pos < rawLines.length) {
        const line = rawLines[pos];
        const ind = indentOf(line);
        if (ind < curIndent) break;
        if (ind > curIndent) break;
        if (/^\s*-\s?/.test(line)) break;
        const m = line.slice(ind).match(/^("(?:[^"\\]|\\.)*"|'[^']*'|[^:]+):(.*)$/);
        if (!m) { pos++; continue; }
        let key = m[1].trim();
        key = (key.startsWith('"') || key.startsWith("'")) ? parseScalar(key) : key;
        const rest = m[2].trim();
        pos++;
        if (rest === '') {
          if (pos < rawLines.length && indentOf(rawLines[pos]) > curIndent) {
            obj[key] = parseBlock(curIndent + 1);
          } else {
            obj[key] = null;
          }
        } else {
          obj[key] = parseScalar(rest);
        }
      }
      return obj;
    }
  }

  if (rawLines.length === 0) return null;
  return parseBlock(indentOf(rawLines[0]));
}

function toYaml() {
  error.textContent = '';
  try {
    const obj = JSON.parse(input.value);
    output.value = jsonToYaml(obj);
  } catch (e) {
    output.value = '';
    error.textContent = 'Invalid JSON: ' + e.message;
  }
}
function toJson() {
  error.textContent = '';
  try {
    const obj = yamlToJson(input.value);
    output.value = JSON.stringify(obj, null, 2);
  } catch (e) {
    output.value = '';
    error.textContent = 'Could not parse YAML: ' + e.message;
  }
}

document.getElementById('toYaml').onclick = toYaml;
document.getElementById('toJson').onclick = toJson;
document.getElementById('copyBtn').onclick = () => { if (output.value) copyText(output.value); };
document.getElementById('clearBtn').onclick = () => {
  input.value = ''; output.value = ''; error.textContent = '';
};
