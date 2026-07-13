import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for predicting jenis anggaran
  app.post("/api/predict-anggaran", async (req, res) => {
    try {
      const { uraian } = req.body;
      if (!uraian) {
        return res.status(400).json({ error: "Uraian is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Anda adalah asisten klasifikasi anggaran.
Berdasarkan "Uraian Kas Keluar", tentukan kategori jenis anggarannya.
Pilih HANYA SATU dari kategori berikut:
- Belanja Pegawai
- Belanja Barang & Jasa
- Belanja Modal
- Daya & Jasa

Uraian Kas Keluar: "${uraian}"

Hanya kembalikan nama kategorinya (misalnya "Belanja Pegawai"). Jangan tambahkan teks lain.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const prediction = response.text?.trim() || "";
      const validCategories = ["Belanja Pegawai", "Belanja Barang & Jasa", "Belanja Modal", "Daya & Jasa"];
      
      let finalCategory = "Belanja Barang & Jasa"; // fallback
      for (const cat of validCategories) {
        if (prediction.toLowerCase().includes(cat.toLowerCase())) {
          finalCategory = cat;
          break;
        }
      }

      res.json({ jenisAnggaran: finalCategory });
    } catch (error) {
      console.error("AI prediction error:", error);
      res.status(500).json({ error: "Failed to predict" });
    }
  });

  app.post("/api/generate-notulen", async (req, res) => {
    try {
      const { maksud, tujuan, namaPegawai } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Buatkan draf notulen (laporan hasil perjalanan dinas) singkat dan formal berdasarkan data berikut:\n- Pegawai yang ditugaskan: ${namaPegawai || "-"}\n- Tempat Tujuan: ${tujuan || "-"}\n- Maksud Perjalanan Dinas: ${maksud || "-"}\n\nFormat notulen:\n1. Waktu dan Tempat Pelaksanaan\n2. Agenda Utama\n3. Hasil Kegiatan\n4. Kesimpulan/Tindak Lanjut\n\nGunakan bahasa Indonesia formal. Jangan menggunakan markdown tebal, langsung teks biasa, tidak ada asteris.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ notulen: response.text?.trim() || "" });
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({ error: "Failed to generate notulen" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
