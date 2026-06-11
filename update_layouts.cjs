const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.astro')) results.push(file);
  });
  return results;
}

const files = walk('src/pages');
let modified = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('<Layout') && !content.includes('theme="editorial"')) {
    // Basic replace
    content = content.replace(/<Layout([\s\S]*?)>/, '<Layout$1 theme="editorial">');
    fs.writeFileSync(f, content);
    modified++;
    console.log(`Updated ${f}`);
  }
});

console.log('Total modified:', modified);
