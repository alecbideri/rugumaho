export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: 'Motherhood' | 'Travel' | 'Fitness' | 'Lifestyle';
  tags?: string[];
  author: string;
  status: 'draft' | 'published';
  createdAt: string;
  readTime: string;
}

const DEFAULT_POSTS: Post[] = [
  {
    id: "1",
    title: "Embracing Minimalism in 2026",
    slug: "embracing-minimalism-in-2026",
    excerpt: "How decluttering your space can declutter your mind. A deep dive into the psychology of \"less is more\" and practical steps to begin your journey.",
    content: `## Decluttering Your Space, Decluttering Your Mind

In a world filled with constant notifications, endless choices, and physical clutter, the philosophy of minimalism offers a calm path forward. Minimalism is not about living in an empty room with a single chair; it's about making space for what truly matters.

### The Psychology of "Less is More"

Studies have shown that physical clutter increases levels of cortisol, the body's primary stress hormone. A cluttered environment forces the brain to process multiple stimuli simultaneously, leading to mental fatigue and reduced focus. By intentionally organizing and reducing our possessions, we signal to our minds that we are in control, creating an immediate sense of relief.

### 3 Steps to Begin Your Minimalist Journey

1. **The 30-Day Declutter Challenge**: Start by removing one item on day one, two items on day two, and so on. By the end of the month, you will have decluttered over 460 items!
2. **One In, One Out**: For every new item you bring into your home (whether it's a book, clothing, or kitchen tool), donate or sell an existing one.
3. **Assess Value, Not Cost**: When deciding whether to keep an item, ask: "Does this add value to my daily life?" or "Does it inspire joy?"

Embracing minimalism is a continuous practice, not a one-time event. As you declutter your home, you will find your thoughts becoming clearer, your focus sharper, and your life more balanced.`,
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlsSlXyxnWoBso-UvRKC2EM3-njS4qupQlRzaGxBU5guwsEEFu1EB_FgpzBMyuGj1AKm3OEy6_UIxTzX7oObOQ0TO0HRoiQDOlCD8zXBVaE7JFskr3wey9p936HGzfBAqvjziAu-i3s2GP6ZMN5RfeSA4kBOb7BZNqLRLsdDGsd4IBDTr8m4ANDIUgrSWaIjuosNtfqIzauB7K6vLDgaOBL1VTgx1MVKF4UHdRp6uFR0Rdqayf7wiWyheP8ChwbhOnWrdv4ftXxFw",
    category: "Lifestyle",
    tags: ["Tips"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-06-15",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Sustainable Fashion",
    slug: "sustainable-fashion",
    excerpt: "The future of eco-friendly wear and brands making a difference.",
    content: `## The Future of Fashion is Circular

The fashion industry is responsible for nearly 10% of global carbon emissions. Fast fashion has accelerated consumption cycles, leading to massive textile waste. However, a new wave of brands and designers is choosing a different path—one focused on longevity, ethical production, and organic materials.

### Key Aspects of Sustainable Fashion

- **Organic & Recycled Materials**: Choosing linen, organic cotton, and recycled polyester significantly reduces water usage and pollution.
- **Ethical Supply Chains**: Fair wages and safe working conditions for garment workers should be the standard, not the exception.
- **Circular Design**: Designing garments that can be easily repaired, updated, or recycled at the end of their lifecycle.

By curating a capsule wardrobe and choosing quality over quantity, we can support a sustainable future while expressing our personal style.`,
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnnZoA0W1AnkcK1Xo1ZGRuouwDX2pDrmLs2hOAFWjIhnEMqQgUufrKaxwn3XWinL4q-1j002lsK0KKBqg7nEuD8lQ5rDNOX0tjcy5TtkTitr17Lao8KchrO1emvLM8pl-Nw03SKWFKIByfBpFpDittGmuwp1dnI9MwR8f6T-5T4Z6XbgKRZSYP_CK7uhRKOpzkmckzuQSZxTRMMSqstjsLEFCYua3acthWxT29kUqrowwW4Ptx4wehyV4CtIyMgPhdSfdcMlY1XZ8",
    category: "Lifestyle",
    tags: ["Guides"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-06-12",
    readTime: "4 min read"
  },
  {
    id: "3",
    title: "Urban Gardening",
    slug: "urban-gardening",
    excerpt: "Green spaces in small places: a guide to balcony botany.",
    content: `## Growing Greenery on a Balcony

You don't need a sprawling backyard to experience the joy of gardening. balcony botany allows city dwellers to connect with nature, grow their own herbs, and improve local biodiversity.

### Getting Started with Balcony Gardening

1. **Evaluate Light**: Observe how many hours of direct sunlight your balcony receives. Some plants need full sun, while others thrive in shade.
2. **Container Choice**: Ensure your pots have drainage holes. Use lightweight fabric pots if you have load restrictions on your balcony.
3. **Soil Quality**: Invest in organic potting mix. Garden soil is too heavy for containers and will compact, suffocating plant roots.

Start with simple herbs like basil, mint, and rosemary, and watch your tiny urban oasis flourish!`,
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnwFBFFFEaSr2CO_5quVKCZ_Y-dfqpspeU-be4AKgKwgGVQ_LXxXu0ZLNq_WTt3IzeVcLjKDiAXnLo2JpF3nMiP9lwTWMcPT5gID5gpuHj8h7FGnGaauPIYZuCEniYybrJjGxk0b036Zhh2pA7-vMcCICTrz5lMEmeZscMNLf5yrvUyJui-rKmRhGe8G7GRG4pjEKKRQnvBFetWXnh_lngHZrCIjcqtbFE1E4ie2bFoslJnl79Tm5zmYTebZOM1zNLTIpefqSl5ek",
    category: "Lifestyle",
    tags: ["Tips"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-06-10",
    readTime: "3 min read"
  },
  {
    id: "4",
    title: "Digital Detox",
    slug: "digital-detox",
    excerpt: "Reconnecting with reality by disconnecting from the screen.",
    content: `## Reclaiming Your Attention Span

We spend an average of 7 hours a day looking at screens. While technology keeps us connected, constant digital input can lead to stress, sleep disturbances, and a decline in mindfulness. A digital detox isn't about leaving technology forever; it's about creating healthy boundaries.

### The Benefits of Disconnecting

- **Improved Sleep**: Reducing blue light exposure before bedtime improves sleep quality.
- **Mental Clarity**: Stepping away from social media notifications lowers anxiety levels.
- **Better Relationships**: Being present in conversations strengthens our connection to family and friends.

Try starting with one hour of screen-free time in the morning, and enjoy the beauty of the offline world.`,
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkRCJjcro1mAPs5ezxGeiDEApqVJRx35eKxMjBdiSRvOG9DGoGjlgBNGkNwvUl5vdMXyqlPYdtuYcxuPTGVnLvySzP9MELwLyZSneqzyIRUy2_biCJQrpMURXo5NHNbU9GfL0Q2R1gs1zd-W3a4_cJKVvE1yAA9yTBpoz9pzJ7uD_ocXtPjUd4GaNgdoyTnR_ZFLrZ3faKxiBPnxDchU-hoBySRiMyCEFHjN9QwcAsxGbtkbiWx2LHDT37odSxYe4z6NuV_BmRSR4",
    category: "Fitness",
    tags: ["Personal"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-06-08",
    readTime: "4 min read"
  },
  {
    id: "5",
    title: "The Hidden Waterways of Venice: A Local's Secret",
    slug: "the-hidden-waterways-of-venice-a-locals-secret",
    excerpt: "Escape the crowds and discover the silent canals that tourists often miss in the floating city...",
    content: "Venice is famous for its Grand Canal, but the real magic of the city lies in its smaller, quieter waterways. Exploring these silent canals away from the main tourist paths offers an authentic, timeless view of Venetian life.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGqppUAkE1EPDAZJfID03wMzTcgxK1dRq5wDUGux-Vqe6oTq2A3G7emK01KZXdoqN-HpqgIVNlqJqv5V0Iupwci9wjlYPxiUgvSQkLuvTxAfBnc3rBM8S_NJcSneV9HB1o6fi_jrVSgPiiiRTnsCz6HaPVbyjBvglgBTxY6BlGlI6sF8JPD7GJRHeAEXQcnwzqtoaUGEm9kvlJ5F8zV6bRlmQAdoOI9DiYWrRz78Qv0mdkqWDUthIqzF3Yh4nUugdQqh0nPkxS8Dc",
    category: "Travel",
    tags: ["Guides"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-06-05",
    readTime: "8 min read"
  },
  {
    id: "6",
    title: "Finding Solitude in the Heart of Patagonia",
    slug: "finding-solitude-in-the-heart-of-patagonia",
    excerpt: "Three weeks without a cell signal taught me more about myself than a decade in the city...",
    content: "PATAGONIA is a land of vast wilderness, sharp mountain peaks, and freezing winds. Disconnecting from the internet for three weeks allowed me to appreciate the sheer scale of nature and find peace in silence.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewtKOwENB_qzn59e6K5VlOE_npG3KMGj_55HvQZdTpjR1hw4gJwrNH5RqdHkJqDsCobNfQ581oezLgY_v4Roo9CHizhshWykOIfp0jS5BXg8LEAGB2DVk7yx2LOrPhf-jo5tgimw1zAWf_pJKmHveEXKKE2f-EWC9P1a1d8CScvdXaJaLloZ3qeFTvRNdsFAWaTcdoeYfbLw8yQIGmmmTxGZOGbcOo1OmzeLVnzlA1Qc2iZFuhf1W1mL07bGOz7BUyolthqFZfeY",
    category: "Travel",
    tags: ["Personal"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-06-02",
    readTime: "12 min read"
  },
  {
    id: "7",
    title: "Minimalist Packing for Coastal Summers",
    slug: "minimalist-packing-for-coastal-summers",
    excerpt: "Why a single carry-on is all you truly need for your next tropical island getaway...",
    content: "Packing light is one of the most liberating ways to travel. With a single carry-on bag, you eliminate waiting at baggage claim, save money, and focus on the experiences rather than the luggage.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy-5Tswu8kYhOFHMRwKk7Hv8JfBHFHgeoteFb87TPdn2pC3mqLmBYrRT5sUv23y5FBLj4oWmBHsfgUbu34hZpXaO_lkE5HMO-iswnjHK-Tf-u4mSc3_BnVlI28JT417j__7iRchUAVpOE8T_Vezcm_UxNQz15BodwmCzYLruJbrGVVvVk6aYj3cu0_ODcSVMaMdp6hCs5ljbNipDipeklhfWoSCSxGBTjKlkmxaV8-HlpurrdqXvJ4RiyUT7r36z8SeWqJ9yHOvS0",
    category: "Travel",
    tags: ["Tips"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-05-28",
    readTime: "5 min read"
  },
  {
    id: "8",
    title: "The Best Lakes for Reflection in Ontario",
    slug: "the-best-lakes-for-reflection-in-ontario",
    excerpt: "From Muskoka to the North, these are the most serene waters to visit this autumn...",
    content: "Ontario is home to thousands of beautiful lakes. This autumn guide lists the most serene and quiet waters where you can see the reflecting colors of golden maple leaves and find pure stillness.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuABOTULxwPyZEI-2SYLgP-PeUZvoorpeyPJrrXgcQT4PoIgbmpFf8tRieI4aXkLDr-_eskD1hpgPwov-tcqh9wW9l1eey0OJ4La5B8ECmmojC9uDQx_7nMqs-lm6r36sPfq176ztboeR1B7lTdB6nR6OpVJDgfkcmjoomZ7SkWibtifQw7_JpYzKMzc6iFq9Wag1oKIeNE3vpbssNUlOHOw3rtrL_18Rzx4th_As0_KWolwSLjP3bmWvi4oywBpKKLojfJ1Y2oEdnA",
    category: "Travel",
    tags: ["Guides"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-05-25",
    readTime: "7 min read"
  },
  {
    id: "9",
    title: "Kyoto at 5 AM: An Awakening",
    slug: "kyoto-at-5-am-an-awakening",
    excerpt: "Witnessing the first light hit the temples before the city begins its daily hum...",
    content: "Kyoto is beautiful, but visiting the temples at 5 AM before the city wakes up is a spiritual experience. The quiet atmosphere, crisp morning air, and early sunbeams highlight the ancient architecture in a magical way.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIJw-y3W3tgV7clv1uAT6U1oQ2B-nZjvliCHOnUldj0mGVGXcdRIBf4P9Qsb9kOsCOiMn9SGNvN_UKHlDr1OLjnG6lce3vKfnhqQl5kYTdYk7ReS6-pgjjYgO33zOxss2KF-ewQfE1IiJM7oit76QgVTVmE_V_iYaeEX1KR-qSa5n-IEE4Lg1p1lRqK3JT1NymmHdx-YEARK57okfkxSVKOaeEDRZ6yR_c2mTwCBukzQUja3CyByk1HKH20so1gHaW7F4JUJ6Ndxg",
    category: "Travel",
    tags: ["Personal"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-05-18",
    readTime: "10 min read"
  },
  {
    id: "10",
    title: "How to Travel Safely Solo in 2026",
    slug: "how-to-travel-safely-solo-in-2026",
    excerpt: "Our updated guide on digital safety, physical awareness, and cultural etiquette...",
    content: "Solo travel is a wonderful way to grow, but safety should always be a priority. This guide covers how to set up emergency communication, navigate local transit, and stay aware of your surroundings.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBny5wHwRK6B7bbBAeFhYUDvFD9LGuDRkUMq01ZPmsz25sMzw2FIEmVKukABOttPkFXJ2YR209OycFpXH7jg4qZL3K0W4eKbYvs8hazQ-ayobj3hWwPdvnGRTi3ZTIDSdYT5R9D49o6d7V634dFbSTh3YX7766nLAaD5o5Q9dqjW8GDVsyPBoVpYlxbvI9CX5Y6ijnRpufUCLSZssVMSifNlnt3BJQs8usyuamcSJhxCiyaXWuhM5Z1RMHL9llYRXYiwroqXAZGfwY",
    category: "Travel",
    tags: ["Tips"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-05-12",
    readTime: "6 min read"
  },
  {
    id: "11",
    title: "The Power of Active Recovery",
    slug: "power-of-active-recovery",
    excerpt: "Why rest days shouldn't mean sitting on the couch. Explore the physiological benefits of active movement on recovery days.",
    content: `## Maximizing Rest with Gentle Movement

Active recovery involves performing low-intensity exercise after a strenuous workout. Instead of complete rest (passive recovery), engaging in gentle physical activity keeps the muscles warm, improves blood flow, and accelerates the removal of metabolic waste.

### Benefits of Active Recovery

- **Reduced Muscle Soreness**: Gentle movement helps flush out lactic acid and decreases overall stiffness.
- **Enhanced Blood Flow**: Light cardiovascular exercise increases circulation, delivering essential nutrients and oxygen to repairing muscle tissues.
- **Mental Refreshment**: Activities like yoga or a leisurely walk offer mental relaxation without physical exhaustion.

### Top Active Recovery Activities

1. **Light Walking or Hiking**: A simple, low-impact way to keep moving.
2. **Mobility and Yoga**: Focuses on flexibility, stretching, and mindful breathing.
3. **Leisure Swimming**: The buoyancy of water reduces joint impact while providing a gentle whole-body workout.

Integrating active recovery into your fitness routine ensures you return to your next high-intensity training session stronger and fully rejuvenated.`,
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    category: "Fitness",
    tags: ["Tips"],
    author: "Rugumaho",
    status: "published",
    createdAt: "2026-05-05",
    readTime: "5 min read"
  },
  {
    id: "12",
    title: "The Hidden Gems of Rwanda's Countryside",
    slug: "the-hidden-gems-of-rwandas-countryside",
    excerpt: "Beyond the typical tourist trails lies a world of vibrant markets, ancient traditions, and a serenity that can only be found by slowing down.",
    content: `Rwanda, often celebrated for its miraculous urban development and the bustling streets of Kigali, holds its most profound secrets in the quiet, terraced hills that define the landscape of the "Land of a Thousand Hills." Beyond the typical tourist trails lies a world of vibrant markets, ancient traditions, and a serenity that can only be found by slowing down.

## A Journey Through the Mist

Traveling north toward the volcanoes, the air grows crisp and the greenery becomes impossibly deep. It is here that the true spirit of Rwanda resides. We spent four days navigating the narrow pathways of the Northern Province, where every turn reveals a new panorama of volcanic peaks and mirror-like lakes.

"The silence of the countryside isn't an absence of sound, but a presence of peace that vibrates through the very ground beneath your feet."

What strikes visitors first is the impeccable order. Even in the most remote villages, the sense of community and collective responsibility—Umuganda—is palpable. We encountered local cooperatives dedicated to sustainable honey production and weaving, each telling a story of resilience and hope.

### Essentials for Your Backpack

- Lightweight, waterproof layers for the sudden tropical rains.
- Sturdy walking boots for the steep, terraced inclines.
- A high-quality camera to capture the extraordinary play of light and shadow.`,
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuANbxS57_IPytnQiJMyuZ3-JJ3KWHsdqwf3ZsUDwJIOgbglomTaZU27u7dkvqlIu8aqxPbnQctB_YoJ_OyWTtqScRYaxkQq8ktVCU4O7XjONODb4w2EYEBJ1zfdYc14ohKqAzhC2wwftEmYBL2Yb8UicXXORo0J1PONmAKiw84SQJj1lMZrF41P9tVU5GfCZqZfGVW9FRUBmq5i31vrCOcgAQNsdgm50481IL1sBsV4PdqmR2fFzh3BI-p2Ux-GfwybRsvm0pcF2cQ",
    category: "Travel",
    tags: ["Guides"],
    author: "Ariane Rugumaho",
    status: "published",
    createdAt: "2023-10-24",
    readTime: "8 min read"
  }
];

export function getPosts(): Post[] {
  if (typeof window === "undefined") {
    return DEFAULT_POSTS;
  }
  
  const saved = localStorage.getItem("rugumaho_posts");
  if (!saved || !saved.includes('"12"') || !saved.includes("Ariane Rugumaho")) {
    localStorage.setItem("rugumaho_posts", JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_POSTS;
  }
}

export function savePosts(posts: Post[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("rugumaho_posts", JSON.stringify(posts));
  }
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find(p => p.slug === slug);
}

export function addPost(post: Omit<Post, 'id' | 'createdAt'>): Post {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString().split('T')[0]
  };
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export function updatePost(updated: Post): void {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === updated.id);
  if (index !== -1) {
    posts[index] = updated;
    savePosts(posts);
  }
}

export function deletePost(id: string): void {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  savePosts(filtered);
}
