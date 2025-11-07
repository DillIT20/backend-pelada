import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as jogadoresRouter } from "./routes/jogadores.js"; 
import { router as turmasRouter } from "./routes/turmas.js";
import { router as partidasRouter } from "./routes/partidas.js";
import { router as participacoesRouter } from "./routes/participacoes.js";
import { router as artilhariaRouter } from "./routes/artilharia.js";
import { router as excecoesRouter } from "./routes/excecoes.js";
import uploadRouter from "./routes/upload.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:8080",         
  "https://dillit.io",             
  "https://www.dillit.io",
  "https://dillit.io/peladafc",   
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem "origin" (como de cURL ou Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 Origem bloqueada pelo CORS: ${origin}`);
      callback(new Error("Não permitido pelo CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

/* ✅ Rotas */
app.use("/api", jogadoresRouter); 
app.use("/api/turmas", turmasRouter);
app.use("/api/excecoes-partidas", excecoesRouter);
app.use("/api/partidas", partidasRouter);
app.use("/api/participacoes", participacoesRouter);
app.use("/api/artilharia", artilhariaRouter);
app.use(dashboardRoutes);
app.use(uploadRouter); 

app.get("/", (req, res) => res.send("Servidor rodando!"));

/* ✅ Porta configurável */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
