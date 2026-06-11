import fs from 'fs';
import path from 'path';

// Parse the raw XML of document.xml and document.xml.rels
const docXmlPath = path.join(process.cwd(), 'docx_extracted', 'word', 'document.xml');
const relsXmlPath = path.join(process.cwd(), 'docx_extracted', 'word', '_rels', 'document.xml.rels');

if (!fs.existsSync(docXmlPath) || !fs.existsSync(relsXmlPath)) {
  console.error("Extracted docx files not found.");
  process.exit(1);
}

const docXml = fs.readFileSync(docXmlPath, 'utf8');
const relsXml = fs.readFileSync(relsXmlPath, 'utf8');

// Parse relations
const rels: Record<string, string> = {};
const relRegex = /<Relationship Id="([^"]+)" Type="[^"]+" Target="([^"]+)"/g;
let match;
while ((match = relRegex.exec(relsXml)) !== null) {
  rels[match[1]] = match[2];
}

const pRegex = /<w:p(?:\s|>)(.*?)<\/w:p>/gs;
const tRegex = /<w:t(?:\s|>)(.*?)<\/w:t>/gs;
const imgRegex = /<a:blip r:embed="([^"]+)"/g;

type PromptData = { promptNumber: string, text: string, images: string[] };
const extractedData: PromptData[] = [];
let currentPrompt: PromptData | null = null;

while ((match = pRegex.exec(docXml)) !== null) {
  const pContent = match[1];
  
  // Extract text
  let textContent = '';
  let tMatch;
  while ((tMatch = tRegex.exec(pContent)) !== null) {
    let t = tMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)))
      .replace(/&#x([0-9A-Fa-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    t = t.replace(/xml:space="preserve">/g, '');
    textContent += t;
  }
  
  textContent = textContent.trim();
  
  if (textContent) {
    // Check if this is a new prompt marker (e.g., "Prompt 1", "Prompt # 1", "1", "1.", etc.)
    const promptMatch = textContent.match(/^(?:Prompt\s*#?\s*)?(\d+)(?:\.|:)?\s*$/i) || 
                        textContent.match(/^Prompt\s*#?\s*(\d+)/i);
                        
    if (promptMatch) {
      if (currentPrompt) {
        extractedData.push(currentPrompt);
      }
      currentPrompt = { promptNumber: promptMatch[1], text: '', images: [] };
      // If the line had more than just the prompt number, add the rest to text
      const restText = textContent.replace(/^(?:Prompt\s*#?\s*)?(\d+)(?:\.|:)?\s*/i, '').trim();
      if (restText) {
         currentPrompt.text = restText;
      }
    } else {
      if (!currentPrompt) {
        currentPrompt = { promptNumber: '0', text: '', images: [] };
      }
      currentPrompt.text += (currentPrompt.text ? '\n' : '') + textContent;
    }
  }
  
  // Extract images
  let imgMatch;
  while ((imgMatch = imgRegex.exec(pContent)) !== null) {
    const rId = imgMatch[1];
    const imagePath = rels[rId];
    if (imagePath && imagePath.startsWith('media/')) {
      if (!currentPrompt) {
         currentPrompt = { promptNumber: '0', text: '', images: [] };
      }
      currentPrompt.images.push(imagePath);
    }
  }
}

if (currentPrompt) {
  extractedData.push(currentPrompt);
}

fs.writeFileSync('extracted_prompts.json', JSON.stringify(extractedData, null, 2));
console.log(`Extracted ${extractedData.length} items. Written to extracted_prompts.json`);
