const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'components', 'tools');
const extraDir = path.join(__dirname, 'src', 'pages', 'tools');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.astro')) results.push(file);
  });
  return results;
}

const files = [...walk(toolsDir), ...walk(extraDir)];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Background and borders
  content = content.replace(/bg-\[var\(--color-background-card\)\]/g, 'bg-white shadow-[8px_8px_0_rgba(0,0,0,1)]');
  content = content.replace(/border border-\[var\(--color-border\)\]/g, 'border-[3px] border-black');
  content = content.replace(/bg-\[var\(--color-background-elevated\)\]/g, 'bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)]');
  
  // Hardcoded dark backgrounds
  content = content.replace(/bg-\[\#0B0A0F\]/g, 'bg-white');
  content = content.replace(/bg-\[\#120A24\]/g, 'bg-white');
  
  // Text colors
  content = content.replace(/text-white\/80/g, 'text-black/80');
  content = content.replace(/text-white\/60/g, 'text-black/60');
  content = content.replace(/text-white\/40/g, 'text-black/40');
  content = content.replace(/text-white\/50/g, 'text-black/50');
  content = content.replace(/text-white\/90/g, 'text-black/90');
  content = content.replace(/text-white/g, 'text-black');
  
  content = content.replace(/text-\[var\(--color-text-secondary\)\]/g, 'text-gray-700');
  content = content.replace(/text-\[var\(--color-text-primary\)\]/g, 'text-black font-bold');
  
  // Borders
  content = content.replace(/border-white\/10/g, 'border-black/20 border-[2px]');
  content = content.replace(/border-white\/20/g, 'border-black/30 border-[2px]');
  content = content.replace(/border-white\/5/g, 'border-black/10 border-[2px]');
  content = content.replace(/border-\[var\(--color-border\)\]/g, 'border-black border-[2px]');
  
  // Hover effects (simplified brutalist translation)
  content = content.replace(/hover:bg-white\/5/g, 'hover:bg-[#FF6D87]/10 hover:shadow-[4px_4px_0_#FF6D87]');
  content = content.replace(/hover:bg-white\/10/g, 'hover:bg-[#FF6D87]/20 hover:-translate-y-1 hover:shadow-[4px_4px_0_#FF6D87] transition-all');
  content = content.replace(/hover:border-white\/20/g, 'hover:border-black hover:shadow-[4px_4px_0_#FF6D87]');
  content = content.replace(/hover:border-white\/15/g, 'hover:border-black');

  // Input fields / textareas specific styling
  content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-gray-50 border-[2px] border-black');
  content = content.replace(/bg-white\/\[0\.04\]/g, 'bg-gray-100 border-[2px] border-black');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done.');
