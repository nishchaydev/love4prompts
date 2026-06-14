const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/mock-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Strip imports temporarily to parse array
content = content.replace(/^import\s+(type\s+)?.*?;$/gm, '');
content = content.replace(/export const mockPrompts: Prompt\[\] =/, 'const mockPrompts =');

// Append module.exports
const scriptCode = content + '\nmodule.exports = { mockPrompts };';

// Write temp file
const tempPath = path.join(__dirname, 'temp_run.cjs');
fs.writeFileSync(tempPath, scriptCode);

let mockPrompts;
try {
  const imported = require(tempPath);
  mockPrompts = imported.mockPrompts;
} finally {
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
}

// 1. Append Watermark rule to all prompt text if not present
mockPrompts.forEach(p => {
  const watermarkRule = 'Add WaterMark on top right or on bottom left with word : love4prompts';
  if (!p.prompt_text.includes(watermarkRule)) {
    p.prompt_text = p.prompt_text.trim() + '\n' + watermarkRule;
  }
});

// 2. Map old categories to new taxonomy: Boys, Girls, Professional, AI art, Birthday, Festivals, Posters, Netflix typo, Memories, Anniversary
mockPrompts.forEach(p => {
  const oldCategory = (p.category || '').toLowerCase();
  const oldSub = (p.subcategory || '').toLowerCase();
  
  if (oldCategory === 'creators') {
    p.category = 'Posters';
  } else if (oldCategory === 'couples') {
    p.category = 'Anniversary';
  } else if (oldSub === 'zodiac' || oldSub === 'anime' || oldSub === 'chibi') {
    p.category = 'AI art';
  } else if (oldSub === 'memories' || oldSub === 'scrapbook') {
    p.category = 'Memories';
  } else if (oldSub === 'birthday') {
    p.category = 'Birthday';
  }
  
  // Clean up any remaining categories that are not in the new taxonomy
  const allowed = ["Boys", "Girls", "Professional", "AI art", "Birthday", "Festivals", "Posters", "Netflix typo", "Memories", "Anniversary"];
  if (!allowed.includes(p.category)) {
    // Fallback based on text heuristics
    const txt = p.prompt_text.toLowerCase();
    if (txt.includes('boy') || txt.includes('man') || txt.includes('male')) {
      p.category = 'Boys';
    } else if (txt.includes('girl') || txt.includes('woman') || txt.includes('female')) {
      p.category = 'Girls';
    } else if (txt.includes('corporate') || txt.includes('office') || txt.includes('suit') || txt.includes('professional')) {
      p.category = 'Professional';
    } else if (txt.includes('birthday') || txt.includes('cake')) {
      p.category = 'Birthday';
    } else if (txt.includes('festival') || txt.includes('celebration')) {
      p.category = 'Festivals';
    } else if (txt.includes('poster') || txt.includes('typography')) {
      p.category = 'Posters';
    } else if (txt.includes('movie') || txt.includes('subtitle') || txt.includes('netflix')) {
      p.category = 'Netflix typo';
    } else if (txt.includes('anniversary') || txt.includes('romantic') || txt.includes('wedding')) {
      p.category = 'Anniversary';
    } else if (txt.includes('memory') || txt.includes('vintage') || txt.includes('retro')) {
      p.category = 'Memories';
    } else {
      p.category = 'AI art';
    }
  }
});

// 3. Define the 10 newly generated, highly realistic imagined trends
const newTrends = [
  {
    "id": "new-10",
    "slug": "boys-wet-street-supercar-topshot",
    "title": "Streetwear Supercar Night",
    "category": "Boys",
    "subcategory": "Cars",
    "prompt_text": "A highly realistic, sharp professional photograph of {UPLOADED IMAGE} in modern streetwear, leaning against a sleek black Porsche 911 supercar. Shot from a high-angle top-down perspective on a wet urban street at night. Saturated neon lights reflect on the wet asphalt.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["supercar", "streetwear", "urban"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/boys_supercar.png",
    "view_count": 2100,
    "save_count": 890,
    "creator": null
  },
  {
    "id": "new-9",
    "slug": "girls-parisian-cafe-sunlight-espresso",
    "title": "Parisian Cafe Portrait",
    "category": "Girls",
    "subcategory": "Aesthetic",
    "prompt_text": "A realistic close-up portrait of {UPLOADED IMAGE} sitting at an outdoor table of a chic Parisian cafe. Soft morning sunlight, natural skin texture with visible pores, cozy atmosphere. Holding a ceramic cup of espresso.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["cafe", "portrait", "paris"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/girls_cafe.png",
    "view_count": 1950,
    "save_count": 720,
    "creator": null
  },
  {
    "id": "new-8",
    "slug": "professional-executive-tailored-suit-headshot",
    "title": "Corporate Executive Profile",
    "category": "Professional",
    "subcategory": "Business",
    "prompt_text": "A sharp, high-end professional corporate headshot of {UPLOADED IMAGE} in a tailored navy blue suit. Neutral background with clean, modern glass office structures out of focus. Crisp lighting, natural posture, confident expression.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["professional", "corporate", "headshot"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/professional_headshot.png",
    "view_count": 1400,
    "save_count": 510,
    "creator": null
  },
  {
    "id": "new-7",
    "slug": "ai-art-glowing-glass-butterfly-hand",
    "title": "Bioluminescent Glass Butterfly",
    "category": "AI art",
    "subcategory": "Surreal",
    "prompt_text": "A stunning, surreal AI digital artwork of a giant glowing translucent glass butterfly sitting on {UPLOADED IMAGE}'s open palm. The scene is set in an enchanted bioluminescent forest at night, with glowing mushrooms.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["surreal", "glowing", "butterfly"],
    "style": "3D Art",
    "model": "Gemini",
    "image_url": "/images/trends/ai_art_butterfly.png",
    "view_count": 2800,
    "save_count": 1100,
    "creator": null
  },
  {
    "id": "new-6",
    "slug": "birthday-cake-fresh-strawberries-candle",
    "title": "Strawberry Candle Cake",
    "category": "Birthday",
    "subcategory": "Celebration",
    "prompt_text": "A realistic, aesthetic photograph of a minimalist birthday cake decorated with fresh organic strawberries and one lit candle. Placed on a rustic wooden table with clean negative space. In the background, {UPLOADED IMAGE} is blowing the candle. Cozy, warm ambient lighting.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["birthday", "cake", "aesthetic"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/birthday_cake.png",
    "view_count": 1780,
    "save_count": 650,
    "creator": null
  },
  {
    "id": "new-5",
    "slug": "festivals-outdoor-music-concert-crowd",
    "title": "Sunset Stage Concert Crowd",
    "category": "Festivals",
    "subcategory": "Concert",
    "prompt_text": "A vibrant, high-energy realistic photograph of {UPLOADED IMAGE} in a huge outdoor music festival crowd dancing at sunset. Rays of golden light, stage lasers, stage smoke, and large speakers in the background.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["festival", "concert", "sunset"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/festivals_sunset.png",
    "view_count": 2300,
    "save_count": 940,
    "creator": null
  },
  {
    "id": "new-4",
    "slug": "posters-minimalist-swiss-graphic-design",
    "title": "Swiss Typographic Poster",
    "category": "Posters",
    "subcategory": "Design",
    "prompt_text": "A clean, minimalist Swiss graphic design poster featuring {UPLOADED IMAGE}. Bold black typography, geometric lines, and solid fields of pastel cream, soft coral, and deep navy blue. Flat vector illustration style, print-ready.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["poster", "swiss", "typography"],
    "style": "Graphic Design",
    "model": "Gemini",
    "image_url": "/images/trends/posters_swiss.png",
    "view_count": 1890,
    "save_count": 710,
    "creator": null
  },
  {
    "id": "new-3",
    "slug": "netflix-typo-cinematic-movie-rain-dialogue",
    "title": "Cinematic Subtitle Scene",
    "category": "Netflix typo",
    "subcategory": "Movie",
    "prompt_text": "A cinematic movie scene photograph. An intense close-up of {UPLOADED IMAGE} under a street light in a dark, rainy alleyway. Overlayed at the bottom is a realistic white Netflix subtitle font with a black border.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["netflix", "cinematic", "subtitle"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/netflix_typo.png",
    "view_count": 2400,
    "save_count": 890,
    "creator": null
  },
  {
    "id": "new-2",
    "slug": "memories-beach-friends-laughter-golden-hour",
    "title": "Golden Hour Beach Memories",
    "category": "Memories",
    "subcategory": "Nostalgia",
    "prompt_text": "A nostalgic, warm realistic photograph of {UPLOADED IMAGE} laughing and running along a sandy beach during the golden hour of sunset. Strong film grain, warm orange and soft pink tones, vintage retro camera style.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["memories", "beach", "golden-hour"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/memories_beach.png",
    "view_count": 1820,
    "save_count": 640,
    "creator": null
  },
  {
    "id": "new-1",
    "slug": "aniversary-high-balcony-skyline-candlelight-dinner",
    "title": "Romantic Skyline Balcony Dining",
    "category": "Anniversary",
    "subcategory": "Romantic",
    "prompt_text": "A highly elegant, romantic photo of a private candlelight dinner set up on a high balcony overlooking a gorgeous city skyline at twilight. {UPLOADED IMAGE} sitting at a white table with two crystal champagne glasses, soft glowing candles.\nAdd WaterMark on top right or on bottom left with word : love4prompts",
    "tags": ["aniversary", "romantic", "dinner"],
    "style": "Photography",
    "model": "Gemini",
    "image_url": "/images/trends/aniversary_dinner.png",
    "view_count": 1540,
    "save_count": 480,
    "creator": null
  }
];

// Prepend the new trends at the start of the list
const finalPrompts = [...newTrends, ...mockPrompts];

// Clean output file content
const outputContent = `import type { Prompt } from '../components/library/PromptCard';

const creators = [
  { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces', handle: '@sarahj' },
  { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces', handle: '@marcus_chen' },
  { name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces', handle: '@elena_art' },
  { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces', handle: '@dkim_design' },
];

export const mockPrompts: Prompt[] = ${JSON.stringify(finalPrompts, null, 2)};
`;

fs.writeFileSync(filePath, outputContent);
console.log('Successfully modified mock-data.ts: appended watermark, pre-mapped categories, and added 10 new imagined trends on top.');
