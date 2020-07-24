/////////////////////////////////////Desafío ///////////////////////////////

//Usando la librería express-upload, cree un servicio de nombre updateavatar​ , que pueda subir una imagen al servidor, actualice el
//esquema para almacenar la ruta de la imagen tanto física como ruta relativa, además al momento de subir la imagen se deberá actualizar los
//atributos necesarios que contemplan la ruta física y la ruta relativa.

var express = require('express');
//var metadata = require("file-metadata");
var sha1 = require("sha1");
var router = express.Router();
var fileUpload = require("express-fileupload")
var AVATAR = require("../database/updateavatar");
var mongoose = require("mongoose");

var midleware = require("./midleware");
router.use(fileUpload({
    fileSize: 50 * 1024 * 1024
}));
router.post("/sendfile",midleware, (req, res) => {
    var avat=req.files.file;
    var path = __dirname.replace(/routes/gi, "avat");
    ///routes/gi
    console.log(path);
    var date=new Date();
    var sing= sha1(date.toString()).substr(1, 5);
    var totalpath = path + "/" + sing + "_" + avat.name.replace(/\s/g,"_");
    avat.mv(totalpath, async(err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
        var meta = await (avat);
        console.log(meta);
        var obj = {};
      
            obj["name"] = avat.name;
            obj["image"]=totalpath;
            obj["size"] = avat.size;
            obj["md5"] = avat.md5;
            obj["pathfile"] = totalpath;
            obj["hash"] = sha1(totalpath);
            obj["relativepath"] = "/v1.0/api/getfile/?id=" + obj["hash"];
            
        var updateavatar = new AVATAR(obj);
        updateavatar.save((err, docs) => {
            if (err) {
                res.status(500).json({msn: "ERROR "})
                return;
            }
            res.status(200).json({name: avat.name});
        });
    });
});

router.get("/getfile",midleware, async(req, res, next) => {
    var params = req.query;

    if (params == null) {
        res.status(300).json({
            msn: "Error es necesario un ID"
        });
        return;
    }
    var id=params.id;
    var avatss =  await AVATAR.find({hash:id});

    if (avatss.length > 0) {
        var path = avatss[0].pathfile;
        res.sendFile(path);
        return;
    }

    res.status(300).json({
        msn: "Error en la petición"
    });

    return;
});

router.get("/listavat",midleware, async(req, res) => {
    var filterdata=req.query;
    var filterarray=["name","size"];
    var name=filterdata["name"];
    var size=filterdata["size"];
    var filter={};
    if(name !=null){
        filter["name"] =new RegExp(name,"g");
    }
    if(size!=null){
        filter["size"] =new RegExp(size,"g");
    }
    var limit =100;
    var skip=0;
    if(filterdata["limit"]){
        limit=parseInt(filterdata["limit"]);
    }
    if(filterdata["skip"]){
        skip=parseInt(filterdata["skip"]);
    }
    var docs=await AVATAR.find(filter).limit(limit).skip(skip);
    res.status(200).json(docs);
});

//Cree un servicio que permita mostrar la imagen en función de su id, usando para ello la función del objeto response sendFile.

router.get("/listarIMG",async(req,res)=>{
    var params = req.query;

    if (params == null) {
        res.status(300).json({
            msn: "Error es necesario un ID"
        });
        return;
    }
    var id=params.id;
    var avatss =  await AVATAR.find({_id:id});

    if (avatss.length > 0) {
        var path = avatss[0].pathfile;
        res.sendFile(path);
        return;
    }

    res.status(300).json({
        msn: "Error en la petición"
    });

    return;

});

module.exports = router;




/*
var express = require('express');
//var metadata = require("file-metadata");
var sha1 = require("sha1");
var router = express.Router();
var fileUpload = require("express-fileupload")
var AVATAR = require("../database/updateavatar");
var mongoose = require("mongoose");
router.use(fileUpload({
    fileSize: 50 * 1024 * 1024
}));
router.post("/sendfile", (req, res) => {
    console.log(req.files);
    
    var avat=req.files.file;
    console.log(avat.name);
    var path=__dirname.replace(/\/routes/g, "/avat");
    var date=new Date();
    var sing= sha1(date.toString()).substr(1,5);
     avat.mv(path + "/" + sing + "_" +avat.name.replace(/\s/g,"_"),(err)=>{
        if(err){
            return res.status(300).send({msn:"Error al escribir el archivo en el disco"});
        }

        //const{name}=req.file;
        //revisar metadatos

        res.status(200).json({name: avat.name});
    });
    
    
});
module.exports = router;

*/