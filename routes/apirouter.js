///////////////////////////////////SEMINARIO DE SISTEMAS/////////////////////////////////////
////NOMBRE : Katerin Mayra Parra Alvarez
////CI :     8522693
var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var USER=require("../database/users");
var valid=require("./utils/valid");

var JWT=require("jsonwebtoken");

var midleware = require("./midleware");
router.get("/user" ,midleware,(req, res) => {
    
    var params = req.query;
    //console.log(params);

    var limit = 100;
    if (params.limit != null) {
    limit = parseInt(params.limit);
    }
    var order = -1;
    if (params.order != null) {
    if (params.order == "desc") {
    order = -1;
    } else if (params.order == "asc") {
    order = 1;
    }
    }
    var skip = 2;
    if (params.skip != null) {
    skip = parseInt(params.skip);
    }
    USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
    res.status(200).json(docs);
    
    });

});
/////////////////////////////////////////////////////////DESAFIO./////////////////////////////////////////////////
//Cree validación de datos para el servicio POST de inserción, con el siguiente formato. en un archivo utils/valid.js
router.post('/user', async(req, res) => {
    var params = req.body;
    console.log(req.body);
    params["registerdate"] = new Date();

//checkPassword tendrá que verificar si el password contiene números y caracteres. que sea mínimamente de 6 caracteres y que siempre comience con una letra mayúscula
   
    if(!valid.checkPassword(params.password)){
    res.status(300).json({msn:"EL password necesita debe comenzar con una letra mayuscula . Necesita almenos un numero una letra minuscula ,un caracter especial y minimamente de 6 caracteres"});
    return;
    }
    
    if(!valid.checkEmail(params.email)){
        res.status(300).json({msn:"Correo invalido"});
        return;
        }
 //checkParams tendrá que verificar si los parámetros del esquema son válidos

    if(!valid.checkParams(params)){
        res.status(300).json({msn:"EL nombre solo debe contener letra, la direccion debe escribirse de manera correcta ejem Colombia # 15 y del sex debe ingresar su genero ejm :mujer o hombre(solo insertar parametros validos)"});
        return;
    }

    // params.password = sha1(params.password);
    //params.email = sha1(params.email);
    var users = new USER(params);
    var result = await users.save();
    res.status(200).json(result);

    /*
    Ejemplo de post
           
                 "password": Ca&ggguuuuC%1,
                 "sex": femenino,
                 "name": kato,
                 "address": Colombia#15,
                "email": eje11mplo@gmail.com,
   

    */
});

router.patch("/user",midleware, (req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
        msn: "Error no existe id"
    });
        return;
    }
    var id = req.query.id;
    var params = req.body;
    USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
    res.status(200).json(docs);
    });
});

router.delete("/user",midleware, async(req, res) => {
        if (req.query.id == null) {
        res.status(300).json({
        msn: "Error no existe id"
        });
        return;
}
var r = await USER.remove({_id: req.query.id});
res.status(300).json(r);
});
////////////////////////////////////////////////////////////////

router.post("/login", async(req, res) => {
    var body = req.body;
    //console.log(body);
    if (body.email == null) {
        res.status(300).json({msn: "El email es necesario"});
             return;
    }
    if (body.password == null) {
        res.status(300).json({msn: "El password es necesario"});
        return;
    }
    var  datos1=USER.name;
    var results = await USER.find({email: body.email, password: (body.password)});
    //console.log(datos1)
    console.log(results.id);
    if (results.length == 1) {
//////////////token//////////////
        var token = JWT.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 2),
            data: results[0].id
          }, 'lab4secret');
//////////////////7
        res.status(200).json({msn: "Bienvenido " + body.email + " al sistema",token: token });
        return;
    }
    res.status(200).json({msn: "Credenciales incorrectas"});
});





/*
router.post("/login", async(req, res) => {
    var body = req.body;
    //console.log(body);
    if (body.email == null) {
        res.status(300).json({msn: "El email es necesario"});
             return;
    }
    if (body.password == null) {
        res.status(300).json({msn: "El password es necesario"});
        return;
    }
    var  datos1=USER.name;
    var results = await USER.find({email: body.email, password: (body.password)});
    //console.log(datos1)
    if (results.length == 1) {
        res.status(200).json({msn: "Bienvenido " + body.email + " al sistema"});
        return;
    }
    res.status(200).json({msn: "Credenciales incorrectas"});
}); 

*/
module.exports = router;


