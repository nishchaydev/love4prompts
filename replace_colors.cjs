const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let updatedFiles = 0;

walkDir('./src', (filePath) => {
  if (filePath.match(/\.(tsx|astro|ts|css)$/)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace old Red (#bc0007) with new Pinkish Red (#FF6D87)
    // Replace old Yellow (#FFC900) with Deep Cyan (#1482A3)
    let newContent = content
      .replace(/#bc0007/gi, '#FF6D87')
      .replace(/#FFC900/gi, '#1482A3');
      
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated:', filePath);
      updatedFiles++;
    }
  }
});

console.log(`Total files updated: ${updatedFiles}`);
