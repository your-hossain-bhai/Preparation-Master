const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/placeholder-emerald-300\/40/g, 'placeholder-slate-400');
  content = content.replace(/hover:bg-white\/10/g, 'hover:bg-slate-50');
  content = content.replace(/text-emerald-200/g, 'text-slate-500');
  content = content.replace(/text-emerald-[2345]00\/[0-9]+/g, 'text-slate-500');
  content = content.replace(/hover:text-emerald-[2345]00/g, 'hover:text-slate-900');
  content = content.replace(/bg-emerald-400/g, 'bg-blue-900');
  content = content.replace(/shadow-emerald-[90]+0\/[0-9]+/g, 'shadow-blue-900/20');
  content = content.replace(/text-amber-200/g, 'text-slate-500');
  content = content.replace(/border-teal-[3456]00\/[0-9]+/g, 'border-slate-200');
  content = content.replace(/bg-teal-[3456]00/g, 'bg-blue-900');
  content = content.replace(/fill-emerald-500\/[0-9]+/g, 'fill-slate-200');
  content = content.replace(/text-teal-200/g, 'text-slate-500');
  content = content.replace(/text-orange-200/g, 'text-slate-500');
  content = content.replace(/border-orange-400\/[0-9]+/g, 'border-slate-200');
  content = content.replace(/bg-orange-[3456]00/g, 'bg-blue-900');
  content = content.replace(/bg-gradient-to-r from-blue-900\/20 via-orange-500\/20 to-red-500\/20/g, 'bg-slate-50');
  content = content.replace(/bg-emerald-600\/30/g, 'bg-slate-200');
  content = content.replace(/bg-emerald-950\/[0-9]+/g, 'bg-blue-900');
  content = content.replace(/text-emerald-[34]00/g, 'text-white'); // assuming on dark bg or generally
  content = content.replace(/selection:bg-emerald-[789]00/g, 'selection:bg-blue-900');
  content = content.replace(/fill-amber-[345]00/g, 'fill-blue-900 text-blue-900');
  
  // Specific fix for text-white turning to text-slate-900 in some places that it shouldn't
  content = content.replace(/bg-slate-500\/30 border-emerald-400 text-emerald-200 font-bold/g, 'bg-blue-50 border-blue-900 text-blue-900 font-bold');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
