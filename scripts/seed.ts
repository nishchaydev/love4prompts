import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS for seeding
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Basic helper to generate a slug
function generateSlug(title: string, index: number) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index;
}

const STYLES = ['anime', 'dark fantasy', 'architecture', 'abstract', 'portrait', 'nature', 'sci-fi', 'vintage', 'cinematic'];
const MODELS = ['midjourney', 'dalle3', 'flux', 'stable-diffusion'];

const SAMPLE_PROMPTS = [
  {
    title: "Cinematic female warrior at golden hour",
    prompt_text: "A powerful female warrior in ornate dark armor, standing on a rocky cliff at golden hour, dramatic cinematic lighting, bokeh background, photorealistic, shot on RED camera, 8k resolution, epic fantasy atmosphere",
    tags: ["portrait", "cinematic", "warrior", "fantasy", "golden hour"]
  },
  {
    title: "Cyberpunk street vendor at night",
    prompt_text: "Neon lit cyberpunk street, rain puddles reflecting pink and blue neon signs, a cyborg street vendor cooking ramen, atmospheric haze, futuristic, highly detailed, blade runner style",
    tags: ["sci-fi", "cyberpunk", "street", "night", "neon"]
  },
  {
    title: "Cozy autumn cabin exterior",
    prompt_text: "A small wooden cabin in an autumn forest, orange and red leaves on trees, warm glowing light from the windows, morning mist, hyperrealistic, nature photography, highly detailed",
    tags: ["nature", "architecture", "autumn", "cabin", "cozy"]
  },
  {
    title: "Surreal floating islands",
    prompt_text: "Surreal landscape with islands floating in the sky, waterfalls cascading into the clouds, magical glowing plants, dreamy fantasy art style, vibrant colors",
    tags: ["abstract", "fantasy", "surreal", "floating islands"]
  },
  {
    title: "Vintage botanical illustration",
    prompt_text: "Detailed vintage botanical illustration of a glowing bioluminescent mushroom, aged paper texture, scientific diagram style, pen and ink with watercolor washes",
    tags: ["vintage", "illustration", "botanical", "mushroom"]
  },
  {
    title: "Anime schoolgirl under cherry blossoms",
    prompt_text: "Anime style illustration, high school girl looking up at falling cherry blossoms, soft spring sunlight, detailed background, Makoto Shinkai style, emotional, beautiful lighting",
    tags: ["anime", "portrait", "cherry blossoms", "spring"]
  },
  {
    title: "Dark fantasy necromancer lair",
    prompt_text: "Dark fantasy, creepy necromancer lair, glowing green magical runes, skulls and ancient books, dimly lit, gothic architecture, dramatic shadows, highly detailed",
    tags: ["dark fantasy", "gothic", "magic", "dark"]
  },
  {
    title: "Modern minimalist living room",
    prompt_text: "Interior design, modern minimalist living room, large windows overlooking a city skyline, mid-century modern furniture, soft natural lighting, photorealistic, architectural rendering",
    tags: ["architecture", "interior", "minimalist", "modern"]
  },
  {
    title: "Abstract geometric energy waves",
    prompt_text: "Abstract 3D render, flowing geometric shapes, energy waves in vibrant purple and orange colors, glassmorphism, glowing edges, dark background, 8k, octane render",
    tags: ["abstract", "3d", "geometry", "colorful"]
  },
  {
    title: "Space explorer on alien planet",
    prompt_text: "Sci-fi illustration, lone astronaut standing on an alien planet, giant ringed planet in the sky, bioluminescent flora, cinematic lighting, epic scale",
    tags: ["sci-fi", "space", "alien", "astronaut"]
  }
];

async function seed() {
  console.log("Seeding prompts...");
  
  const promptsToInsert = [];

  for (let i = 0; i < 30; i++) {
    const basePrompt = SAMPLE_PROMPTS[i % SAMPLE_PROMPTS.length];
    const style = STYLES[Math.floor(Math.random() * STYLES.length)];
    const model = MODELS[Math.floor(Math.random() * MODELS.length)];
    
    promptsToInsert.push({
      title: `${basePrompt.title} ${i}`,
      slug: generateSlug(basePrompt.title, i),
      prompt_text: basePrompt.prompt_text,
      tags: [...basePrompt.tags, style, model],
      style: style,
      model: model,
      image_url: `https://picsum.photos/seed/${i + 100}/800/800`,
      is_public: true,
      view_count: Math.floor(Math.random() * 1000),
      save_count: Math.floor(Math.random() * 100)
    });
  }

  const { data, error } = await supabase
    .from('prompts')
    .insert(promptsToInsert);

  if (error) {
    console.error("Error seeding data:", error);
  } else {
    console.log("Successfully seeded 30 prompts.");
  }
}

seed().catch(console.error);
