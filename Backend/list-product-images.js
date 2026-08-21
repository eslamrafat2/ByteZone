require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function listImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const products = await Product.find(
      {},
      { _id: 0, name: 1, image: 1, category: 1 }
    ).sort({ category: 1, name: 1 });

    console.log(`Total products: ${products.length}`);
    console.log('');

    products.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} → ${product.image} [${product.category}]`
      );
    });

  } catch (error) {
    console.error('Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

listImages();