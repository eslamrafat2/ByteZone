require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const descriptions = {
  "RTX 4060": "Designed for smooth 1080p and capable 1440p gaming, the RTX 4060 combines efficient performance with modern ray tracing and AI-accelerated features for compact gaming PCs.",
  "RTX 4060 Ti": "A versatile graphics card for high-refresh-rate 1080p and 1440p gaming, offering strong efficiency and modern features for gaming and creative workloads.",
  "RTX 4070": "Built for high-refresh-rate 1440p gaming, the RTX 4070 delivers strong performance with modern ray tracing, AI acceleration, and a practical 12GB memory capacity.",
  "RTX 4080 SUPER": "An enthusiast graphics card for demanding 4K gaming and creative workloads, combining high performance with 16GB of fast GDDR6X memory.",
  "RX 7800 XT": "A high-performance Radeon graphics card designed for smooth 1440p gaming, with 16GB of memory for modern games and demanding applications.",
  "Ryzen 5 7600": "A capable 6-core AM5 processor that provides responsive gaming and everyday performance while offering an excellent foundation for modern desktop builds.",
  "Ryzen 7 7800X3D": "A gaming-focused 8-core AM5 processor with 3D V-Cache technology, designed for high frame rates and demanding gaming systems.",
  "Core i5-14600K": "A high-performance hybrid desktop processor suited to gaming, development, content creation, and multitasking in performance-oriented PCs.",
  "Core i7-14700K": "A powerful hybrid desktop processor with substantial multicore capability for gaming, software development, rendering, and demanding productivity workloads.",
  "Corsair Vengeance 16GB": "A reliable DDR5 memory kit for modern gaming PCs, providing responsive system performance and a solid capacity for everyday gaming and multitasking.",
  "Kingston Fury 32GB": "A 32GB DDR5 memory kit designed to give gaming and productivity systems additional headroom for multitasking and demanding applications.",
  "Samsung 990 Pro 1TB": "A high-end PCIe 4.0 NVMe SSD offering fast application launches, game loading, and file transfers for performance-focused desktop systems.",
  "WD Black SN850X 2TB": "A high-performance 2TB NVMe SSD designed for gaming libraries and demanding desktop workloads where fast storage response matters.",
  "MSI B650 Gaming Plus": "A feature-rich AM5 motherboard designed for Ryzen processors, DDR5 memory, and modern gaming systems that need practical expansion options.",
  "ASUS TUF Gaming B760-PLUS": "A durable Intel motherboard designed for gaming builds, offering DDR5 support and a balanced set of connectivity and expansion features.",
  "Corsair RM750e": "A fully modular 750W power supply designed to provide efficient and flexible power delivery for modern gaming PCs.",
  "DeepCool AK620": "A dual-tower CPU air cooler designed for strong thermal performance in gaming and productivity systems while maintaining a practical air-cooling design."
};

async function updateDescriptions() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let updated = 0;
    let skipped = 0;

    for (const [name, description] of Object.entries(descriptions)) {
      const result = await Product.updateOne(
        { name },
        { $set: { description } }
      );

      if (result.matchedCount === 0) {
        console.log(`Skipped (not found): ${name}`);
        skipped++;
      } else if (result.modifiedCount > 0) {
        console.log(`Updated: ${name}`);
        updated++;
      } else {
        console.log(`Already up to date: ${name}`);
        skipped++;
      }
    }

    console.log(`\\nFinished. Updated: ${updated}, Skipped: ${skipped}`);
  } catch (error) {
    console.error('Description update failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

updateDescriptions();
