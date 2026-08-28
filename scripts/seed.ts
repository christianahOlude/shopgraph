import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config({ path: ".env.local" });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
    throw new Error("CognoDB environment variables are not configured");
}

const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password),
);

const customers = [
    { id: "C001", name: "Ada" },
    { id: "C002", name: "Tunde" },
    { id: "C003", name: "Chidi" },
    { id: "C004", name: "Amaka" },
    { id: "C005", name: "David" },
    { id: "C006", name: "Miriam" },
    { id: "C007", name: "Daniel" },
    { id: "C008", name: "Grace" },
    { id: "C009", name: "Samuel" },
    { id: "C010", name: "Joy" },
    { id: "C011", name: "Michael" },
    { id: "C012", name: "Esther" },
    { id: "C013", name: "Emeka" },
    { id: "C014", name: "Sarah" },
    { id: "C015", name: "Peter" },
];

const categories = [
    { id: "CAT001", name: "Running" },
    { id: "CAT002", name: "Fitness" },
    { id: "CAT003", name: "Electronics" },
    { id: "CAT004", name: "Fashion" },
    { id: "CAT005", name: "Accessories" },
    { id: "CAT006", name: "Outdoor" },
    { id: "CAT007", name: "Home & Lifestyle" },
    { id: "CAT008", name: "Footwear" },
];

const brands = [
    { id: "B001", name: "Nike" },
    { id: "B002", name: "Adidas" },
    { id: "B003", name: "Samsung" },
    { id: "B004", name: "Apple" },
    { id: "B005", name: "Puma" },
    { id: "B006", name: "Anker" },
];

const products = [
    {
        id: "P001",
        name: "Air Runner Pro",
        description: "Lightweight running shoes for daily training",
        price: 85000,
        rating: 4.7,
        categoryId: "CAT001",
        brandId: "B001",
    },
    {
        id: "P002",
        name: "Air Max Street",
        description: "Comfortable everyday sneakers",
        price: 78000,
        rating: 4.5,
        categoryId: "CAT008",
        brandId: "B001",
    },
    {
        id: "P003",
        name: "React Trail Shoes",
        description: "Durable shoes for outdoor running",
        price: 92000,
        rating: 4.6,
        categoryId: "CAT006",
        brandId: "B001",
    },
    {
        id: "P004",
        name: "Gym Training Bag",
        description: "Spacious bag for workouts and travel",
        price: 45000,
        rating: 4.4,
        categoryId: "CAT002",
        brandId: "B002",
    },
    {
        id: "P005",
        name: "Adidas Running Socks",
        description: "Breathable performance running socks",
        price: 12000,
        rating: 4.3,
        categoryId: "CAT001",
        brandId: "B002",
    },
    {
        id: "P006",
        name: "Ultraboost Trainer",
        description: "Responsive cushioning for runners",
        price: 110000,
        rating: 4.8,
        categoryId: "CAT001",
        brandId: "B002",
    },
    {
        id: "P007",
        name: "Smart Watch Active",
        description: "Fitness tracking smartwatch",
        price: 135000,
        rating: 4.6,
        categoryId: "CAT003",
        brandId: "B003",
    },
    {
        id: "P008",
        name: "Galaxy Buds Fit",
        description: "Wireless earbuds designed for active users",
        price: 95000,
        rating: 4.5,
        categoryId: "CAT003",
        brandId: "B003",
    },
    {
        id: "P009",
        name: "Galaxy Fit Band",
        description: "Compact fitness activity tracker",
        price: 70000,
        rating: 4.4,
        categoryId: "CAT003",
        brandId: "B003",
    },
    {
        id: "P010",
        name: "iPhone 16",
        description: "Modern smartphone with advanced camera",
        price: 1150000,
        rating: 4.8,
        categoryId: "CAT003",
        brandId: "B004",
    },
    {
        id: "P011",
        name: "AirPods",
        description: "Wireless earbuds with clear sound",
        price: 230000,
        rating: 4.7,
        categoryId: "CAT003",
        brandId: "B004",
    },
    {
        id: "P012",
        name: "Apple Watch SE",
        description: "Smartwatch for fitness and everyday use",
        price: 420000,
        rating: 4.6,
        categoryId: "CAT003",
        brandId: "B004",
    },
    {
        id: "P013",
        name: "Puma Training Tee",
        description: "Lightweight workout t-shirt",
        price: 25000,
        rating: 4.2,
        categoryId: "CAT002",
        brandId: "B005",
    },
    {
        id: "P014",
        name: "Puma Running Shorts",
        description: "Breathable running shorts",
        price: 30000,
        rating: 4.3,
        categoryId: "CAT001",
        brandId: "B005",
    },
    {
        id: "P015",
        name: "Puma Everyday Sneakers",
        description: "Casual sneakers for everyday wear",
        price: 65000,
        rating: 4.4,
        categoryId: "CAT008",
        brandId: "B005",
    },
    {
        id: "P016",
        name: "PowerCore Power Bank",
        description: "Portable high-capacity power bank",
        price: 55000,
        rating: 4.6,
        categoryId: "CAT003",
        brandId: "B006",
    },
    {
        id: "P017",
        name: "Anker Wireless Charger",
        description: "Fast wireless charging pad",
        price: 40000,
        rating: 4.5,
        categoryId: "CAT003",
        brandId: "B006",
    },
    {
        id: "P018",
        name: "Anker Bluetooth Speaker",
        description: "Portable speaker with strong battery life",
        price: 75000,
        rating: 4.6,
        categoryId: "CAT003",
        brandId: "B006",
    },
    {
        id: "P019",
        name: "Insulated Sports Bottle",
        description: "Reusable bottle that keeps drinks cold",
        price: 18000,
        rating: 4.5,
        categoryId: "CAT005",
        brandId: "B002",
    },
    {
        id: "P020",
        name: "Smart Fitness Scale",
        description: "Connected scale for fitness tracking",
        price: 60000,
        rating: 4.3,
        categoryId: "CAT007",
        brandId: "B003",
    },
    {
        id: "P021",
        name: "Resistance Bands Set",
        description: "Set of bands for home workouts",
        price: 22000,
        rating: 4.5,
        categoryId: "CAT002",
        brandId: "B005",
    },
    {
        id: "P022",
        name: "Yoga Mat Pro",
        description: "Non-slip mat for yoga and exercise",
        price: 28000,
        rating: 4.6,
        categoryId: "CAT002",
        brandId: "B002",
    },
    {
        id: "P023",
        name: "Adjustable Dumbbells",
        description: "Compact adjustable weights for home training",
        price: 95000,
        rating: 4.7,
        categoryId: "CAT002",
        brandId: "B005",
    },
    {
        id: "P024",
        name: "Running Waist Bag",
        description: "Compact storage for runners",
        price: 15000,
        rating: 4.2,
        categoryId: "CAT005",
        brandId: "B001",
    },
    {
        id: "P025",
        name: "Performance Cap",
        description: "Lightweight cap for outdoor workouts",
        price: 18000,
        rating: 4.3,
        categoryId: "CAT004",
        brandId: "B001",
    },
    {
        id: "P026",
        name: "Sports Sunglasses",
        description: "Protective sunglasses for outdoor activities",
        price: 35000,
        rating: 4.4,
        categoryId: "CAT005",
        brandId: "B005",
    },
    {
        id: "P027",
        name: "Trail Backpack",
        description: "Durable backpack for hiking and travel",
        price: 70000,
        rating: 4.6,
        categoryId: "CAT006",
        brandId: "B002",
    },
    {
        id: "P028",
        name: "Hiking Jacket",
        description: "Lightweight weather-resistant jacket",
        price: 90000,
        rating: 4.5,
        categoryId: "CAT006",
        brandId: "B005",
    },
    {
        id: "P029",
        name: "Camping Lantern",
        description: "Rechargeable LED camping lantern",
        price: 32000,
        rating: 4.4,
        categoryId: "CAT006",
        brandId: "B006",
    },
    {
        id: "P030",
        name: "Travel Mug",
        description: "Insulated reusable travel mug",
        price: 20000,
        rating: 4.3,
        categoryId: "CAT007",
        brandId: "B002",
    },
    {
        id: "P031",
        name: "Smart Desk Lamp",
        description: "Adjustable LED lamp for home offices",
        price: 50000,
        rating: 4.5,
        categoryId: "CAT007",
        brandId: "B003",
    },
    {
        id: "P032",
        name: "Wireless Keyboard",
        description: "Compact wireless keyboard",
        price: 45000,
        rating: 4.4,
        categoryId: "CAT003",
        brandId: "B006",
    },
    {
        id: "P033",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        price: 30000,
        rating: 4.4,
        categoryId: "CAT003",
        brandId: "B006",
    },
    {
        id: "P034",
        name: "Classic Hoodie",
        description: "Comfortable everyday hoodie",
        price: 40000,
        rating: 4.5,
        categoryId: "CAT004",
        brandId: "B002",
    },
    {
        id: "P035",
        name: "Everyday Joggers",
        description: "Comfortable joggers for casual wear",
        price: 35000,
        rating: 4.4,
        categoryId: "CAT004",
        brandId: "B005",
    },
    {
        id: "P036",
        name: "Crossbody Bag",
        description: "Compact everyday shoulder bag",
        price: 30000,
        rating: 4.3,
        categoryId: "CAT005",
        brandId: "B002",
    },
    {
        id: "P037",
        name: "Portable Projector",
        description: "Compact projector for home entertainment",
        price: 180000,
        rating: 4.5,
        categoryId: "CAT007",
        brandId: "B006",
    },
    {
        id: "P038",
        name: "Noise Cancelling Headphones",
        description: "Over-ear headphones with active noise cancellation",
        price: 160000,
        rating: 4.7,
        categoryId: "CAT003",
        brandId: "B004",
    },
    {
        id: "P039",
        name: "Mini Bluetooth Speaker",
        description: "Compact portable Bluetooth speaker",
        price: 45000,
        rating: 4.3,
        categoryId: "CAT003",
        brandId: "B006",
    },
    {
        id: "P040",
        name: "Fitness Recovery Gun",
        description: "Portable massage device for muscle recovery",
        price: 85000,
        rating: 4.6,
        categoryId: "CAT002",
        brandId: "B005",
    },
];

/*
 * Purchase patterns intentionally overlap.
 * This gives our recommendation traversal meaningful
 * paths between customers and products.
 */
const purchases = [
    // Ada
    ["C001", "P001"],
    ["C001", "P004"],
    ["C001", "P019"],
    ["C001", "P007"],
    ["C001", "P024"],
    ["C001", "P025"],

    // Tunde
    ["C002", "P001"],
    ["C002", "P004"],
    ["C002", "P007"],
    ["C002", "P005"],
    ["C002", "P009"],
    ["C002", "P021"],
    ["C002", "P040"],

    // Chidi
    ["C003", "P001"],
    ["C003", "P019"],
    ["C003", "P005"],
    ["C003", "P006"],
    ["C003", "P024"],
    ["C003", "P026"],

    // Amaka
    ["C004", "P002"],
    ["C004", "P013"],
    ["C004", "P015"],
    ["C004", "P034"],
    ["C004", "P035"],
    ["C004", "P036"],

    // David
    ["C005", "P007"],
    ["C005", "P008"],
    ["C005", "P010"],
    ["C005", "P011"],
    ["C005", "P016"],
    ["C005", "P017"],

    // Miriam
    ["C006", "P007"],
    ["C006", "P008"],
    ["C006", "P009"],
    ["C006", "P016"],
    ["C006", "P018"],
    ["C006", "P020"],

    // Daniel
    ["C007", "P002"],
    ["C007", "P003"],
    ["C007", "P006"],
    ["C007", "P027"],
    ["C007", "P028"],
    ["C007", "P029"],

    // Grace
    ["C008", "P001"],
    ["C008", "P003"],
    ["C008", "P006"],
    ["C008", "P019"],
    ["C008", "P027"],
    ["C008", "P030"],

    // Samuel
    ["C009", "P010"],
    ["C009", "P011"],
    ["C009", "P012"],
    ["C009", "P016"],
    ["C009", "P018"],
    ["C009", "P038"],

    // Joy
    ["C010", "P013"],
    ["C010", "P014"],
    ["C010", "P021"],
    ["C010", "P022"],
    ["C010", "P023"],
    ["C010", "P040"],

    // Michael
    ["C011", "P027"],
    ["C011", "P028"],
    ["C011", "P029"],
    ["C011", "P030"],
    ["C011", "P026"],
    ["C011", "P037"],

    // Esther
    ["C012", "P002"],
    ["C012", "P015"],
    ["C012", "P034"],
    ["C012", "P035"],
    ["C012", "P036"],
    ["C012", "P038"],

    // Emeka
    ["C013", "P007"],
    ["C013", "P010"],
    ["C013", "P012"],
    ["C013", "P016"],
    ["C013", "P017"],
    ["C013", "P032"],

    // Sarah
    ["C014", "P013"],
    ["C014", "P021"],
    ["C014", "P022"],
    ["C014", "P023"],
    ["C014", "P034"],
    ["C014", "P040"],

    // Peter
    ["C015", "P003"],
    ["C015", "P006"],
    ["C015", "P027"],
    ["C015", "P028"],
    ["C015", "P029"],
    ["C015", "P037"],
];

/*
 * Views add browsing behaviour to the graph.
 */
const views = [
    ["C001", "P006"],
    ["C001", "P005"],
    ["C001", "P021"],
    ["C001", "P040"],

    ["C002", "P006"],
    ["C002", "P019"],
    ["C002", "P024"],
    ["C002", "P026"],

    ["C003", "P001"],
    ["C003", "P007"],
    ["C003", "P021"],
    ["C003", "P040"],

    ["C004", "P002"],
    ["C004", "P014"],
    ["C004", "P022"],
    ["C004", "P038"],

    ["C005", "P012"],
    ["C005", "P038"],
    ["C005", "P032"],
    ["C005", "P033"],

    ["C006", "P010"],
    ["C006", "P011"],
    ["C006", "P012"],
    ["C006", "P038"],

    ["C007", "P001"],
    ["C007", "P019"],
    ["C007", "P025"],
    ["C007", "P026"],

    ["C008", "P005"],
    ["C008", "P006"],
    ["C008", "P021"],
    ["C008", "P040"],

    ["C009", "P007"],
    ["C009", "P012"],
    ["C009", "P017"],
    ["C009", "P032"],

    ["C010", "P013"],
    ["C010", "P015"],
    ["C010", "P034"],
    ["C010", "P035"],

    ["C011", "P027"],
    ["C011", "P028"],
    ["C011", "P030"],
    ["C011", "P039"],

    ["C012", "P013"],
    ["C012", "P015"],
    ["C012", "P022"],
    ["C012", "P040"],

    ["C013", "P008"],
    ["C013", "P011"],
    ["C013", "P018"],
    ["C013", "P033"],

    ["C014", "P014"],
    ["C014", "P023"],
    ["C014", "P035"],
    ["C014", "P040"],

    ["C015", "P003"],
    ["C015", "P006"],
    ["C015", "P028"],
    ["C015", "P029"],
];

/*
 * Wishlist behaviour.
 */
const wishlists = [
    ["C001", "P006"],
    ["C001", "P040"],
    ["C001", "P021"],

    ["C002", "P006"],
    ["C002", "P026"],
    ["C002", "P027"],

    ["C003", "P007"],
    ["C003", "P021"],
    ["C003", "P040"],

    ["C004", "P014"],
    ["C004", "P022"],
    ["C004", "P038"],

    ["C005", "P012"],
    ["C005", "P018"],
    ["C005", "P039"],

    ["C006", "P010"],
    ["C006", "P011"],
    ["C006", "P038"],

    ["C007", "P019"],
    ["C007", "P025"],
    ["C007", "P026"],

    ["C008", "P005"],
    ["C008", "P021"],
    ["C008", "P040"],

    ["C009", "P012"],
    ["C009", "P017"],
    ["C009", "P033"],

    ["C010", "P014"],
    ["C010", "P023"],
    ["C010", "P040"],

    ["C011", "P028"],
    ["C011", "P030"],
    ["C011", "P037"],

    ["C012", "P014"],
    ["C012", "P022"],
    ["C012", "P038"],

    ["C013", "P011"],
    ["C013", "P018"],
    ["C013", "P032"],

    ["C014", "P014"],
    ["C014", "P023"],
    ["C014", "P035"],

    ["C015", "P003"],
    ["C015", "P028"],
    ["C015", "P037"],
];

async function seed() {
    const session = driver.session();

    try {
        console.log("Connecting to CognoDB...");
        await driver.verifyConnectivity();
        console.log("Connected successfully.");

        // --------------------------------------------------
        // Constraints
        // --------------------------------------------------

        await session.run(`
      CREATE CONSTRAINT customer_id_unique IF NOT EXISTS
      FOR (c:Customer)
      REQUIRE c.id IS UNIQUE
    `);

        await session.run(`
      CREATE CONSTRAINT product_id_unique IF NOT EXISTS
      FOR (p:Product)
      REQUIRE p.id IS UNIQUE
    `);

        await session.run(`
      CREATE CONSTRAINT category_id_unique IF NOT EXISTS
      FOR (c:Category)
      REQUIRE c.id IS UNIQUE
    `);

        await session.run(`
      CREATE CONSTRAINT brand_id_unique IF NOT EXISTS
      FOR (b:Brand)
      REQUIRE b.id IS UNIQUE
    `);

        console.log("Constraints ready.");

        // --------------------------------------------------
        // Customers
        // --------------------------------------------------

        await session.run(
            `
      UNWIND $customers AS customer
      MERGE (c:Customer {id: customer.id})
      SET c.name = customer.name
      `,
            { customers },
        );

        console.log(`Seeded ${customers.length} customers.`);

        // --------------------------------------------------
        // Categories
        // --------------------------------------------------

        await session.run(
            `
      UNWIND $categories AS category
      MERGE (c:Category {id: category.id})
      SET c.name = category.name
      `,
            { categories },
        );

        console.log(`Seeded ${categories.length} categories.`);

        // --------------------------------------------------
        // Brands
        // --------------------------------------------------

        await session.run(
            `
      UNWIND $brands AS brand
      MERGE (b:Brand {id: brand.id})
      SET b.name = brand.name
      `,
            { brands },
        );

        console.log(`Seeded ${brands.length} brands.`);

        // --------------------------------------------------
        // Products + graph relationships
        // --------------------------------------------------

        await session.run(
            `
      UNWIND $products AS product

      MERGE (p:Product {id: product.id})

      SET
        p.name = product.name,
        p.description = product.description,
        p.price = product.price,
        p.rating = product.rating

      WITH p, product

      MATCH (category:Category {id: product.categoryId})
      MATCH (brand:Brand {id: product.brandId})

      MERGE (p)-[:BELONGS_TO]->(category)
      MERGE (p)-[:MADE_BY]->(brand)
      `,
            { products },
        );

        console.log(`Seeded ${products.length} products.`);

        // --------------------------------------------------
        // Purchases
        // --------------------------------------------------

        const purchaseRows = purchases.map(
            ([customerId, productId], index) => ({
                customerId,
                productId,
                date: `2026-08-${String((index % 20) + 1).padStart(2, "0")}`,
            }),
        );

        await session.run(
            `
      UNWIND $rows AS row

      MATCH (c:Customer {id: row.customerId})
      MATCH (p:Product {id: row.productId})

      MERGE (c)-[r:BOUGHT]->(p)
      ON CREATE SET r.date = row.date
      `,
            { rows: purchaseRows },
        );

        console.log(`Seeded ${purchaseRows.length} purchases.`);

        // --------------------------------------------------
        // Views
        // --------------------------------------------------

        const viewRows = views.map(
            ([customerId, productId], index) => ({
                customerId,
                productId,
                date: `2026-08-${String((index % 25) + 1).padStart(2, "0")}`,
            }),
        );

        await session.run(
            `
      UNWIND $rows AS row

      MATCH (c:Customer {id: row.customerId})
      MATCH (p:Product {id: row.productId})

      MERGE (c)-[r:VIEWED]->(p)
      ON CREATE SET r.date = row.date
      `,
            { rows: viewRows },
        );

        console.log(`Seeded ${viewRows.length} views.`);

        // --------------------------------------------------
        // Wishlists
        // --------------------------------------------------

        const wishlistRows = wishlists.map(
            ([customerId, productId], index) => ({
                customerId,
                productId,
                date: `2026-08-${String((index % 20) + 1).padStart(2, "0")}`,
            }),
        );

        await session.run(
            `
      UNWIND $rows AS row

      MATCH (c:Customer {id: row.customerId})
      MATCH (p:Product {id: row.productId})

      MERGE (c)-[r:WISHLISTED]->(p)
      ON CREATE SET r.date = row.date
      `,
            { rows: wishlistRows },
        );

        console.log(`Seeded ${wishlistRows.length} wishlist items.`);

        // --------------------------------------------------
        // Verify graph
        // --------------------------------------------------

        const nodeResult = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS type, count(n) AS count
      ORDER BY type
    `);

        console.log("\nNode counts:");

        for (const record of nodeResult.records) {
            console.log(
                `${record.get("type")}: ${record.get("count").toNumber()}`,
            );
        }

        const relationshipResult = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS type, count(r) AS count
      ORDER BY type
    `);

        console.log("\nRelationship counts:");

        for (const record of relationshipResult.records) {
            console.log(
                `${record.get("type")}: ${record.get("count").toNumber()}`,
            );
        }

        console.log("\nFull graph seed completed successfully.");
    } catch (error) {
        console.error("\nSeed failed:");
        console.error(error);
        process.exitCode = 1;
    } finally {
        await session.close();
        await driver.close();
    }
}

seed();