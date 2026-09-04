const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processClassString(clsStr) {
  // We have a list of classes, let's map them
  let classes = clsStr.split(/\s+/);
  
  // Rules
  // 1. App background
  classes = classes.map(c => c === 'bg-[#002b24]' ? 'bg-slate-50' : c);
  // 2. Containers / Cards
  const containerBgs = ['bg-[#003d34]', 'bg-[#00231d]', 'bg-[#00332a]', 'bg-white/5', 'bg-white/10', 'bg-white/20', 'bg-black/20', 'bg-black/30', 'bg-black/40', 'bg-[#00231d]/90', 'bg-[#002b24]/90'];
  classes = classes.map(c => containerBgs.includes(c) ? 'bg-white' : c);
  // Remove backdrop-blur if bg is solid white now
  classes = classes.filter(c => !c.startsWith('backdrop-blur'));
  
  // Borders
  const borderColors = ['border-white/10', 'border-white/15', 'border-white/20', 'border-emerald-500/30', 'border-emerald-400/30', 'border-emerald-500/40', 'border-emerald-400/50', 'border-white/10'];
  classes = classes.map(c => borderColors.includes(c) ? 'border-slate-200' : c);
  
  // Shadows
  // if bg-white and has border, ensure shadow-sm
  if (classes.includes('bg-white') && classes.some(c => c.startsWith('border'))) {
    if (!classes.some(c => c.startsWith('shadow'))) {
       classes.push('shadow-sm');
    }
  }

  // Typography
  // if button and bg is blue-900, text must be white
  let hasPrimaryBg = classes.some(c => ['bg-emerald-500', 'bg-emerald-600', 'bg-blue-900', 'bg-slate-900'].includes(c));
  let hasSecondaryBg = classes.some(c => ['bg-amber-400', 'bg-amber-500', 'bg-orange-500'].includes(c));
  
  classes = classes.map(c => {
    if (['text-[#002b24]', 'text-emerald-950'].includes(c)) return 'text-white';
    
    if (c === 'text-white') return hasPrimaryBg || hasSecondaryBg ? 'text-white' : 'text-slate-900';
    if (c === 'text-slate-200' || c === 'text-emerald-100') return 'text-slate-900';
    if (c.startsWith('text-emerald-') || c.startsWith('text-slate-400')) return 'text-slate-500';
    
    return c;
  });

  // Buttons & Accents
  classes = classes.map(c => {
    if (c === 'bg-emerald-500') return 'bg-blue-900';
    if (c === 'hover:bg-emerald-400') return 'hover:bg-blue-800';
    if (c === 'bg-emerald-600') return 'bg-blue-900';
    
    if (c === 'text-amber-300' || c === 'text-amber-400') return 'text-orange-500';
    if (c === 'bg-amber-400' || c === 'bg-amber-500') return 'bg-orange-500';
    if (c === 'hover:bg-amber-300' || c === 'hover:bg-amber-400') return 'hover:bg-orange-600';
    
    return c;
  });

  // Input fields bg
  // We can't easily detect input just from classes, but if it has focus:border-amber-400, change to focus:border-blue-900
  classes = classes.map(c => {
    if (c === 'focus:border-amber-400') return 'focus:border-blue-900';
    return c;
  });

  return classes.join(' ');
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace className="<classes>"
  content = content.replace(/className="([^"]+)"/g, (match, classes) => {
    return `className="${processClassString(classes)}"`;
  });
  
  // Replace class string literals in backticks className={`...`}
  content = content.replace(/className=\{`([^`]+)`\}/g, (match, classes) => {
    // This is trickier because of ${} interpolations, but let's try a simple approach
    // We split by ${...} keeping them intact, process the rest
    let parts = classes.split(/(\$\{[^}]+\})/);
    let newParts = parts.map(p => p.startsWith('${') ? p : processClassString(p));
    return `className={\`${newParts.join('')}\`}`;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
