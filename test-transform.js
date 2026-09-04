const fs = require('fs');
let content = '<div className="min-h-screen bg-[#002b24] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-[#002b24] app-container">';
function processClassString(clsStr) {
  let classes = clsStr.split(/\s+/);
  classes = classes.map(c => c === 'bg-[#002b24]' ? 'bg-slate-50' : c);
  return classes.join(' ');
}
content = content.replace(/className="([^"]+)"/g, (match, classes) => {
  return `className="${processClassString(classes)}"`;
});
console.log(content);
