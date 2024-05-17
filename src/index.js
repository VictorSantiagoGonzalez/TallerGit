const parser = require("body-parser");
const express = require('express');
const app = express();
const port = 3000;
const articuloRoutes = require("./routes/articulo");
const authRoutes = require("./routes/authentication")
const capituloRoutes = require("./routes/capitulo");
const ejemploRoutes = require("./routes/ejemplo");
const sugerenciaRoutes = require("./routes/sugerencia");
const mongoose = require("mongoose");
require('dotenv').config();
app.use(parser.urlencoded({ extended: false })); //permite leer los datos que vienen en la petición
app.use(parser.json()); // transforma los datos a formato JSON
//Gestión de las rutas usando el middleware
app.use("/api", articuloRoutes);
app.use("/api", capituloRoutes);
app.use("/api", authRoutes);
app.use("/api", ejemploRoutes);
app.use("/api", sugerenciaRoutes);
app.use(express.json());
//Conexión a la base de datos
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log(error));
//Conexión al puerto
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
