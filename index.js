const express = require("express");
const fs = require("fs");
const app = express();
const { exec } = require("child_process");
const cors = require("cors");
const path = require("path");

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173", // Reemplaza esto con la URL de tu aplicación frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/compile", (req, res) => {
  const jsonData = req.body;
  const codigoAppJS = jsonData.out
    .map((fragmento) => `console.log("${fragmento}");`)
    .join("\n");

  const rutaAppJS = path.join("app.js");

  fs.writeFile(rutaAppJS, codigoAppJS, (error) => {
    if (error) {
      console.error(`Error al crear app.js: ${error}`);
      return res.status(500).json({ error: "Error al crear app.js" });
    }

    let comando;
    if (jsonData.platform === "windows") {
      comando = `pkg -t node16-win ${rutaAppJS}`;
    } else if (jsonData.platform === "linux") {
      comando = `pkg -t node16-linux-x64 ${rutaAppJS}`;
    } else if (jsonData.platform === "macos") {
      comando = `pkg -t node16-macos-x64 ${rutaAppJS}`;
    } else {
      return res.status(400).json({ error: "Plataforma no soportada" });
    }

    exec(comando, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error de compilación: ${error}`);
        return res.status(500).json({ error: "Error de compilación" });
      }
      console.log("Compilación exitosa:", stdout);

      // Ajusta el nombre del archivo según tu necesidad
      const nombreArchivoDescarga =
        jsonData.platform === "windows" ? "app.exe" : "app";
      const rutaArchivoDescarga = path.join(__dirname, nombreArchivoDescarga);

      res.download(rutaArchivoDescarga);
    });
  });
});

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
  console.log(`Servidor en ejecución en el puerto ${puerto}`);
});
