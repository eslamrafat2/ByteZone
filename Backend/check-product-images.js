require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const imagesDir = path.resolve(__dirname, '..', 'frontend', 'public', 'images', 'products');

async function checkProductImages() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in Backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find(
      {},
      { _id: 0, name: 1, image: 1 }
    ).sort({ name: 1 }).lean();

    const missing = [];
    const duplicateNames = [];
    const seenImages = new Map();

    for (const product of products) {
      if (!product.image) {
        missing.push({ name: product.name, image: '' });
        continue;
      }

      if (seenImages.has(product.image)) {
        duplicateNames.push({
          image: product.image,
          products: [seenImages.get(product.image), product.name]
        });
      } else {
        seenImages.set(product.image, product.name);
      }

      const filePath = path.join(imagesDir, product.image);
      if (!fs.existsSync(filePath)) {
        missing.push({ name: product.name, image: product.image });
      }
    }

    console.log(`Products checked: ${products.length}`);
    console.log(`Images directory: ${imagesDir}`);
    console.log(`Missing images: ${missing.length}`);
    console.log(`Duplicate image filenames: ${duplicateNames.length}`);

    if (missing.length) {
      console.log('\nMissing image files:');
      missing.forEach((item, i) =>
        console.log(`${i + 1}. ${item.name} -> ${item.image || '(empty)'}`)
      );
    }

    if (duplicateNames.length) {
      console.log('\nDuplicate image filenames:');
      duplicateNames.forEach(item =>
        console.log(`${item.image} -> ${item.products.join(' | ')}`)
      );
    }

    if (!missing.length && !duplicateNames.length) {
      console.log('\nAll product images are present and uniquely mapped.');
    }
  } catch (error) {
    console.error('Image check failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

checkProductImages();
