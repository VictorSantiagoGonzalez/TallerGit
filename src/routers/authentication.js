const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioSchema = require("../models/usuario");
router.post("/registro", async (req, res) => {
    const { correo, clave, numero } = req.body;
    const usuario = new usuarioSchema({
        
        correo: correo,
        clave: clave,
        numero: numero

    });
    usuario.clave = await usuario.encryptClave(usuario.clave);
    await usuario.save(); 
    
    const token = jwt.sign({ id: usuario._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24,
    });
    
    res.json({
        auth: true,
        token,
    });
});

router.post("/login", async (req, res) => {

    const { error } = usuarioSchema.validate(req.body.correo, req.body.clave);
    if (error) return res.status(400).json({ error: error.details[0].message });
    //Buscando el usuario por su dirección de correo
    const usuario = await usuarioSchema.findOne({ correo: req.body.correo });
    //validando si no se encuentra
    if (!usuario) return res.status(400).json({ error: "Usuario no encontrado, por favor verifique sus datos" });
    //Transformando la contraseña a su valor original para 
    //compararla con la clave que se ingresa en el inicio de sesión
    const validPassword = await bcrypt.compare(req.body.clave, usuario.clave);
    if (!validPassword)
        return res.status(400).json({ error: "Constraseña Incorrecta" });
    res.json({
        
        data: "Bienvenid@ a SkillShake Connect",
    });
});
module.exports = router;

