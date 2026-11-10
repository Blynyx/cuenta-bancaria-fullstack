import "dotenv/config";
import cors from "cors";
import express from "express";
import { conectarDB } from "./config/db.js";
import cuentaRoutes from "./routes/cuentaRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ estado: "ok", mensaje: "API de cuenta bancaria disponible" });
});

app.use("/api/cuenta", cuentaRoutes);

app.use((_req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

app.use((error, _req, res, _next) => {
  if (error?.type === "entity.parse.failed" || (error instanceof SyntaxError && error?.status === 400)) {
    return res.status(400).json({ mensaje: "El cuerpo JSON de la solicitud no es válido." });
  }

  console.error("Error no controlado:", error);
  return res.status(500).json({ mensaje: "Error interno del servidor." });
});

async function iniciarServidor() {
  try {
    await conectarDB();
    app.listen(PORT, () => {
      console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
