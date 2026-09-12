const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Change initial state of showSplash
content = content.replace(
  'const [showSplash, setShowSplash] = useState(false);',
  'const [showSplash, setShowSplash] = useState(true);'
);

// Fix the useEffect logic
const oldEffect = \    const hasSeenSplash = sessionStorage.getItem(" bv-splash-seen\);

