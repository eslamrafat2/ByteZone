require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const productsToSeed = [
    {
        name: "RTX 4060 Ti",
        category: "GPU",
        brand: "NVIDIA",
        price: 399,
        image: "rtx4060ti.jpg",
        description: "High-performance 1080p and 1440p gaming graphics card.",
        specifications: {
            memory: "8GB GDDR6",
            interface: "PCIe 4.0",
            outputs: "HDMI + DisplayPort"
        },
        stock: 6
    },
    {
        name: "RTX 4070",
        category: "GPU",
        brand: "NVIDIA",
        price: 549,
        image: "rtx4070.jpg",
        description: "Powerful graphics card for high-refresh-rate 1440p gaming.",
        specifications: {
            memory: "12GB GDDR6X",
            interface: "PCIe 4.0",
            outputs: "HDMI + DisplayPort"
        },
        stock: 4
    },
    {
        name: "RTX 4080 SUPER",
        category: "GPU",
        brand: "NVIDIA",
        price: 999,
        image: "rtx4080super.jpg",
        description: "Enthusiast graphics card for demanding gaming and creative workloads.",
        specifications: {
            memory: "16GB GDDR6X",
            interface: "PCIe 4.0",
            outputs: "HDMI + DisplayPort"
        },
        stock: 0
    },
    {
        name: "RX 7800 XT",
        category: "GPU",
        brand: "AMD",
        price: 499,
        image: "rx7800xt.jpg",
        description: "High-performance Radeon graphics card for 1440p gaming.",
        specifications: {
            memory: "16GB GDDR6",
            interface: "PCIe 4.0",
            outputs: "HDMI + DisplayPort"
        },
        stock: 7
    },
    {
        name: "Ryzen 5 7600",
        category: "CPU",
        brand: "AMD",
        price: 199,
        image: "ryzen57600.jpg",
        description: "Efficient 6-core processor for gaming and everyday performance.",
        specifications: {
            cores: 6,
            threads: 12,
            socket: "AM5"
        },
        stock: 10
    },
    {
        name: "Ryzen 7 7800X3D",
        category: "CPU",
        brand: "AMD",
        price: 349,
        image: "ryzen77800x3d.jpg",
        description: "Gaming-focused processor with 3D V-Cache technology.",
        specifications: {
            cores: 8,
            threads: 16,
            socket: "AM5"
        },
        stock: 5
    },
    {
        name: "Core i5-14600K",
        category: "CPU",
        brand: "Intel",
        price: 319,
        image: "i514600k.jpg",
        description: "High-performance hybrid desktop processor for gaming and productivity.",
        specifications: {
            cores: 14,
            threads: 20,
            socket: "LGA1700"
        },
        stock: 8
    },
    {
        name: "Core i7-14700K",
        category: "CPU",
        brand: "Intel",
        price: 399,
        image: "i714700k.jpg",
        description: "Powerful desktop processor for gaming, development and content creation.",
        specifications: {
            cores: 20,
            threads: 28,
            socket: "LGA1700"
        },
        stock: 0
    },
    {
        name: "Corsair Vengeance 16GB",
        category: "RAM",
        brand: "Corsair",
        price: 49,
        image: "corsair-vengeance-16gb.jpg",
        description: "Reliable DDR5 memory for modern gaming PCs.",
        specifications: {
            capacity: "16GB",
            type: "DDR5",
            speed: "5600MHz"
        },
        stock: 15
    },
    {
        name: "Kingston Fury 32GB",
        category: "RAM",
        brand: "Kingston",
        price: 89,
        image: "kingston-fury-32gb.jpg",
        description: "High-capacity DDR5 memory kit for gaming and productivity.",
        specifications: {
            capacity: "32GB",
            type: "DDR5",
            speed: "6000MHz"
        },
        stock: 9
    },
    {
        name: "Samsung 990 Pro 1TB",
        category: "Storage",
        brand: "Samsung",
        price: 99,
        image: "samsung990pro1tb.jpg",
        description: "High-speed NVMe SSD for gaming and professional workloads.",
        specifications: {
            capacity: "1TB",
            interface: "PCIe 4.0 NVMe",
            readSpeed: "7450MB/s"
        },
        stock: 12
    },
    {
        name: "WD Black SN850X 2TB",
        category: "Storage",
        brand: "Western Digital",
        price: 149,
        image: "wdsn850x2tb.jpg",
        description: "High-performance NVMe SSD designed for gaming systems.",
        specifications: {
            capacity: "2TB",
            interface: "PCIe 4.0 NVMe",
            readSpeed: "7300MB/s"
        },
        stock: 6
    },
    {
        name: "MSI B650 Gaming Plus",
        category: "Motherboard",
        brand: "MSI",
        price: 169,
        image: "msi-b650-gaming-plus.jpg",
        description: "Feature-rich AM5 motherboard for modern Ryzen processors.",
        specifications: {
            socket: "AM5",
            memory: "DDR5",
            chipset: "B650"
        },
        stock: 5
    },
    {
        name: "ASUS TUF Gaming B760-PLUS",
        category: "Motherboard",
        brand: "ASUS",
        price: 179,
        image: "asus-b760-plus.jpg",
        description: "Durable Intel motherboard designed for gaming systems.",
        specifications: {
            socket: "LGA1700",
            memory: "DDR5",
            chipset: "B760"
        },
        stock: 0
    },
    {
        name: "Corsair RM750e",
        category: "PSU",
        brand: "Corsair",
        price: 99,
        image: "corsair-rm750e.jpg",
        description: "Reliable 750W modular power supply for gaming PCs.",
        specifications: {
            wattage: "750W",
            efficiency: "80+ Gold",
            modular: "Fully Modular"
        },
        stock: 8
    },
    {
        name: "DeepCool AK620",
        category: "Cooling",
        brand: "DeepCool",
        price: 69,
        image: "deepcool-ak620.jpg",
        description: "High-performance dual-tower CPU air cooler.",
        specifications: {
            type: "Air Cooler",
            fans: 2,
            compatibility: "AM5 / LGA1700"
        },
        stock: 11
    }
];

const seedProducts = async () => {
    let inserted = 0;
    let skipped = 0;

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not configured");
        }

        await mongoose.connect(process.env.MONGO_URI);

        for (const productData of productsToSeed) {
            const existingProduct = await Product.exists({
                name: productData.name
            });

            if (existingProduct) {
                skipped += 1;
                continue;
            }

            await Product.create(productData);
            inserted += 1;
        }

        console.log(`Product seed complete: ${inserted} inserted, ${skipped} skipped.`);
    } catch (error) {
        console.error("Product seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

seedProducts();
