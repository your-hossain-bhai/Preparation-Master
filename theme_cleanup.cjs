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
  
  // Gradients
  content = content.replace(/from-emerald-[3456]00/g, 'from-blue-900');
  content = content.replace(/to-emerald-[3456]00/g, 'to-blue-800');
  content = content.replace(/via-emerald-[3456]00\/?[0-9]*/g, 'via-blue-800');
  
  content = content.replace(/from-teal-[3456]00/g, 'from-blue-900');
  content = content.replace(/to-teal-[3456]00/g, 'to-blue-800');
  
  content = content.replace(/from-blue-900 to-emerald-400/g, 'from-blue-900 to-blue-600');
  
  content = content.replace(/from-\[#00362c\]\/90 via-\[#002b24\] to-\[#001f1a\]/g, 'from-blue-50 via-white to-slate-50');
  content = content.replace(/from-\[#003d34\] to-\[#002b24\]/g, 'from-blue-50 to-slate-50');
  
  content = content.replace(/shadow-amber-900\/30/g, 'shadow-blue-900/20');
  content = content.replace(/shadow-amber-900\/40/g, 'shadow-blue-900/20');
  
  content = content.replace(/bg-gradient-to-r from-amber-900\/90 via-amber-950 to-amber-900\/90/g, 'bg-blue-50');
  
  // Update LandingPageView.tsx leftovers
  content = content.replace(/bg-\[#003d34\]\/80/g, 'bg-white');
  content = content.replace(/bg-\[#001f1a\]/g, 'bg-white');
  
  // A few more cleanups
  content = content.replace(/text-slate-950/g, 'text-white'); // assuming on buttons
  content = content.replace(/border-blue-900\/40/g, 'border-slate-200');
  content = content.replace(/border-blue-900\/30/g, 'border-slate-200');
  content = content.replace(/border-blue-900\/60/g, 'border-slate-200');
  content = content.replace(/border-blue-900\/20/g, 'border-slate-200');
  
  content = content.replace(/bg-gradient-to-r from-blue-900\/30 via-blue-800 to-blue-800\/30/g, 'bg-blue-50');
  content = content.replace(/bg-gradient-to-r from-blue-900\/20 via-blue-800 to-teal-500\/20/g, 'bg-blue-50');
  content = content.replace(/bg-gradient-to-r from-blue-900\/20 to-teal-500\/20/g, 'bg-blue-50');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
