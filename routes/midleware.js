//3. A todo el servicio agregue seguridad basándose en JWT, según lo visto en clases

var JWT=require("jsonwebtoken");
var USER = require("../database/users");

var midleware= async(req, res, next)=>{
    //recuperando del heador el token
    var token =req.header("authorization");
    console.log(token);
    if(token ==null){
        res.status(403).json({error:"no tienes acceso a este lugar token null"});
        return;
    
    }
    try{
    //verificando el token si es valido o no es valido
    var decoded = JWT.verify(token,'lab4secret');
    //console.log(decoded.foo)
    console.log(decoded);
    if(decoded ==null){
        res.status(403).json({error:"no tienes acceso a este lugar ,token falso"});
        return;
    }

    //verificacion de tiempo de sesion
    if(Date.now()/1000 >decoded.exp){
        res.status(403).json({error:"Tiempo de token ya expiro"});
        return;
    }


    //verificando si ese ID existe en la base de datos 
    var iduser=decoded.data;
    console.log(iduser);
    
    var docs =await USER.findOne({_id: iduser});
    
    if(docs == null){
        res.status(403).json({error:"no tienes acceso a este lugar,usuario no existe en la db"})
        return;
    }
    
    //sacando el item del objeto
    var roles = docs.roles.map( item =>{
        return item;
    });
    console.log(roles);
    
    var services =req.originalUrl.substr(1,100);
    if(services.lastIndexOf("?")> -1){
        services =services.substring(0,services.lastIndexOf("?"));
    }
    console.log(services);
    console.log(Object.keys(req));
    console.log(req.method);
    console.log("Pasando por el servicio middleware  " + services);
    var METHOD=req.method;
    var URL=services;
    for(var i=0;i <roles.length;i++){
        if(URL == roles[i].service){
            next();
            return;
        }
    }
   
    res.status(403).json({error:"no tienes acceso a este servicio"});
    return;
    }catch(TokenExpiredError){

    }
    
    res.status(403).json({error:"Tiempo de token ya expiro"});
    return;
}

module.exports=midleware;
