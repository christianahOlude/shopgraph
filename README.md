This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# shopgraph

ShopGraph is a graph-based product recommendation application built with **Next.js, TypeScript, Neo4j Driver, Cypher, and CognoDB**.

The application takes a **customer ID** as input and generates product recommendations based on the purchasing behaviour of customers with similar purchase history.

---

## Use Case

ShopGraph is designed to recommend products to a customer based on relationships in their purchase history.

The recommendation process starts with a `customerId`.

For example:

```text
C001
```

The application then:

1. Finds products purchased by the customer.
2. Finds other customers who purchased some of the same products.
3. Treats those customers as similar customers.
4. Finds products purchased by those similar customers.
5. Excludes products the original customer has already purchased.
6. Calculates a recommendation score based on the number of similar customers who purchased each product.
7. Uses product rating as a secondary ranking factor.
8. Returns up to 10 recommendations.

The recommendations are displayed as product cards in the frontend.

---

# Why a Graph Database?

ShopGraph uses a graph database because the recommendation logic depends on relationships between **customers and products**.

The core recommendation traversal is:

```text
Customer
   │
   │ BOUGHT
   ▼
Shared Product
   ▲
   │ BOUGHT
   │
Similar Customer
   │
   │ BOUGHT
   ▼
Recommended Product
```

The recommendation query follows these connected relationships directly:

```cypher
(customer)-[:BOUGHT]->(shared)<-[:BOUGHT]-(similar)-[:BOUGHT]->(recommended)
```

This makes a graph database a natural fit for the use case because the application needs to traverse relationships across multiple connected entities.

The project uses **CognoDB** through the Neo4j-compatible `neo4j-driver`.

---

# Data Model

ShopGraph contains the following node types:

### Customer

```text
Customer
- id
- name
```

### Product

```text
Product
- id
- name
- description
- price
- rating
```

### Category

```text
Category
- id
- name
```

### Brand

```text
Brand
- id
- name
```

## Relationships

The graph contains the following relationships:

```text
(Customer)-[:BOUGHT]->(Product)

(Customer)-[:VIEWED]->(Product)

(Customer)-[:WISHLISTED]->(Product)

(Product)-[:BELONGS_TO]->(Category)

(Product)-[:MADE_BY]->(Brand)
```

### Data Model Diagram

```text
                         ┌──────────────┐
                         │   Customer   │
                         │              │
                         │ id           │
                         │ name         │
                         └──────┬───────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
           BOUGHT             VIEWED           WISHLISTED
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Product    │
                         │              │
                         │ id           │
                         │ name         │
                         │ description  │
                         │ price        │
                         │ rating       │
                         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                BELONGS_TO                MADE_BY
                    │                       │
                    ▼                       ▼
              ┌────────────┐          ┌──────────┐
              │  Category  │          │  Brand   │
              │            │          │          │
              │ id         │          │ id       │
              │ name       │          │ name     │
              └────────────┘          └──────────┘
```

> **Note:** The current recommendation logic uses the `BOUGHT` relationship. `VIEWED` and `WISHLISTED` relationships are included in the seeded graph but are not currently used to calculate recommendations.

---

# Recommendation Query

The main recommendation query is located in:

```text
app/api/recommendations/route.ts
```

The same recommendation logic is also used by:

```text
scripts/test-recommendations.ts
```

The query first identifies products already purchased by the customer.

```cypher
MATCH (customer:Customer {id: $customerId})
      -[:BOUGHT]->(product:Product)

RETURN collect(product.id) AS purchasedIds
```

These product IDs are then used to prevent the application from recommending products the customer has already purchased.

The main recommendation traversal is:

```cypher
MATCH (customer:Customer {id: $customerId})
      -[:BOUGHT]->(shared:Product)
      <-[:BOUGHT]-(similar:Customer)
      -[:BOUGHT]->(recommended:Product)

WHERE similar.id <> $customerId
  AND NOT recommended.id IN $purchasedIds
```

This finds:

* The selected customer
* Products they purchased
* Other customers who purchased those products
* Products purchased by those other customers

Products already purchased by the selected customer are excluded.

The recommendations are then scored:

```cypher
WITH recommended, count(DISTINCT similar) AS score
```

A higher score means that more similar customers purchased that product.

The results are returned using:

```cypher
ORDER BY score DESC, recommended.rating DESC
LIMIT 10
```

Therefore, recommendations are ordered first by recommendation score and then by product rating.

---

# Similar Customer Query

The project also contains a separate script:

```text
scripts/similar-customers.ts
```

It finds customers who have purchased the same products as the provided customer.

```cypher
MATCH (customer:Customer {id: $customerId})
      -[:BOUGHT]->(product:Product)
      <-[:BOUGHT]-(similar:Customer)

WHERE similar.id <> $customerId

WITH similar, count(DISTINCT product) AS sharedProducts

RETURN
  similar.id AS id,
  similar.name AS name,
  sharedProducts

ORDER BY sharedProducts DESC

LIMIT 10
```

The number of shared products is used to determine how closely customers' purchase histories overlap.

---

# Database Seeding

The graph is populated using:

```text
scripts/seed.ts
```

The seed script creates:

* Customers
* Categories
* Brands
* Products
* Purchase relationships
* View relationships
* Wishlist relationships

It also creates uniqueness constraints for:

```text
Customer.id
Product.id
Category.id
Brand.id
```

The seed script verifies the graph after insertion by displaying node and relationship counts.

---

# CognoDB Setup

## Creating a CognoDB Instance

1. Sign in to CognoDB.
2. Create a new database/graph instance.
3. Wait for the instance to become available.
4. Open the connection details for the instance.
5. Copy the Bolt connection URI.
6. Copy the provided username and password.
7. Add those values to the project's `.env.local` file.

The project connects to CognoDB using the Neo4j driver.

---

# Environment Variables

Create a `.env.local` file in the project root:

```env
COGNODB_URI=your_cognodb_uri
COGNODB_USERNAME=your_cognodb_username
COGNODB_PASSWORD=your_cognodb_password
```

The application reads the database credentials from environment variables.

The credentials should **not** be committed to GitHub.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/christianahOlude/shopgraph
cd shopgraph
```

Install dependencies:

```bash
npm install
```

Configure the CognoDB environment variables in `.env.local`.

---

# Seed the Database

Run the project's seed script:

```bash
npm run seed
```

This creates the graph data and relationships required by the application.

---

# Run the Application

Start the development server:

```bash
npm run dev
```

The application runs at:

```text
http://localhost:3000
```

The recommendation interface is available at:

```text
http://localhost:3000/recommendations
```

---

# API Endpoints

## Health Check

```text
GET /api/health
```

This endpoint verifies connectivity to CognoDB.

A successful response is:

```json
{
  "success": true,
  "message": "Connected to CognoDB successfully"
}
```

If the connection fails, the endpoint returns an error response.

---

## Recommendations

```text
GET /api/recommendations?customerId=C001
```

The endpoint requires a `customerId`.

Example:

```bash
curl "http://localhost:3000/api/recommendations?customerId=C001"
```

The response contains:

* Customer ID
* Recommended products
* Product ID
* Product name
* Description
* Price
* Rating
* Recommendation score

---

# Frontend

The recommendation interface is located at:

```text
app/recommendations/page.tsx
```

The user enters a customer ID.

Example:

```text
┌─────────────────────────────────────────┐
│ Enter customer ID e.g. C001             │
└─────────────────────────────────────────┘

        [ Get Recommendations ]
```

The frontend sends the customer ID to:

```text
/api/recommendations?customerId=C001
```

The returned products are displayed using the `ProductCard` component.

```text
app/components/ProductCard.tsx
```

## UI States

The recommendation page currently handles:

### Loading

Displays a message while recommendations are being fetched.

### Error

Displays an error message when the recommendation request fails.

### Empty Results

Displays a message when no recommendations are returned.

### Results

Displays the returned recommendations in a responsive product grid.

---

# UI Screenshots

## Recommendation Page

Add a screenshot of the recommendation interface here:

```text
![ShopGraph Recommendation Page](./screenshots/recommendations.png)
```

## Recommendation Results

Add a screenshot showing the returned product recommendations here:

```text
![ShopGraph Recommendation Results](./screenshots/results.png)
```

---

# Project Structure

```text
shopgraph/
│
├── app/
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts
│   │   └── recommendations/
│   │       └── route.ts
│   │
│   ├── components/
│   │   └── ProductCard.tsx
│   │
│   ├── recommendations/
│   │   └── page.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── neo4j.ts
│
├── scripts/
│   ├── seed.ts
│   ├── similar-customers.ts
│   └── test-recommendations.ts
│
├── .env.local
├── .gitignore
├── package.json
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

# Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Neo4j Driver**
* **CognoDB**
* **Cypher**
* **Node.js**

---

# Future Improvements

The current recommendation engine is based on customer purchase relationships.

Possible future improvements include using the existing `VIEWED` and `WISHLISTED` relationships as additional signals when generating recommendations.

Other possible improvements include:

* Weighted recommendation scoring
* Category-based recommendations
* Brand-based recommendations
* Recommendation explanations
* Product search
* Customer purchase history

---

# Author

**Christianah Olude**

Software Engineer | Frontend Developer

Built as **Wexa AI Graph Database Application**.
