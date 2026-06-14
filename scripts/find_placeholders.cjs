const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/mock-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Find the start of the array
const arrayStartIdx = content.indexOf('export const mockPrompts: Prompt[] = [');
if (arrayStartIdx === -1) {
  console.error('Could not find mockPrompts in mock-data.ts');
  process.exit(1);
}

// Extract only the part after the equals sign
const arrayContent = content.substring(arrayStartIdx + 'export const mockPrompts: Prompt[] ='.length).trim();

// Tokenizer to find all top-level objects in the array
function extractObjects(text) {
  const objects = [];
  let braceCount = 0;
  let startIdx = -1;
  let inString = false;
  let stringChar = '';
  let isEscaped = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }
    
    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }
    
    if (char === '{') {
      if (braceCount === 0) {
        startIdx = i;
      }
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && startIdx !== -1) {
        objects.push({
          text: text.substring(startIdx, i + 1),
          start: startIdx,
          end: i + 1
        });
        startIdx = -1;
      }
    }
  }
  return objects;
}

const objectList = extractObjects(arrayContent);
const placeholders = [];
let failedParses = 0;

for (const entry of objectList) {
  try {
    // Safely evaluate the object expression using Function
    const obj = (new Function(`return (${entry.text})`))();
    
    if (obj && obj.id && obj.image_url) {
      const id = obj.id;
      const title = obj.title || '';
      const url = obj.image_url;
      const category = obj.category || '';
      
      if (url.includes('prompt_maker') || url.includes('caption_maker') || url.includes('library')) {
        placeholders.push({ id, title, url, category });
      }
    }
  } catch (e) {
    // Extract a small snippet from the start of the object text to identify it in log
    const snippet = entry.text.substring(0, 80).replace(/\s+/g, ' ') + '...';
    console.warn(`Warning: Failed to parse entry starting with snippet: "${snippet}". Error:`, e.message);
    failedParses++;
  }
}

if (failedParses > 0) {
  console.warn(`${failedParses} entries failed to parse.`);
}

console.log(JSON.stringify({
  total: placeholders.length,
  items: placeholders.slice(0, 30)
}, null, 2));
