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
  
  // Base background is already bg-slate-50, but let's make sure
  content = content.replace(/bg-orange-500/g, 'bg-blue-900');
  content = content.replace(/text-orange-500/g, 'text-blue-900');
  content = content.replace(/text-orange-600/g, 'text-blue-900');
  content = content.replace(/border-orange-500/g, 'border-blue-900');
  content = content.replace(/ring-orange-500/g, 'ring-blue-900');
  content = content.replace(/bg-orange-50/g, 'bg-blue-50');
  content = content.replace(/bg-orange-100/g, 'bg-blue-100');
  content = content.replace(/hover:bg-orange-600/g, 'hover:bg-blue-800');
  content = content.replace(/hover:bg-orange-500/g, 'hover:bg-blue-800');
  
  // Replace emerald/teal leftovers
  content = content.replace(/bg-emerald-50/g, 'bg-slate-50');
  content = content.replace(/bg-emerald-100/g, 'bg-slate-100');
  content = content.replace(/bg-emerald-500/g, 'bg-blue-900');
  content = content.replace(/text-emerald-700/g, 'text-blue-900');
  content = content.replace(/text-emerald-900/g, 'text-blue-900');
  content = content.replace(/border-emerald-200/g, 'border-slate-200');
  content = content.replace(/border-emerald-500/g, 'border-blue-900');
  content = content.replace(/ring-emerald-500/g, 'ring-blue-900');
  content = content.replace(/hover:bg-emerald-400/g, 'hover:bg-blue-800');
  content = content.replace(/hover:bg-emerald-500/g, 'hover:bg-blue-800');

  // Any remaining amber
  content = content.replace(/text-amber-300/g, 'text-blue-900');
  content = content.replace(/text-amber-400/g, 'text-blue-900');
  content = content.replace(/text-amber-500/g, 'text-blue-900');
  content = content.replace(/text-amber-600/g, 'text-blue-900');
  
  content = content.replace(/bg-amber-300/g, 'bg-blue-900');
  content = content.replace(/bg-amber-400/g, 'bg-blue-900');
  content = content.replace(/bg-amber-500/g, 'bg-blue-900');
  content = content.replace(/bg-amber-600/g, 'bg-blue-900');
  
  content = content.replace(/border-amber-300/g, 'border-blue-900');
  content = content.replace(/border-amber-400/g, 'border-blue-900');
  content = content.replace(/border-amber-500/g, 'border-blue-900');
  
  // Handle border-amber-400/40 or similar
  content = content.replace(/border-amber-[3456]00\/[0-9]+/g, 'border-blue-900/20');
  content = content.replace(/border-emerald-[3456]00\/[0-9]+/g, 'border-blue-900/20');
  
  content = content.replace(/ring-amber-400/g, 'ring-blue-900');
  content = content.replace(/shadow-amber-900\/40/g, 'shadow-blue-900/20');
  
  content = content.replace(/from-amber-[3456]00/g, 'from-blue-900');
  content = content.replace(/to-amber-[3456]00/g, 'to-blue-800');
  content = content.replace(/via-amber-[3456]00/g, 'via-blue-800');
  
  content = content.replace(/from-blue-50 via-slate-50 to-orange-50/g, 'from-slate-50 via-white to-slate-50');
  
  content = content.replace(/bg-\[#003d34\]\/80/g, 'bg-white');
  content = content.replace(/bg-\[#001f1a\]/g, 'bg-white');
  
  content = content.replace(/shadow-\[0_0_10px_rgba\(251,191,36,0\.6\)\]/g, 'shadow-[0_0_10px_rgba(30,58,138,0.3)]'); // blue glow
  
  // Typography updates
  content = content.replace(/text-slate-600/g, 'text-slate-500'); 
  content = content.replace(/text-slate-700/g, 'text-slate-900');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
