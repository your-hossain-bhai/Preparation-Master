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
  
  content = content.replace(/text-cyan-200/g, 'text-cyan-800');
  content = content.replace(/bg-cyan-500\/20/g, 'bg-cyan-50');
  content = content.replace(/border-cyan-400\/40/g, 'border-cyan-200');
  content = content.replace(/bg-cyan-400 text-slate-900/g, 'bg-cyan-100 text-cyan-800');
  
  content = content.replace(/text-purple-200/g, 'text-purple-800');
  content = content.replace(/bg-purple-500\/20/g, 'bg-purple-50');
  content = content.replace(/border-purple-400\/40/g, 'border-purple-200');
  content = content.replace(/bg-purple-400 text-slate-900/g, 'bg-purple-100 text-purple-800');
  
  content = content.replace(/text-indigo-200/g, 'text-indigo-800');
  content = content.replace(/bg-indigo-500\/20/g, 'bg-indigo-50');
  content = content.replace(/border-indigo-400\/40/g, 'border-indigo-200');
  content = content.replace(/bg-indigo-400 text-slate-900/g, 'bg-indigo-100 text-indigo-800');
  
  content = content.replace(/text-blue-200/g, 'text-blue-800');
  content = content.replace(/bg-blue-500\/20/g, 'bg-blue-50');
  content = content.replace(/border-blue-400\/40/g, 'border-blue-200');
  content = content.replace(/bg-blue-400 text-slate-900/g, 'bg-blue-100 text-blue-800');
  
  content = content.replace(/text-pink-200/g, 'text-pink-800');
  content = content.replace(/bg-pink-500\/20/g, 'bg-pink-50');
  content = content.replace(/border-pink-400\/40/g, 'border-pink-200');
  content = content.replace(/bg-pink-400 text-slate-900/g, 'bg-pink-100 text-pink-800');

  // Any stray blue-900/20 in here
  content = content.replace(/bg-blue-900\/20/g, 'bg-blue-50');
  content = content.replace(/bg-blue-900 text-slate-900/g, 'bg-blue-100 text-blue-800');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
