const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminSchema = require("../models/admin");
router.post("/signup", async (req, res) => {
    const { usuario, correo, clave } = req.body;
    const admin = new adminSchema({
        usuario: usuario,
        correo: correo,
        clave: clave,
    });
    admin.clave = await admin.encryptClave(admin.clave);
    await admin.save(); 
    const token = jwt.sign({ id: admin._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24, 
    });
    res.json({
        auth: true,
        token,
    });
});

router.post("/login", async (req, res) => {

    const { error } = adminSchema.validate(req.body.correo, req.body.clave);
    if (error) return res.status(400).json({ error: error.details[0].message });
    //Buscando el usuario por su dirección de correo
    const admin = await adminSchema.findOne({ correo: req.body.correo });
    //validando si no se encuentra
    if (!admin) return res.status(400).json({ error: "Usuario no encontrado, por favor verifique sus datos" });
    //Transformando la contraseña a su valor original para 
    //compararla con la clave que se ingresa en el inicio de sesión
    const validPassword = await bcrypt.compare(req.body.clave, admin.clave);
    if (!validPassword)
        return res.status(400).json({ error: "Constraseña Incorrecta" });
    res.json({
        
        data: "Bienvenid@ a KonRules",
    });
});
module.exports = router;

