const fs = require('fs');
const path = require('path');

const dir = 'e:/Gdev-project/my-sotd-app/data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const map = {
  'cool': 'Dingin', 'cold': 'Dingin', 'winter': 'Dingin', 'fall': 'Dingin', 'night': 'Dingin',
  'warm': 'Panas', 'hot': 'Panas', 'summer': 'Panas', 'sunny': 'Panas',
  'mild': 'Versatile', 'spring': 'Versatile', 'all year': 'Versatile', 'signature': 'Versatile', 'any': 'Versatile',
  'dingin': 'Dingin', 'panas': 'Panas', 'versatile': 'Versatile'
};

let totalChanges = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changesInFile = 0;
  
  content = content.replace(/weather:\s*(["'])(.+?)\1/g, (match, quote, weatherValue) => {
    const valLow = weatherValue.toLowerCase().trim();
    
    let target = null;
    if (map[valLow]) {
        target = map[valLow];
    } else {
        // Find best match based on inclusion if not exact
        for (const [key, t] of Object.entries(map)) {
            if (valLow.includes(key)) {
                target = t;
                break;
            }
        }
    }

    if (target) {
        if (weatherValue !== target) {
            changesInFile++;
            return `weather: ${quote}${target}${quote}`;
        }
        return match; // Already exact
    }
    
    console.log(`Warning: Unmapped weather value "${weatherValue}" in ${file}`);
    return match;
  });

  if (changesInFile > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${changesInFile} entries in ${file}`);
    totalChanges += changesInFile;
  }
});

console.log(`Total changes: ${totalChanges}`);
