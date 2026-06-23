export const SITE_URL = "https://love4prompts-five.vercel.app";
export const ASTRO_TOOLS_URL = "https://love4prompts-five.vercel.app";
export const CREATE_BASE = "https://meigen.ai/create";

export type Trend = {
  slug: string;
  title: string;
  category: string;
  img: string;
  height: "sm" | "md" | "lg" | "xl";
  hot?: boolean;
  prompt: string;
};

export const TRENDS: Trend[] = [
  {
    "slug": "boys",
    "title": "Streetwear Supercar Night",
    "category": "Boys",
    "img": "/images/trends/boys_supercar.png",
    "height": "lg",
    "hot": true,
    "prompt": "A highly realistic, sharp professional photograph of {UPLOADED IMAGE} in modern streetwear, leaning against a sleek black Porsche 911 supercar. Shot from a high-angle top-down perspective on a wet urban street at night. Saturated neon lights reflect on the wet asphalt.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "girls",
    "title": "Parisian Cafe Portrait",
    "category": "Girls",
    "img": "/images/trends/girls_cafe.png",
    "height": "xl",
    "hot": true,
    "prompt": "A realistic close-up portrait of {UPLOADED IMAGE} sitting at an outdoor table of a chic Parisian cafe. Soft morning sunlight, natural skin texture with visible pores, cozy atmosphere. Holding a ceramic cup of espresso.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "professional",
    "title": "Corporate Executive Profile",
    "category": "Professional",
    "img": "/images/trends/professional_headshot.png",
    "height": "md",
    "hot": false,
    "prompt": "A sharp, high-end professional corporate headshot of {UPLOADED IMAGE} in a tailored navy blue suit. Neutral background with clean, modern glass office structures out of focus. Crisp lighting, natural posture, confident expression.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "ai-art",
    "title": "Bioluminescent Glass Butterfly",
    "category": "AI Art",
    "img": "/images/trends/ai_art_butterfly.png",
    "height": "lg",
    "hot": false,
    "prompt": "A stunning, surreal AI digital artwork of a giant glowing translucent glass butterfly sitting on {UPLOADED IMAGE}'s open palm. The scene is set in an enchanted bioluminescent forest at night, with glowing mushrooms.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "birthday",
    "title": "Strawberry Candle Cake",
    "category": "Birthday",
    "img": "/images/trends/birthday_cake.png",
    "height": "md",
    "hot": false,
    "prompt": "A realistic, aesthetic photograph of a minimalist birthday cake decorated with fresh organic strawberries and one lit candle. Placed on a rustic wooden table with clean negative space. In the background, {UPLOADED IMAGE} is blowing the candle. Cozy, warm ambient lighting.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "festivals",
    "title": "Sunset Stage Concert Crowd",
    "category": "Festivals",
    "img": "/images/trends/festivals_sunset.png",
    "height": "xl",
    "hot": true,
    "prompt": "A vibrant, high-energy realistic photograph of {UPLOADED IMAGE} in a huge outdoor music festival crowd dancing at sunset. Rays of golden light, stage lasers, stage smoke, and large speakers in the background.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "posters",
    "title": "Swiss Typographic Poster",
    "category": "Posters",
    "img": "/images/trends/posters_swiss.png",
    "height": "lg",
    "hot": false,
    "prompt": "A clean, minimalist Swiss graphic design poster featuring {UPLOADED IMAGE}. Bold black typography, geometric lines, and solid fields of pastel cream, soft coral, and deep navy blue. Flat vector illustration style, print-ready.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "netflix-typography",
    "title": "Cinematic Subtitle Scene",
    "category": "Netflix Typography",
    "img": "/images/trends/netflix_typo.png",
    "height": "lg",
    "hot": true,
    "prompt": "A cinematic movie scene photograph. An intense close-up of {UPLOADED IMAGE} under a street light in a dark, rainy alleyway. Overlayed at the bottom is a realistic white Netflix subtitle font with a black border.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "memories",
    "title": "Golden Hour Beach Memories",
    "category": "Memories",
    "img": "/images/trends/memories_beach.png",
    "height": "md",
    "hot": false,
    "prompt": "A nostalgic, warm realistic photograph of {UPLOADED IMAGE} laughing and running along a sandy beach during the golden hour of sunset. Strong film grain, warm orange and soft pink tones, vintage retro camera style.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "anniversary",
    "title": "Romantic Skyline Balcony Dining",
    "category": "Anniversary",
    "img": "/images/trends/aniversary_dinner.png",
    "height": "sm",
    "hot": false,
    "prompt": "A highly elegant, romantic photo of a private candlelight dinner set up on a high balcony overlooking a gorgeous city skyline at twilight. {UPLOADED IMAGE} sitting at a white table with two crystal champagne glasses, soft glowing candles.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "stark-high-contrast-fashion-photography",
    "title": "Streetwear Editorial",
    "category": "Boys",
    "img": "/images/trends/streetwear_editorial.png",
    "height": "sm",
    "hot": false,
    "prompt": "A stark, high-contrast fashion photography shot of a person wearing a black hoodie against a solid vibrant hot pink background. Clean composition, modern streetwear vibe, edgy lighting, minimal and striking.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "mixed-media-portrait-cool-person",
    "title": "Pop Art Collage",
    "category": "Posters",
    "img": "/images/cards/caption_maker.png",
    "height": "md",
    "hot": false,
    "prompt": "A mixed media portrait of a cool person wearing sunglasses, combined with torn newspaper textures, bold cyan and yellow paint splatters. Pop art collage style, edgy, modern, high contrast, graphic design aesthetic.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "cinematic-moody-photograph-creator",
    "title": "Floating Memories",
    "category": "Memories",
    "img": "/images/cards/library.png",
    "height": "lg",
    "hot": false,
    "prompt": "A cinematic, moody photograph of a cool modern creator looking at glowing polaroid photos falling and floating in the air around them. Teal and black color palette, edgy, highly stylized, modern streetwear aesthetic, shallow depth of field.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-dramatic-studio-portrait-of-a-young-man-in-right-0594",
    "title": "Cinematic Side Profile",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174880151-0-0.png",
    "height": "xl",
    "hot": false,
    "prompt": "A dramatic studio portrait of a young man in right-facing side profile, medium shot. He has messy, textured dark hair with natural volume and loose strands. Sharp nose, slight stubble on jawline, a cigarette held loosely between his lips with smoke curling and drifting upward elegantly. Wearing an oversized black hoodie with drawstrings visible. One hand loosely clenched at his side. The background is a bold split two-tone design — left half is deep blood red, right half is pure stark white, creating a sharp vertical dividing line directly behind the subject. The figure is rendered as a near-complete dark silhouette with only subtle rim lighting catching the edge of his face, nose, and jaw from the right side. Dramatic smoke wisps glowing red against the background. High contrast, deep crushed blacks, cinematic color blocking. Professional studio lighting setup with colored gels. Editorial fashion photography, cinematic poster aesthetic, dark moody atmosphere.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "ultra-detailed-ink-sketch-style-portrait-of-a-youn-0886",
    "title": "Ink Sketch Portrait",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174880594-1-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "ultra-detailed ink sketch style portrait of a young man with curly hair, beard, and wearing\norange-tinted sunglasses and a denim jacket, looking slightly upward with a confident expression\nart style: black and white pen illustration with cross-hatching and fine line shading, high detail engraving style\nbackground: layered vintage newspaper collage with readable textures and headlines\ngraphic elements: bold orange and blue paint splashes behind the subject, dynamic\ncompositioncolor style: mostly monochrome with selective color accents (orange glasses and paint splashes, blue splashes)\nlighting: flat studio-style illustration lighting, no shadows from real light sources\ncomposition: centered portrait, poster design layout, clean hierarchy, sharp facial details\nno depth blur, no bokeh, crisp edges, high contrast ink texture\naspect ratio 4:6\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "cinematic-moody-portrait-of-a-young-person-standin-1612",
    "title": "Birthday Memory",
    "category": "Memories",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174880886-2-0.png",
    "height": "md",
    "hot": false,
    "prompt": "cinematic, moody portrait of a young person standing indoors in front of a bright window with sheer curtains, wearing a black hoodie and a thin chain necklace. Their eyes are covered with a white cloth blindfold tied around the head. The camera angle is low, looking slightly upward, giving a dramatic and emotional feel. Floating around the person are multiple blurred polaroid photographs suspended in mid-air, creating a sense of memories and time. Soft blue and teal color tones\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-highly-detailed-stylized-digital-painting-portra-2287",
    "title": "Artistic Self Portrait",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174881613-3-0.png",
    "height": "lg",
    "hot": false,
    "prompt": "A highly detailed, stylized digital painting portrait bust of a young man with voluminous, messy, dark curly hair. His head is tilted slightly back, looking upward.\nHis eyes are completely pupil-less and solid pale grey/white, giving an eerie, supernatural effect. He has a small grey rectangular medical bandage taped horizontally across the bridge of his nose, along with a light mustache and trimmed beard. On the center of\nhis neck,there is a small, bright green cartoon monster tattoo or graphic patch. He is wearing a black crew-neck t-shirt with a faded \"yashk2__\" logo at the bottom center. The lower edge of the black shirt is unfinished, dissolving into rough, expressive, painterly brushstrokes, creating a floating bust effect. The background is a solid, vibrant amber-orange color with a subtle grain textureHigh-quality digital art, cinematic lighting on the face, high contrast against the bright orange background. Use my picture for reference.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "use-the-uploaded-photo-as-the-face-reference--2513",
    "title": "CEO Portrait",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174882287-4-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Use the uploaded photo as the face reference. Preserve the exact facial identity, face shape, hairstyle, skin tone, and proportions of the person.\nCreate a high-contrast black-and-white portrait of the same person, styled like a vintage cinematic headshot. The subject is wearing a formal tuxedo with a white dress shirt and a black bow tie.\nThe background is a bold, solid red color with a slightly grainy texture.\nAdd a thick black rectangular censor bar horizontally across the eyes, perfectly aligned and covering both eyes completely.\nThe lighting is dramatic and directional, creating deep shadows and strong highlights on the face (film noir style).\nThe expression is a subtle confident smirk.\nStyle: minimalist, graphic poster design, high contrast, sharp edges, slightly gritty texture, editorial magazine aesthetic.\nComposition: centered portrait, cropped from chest up, clean framing.\nUltra-detailed, 4K resolution, crisp edges, professional studio quality.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "surreal-cinematic-portrait-of-a-man-sitting-in-a-c-3075",
    "title": "Flower Crown Surreal",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174882513-5-0.png",
    "height": "sm",
    "hot": false,
    "prompt": "Surreal cinematic portrait of a man sitting in a chair in a dark studio environment with a deep blue gradient background and soft atmospheric fog. The man is wearing a light blue puffer jacket.\nUse the uploaded reference image as the face reference of the person. Maintain the same facial features and identity.\nA delicate crown of tiny pink flowers grows across the eyes horizontally, partially covering the eyes. Dreamlike surreal mood, soft lighting, dramatic shadows, shallow depth of field, ultra detailed, artistic photography, 85mm lens, high resolution.\n<upload your photo link> surreal portrait, man sitting in chair, blue background, light blue puffer jacket, small pink flowers covering eyes, dreamy lighting, cinematic photography --ar 1:1 --style raw\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "photorealistic-image-of-an-extreme-close-up-side-p-3478",
    "title": "Red Noir Close-Up",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174883075-6-0.png",
    "height": "md",
    "hot": false,
    "prompt": "Photorealistic image of an extreme close-up side profile of this male figure, head tilted slightly downward and turned so the visible side of the head is aimed toward the right edge of the frame, occupying almost the entire vertical canvas from top to bottom, cropped tightly so the back and top of the head are out of frame, with no clothing visible; the entire scene is dominated by searing monochromatic red tones; the subject is lit by a single harsh, highly saturated red key light coming from camera-right and slightly above, carving out bold planes of illumination along the front edge of the head while plunging the areas farther from the light into deep, nearly black shadow, producing sharp, graphic contrast; fine skin texture and pores rendered in ultra detail, with subtle shine and tiny imperfections and dark smudges across the surface suggesting grit and recent conflict; background is a completely flat, vivid crimson red with no texture or gradient, functioning as negative space that wraps closely around the silhouette of the head along the right edge and lower portion of the image; composition is vertical and poster-like, intensely minimalistic and focused on the dramatic curve of the profile and the sweeping diagonal of light and shadow, neo-noir action-movie key art style, ultra high contrast, cinematic, tense and brooding atmosphere, razor-sharp focus on the illuminated areas of skin, shallow depth of field eliminating any background detail, 8k resolution, ultra-detailed, subtle film grain, studio photography look captured with a telephoto portrait lens, no text, no logos, generic male subject whose facial details can later be replaced via reference image, --ar 9:16 --v 6 --q 2 --style raw\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "photorealistic-image-of-this-male-figure-in-a-broo-4098",
    "title": "Devil Incarnate Poster",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174883478-7-0.png",
    "height": "lg",
    "hot": false,
    "prompt": "Photorealistic image of this male figure in a brooding, forward-facing stance with head slightly bowed, wearing a heavy, pitch-black open robe or cloak that drapes broadly over the shoulders, revealing the center of the chest. The lighting is dramatic and high-contrast, characterized by intense backlighting that silhouettes the subject against a bright white background. Complex, streak-like shadows fall vertically across the torso and upper body, suggesting distinct shapes intervening with the light source. The background features layered graphic design elements including bold red sans-serif text reading \"DEVIL INCARNATE\" and \"ROHIT\", overlapping with elegant black script typography and large, distressed red block letters. The aesthetic is that of a high-quality digital illustration or manhwa cover art with soft focus bloom, cinematic composition, and sharp graphic overlays. --ar 1:1 --v 6.0 --q 2 --style raw\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "-photorealistic-image-of-this-male-figure-in-a-dar-5039",
    "title": "Split Screen Duotone",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174884098-8-0.png",
    "height": "xl",
    "hot": false,
    "prompt": "\\\nPhotorealistic image of: this male figure in a dark formal suit and tie, shoulders facing forward, head turned sharply to left profile. Vertical split-screen composition: left half is solid cyan blue, right half is vibrant red. Hard-edged duotone lighting dividing the subject and background down the exact center. High-contrast graphic poster style, heavy film grain texture, noir aesthetic, dramatic shadows, sharp silhouette. 8k resolution, cinematic lighting, stylized art, --ar 1:2 --v 6.0 --q 2\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "photorealistic-image-of-this-male-figure-standing--5484",
    "title": "Golden Hour Countryside",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174885039-9-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Photorealistic image of this male figure standing outdoors in a rustic countryside setting, positioned next to a brown horse behind a weathered wire mesh fence with concrete posts. The subject wears an unbuttoned, loose-fitting olive green collared shirt exposing the chest, accompanied by a thin gold chain necklace and dark sunglasses. The horse features a faded reddish halter. The background consists of rolling green pastures and distant hills under a soft evening sky. The lighting is distinct golden hour sun, creating warm, directional highlights and deep shadows. The style is candid, vintage film photography with soft focus and slight grain. --ar 9:16 --v 6.0 --style raw --q 2\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "photorealistic-image-of-this-male-figure-depicted--5746",
    "title": "Fight Club Poster",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174885485-10-0.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "Photorealistic image of: this male figure depicted in a strict side profile facing left, head and shoulders composition. The image is rendered in a sharp vector illustration style resembling WPAP or stencil art, utilizing hard-edged geometric planes of flat color for shading. The color palette consists of beige, tan, and deep brown shadows with a jagged red geometric patch on the cheek area. The figure wears a black t-shirt with white piping on the collar and a white stripe on the shoulder. The background is solid white, featuring large, bold, distressed black typography reading \"FIGHT CLUB\" positioned behind the subject, accented with digital glitch artifacts, noise, and small technical text fragments. High contrast, clean lines, graphic design aesthetic, --ar 9:16 --v 6 --stylize 250\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "photorealistic-image-of-this-male-figure-standing--6294",
    "title": "Highland Wanderer",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174885746-11-0.png",
    "height": "lg",
    "hot": false,
    "prompt": "Photorealistic image of: this male figure standing in a vast, open highland meadow. The subject is positioned slightly to the right, wearing an oversized, solid black hoodie with the hood pulled up loosely over the head, framing the silhouette. The posture is relaxed and casual, with hands likely tucked into pockets or hanging loosely. The background consists of a rolling field of dark, muted green grass extending toward a dramatic, rugged mountain range in the distance. The mountains are shrouded in atmospheric mist and haze, appearing jagged and grey against a pale, overcast sky. The lighting is soft, diffuse, and gloomy, simulating a cloudy day with low contrast and no direct sunlight. The color palette is desaturated and cool, dominated by deep forest greens, slate greys, and shadows. The aesthetic resembles candid 35mm analog film photography, featuring slight film grain, naturalistic depth of field, and a melancholic, atmospheric mood. --ar 1:1 --style raw --v 6.0\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-dreamy-aesthetic-doodle-scrapbook-portrai-6463",
    "title": "Pinterest Aesthetic Girl",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174886294-12-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Create a dreamy aesthetic doodle scrapbook portrait edit using the uploaded reference image as the main subject. Keep the EXACT face identity, natural facial features, skin tone, hairstyle, body shape, pose vibe, and overall recognizability of the person from the reference image. The final image should look like a professionally designed Pinterest-inspired scrapbook collage mixed with doodle art and Korean aesthetic editing style. STYLE & VIBE: Soft dreamy lighting, pastel + vibrant aesthetic mix, Gen-Z Pinterest vibe, scrapbook journal feel, hand-drawn doodles, trendy Instagram aesthetic, cute chaotic composition but visually balanced, youthful feminine energy, artistic and ultra detailed. BACKGROUND: Create a soft aesthetic background matching the outfit colors from the reference image. Add layered scrapbook textures like ripped paper edges, tape pieces, notebook textures, subtle grid paper, magazine collage layers, watercolor splashes, glitter dust, tiny stars, clouds, hearts, sparkles, butterflies, smiley doodles, flowers, cherries, bows, music icons, polaroid frames, handwritten notes, aesthetic stamps, mini posters, and cute cutout elements. DOODLE ELEMENTS: Add white hand-drawn doodles around the subject such as: stars sparkles hearts arrows clouds swirls flowers butterflies smileys tiny crowns angel wings lightning doodles aesthetic scribbles hanging stars tiny planets cute random symbols TEXT DESIGN: Add stylish trendy scrapbook text around the image in mixed fonts (handwritten + magazine cutout + bold aesthetic typography). Use phrases like: “main character energy” “pretty little moments” “stay dreamy” “love yourself” “cute chaos” “delulu but aesthetic” “just girly things” “soft heart” “made of stars” “internet angel” Use random rotated text placements, sticker-style typography, layered captions, and handwritten marker notes for authentic scrapbook feel. STICKERS & CUTOUTS: Add realistic cute aesthetic stickers and cutouts: Sanrio-inspired mini stickers teddy bears ribbons bows iced coffee headphones camera doodles lip gloss perfume bottle flowers polaroid snapshots stars and moon stickers pink UI popups retro icons sparkly emojis vintage labels tiny chat bubbles COLOR PALETTE: Use dreamy pastel tones mixed with glossy vibrant accents: baby pink, lavender, cream, peach, soft blue, white, beige, with subtle neon highlights and glossy Y2K effects. EDITING STYLE: Ultra detailed, clean skin texture, soft glow effect, cinematic lighting, slightly glossy finish, depth layering, realistic shadows for stickers and paper cutouts, high-quality composition, aesthetic blur depth, subtle grain, Pinterest-quality editing. COMPOSITION: The subject should remain the center focus while the doodles, texts, stickers, and scrapbook elements surround them artistically without covering the face. Make the layout visually rich and highly aesthetic like a viral Pinterest moodboard edit. FORMAT: Vertical portrait, 3:4 ratio, ultra high quality, Instagram-ready, Pinterest aesthetic, scrapbook doodle art masterpiece.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-cinematic-aesthetic-doodle-scrapbook-port-6659",
    "title": "Street Style Scrapbook",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174886463-13-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Create a cinematic aesthetic doodle scrapbook portrait edit using the uploaded reference image as the main subject. Keep the EXACT face identity, natural facial features, skin tone, hairstyle, body shape, pose vibe, outfit energy, and overall recognizability of the person from the reference image. The final image should look like a professionally designed Pinterest-inspired scrapbook collage mixed with doodle street-art aesthetics and trendy Gen-Z editing style. STYLE & VIBE: Cool dreamy lighting, masculine Pinterest aesthetic, modern scrapbook collage feel, street-style doodle art, soft cinematic editing, stylish and confident vibe, artistic yet realistic, visually rich composition, youthful trendy energy, Korean/Japanese magazine-inspired editing style. BACKGROUND: Create an aesthetic layered background matching the outfit tones from the reference image. Add scrapbook textures like ripped paper edges, old magazine layers, notebook pages, film strips, grain textures, poster walls, tape pieces, graffiti textures, blurred city lights, skate/street elements, and artistic collage layers. DOODLE ELEMENTS: Add stylish white or neon doodles around the subject such as: stars lightning bolts arrows smiley doodles flames clouds sketch lines crowns street-style scribbles abstract symbols tiny planets headphones doodles music wave doodles basketball/skate doodles wings spray paint accents geometric doodles spark effects TEXT DESIGN: Add trendy masculine scrapbook typography using mixed fonts (graffiti + handwritten + bold magazine cutout style). Use phrases like: “main character” “late night vibes” “too rare to explain” “stay wild” “built different” “dream big” “midnight thoughts” “young forever” “lost in music” “chaotic energy” “good days loading” “city lights & memories” Use layered typography, random placements, handwritten marker notes, sticker-style captions, aesthetic labels, and rotated magazine cutout text for an authentic scrapbook vibe. STICKERS & CUTOUTS: Add cool trendy cutout elements like: headphones cassette tapes cameras sneakers basketballs skateboards gaming icons music players retro gadgets street signs stars and flames comic-style popups coffee cups anime-inspired stickers vintage labels chrome icons film frames UI popups neon symbols COLOR PALETTE: Use cool cinematic tones mixed with soft vibrant accents: black, grey, white, dark blue, beige, muted brown, silver, soft neon blue, deep green, subtle red/orange highlights. EDITING STYLE: Ultra detailed, realistic face preservation, cinematic glow, soft shadows, glossy modern finish, realistic sticker depth, layered paper textures, subtle grain, magazine-inspired color grading, high-quality Pinterest aesthetic editing. COMPOSITION: The subject should remain the center focus while doodles, stickers, text, and collage elements artistically surround him without hiding facial details. The final composition should feel like a viral\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-cinematic-aesthetic-doodle-scrapbook-port-6837-1",
    "title": "Magazine Cutout Boy",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174886659-13-1.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "Create a cinematic aesthetic doodle scrapbook portrait edit using the uploaded reference image as the main subject. Keep the EXACT face identity, natural facial features, skin tone, hairstyle, body shape, pose vibe, outfit energy, and overall recognizability of the person from the reference image. The final image should look like a professionally designed Pinterest-inspired scrapbook collage mixed with doodle street-art aesthetics and trendy Gen-Z editing style. STYLE & VIBE: Cool dreamy lighting, masculine Pinterest aesthetic, modern scrapbook collage feel, street-style doodle art, soft cinematic editing, stylish and confident vibe, artistic yet realistic, visually rich composition, youthful trendy energy, Korean/Japanese magazine-inspired editing style. BACKGROUND: Create an aesthetic layered background matching the outfit tones from the reference image. Add scrapbook textures like ripped paper edges, old magazine layers, notebook pages, film strips, grain textures, poster walls, tape pieces, graffiti textures, blurred city lights, skate/street elements, and artistic collage layers. DOODLE ELEMENTS: Add stylish white or neon doodles around the subject such as: stars lightning bolts arrows smiley doodles flames clouds sketch lines crowns street-style scribbles abstract symbols tiny planets headphones doodles music wave doodles basketball/skate doodles wings spray paint accents geometric doodles spark effects TEXT DESIGN: Add trendy masculine scrapbook typography using mixed fonts (graffiti + handwritten + bold magazine cutout style). Use phrases like: “main character” “late night vibes” “too rare to explain” “stay wild” “built different” “dream big” “midnight thoughts” “young forever” “lost in music” “chaotic energy” “good days loading” “city lights & memories” Use layered typography, random placements, handwritten marker notes, sticker-style captions, aesthetic labels, and rotated magazine cutout text for an authentic scrapbook vibe. STICKERS & CUTOUTS: Add cool trendy cutout elements like: headphones cassette tapes cameras sneakers basketballs skateboards gaming icons music players retro gadgets street signs stars and flames comic-style popups coffee cups anime-inspired stickers vintage labels chrome icons film frames UI popups neon symbols COLOR PALETTE: Use cool cinematic tones mixed with soft vibrant accents: black, grey, white, dark blue, beige, muted brown, silver, soft neon blue, deep green, subtle red/orange highlights. EDITING STYLE: Ultra detailed, realistic face preservation, cinematic glow, soft shadows, glossy modern finish, realistic sticker depth, layered paper textures, subtle grain, magazine-inspired color grading, high-quality Pinterest aesthetic editing. COMPOSITION: The subject should remain the center focus while doodles, stickers, text, and collage elements artistically surround him without hiding facial details. The final composition should feel like a viral\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "-serve-the-elements-in-the-photo-and-add-meaningfu-7062",
    "title": "Annotated Vibes",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174886837-14-0.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "\"serve the elements in the photo and add meaningful handwritten annotations to each one. Use thin, white, hand-drawn lines that feel rough, slightly uneven, and single-stroke, tracing the outer edges of objects while incorporating arrows and dotted lines to guide the viewer’s eye. Tailor the annotations to the subject: for drinks, reference taste, temperature, or mood; for food, focus on texture or flavour; for spaces, describe the atmosphere. Add one concise overall summary line to capture the feeling of the moment. Enhance sparingly with small decorative elements such as steam, sparkles, hearts, or simple emoticon-style doodles, maintaining generous negative space. First ask me for a photo.\nAlso include a glass morphism Spotify UI based on the vibes of image, making it glowing into matching colors.\"\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "ultra-detailed-anime-inspired-character-moodboard--7251",
    "title": "Anime Moodboard",
    "category": "AI Art",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174887062-15-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Ultra-detailed anime-inspired character moodboard poster of a beautiful young  woman named \" Nandini\", keep the original photo exactly the same (person, face, body). aesthetic sketchbook collage layout on textured vintage beige paper background, multiple poses and illustrations of the same character, cinematic semi-realistic anime art style mixed with pencil\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "iss-photo-ko-mini-me-world-mein-badlo-jahan-mere-c-7462",
    "title": "Mini Me World",
    "category": "Birthday",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174887251-16-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Iss photo ko 'Mini Me' world mein badlo jahan mere chhote animated versions mere aaspaas zinda ho jaayein. Ye cute 3D Mini Me characters meri everyday surroundings ke saath interact karein, kandhon par chadhein, bag par baithein, haath hilaayein, khelein aur mera pose copy karein. Scene playful aur emotional ho, social media story jaisa, personality aur story se bhara hua. Original photo ko bina badle, ye chhote characters depth, movement, realistic shadows aur soft aesthetic vibe ke saath image mein life laayein. End mein ek chhota sentimental title ho jo daily life ke captured moment jaisa lage.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "this-prompt-generates-highly-stylized-minimalist-r-7662",
    "title": "Futuristic Minimalist",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174887462-17-0.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "This prompt generates highly stylized, minimalist representations of futuristic subjects, focusing on bold contrasts and streamlined designs. The overall style emphasizes simplicity, and a striking visual impact\nCustomizable color palette.\nHigh impact visuals.\nConcept Art\nBook & Movie Covers\nBranding Materials\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-3d-isometric-diorama-illustration-of-an-o-7827",
    "title": "3D Isometric Diorama",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174887663-18-0.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "Create a 3D isometric diorama illustration of an original character named [CHARACTER NAME], peacefully working or practicing a creative activity in a nature-inspired environment, sitting at a wooden desk near a large open window with sunlight flowing in and soft greenery visible outside.\nThe character should be inspired by [ARCHETYPE / PROFESSION – e.g. writer, painter, meditator, calligraphy artist, tea master] and have a unique visual identity, including soft, natural clothing, organic textures, and a calm, introspective personality.\nThe entire scene must have a handcrafted felt aesthetic, with soft rounded shapes, visible stitching details, and clean, polished textures.\nThe diorama is enclosed inside a rounded cube structure with subtle hexagonal proportions, made of [MATERIAL STYLE – e.g. soft matte ceramic, light frosted resin, natural wood finish].\nThe environment must strongly reflect a peaceful, nature-connected lifestyle, including plants, natural wood furniture, soft textiles, and minimalistic decor.\nOn the desk, include small detailed objects such as [OBJECT 1 – e.g. tea cup], [OBJECT 2 – e.g. brush or pen], [OBJECT 3 – e.g. notebook or scroll].\nLighting should be bright, soft, and natural, with warm sunlight beams entering through the window, creating a serene and airy atmosphere, with a clean white background outside the diorama.\nRender in 1080x1080, ultra-detailed, photorealistic style.\nInclude a small stitched fabric name tag sewn onto the INNER wall of the diorama (top-left corner inside the cube), clearly integrated into the scene, not floating and not outside the structure, displaying the name: CHARACTER NAME\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-bold-y2k-japanese-street-editorial-collag-8019",
    "title": "Y2K Japanese Editorial",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174887827-19-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Create a bold Y2K Japanese street-editorial collage poster with a clean high-fashion magazine aesthetic, gritty paper textures, torn magazine cutouts, distressed ink splashes, and urban Tokyo-inspired design.Main composition: one large cinematic close-up portrait at the top with intense eye focus, natural skin texture, glossy lips, messy tied-up hair, no glasses, soft dramatic lighting, confident innocent expression, ultra-realistic fashion photography style.Bottom composition: only 2 smaller portrait collage frames showing different facial expressions and angles, styled like ripped polaroids taped onto the poster.Design elements: oversized bold Japanese typography, minimal English text, subtle Japanese street signs, barcode stickers, newspaper scraps, vintage grunge textures, paint strokes, film grain, tape pieces, layered paper collage effects, and premium editorial magazine layout aesthetics.Style: edgy yet clean, modern Japanese fashion zine, cinematic shadows, sharp eye detail, RAW DSLR realism, editorial streetwear moodboard, premium graphic design, ultra detailed, 8K, balanced neutral tones, no pink aesthetic, no bubbles, no cartoon vibe.\n`\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "-prompt-cute-kawaii-style-food-and-cafe-photograph-8204",
    "title": "Kawaii Food Doodle",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174888019-20-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "{\nPrompt: {\nCute kawaii-style food and cafe photography with playful doodle overlays and vibrant Instagram aesthetics\",\n\"Scenes\": [\n{\n\"SceneID\": \"Kawaii_Strawberry_Popsicles\",\n\"Objective\": \"Create a whimsical kawaii-style food photograph featuring colorful strawberry popsicles with playful doodle elements\",\n\"Subject\": {\n\"FoodItem\": \"Two strawberry popsicles\",\n\"Details\": [\n\"Frozen texture with visible ice crystals\",\n\"Sliced strawberries embedded inside\",\n\"Pastel pink and chocolate tones\"\n],\n\"Interaction\": \"Held by hands outdoors\"\n},\n\"Environment\": {\n\"Location\": \"Outdoor garden or floral setting\",\n\"Background\": {\n\"Elements\": [\n\"Vibrant flowers\",\n\"Green foliage\"\n],\n\"Effect\": \"Creamy bokeh blur\"\n}\n},\n\"ArtElements\": {\n\"Doodles\": [\n\"Cute hand-drawn faces\",\n\"Stick arms and legs\",\n\"Bunny ears\",\n\"Hearts\",\n\"Speech bubbles\",\n\"White sketch overlays\"\n],\n\"Style\": \"Playful kawaii illustration mixed with realism\"\n},\n\"Lighting\": {\n\"Type\": \"Soft natural lighting\",\n\"Mood\": \"Dreamy summer glow\"\n},\n\"Composition\": {\n\"Framing\": \"Close-up vertical composition\",\n\"DepthOfField\": \"Shallow depth of field\",\n\"Focus\": \"Sharp focus on popsicles and doodles\"\n},\n\"Style\": {\n\"Aesthetic\": \"Instagram cute cafe style\",\n\"ColorPalette\": [\n\"Pastel pink\",\n\"Creamy chocolate\",\n\"Bright floral greens\"\n],\n\"Mood\": \"Whimsical, cozy, cheerful\",\n\"Resolution\": \"Ultra-detailed cinematic realism\"\n},\n\"AspectRatio\": \"4:5\"\n},\n{\n\"SceneID\": \"Kawaii_Strawberry_Frappe\",\n\"Objective\": \"Create a trendy kawaii cafe-style beverage photograph with playful illustrated overlays\",\n\"Subject\": {\n\"Drink\": \"Strawberry blended frappé\",\n\"Container\": \"Transparent plastic cup\",\n\"Details\": [\n\"Whipped topping\",\n\"Colorful cereal sprinkles\",\n\"Realistic condensation droplets\"\n],\n\"Interaction\": \"Held by hand\"\n},\n\"Environment\": {\n\"Location\": \"Cozy coffee shop\",\n\"Background\": {\n\"Elements\": [\n\"Warm cafe interior\",\n\"Soft ambient lighting\"\n],\n\"Effect\": \"Blurred cozy cafe atmosphere\"\n}\n},\n\"ArtElements\": {\n\"Doodles\": [\n\"Cute cartoon face\",\n\"Drawn arms and legs\",\n\"Hearts\",\n\"Sparkles\",\n\"Speech bubbles\",\n\"“best girler!” handwritten text\",\n\"White sketch illustrations\"\n],\n\"Style\": \"Kawaii mixed-media overlay aesthetic\"\n},\n\"Lighting\": {\n\"Type\": \"Warm ambient cafe lighting\",\n\"Mood\": \"Cheerful and cozy\"\n},\n\"Composition\": {\n\"Framing\": \"Vertical close-up composition\",\n\"DepthOfField\": \"Soft depth of field\",\n\"Focus\": \"Sharp focus on drink textures and doodles\"\n},\n\"Style\": {\n\"Aesthetic\": \"Trendy Instagram cafe photography\",\n\"ColorPalette\": [\n\"Pastel pink\",\n\"Warm beige\",\n\"Soft cream tones\"\n],\n\"Mood\": \"Fun, playful, vibrant\",\n\"Resolution\": \"Ultra-detailed cinematic photography\"\n},\n\"AspectRatio\": \"4:5\"\n}\n],\n\"NegativePrompt\": [\n\"flat lighting\",\n\"messy composition\",\n\"low detail\",\n\"dark moody tones\",\n\"blurry food\",\n\"harsh shadows\",\n\"dull colors\"\n]\n}\n}\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "pov-travel-photography-of-a-person-sitting-at-an-a-8599",
    "title": "Airport Travel Vibes",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174888204-21-0.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "POV travel photography of a person sitting at an airport and inside an airplane, casual outfit with jeans and sneakers, small crossbody bag on lap, holding a drink can, warm golden sunlight streaming through windows. Scene 1: airport waiting area with luggage (suitcase and backpack), cinematic composition, cozy travel vibe. Scene 2: airplane seat view looking down at legs and tray area, window light casting soft shadows. Add playful hand-drawn doodles and annotations around objects (bags, drink, shoes, seat) including arrows, hearts, stars, clouds, and handwritten notes like “window seat dreams”, “ready for takeoff”, “good vibes only”, “travel • chill • repeat”. White and yellow sketch-style overlays, scrapbook aesthetic, soft warm color grading, shallow depth of field, ultra-realistic, Instagram story style, cinematic lifestyle photography, 4K\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "pov-travel-photography-of-a-person-sitting-at-an-a-8771-1",
    "title": "Airplane Window Seat",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174888599-21-1.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "POV travel photography of a person sitting at an airport and inside an airplane, casual outfit with jeans and sneakers, small crossbody bag on lap, holding a drink can, warm golden sunlight streaming through windows. Scene 1: airport waiting area with luggage (suitcase and backpack), cinematic composition, cozy travel vibe. Scene 2: airplane seat view looking down at legs and tray area, window light casting soft shadows. Add playful hand-drawn doodles and annotations around objects (bags, drink, shoes, seat) including arrows, hearts, stars, clouds, and handwritten notes like “window seat dreams”, “ready for takeoff”, “good vibes only”, “travel • chill • repeat”. White and yellow sketch-style overlays, scrapbook aesthetic, soft warm color grading, shallow depth of field, ultra-realistic, Instagram story style, cinematic lifestyle photography, 4K\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "ultra-realistic-luxury-apple-inspired-fashion-camp-8958",
    "title": "Apple Luxe Campaign",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174888771-22-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Ultra realistic luxury Apple-inspired fashion campaign poster featuring a stylish modern woman in a premium minimalist aesthetic. Clean matte white and silver background with soft Apple keynote lighting, elegant shadows, futuristic luxury vibe, and ultra polished studio composition. Beautiful fashionable female model standing confidently in center wearing sleek monochrome outfit inspired by Apple design language — fitted white crop jacket, silver-gray trousers, premium sneakers, minimal jewelry, glossy hair, soft makeup, futuristic fashion influencer vibe. Surrounding flatlay accessories include AirPods-style earbuds, smart watch, silver handbag, sunglasses, luxury heels, and premium gadgets arranged aesthetically around the model. Elegant typography inspired by Apple ads with minimal clean font, small product labels, subtle arrows, and premium pricing tags. Hyper detailed textures, cinematic soft lighting, realistic fabric folds, luxury editorial photography style, Pinterest luxury fashion aesthetic, futuristic ecommerce catalog design, ultra clean minimal composition, vertical 4:5 Instagram fashion advertisement, ultra detailed 8K luxury campaign.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "make-image-a-super-enormous-husky-curled-up-adorab-9211",
    "title": "Giant Pet in City",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174888958-23-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Make image !A super enormous Husky  curled up adorably on the alaska, its tail wrapped around the structure. Surrounding historic London buildings appear tiny like miniature models. Realistic city setting during a soft sunset, warm gentle light, quiet soothing and heartwarming cute atmosphere, photorealistic, serene and charming.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "analyze-the-uploaded-image-and-preserve-the-origin-9502",
    "title": "Doodle Photo Edit",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174889212-24-0.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "Analyze the uploaded image and preserve the original subject, composition, and lighting. Do not alter the identity or facial structure of the main character. Add playful hand-drawn doodle elements that interact directly with the subject in the photo. The doodles should mimic, follow, or exaggerate the existing shapes, gestures, or movements — such as outlining the pose, extending arms or legs, adding motion lines, or creating imaginative elements that “react” to the subject.\nStep 2:\nTransform the entire image into a cute cartoon-style illustration with adorable doodle aesthetics. Maintain the original scene and character details while applying a vibrant, soft, and playful cartoon look.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "rework-the-given-image-into-a-crayon-style-illustr-9729",
    "title": "Coffee Cup Romance",
    "category": "Anniversary",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174889502-25-0.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "Rework the given image into a crayon-style illustration, transforming the entire scene into something that feels hand-drawn by a 10-year-old. Keep the forms simple and slightly imperfect, like a child’s drawing.\nAvoid using the original color palette—replace it with bright, playful crayon colors on a clean white paper background. Aim for a soft, cute, and innocent aesthetic.\nIncorporate fun, childlike details such as castles or towers, candy, stars, clouds, and other whimsical decorations to amplify the playful vibe.\nThe final result should feel charming, colorful, and full of childlike imagination.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "-brand-name-enter-the-brand-name-here--9939",
    "title": "Car Poster Cinematic",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174889729-26-0.png",
    "height": "xl",
    "hot": false,
    "prompt": "[BRAND NAME]: Enter the brand name here.\nGoal: Generate a minimalist organic image where a stylized logo icon of [BRAND NAME] is transformed into a large moss-textured artifact, with a small brand signature at the bottom.\nConstraint: NO TEXT inside or immediately near the central moss icon. Only the bottom signature.\n1. THE CENTRAL MOSS ICON\n- Main Subject: A large, geometrically precise symbol, sculpted into the exact form of the [BRAND NAME] logo icon.\n- Material: The symbol is entirely made of dense, heavily textured, natural green stabilizing moss. The texture is rough and organic with varying shades of green and brown.\n- Form: The geometric edges are sharp and clean, but filled with the soft, billowy texture of moss.\n2. ENVIRONMENT & LAYOUT\n- View: A top-down, central flat lay view.\n- Background: A flawless, uniform, matte white studio background. Full minimalist negative space.\n- Lighting: Bright, soft, diffused studio lighting that emphasizes the tactile moss texture while minimizing harsh shadows.\n3. BOTTOM BRAND SIGNATURE (CRITICAL)\n- Placement: A clean horizontal signature block centered at the bottom, far below the moss icon.\n- Elements: A tiny, flat, minimalist version of the [BRAND NAME] logo icon on the left.\n- Text: The word \"[BRAND NAME]\" in a clean, bold, black sans-serif typeface immediately to the right of the tiny logo.\n- Scale: The signature must be very small compared to the central moss artifact.\n4. AESTHETIC\n- Biophilic design, premium product photography, clean, fresh, airy, high-end editorial look. 8k resolution.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "-objective-create-a-split-architectural-visualizat-0477",
    "title": "Split architectural visualization with layered views",
    "category": "AI Art",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174889939-27-0.png",
    "height": "sm",
    "hot": false,
    "prompt": "{\n\"objective\": \"Create a split architectural visualization where the top is a detailed dark-themed blueprint and the bottom is a photorealistic house that matches the blueprint EXACTLY\",\n\"aspect_ratio\": \"3:4\",\n\"composition\": {\n\"layout\": \"vertical split\",\n\"top_section\": \"blueprint\",\n\"bottom_section\": \"realistic render\",\n\"alignment\": \"perfect structural correspondence between both sections\"\n},\n\"top_section\": {\n\"type\": \"architectural blueprint\",\n\"style\": \"dark luxury blueprint (similar to reference image 2)\",\n\"visual_style\": {\n\"background\": \"deep navy / charcoal blue\",\n\"lines\": \"thin glowing beige/gold lines\",\n\"walls\": \"slightly extruded 3D effect\",\n\"labels\": \"clean modern sans-serif\",\n\"lighting\": \"soft ambient glow\"\n},\n\"content\": {\n\"rooms\": [\n\"3 bedrooms (left, right, bottom-right)\",\n\"central living room\",\n\"kitchen + dining (top center)\",\n\"2 bathrooms\",\n\"garage (left side connected)\",\n\"front porch\",\n\"backyard pool with deck\"\n],\n\"details\": [\n\"furniture outlines (beds, sofa, dining table)\",\n\"door swings and openings\",\n\"window placements\",\n\"circulation paths\",\n\"exact proportions and spacing\"\n]\n}\n},\n\"bottom_section\": {\n\"type\": \"photorealistic house render\",\n\"constraint\": \"MUST MATCH THE BLUEPRINT EXACTLY — no added, removed, or shifted rooms\",\n\"architecture\": {\n\"style\": \"modern single-story house\",\n\"roof\": \"flat layered roof\",\n\"materials\": [\n\"smooth concrete walls\",\n\"wood panel accents\",\n\"large glass windows\"\n]\n},\n\"layout_mapping_rules\": [\n\"garage must be on the left side exactly as blueprint\",\n\"main entrance aligned with living room\",\n\"pool positioned in backyard matching blueprint dimensions\",\n\"window placements correspond to each room location\",\n\"bedroom volumes visible externally in correct positions\"\n],\n\"environment\": {\n\"setting\": \"suburban neighborhood\",\n\"elements\": [\n\"green lawn\",\n\"minimal landscaping\",\n\"clean driveway leading to garage\",\n\"pool deck matching blueprint footprint\"\n]\n},\n\"lighting\": {\n\"time\": \"golden hour\",\n\"style\": \"soft natural light with realistic shadows\"\n},\n\"camera\": {\n\"angle\": \"slightly elevated front perspective\",\n\"lens\": \"35mm architectural view\"\n}\n},\n\"consistency_rules\": [\n\"room positions must be identical between blueprint and render\",\n\"no extra structures added in render\",\n\"all doors and windows must align logically\",\n\"pool size and placement must match exactly\",\n\"garage placement must match blueprint\"\n],\n\"style\": {\n\"top\": \"architectural visualization (dark premium)\",\n\"bottom\": \"photorealistic modern house\",\n\"overall\": \"clean, high-end architectural presentation\"\n},\n\"negative_constraints\": [\n\"no mismatch between blueprint and render\",\n\"no extra rooms\",\n\"no fantasy elements\",\n\"no unrealistic proportions\",\n\"no cluttered environment\"\n]\n}\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-stylized-travel-poster-graphic-collage-fo-0752",
    "title": "Bike Rider Poster",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174890478-28-0.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "Create a stylized travel poster / graphic collage for Indore The main subject should be a stylish international tourist visiting Indore clearly presented as a traveler and not a local resident. Show the tourist wearing modern travel fashion, with details such as a camera, backpack, sunglasses, map, or suitcase, exploring the culture and atmosphere of Indore. Place the tourist in a dynamic composition surrounded by iconic architecture, streets, landscapes, landmarks, transportation, food, signage, and cultural elements associated with Indore. Blend realistic character detail with a graphic collage background made of layered paper textures, torn poster edges, sticker elements, halftone dots, editorial typography, and bold geometric shapes. Include authentic visual motifs from Indore, but keep the tourist’s appearance and styling globally fashionable and clearly foreign to the setting. Add a large readable headline: “VISIT Indore”. Modern, artistic, premium editorial travel poster aesthetic, balanced layout, print-worthy composition.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "minimalist-ultra-high-resolution-travel-sketch-pos-0999",
    "title": "Wedding Fantasy",
    "category": "Anniversary",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174890752-29-0.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "Minimalist ultra-high-resolution travel sketch poster of Sarafa Bazaar, Indore, on clean white sketchbook paper with subtle paper grain texture. Style: refined pen drawing + loose watercolor sketch. Delicate black ink linework, airy watercolor washes, elegant urban details. Show a calm everyday Indore street scene — the iconic old city lane lined with heritage havelis and carved wooden balconies, traditional mithai and namkeen stalls with brass trays, street food vendors serving poha and jalebi, people strolling in colourful attire, cycle-rickshaws and bicycles weaving through, a grand archway entrance to the bazaar, low-rise old architecture with ornate sandstone facades and latticed windows, all shop signs and signage strictly in English characters only (no Devanagari or Hindi script), fashionable and everyday Indore pedestrians, warm golden morning light filtering through old neem and banyan trees. Spacious editorial composition with generous negative space. Mood: nostalgic, warm, poetic, quietly vibrant. Typography: \"[INDORE]\" \"Everyday Urban Rhythm\" Premium travel sketch aesthetic, minimal and stylish, ultra-realistic watercolor + ink travel journal style, ultra-high-resolution, 9:16.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "semi-realistic-anime-inspired-portrait-of-a-stylis-1266",
    "title": "Army Portrait",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174890999-30-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Semi-realistic anime-inspired portrait of a stylish young Korean woman with a short glossy black bob tucked behind one ear, delicate round-frame glasses, and a gentle confident expression. She wears an oversized pastel lilac blouse with rolled sleeves paired with a flowing ivory A-line midi skirt. Full-body composition, standing casually with relaxed posture. Behind her is an artistic collage of hand-drawn monochrome character studies, loose pencil sketches, manga panels, playful doodles, stars, hearts, swirls, and handwritten notes scattered organically across the backdrop. Contemporary anime fashion illustration with mixed ink-and-pencil textures, clean linework, subtle cel shading, bright white background, magazine-cover aesthetic, highly detailed, ultra-sharp, vibrant yet elegant, 8K masterpiece.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "prompt-ultra-realistic-cinematie-fashion-portrait--1485",
    "title": "Soft Girl Era",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174891266-31-0.png",
    "height": "sm",
    "hot": false,
    "prompt": "PROMPT\nUltra realistic cinematie fashion portrait of a stylistrwomam wearing oversized black cat eye sunglasses, sott waim golden sunlight, hazy foreground blur creating drean depth shallow deptht of field, glowing skin, natural makeny,\nglossy nude lips, loose messy updo hairstyle with sott strands talling, black high-neck outfit, luxury editorial vibe Shor through translucent fabric for soft diffusion, 85mu lens, 18. creamy bokeh, golden hour lighting, warm beige color grading, high detail, photorealistic, Vogue style photography, soft focus edges, elegant and minimal background.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "ultra-realistic-fine-art-portrait-of-a-young-woman-1684",
    "title": "Athlete Action Shot",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174891485-32-0.png",
    "height": "md",
    "hot": false,
    "prompt": "Ultra realistic fine-art portrait of a young woman with soft aalteatures, minimal makeup, and calm introspective expre sion. Pastel muted background in sage green tones. Duleato flowers drifting across the frame in the foreground, creating intentional motion blur and soft streaks of light. Subtle double exposure and slow-shutter motion effects across face, dreamy and poetic atmosphere. Gentle diffused chting with smooth highlights on skin, natural texture pueserted. Elegant minimalist composition, emotional and erene mood, editorial fine-art photography style, shallow dep of field, cinematic softness, painterly realism, ultra high resolution, 8K quality\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-poetic-cinematic-portrait-of-a-young-woman-stand-1898",
    "title": "Long Distance Love",
    "category": "Anniversary",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174891684-33-0.png",
    "height": "lg",
    "hot": false,
    "prompt": "A poetic cinematic portrait of a young woman standing alone in a vast snowy iandscape, surrounded by distant frost-covered inountains. Her long auburn hair is caught mid motion by strong winter wind, strands flowing naturally across her face. She wears a work wool cool, minimal makeup, pale freckled skin, and a quiet, introspective expression. Soft snowfaill dritts through the air. Muted natural color palette with cold greys, soft whites, and warm corpen hag tones. Shallow depth of field, natural diffused davlight, overelaft sky, fine film grain, subtle motion blur in hair and snow, cinematic realism, emotional storytelling, editorial photography, 85mm lens look, ultra detailed, moody\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "reflection-in-glass-window-lavered-composition-sub-2511",
    "title": "Zodiac Poster",
    "category": "AI Art",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174891898-34-0.png",
    "height": "xl",
    "hot": false,
    "prompt": "Reflection in glass window, lavered composition, subject of a handsome man partially obscured. Fujifilm GFX1005, 80mm f/1.7 Natural diffused light Muted Portra LUT Aspect 3:4 harmony: 60% realism/40% artistic. sRef: layered documentary imagery. Hidden tokens: glass reflection blur, layered city depth.\"\n\\\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-high-fashion-magazine-pictorial-of-an-alpine-loo-2687",
    "title": "Couple Memories",
    "category": "Anniversary",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174892511-35-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "A high fashion magazine pictorial of an Alpine-looking man in him early 20s who stands still, looking at the camara, turning her head in the center, surrounded by a blurry silhouette of people passing by. She has a calm, stoic look on her face and is wearin, bright brightly albstract and emphasizes in contrast between motion blur and static appearance.\nEditing style, film composition, pure art photography, soft magazine texture, high resolution. -ar 4:5\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-high-fashion-magazine-pictorial-of-an-alpine-loo-2844-1",
    "title": "Romantic Anniversary",
    "category": "Anniversary",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174892687-35-1.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "A high fashion magazine pictorial of an Alpine-looking man in him early 20s who stands still, looking at the camara, turning her head in the center, surrounded by a blurry silhouette of people passing by. She has a calm, stoic look on her face and is wearin, bright brightly albstract and emphasizes in contrast between motion blur and static appearance.\nEditing style, film composition, pure art photography, soft magazine texture, high resolution. -ar 4:5\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-high-fashion-magazine-pictorial-of-an-alpine-loo-3031",
    "title": "3D Action Figure",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174892844-36-0.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "A high fashion magazine pictorial of an Alpine-looking man in him early 20s who stands still, looking at the camara, turning her head in the center, surrounded by a blurry silhouette of people passing by. She has a calm, stoic look on her face and is wearin, bright brightly albstract and emphasizes in contrast between motion blur and static appearance.\nEditing style, film composition, pure art photography, soft magazine texture, high resolution. -ar 4:5\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "analyze-the-uploaded-image-and-preserve-the-origin-3211",
    "title": "Luxury Car Portrait",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174893031-37-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Analyze the uploaded image and preserve the original subject, composition, and lighting. Do\nnot alter the identity or structure of the main subject. Add playful, hand-drawn doodles that\ninteract directly with the subject in the image. The doodles should mimic, follow, or\nexaggerate the shapes, gestures, or motion present—such as outlining poses, extending\nlimbs, adding motion lines, or creating imaginative elements that “respond” to the subject.￼\nEnsure the doodles feel naturally integrated into the scene, as if they were drawn on top of\nthe photo with intention. Use a sketchy, imperfect, hand-drawn style with organic lines,\nslightly uneven strokes, and a casual illustrated feel. Include whimsical handwritten text\nelements placed around the image. The text should match the mood or implied context of\nthe scene, with a playful and spontaneous tone.￼\nAvoid fixed phrases—generate context-aware, creative, and humorous text that fits each\nunique image. Maintain a balanced composition so the doodles enhance the image without\noverwhelming the original subject. Keep the overall aesthetic fun, expressive, and\nsocial-media-ready. High resolution, clean overlay, vibrant yet natural color harmony\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "analyze-the-uploaded-image-and-preserve-the-origin-3382-1",
    "title": "Vintage Film Couple",
    "category": "Anniversary",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174893211-37-1.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Analyze the uploaded image and preserve the original subject, composition, and lighting. Do\nnot alter the identity or structure of the main subject. Add playful, hand-drawn doodles that\ninteract directly with the subject in the image. The doodles should mimic, follow, or\nexaggerate the shapes, gestures, or motion present—such as outlining poses, extending\nlimbs, adding motion lines, or creating imaginative elements that “respond” to the subject.￼\nEnsure the doodles feel naturally integrated into the scene, as if they were drawn on top of\nthe photo with intention. Use a sketchy, imperfect, hand-drawn style with organic lines,\nslightly uneven strokes, and a casual illustrated feel. Include whimsical handwritten text\nelements placed around the image. The text should match the mood or implied context of\nthe scene, with a playful and spontaneous tone.￼\nAvoid fixed phrases—generate context-aware, creative, and humorous text that fits each\nunique image. Maintain a balanced composition so the doodles enhance the image without\noverwhelming the original subject. Keep the overall aesthetic fun, expressive, and\nsocial-media-ready. High resolution, clean overlay, vibrant yet natural color harmony\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "image-generation-request-prompt-details-create-a-h-4000",
    "title": "Neon Portrait Glow",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174893382-38-0.png",
    "height": "md",
    "hot": false,
    "prompt": "Image Generation Request ## Prompt Details Create a highly detailed image of myself standing in the midst of a dense, vibrant jungle. The atmosphere is lush and humid, with sunlight filtering through the canopy above. I am wearing a pair of sturdy hiking boots, long pants, and a comfortable, earth-toned shirt. My facial expression is one of awe and curiosity, with a slight smile as I gaze out at the jungle surroundings. The camera angle is from a slightly elevated perspective, looking down on me as I stand amidst the underbrush. The aesthetic style is photorealistic, with intricate details on the foliage, trees, and my clothing. The overall mood is serene and exploratory. ## Technical Specifications * Lighting: Soft, natural sunlight with dappled shadows * Color palette: Earthy tones with splashes of vibrant greens and blues * Composition: Rule of thirds, with me positioned off-center and the jungle foliage forming a frame around me * Style: Photorealistic, with high detail and texture\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-close-up-indoor-birthday-scene-captured-with-str-4157",
    "title": "Superhero Poster",
    "category": "Boys",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174894000-39-0.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "A close-up indoor birthday scene captured with strong on-camera direct flash.\nForeground (main focus): A hand holding a pastel pink instant camera (Instax Mini style),\nfreshly printed polaroid photo coming out from the top. She has soft almond nail with soft\npink with floral nail art polish and wears silver rings.\nInside The polaroid photo : [the attachment } making a kissy face while holding the same\nbouquet of flowers playful candid pose, soft direct flash look. She is wearing a soft blush pink\noff shoulder mini dress with lace details.\nBackground (softly blurred with shallow depth of field):\n• A round white birthday cake decorated with pink floral buttercream details and “Happy\nBirthday” written in script\n• A single lit candle glowing warmly\n• A large romantic bouquet of pink roses and soft green flowers arranged behind the cake\n• Wooden table surface with warm brown tone\nMood:\nWarm, intimate, nostalgic birthday atmosphere. Soft bokeh, creamy highlights, romantic\npastel tones.\nColor palette:\nBlush pink, warm ivory, soft green, baby blue, chocolate brown, golden candlelight.\nComposition:\nClose-up shot, slightly angled downward.\nMain focus on the polaroid print and camera in hand.\nBackground softly blurred with smooth bokeh.\nNatural candid aesthetic with cozy indoor vibes.\nLighting:\nWarm tungsten indoor lighting mixed with candle glow.\nSoft shadows.\nGentle highlight on the camera body.\nTexture details:\n• Matte cake frosting\n• Glossy candle flame\n• Soft velvety flower petals\n• Smooth plastic camera body\nAesthetic keywords:\npolaroid aesthetic, cozy birthday vibe, nostalgic film tone, warm indoor lighting, soft focus,\nshallow depth of field, romantic home celebration\n🎥 Camera Settings (To Recreate This Look)\nIf Using Mirrorless / DSLR:\nLens: 35mm or 50mm\nAperture: f/1.8 – f/2.2\nISO: 400 – 800 (depending on indoor light)\nShutter Speed: 1/100 – 1/160\nWhite Balance: Tungsten / 3200K – 3800K\nFocus Mode: Single-point AF on polaroid print\nThe flash creates: • Bright, crisp highlights on the plastic camera body\n• Hard shadows behind the hand and camera\n• Strong texture on the cake frosting\n• Slight shine on the nail polish\n• High contrast between subject and background\nMidground: The polaroid print shows a darker birthday setup with cake and flowers.\nBackground:\n• Round white birthday cake with pink buttercream floral piping\n• “Happy Birthday” chocolate writing\n• A single candle (flame slightly overexposed from flash reflection)\n• Large pink rose bouquet behind\n• Wooden table surface\nLighting style:\nHarsh direct flash, frontal lighting\nNoticeable shadow falloff\nSlightly overexposed highlights\nCool flash tone mixed with warm indoor ambient light\nMood:\nY2K, nostalgic party snapshot, casual candid, early 2000s digital camera vibe, chaotic cute,\nglossy textures\nColor tone:\nCooler whites from flash\nPink tones slightly saturated\nBackground slightly darker due to flash falloff\nTexture emphasis:\nFlash enhances cake frosting detail\nPetal texture more visible\nPlastic camera looks glossy\nSkin slightly brightened with flash reflection\nAesthetic keywords:\ndirect flash aesthetic, Y2K birthday vibe, digital camera 2005, party snapshot, glossy\nhighlights, harsh shadow, candid celebration\n🎥 Camera Settings for Direct Flash Look\nDSLR / Mirrorless:\nLens: 35mm or 50mm\nAperture: f/4 – f/5.6 (sharper look)\nISO: 200 – 400\nShutter Speed: 1/125\nWhite Balance: Flash (5500K)\nFlash: On-camera direct flash (no diffuser)\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "a-close-up-indoor-birthday-scene-captured-with-str-4350-1",
    "title": "Manga Character Sheet",
    "category": "AI Art",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174894157-39-1.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "A close-up indoor birthday scene captured with strong on-camera direct flash.\nForeground (main focus): A hand holding a pastel pink instant camera (Instax Mini style),\nfreshly printed polaroid photo coming out from the top. She has soft almond nail with soft\npink with floral nail art polish and wears silver rings.\nInside The polaroid photo : [the attachment } making a kissy face while holding the same\nbouquet of flowers playful candid pose, soft direct flash look. She is wearing a soft blush pink\noff shoulder mini dress with lace details.\nBackground (softly blurred with shallow depth of field):\n• A round white birthday cake decorated with pink floral buttercream details and “Happy\nBirthday” written in script\n• A single lit candle glowing warmly\n• A large romantic bouquet of pink roses and soft green flowers arranged behind the cake\n• Wooden table surface with warm brown tone\nMood:\nWarm, intimate, nostalgic birthday atmosphere. Soft bokeh, creamy highlights, romantic\npastel tones.\nColor palette:\nBlush pink, warm ivory, soft green, baby blue, chocolate brown, golden candlelight.\nComposition:\nClose-up shot, slightly angled downward.\nMain focus on the polaroid print and camera in hand.\nBackground softly blurred with smooth bokeh.\nNatural candid aesthetic with cozy indoor vibes.\nLighting:\nWarm tungsten indoor lighting mixed with candle glow.\nSoft shadows.\nGentle highlight on the camera body.\nTexture details:\n• Matte cake frosting\n• Glossy candle flame\n• Soft velvety flower petals\n• Smooth plastic camera body\nAesthetic keywords:\npolaroid aesthetic, cozy birthday vibe, nostalgic film tone, warm indoor lighting, soft focus,\nshallow depth of field, romantic home celebration\n🎥 Camera Settings (To Recreate This Look)\nIf Using Mirrorless / DSLR:\nLens: 35mm or 50mm\nAperture: f/1.8 – f/2.2\nISO: 400 – 800 (depending on indoor light)\nShutter Speed: 1/100 – 1/160\nWhite Balance: Tungsten / 3200K – 3800K\nFocus Mode: Single-point AF on polaroid print\nThe flash creates: • Bright, crisp highlights on the plastic camera body\n• Hard shadows behind the hand and camera\n• Strong texture on the cake frosting\n• Slight shine on the nail polish\n• High contrast between subject and background\nMidground: The polaroid print shows a darker birthday setup with cake and flowers.\nBackground:\n• Round white birthday cake with pink buttercream floral piping\n• “Happy Birthday” chocolate writing\n• A single candle (flame slightly overexposed from flash reflection)\n• Large pink rose bouquet behind\n• Wooden table surface\nLighting style:\nHarsh direct flash, frontal lighting\nNoticeable shadow falloff\nSlightly overexposed highlights\nCool flash tone mixed with warm indoor ambient light\nMood:\nY2K, nostalgic party snapshot, casual candid, early 2000s digital camera vibe, chaotic cute,\nglossy textures\nColor tone:\nCooler whites from flash\nPink tones slightly saturated\nBackground slightly darker due to flash falloff\nTexture emphasis:\nFlash enhances cake frosting detail\nPetal texture more visible\nPlastic camera looks glossy\nSkin slightly brightened with flash reflection\nAesthetic keywords:\ndirect flash aesthetic, Y2K birthday vibe, digital camera 2005, party snapshot, glossy\nhighlights, harsh shadow, candid celebration\n🎥 Camera Settings for Direct Flash Look\nDSLR / Mirrorless:\nLens: 35mm or 50mm\nAperture: f/4 – f/5.6 (sharper look)\nISO: 200 – 400\nShutter Speed: 1/125\nWhite Balance: Flash (5500K)\nFlash: On-camera direct flash (no diffuser)\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-stylized-travel-poster-graphic-collage-fo-4569",
    "title": "Birthday Celebration",
    "category": "Birthday",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174894350-40-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Create a stylized travel poster / graphic collage for [CITY/COUNTRY]. The main subject\nshould be a stylish international tourist visiting [CITY/COUNTRY], clearly presented as a\ntraveler and not a local resident. Show the tourist wearing modern travel fashion, with details\nsuch as a camera, backpack, sunglasses, map, or suitcase, exploring the culture and\natmosphere of [CITY/COUNTRY].\nPlace the tourist in a dynamic composition surrounded by iconic architecture, streets,\nlandscapes, landmarks, transportation, food, signage, and cultural elements associated with\n[CITY/COUNTRY]. Blend realistic character detail with a graphic collage background made\nof layered paper textures, torn poster edges, sticker elements, halftone dots, editorial\ntypography, and bold geometric shapes. Include authentic visual motifs from\n[CITY/COUNTRY] but keep the tourist’s appearance and styling globally fashionable and\nclearly foreign to the setting.\nAdd a large readable headline: “LOST IN [CITY/COUNTRY]”. Modern, artistic, premium\neditorial travel poster aesthetic, balanced layout, print-worthy composition.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "convert-this-image-into-a-soft-handcrafted-paper-c-5028",
    "title": "Whimsical Hand Drawn",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174894569-41-0.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "Convert this image into a soft, handcrafted paper-cut layered illustration style, inspired by\npapercraft diorama aesthetics. Use smooth rounded shapes, simplified cute character\nproportions, and minimal facial details (dot eyes, blush cheeks) to create a warm, charming\nlook. Apply stacked paper layers with visible depth, subtle shadows between layers, and\nclean cut edges that resemble laser-cut cardstock. Add a distinct white outer outline layer\nsurrounding each main character, resembling a thick sticker border or white cut-paper\nbacking, clearly separating the characters from the background. This white layer should feel\nlike an intentional paper layer, not a glow. Use a pastel color palette with muted blues,\ngreens, and warm neutrals, balanced and calming. Lighting should feel soft, diffused, and\neven, enhancing the dimensional paper layers without harsh contrast.Textures should\nappear matte and tactile, like thick art paper or craft foam. Overall mood: cozy, wholesome,\ngentle, and storybook-like, with a playful yet polished handcrafted feel suitable for modern\nillustration, children’s books, or decorative art.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "transform-the-uploaded-photo-into-sticker-collage--5580",
    "title": "Sticker Collage Scrapbook",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174895028-42-0.png",
    "height": "lg",
    "hot": false,
    "prompt": "Transform the uploaded photo into Sticker Collage Scrapbook Cover Effect. Use the\nuploaded image as the ONLY identity reference for the subject. Preserve identity, face\nshape, hairstyle, expression, outfit cues, and overall recognizability while rendering the final\nconcept in a polished, premium, highly shareable way. Build the full scene around the exact\nvisual language implied by the title. Keep the subject clearly readable. Add the right\natmosphere, props, and composition cues to make the concept instantly understandable.\nNegative constraints. No identity drift, no extra people, no broken anatomy, no muddy\nrendering, no generic AI artifacts, and no irrelevant mixed styles.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-premium-high-quality-3d-caricature-compan-5765",
    "title": "3D Caricature Companion",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174895581-43-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Create a premium high-quality 3D caricature companion of the person in the reference\nimage while keeping the original realistic person fully present and untouched. The realistic\nperson must remain photorealistic, highly detailed and faithful to the original photo. Create a\nstylized 3D caricature version of the SAME person standing beside them.\nPreserve the same: outfit, hairstyle, accessories, fashion styling, identity, facial resemblance,\nattitude and vibe.\nThe caricature must have: large expressive eyes, slightly oversized head, smooth cinematic\nskin, Pixar/Disney-inspired premium 3D styling, smaller body proportions, but still look\nfashionable and recognizable, NOT childish, toy-like or baby-sized.\nIMPORTANT: The caricature height should be approximately shoulder to ear level of the real\nperson, never tiny or child-sized. The caricature and real person must be physically and\nemotionally interacting naturally.\nExamples of interaction: holding hands, looking at each other, walking together, sharing an object, leaning, playful pose, touching shoulder, mirroring pose, reacting to each\nother, casual chemistry, candid companionship.\nThe caricature should feel like a living animated version of the same person existing in the\nsame world. Preserve original scene, lighting and perspective whenever possible.\nProfessional photography composition, cinematic lighting, realistic shadows, luxury editorial\nrealism mixed with premium stylized 3D animation. No tiny companion, no side mascot, no\ndisconnected pose, no separate standing character, no toy proportions, no plastic doll look,\nno replacing the original person.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "i-am-libra-create-a-poster-inspired-by-yumi-s-cell-5992",
    "title": "Zodiac Chibi Cells",
    "category": "AI Art",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174895766-44-0.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "I’am “Libra” Create a poster inspired by Yumi’s Cells with the same soft, aesthetic,\nslice-of-life vibe and background style, the zodiac theme is fully reflected in the design. The\nsubject’s face must remain completely unchanged and untouched. Surround the subject with\nmultiple small, raw yet realistic cute chibi-style mini 3D versions of the subject, designed like\nexpressive “cells” with oversized heads, glossy high-detail finishes, and playful emotions.\nEach mini character represents traits associated with the zodiac sign and is engaged in\ndifferent actions: * one clinging onto the subject’s arm * one cheering with arms raised * one\nreading a book * one drinking coffee * one lying down using a phone * one making a wacky\nexaggerated face * one looking tired or stressed * one shouting energetically * one with\nmessy or chaotic hair energy posture, and behavior.Overall style: clean aesthetic\ncomposition, white sticker outlines, soft pastel color palette, high-detail glossy 3D chibi look,\ncute Korean-inspired design. Add playful hand-drawn doodles interacting directly with the\nsubject and chibi characters—outlining poses, extending limbs, adding motion lines, and\nvisually reacting to their actions to enhance movement and storytelling. Each chibi “cell”\nshould visually reflect personality traits of the zodiac sign through their expressions. Use a\n4:5 vertical aspect ratio, raw natural poster feel, with the zodiac identity clearly integrated\ninto the overall concept.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "please-transform-the-entire-image-into-a-single-de-6416",
    "title": "Folk Doodle Illustration",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174895992-45-0.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "Please transform the entire image into a single Decorative Folk Flat Illustration with Doodle\nelements. Use a bold and playful color palette, completely different from the original image.\nSimplify all details into clean, flat shapes with a handmade, slightly imperfect feel, as if\ndrawn on a sheet of white paper. The overall style should look cute, childlike, and whimsical.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-an-infographic-image-of-love4prompts-combin-6746",
    "title": "Technical Blueprint",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174896416-46-0.png",
    "height": "lg",
    "hot": false,
    "prompt": "Create an infographic image of love4prompts , combining a realistic photograph or\nphotoreal render of the object with technical annotation overlays placed directly on top.\nUse black ink–style line drawings and text (technical pen / architectural sketch look) on a\npure white studio background, including:\n•Key component labels\n•Internal cutaway or exploded-view outlines\n•Measurements, dimensions, and scale markers\n•Material callouts and quantities\n•Arrows indicating function, force, or flow (air, sound, power, pressure)\n•Simple schematic or sectional diagrams where relevant\nPlace the title [OBJECT NAME] inside a hand-drawn technical annotation box in one corner.\nStyle & layout rules:\n•The real object remains clearly visible beneath the annotations\n•Annotations feel sketched, technical, and architectural\n•Clean composition with balanced negative space\n•Educational, museum-exhibit / engineering-manual vibe\nVisual style:\nMinimal technical illustration aesthetic, black linework over realistic imagery, precise but\nslightly hand-drawn feel.\nColor palette:\nWhite background, black annotation lines and text only. No colors.\nOutput:\n1080×1080, ultra-crisp, social-feed optimized, no watermark.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "make-the-attached-image-into-a-collage-artwork--7216",
    "title": "Torn Magazine Collage",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174896746-47-0.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Make the attached image into a collage artwork.\nNewspapers, magazines, and leaflets are torn by hand and pasted with glue, all expressions\nare completed with large torn paper. The torn section, crumping, overlapping, full mark, etc.\nof the paper are expressed in detail.\nDon't use the pieces of paper too small, place them randomly at different angles and\ndirections, the direction of the paper rotates randomly, and make it like a real collage that a\nperson roughly pasted by hand.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "analyze-the-uploaded-image-and-preserve-the-origin-7629",
    "title": "Crayon Doodle Background",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174897216-48-0.png",
    "height": "sm",
    "hot": false,
    "prompt": "Analyze the uploaded image and preserve the original subject, composition, and lighting\nexactly. Do not alter the identity, pose, clothing, or structure of the main subject in any way.\nReplace only the background with a whimsical, hand-drawn crayon or colored pencil doodle\nscene on a white or off-white paper-like surface.\nThe doodle background should feel like a child's imaginative drawing — featuring loose,\nexpressive strokes with bold outlines, simple shapes, and playful details like a smiling sun,\nfluffy clouds, scribbled grass, birds, or other scene-appropriate elements. The subject must\nremain photorealistic and sharp, while the background is fully illustrated in doodle style. The\ntwo elements should blend naturally at the edges — no hard cutouts or visible masking.\nMatch the doodle's color palette loosely to the subject's outfit or mood for a cohesive,\nstorybook feel. Overall aesthetic: joyful, cute, and whimsical — like the subject stepped into\na hand-drawn world.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "ultra-realistic-iphone-lockscreen-wallpaper-trendy-7861",
    "title": "Couple iPhone Lockscreen",
    "category": "Anniversary",
    "img": "/images/trends/couple_lockscreen.png",
    "height": "md",
    "hot": false,
    "prompt": "Ultra realistic iPhone lockscreen wallpaper, trendy couple photographed from an extreme\nlow-angle perspective as if the camera is placed on the ground looking upward. Beautiful\nwoman wearing neon red sweatshirt, neon red sweat pants, white sneakers, making a peace\nsign. Man wearing neon red sweatshirt, neon red sweat pants, white sneakers, stepping\nconfidently toward the camera. Bright blue sky background. Colorful doodle flowers, yellow\ndashed outline surrounding both characters, white sketch lines, hearts, sparkles and playful\nsticker elements. Realistic iPhone lockscreen overlay with Dynamic Island, lock icon, large\nclock 09:41, Saturday May 16, battery 92%, weather widget and notification cards. Tiny chibi\nversions of the couple standing near the clock. Apple keynote quality, ultra realistic, 8K\nmasterpiece wallpaper. Dont change face rasio 3:4. make it HD\nwe have attatched the images make sure you combine them !\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-a-clean-minimal-high-end-facial-aesthetic-r-8152",
    "title": "Facial Aesthetic Report",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174897861-50-0.png",
    "height": "lg",
    "hot": false,
    "prompt": "Create a clean, minimal, high-end facial aesthetic report based on the uploaded photo, using\na black-on-white editorial design with thin linework, rounded cards, generous spacing,\nmodern typography, and a refined luxury feel. Include an isolated front-facing image of the\nface, presented as an analytical attractiveness-assessment diagram. Provide an honest,\nobjective evaluation of facial attractiveness potential, avoiding excessive flattery and\nfocusing on symmetry, facial thirds, overall proportions, eye spacing and shape, nose\nharmony, lip proportions, jawline, chin, cheekbone structure, skin texture and tone, hairline,\nhairstyle, grooming, overall facial harmony, and photogenic potential. Assign clear, realistic\nscores to each major category, along with one overall attractiveness-potential score, keeping\nthe ratings grounded, useful, and not artificially inflated. Include practical, achievable\nrecommendations to improve attractiveness-potential, covering grooming, haircut, facial hair,\nskincare, eyebrow shaping, posture, weight loss, minor aesthetic procedures, styling, and\nphoto presentation. Maintain a refined, direct, constructive tone that feels elegant, credible,\nand easy to understand, with an emphasis on actionable improvement that build on the\nsubject's existing strengths.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "create-an-ultra-high-resolution-typography-based-t-8547",
    "title": "City Typography Poster",
    "category": "Posters",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174898152-51-0.png",
    "height": "xl",
    "hot": false,
    "prompt": "Create an ultra-high-resolution typography-based travel poster design themed around\nWales City UK !\nAdd a water mark on the top right love4prompts\nAspect ratio: (16:9 poster)\nIMPORTANT:\nAll visible text inside the poster must be in English only.\nTypography must be perfectly spelled and professionally typeset.\nAbsolutely no distorted letters, random symbols, broken text, or AI-generated gibberish.\nAspect ratio: 16:9 poster\nCORE COMPOSITION:\nPlace the giant English word “[CITY_NAME]” prominently in the center of the composition\nEach individual letter should contain a different illustrated scene from the city\nLetters should be tall, elongated, bold sans-serif forms\nThe typography itself should feel like a series of “city gallery windows”\nDistribute landmarks, streets, transportation, nature, culture, and architecture naturally\nacross the letters\nScenes should visually flow from one letter into another like one connected urban panorama\nTOP HORIZONTAL STRIP:\nAt the top of the poster, include a thin panoramic horizontal strip containing:\ncity skyline silhouettes\ncars\ntrams or trains\nboats if relevant\nbirds\nclouds\nsun\nAll elements should appear minimalist, elegant, and rhythmically balanced.\nSTYLE:\nmid-century modern editorial poster,\nSwiss graphic design,\nminimal vector illustration,\narchitectural infographic aesthetic,\ntravel typography poster,\nflat geometric illustration,\nultra clean composition,\npremium magazine design,\nscreenprint poster feeling,\nretro-futuristic travel branding\nILLUSTRATION STYLE:\nflat vector shapes only\nno realism\nno gradients\nno texture noise\nclean geometric shadows\nsimplified architectural forms\nmap-like top-down illustration mixed with side-view cityscape\nsubtle line-art details\nperfectly clean vector edges\nstrong negative space usage\nharmonious visual rhythm between letters\nTYPOGRAPHY:\ngiant bold sans-serif typography\nletters occupy most of the canvas height\nultra precise alignment\neach letter acts as an independent framed illustration panel\nsmooth rounded corners where appropriate\neditorial spacing\nhighly balanced composition\ntypography must look professionally designed, print-ready, and geometrically perfect\nCOLOR PALETTE:\nAutomatically derive a cohesive palette inspired by [CITY_NAME].\nExamples:\ncoastal city → aqua, sand, coral, muted teal\ndesert city → terracotta, beige, warm cream\ncyber city → mint, navy, steel blue\nhistoric European city → dusty rose, olive green, parchment\nUse:\nmuted pastel tones\nsoft vintage travel poster colors\nelegant low-saturation combinations\nmaximum 4–6 colors only\nCONTENT GENERATION:\nAutomatically include:\niconic landmarks of [CITY_NAME]\nfamous streets and transportation\nlocal urban patterns\nnearby nature elements\nskyline silhouettes\nbridges, rivers, or coastline if relevant\nculturally symbolic architecture\nrecognizable local atmosphere\nCOMPOSITION:\ncentered typography composition\nwhite or soft ivory background\nlots of breathing room\ntop panoramic strip balances the heavy typography below\nasymmetrical but visually balanced layout\neach letter contains different scene depth and perspective\npremium poster hierarchy with museum-quality layout\nMOOD:\npremium,\nintellectual,\ncalm,\ndesign-forward,\ntravel editorial aesthetic,\nstylish enough for a museum gift shop poster\nQUALITY:\n8K ultra detailed,\nprint-ready,\nextremely sharp vector edges,\nperfect typography rendering,\nclean professional graphic design,\nhigh-end editorial poster quality,\nno distorted text,\nno random characters,\nno spelling errors,\nno AI artifacts\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "transform-the-provided-reference-image-into-a-cozy-8724",
    "title": "Cozy Scrapbook Chibi",
    "category": "Girls",
    "img": "/images/trends/birthday_chibi.png",
    "height": "sm",
    "hot": false,
    "prompt": "Transform the provided reference image into a cozy aesthetic scrapbook-style composition\nwhile strictly preserving the original subject, identity, pose, lighting, and background.\nAdd multiple small “mini version” characters of the same person (chibi / doll-like style),\nplaced naturally around the scene (on objects, table, shoulder, etc.). These mini figures must\nmatch the subject’s face, hairstyle, outfit, and vibe consistently, styled as cute 3D collectible\nfigurines. Show them doing different activities (reading, posing, taking photos, relaxing).\nOverlay handwritten-style doodles and annotations across the image: arrows, hearts, stars,\nsparkles, icons, and playful captions connected to elements in the scene.\nUse a soft pastel color palette (white base with pink, peach, blue accents).\nKeep the frame visually rich and filled but balanced and clean.\nStyle: warm, cozy lighting, dreamy Instagram scrapbook aesthetic, soft depth of field, highly\ndetailed, polished but playful.\nThe final result must look like the SAME original image enhanced with mini alter-egos and\naesthetic annotations — not a recreated or different scene.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "-create-a-personal-color-analysis-graphic-using-th-9203",
    "title": "Color Analysis Graphic",
    "category": "Girls",
    "img": "https://frcmwpzmnweyxqtdgxkb.supabase.co/storage/v1/object/public/prompts/prompt-img-v2-1781174898724-53-0.png",
    "height": "md",
    "hot": false,
    "prompt": "🌈 Create a personal color analysis graphic using this portrait. Show side-by-side clothing\ncolor comparisons to highlight which colors suit the subject best. Make it visual-first, with\nshort labels only and no paragraphs.\n💇🏼‍♂️Create a hairstyle analysis graphic using this portrait. Show side-by-side hairstyles\ncomparisons to highlight which hairstyles suit the subject best. Make it visual-first, with short\nlabels only and no paragraphs.\n💄Create a visual makeup analysis graphic using this portrait. Feature side-by-side\ncomparisons to determine which makeup best suits the subject, and showcase their skin\nundertone. The graphic should be visual-first, using only short labels with no paragraphs.\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "transform-this-image-upload-your-reference-image-i-9390",
    "title": "Neon Ghost Portrait",
    "category": "Boys",
    "img": "/images/trends/neon_ghost_portrait.png",
    "height": "lg",
    "hot": false,
    "prompt": "Transform this image [UPLOAD YOUR REFERENCE IMAGE] into a 64K ultra-hyperrealistic\ncinematic studio portrait of the exact same person as the uploaded reference image —\npreserving complete facial identity, gender, skin tone, facial structure, and all natural features\nwith zero alteration.\nSubject & Identity (Auto-Detected from Reference): Reconstruct the subject with 100% facial\naccuracy: same face shape, jawline, nose, eyes, lip structure, skin tone, hair style, and all\ndefining features exactly as seen in the reference. The face must be hyper-realistic,\nrazor-sharp, and identity-locked — no idealization, no stock face blending, no age or gender\nmodification.\nIf male: preserve masculine bone structure, beard/stubble (if present), hair style\nIf female: preserve feminine facial structure, natural hair, skin smoothness with pore detail\nClothing & Styling: Subject wears a minimalist oversized plain white t-shirt — clean, no\nlogos, no graphics. Streetwear simplicity. Shoulders relaxed, posture calm and still. A thin,\ndelicate chain necklace optionally visible at the collarbone. The fabric shows soft natural\ncreases and catches cool-toned key light on one side and warm amber fill on the other.\nPose & Expression: Subject standing still, shoulders relaxed, head slightly tilted, delivering a\ndirect, calm gaze straight into the camera. Expression is neutral and introspective — quiet confidence, emotional depth, modern editorial energy. No forced smile. No exaggerated\nemotion. Just raw, still presence.\nSignature Effect — Neon Double Exposure Ghosting: Apply a long-exposure /\ndouble-exposure ghost effect:\nTwo faint, semi-transparent offset duplicates of the subject appear behind the main figure —\none slightly left, one slightly right\nGhost duplicates are slightly transparent with soft motion blur — they feel like echoes or\nshadows of the subject\nThe main subject remains perfectly sharp — the ghosts recede into the background\nAdd thin vertical light streak artifacts across the frame for a film scan / analog feel\nThe ghosting creates a surreal, cinematic depth — like a soul splitting or time layering\nLighting Setup — Dramatic Neon Split-Gel:\nKey Light (Left side): Cool cyan/blue gel wash — color temperature approx. 6500–8000K —\ncasting a cold, electric blue tone across one side of the face, neck, and shirt\nRim/Fill Light (Right side): Warm amber/orange gel — color temperature approx.\n2400–3200K — wrapping around the opposite side of the face and shoulder\nResult: Strong teal-orange contrast split across the face and body — cinematic, editorial,\nhigh-fashion\nShadows: Clean, controlled, soft bloom — no harsh unnatural shadows\nNo overhead flash, no flat lighting — all gel-sculpted directional light\nBackground: Seamless saturated blue gradient studio backdrop — smooth, deep blue wash.Approximate hex range: #0B5FA6 to #12A6C9 — rich, saturated, slightly glowing. Subtle\nbackground haze for atmospheric depth. The ghost duplicates of the subject blend into this\nbackdrop, slightly fading at their edges.\nSkin & Facial Texture (Critical): A high-resolution, hyper-realistic skin texture — zero face\nblur, zero motion blur on the main subject. Ultra-visible pores, fine lines, micro skin detail,\nnatural skin imperfections. The neon split lighting should reveal skin texture dramatically —\ncool blue on one half, warm amber on the other. 8K facial clarity, Octane Render precision,\nUnreal Engine 5 skin shader. The face is the absolute anchor of sharpness in the entire\ncomposition.\nFraming & Composition:\nVertical 4:5 framing (portrait orientation)\nMedium shot — from mid-torso to top of head\nCentered symmetrical composition — subject in the middle of the frame\nGhost duplicates flanking left and right behind the subject\nLens simulation: 50mm–85mm, aperture f/2–f/2.8\nShallow depth of field — crisp focus on eyes and face, background softly falls off\nColor Grading & Mood:\nDominant palette: Deep electric blue + warm amber/orange neon contrast\nStrong teal-orange color split — cinematic color theory\nSlight desaturation in midtones for a moody, editorial film look\nSubtle cool color cast in shadows, warm neon glow in highlights\nMood: modern · moody · introspective · editorial · high-fashion · cinematic\nTexture & Fine Detail:\nSoft analog film grain overlay for organic texture\nThin vertical light scan lines for film/scan artifact feel\nFine detail in fabric weave of white t-shirt\nNatural skin imperfections preserved — not retouched to plastic\nSubtle lens flare bloom from the neon gel lights at frame edges\nAdd WaterMark on top right or on bottom left with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-160",
    "title": "Love4prompts #59",
    "category": "Boys",
    "img": "/images/prompts57/image1.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Couple Sitting on Coffee Cups Prompt Transform this cozy coffee photo into a dreamy, romantic café aesthetic with adorable cartoon-style illustrated characters sitting naturally on the coffee cups. Keep the original cups, table, background blur, steam, lighting, and perspective intact while blending the illustration seamlessly into the scene. Add tiny floating hearts, soft glow, subtle sparkles, blush details, and hand-drawn doodles for a warm wholesome vibe. The characters should look playful, affectionate, and expressive, as if they are part of the real environment. Use soft cinematic café lighting, creamy brown tones, gentle shadows, and cozy depth of field. Make the overall image feel candid, intimate, and Pinterest-worthy with a cute storytelling atmosphere.\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-161",
    "title": "Love4prompts #60",
    "category": "Girls",
    "img": "/images/prompts57/image2.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Prompt \nname :\n Cartoon Girl Sitting on Coffee Cup Prompt\nTransform this coffee photo into a cozy aesthetic social-media-style snapshot featuring a cute illustrated girl sitting naturally on top of the coffee cup lid. Preserve the original hand, cup, café background, lighting, and composition while blending the character seamlessly into the scene. Add soft doodle outlines, subtle glow, tiny sparkles, pastel accents, and gentle motion lines around the character for a playful vibe. Keep the illustration stylish, wholesome, and slightly minimalist with expressive features and soft blush details. Use warm café tones, smooth depth of field, creamy highlights, and a clean trendy Pinterest/Instagram aesthetic. The final image should feel cozy, artsy, and effortlessly cute.\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-162",
    "title": "Love4prompts #61",
    "category": "AI Art",
    "img": "/images/prompts57/image3.png",
    "height": "md",
    "hot": false,
    "prompt": "Prompt \nname :\n Outdoor Café Croissant Character Prompt\nTransform this outdoor café breakfast photo into a dreamy European café aesthetic with a cute chibi-style illustrated character sitting beside the food naturally within the scene. Preserve the original croissant, bread basket, table setup, café background, sunlight, and perspective while adding playful hand-drawn doodles, sparkles, arrows, handwritten labels, and tiny whimsical details. Blend the cartoon character seamlessly into the environment so it feels naturally part of the candid moment. Use warm golden-hour lighting, creamy pastel tones, soft glow, and shallow depth of field for a cozy lifestyle vibe. Keep the composition clean, aesthetic, adorable, and social-media-ready with a charming Pinterest café atmosphere.\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-163",
    "title": "Love4prompts #62",
    "category": "Girls",
    "img": "/images/prompts57/image4.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "Use the uploaded person photo exactly as it is, preserve the original face, hairstyle, skin tone, body shape, pose and outfit naturally without changing identity. Place the person standing in front of the exact same artistic street art wall mural background featuring a giant anime-style girl face with big expressive eyes, black flowing hair and blooming pink flowers growing from the head, textured white wall, scattered flower petals, realistic painted mural details, urban roadside setting, cinematic street art aesthetic. Blend the person naturally into the scene with realistic perspective, matching shadows and lighting. Add soft golden hour sunlight, warm cinematic tones, shallow depth of field, ultra realistic DSLR photography look, detailed textures, aesthetic Instagram vibe, premium \ncolor\n grading, realistic environment, soft natural glow, highly detailed mural art, 4k quality, vertical composition --\nar\n 3:4\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-164",
    "title": "Love4prompts #63",
    "category": "Girls",
    "img": "/images/prompts57/image5.png",
    "height": "xl",
    "hot": false,
    "prompt": "Generate a close-up portrait of the same girl with a soft elegant pose, slightly turned face looking away, natural expression, dark brown hair styled in a messy updo with loose face-framing bangs, glowing smooth skin with soft blush across cheeks and nose, subtle freckles, glossy mauve nude lips, defined brows, long lashes with soft brown eyeshadow, shimmer on the corner of eyes & on nose, shiny, minimal clean girl makeup look, warm neutral tones. Wearing gold hoop earrings & layered delicate\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-165",
    "title": "Love4prompts #64",
    "category": "AI Art",
    "img": "/images/prompts57/image6.png",
    "height": "sm",
    "hot": false,
    "prompt": "Avoid fixed phrases-generate context-aware, creative, and humorous text that fits each unique image. Maintain a balanced composition so the doodles enhance the image without overwhelming the original subject. Keep the overall aesthetic fun, expressive, and social-media-ready. High resolution, clean overlay, vibrant yet natural \ncolor\n harmony.\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-166",
    "title": "Love4prompts #65",
    "category": "AI Art",
    "img": "/images/prompts57/image7.jpeg",
    "height": "md",
    "hot": false,
    "prompt": "Ensure the doodles feel naturally integrated into the scene, as if they were drawn on top of the photo with intention. Use a sketchy, imperfect, hand-drawn style with organic lines, slightly uneven strokes, and a casual illustrated feel. Include whimsical handwritten text elements placed around the image. The text should match the mood or implied context of the scene, with a playful and spontaneous tone.\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-167",
    "title": "Love4prompts #66",
    "category": "AI Art",
    "img": "/images/prompts57/image8.jpeg",
    "height": "lg",
    "hot": false,
    "prompt": "Use a real face as a reference photo The background is the same as in the photo. The lighting is warm, soft, and clean, with subtle shadows. Around the image add several mini chibi (3D cute style) version of the Character, \nWhile\n maintaining the original facial features. Expressions: jumping cheerfully waving sitting relaxed holding a drink cute and playful expressions Add hand-drawn white doodle elements: outline around the main body stars, hearts, sparkless motion lines small cute icons Add aesthetic handwriting such as: \"shine,\" \"bright \"day, \"happy, smile, \nect\n. (Casual doodle font) overall style: clean & aesthetic composition white sticker outline soft pastel colour tone high \ndetaill\n 3D chibi glossy look cute \nkorean\n style \ninstagrammable\n.\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-168",
    "title": "Love4prompts #67",
    "category": "Boys",
    "img": "/images/prompts57/image9.jpeg",
    "height": "xl",
    "hot": false,
    "prompt": "Cinematic portrait of a young woman/man standing side by side with her miniature version against a textured dark wall background. Both are wearing matching dresses with their hands folded gracefully. The adult woman/man leans slightly with a soft gentle smile while the miniature version has a cute cartoon style face with large depressive eyes.\nHandwritten cursive signature text \"Miniature me\" appears artistically on the wall.\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  },
  {
    "slug": "love4prompts-new-169",
    "title": "Love4prompts #68",
    "category": "Posters",
    "img": "/images/prompts57/image10.jpeg",
    "height": "sm",
    "hot": false,
    "prompt": "Create a cinematic double-exposure travel poster for \"Rishikesh, Uttarakhand\" using my uploaded photo. Keep the same face, pose, outfit, and natural features unchanged. Blend Himalayan valleys, pine forests, misty mountains, winding roads, rivers, and clouds inside the portrait silhouette. Add a small full-body version beside a bike on a mountain road. Style: luxury Himalayan tourism campaign, dreamy matte tones, soft fog, atmospheric depth, realistic blending, minimal typography, clean white background, ultra-realistic editorial aesthetic. Text: \"Rishikesh\" \"Uttarakhand\" \"TRAVEL \nBREATHE .\nESCAPE\" don't change face keep them exactly how they \nare !\n make sure you use both the \nimages !\nAdd WaterMark on top not on bottom ! with word : love4prompts"
  }
];

export const CATEGORIES = [
  "Boys",
  "Girls",
  "Professional",
  "AI Art",
  "Birthday",
  "Festivals",
  "Posters",
  "Netflix Typography",
  "Memories",
  "Anniversary",
  "Image",
  "Design",
  "Storytelling"
];

export const createUrlFor = (slug: string) => {
  const trend = TRENDS.find((t) => t.slug === slug);
  return trend ? chatGptUrlFor(trend.prompt) : "https://chatgpt.com/";
};

export const chatGptUrlFor = (prompt: string) =>
  `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;

export const trendUrlFor = (slug: string) => `${SITE_URL}/trend/${slug}`;

export function getTrendBySlug(slug: string): Trend | undefined {
  return TRENDS.find((t) => t.slug === slug);
}

export function getRelatedTrends(slug: string, count = 4): Trend[] {
  const current = getTrendBySlug(slug);
  if (!current) return TRENDS.slice(0, count);
  const others = TRENDS.filter((t) => t.slug !== slug);
  const sameCat = others.filter((t) => t.category === current.category);
  const hot = others.filter((t) => t.hot && t.category !== current.category);
  const rest = others.filter(
    (t) => t.category !== current.category && !t.hot,
  );
  return [...sameCat, ...hot, ...rest].slice(0, count);
}
