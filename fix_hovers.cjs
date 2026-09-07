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
  
  content = content.replace(/hover:text-white/g, 'hover:text-slate-900');
  content = content.replace(/hover:bg-white\/[0-9]+/g, 'hover:bg-slate-50');
  content = content.replace(/bg-white\/[0-9]+/g, 'bg-white');
  content = content.replace(/border-white\/[0-9]+/g, 'border-slate-200');
  content = content.replace(/text-slate-500\/[0-9]+/g, 'text-slate-500');
  content = content.replace(/text-slate-300/g, 'text-slate-500');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
