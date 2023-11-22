const { exec } = require("child_process");

// Ruta al archivo JavaScript que deseas compilar
const archivoJS = "app.js";

// Comando para compilar con pkg
const comando = `pkg -t node16-win ${archivoJS}`;

exec(comando, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error de compilación: ${error}`);
    return;
  }
  console.log("Compilación exitosa:", stdout);
});
