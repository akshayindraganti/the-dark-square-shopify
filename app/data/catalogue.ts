/**
 * catalogue.ts — the catalogue and all long-form site copy.
 *
 * Ported verbatim from the static site's js/modules/products.js. This module
 * owns the editorial half of a product: the story, the tasting notes, the
 * collection it belongs to and the fallback prices. Live prices, availability
 * and the variant ids the cart needs come from the Storefront API and are
 * merged on top by app/lib/tds/shopify.ts, matched on `slug` (the Shopify
 * product handle).
 */

export interface Product {
  slug: string;
  img: string;
  name: string;
  pair: string;
  collection: string;
  pct: number;
  occasion: string;
  /** Fallback price in rupees for the 50 g bar, used until a store is linked. */
  p50: number;
  /** Fallback price in rupees for the 100 g bar. */
  p100: number;
  cocoa: string;
  texture: string;
  finish: string;
  line: string;
  story: string;
  story2: string;
  leoNote: string;
}

export interface ShopCard extends Product {
  t1: string;
  t2: string;
}

export type Size = 50 | 100;

export const PRODUCTS: Product[] = [
  {
    slug: "salted-almond-noir",
    img: "assets/bars/p01.png",
    name: "Salted Almond Noir",
    pair: "Dark Chocolate • Roasted Almond • Sea Salt",
    collection: "The Classics",
    pct: 70,
    occasion: "Everyday",
    p50: 320,
    p100: 580,
    cocoa: "Roasted",
    texture: "Nutty",
    finish: "Elegant",
    line: "A little sweet. A little salty. A little magical.",
    story:
      "Deep dark chocolate meets crunchy roasted almonds and a delicate touch of sea salt.",
    story2: "One square is never quite enough.",
    leoNote:
      "Leo says the salt is the best part. Lily says the almond. They eat it anyway.",
  },

  {
    slug: "hazelnut-coffee-affair",
    img: "assets/bars/p09.png",
    name: "Hazelnut Coffee Affair",
    pair: "Dark Chocolate • Hazelnut • Coffee",
    collection: "The Dark Collection",
    pct: 70,
    occasion: "Gifting",
    p50: 410,
    p100: 760,
    cocoa: "Rich",
    texture: "Nutty",
    finish: "Bold",
    line: "For the coffee-and-chocolate kind of person.",
    story:
      "Bold coffee. Toasted hazelnuts. Deep dark chocolate. A rich combination for those who believe coffee and chocolate belong together.",
    story2: "Smooth, nutty and unapologetically grown-up.",
    leoNote:
      "Lily holds this one above Leo’s head. Not for children, apparently.",
  },

  {
    slug: "hazelnut-heirloom",
    img: "assets/bars/p03.png",
    name: "The Hazelnut Heirloom",
    pair: "Dark Chocolate • Toasted Hazelnut",
    collection: "The Classics",
    pct: 70,
    occasion: "Everyday",
    p50: 340,
    p100: 620,
    cocoa: "Toasted",
    texture: "Caramel",
    finish: "Smooth",
    line: "The one that tastes like being eight again.",
    story:
      "Hazelnuts blistered until the skins lift, rubbed by hand, then set whole into the 70% base while it is still soft.",
    story2: "Familiar in the best possible way.",
    leoNote: "Lily calls this the polite one. Leo calls it the one he steals.",
  },

  {
    slug: "cashew-daydream",
    img: "assets/bars/p02.png",
    name: "Cashew Daydream",
    pair: "Dark Chocolate • Roasted Cashew",
    collection: "The Nut Collection",
    pct: 70,
    occasion: "Gifting",
    p50: 330,
    p100: 600,
    cocoa: "Buttery",
    texture: "Toasted",
    finish: "Rich",
    line: "Soft, buttery and quietly convincing.",
    story:
      "Cashews from the Konkan coast, roasted just past golden so the butteriness comes forward and the chocolate reads gentler than it is.",
    story2:
      "The one most likely to win over someone who says they don’t like dark chocolate.",
    leoNote: "Approved unanimously, which almost never happens.",
  },

  {
    slug: "pistachio-after-midnight",
    img: "assets/bars/p04.png",
    name: "Pistachio After Midnight",
    pair: "Dark Chocolate • Pistachio",
    collection: "The Dark Collection",
    pct: 70,
    occasion: "Gifting",
    p50: 390,
    p100: 720,
    cocoa: "Nutty",
    texture: "Creamy",
    finish: "Intense",
    line: "Named after the hour it was made.",
    story:
      "Chopped pistachios pressed into the surface so the green breaks through the shine.",
    story2: "Some ideas refuse to wait until morning.",
    leoNote: "Lily made this at 12:40am. Leo was asleep under the counter.",
  },

  {
    slug: "monsoon-coffee-roast",
    img: "assets/bars/p05.png",
    name: "Monsoon Coffee Roast",
    pair: "Dark Chocolate • Cashew • Coffee",
    collection: "The Dark Collection",
    pct: 70,
    occasion: "Everyday",
    p50: 400,
    p100: 740,
    cocoa: "Bold",
    texture: "Nutty",
    finish: "Aromatic",
    line: "Morning chocolate, and we stand by that.",
    story:
      "Coorg coffee ground coarse and cashews roasted alongside it, so the two share the same char.",
    story2: "The only bar anyone here eats before nine.",
    leoNote: "Leo tried it once at breakfast and talked for an hour.",
  },

  {
    slug: "whole-nut-parade",
    img: "assets/bars/p06.png",
    name: "The Whole Nut Parade",
    pair: "Dark Chocolate • Almond • Cashew • Hazelnut",
    collection: "The Nut Collection",
    pct: 70,
    occasion: "Corporate",
    p50: 380,
    p100: 700,
    cocoa: "Rich",
    texture: "Nutty",
    finish: "Indulgent",
    line: "Everything, but organised.",
    story: "An abundant medley with no single nut allowed to win.",
    story2:
      "The one we send when we don’t know what someone likes. It has never come back.",
    leoNote:
      "Leo’s idea, argued on the grounds that choosing one nut is unnecessary.",
  },

  {
    slug: "walnut-midnight",
    img: "assets/bars/p07.png",
    name: "Walnut Midnight",
    pair: "Dark Chocolate • Walnut",
    collection: "The Nut Collection",
    pct: 70,
    occasion: "Everyday",
    p50: 360,
    p100: 660,
    cocoa: "Earthy",
    texture: "Rich",
    finish: "Velvety",
    line: "Dark, dry and entirely unsentimental.",
    story:
      "Kashmiri walnuts keep their edge, so we met them with a base that does not apologise either.",
    story2: "For people who order their coffee black and mean it.",
    leoNote: "Leo’s favourite. Lily wrote ‘wrong’ next to it in the notebook.",
  },

  {
    slug: "rose-pistachio-reverie",
    img: "assets/bars/p08.png",
    name: "Rose & Pistachio Reverie",
    pair: "Dark Chocolate • Pistachio • Rose",
    collection: "The Celebration Collection",
    pct: 70,
    occasion: "Celebration",
    p50: 440,
    p100: 800,
    cocoa: "Floral",
    texture: "Nutty",
    finish: "Indulgent",
    line: "A garden, not a perfume counter.",
    story:
      "Pistachios and delicate rose petals, dosed carefully so it stays a flavour rather than a fragrance.",
    story2: "Our most-requested wedding favour.",
    leoNote:
      "Leo says it smells like his grandmother’s terrace. That was the target.",
  },

  // ── The Regional Collection ──────────────────────────────────────────────
  // Ten bars named for where their ingredient comes from. Four are milk, six
  // are dark — the line is held together by region, not by cocoa percentage,
  // so `pair` and `pct` are what tell them apart on the card and the page.
  // Tasting notes and pairings are transcribed from the pack artwork.

  {
    slug: "himachal-almond",
    img: "assets/bars/p10.png",
    name: "Himachal Almond",
    pair: "Milk Chocolate • Roasted Almond",
    collection: "The Regional Collection",
    pct: 45,
    occasion: "Everyday",
    p50: 320,
    p100: 580,
    cocoa: "Creamy",
    texture: "Crunchy",
    finish: "Wholesome",
    line: "The orchard bar. Gentle, and not sorry about it.",
    story:
      "Almonds from the Himachal orchards, roasted whole and folded into a milk base soft enough to let them stay the loudest thing in the bar.",
    story2:
      "The one we hand to people who insist they do not like dark chocolate.",
    leoNote: "Leo calls this the mountain one and will not be corrected.",
  },

  {
    slug: "konkan-cashew",
    img: "assets/bars/p11.png",
    name: "Konkan Cashew",
    pair: "Milk Chocolate • Caramelised Cashew",
    collection: "The Regional Collection",
    pct: 45,
    occasion: "Everyday",
    p50: 330,
    p100: 600,
    cocoa: "Buttery",
    texture: "Smooth",
    finish: "Indulgent",
    line: "Coast cashews, taken one step further.",
    story:
      "Konkan cashews caramelised until the sugar just catches, then set into milk chocolate while the edges are still brittle.",
    story2: "Sweet, but with somewhere to go.",
    leoNote: "Lily rations this one. Leo has opinions about the rationing.",
  },

  {
    slug: "kashmiri-pista",
    img: "assets/bars/p12.png",
    name: "Kashmiri Pista",
    pair: "Milk Chocolate • Kashmiri Pistachio",
    collection: "The Regional Collection",
    pct: 45,
    occasion: "Gifting",
    p50: 400,
    p100: 740,
    cocoa: "Nutty",
    texture: "Creamy",
    finish: "Memorable",
    line: "The green is the point.",
    story:
      "Kashmiri pistachios, shelled by hand and left in halves so the colour reads through the milk chocolate rather than disappearing into it.",
    story2: "Expensive to make, and it shows in the right way.",
    leoNote: "Lily counts the pistachios. She says the number matters.",
  },

  {
    slug: "pangi-hazelnut",
    img: "assets/bars/p13.png",
    name: "Pangi Hazelnut",
    pair: "Dark Chocolate • Roasted Hazelnut",
    collection: "The Regional Collection",
    pct: 70,
    occasion: "Everyday",
    p50: 340,
    p100: 620,
    cocoa: "Rich",
    texture: "Nutty",
    finish: "Distinctive",
    line: "Higher, quieter, sweeter — as the valley sign says.",
    story:
      "Hazelnuts from the Pangi valley, roasted dark enough to pick up a little smoke before they meet a 70% base.",
    story2: "Remote enough that we only get so many. We make what we get.",
    leoNote:
      "Leo wanted to know how far Pangi is. The answer did not deter him.",
  },

  {
    slug: "garhwal-walnut",
    img: "assets/bars/p14.png",
    name: "Garhwal Walnut",
    pair: "Dark Chocolate • Walnut",
    collection: "The Regional Collection",
    pct: 70,
    occasion: "Everyday",
    p50: 360,
    p100: 660,
    cocoa: "Rich",
    texture: "Nutty",
    finish: "Balanced",
    line: "Bitter meets bitter, and they get along.",
    story:
      "Garhwal walnuts keep a tannic edge that most chocolate fights. This one leans into it and finds the balance on the other side.",
    story2:
      "The bar people come back for once they have stopped wanting sweetness.",
    leoNote:
      "Leo pretends this is his second favourite. The notebook says otherwise.",
  },

  {
    slug: "maharajas-mix",
    img: "assets/bars/p15.png",
    name: "Maharaja's Mix",
    pair: "Dark Chocolate • Almond • Cashew • Pistachio • Hazelnut • Walnut",
    collection: "The Regional Collection",
    pct: 70,
    occasion: "Corporate",
    p50: 400,
    p100: 740,
    cocoa: "Royal",
    texture: "Nutty",
    finish: "Timeless",
    line: "Five nuts. No hierarchy.",
    story:
      "Almonds, cashews, pistachios, hazelnuts and walnuts, dosed so that no single one takes the bar over.",
    story2:
      "The one that goes out by the boxful when nobody knows what the recipient likes.",
    leoNote: "Leo argued for a sixth nut. He was outvoted, narrowly.",
  },

  {
    slug: "jaipur-harvest",
    img: "assets/bars/p16.png",
    name: "Jaipur Harvest",
    pair: "Dark Chocolate • Almond • Pistachio • Raisin • Cranberry",
    collection: "The Regional Collection",
    pct: 70,
    occasion: "Gifting",
    p50: 390,
    p100: 720,
    cocoa: "Bold",
    texture: "Fruity",
    finish: "Indulgent",
    line: "Fruit and nut, done properly.",
    story:
      "Almonds and pistachios for the structure, raisins and cranberries for the sharpness that cuts a 70% base.",
    story2: "Familiar on paper. Not on the tongue.",
    leoNote: "Lily picks out the cranberries first. Leo eats them in order.",
  },

  {
    slug: "malnad-cardamom",
    img: "assets/bars/p17.png",
    name: "Malnad Cardamom",
    pair: "Dark Chocolate • Cardamom",
    collection: "The Regional Collection",
    pct: 70,
    occasion: "Gifting",
    p50: 350,
    p100: 640,
    cocoa: "Bold",
    texture: "Aromatic",
    finish: "Refined",
    line: "No nuts. Nowhere to hide.",
    story:
      "Green cardamom from the Malnad hills, ground fresh and dosed carefully — enough to perfume the bar, never enough to make it taste of soap.",
    story2: "The hardest one to get right, and the one we are proudest of.",
    leoNote: "Lily says this one smells like the kitchen after Sunday cooking.",
  },

  {
    slug: "lucknow-gulab",
    img: "assets/bars/p18.png",
    name: "Lucknow Gulab",
    pair: "Milk Chocolate • Pistachio • Rose",
    collection: "The Regional Collection",
    pct: 45,
    occasion: "Celebration",
    p50: 440,
    p100: 800,
    cocoa: "Floral",
    texture: "Creamy",
    finish: "Elegant",
    line: "A garden at dusk, not a perfume counter.",
    story:
      "Pistachios and Lucknow rose over milk chocolate, dosed so the rose arrives last and briefly.",
    story2: "Our most requested wedding favour, now in milk.",
    leoNote:
      "Leo says it tastes pink. Nobody has been able to argue him out of it.",
  },

  {
    slug: "bengaluru-brew",
    img: "assets/bars/p19.png",
    name: "Bengaluru Brew",
    pair: "Dark Chocolate • Coffee • Hazelnut",
    collection: "The Regional Collection",
    pct: 70,
    occasion: "Everyday",
    p50: 410,
    p100: 760,
    cocoa: "Rich",
    texture: "Smooth",
    finish: "Unforgettable",
    line: "Bold, local, addictive. Their words, on the pack.",
    story:
      "Filter coffee ground coarse and hazelnuts roasted alongside it, so the two share a char before the chocolate ever sees them.",
    story2: "Some stories taste better in Bengaluru.",
    leoNote:
      "Leo had one at four in the afternoon. We heard about it until nine.",
  },
];

export const COLS = [
  {
    name: "The Classics",
    line: "Where everyone starts. One nut, one bar, no cleverness.",
  },
  {
    name: "The Nut Collection",
    line: "Whole nuts, generously dosed, texture first.",
  },
  {
    name: "The Dark Collection",
    line: "The deepest of them, for people who like the bitter part.",
  },
  {
    name: "The Celebration Collection",
    line: "Rose, pistachio, sea salt. For the days worth marking.",
  },
];

// ── Welcome coupon popup: edit these to change the offer ──
export const COUPON = {
  delayMs: 6000, // appears this long after the loader clears
  seenDays: 30, // hidden for this many days once dismissed
  brand: "THE DARK SQUARE",
  brandSub: "ARTISAN CHOCOLATES",
  headline: "Your first bite is on us!",
  enjoy: "ENJOY",
  offer: "10% OFF",
  offerSub: "ON YOUR FIRST ORDER",
  codeLabel: "USE CODE:",
  code: "SWEETSTART",
  cta: "SHOP NOW",
  tagline: "EVERY SQUARE HOLDS A STORY.",
  art: "assets/coupon-lilyleo.jpg",
  terms: "Valid on your first order · Minimum ₹500 · One use per customer",
};

// ── Lily & Leo storybook spreads ──
export const SPREADS = [
  {
    img: "assets/lily-new.png",
    alt: "Lily reading aloud from a glowing book",
    caption: "Lily, chief question-asker",
    title: "She wants to know everything",
    flip: false,
    body: "Where the cocoa grew, why the almonds are roasted twice, who decided salt belonged anywhere near chocolate. Most of her questions end up on the back of a pack.",
  },
  {
    img: "assets/leo-new.png",
    alt: "Leo lying on a cushion, chin on his hands, listening",
    caption: "Leo, chief taster",
    title: "He is here for the tasting",
    flip: true,
    body: "Leo listens to exactly as much of the story as it takes for the chocolate to arrive. He has opinions, and he is right more often than anyone expected.",
  },
  {
    img: "assets/lilyleo-scene.jpg",
    alt: "Lily reading to Leo, cocoa farms and a globe drawn in light above them",
    caption: "Together, one flavour at a time",
    title: "Every square is an adventure",
    flip: false,
    body: "They discover the world of The Dark Square one chocolate at a time — a new flavour, a new story, and sometimes a little bit of chocolate-covered mischief.",
  },
];

// ── Our Story blocks ──
export const STORY_BLOCKS = [
  {
    kicker: "Why “The Dark Square”",
    title: "A small square with a story waiting to be discovered",
    flip: false,
    img: "assets/story/story-01.jpg",
    alt: "Lily and Leo gazing up at a ribbon of chocolate carrying cocoa farms, blossoms and far-off coastlines",
    body: "Because chocolate begins with the square. Simple. Familiar. Iconic. But inside that little square can be an entire world of flavours, textures, memories and moments.",
  },
  {
    kicker: "What we believe",
    title: "Chocolate should make you pause",
    flip: true,
    img: "assets/story/story-02.jpg",
    alt: "Lily and Leo pausing over a plate of dark squares, eyes closed in quiet delight",
    body: "Good chocolate doesn\u2019t need to shout. It should invite you in. A beautiful flavour. A satisfying texture. A moment of quiet happiness. That\u2019s our idea of indulgence.",
  },
  {
    kicker: "How we work",
    title: "Thoughtful over complicated",
    flip: false,
    img: "assets/story/story-03.jpg",
    alt: "Lily and Leo finishing a tray of chocolates beside a notebook reading test, refine, perfect, make with care",
    body: "We don\u2019t make chocolates simply to fill a box. Every flavour begins with an idea. Every recipe is tested. Every piece is crafted with care.",
  },
];

// ── FAQ ──
export const FAQS = [
  {
    q: "Are The Dark Square chocolates handmade?",
    a: "Yes. Our chocolates are crafted in small batches with attention to flavour, texture and presentation.",
  },
  {
    q: "Do you take custom orders?",
    a: "Yes. Depending on the quantity and requirement, we can explore customised chocolate and gifting options.",
  },
  {
    q: "Do you offer corporate gifting?",
    a: "Yes. We offer corporate and bulk gifting options for businesses and events.",
  },
  {
    q: "Can I order chocolates as gifts?",
    a: "Absolutely. Our chocolates are designed to be gifted, shared and enjoyed.",
  },
  {
    q: "How should I store my chocolates?",
    a: "Store chocolates in a cool, dry place away from direct sunlight, heat and strong odours. Follow the storage instructions provided with your chocolates.",
  },
  {
    q: "Do you have more flavours coming?",
    a: "Oh, definitely. The Dark Square is only getting started.",
  },
];

// ── Corporate gifting list ──
export const CORP_LIST = [
  "Client gifts",
  "Employee appreciation",
  "Festive gifting",
  "Milestones",
  "Events",
  "Weddings & celebrations",
  "Special occasions",
];

// ── WhatsApp ordering ────────────────────────────────────────────────────
//
// Orders are placed by handing the cart to WhatsApp as a prefilled message
// (see js/modules/whatsapp.js). Nothing works until `number` below is real.
//
// FORMAT: country code + number, digits only — no "+", spaces or dashes.
//   +91 98765 43210  ->  '919876543210'
//
// Leave it as the placeholder and the Checkout link hides itself rather than
// opening a chat with a number that does not exist.
export const WHATSAPP = {
  number: "917386508742", // +91 73865 08742 — country code required
  shopName: "The Dark Square",
};

// ── Contact details and enquiry form fields ──
export const CONTACT_ROWS = [
  { label: "Email", value: "[your email]" },
  { label: "Instagram", value: "[Instagram handle]" },
  { label: "WhatsApp", value: "[WhatsApp number]" },
];

export const CONTACT_FIELDS = [
  { label: "Name", ph: "Your name" },
  { label: "Email", ph: "you@example.in" },
  { label: "Phone", ph: "+91" },
  {
    label: "What is this about?",
    ph: "Gifting, corporate, custom, or just hello",
  },
];

// ── Gifting routes (tile art is resolved at render time) ──
export const GIFT_ROUTES = [
  {
    title: "Gifts that tell a story",
    body: "Our chocolates can be curated into thoughtful gifts for personal celebrations and special occasions. Beautifully presented, thoughtfully crafted, made to be remembered.",
    cta: "Enquire for gifting",
    href: "contact",
    img: PRODUCTS[8].img,
  },
  {
    title: "For someone you love",
    body: "Pick your squares, add a note in your own words, and we tie the box before it leaves the kitchen.",
    cta: "Choose chocolates",
    href: "shop",
    img: PRODUCTS[0].img,
  },
  {
    title: "Celebrations & weddings",
    body: "Favours at scale with a consistent finish across every box, from a handful of guests to a few hundred.",
    cta: "Talk to us",
    href: "contact",
    img: PRODUCTS[1].img,
  },
];

// ── Nav ──
export const NAV_LINKS = [
  { label: "Chocolates", page: "shop" },
  { label: "Our Story", page: "story" },
  { label: "Gifting", page: "gifting" },
  { label: "Contact", page: "contact" },
];

// ── Footer ──
export const FOOTER_COLS = [
  {
    title: "Chocolate",
    links: [
      ["All chocolates", "shop"],
      ["The Classics", "shop"],
      ["The Dark Collection", "shop"],
      ["The Celebration Collection", "shop"],
    ],
  },
  {
    title: "Stories",
    links: [
      ["Our Story", "story"],
      ["Lily & Leo", "lily"],
      ["What we believe", "story"],
    ],
  },
  {
    title: "Gifting",
    links: [
      ["Gift boxes", "gifting"],
      ["Corporate gifting", "gifting"],
      ["Weddings & events", "gifting"],
    ],
  },
  {
    title: "Contact",
    links: [
      ["Get in touch", "contact"],
      ["FAQ", "faq"],
      ["Instagram", "contact"],
    ],
  },
];

// ── Lily's questions ──
export const LILY_QUESTIONS = [
  "Why is dark chocolate dark?",
  "Who decided almonds belong with chocolate?",
  "Why does sea salt make chocolate taste better?",
];

// ── Lily & Leo story beats (Midnight Kitchen treatment) ──
export const LILY_BEATS = [
  {
    num: "01",
    img: "assets/lily-new.png",
    alt: "Lily reading aloud from a glowing book",
    title: "A question",
    body: "Why is dark chocolate dark? Lily has asked four more before anyone answers the first.",
  },
  {
    num: "02",
    img: "assets/leo-new.png",
    alt: "Leo listening, chin resting on his hands",
    title: "A taste",
    body: "Leo volunteers immediately. He is, he insists, only being helpful.",
  },
  {
    num: "03",
    img: "assets/lilyleo-scene.jpg",
    alt: "Lily and Leo together, cocoa farms drawn in light above them",
    title: "A story",
    body: "Where the cocoa grew, who grew it, and how it travelled all the way here.",
  },
  {
    num: "04",
    img: "assets/leo-new.png",
    alt: "Leo daydreaming on a cushion",
    title: "A favourite",
    body: "They never agree. Their rule: there are no rules when choosing your square.",
  },
];

// ── Moments (home) ──
export const MOMENTS = [
  "A square after a long day.",
  "A box for someone you love.",
  "A little surprise on a Tuesday.",
  "A celebration.",
  "A thank-you.",
  "Or simply… because chocolate.",
];

/**
 * Shop-card titles are split across two lines. Mirrors the original `SHOT`
 * derivation: drop a leading "The", then break near the middle.
 */
export const SHOT: ShopCard[] = PRODUCTS.filter((p) => p.img).map((p) => {
  const w = p.name.replace(/^The /, "").split(" ");
  const cut = w.length > 2 ? Math.ceil(w.length / 2) : 1;
  return { ...p, t1: w.slice(0, cut).join(" "), t2: w.slice(cut).join(" ") };
});

/** Look a bar up by slug, falling back to the first (matches the original). */
export function findProduct(slug: string | null | undefined): Product {
  return PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
}

/** Free shipping above this subtotal, in rupees. */
export const FREE_SHIPPING_OVER = 1500;
export const FLAT_SHIPPING = 90;
