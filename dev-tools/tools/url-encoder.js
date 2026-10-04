const input = document.getElementById('input');
const output = document.getElementById('output');
const error = document.getElementById('error');
const component = document.getElementById('component');

function run(mode) {
  error.textContent = '';
  const text = input.value;
  try {
    if (mode === 'encode') {
      output.textContent = component.checked
        ? encodeURIComponent(text)
        : encodeURI(text);
    } else {
      output.textContent = component.checked
        ? decodeURIComponent(text)
        : decodeURI(text);
    }
  } catch (e) {
    output.textContent = '';
    error.textContent = 'Error: ' + e.message;
  }
}

document.getElementById('encodeBtn').onclick = () => run('encode');
document.getElementById('decodeBtn').onclick = () => run('decode');
document.getElementById('swapBtn').onclick = () => {
  input.value = output.textContent;
  output.textContent = '';
};
document.getElementById('clearBtn').onclick = () => {
  input.value = ''; output.textContent = ''; error.textContent = '';
};
document.getElementById('copyBtn').onclick = () => copyText(output.textContent);
