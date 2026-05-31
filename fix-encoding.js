const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Replacements
content = content.replace(/—”/g, '—');
content = content.replace(/©”/g, '—');
content = content.replace(/â€”/g, '—');
content = content.replace(/Â©/g, '©');
content = content.replace(/ðŸ“Š/g, '📊');
content = content.replace(/â ±/g, '⏳');
content = content.replace(/ðŸŒ¬/g, '🌬️');
content = content.replace(/âœ“/g, '✓');

// Auth arrows
content = content.replace(/authSignInBtn: "SIGN IN [^"]+"/, 'authSignInBtn: "SIGN IN \\u2192"');
content = content.replace(/authSignUpBtn: "CREATE ACCOUNT [^"]+"/, 'authSignUpBtn: "CREATE ACCOUNT \\u2192"');
content = content.replace(/authSignInBtn: "MASUK [^"]+"/, 'authSignInBtn: "MASUK \\u2192"');
content = content.replace(/authSignUpBtn: "BUAT AKUN [^"]+"/, 'authSignUpBtn: "BUAT AKUN \\u2192"');

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Replaced characters');
