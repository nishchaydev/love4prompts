const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/mock-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Match JSON objects in the array
const regex = /\{([^}]+)\}/g;
let match;
const placeholders = [];

while ((match = regex.exec(content)) !== null) {
  const objText = match[0];
  try {
    // Basic parser for title and image_url
    const idMatch = objText.match(/"id":\s*"([^"]+)"/);
    const titleMatch = objText.match(/"title":\s*"([^"]+)"/);
    const urlMatch = objText.match(/"image_url":\s*"([^"]+)"/);
    const categoryMatch = objText.match(/"category":\s*"([^"]+)"/);
    
    if (idMatch && urlMatch) {
      const id = idMatch[1];
      const title = titleMatch ? titleMatch[1] : '';
      const url = urlMatch[1];
      const category = categoryMatch ? categoryMatch[1] : '';
      
      if (url.includes('prompt_maker') || url.includes('caption_maker') || url.includes('library')) {
        placeholders.push({ id, title, url, category });
      }
    }
  } catch (e) {
    // ignore parsing errors
  }
}

console.log(JSON.stringify({
  total: placeholders.length,
  items: placeholders.slice(0, 30)
}, null, 2));
