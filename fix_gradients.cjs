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
  
  // QuizConfigView.tsx - daily challenge
  content = content.replace(/bg-gradient-to-r from-blue-900\/20 via-blue-800 to-blue-800\/20/g, 'bg-gradient-to-r from-blue-50 via-white to-slate-50');
  
  // QuizResultsView.tsx
  content = content.replace(/bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-800 text-slate-900/g, 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-800 text-white');
  
  // StudyReminderModal.tsx
  content = content.replace(/bg-gradient-to-r from-blue-900\/20 to-blue-800\/20/g, 'bg-slate-50');
  
  // Leaderboard.tsx podiums
  content = content.replace(/bg-gradient-to-b from-blue-900\/20 to-emerald-900\/90 border-blue-900\/50/g, 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200');
  content = content.replace(/bg-gradient-to-b from-slate-400\/15 to-emerald-950\/90 border-slate-300\/30/g, 'bg-gradient-to-b from-slate-50 to-slate-200 border-slate-300');
  content = content.replace(/bg-gradient-to-b from-amber-700\/20 to-emerald-950\/90 border-slate-200/g, 'bg-gradient-to-b from-orange-50/50 to-orange-100/50 border-orange-200');
  // Wait, in leaderboard we have rank 1, 2, 3. 
  // Rank 1 was amber/gold, rank 2 silver, rank 3 bronze.
  // 1st: gold (amber/yellow) -> let's make it yellow/orange light. bg-gradient-to-b from-amber-50 to-amber-100 border-amber-200
  // 2nd: silver (slate/gray) -> bg-gradient-to-b from-slate-50 to-slate-200 border-slate-300
  // 3rd: bronze (orange/amber darker) -> bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
