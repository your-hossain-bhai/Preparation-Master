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
  
  // Rose
  content = content.replace(/bg-rose-500\/20/g, 'bg-rose-50');
  content = content.replace(/bg-rose-500\/30/g, 'bg-rose-100');
  content = content.replace(/border-rose-[45]00\/[0-9]+/g, 'border-rose-200');
  content = content.replace(/text-rose-[123]00/g, 'text-rose-700');
  content = content.replace(/text-rose-400/g, 'text-rose-600');
  content = content.replace(/bg-rose-400 text-slate-900/g, 'bg-rose-100 text-rose-800');
  
  // Other old colors in StudyPlannerView.tsx 
  // e.g. text-teal-200, bg-teal-500/20, text-emerald-200
  content = content.replace(/bg-slate-500\/20/g, 'bg-slate-50');
  content = content.replace(/border-slate-400\/40/g, 'border-slate-200');
  content = content.replace(/text-slate-200/g, 'text-slate-600');
  content = content.replace(/bg-slate-400 text-slate-900/g, 'bg-slate-200 text-slate-800');
  
  content = content.replace(/bg-teal-500\/20/g, 'bg-teal-50');
  content = content.replace(/text-teal-200/g, 'text-teal-700');
  content = content.replace(/border-teal-400\/[0-9]+/g, 'border-teal-200');
  content = content.replace(/bg-teal-400 text-slate-900/g, 'bg-teal-100 text-teal-800');
  
  content = content.replace(/bg-orange-500\/20/g, 'bg-orange-50');
  content = content.replace(/text-orange-200/g, 'text-orange-700');
  content = content.replace(/border-orange-400\/[0-9]+/g, 'border-orange-200');
  content = content.replace(/bg-orange-400 text-slate-900/g, 'bg-orange-100 text-orange-800');

  // StudyBotView text-rose-300
  content = content.replace(/bg-rose-500 text-slate-900/g, 'bg-rose-500 text-white'); // trash icon badge
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
