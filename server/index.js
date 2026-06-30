import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

const assetsDir = path.resolve(__dirname, "..", "src", "assets");
if (fs.existsSync(assetsDir)) {
  app.use("/images", express.static(assetsDir));
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected pool error", err);
});

app.get("/api/boats", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM boats ORDER BY id");
    const boats = result.rows.map((row) => ({
      id: row.slug,
      title: row.name,
      city: row.city,
      neighborhood: row.neighborhood,
      image: `${req.protocol}://${req.get("host")}${row.photos?.[0] || "/images/space-1.jpg"}`,
      gallery: (row.photos || []).map((p) => `${_req.protocol}://${_req.get("host")}${p}`),
      pricePerHour: Number(row.price_per_hour),
      pricePerPlayer: Number(row.price_per_player),
      priceUnit: row.price_unit,
      capacityPlayers: row.capacity,
      tables: row.tables,
      levels: row.levels || [],
      amenities: row.amenities || [],
      description: row.description,
      host: row.host,
      rating: Number(row.rating),
      reviews: row.reviews,
      open24h: row.open_24h,
    }));
    res.json(boats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch boats" });
  }
});

app.get("/api/boats/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query("SELECT * FROM boats WHERE slug = $1", [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Boat not found" });
    }
    const row = result.rows[0];
    const boat = {
      id: row.slug,
      title: row.name,
      city: row.city,
      neighborhood: row.neighborhood,
      image: `${req.protocol}://${req.get("host")}${row.photos?.[0] || "/images/space-1.jpg"}`,
      gallery: (row.photos || []).map((p) => `${req.protocol}://${req.get("host")}${p}`),
      pricePerHour: Number(row.price_per_hour),
      pricePerPlayer: Number(row.price_per_player),
      priceUnit: row.price_unit,
      capacityPlayers: row.capacity,
      tables: row.tables,
      levels: row.levels || [],
      amenities: row.amenities || [],
      description: row.description,
      host: row.host,
      rating: Number(row.rating),
      reviews: row.reviews,
      open24h: row.open_24h,
    };
    res.json(boat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch boat" });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
