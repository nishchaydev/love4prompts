import 'dotenv/config';
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

function cleanText(text: string) {
  return text
    .replace(/xml:space="preserve">/g, '')
    .replace(/Prompt\s*#?\s*\d+\s*/gi, '')
    .trim();
}

async function uploadToSupabase() {
  const dataPath = path.join(process.cwd(), 'extracted_prompts.json');
  if (!fs.existsSync(dataPath)) {
    console.error("extracted_prompts.json not found");
    return;
  }
  
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Found ${rawData.length} items to process.`);

  // Ensure bucket exists and is public
  const bucketName = 'prompts';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.find(b => b.name === bucketName);
  
  if (!bucketExists) {
    console.log(`Creating bucket ${bucketName}...`);
    await supabase.storage.createBucket(bucketName, { public: true });
  }

  const promptsToInsert = [];

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    let cleanedText = cleanText(item.text);
    if (!cleanedText) cleanedText = "Beautiful aesthetic generation"; // Fallback
    
    // Generate a title from the first few words
    let title = cleanedText.split('.')[0].substring(0, 60);
    if (title.length < 10) title = cleanedText.substring(0, 60);
    title = title.replace(/\n/g, ' ').trim() + '...';

    // Image Upload
    let imageUrl = '';
    if (item.image) {
      const imagePath = path.join(process.cwd(), 'docx_extracted', 'word', item.image);
      if (fs.existsSync(imagePath)) {
        const fileExt = path.extname(imagePath).toLowerCase();
        const fileName = `prompt-img-${Date.now()}-${i}${fileExt}`;
        const fileBuffer = fs.readFileSync(imagePath);
        
        const mimeTypes: Record<string, string> = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
          '.bmp': 'image/bmp',
          '.ico': 'image/x-icon',
          '.tiff': 'image/tiff',
          '.tif': 'image/tiff'
        };
        const derivedMime = mimeTypes[fileExt] || 'application/octet-stream';

        console.log(`Uploading ${fileName}...`);
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileBuffer, {
            contentType: derivedMime,
            upsert: false
          });
          
        if (error) {
          console.error(`Error uploading image ${item.image}:`, error.message);
        } else {
          const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          imageUrl = publicUrlData.publicUrl;
        }
      }
    }

    if (!imageUrl) {
      imageUrl = `https://picsum.photos/seed/${i + 500}/800/800`;
    }

    promptsToInsert.push({
      title: title,
      slug: generateSlug(title),
      prompt_text: cleanedText,
      tags: ['imported', 'community', 'library'],
      style: 'Various',
      model: 'Midjourney',
      image_url: imageUrl,
      is_public: true,
      view_count: Math.floor(Math.random() * 500),
      save_count: Math.floor(Math.random() * 50)
    });
  }

  console.log(`Inserting ${promptsToInsert.length} prompts to database...`);
  const { error } = await supabase.from('prompts').insert(promptsToInsert);

  if (error) {
    console.error("Error inserting prompts into DB:", error);
  } else {
    console.log("Successfully uploaded images and inserted prompts to Supabase!");
  }
}

uploadToSupabase().catch(console.error);
