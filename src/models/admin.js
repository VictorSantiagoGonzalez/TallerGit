const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt"); 
const adminSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    }
});
adminSchema.methods.encryptClave = async (clave) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(clave, salt);
}
module.exports = mongoose.model('Admin', adminSchema);
