const adjectives = ['swift','brave','calm','clever','bright','bold','gentle','keen','lucky','mellow','nimble','quiet','rapid','shiny','sturdy','witty','cosmic','golden','silent','frosty'];
const nouns = ['otter','falcon','maple','harbor','comet','lantern','pixel','cedar','meadow','ember','willow','quartz','breeze','summit','orchid','badger','raven','sparrow','basil','onyx'];
const verbs = ['add','update','improve','cleanup','polish','rework','tweak','enable','simplify','optimize'];

const output = document.getElementById('output');
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const rand = n => Math.floor(Math.random() * n);

function generate() {
  const type = document.getElementById('type').value;
  const sep = document.getElementById('sep').value;
  const addTicket = document.getElementById('ticket').checked;

  const parts = [pick(verbs), pick(adjectives), pick(nouns)];
  let slug = parts.join(sep);
  if (addTicket) {
    const projects = ['JIRA','DEV','PROJ','TASK','BUG'];
    slug = pick(projects) + '-' + (100 + rand(9900)) + sep + slug;
  }
  const name = type ? type + '/' + slug : slug;
  output.textContent = name;
}

document.getElementById('genBtn').onclick = generate;
document.getElementById('copyBtn').onclick = () => {
  if (output.textContent) copyText(output.textContent);
};
generate();
