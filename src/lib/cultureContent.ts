import { InterestTagType } from "./schemas";

export interface CultureArticle {
  id: string;
  slug: string;
  title: string;
  interest_tags: InterestTagType[];
  summary: string;
  readTime: string;
  published: boolean;
  sections: {
    heading: string;
    content: string[];
    tips?: string[];
  }[];
  quickGlossary?: { term: string; meaning: string }[];
}

export const CULTURE_ARTICLES: CultureArticle[] = [
  {
    id: "art-hawker-chope",
    slug: "hawker-etiquette-chope",
    title: "Hawker Centre Etiquette & The Chope System",
    interest_tags: ["food", "other"],
    summary: "Master the art of table reserving with tissue packets, queueing protocols, tray returns, and ordering coffee like a seasoned Singaporean.",
    readTime: "4 min read",
    published: true,
    sections: [
      {
        heading: "1. The Sacred Art of 'Chope' (Reserving Seats)",
        content: [
          "Before queueing at popular stalls (such as Tian Tian Chicken Rice, Hill Street Tai Hwa, or Old Airport Road's prawn noodles), locals secure their seats first. This process is universally known as 'choping'.",
          "A small packet of pocket tissues, an office card lanyard, an umbrella, or even a water bottle placed squarely in the middle of a table or on a stool indicates the seat is taken.",
          "Unwritten law: A choped seat is strictly respected across the island. Never move another person's packet or sit at a choped table unless explicitly invited."
        ],
        tips: [
          "Always carry 2-3 tissue packets in your everyday bag.",
          "If dining alone during peak lunch hours (12:00 PM – 1:30 PM), choping ensures your food doesn't turn cold while searching for an empty seat."
        ]
      },
      {
        heading: "2. Ordering, Cutlery & Payment",
        content: [
          "Most hawker stalls are self-service. Queue patiently in line and prepare your order in advance.",
          "Aunties and uncles appreciate rapid, concise orders. Specify if you are dining in ('Having here') or taking away ('Dabao' / 'Packet').",
          "Specify your spice preference upfront: 'With chilli' or 'No chilli / Mai hiam'.",
          "Payment: SGQR, PayNow, NETS FlashPay, and GrabPay QR codes are available at over 98% of stalls, but having small $5/$10 banknotes and coins is always helpful."
        ]
      },
      {
        heading: "3. Mandatory Tray Return Scheme",
        content: [
          "Singapore places high value on shared civic hygiene. When you finish eating, clear all empty bowls, plates, cutlery, and drink cans onto your tray.",
          "Return the tray to the designated Halal or Non-Halal tray return racks positioned around the centre.",
          "Leaving dirty crockery behind incurs statutory advisory warnings or fines for repeated neglect, but more importantly, it shows courtesy to fellow diners."
        ]
      },
      {
        heading: "4. Kopi (Coffee) & Teh Order Formula",
        content: [
          "Traditional coffee in Singapore is roasted with butter and sugar, strained through a cloth sock.",
          "• Kopi: Coffee + Sweetened Condensed Milk",
          "• Kopi-O: Black coffee + Sugar (no milk)",
          "• Kopi-C: Coffee + Evaporated Milk + Sugar",
          "• Kopi-Kosong: Coffee + Condensed milk with NO added sugar",
          "• Kopi-O-Kosong: Pure black coffee (zero milk, zero sugar)",
          "• Kopi-Peng: Iced version of any above combination (e.g. Kopi-O-Peng = Iced black sweetened coffee)"
        ]
      }
    ],
    quickGlossary: [
      { term: "Chope", meaning: "To reserve a seat or table using a personal item like a tissue pack" },
      { term: "Dabao / Ta-bao", meaning: "Takeaway / to-go food packaging" },
      { term: "Mai Hiam", meaning: "Hokkien for 'Don't want chili' (no spicy sauce)" },
      { term: "Tze Char", meaning: "Home-style cooked-to-order communal Chinese dishes" }
    ]
  },
  {
    id: "art-mrt-norms",
    slug: "mrt-public-transport-norms",
    title: "MRT & Public Transport Norms: The Unwritten Rules",
    interest_tags: ["outdoors", "other"],
    summary: "Essential guidelines for Singapore's world-class transit system: escalator discipline, reserved seating culture, and contactless fare payment.",
    readTime: "3 min read",
    published: true,
    sections: [
      {
        heading: "1. Escalator Discipline: Stand on the Left",
        content: [
          "When riding any escalator in MRT stations or shopping malls, stand firmly on the LEFT side and hold the handrail.",
          "The RIGHT side is strictly reserved for commuters walking, running, or hurrying to make train connections.",
          "If you carry a backpack or rolling suitcase, position it in front of you on your left step to keep the passing lane clear."
        ]
      },
      {
        heading: "2. Boarding & Alighting Courtesy",
        content: [
          "Queue behind the yellow floor line within the indicated chevron markings at both sides of train doors.",
          "Allow exiting passengers to completely clear the doorway through the middle before stepping onboard.",
          "Once inside, move immediately into the centre of the cabin or carriage rather than clustering near the doors."
        ]
      },
      {
        heading: "3. Priority Seating & Commuter Etiquette",
        content: [
          "Priority/Reserved seats located nearest to the doors are designated for the elderly, expectant mothers, people with mobility challenges, and parents with toddlers.",
          "You may occupy an open reserved seat if the train is empty, but be prepared to offer it spontaneously the moment a commuter in need enters.",
          "Use headphones and maintain low conversational volume during transit."
        ]
      },
      {
        heading: "4. Strictly Prohibited on Transit",
        content: [
          "• No Eating or Drinking: Even sipping bottled water or popping a mint inside MRT stations or on buses is prohibited (fines up to SGD $500).",
          "• No Durians: Because of its penetrating aroma, fresh durian fruit is banned on all public buses and trains.",
          "• Payment (SimplyGo): Simply tap your existing contactless Visa, Mastercard, Apple Pay, or Google Wallet directly on the fare gantries. No special physical transit card is required."
        ]
      }
    ]
  },
  {
    id: "art-singlish-guide",
    slug: "singlish-crash-course",
    title: "Singlish Crash Course: 10 Nuances & Essential Particles",
    interest_tags: ["language", "professional", "other"],
    summary: "Decode conversational particles like 'Lah', 'Leh', and 'Lor', plus vital loanwords from Malay, Hokkien, and Tamil used daily in work and social life.",
    readTime: "5 min read",
    published: true,
    sections: [
      {
        heading: "1. What is Singlish?",
        content: [
          "Singlish is Singapore's beloved creole—an organic blend of English grammar shortcuts with vocabulary and tone borrowed from Hokkien, Cantonese, Malay, and Tamil.",
          "While standard English is the language of formal business and legal transactions, Singlish functions as an immediate social bond and badge of warmth between friends, colleagues, and hawkers."
        ]
      },
      {
        heading: "2. The Key Sentence-Ending Particles",
        content: [
          "• 'Lah' (Reassurance or finality): 'Don't worry lah, the train is coming soon!'",
          "• 'Leh' (Curiosity, hesitation, or soft reminder): 'Why you didn't tell me earlier leh?'",
          "• 'Lor' (Resignation or obvious acceptance): 'If it rains then cannot jog lor.'",
          "• 'Meh' (Skeptical surprise): 'Really meh? I thought the meeting was tomorrow?'",
          "• 'Sia' (Emphasis / exclamation): 'Wah, this weather so hot sia!'"
        ]
      },
      {
        heading: "3. Everyday Social Expressions",
        content: [
          "• 'Shiok' (Malay origin): Expresses pure sensory delight (e.g., 'This laksa is so shiok!').",
          "• 'Paiseh' (Hokkien origin): Embarrassed or apologetic ('Paiseh for replying late!').",
          "• 'Makan' (Malay origin): To eat / have a meal ('Have you makan yet?').",
          "• 'Steady' / 'Can': Universal affirmation ('Meeting at 7pm?' -> 'Steady pom pi pi' or simply 'Can!').",
          "• 'Kiasu' (Hokkien origin): Fear of losing out or missing out on a good opportunity."
        ]
      }
    ],
    quickGlossary: [
      { term: "Shiok", meaning: "Extreme satisfaction, deliciousness, or comfort" },
      { term: "Paiseh", meaning: "Feeling shy, apologetic, or embarrassed" },
      { term: "Kiasu", meaning: "Fear of missing out / highly competitive mindset" },
      { term: "Can or cannot?", meaning: "A quick question asking if something is feasible" }
    ]
  },
  {
    id: "art-festival-calendar",
    slug: "singapore-festival-calendar",
    title: "The Multi-Cultural Festival Calendar of Singapore",
    interest_tags: ["arts", "other"],
    summary: "A seasonal guide to Lunar New Year light-ups, Hari Raya Geylang bazaars, Deepavali in Little India, Thaipusam kavadi processions, and National Day.",
    readTime: "4 min read",
    published: true,
    sections: [
      {
        heading: "1. Lunar New Year (January / February)",
        content: [
          "Chinatown comes alive with massive street lanterns, night markets selling bak kwa (barbecued sweet pork), and dragon dances.",
          "Customs: Lo Hei / Yu Sheng (prosperity tossed raw fish salad where diners chant auspicious blessings while tossing ingredients high into the air), and exchanging pairs of mandarin oranges."
        ]
      },
      {
        heading: "2. Thaipusam & Deepavali",
        content: [
          "• Thaipusam (Jan/Feb): A breathtaking Hindu festival where devotees carry ornate kavadi structures and milk pots on a 4km foot pilgrimage from Sri Srinivasa Perumal Temple to Sri Thendayuthapani Temple.",
          "• Deepavali (Oct/Nov): The Festival of Lights transforms Little India with glittering archways, vibrant rangoli floral art, festive sweet bazaars, and gold jewelry stalls."
        ]
      },
      {
        heading: "3. Hari Raya Puasa & Ramadan Bazaars (March / April)",
        content: [
          "The Geylang Serai and Kampong Gelam night bazaars become bustling culinary hubs featuring ramly burgers, dendeng, churros, and traditional Malay textiles.",
          "The celebration of Hari Raya marks the end of Ramadan with joyful family open-house visits and sharing of traditional rendang, ketupat, and kueh."
        ]
      },
      {
        heading: "4. National Day (August 9th)",
        content: [
          "Singapore celebrates independence with the iconic National Day Parade (NDP) featuring the Red Lions parachutists, mobile columns, military flypasts, and dazzling fireworks over the Padang and Marina Bay."
        ]
      }
    ]
  },
  {
    id: "art-neighborhood-guide",
    slug: "neighborhood-guide-singapore",
    title: "Neighborhood Guide: Tiong Bahru, Joo Chiat, Tanjong Pagar & Queenstown",
    interest_tags: ["outdoors", "food", "arts"],
    summary: "Find your ideal home enclave in Singapore: comparing architectural styles, rental price expectations, transit links, and neighborhood vibes.",
    readTime: "5 min read",
    published: true,
    sections: [
      {
        heading: "1. Tiong Bahru (Art Deco & Heritage Charm)",
        content: [
          "Singapore's oldest public housing estate, famous for low-rise Art Deco streamline moderne architecture, spiral staircases, and quiet tree-lined avenues.",
          "• Vibe: Independent bookshops (Woods in the Books), artisanal bakeries (Tiong Bahru Bakery, Plain Vanilla), and the legendary Tiong Bahru Market.",
          "• Best For: Designers, writers, foodies, and couples seeking character and central proximity."
        ]
      },
      {
        heading: "2. Joo Chiat & Katong (Peranakan Heritage & Coastal Ease)",
        content: [
          "The colorful epicenter of Peranakan culture on the East Coast, featuring pastel shophouses with ornate ceramic tiles and traditional nonya cuisine.",
          "• Vibe: Relaxed, breezy, rich in artisanal cafes, gelato bars, yoga studios, and 10 minutes cycling to East Coast Park beach.",
          "• Best For: Outdoor lovers, pet owners, and expats who want a vibrant seaside community feel."
        ]
      },
      {
        heading: "3. Tanjong Pagar & Duxton Hill (Downtown Energy)",
        content: [
          "A chic blend of heritage conservation shophouses and sleek high-rise condominiums right on the edge of the Central Business District.",
          "• Vibe: World-class cocktail bars (Jigger & Pony, Tippling Club), Korean BBQ row on Amoy/Tanjong Pagar Rd, Michelin dining, and co-working spaces.",
          "• Best For: Tech professionals, finance expats, and individuals who want a 5-minute walk to work and bustling nightlife."
        ]
      },
      {
        heading: "4. Queenstown & Dawson (Green Corridors & Efficient Living)",
        content: [
          "Singapore's first satellite town, featuring award-winning modern public-private architecture (SkyVille@Dawson) directly connected to the Rail Corridor greenway.",
          "• Vibe: Family-friendly, peaceful, lush green parks, direct East-West Line MRT connection to Raffles Place in 12 minutes.",
          "• Best For: Professionals and students seeking convenience, value, and immediate access to running trails."
        ]
      }
    ]
  }
];
