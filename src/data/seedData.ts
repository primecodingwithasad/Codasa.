import { User, Pin, Board, NotificationItem, PinComment } from '../types';

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSato&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=AishaNdiaye&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=CreativeSpirit&backgroundColor=b6e3f4',
];

export const COVER_PRESETS = [
  '/src/assets/images/pin_coastal_mediterranean_cliff_1793379382199.jpg',
  '/src/assets/images/pin_aurora_mountain_cabin_1793379380790.jpg',
  '/src/assets/images/pin_minimal_architecture_1793369196557.jpg',
  '/src/assets/images/pin_tokyo_cyber_editorial_1793369196564.jpg',
  '/src/assets/images/pin_nordic_interior_living_1793369197252.jpg',
];

export const CURRENT_USER: User = {
  id: 'usr_me',
  name: 'Alex Rivera',
  username: 'alexrivera',
  email: 'alex.rivera@codasa.io',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera&backgroundColor=b6e3f4',
  coverImage: '/src/assets/images/pin_coastal_mediterranean_cliff_1793379382199.jpg',
  bio: 'Visual curator, architect & creative technologist. Collecting brutalist structures, serene spaces, and typographic experiments.',
  website: 'https://alexrivera.design',
  location: 'Copenhagen, Denmark',
  pronouns: 'they/them',
  followersCount: 1420,
  followingCount: 388,
  createdAt: '2025-01-15T10:00:00Z',
};

export const CREATORS: User[] = [
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    username: 'elenarostova',
    email: 'elena@studio-nordic.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova&backgroundColor=ffd5dc',
    bio: 'Interior architect & spatial researcher based in Copenhagen. Natural light enthusiast.',
    website: 'https://elenarostova.studio',
    followersCount: 8940,
    followingCount: 210,
    createdAt: '2024-08-10T14:20:00Z',
  },
  {
    id: 'usr_kenji',
    name: 'Kenji Sato',
    username: 'kenjishots',
    email: 'kenji@tokyochrome.jp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSato&backgroundColor=c0aede',
    bio: 'Street photographer exploring Tokyo night rains, neon corridors, and cyber aesthetics.',
    website: 'https://kenjisato.photo',
    followersCount: 15400,
    followingCount: 420,
    createdAt: '2024-06-12T08:15:00Z',
  },
  {
    id: 'usr_maya',
    name: 'Maya Lin Chen',
    username: 'mayalinchen',
    email: 'maya@form-matter.org',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MayaChen&backgroundColor=d1d4f9',
    bio: 'Brutalist architecture researcher & concrete structural specialist.',
    website: 'https://form-matter.org',
    followersCount: 6320,
    followingCount: 180,
    createdAt: '2024-09-01T12:00:00Z',
  },
  {
    id: 'usr_marcus',
    name: 'Marcus Vance',
    username: 'marcuscraft',
    email: 'marcus@stoneware.co',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance&backgroundColor=ffdfbf',
    bio: 'Ceramic artisan & woodturner. Celebrating imperfections, raw clays, and tactile earth.',
    website: 'https://stoneware.co',
    followersCount: 4720,
    followingCount: 195,
    createdAt: '2024-11-20T09:30:00Z',
  },
  {
    id: 'usr_sophia',
    name: 'Sophia Sterling',
    username: 'sophiadesign',
    email: 'sophia@haute-editorial.fr',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophiaSterling&backgroundColor=ffd5dc',
    bio: 'Editorial fashion stylist & art director in Paris. Modern tailoring and minimalist silhouettes.',
    website: 'https://sophiasterling.fr',
    followersCount: 12100,
    followingCount: 310,
    createdAt: '2024-07-04T16:45:00Z',
  },
  {
    id: 'usr_david',
    name: 'David Kim',
    username: 'davidcode',
    email: 'david@devtools.dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim&backgroundColor=b6e3f4',
    bio: 'Full-stack software craftsman & generative artist. Dark mode UI, CLI tools, and clean code.',
    website: 'https://davidkim.dev',
    followersCount: 9450,
    followingCount: 520,
    createdAt: '2024-05-18T11:10:00Z',
  },
  {
    id: 'usr_clara',
    name: 'Clara Dubois',
    username: 'claradubois',
    email: 'clara@botanical-table.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClaraDubois&backgroundColor=c0aede',
    bio: 'Pastry chef & culinary visual storyteller. Wild yeasts, sourdough, and seasonal preserves.',
    website: 'https://botanical-table.com',
    followersCount: 18200,
    followingCount: 290,
    createdAt: '2024-04-10T10:00:00Z',
  },
  {
    id: 'usr_hassan',
    name: 'Hassan Tariq',
    username: 'hassantravels',
    email: 'hassan@nomadroutes.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HassanTariq&backgroundColor=ffdfbf',
    bio: 'Mountain expedition leader & landscape photographer. Capturing the Karakoram & Patagonian peaks.',
    website: 'https://nomadroutes.com',
    followersCount: 11300,
    followingCount: 240,
    createdAt: '2024-03-25T14:15:00Z',
  },
  {
    id: 'usr_aisha',
    name: 'Aisha Ndiaye',
    username: 'aishatype',
    email: 'aisha@kinshasa-foundry.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AishaNdiaye&backgroundColor=d1d4f9',
    bio: 'Type designer & calligrapher blending Afro-futurist motifs with contemporary Swiss typography.',
    website: 'https://kinshasa-foundry.com',
    followersCount: 7800,
    followingCount: 165,
    createdAt: '2024-10-14T08:45:00Z',
  },
  {
    id: 'usr_liam',
    name: 'Liam O’Connor',
    username: 'liamvisuals',
    email: 'liam@dublin-render.ie',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiamOConnor&backgroundColor=b6e3f4',
    bio: '3D spatial designer and procedural world builder. Unreal Engine & Octane render artist.',
    website: 'https://liamoconnor.art',
    followersCount: 5900,
    followingCount: 210,
    createdAt: '2024-12-05T13:20:00Z',
  },
];

export const CATEGORIES = [
  'All',
  'Architecture',
  'Photography',
  'Interior Design',
  'Craft & Ceramics',
  'Tech & Dev',
  'Fashion & Editorial',
  'Travel & Nature',
  'Typography',
  'Culinary Arts',
];

export function createVectorArtwork(
  title: string,
  category: string,
  bgHue: number,
  pattern: 'geometry' | 'waves' | 'iso-cube' | 'typography' | 'gradient-mesh' | 'stripes' | 'dots' | 'circle-stack',
  aspectRatioLabel: 'portrait' | 'tall' | 'square'
): string {
  const height = aspectRatioLabel === 'tall' ? 640 : aspectRatioLabel === 'portrait' ? 520 : 400;
  const width = 400;
  
  let patternSvg = '';
  if (pattern === 'iso-cube') {
    patternSvg = `
      <g stroke="rgba(255,255,255,0.2)" stroke-width="2" fill="none">
        <polygon points="200,100 320,170 320,310 200,240" fill="rgba(255,255,255,0.06)" />
        <polygon points="200,100 80,170 80,310 200,240" fill="rgba(0,0,0,0.15)" />
        <polygon points="200,100 320,170 200,240 80,170" fill="rgba(255,255,255,0.18)" />
        <circle cx="200" cy="240" r="45" fill="rgba(255,255,255,0.25)" />
      </g>
    `;
  } else if (pattern === 'waves') {
    patternSvg = `
      <path d="M-50,200 C80,150 150,300 250,220 C350,140 420,280 500,210 L500,${height} L-50,${height} Z" fill="rgba(255,255,255,0.08)" />
      <path d="M-50,280 C60,220 180,380 280,290 C380,200 440,360 500,300 L500,${height} L-50,${height} Z" fill="rgba(0,0,0,0.12)" />
      <circle cx="280" cy="180" r="60" fill="rgba(255,255,255,0.2)" />
    `;
  } else if (pattern === 'typography') {
    patternSvg = `
      <g font-family="system-ui, sans-serif" font-weight="900" fill="rgba(255,255,255,0.15)">
        <text x="30" y="160" font-size="110" letter-spacing="-4">CD</text>
        <text x="30" y="260" font-size="95" letter-spacing="-3">SA</text>
        <text x="30" y="340" font-size="70" letter-spacing="-2">2026</text>
      </g>
      <line x1="30" y1="360" x2="370" y2="360" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    `;
  } else if (pattern === 'geometry') {
    patternSvg = `
      <g stroke="rgba(255,255,255,0.25)" stroke-width="1.5" fill="none">
        <circle cx="200" cy="${height/2 - 30}" r="110" />
        <circle cx="200" cy="${height/2 - 30}" r="75" />
        <circle cx="200" cy="${height/2 - 30}" r="40" fill="rgba(255,255,255,0.15)" />
        <rect x="90" y="${height/2 - 140}" width="220" height="220" />
        <line x1="200" y1="40" x2="200" y2="${height - 100}" />
        <line x1="40" y1="${height/2 - 30}" x2="360" y2="${height/2 - 30}" />
      </g>
    `;
  } else if (pattern === 'circle-stack') {
    patternSvg = `
      <g fill="none">
        <circle cx="200" cy="${height/2}" r="130" fill="rgba(255,255,255,0.06)" />
        <circle cx="200" cy="${height/2}" r="95" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
        <circle cx="160" cy="${height/2 - 40}" r="50" fill="rgba(255,255,255,0.18)" />
        <circle cx="240" cy="${height/2 + 40}" r="40" fill="rgba(0,0,0,0.18)" />
      </g>
    `;
  } else {
    patternSvg = `
      <rect x="50" y="80" width="300" height="260" rx="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
      <circle cx="200" cy="210" r="60" fill="rgba(255,255,255,0.15)" />
      <path d="M100,280 Q200,160 300,280" stroke="rgba(255,255,255,0.4)" stroke-width="3" fill="none" />
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${bgHue}, 65%, 26%)" />
          <stop offset="50%" stop-color="hsl(${(bgHue + 35) % 360}, 55%, 18%)" />
          <stop offset="100%" stop-color="hsl(${(bgHue + 70) % 360}, 45%, 12%)" />
        </linearGradient>
        <linearGradient id="glow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.85)" />
          <stop offset="60%" stop-color="rgba(0,0,0,0.1)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.05)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      ${patternSvg}
      <rect width="100%" height="100%" fill="url(#glow)" />
      <g font-family="system-ui, -apple-system, sans-serif">
        <text x="32" y="${height - 68}" font-size="12" font-weight="600" fill="rgba(255,255,255,0.6)" letter-spacing="1.5">${category.toUpperCase()}</text>
        <text x="32" y="${height - 38}" font-size="20" font-weight="700" fill="#ffffff">${title.length > 24 ? title.substring(0, 24) + '...' : title}</text>
      </g>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PINS: Pin[] = [
  // 8 High-Fidelity Photographic Spotlight Pins (Featuring the new pictures!)
  {
    id: 'pin_aurora',
    title: 'Nordic Black Timber Cabin under Northern Lights',
    description: 'Modern black timber A-frame cabin glowing with warm interior amber light under intense ribbons of green and violet aurora borealis in snowy alpine pines.',
    imageUrl: '/src/assets/images/pin_aurora_mountain_cabin_1793379380790.jpg',
    aspectRatio: 0.75,
    dominantColor: '#0b261d',
    destinationUrl: 'https://nomadroutes.com/aurora-cabin',
    category: 'Travel & Nature',
    tags: ['aurora', 'cabin', 'alpine', 'winter', 'norway', 'architecture'],
    userId: 'usr_hassan',
    creator: {
      id: 'usr_hassan',
      name: 'Hassan Tariq',
      username: 'hassantravels',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HassanTariq&backgroundColor=ffdfbf',
    },
    likesCount: 2480,
    savesCount: 1840,
    createdAt: '2026-04-05T09:30:00Z',
  },
  {
    id: 'pin_cybercafe',
    title: 'Neo-Shinjuku Cozy Cyber Cafe in the Rain',
    description: 'Steaming ceramic mug on dark polished cedar counter in a rainy Tokyo backstreet. Warm incandescent lamps contrasting with electric cyan neon signage.',
    imageUrl: '/src/assets/images/pin_cyber_cafe_aesthetic_1793379381224.jpg',
    aspectRatio: 0.75,
    dominantColor: '#1e1b18',
    destinationUrl: 'https://kenjisato.photo/neo-shinjuku-cafe',
    category: 'Photography',
    tags: ['coffee', 'tokyo', 'cyberpunk', 'neon', 'rain', 'night'],
    userId: 'usr_kenji',
    creator: {
      id: 'usr_kenji',
      name: 'Kenji Sato',
      username: 'kenjishots',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSato&backgroundColor=c0aede',
    },
    likesCount: 3120,
    savesCount: 2190,
    createdAt: '2026-04-05T11:15:00Z',
  },
  {
    id: 'pin_mediterranean',
    title: 'Amalfi Cliffside Plunge Pool & Whitewashed Villa',
    description: 'Curved whitewashed organic villa cascading down the Amalfi coast with vivid pink bougainvillea and private infinity pool gazing over the sparkling turquoise sea.',
    imageUrl: '/src/assets/images/pin_coastal_mediterranean_cliff_1793379382199.jpg',
    aspectRatio: 0.75,
    dominantColor: '#0284c7',
    destinationUrl: 'https://archdaily.com/amalfi-cliff-villa',
    category: 'Architecture',
    tags: ['amalfi', 'villa', 'infinitypool', 'mediterranean', 'summer', 'coastal'],
    userId: 'usr_maya',
    creator: {
      id: 'usr_maya',
      name: 'Maya Lin Chen',
      username: 'mayalinchen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MayaChen&backgroundColor=d1d4f9',
    },
    likesCount: 3890,
    savesCount: 2750,
    createdAt: '2026-04-05T13:40:00Z',
  },
  {
    id: 'pin_sculptural_vases',
    title: 'Sculptural Terracotta Vessels & Dried Eucalyptus',
    description: 'Tactile earthy ceramic vases in raw terracotta and speckled bone clay atop chiseled natural travertine, bathed in gentle morning window shadows.',
    imageUrl: '/src/assets/images/pin_minimalist_ceramic_vases_1793379381036.jpg',
    aspectRatio: 0.75,
    dominantColor: '#9a3412',
    destinationUrl: 'https://stoneware.co/vessels-study',
    category: 'Craft & Ceramics',
    tags: ['ceramics', 'terracotta', 'eucalyptus', 'stilllife', 'travertine', 'craft'],
    userId: 'usr_marcus',
    creator: {
      id: 'usr_marcus',
      name: 'Marcus Vance',
      username: 'marcuscraft',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance&backgroundColor=ffdfbf',
    },
    likesCount: 1840,
    savesCount: 1320,
    createdAt: '2026-04-05T14:20:00Z',
  },
  {
    id: 'pin_1',
    title: 'Brutalist Concrete Pavilion in Golden Hour',
    description: 'Monolithic raw concrete architecture framed by dry Mediterranean hills and sharp geometric shadows. Built as an open meditation sanctuary.',
    imageUrl: '/src/assets/images/pin_minimal_architecture_1793369196557.jpg',
    aspectRatio: 0.75,
    dominantColor: '#4d4639',
    destinationUrl: 'https://archdaily.com/brutalist-sanctuary',
    category: 'Architecture',
    tags: ['brutalism', 'concrete', 'goldenhour', 'minimalism', 'structural'],
    userId: 'usr_maya',
    creator: {
      id: 'usr_maya',
      name: 'Maya Lin Chen',
      username: 'mayalinchen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MayaChen&backgroundColor=d1d4f9',
    },
    likesCount: 1420,
    savesCount: 912,
    createdAt: '2026-03-24T10:15:00Z',
  },
  {
    id: 'pin_2',
    title: 'Rainy Night In Shinjuku Corridors',
    description: 'Wet asphalt reflecting golden ramen stall lanterns and electric signage. A quiet nocturnal stroll with a clear umbrella through Tokyo backstreets.',
    imageUrl: '/src/assets/images/pin_tokyo_cyber_editorial_1793369196564.jpg',
    aspectRatio: 0.75,
    dominantColor: '#17202e',
    destinationUrl: 'https://kenjisato.photo/tokyo-nocturne',
    category: 'Photography',
    tags: ['tokyo', 'streetphotography', 'cyberpunk', 'neon', 'rain'],
    userId: 'usr_kenji',
    creator: {
      id: 'usr_kenji',
      name: 'Kenji Sato',
      username: 'kenjishots',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSato&backgroundColor=c0aede',
    },
    likesCount: 2620,
    savesCount: 1980,
    createdAt: '2026-03-25T14:30:00Z',
  },
  {
    id: 'pin_3',
    title: 'Nordic Sunlit Living Room with Monstera',
    description: 'Natural oak coffee table, unbleached linen sofa, tactile jute rug, and warm sunlight filtering through sheer drapery. Serene Scandinavian warmth.',
    imageUrl: '/src/assets/images/pin_nordic_interior_living_1793369197252.jpg',
    aspectRatio: 0.75,
    dominantColor: '#635343',
    destinationUrl: 'https://elenarostova.studio/projects/nordic-retreat',
    category: 'Interior Design',
    tags: ['interior', 'scandinavian', 'monstera', 'livingroom', 'oak'],
    userId: 'usr_elena',
    creator: {
      id: 'usr_elena',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova&backgroundColor=ffd5dc',
    },
    likesCount: 1990,
    savesCount: 1240,
    createdAt: '2026-03-26T09:00:00Z',
  },
  {
    id: 'pin_4',
    title: 'Raw Stoneware & Wild Flora Still Life',
    description: 'Hand-thrown speckled ceramic vessels with dried lavender, wild grasses, and earthen bowls atop chiseled travertine stone.',
    imageUrl: '/src/assets/images/pin_botanical_ceramic_craft_1793369196996.jpg',
    aspectRatio: 0.75,
    dominantColor: '#5c4d43',
    destinationUrl: 'https://stoneware.co/collections/autumn-flora',
    category: 'Craft & Ceramics',
    tags: ['ceramics', 'pottery', 'botanical', 'stilllife', 'artisanal'],
    userId: 'usr_marcus',
    creator: {
      id: 'usr_marcus',
      name: 'Marcus Vance',
      username: 'marcuscraft',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance&backgroundColor=ffdfbf',
    },
    likesCount: 1460,
    savesCount: 930,
    createdAt: '2026-03-27T11:45:00Z',
  },
  {
    id: 'pin_5',
    title: 'Monochrome Kinetic Type Poster',
    description: 'Variable typographic experiment exploring high-contrast Swiss grid alignments, grotesque letterforms, and structural hierarchy.',
    imageUrl: createVectorArtwork('Monochrome Kinetic Type', 'Typography', 210, 'typography', 'tall'),
    aspectRatio: 0.625,
    dominantColor: '#1e293b',
    destinationUrl: 'https://kinshasa-foundry.com/type-experiments',
    category: 'Typography',
    tags: ['typography', 'poster', 'graphicdesign', 'swiss', 'editorial'],
    userId: 'usr_aisha',
    creator: {
      id: 'usr_aisha',
      name: 'Aisha Ndiaye',
      username: 'aishatype',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AishaNdiaye&backgroundColor=d1d4f9',
    },
    likesCount: 812,
    savesCount: 598,
    createdAt: '2026-03-28T08:10:00Z',
  },
  {
    id: 'pin_6',
    title: 'Developer Terminal & Neovim Setup',
    description: 'Clean developer workspace layout with split tmux panes, custom Catppuccin theme, minimal mechanical keyboard, and ambient backlighting.',
    imageUrl: createVectorArtwork('Developer Terminal Setup', 'Tech & Dev', 260, 'iso-cube', 'portrait'),
    aspectRatio: 0.77,
    dominantColor: '#312e81',
    destinationUrl: 'https://davidkim.dev/dotfiles',
    category: 'Tech & Dev',
    tags: ['coding', 'setup', 'minimalism', 'developer', 'workspace'],
    userId: 'usr_david',
    creator: {
      id: 'usr_david',
      name: 'David Kim',
      username: 'davidcode',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim&backgroundColor=b6e3f4',
    },
    likesCount: 1885,
    savesCount: 1410,
    createdAt: '2026-03-28T15:20:00Z',
  },
  {
    id: 'pin_7',
    title: 'Haute Couture Sculptural Trench',
    description: 'Architectural outerwear collection featuring exaggerated storm flaps, heavyweight organic wool, and asymmetrical horn buttons.',
    imageUrl: createVectorArtwork('Sculptural Trench Coat', 'Fashion & Editorial', 345, 'geometry', 'tall'),
    aspectRatio: 0.625,
    dominantColor: '#881337',
    destinationUrl: 'https://sophiasterling.fr/fw26',
    category: 'Fashion & Editorial',
    tags: ['fashion', 'couture', 'outerwear', 'editorial', 'style'],
    userId: 'usr_sophia',
    creator: {
      id: 'usr_sophia',
      name: 'Sophia Sterling',
      username: 'sophiadesign',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophiaSterling&backgroundColor=ffd5dc',
    },
    likesCount: 1640,
    savesCount: 950,
    createdAt: '2026-03-29T12:00:00Z',
  },
  {
    id: 'pin_8',
    title: 'Patagonian Glacial Ridge at Dawn',
    description: 'Sharp granite needles of Cerro Torre piercing through early morning mist above turquoise glacial lagoons.',
    imageUrl: createVectorArtwork('Patagonian Ridge Mist', 'Travel & Nature', 185, 'waves', 'portrait'),
    aspectRatio: 0.77,
    dominantColor: '#0f766e',
    destinationUrl: 'https://nomadroutes.com/patagonia-ridge',
    category: 'Travel & Nature',
    tags: ['mountains', 'patagonia', 'nature', 'landscape', 'wilderness'],
    userId: 'usr_hassan',
    creator: {
      id: 'usr_hassan',
      name: 'Hassan Tariq',
      username: 'hassantravels',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HassanTariq&backgroundColor=ffdfbf',
    },
    likesCount: 2540,
    savesCount: 1620,
    createdAt: '2026-03-29T16:30:00Z',
  },
  {
    id: 'pin_9',
    title: 'Artisanal Wild Sourdough Boule',
    description: 'Blistered dark mahogany crust scored with wheat ear motifs. Open airy crumb fermented for 36 hours using organic heritage spelt.',
    imageUrl: createVectorArtwork('Artisanal Wild Sourdough', 'Culinary Arts', 35, 'circle-stack', 'portrait'),
    aspectRatio: 0.77,
    dominantColor: '#78350f',
    destinationUrl: 'https://botanical-table.com/recipes/heritage-sourdough',
    category: 'Culinary Arts',
    tags: ['sourdough', 'baking', 'culinary', 'artisan', 'bread'],
    userId: 'usr_clara',
    creator: {
      id: 'usr_clara',
      name: 'Clara Dubois',
      username: 'claradubois',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClaraDubois&backgroundColor=c0aede',
    },
    likesCount: 1280,
    savesCount: 860,
    createdAt: '2026-03-30T07:15:00Z',
  },
  {
    id: 'pin_10',
    title: 'Procedural Glass Spatial Orb',
    description: 'Real-time raymarched refractive caustic simulation inside a floating frosted glass hemisphere. Rendered with Octane.',
    imageUrl: createVectorArtwork('Procedural Glass Orb', 'Tech & Dev', 280, 'iso-cube', 'square'),
    aspectRatio: 1.0,
    dominantColor: '#581c87',
    destinationUrl: 'https://liamoconnor.art/caustic-study',
    category: 'Tech & Dev',
    tags: ['3d', 'generative', 'glass', 'octane', 'render'],
    userId: 'usr_liam',
    creator: {
      id: 'usr_liam',
      name: 'Liam O’Connor',
      username: 'liamvisuals',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiamOConnor&backgroundColor=b6e3f4',
    },
    likesCount: 920,
    savesCount: 680,
    createdAt: '2026-03-30T10:00:00Z',
  },
  {
    id: 'pin_11',
    title: 'Kyoto Zen Garden Stone Geometry',
    description: 'Raked white gravel waves encircling moss-covered granite boulders at Ryōan-ji. Quiet contemplation of spatial rhythm.',
    imageUrl: createVectorArtwork('Kyoto Zen Garden Waves', 'Architecture', 140, 'waves', 'tall'),
    aspectRatio: 0.625,
    dominantColor: '#14532d',
    destinationUrl: 'https://maya.lin/zen-spaces',
    category: 'Architecture',
    tags: ['zen', 'kyoto', 'japan', 'minimalism', 'garden'],
    userId: 'usr_maya',
    creator: {
      id: 'usr_maya',
      name: 'Maya Lin Chen',
      username: 'mayalinchen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MayaChen&backgroundColor=d1d4f9',
    },
    likesCount: 1430,
    savesCount: 840,
    createdAt: '2026-03-30T13:45:00Z',
  },
  {
    id: 'pin_12',
    title: 'Cinematic Rainy Taxi Reflection',
    description: 'Rearview mirror catching amber taillight bokeh across condensation-streaked cab glass during an autumn downpour.',
    imageUrl: createVectorArtwork('Rainy Taxi Reflection', 'Photography', 220, 'geometry', 'portrait'),
    aspectRatio: 0.77,
    dominantColor: '#1e3a8a',
    destinationUrl: 'https://kenjisato.photo/taxi-reflection',
    category: 'Photography',
    tags: ['bokeh', 'cinematic', 'rain', 'photography', 'mood'],
    userId: 'usr_kenji',
    creator: {
      id: 'usr_kenji',
      name: 'Kenji Sato',
      username: 'kenjishots',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSato&backgroundColor=c0aede',
    },
    likesCount: 1720,
    savesCount: 1190,
    createdAt: '2026-03-30T15:30:00Z',
  },
  {
    id: 'pin_13',
    title: 'Japandi Ashwood Kitchen Island',
    description: 'Seamless fluted ash cabinetry paired with honed quartzite countertops and matte black brassware. Built for slow living.',
    imageUrl: createVectorArtwork('Japandi Ashwood Kitchen', 'Interior Design', 40, 'iso-cube', 'portrait'),
    aspectRatio: 0.77,
    dominantColor: '#713f12',
    destinationUrl: 'https://elenarostova.studio/kitchens',
    category: 'Interior Design',
    tags: ['japandi', 'kitchen', 'woodwork', 'minimalism', 'cabinetry'],
    userId: 'usr_elena',
    creator: {
      id: 'usr_elena',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova&backgroundColor=ffd5dc',
    },
    likesCount: 1605,
    savesCount: 1180,
    createdAt: '2026-03-30T18:00:00Z',
  },
  {
    id: 'pin_14',
    title: 'Ash-Glazed Matcha Chawan Bowl',
    description: 'Wood-fired stoneware tea bowl with natural wood ash drips, crackled celadon glaze pooling, and tactile finger indents.',
    imageUrl: createVectorArtwork('Ash Glazed Matcha Chawan', 'Craft & Ceramics', 60, 'circle-stack', 'square'),
    aspectRatio: 1.0,
    dominantColor: '#3f6212',
    destinationUrl: 'https://marcuscraft.co/tea-ware',
    category: 'Craft & Ceramics',
    tags: ['chawan', 'tea', 'woodfire', 'ceramics', 'glaze'],
    userId: 'usr_marcus',
    creator: {
      id: 'usr_marcus',
      name: 'Marcus Vance',
      username: 'marcuscraft',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance&backgroundColor=ffdfbf',
    },
    likesCount: 740,
    savesCount: 510,
    createdAt: '2026-03-30T19:15:00Z',
  },
  {
    id: 'pin_15',
    title: 'Editorial Oversized Wool Blazer',
    description: 'Charcoal melange double-breasted jacket with pronounced shoulder pads and deconstructed raw seams. Contemporary streetwear chic.',
    imageUrl: createVectorArtwork('Oversized Wool Blazer', 'Fashion & Editorial', 320, 'stripes', 'tall'),
    aspectRatio: 0.625,
    dominantColor: '#701a75',
    destinationUrl: 'https://sophiasterling.fr/blazer-study',
    category: 'Fashion & Editorial',
    tags: ['tailoring', 'blazer', 'editorial', 'minimal', 'fashion'],
    userId: 'usr_sophia',
    creator: {
      id: 'usr_sophia',
      name: 'Sophia Sterling',
      username: 'sophiadesign',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophiaSterling&backgroundColor=ffd5dc',
    },
    likesCount: 1290,
    savesCount: 830,
    createdAt: '2026-03-30T20:45:00Z',
  },
  {
    id: 'pin_16',
    title: 'Alpine Pass Switchbacks in Autumn',
    description: 'Aerial drone perspective of the Furka Pass winding like an asphalt ribbon through golden larch forests and granite crags.',
    imageUrl: createVectorArtwork('Alpine Pass Aerial', 'Travel & Nature', 170, 'waves', 'tall'),
    aspectRatio: 0.625,
    dominantColor: '#047857',
    destinationUrl: 'https://nomadroutes.com/swiss-passes',
    category: 'Travel & Nature',
    tags: ['alps', 'aerial', 'switzerland', 'roadtrip', 'drone'],
    userId: 'usr_hassan',
    creator: {
      id: 'usr_hassan',
      name: 'Hassan Tariq',
      username: 'hassantravels',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HassanTariq&backgroundColor=ffdfbf',
    },
    likesCount: 1990,
    savesCount: 1370,
    createdAt: '2026-03-31T05:30:00Z',
  },
  {
    id: 'pin_17',
    title: 'Geometric Sans Specimen Poster',
    description: 'Display specimen of a high-contrast grotesque type system with rounded apexes and ink traps engineered for high-density layouts.',
    imageUrl: createVectorArtwork('Grotesque Specimen Poster', 'Typography', 195, 'typography', 'portrait'),
    aspectRatio: 0.77,
    dominantColor: '#0369a1',
    destinationUrl: 'https://kinshasa-foundry.com/specimen-grotesque',
    category: 'Typography',
    tags: ['typography', 'specimen', 'font', 'inktrap', 'typesystem'],
    userId: 'usr_aisha',
    creator: {
      id: 'usr_aisha',
      name: 'Aisha Ndiaye',
      username: 'aishatype',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AishaNdiaye&backgroundColor=d1d4f9',
    },
    likesCount: 870,
    savesCount: 620,
    createdAt: '2026-03-31T08:15:00Z',
  },
  {
    id: 'pin_18',
    title: 'Copper Pour-Over Coffee Ritual',
    description: 'Hand-hammered Japanese copper kettle pouring a slow 92°C bloom over fresh Ethiopian Yirgacheffe grounds in an origami dripper.',
    imageUrl: createVectorArtwork('Copper Coffee Pour Over', 'Culinary Arts', 25, 'circle-stack', 'portrait'),
    aspectRatio: 0.77,
    dominantColor: '#9a3412',
    destinationUrl: 'https://botanical-table.com/brew-ritual',
    category: 'Culinary Arts',
    tags: ['coffee', 'specialtycoffee', 'pourover', 'barista', 'ritual'],
    userId: 'usr_clara',
    creator: {
      id: 'usr_clara',
      name: 'Clara Dubois',
      username: 'claradubois',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClaraDubois&backgroundColor=c0aede',
    },
    likesCount: 1130,
    savesCount: 710,
    createdAt: '2026-03-31T09:40:00Z',
  },
  {
    id: 'pin_19',
    title: 'Modern Minimalist Villa Cantilever',
    description: 'A 12-meter reinforced concrete cantilever floating above a tranquil reflection pool in Zurich. Seamless floor-to-ceiling glass.',
    imageUrl: createVectorArtwork('Cantilever Glass Villa', 'Architecture', 215, 'geometry', 'square'),
    aspectRatio: 1.0,
    dominantColor: '#1e3a8a',
    destinationUrl: 'https://form-matter.org/cantilever-villa',
    category: 'Architecture',
    tags: ['villa', 'cantilever', 'modernism', 'glass', 'switzerland'],
    userId: 'usr_maya',
    creator: {
      id: 'usr_maya',
      name: 'Maya Lin Chen',
      username: 'mayalinchen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MayaChen&backgroundColor=d1d4f9',
    },
    likesCount: 1340,
    savesCount: 970,
    createdAt: '2026-03-31T11:20:00Z',
  },
  {
    id: 'pin_20',
    title: 'Prismatic Monolith in Desert Dunes',
    description: 'Mirror-polished chrome monolith reflecting wind-swept sand dunes under an ultramarine twilight sky.',
    imageUrl: createVectorArtwork('Prismatic Desert Monolith', 'Tech & Dev', 250, 'iso-cube', 'tall'),
    aspectRatio: 0.625,
    dominantColor: '#4338ca',
    destinationUrl: 'https://liamoconnor.art/monolith-dunes',
    category: 'Tech & Dev',
    tags: ['sculpture', '3d', 'desert', 'chrome', 'surreal'],
    userId: 'usr_liam',
    creator: {
      id: 'usr_liam',
      name: 'Liam O’Connor',
      username: 'liamvisuals',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiamOConnor&backgroundColor=b6e3f4',
    },
    likesCount: 910,
    savesCount: 530,
    createdAt: '2026-03-31T14:00:00Z',
  },
];

export const INITIAL_BOARDS: Board[] = [
  {
    id: 'board_alpine',
    userId: 'usr_me',
    title: 'Alpine Trails & Arctic Aurora',
    description: 'Nordic timber cabins, emerald northern lights, and glacial summits.',
    coverImage: '/src/assets/images/pin_aurora_mountain_cabin_1793379380790.jpg',
    isPrivate: false,
    pinIds: ['pin_aurora', 'pin_8', 'pin_16'],
    sections: [
      { id: 'sec_aurora', boardId: 'board_alpine', title: 'Aurora Cabins', pinIds: ['pin_aurora'] },
      { id: 'sec_alpine_passes', boardId: 'board_alpine', title: 'Mountain Passes', pinIds: ['pin_16'] },
    ],
    collaborators: [
      { id: 'usr_hassan', name: 'Hassan Tariq', username: 'hassantravels', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HassanTariq', role: 'editor' },
    ],
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'board_mediterranean',
    userId: 'usr_me',
    title: 'Mediterranean Coastal Sanctuaries',
    description: 'Amalfi cliffside plunge pools, bougainvillea terraces, and whitewashed villas.',
    coverImage: '/src/assets/images/pin_coastal_mediterranean_cliff_1793379382199.jpg',
    isPrivate: false,
    pinIds: ['pin_mediterranean', 'pin_1', 'pin_19'],
    sections: [
      { id: 'sec_cliff', boardId: 'board_mediterranean', title: 'Cliffside Pools', pinIds: ['pin_mediterranean'] },
      { id: 'sec_arch', boardId: 'board_mediterranean', title: 'Monolithic Stone', pinIds: ['pin_1'] },
    ],
    collaborators: [
      { id: 'usr_maya', name: 'Maya Lin Chen', username: 'mayalinchen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MayaChen', role: 'editor' },
    ],
    createdAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 'board_tokyo',
    userId: 'usr_me',
    title: 'Tokyo Night Rain & Cyber Cafes',
    description: 'Reflective asphalt, cozy neon bars, and Shinjuku alleyways.',
    coverImage: '/src/assets/images/pin_cyber_cafe_aesthetic_1793379381224.jpg',
    isPrivate: false,
    pinIds: ['pin_cybercafe', 'pin_2', 'pin_12'],
    sections: [
      { id: 'sec_cafe', boardId: 'board_tokyo', title: 'Coffee Bars', pinIds: ['pin_cybercafe'] },
      { id: 'sec_rain', boardId: 'board_tokyo', title: 'Night Streets', pinIds: ['pin_2', 'pin_12'] },
    ],
    collaborators: [
      { id: 'usr_kenji', name: 'Kenji Sato', username: 'kenjishots', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSato', role: 'editor' },
    ],
    createdAt: '2026-01-22T14:30:00Z',
  },
  {
    id: 'board_ceramics',
    userId: 'usr_me',
    title: 'Ceramic Studio & Tactile Vessels',
    description: 'Terracotta vases, wood-fired matcha bowls, and artisanal earthen vessels.',
    coverImage: '/src/assets/images/pin_minimalist_ceramic_vases_1793379381036.jpg',
    isPrivate: false,
    pinIds: ['pin_sculptural_vases', 'pin_4', 'pin_14'],
    sections: [
      { id: 'sec_terracotta', boardId: 'board_ceramics', title: 'Terracotta & Stone', pinIds: ['pin_sculptural_vases'] },
      { id: 'sec_tableware', boardId: 'board_ceramics', title: 'Bowls & Flora', pinIds: ['pin_4', 'pin_14'] },
    ],
    collaborators: [
      { id: 'usr_marcus', name: 'Marcus Vance', username: 'marcuscraft', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance', role: 'editor' },
    ],
    createdAt: '2026-02-12T11:00:00Z',
  },
  {
    id: 'board_living',
    userId: 'usr_me',
    title: 'Warm Scandinavian Interiors',
    description: 'Natural oak, linen upholstery, travertine basins, and Japandi minimalism.',
    coverImage: '/src/assets/images/pin_nordic_interior_living_1793369197252.jpg',
    isPrivate: false,
    pinIds: ['pin_3', 'pin_13'],
    sections: [],
    collaborators: [
      { id: 'usr_elena', name: 'Elena Rostova', username: 'elenarostova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova', role: 'editor' },
    ],
    createdAt: '2026-02-05T09:15:00Z',
  },
  {
    id: 'board_secret',
    userId: 'usr_me',
    title: 'Secret Brand Explorations',
    description: 'Private moodboard for Codasa 2026 interface updates and design tokens.',
    coverImage: createVectorArtwork('Brand Tokens', 'Typography', 210, 'typography', 'square'),
    isPrivate: true,
    pinIds: ['pin_5', 'pin_17'],
    sections: [],
    collaborators: [],
    createdAt: '2026-03-10T08:00:00Z',
  },
];

export const INITIAL_COMMENTS: PinComment[] = [
  {
    id: 'cmt_aurora',
    pinId: 'pin_aurora',
    userId: 'usr_kenji',
    user: {
      name: 'Kenji Sato',
      username: 'kenjishots',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSato&backgroundColor=c0aede',
    },
    text: 'That green auroral corona directly centered above the roof apex is breathtaking! Long exposure duration?',
    createdAt: '2026-04-05T10:00:00Z',
    likesCount: 28,
    replies: [
      {
        id: 'rep_aurora',
        userId: 'usr_hassan',
        user: {
          name: 'Hassan Tariq',
          username: 'hassantravels',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HassanTariq&backgroundColor=ffdfbf',
        },
        text: 'About 4 seconds at f/1.8 on a fast wide prime to freeze the dancing auroral curtains without trailing stars!',
        createdAt: '2026-04-05T10:20:00Z',
        likesCount: 19,
      },
    ],
  },
  {
    id: 'cmt_1',
    pinId: 'pin_1',
    userId: 'usr_elena',
    user: {
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova&backgroundColor=ffd5dc',
    },
    text: 'The shadow interplay on that upper cantilever is astonishing. Was this cast with rough-sawn pine formwork?',
    createdAt: '2026-03-24T12:30:00Z',
    likesCount: 14,
    replies: [],
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_aurora',
    type: 'like',
    userId: 'usr_me',
    actor: {
      name: 'Hassan Tariq',
      username: 'hassantravels',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HassanTariq&backgroundColor=ffdfbf',
    },
    pinId: 'pin_aurora',
    pinImage: '/src/assets/images/pin_aurora_mountain_cabin_1793379380790.jpg',
    message: 'saved your pin "Nordic Black Timber Cabin under Northern Lights"',
    read: false,
    createdAt: '5m ago',
  },
  {
    id: 'notif_1',
    type: 'like',
    userId: 'usr_me',
    actor: {
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova&backgroundColor=ffd5dc',
    },
    pinId: 'pin_1',
    pinImage: '/src/assets/images/pin_minimal_architecture_1793369196557.jpg',
    message: 'liked your pin "Brutalist Concrete Pavilion in Golden Hour"',
    read: false,
    createdAt: '15m ago',
  },
];
