const mongoose = require("./connect");
var AVATARSCHEMA ={
name  :String,
image: {
    type: String, 

    //required: [true, "la ruta de la imagen es necesaria"]
},
size: {
    type: String,
    //required: [true, "la ruta de la canción es necesaria"]
},
md5: {
    type: String,
    //required: [true, "la ruta de la canción es necesaria"]
},
relativepath: {
    type: String
},
pathfile: {
    type: String,
    required: [true, "la ruta de la canción es necesaria"]
},
hash: {
    type: String,
    required: [true, "la ruta de la canción es necesaria"]
}
};
const AVATAR = mongoose.model("avatars", AVATARSCHEMA);
module.exports = AVATAR;