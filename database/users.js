///////////////////////////////////SEMINARIO DE SISTEMAS/////////////////////////////////////
////NOMBRE : Katerin Mayra Parra Alvarez
////CI :     8522693

const mongoose = require("./connect");
var USERSCHEMA ={
name  :String,
email :String,
password :String,
registerdate :Date,
sex :String,
address :String,
roles: {
    type: Array,
    default: []
}
};
const USERS = mongoose.model("users", USERSCHEMA);
module.exports = USERS;