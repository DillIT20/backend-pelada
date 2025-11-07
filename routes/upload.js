import express from "express";
import multer from "multer";
import fs from "fs";
import cloudinary from "../cloudinary.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "peladafc/jogadores",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Erro ao excluir arquivo temporário:", err);
    });

    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Erro no upload:", err);
    res.status(500).json({ error: "Erro ao fazer upload da imagem." });
  }
});

export default router;
