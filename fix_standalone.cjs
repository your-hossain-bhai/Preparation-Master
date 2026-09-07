const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Insert the state and effect for standalone
const hookCode = `  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || (window.navigator).standalone === true;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => {
      setIsStandalone(e.matches || (window.navigator).standalone === true);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
`;

content = content.replace('const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);', `const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);\n${hookCode}`);

// Hide the install button
const buttonCode = `{/* Install on Mobile App Button */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              title={lang === 'en' ? 'Install App on Phone' : 'মোবাইলে ইনস্টল করুন'}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-2xl transition-all flex items-center gap-2 text-sm font-extrabold shadow-md shadow-emerald-950/30 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>{lang === 'en' ? 'Install' : 'ইনস্টল'}</span>
            </button>`;

const newButtonCode = `{/* Install on Mobile App Button */}
            {!isStandalone && (
              <button
                onClick={() => setIsInstallModalOpen(true)}
                title={lang === 'en' ? 'Install App on Phone' : 'মোবাইলে ইনস্টল করুন'}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-2xl transition-all flex items-center gap-2 text-sm font-extrabold shadow-md shadow-emerald-950/30 active:scale-95"
              >
                <Smartphone className="w-4 h-4" />
                <span>{lang === 'en' ? 'Install' : 'ইনস্টল'}</span>
              </button>
            )}`;

content = content.replace(buttonCode, newButtonCode);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("Done");
