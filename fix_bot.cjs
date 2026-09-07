const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('src/components/StudyBotView.tsx', 'utf8');

// Fix placeholder
content = content.replace(/placeholder-emerald-200\/40/g, 'placeholder-slate-400');

// Add glow to input
content = content.replace(/focus:border-blue-900 focus:outline-none shadow-sm/g, 'focus:border-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-900/10 shadow-sm transition-all');

// Fix Send icon color
content = content.replace(/<Send className="w-4 h-4 text-slate-900" \/>/g, '<Send className="w-4 h-4 text-white" />');
content = content.replace(/<Loader2 className="w-4 h-4 animate-spin text-slate-900" \/>/g, '<Loader2 className="w-4 h-4 animate-spin text-white" />');

fs.writeFileSync('src/components/StudyBotView.tsx', content, 'utf8');
console.log("Done");
