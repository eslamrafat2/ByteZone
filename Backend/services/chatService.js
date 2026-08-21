const Product = require("../models/Product");

// ======================================================
// CATEGORY ALIASES
// ======================================================

const CATEGORY_ALIASES = {
  GPU: [
    "gpu",
    "graphics card",
    "graphic card",
    "video card",
    "كارت شاشة",
    "كارت الشاشه",
    "كارت",
    "بطاقة شاشة",
    "بطاقه شاشه",
    "فيجا",
    "vga",
  ],

  CPU: ["cpu", "processor", "معالج", "بروسيسور", "بروسسر"],

  RAM: ["ram", "memory", "system memory", "رام", "ذاكرة", "ذاكره"],

  Storage: [
    "ssd",
    "hdd",
    "storage",
    "hard disk",
    "hard drive",
    "nvme",
    "تخزين",
    "هارد",
    "هارد ديسك",
    "اس اس دي",
  ],

  Motherboard: [
    "motherboard",
    "mainboard",
    "mobo",
    "ماذربورد",
    "مازر بورد",
    "لوحة ام",
    "لوحه ام",
  ],

  PSU: [
    "psu",
    "power supply",
    "power",
    "باور",
    "باور سبلاي",
    "مزود طاقة",
    "مزود طاقه",
  ],

  Cooling: [
    "cooling",
    "cooler",
    "cpu cooler",
    "air cooler",
    "water cooler",
    "تبريد",
    "كولر",
    "مبرد",
  ],

  Case: [
    "case",
    "pc case",
    "computer case",
    "كيسة",
    "كيسه",
    "كابينة",
    "كابينه",
  ],

  Monitor: ["monitor", "screen", "display", "شاشة", "شاشه", "مونيتور"],

  Keyboard: ["keyboard", "كيبورد", "لوحة مفاتيح", "لوحه مفاتيح"],
};

// ======================================================
// BRAND ALIASES
// ======================================================

const BRAND_ALIASES = {
  NVIDIA: ["nvidia", "نفيديا", "نيفيديا"],
  AMD: ["amd"],
  Intel: ["intel", "انتل", "إنتل"],
  ASUS: ["asus", "اسوس", "أسوس"],
  MSI: ["msi"],
  Gigabyte: ["gigabyte", "جيجابايت", "جيجا بايت"],
  Corsair: ["corsair", "كورسير"],
  Kingston: ["kingston", "كينجستون"],
  Samsung: ["samsung", "سامسونج"],
  "Western Digital": ["western digital", "wd", "ويسترن ديجيتال"],
  Seagate: ["seagate", "سيجيت"],
  Crucial: ["crucial"],
  DeepCool: ["deepcool", "deep cool"],
  "Cooler Master": ["cooler master"],
  Logitech: ["logitech", "لوجيتيك"],
  LG: ["lg","لج"],
  AOC: ["aoc"],
  NZXT: ["nzxt","نيكزت"],
  "Lian Li": ["lian li"],
  "be quiet!": ["be quiet", "bequiet"],
  Seasonic: ["seasonic"],
  Arctic: ["arctic"],
  ASRock: ["asrock", "as rock"],
};

// ======================================================
// TEXT HELPERS
// ======================================================

function normalizeArabic(text) {
  return text
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .replace(/َ|ً|ُ|ٌ|ِ|ٍ|ْ|ّ/g, "");
}

function normalizeText(text) {
  return normalizeArabic(
    String(text)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}$.\s-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function containsAlias(text, aliases) {
  return aliases.some((alias) => {
    const normalizedAlias = normalizeText(alias);

    return (
      text === normalizedAlias ||
      text.includes(` ${normalizedAlias} `) ||
      text.startsWith(`${normalizedAlias} `) ||
      text.endsWith(` ${normalizedAlias}`) ||
      text.includes(normalizedAlias)
    );
  });
}

// ======================================================
// CATEGORY DETECTION
// ======================================================

function detectCategory(text) {
  const normalized = normalizeText(text);

  for (const [category, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (containsAlias(normalized, aliases)) {
      return category;
    }
  }

  return null;
}

// ======================================================
// BRAND DETECTION
// ======================================================

function detectBrand(text) {
  const normalized = normalizeText(text);

  for (const [brand, aliases] of Object.entries(BRAND_ALIASES)) {
    if (containsAlias(normalized, aliases)) {
      return brand;
    }
  }

  return null;
}

// ======================================================
// PRICE DETECTION
// ======================================================

function extractPrice(text) {
  const normalized = normalizeText(text);

  let minPrice = null;
  let maxPrice = null;

  // Example:
  // من 100 لحد 300
  // from 100 to 300

  const rangeMatch = normalized.match(
    /(?:من|from)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:الى|إلى|لحد|to|-)\s*\$?\s*(\d+(?:\.\d+)?)/i,
  );

  if (rangeMatch) {
    minPrice = Number(rangeMatch[1]);
    maxPrice = Number(rangeMatch[2]);

    return {
      minPrice,
      maxPrice,
    };
  }

  const maxPatterns = [
    /(?:لحد|حد اقصى|اقصى|اقل من|في حدود|بحدود|حدود|ميزانيه|ميزانية|under|below|less than|up to|max(?:imum)?)\s*\$?\s*(\d+(?:\.\d+)?)/i,

    /\$\s*(\d+(?:\.\d+)?)/i,

    /(\d+(?:\.\d+)?)\s*(?:usd|dollar|dollars|دولار)/i,
  ];

  for (const pattern of maxPatterns) {
    const match = normalized.match(pattern);

    if (match) {
      maxPrice = Number(match[1]);
      break;
    }
  }

  return {
    minPrice,
    maxPrice,
  };
}

// ======================================================
// MEMORY DETECTION
// ======================================================

function extractMemory(text) {
  const normalized = normalizeText(text);

  const match = normalized.match(
    /(\d+(?:\.\d+)?)\s*(gb|tb|جيجا|جيجابايت|تيرا|تيرابايت)/i,
  );

  if (!match) {
    return null;
  }

  let value = Number(match[1]);

  const unit = match[2].toLowerCase();

  if (unit === "tb" || unit === "تيرا" || unit === "تيرابايت") {
    value *= 1024;
  }

  return value;
}

// ======================================================
// USE CASE
// ======================================================

function detectUseCase(text) {
  const normalized = normalizeText(text);

  if (
    normalized.includes("gaming") ||
    normalized.includes("game") ||
    normalized.includes("العاب")
  ) {
    return "gaming";
  }

  if (
    normalized.includes("development") ||
    normalized.includes("developer") ||
    normalized.includes("برمجه") ||
    normalized.includes("برمجة") ||
    normalized.includes("برمجيات")
  ) {
    return "development";
  }

  if (
    normalized.includes("editing") ||
    normalized.includes("montage") ||
    normalized.includes("video") ||
    normalized.includes("مونتاج") ||
    normalized.includes("فيديو")
  ) {
    return "editing";
  }

  if (
    normalized.includes("stream") ||
    normalized.includes("streaming") ||
    normalized.includes("بث")
  ) {
    return "streaming";
  }

  return null;
}

// ======================================================
// PRODUCT TEXT
// ======================================================

function productSearchText(product) {
  const specifications = product.specifications || {};

  return normalizeText(
    [
      product.name,
      product.category,
      product.brand,
      product.description,
      ...Object.entries(specifications).flat(),
    ].join(" "),
  );
}

// ======================================================
// LEVENSHTEIN
// ======================================================

function levenshtein(a, b) {
  const matrix = Array.from(
    {
      length: b.length + 1,
    },
    () => Array(a.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      matrix[j][i] =
        b[j - 1] === a[i - 1]
          ? matrix[j - 1][i - 1]
          : Math.min(
              matrix[j - 1][i] + 1,
              matrix[j][i - 1] + 1,
              matrix[j - 1][i - 1] + 1,
            );
    }
  }

  return matrix[b.length][a.length];
}

// ======================================================
// FUZZY PRODUCT NAME SEARCH
// ======================================================

function fuzzyScore(query, productName) {
  const q = normalizeText(query);
  const p = normalizeText(productName);

  if (!q || !p) {
    return 0;
  }

  if (p === q) {
    return 100;
  }

  if (p.includes(q)) {
    return 90;
  }

  const words = q.split(" ");

  let score = 0;

  for (const word of words) {
    if (word.length < 2) {
      continue;
    }

    if (p.includes(word)) {
      score += 15;
      continue;
    }

    const productWords = p.split(" ");

    const closest = Math.min(
      ...productWords.map((productWord) => levenshtein(word, productWord)),
    );

    if (closest <= 2) {
      score += 8;
    }
  }

  return Math.min(score, 85);
}

// ======================================================
// PRODUCT SCORING
// ======================================================

function scoreProduct(product, filters, originalMessage) {
  let score = 0;

  const name = normalizeText(product.name || "");
  const brand = normalizeText(product.brand || "");
  const category = normalizeText(product.category || "");

  const description = normalizeText(product.description || "");

  const specs = product.specifications || {};

  const fullText = productSearchText(product);

  const message = normalizeText(originalMessage);

  // ----------------------------------------------------
  // CATEGORY
  // ----------------------------------------------------

  if (filters.category) {
    if (category === normalizeText(filters.category)) {
      score += 45;
    } else {
      return -999;
    }
  }

  // ----------------------------------------------------
  // BRAND
  // ----------------------------------------------------

  if (filters.brand) {
    if (brand === normalizeText(filters.brand)) {
      score += 35;
    } else {
      return -999;
    }
  }

  // ----------------------------------------------------
  // MAX PRICE
  // ----------------------------------------------------

  if (filters.maxPrice !== null) {
    if (product.price <= filters.maxPrice) {
      score += 25;

      const difference = filters.maxPrice - product.price;

      if (filters.maxPrice > 0 && difference <= filters.maxPrice * 0.15) {
        score += 10;
      }
    } else {
      return -999;
    }
  }

  // ----------------------------------------------------
  // MIN PRICE
  // ----------------------------------------------------

  if (filters.minPrice !== null) {
    if (product.price >= filters.minPrice) {
      score += 10;
    } else {
      return -999;
    }
  }

  // ----------------------------------------------------
  // MEMORY
  // ----------------------------------------------------

  if (filters.memory) {
    const memoryText = normalizeText(
      [specs.memory, specs.capacity, product.name, product.description].join(
        " ",
      ),
    );

    const memoryMatch = memoryText.match(/(\d+(?:\.\d+)?)\s*(gb|tb)/i);

    if (memoryMatch) {
      let memory = Number(memoryMatch[1]);

      if (memoryMatch[2].toLowerCase() === "tb") {
        memory *= 1024;
      }

      if (memory >= filters.memory) {
        score += 20;
      } else {
        return -999;
      }
    }
  }

  // ----------------------------------------------------
  // GAMING
  // ----------------------------------------------------

  if (filters.useCase === "gaming") {
    if (
      fullText.includes("gaming") ||
      fullText.includes("game") ||
      category === "gpu" ||
      category === "cpu" ||
      category === "ram"
    ) {
      score += 15;
    }
  }

  // ----------------------------------------------------
  // DEVELOPMENT
  // ----------------------------------------------------

  if (filters.useCase === "development") {
    if (category === "cpu" || category === "ram" || category === "storage") {
      score += 15;
    }
  }

  // ----------------------------------------------------
  // EDITING
  // ----------------------------------------------------

  if (filters.useCase === "editing") {
    if (
      category === "gpu" ||
      category === "cpu" ||
      category === "ram" ||
      fullText.includes("video")
    ) {
      score += 15;
    }
  }

  // ----------------------------------------------------
  // KEYWORD MATCHING
  // ----------------------------------------------------

  const importantWords = message
    .split(" ")
    .filter((word) => word.length >= 3)
    .slice(0, 15);

  for (const word of importantWords) {
    if (name.includes(word)) {
      score += 12;
    } else if (brand.includes(word)) {
      score += 8;
    } else if (description.includes(word)) {
      score += 4;
    }
  }

  // ----------------------------------------------------
  // STOCK BONUS
  // ----------------------------------------------------

  if (product.stock > 0) {
    score += 5;
  }

  return score;
}

// ======================================================
// SEARCH PRODUCTS
// ======================================================

async function searchProducts(message) {
  const normalized = normalizeText(message);

  const price = extractPrice(normalized);

  const filters = {
    category: detectCategory(normalized),

    brand: detectBrand(normalized),

    minPrice: price.minPrice,

    maxPrice: price.maxPrice,

    memory: extractMemory(normalized),

    useCase: detectUseCase(normalized),
  };

  // ====================================================
  // IMPORTANT:
  // Don't return random products for normal conversation
  // ====================================================

  const hasSearchCriteria =
    filters.category ||
    filters.brand ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.memory !== null ||
    filters.useCase;

  // ====================================================
  // GET PRODUCTS
  // ====================================================

  const products = await Product.find({}).lean();

  // ====================================================
  // SCORE PRODUCTS
  // ====================================================

  let scoredProducts = [];

  if (hasSearchCriteria) {
    scoredProducts = products
      .map((product) => ({
        product,

        score: scoreProduct(product, filters, message),
      }))
      .filter((item) => item.score > 0);
  }

  // ====================================================
  // NAME SEARCH
  // ====================================================

  // If no filters were detected, try searching
  // by product name / brand words.

  if (!hasSearchCriteria && normalized.length >= 2) {
    scoredProducts = products
      .map((product) => ({
        product,

        score: fuzzyScore(normalized, product.name),
      }))
      .filter((item) => item.score >= 40);
  }

  // ====================================================
  // SORT
  // ====================================================

  scoredProducts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // Available products first
    if (a.product.stock > 0 && b.product.stock === 0) {
      return -1;
    }

    if (a.product.stock === 0 && b.product.stock > 0) {
      return 1;
    }

    // Cheaper products first
    return a.product.price - b.product.price;
  });

  // ====================================================
  // RETURN
  // ====================================================

  return {
    filters,

    products: scoredProducts.slice(0, 6).map((item) => item.product),
  };
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  searchProducts,
};
