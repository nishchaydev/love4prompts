import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) + '-' + Date.now().toString().slice(-4);
}

async function uploadAndGenerateMockData() {
  const dataPath = path.join(process.cwd(), 'extracted_prompts.json');
  if (!fs.existsSync(dataPath)) {
    console.error("extracted_prompts.json not found");
    return;
  }
  
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Found ${rawData.length} prompt groups to process.`);

  const bucketName = 'prompts';
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === bucketName)) {
    await supabase.storage.createBucket(bucketName, { public: true });
  }

  const generatedPrompts = [];
  let promptIdCounter = 100;

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    let cleanedText = item.text || "Beautiful aesthetic generation";
    
    let title = cleanedText.split('.')[0].substring(0, 60);
    if (title.length < 10) title = cleanedText.substring(0, 60);
    title = title.replace(/\n/g, ' ').trim() + '...';

    // Process all images for this prompt
    for (let imgIndex = 0; imgIndex < item.images.length; imgIndex++) {
      const imgName = item.images[imgIndex];
      let imageUrl = '';
      
      const imagePath = path.join(process.cwd(), 'docx_extracted', 'word', imgName);
      if (fs.existsSync(imagePath)) {
        const fileExt = path.extname(imagePath);
        const fileName = `prompt-img-v2-${Date.now()}-${i}-${imgIndex}${fileExt}`;
        const fileBuffer = fs.readFileSync(imagePath);
        
        const extToMime: Record<string, string> = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
          '.bmp': 'image/bmp'
        };
        const contentType = extToMime[fileExt.toLowerCase()] || 'application/octet-stream';

        console.log(`Uploading ${fileName}...`);
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileBuffer, {
            contentType,
            upsert: false
          });
          
        if (error) {
          console.error(`Error uploading ${imgName}:`, error.message);
        } else {
          const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          imageUrl = publicUrlData.publicUrl;
        }
      }

      if (!imageUrl) {
        imageUrl = `https://picsum.photos/seed/${promptIdCounter}/800/800`;
      }

      generatedPrompts.push({
        id: promptIdCounter.toString(),
        slug: generateSlug(title) + (imgIndex > 0 ? `-${imgIndex}` : ''),
        title: title,
        prompt_text: cleanedText,
        tags: ['imported', 'community'],
        style: 'Various',
        model: 'Midjourney v6',
        image_url: imageUrl,
        view_count: Math.floor(Math.random() * 500) + 100,
        save_count: Math.floor(Math.random() * 50) + 10,
        creator: null // Will be handled in mock-data.ts
      });
      promptIdCounter++;
    }
  }

  // Generate new mock-data file
  const mockDataContent = `import type { Prompt } from '../components/library/PromptCard';

const creators = [
  { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces', handle: '@sarahj' },
  { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces', handle: '@marcus_chen' },
  { name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces', handle: '@elena_art' },
  { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces', handle: '@dkim_design' },
];

export const mockPrompts: Prompt[] = ${JSON.stringify(generatedPrompts, null, 2)};

// Apply random creators to the prompts without one
mockPrompts.forEach(p => {
  if (!p.creator) {
    p.creator = creators[Math.floor(Math.random() * creators.length)];
  }
});
`;

  fs.writeFileSync(path.join(process.cwd(), 'src', 'lib', 'mock-data.ts'), mockDataContent);
  console.log("Successfully generated src/lib/mock-data.ts with all prompts!");
}

uploadAndGenerateMockData().catch(console.error);
