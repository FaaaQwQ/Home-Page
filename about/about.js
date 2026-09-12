'use strict';
const output = document.getElementById('output');
const input = document.getElementById('command');
const terminal = document.getElementById('terminal');
const loading = document.getElementById('loading');
const commandForm = document.getElementById('command-form');
const cursor = document.getElementById('cursor');
const cursorMeasure = document.getElementById('cursor-measure');
function syncCursor() {
  cursorMeasure.textContent = input.value.slice(0, input.selectionStart || 0);
  const left = cursorMeasure.getBoundingClientRect().width - input.scrollLeft;
  cursor.style.left = left + 'px';
  cursor.hidden = input.selectionStart !== input.selectionEnd || left < 0;
}
for (const event of ['input', 'keyup', 'click', 'select', 'scroll', 'focus']) {
  input.addEventListener(event, () => requestAnimationFrame(syncCursor));
}
window.addEventListener('resize', syncCursor);
const commandHistory = [];
let historyIndex = 0;
const pendingRows = [];
let printTimer = null;
const lineDelay = 280;
function setPrinting(active) {
  input.disabled = active;
  loading.hidden = !active;
  commandForm.classList.toggle('printing', active);
  output.setAttribute('aria-busy', String(active));
  if (!active) { input.focus({preventScroll: true}); syncCursor(); }
}
function printNextLine() {
  const next = pendingRows.shift();
  if (!next) { printTimer = null; setPrinting(false); return; }
  renderRow(...next);
  commandForm.scrollIntoView({block:'nearest'});
  printTimer = setTimeout(printNextLine, lineDelay);
}
function row(text, label, kind = 'system', field) {
  pendingRows.push([text, label, kind, field]);
  setPrinting(true);
  if (printTimer === null) {
    loading.hidden = false;
    printTimer = setTimeout(printNextLine, 1000);
  }
}
function renderRow(text, label, kind, field) {
  const line = document.createElement('div');
  line.className = 'row';
  for (const [value, color] of [[label, kind], [field, 'info']]) {
    if (!value) continue;
    const tag = document.createElement('span');
    tag.className = 'tag ' + color;
    tag.textContent = value;
    line.append(tag);
  }
  line.append(document.createTextNode(text));
  output.append(line);
}
function intro() {
  row('cd /About', 'System');
  row('Thanks for your visit, let me introduce myself.', 'System');
  const time = new Date().toLocaleTimeString('en-GB', {hour12:false});
  for (const [label, value] of [
    ['Name:', '钟林文晗 / ZLWH'],
    ['Education:', "Master's student in Industrial Engineering, South China University of Technology"],
    ['Focus:', 'AI, Machine Vision & Smart Manufacturing'],
    ['Experience:', '3D printing defect detection, visual data collection & mechanical design'],
    ['Email:', 'zl_13362017991@163.com']
  ]) row(value, time, 'time', label);
  row('Real Problems. Practical Solutions.', 'Done', 'success');
  row('Type "help" to see available commands.', 'System');
  row('Type "clear" to clear the terminal screen.', 'System');
  row('Type "exit" to return to the homepage.', 'System');
}
const commands = {
  help() { for (const [cmd, text] of Object.entries({intro:'Introduce myself again.',skill:'Show my skills.',projects:'Show selected projects.',contact:'Show my contact information.',clear:'Clear the terminal screen.',exit:'Return to the homepage.',date:'Display the current date and time.',whoami:'Display my name.',history:'Display command history.',echo:'Echo the text after the command.',help:'Show available commands.'})) row(text,cmd,'success'); },
  intro,
  about: intro,
  skill() { row('Machine vision: visual acquisition, defect datasets, YOLO detection and model evaluation.', 'Skill','success'); row('Mechanical design: 3D modeling, assembly verification and printer structures.', 'Skill','success'); row('AI applications: exploring diagnostic and decision-support agents for manufacturing.', 'Focus','info'); },
  projects() { row('3D Printing Defect Detection — visual data collection, defect recognition and evaluation.', 'Project','success'); row('YOLOv10 Detection System — applying object detection to 3D printing quality inspection.', 'Project','success'); row('Data Dashboard — presenting project data and results.', 'Project','success'); },
  contact() { row('zl_13362017991@163.com','Email','info'); },
  clear() {
    clearTimeout(printTimer);
    printTimer = null;
    pendingRows.length = 0;
    output.replaceChildren();
    setPrinting(false);
  },
  exit() { location.href = '../index.html#about-return'; },
  date() { row(new Date().toLocaleString()); },
  whoami() { row('钟林文晗 / ZLWH'); },
  history() { commandHistory.forEach((cmd,i)=>row(`${i+1}  ${cmd}`)); },
  echo(args) { row(args); }
};
document.getElementById('command-form').addEventListener('submit', e => {
  e.preventDefault();
  if (input.disabled) return;
  const value = input.value.trim();
  input.value = '';
  if (!value) return;
  commandHistory.push(value); historyIndex = commandHistory.length;
  renderRow('➜ About ' + value);
  const [name] = value.split(/\s+/);
  if (Object.hasOwn(commands,name.toLowerCase())) commands[name.toLowerCase()](value.slice(name.length).trim());
  else row(`Command not found: ${name}. Type "help" to see available commands.`, 'Error','error');
  input.scrollIntoView({block:'nearest'});
});
input.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    historyIndex = Math.max(0,Math.min(commandHistory.length,historyIndex+(e.key === 'ArrowUp' ? -1 : 1)));
    input.value = commandHistory[historyIndex] || '';
  }
  if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); commands.clear(); }
});
document.querySelector('.yellow').addEventListener('click',()=>terminal.classList.toggle('minimized'));
document.querySelector('.green').addEventListener('click',()=>{terminal.classList.remove('minimized');input.focus();});
intro();
