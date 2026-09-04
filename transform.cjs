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
  let classes = clsStr.split(/\s+/);
  
  classes = classes.map(c => c === 'bg-[#002b24]' ? 'bg-slate-50' : c);
  const containerBgs = ['bg-[#003d34]', 'bg-[#00231d]', 'bg-[#00332a]', 'bg-[#00231d]/90', 'bg-[#002b24]/90', 'bg-white/5', 'bg-white/10', 'bg-white/20', 'bg-black/20', 'bg-black/30', 'bg-black/40', 'bg-black/50'];
  classes = classes.map(c => containerBgs.includes(c) ? 'bg-white' : c);
  
  classes = classes.filter(c => !c.startsWith('backdrop-blur'));
  
  const borderColors = ['border-white/10', 'border-white/15', 'border-white/20', 'border-emerald-500/30', 'border-emerald-400/30', 'border-emerald-500/40', 'border-emerald-400/50'];
  classes = classes.map(c => borderColors.includes(c) ? 'border-slate-200' : c);
  
  if (classes.includes('bg-white') && classes.some(c => c.startsWith('border'))) {
    if (!classes.some(c => c.startsWith('shadow'))) {
       classes.push('shadow-sm');
    }
  }

  let hasPrimaryBg = classes.some(c => ['bg-emerald-500', 'bg-emerald-600', 'bg-blue-900', 'bg-slate-900', 'bg-blue-800'].includes(c));
  let hasSecondaryBg = classes.some(c => ['bg-amber-400', 'bg-amber-500', 'bg-orange-500', 'bg-orange-600', 'from-amber-400', 'from-amber-500'].includes(c));
  
  classes = classes.map(c => {
    if (['text-[#002b24]', 'text-emerald-950'].includes(c)) return 'text-white';
    if (c === 'text-white') return hasPrimaryBg || hasSecondaryBg ? 'text-white' : 'text-slate-900';
    if (c === 'text-slate-200' || c === 'text-emerald-100') return 'text-slate-900';
    if (c.startsWith('text-emerald-') || c.startsWith('text-slate-400') || c.startsWith('text-white/')) return 'text-slate-500';
    return c;
  });

  classes = classes.map(c => {
    if (c === 'bg-emerald-500') return 'bg-blue-900';
    if (c === 'hover:bg-emerald-400') return 'hover:bg-blue-800';
    if (c === 'bg-emerald-600') return 'bg-blue-900';
    
    if (c === 'text-amber-300' || c === 'text-amber-400') return 'text-orange-500';
    if (c === 'bg-amber-400' || c === 'bg-amber-500') return 'bg-orange-500';
    if (c === 'hover:bg-amber-300' || c === 'hover:bg-amber-400') return 'hover:bg-orange-600';
    
    return c;
  });

  classes = classes.map(c => {
    if (c === 'focus:border-amber-400') return 'focus:border-blue-900';
    if (c === 'selection:bg-amber-400') return 'selection:bg-blue-900';
    if (c === 'selection:text-[#002b24]') return 'selection:text-white';
    if (c === 'text-amber-300') return 'text-orange-500';
    if (c === 'text-amber-400') return 'text-orange-500';
    if (c === 'bg-amber-500/20') return 'bg-orange-50';
    if (c === 'bg-amber-500/30') return 'bg-orange-100';
    if (c === 'bg-emerald-500/20') return 'bg-slate-100';
    if (c === 'bg-emerald-500/30') return 'bg-slate-100';
    return c;
  });

  return classes.join(' ');
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/className="([^"]+)"/g, (match, classes) => {
    return `className="${processClassString(classes)}"`;
  });
  
  content = content.replace(/className=\{`([^`]+)`\}/g, (match, classes) => {
    let parts = classes.split(/(\$\{[^}]+\})/);
    let newParts = parts.map(p => p.startsWith('${') ? p : processClassString(p));
    return `className={\`${newParts.join('')}\`}`;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir('./src', processFile);
console.log("Done");
