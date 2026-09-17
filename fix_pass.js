const fs = require('fs');
let content = fs.readFileSync('app/pass/page.tsx', 'utf8');

// Add states
content = content.replace('const [mounted, setMounted] = useState(false);', 
  'const [mounted, setMounted] = useState(false);\n  const [hasActivePass, setHasActivePass] = useState(false);\n  const [activePassName, setActivePassName] = useState(" \);\n
