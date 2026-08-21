require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    "name": "RTX 3060 12GB",
    "category": "GPU",
    "brand": "NVIDIA",
    "price": 249,
    "image": "rtx3060-12gb.jpg",
    "description": "A capable graphics card for smooth 1080p gaming, creative workloads, and systems that benefit from a generous 12GB memory buffer.",
    "specifications": {
      "memory": "12GB GDDR6",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 9
  },
  {
    "name": "RTX 4060 Ti 16GB",
    "category": "GPU",
    "brand": "NVIDIA",
    "price": 449,
    "image": "rtx4060ti-16gb.jpg",
    "description": "A versatile 1080p and 1440p graphics card with 16GB of VRAM for gaming, streaming, and GPU-accelerated applications.",
    "specifications": {
      "memory": "16GB GDDR6",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 5
  },
  {
    "name": "RTX 4070 SUPER",
    "category": "GPU",
    "brand": "NVIDIA",
    "price": 599,
    "image": "rtx4070-super.jpg",
    "description": "Built for high-refresh-rate 1440p gaming, this GPU combines strong performance with modern ray tracing and AI-accelerated features.",
    "specifications": {
      "memory": "12GB GDDR6X",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 4
  },
  {
    "name": "RTX 4070 Ti SUPER",
    "category": "GPU",
    "brand": "NVIDIA",
    "price": 799,
    "image": "rtx4070-ti-super.jpg",
    "description": "A high-end graphics solution designed for demanding 1440p and 4K gaming with a larger memory capacity.",
    "specifications": {
      "memory": "16GB GDDR6X",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 3
  },
  {
    "name": "RTX 4090",
    "category": "GPU",
    "brand": "NVIDIA",
    "price": 1599,
    "image": "rtx4090.jpg",
    "description": "An enthusiast-class GPU designed for extreme gaming, rendering, AI workloads, and other demanding applications.",
    "specifications": {
      "memory": "24GB GDDR6X",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 0
  },
  {
    "name": "RX 7600",
    "category": "GPU",
    "brand": "AMD",
    "price": 269,
    "image": "rx7600.jpg",
    "description": "A practical Radeon graphics card for responsive 1080p gaming and everyday GPU-accelerated workloads.",
    "specifications": {
      "memory": "8GB GDDR6",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 8
  },
  {
    "name": "RX 7700 XT",
    "category": "GPU",
    "brand": "AMD",
    "price": 399,
    "image": "rx7700xt.jpg",
    "description": "Designed for strong 1440p gaming performance with a modern memory subsystem and broad display connectivity.",
    "specifications": {
      "memory": "12GB GDDR6",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 6
  },
  {
    "name": "RX 7900 GRE",
    "category": "GPU",
    "brand": "AMD",
    "price": 549,
    "image": "rx7900gre.jpg",
    "description": "A high-performance Radeon card aimed at demanding 1440p gaming and capable 4K setups.",
    "specifications": {
      "memory": "16GB GDDR6",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 4
  },
  {
    "name": "RX 7900 XT",
    "category": "GPU",
    "brand": "AMD",
    "price": 699,
    "image": "rx7900xt.jpg",
    "description": "A powerful graphics card for high-end gaming and creative workloads, with a large 20GB memory capacity.",
    "specifications": {
      "memory": "20GB GDDR6",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 2
  },
  {
    "name": "RX 7900 XTX",
    "category": "GPU",
    "brand": "AMD",
    "price": 899,
    "image": "rx7900xtx.jpg",
    "description": "An enthusiast Radeon GPU built for demanding 4K gaming, content creation, and memory-intensive workloads.",
    "specifications": {
      "memory": "24GB GDDR6",
      "interface": "PCIe 4.0",
      "outputs": "HDMI + DisplayPort"
    },
    "stock": 2
  },
  {
    "name": "Ryzen 5 7600X",
    "category": "CPU",
    "brand": "AMD",
    "price": 229,
    "image": "ryzen57600x.jpg",
    "description": "A fast 6-core AM5 processor that balances gaming performance with responsive everyday productivity.",
    "specifications": {
      "cores": 6,
      "threads": 12,
      "socket": "AM5"
    },
    "stock": 8
  },
  {
    "name": "Ryzen 7 7700",
    "category": "CPU",
    "brand": "AMD",
    "price": 279,
    "image": "ryzen77700.jpg",
    "description": "An efficient 8-core processor suited to gaming, multitasking, development, and content creation.",
    "specifications": {
      "cores": 8,
      "threads": 16,
      "socket": "AM5"
    },
    "stock": 7
  },
  {
    "name": "Ryzen 9 7900X",
    "category": "CPU",
    "brand": "AMD",
    "price": 399,
    "image": "ryzen97900x.jpg",
    "description": "A high-core-count AM5 processor designed for demanding productivity, rendering, development, and gaming workloads.",
    "specifications": {
      "cores": 12,
      "threads": 24,
      "socket": "AM5"
    },
    "stock": 4
  },
  {
    "name": "Ryzen 9 7950X3D",
    "category": "CPU",
    "brand": "AMD",
    "price": 599,
    "image": "ryzen97950x3d.jpg",
    "description": "A premium hybrid processor combining high multicore capability with 3D V-Cache technology for demanding gaming systems.",
    "specifications": {
      "cores": 16,
      "threads": 32,
      "socket": "AM5"
    },
    "stock": 0
  },
  {
    "name": "Core i5-14400F",
    "category": "CPU",
    "brand": "Intel",
    "price": 199,
    "image": "i5-14400f.jpg",
    "description": "A balanced hybrid desktop processor for affordable gaming PCs, development, and everyday multitasking.",
    "specifications": {
      "cores": 10,
      "threads": 16,
      "socket": "LGA1700"
    },
    "stock": 10
  },
  {
    "name": "Core i5-14600KF",
    "category": "CPU",
    "brand": "Intel",
    "price": 289,
    "image": "i5-14600kf.jpg",
    "description": "A high-performance unlocked desktop processor for gaming and demanding workloads in enthusiast builds.",
    "specifications": {
      "cores": 14,
      "threads": 20,
      "socket": "LGA1700"
    },
    "stock": 5
  },
  {
    "name": "Core i9-14900K",
    "category": "CPU",
    "brand": "Intel",
    "price": 549,
    "image": "i9-14900k.jpg",
    "description": "A flagship-class desktop processor built for demanding gaming, creation, compiling, and workstation-style workloads.",
    "specifications": {
      "cores": 24,
      "threads": 32,
      "socket": "LGA1700"
    },
    "stock": 2
  },
  {
    "name": "Core Ultra 7 265K",
    "category": "CPU",
    "brand": "Intel",
    "price": 399,
    "image": "core-ultra-7-265k.jpg",
    "description": "A modern enthusiast desktop processor designed for gaming, productivity, and AI-assisted PC workloads.",
    "specifications": {
      "cores": 20,
      "threads": 20,
      "socket": "LGA1851"
    },
    "stock": 0
  },
  {
    "name": "Corsair Vengeance 32GB",
    "category": "RAM",
    "brand": "Corsair",
    "price": 99,
    "image": "corsair-vengeance-32gb.jpg",
    "description": "A 32GB DDR5 memory kit that gives modern gaming and productivity PCs extra multitasking headroom.",
    "specifications": {
      "capacity": "32GB",
      "type": "DDR5",
      "speed": "6000MHz"
    },
    "stock": 12
  },
  {
    "name": "G.Skill Ripjaws S5 32GB",
    "category": "RAM",
    "brand": "G.Skill",
    "price": 94,
    "image": "gskill-ripjaws-s5-32gb.jpg",
    "description": "A low-profile DDR5 kit designed for gaming and performance-focused desktop builds.",
    "specifications": {
      "capacity": "32GB",
      "type": "DDR5",
      "speed": "6000MHz"
    },
    "stock": 8
  },
  {
    "name": "G.Skill Trident Z5 RGB 32GB",
    "category": "RAM",
    "brand": "G.Skill",
    "price": 119,
    "image": "gskill-trident-z5-rgb-32gb.jpg",
    "description": "A high-speed DDR5 kit combining strong performance with customizable RGB lighting for enthusiast systems.",
    "specifications": {
      "capacity": "32GB",
      "type": "DDR5",
      "speed": "6000MHz",
      "lighting": "RGB"
    },
    "stock": 6
  },
  {
    "name": "Kingston Fury Beast 16GB",
    "category": "RAM",
    "brand": "Kingston",
    "price": 45,
    "image": "kingston-fury-beast-16gb.jpg",
    "description": "A practical DDR5 memory module for affordable gaming and general-purpose desktop upgrades.",
    "specifications": {
      "capacity": "16GB",
      "type": "DDR5",
      "speed": "5600MHz"
    },
    "stock": 14
  },
  {
    "name": "Crucial Pro 32GB",
    "category": "RAM",
    "brand": "Crucial",
    "price": 79,
    "image": "crucial-pro-32gb.jpg",
    "description": "A dependable 32GB DDR5 kit for users who need more memory for gaming, productivity, and multitasking.",
    "specifications": {
      "capacity": "32GB",
      "type": "DDR5",
      "speed": "5600MHz"
    },
    "stock": 8
  },
  {
    "name": "Corsair Dominator Titanium 64GB",
    "category": "RAM",
    "brand": "Corsair",
    "price": 219,
    "image": "corsair-dominator-titanium-64gb.jpg",
    "description": "A premium high-capacity DDR5 kit for demanding workstations, content creation, and enthusiast PCs.",
    "specifications": {
      "capacity": "64GB",
      "type": "DDR5",
      "speed": "6000MHz"
    },
    "stock": 3
  },
  {
    "name": "Samsung 990 Pro 2TB",
    "category": "Storage",
    "brand": "Samsung",
    "price": 169,
    "image": "samsung990pro-2tb.jpg",
    "description": "A high-end PCIe 4.0 NVMe SSD offering fast game loading, application launches, and large-file transfers.",
    "specifications": {
      "capacity": "2TB",
      "interface": "PCIe 4.0 NVMe",
      "readSpeed": "7450MB/s"
    },
    "stock": 7
  },
  {
    "name": "WD Black SN850X 1TB",
    "category": "Storage",
    "brand": "Western Digital",
    "price": 89,
    "image": "wd-sn850x-1tb.jpg",
    "description": "A performance-oriented NVMe SSD designed to deliver quick game loads and responsive desktop performance.",
    "specifications": {
      "capacity": "1TB",
      "interface": "PCIe 4.0 NVMe",
      "readSpeed": "7300MB/s"
    },
    "stock": 10
  },
  {
    "name": "Crucial T500 2TB",
    "category": "Storage",
    "brand": "Crucial",
    "price": 149,
    "image": "crucial-t500-2tb.jpg",
    "description": "A fast PCIe 4.0 NVMe drive suitable for gaming libraries, creative applications, and everyday high-speed storage.",
    "specifications": {
      "capacity": "2TB",
      "interface": "PCIe 4.0 NVMe",
      "readSpeed": "7400MB/s"
    },
    "stock": 5
  },
  {
    "name": "Kingston KC3000 1TB",
    "category": "Storage",
    "brand": "Kingston",
    "price": 89,
    "image": "kingston-kc3000-1tb.jpg",
    "description": "A reliable PCIe 4.0 NVMe SSD for responsive operating systems, applications, and gaming installations.",
    "specifications": {
      "capacity": "1TB",
      "interface": "PCIe 4.0 NVMe",
      "readSpeed": "7000MB/s"
    },
    "stock": 11
  },
  {
    "name": "Seagate FireCuda 530 2TB",
    "category": "Storage",
    "brand": "Seagate",
    "price": 179,
    "image": "seagate-firecuda-530-2tb.jpg",
    "description": "A high-performance NVMe SSD built for demanding gaming systems and workloads that require sustained storage performance.",
    "specifications": {
      "capacity": "2TB",
      "interface": "PCIe 4.0 NVMe",
      "readSpeed": "7300MB/s"
    },
    "stock": 0
  },
  {
    "name": "Crucial MX500 1TB",
    "category": "Storage",
    "brand": "Crucial",
    "price": 69,
    "image": "crucial-mx500-1tb.jpg",
    "description": "A dependable 2.5-inch SATA SSD that provides a practical upgrade for systems that do not support NVMe storage.",
    "specifications": {
      "capacity": "1TB",
      "interface": "SATA III",
      "formFactor": "2.5-inch"
    },
    "stock": 13
  },
  {
    "name": "ASUS TUF Gaming B650-PLUS",
    "category": "Motherboard",
    "brand": "ASUS",
    "price": 199,
    "image": "asus-tuf-b650-plus.jpg",
    "description": "A durable AM5 motherboard with modern connectivity and DDR5 support for gaming-focused Ryzen builds.",
    "specifications": {
      "socket": "AM5",
      "memory": "DDR5",
      "chipset": "B650"
    },
    "stock": 5
  },
  {
    "name": "MSI MAG B650 Tomahawk WiFi",
    "category": "Motherboard",
    "brand": "MSI",
    "price": 219,
    "image": "msi-b650-tomahawk-wifi.jpg",
    "description": "A feature-rich AM5 motherboard aimed at gaming systems that need strong connectivity and expansion options.",
    "specifications": {
      "socket": "AM5",
      "memory": "DDR5",
      "chipset": "B650",
      "wireless": "Wi-Fi"
    },
    "stock": 6
  },
  {
    "name": "Gigabyte B650 AORUS Elite AX",
    "category": "Motherboard",
    "brand": "Gigabyte",
    "price": 199,
    "image": "gigabyte-b650-aorus-elite-ax.jpg",
    "description": "A well-equipped AM5 motherboard for Ryzen builds with DDR5 memory support and integrated wireless connectivity.",
    "specifications": {
      "socket": "AM5",
      "memory": "DDR5",
      "chipset": "B650",
      "wireless": "Wi-Fi"
    },
    "stock": 4
  },
  {
    "name": "ASRock B650M Pro RS",
    "category": "Motherboard",
    "brand": "ASRock",
    "price": 139,
    "image": "asrock-b650m-pro-rs.jpg",
    "description": "A compact AM5 motherboard for affordable Ryzen systems where practical expansion and DDR5 support are important.",
    "specifications": {
      "socket": "AM5",
      "memory": "DDR5",
      "chipset": "B650",
      "formFactor": "Micro-ATX"
    },
    "stock": 8
  },
  {
    "name": "MSI PRO Z790-A MAX WiFi",
    "category": "Motherboard",
    "brand": "MSI",
    "price": 249,
    "image": "msi-z790-a-max-wifi.jpg",
    "description": "A versatile Intel motherboard for performance desktop builds with DDR5 support and modern wireless connectivity.",
    "specifications": {
      "socket": "LGA1700",
      "memory": "DDR5",
      "chipset": "Z790",
      "wireless": "Wi-Fi"
    },
    "stock": 3
  },
  {
    "name": "ASUS ROG STRIX Z790-E Gaming WiFi II",
    "category": "Motherboard",
    "brand": "ASUS",
    "price": 399,
    "image": "asus-rog-z790-e-wifi-ii.jpg",
    "description": "A premium enthusiast motherboard with extensive connectivity and expansion options for high-end Intel systems.",
    "specifications": {
      "socket": "LGA1700",
      "memory": "DDR5",
      "chipset": "Z790",
      "wireless": "Wi-Fi"
    },
    "stock": 0
  },
  {
    "name": "Corsair RM850e",
    "category": "PSU",
    "brand": "Corsair",
    "price": 119,
    "image": "corsair-rm850e.jpg",
    "description": "A fully modular 850W power supply suited to high-performance gaming PCs with efficient power delivery.",
    "specifications": {
      "wattage": "850W",
      "efficiency": "80+ Gold",
      "modular": "Fully Modular"
    },
    "stock": 7
  },
  {
    "name": "be quiet! Pure Power 12 M 850W",
    "category": "PSU",
    "brand": "be quiet!",
    "price": 129,
    "image": "bequiet-pure-power-12m-850w.jpg",
    "description": "A quiet, fully modular power supply designed for modern gaming systems and demanding graphics cards.",
    "specifications": {
      "wattage": "850W",
      "efficiency": "80+ Gold",
      "modular": "Fully Modular"
    },
    "stock": 4
  },
  {
    "name": "MSI MAG A650BN",
    "category": "PSU",
    "brand": "MSI",
    "price": 59,
    "image": "msi-mag-a650bn.jpg",
    "description": "A practical 650W power supply for mainstream gaming and everyday desktop builds.",
    "specifications": {
      "wattage": "650W",
      "efficiency": "80+ Bronze",
      "modular": "Non-Modular"
    },
    "stock": 12
  },
  {
    "name": "Seasonic Focus GX-1000",
    "category": "PSU",
    "brand": "Seasonic",
    "price": 179,
    "image": "seasonic-focus-gx-1000.jpg",
    "description": "A high-capacity fully modular power supply designed for enthusiast systems with demanding GPU and CPU configurations.",
    "specifications": {
      "wattage": "1000W",
      "efficiency": "80+ Gold",
      "modular": "Fully Modular"
    },
    "stock": 0
  },
  {
    "name": "DeepCool AK400",
    "category": "Cooling",
    "brand": "DeepCool",
    "price": 39,
    "image": "deepcool-ak400.jpg",
    "description": "A compact tower air cooler offering a strong balance of cooling performance, size, and value.",
    "specifications": {
      "type": "Air Cooler",
      "fans": 1,
      "compatibility": "AM5 / LGA1700"
    },
    "stock": 14
  },
  {
    "name": "Cooler Master Hyper 212 Halo",
    "category": "Cooling",
    "brand": "Cooler Master",
    "price": 49,
    "image": "cooler-master-hyper-212-halo.jpg",
    "description": "A proven tower-style CPU cooler with a modern design for mainstream gaming and productivity systems.",
    "specifications": {
      "type": "Air Cooler",
      "fans": 1,
      "compatibility": "AM5 / LGA1700",
      "lighting": "RGB"
    },
    "stock": 9
  },
  {
    "name": "Arctic Liquid Freezer III 360",
    "category": "Cooling",
    "brand": "Arctic",
    "price": 139,
    "image": "arctic-liquid-freezer-iii-360.jpg",
    "description": "A high-capacity 360mm liquid cooler designed for powerful CPUs and sustained heavy workloads.",
    "specifications": {
      "type": "AIO Liquid Cooler",
      "radiator": "360mm",
      "compatibility": "AM5 / LGA1700"
    },
    "stock": 3
  },
  {
    "name": "NZXT Kraken 360 RGB",
    "category": "Cooling",
    "brand": "NZXT",
    "price": 179,
    "image": "nzxt-kraken-360-rgb.jpg",
    "description": "A premium 360mm all-in-one liquid cooler combining strong CPU cooling with customizable RGB styling.",
    "specifications": {
      "type": "AIO Liquid Cooler",
      "radiator": "360mm",
      "compatibility": "AM5 / LGA1700",
      "lighting": "RGB"
    },
    "stock": 4
  },
  {
    "name": "NZXT H5 Flow",
    "category": "Case",
    "brand": "NZXT",
    "price": 94,
    "image": "nzxt-h5-flow.jpg",
    "description": "A compact ATX case focused on airflow, clean cable management, and straightforward gaming PC assembly.",
    "specifications": {
      "formFactor": "ATX",
      "sidePanel": "Tempered Glass",
      "airflow": "High Airflow"
    },
    "stock": 8
  },
  {
    "name": "Corsair 4000D Airflow",
    "category": "Case",
    "brand": "Corsair",
    "price": 104,
    "image": "corsair-4000d-airflow.jpg",
    "description": "A popular airflow-focused mid-tower case with flexible component support and a clean internal layout.",
    "specifications": {
      "formFactor": "ATX",
      "sidePanel": "Tempered Glass",
      "airflow": "High Airflow"
    },
    "stock": 6
  },
  {
    "name": "Lian Li LANCOOL 216",
    "category": "Case",
    "brand": "Lian Li",
    "price": 119,
    "image": "lian-li-lancool-216.jpg",
    "description": "An airflow-oriented mid-tower case designed to provide strong cooling potential for gaming hardware.",
    "specifications": {
      "formFactor": "ATX",
      "sidePanel": "Tempered Glass",
      "airflow": "High Airflow"
    },
    "stock": 5
  },
  {
    "name": "LG UltraGear 27GP850-B",
    "category": "Monitor",
    "brand": "LG",
    "price": 329,
    "image": "lg-ultragear-27gp850-b.jpg",
    "description": "A 27-inch high-refresh gaming monitor aimed at smooth 1440p gameplay and responsive competitive play.",
    "specifications": {
      "size": "27-inch",
      "resolution": "2560x1440",
      "refreshRate": "165Hz",
      "panel": "IPS"
    },
    "stock": 5
  },
  {
    "name": "AOC CQ32G2S",
    "category": "Monitor",
    "brand": "AOC",
    "price": 299,
    "image": "aoc-cq32g2s.jpg",
    "description": "A large curved gaming display offering an immersive 1440p experience with a high refresh rate.",
    "specifications": {
      "size": "32-inch",
      "resolution": "2560x1440",
      "refreshRate": "165Hz",
      "panel": "VA"
    },
    "stock": 0
  },
  {
    "name": "Logitech G Pro X TKL",
    "category": "Keyboard",
    "brand": "Logitech",
    "price": 149,
    "image": "logitech-g-pro-x-tkl.jpg",
    "description": "A compact tenkeyless gaming keyboard designed for competitive play with a clean desktop footprint.",
    "specifications": {
      "layout": "TKL",
      "connection": "Wireless / USB",
      "switches": "Mechanical"
    },
    "stock": 7
  }
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let inserted = 0;
    let skipped = 0;

    for (const product of products) {
      const exists = await Product.exists({ name: product.name });

      if (exists) {
        console.log(`Skipped: ${product.name}`);
        skipped++;
        continue;
      }

      await Product.create(product);
      console.log(`Inserted: ${product.name}`);
      inserted++;
    }

    console.log(`\\nFinished. Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

seed();
