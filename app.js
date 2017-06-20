var express = require('express');
var app = express();
var path=require("path");
var body=require("body-parser");
var peticion = require('sync-request');
var http = require('http');

var arreglo = [];
app.use(body());
app.use(express.static('public'));
app.set('vista', path.join(__dirname, 'vista'));
app.set('view engine', 'jade');
var async = require("async");

var request = require('sync-request');




app.get("/",function(req,res){
  //  res.sendFile(path.join(__dirname, 'views')+"/index.html");
    res.render('index',{});
});
app.get('/principal', function (req, res) {
  //  res.sendFile(path.join(__dirname, 'views')+"/personajes.html");
  res.render('personajes', { title: 'Hey', message: 'Hello there!'});
});

app.get('/personaje/:nombre',function(req,res){
    var nombre =  req.params.nombre;
    var personaje = null;
   if(arreglo.length == 0){
        var correcto = false;
    console.log(nombre);
     var siguiente = 'http://swapi.co/api/people/?page=1';
    while(true){
        var respuesta = request('GET', siguiente);
        var respuesta = respuesta.body.toString('utf-8');
        var resultado = JSON.parse(respuesta);
        var personajes = resultado.results;
    
    
    siguiente = resultado.next;
       
    
    for(var x=0; x<personajes.length;x++){
        console.log(console.log(personajes[x]["name"]));
        if(personajes[x]["name"]==nombre){
          correcto = true;     
           personaje = personajes[x];
        }
    }        
   if(siguiente == null || siguiente== undefined) break;   

    
}
       
   }else{
       for(var x=0; x<arreglo.length;x++){
           if(arreglo[x]["name"]==nombre){
               correcto = true; 
               personaje = arreglo[x];
               break;
           }           
       }       
   }
    if(correcto){
        var respuesta2 = request('GET', personaje.url);
        var respuesta2 = respuesta2.body.toString('utf-8');
        var resultado2 = JSON.parse(respuesta2);
        
        res.render("personaje",{"objeto":resultado2});
        
    }else{
        res.send("no encontrado");
        
    }
});
app.get('/personajes', function (req, res) {
    
   if(arreglo.length == 0){
        var siguiente = 'http://swapi.co/api/people/?page=1';
    while(true){
        var respuesta = request('GET', siguiente);
    var respuesta = respuesta.body.toString('utf-8');
    var resultado = JSON.parse(respuesta);
    var personajes = resultado.results;
    
    
    siguiente = resultado.next;
    for(var x=0; x<personajes.length;x++){
        arreglo.push(personajes[x]);        
    }        
   if(siguiente == null || siguiente== undefined) break;   
}       
   }
        
   
   var ordenar = req.query.ordenar;      
    switch(ordenar){
        case "nombre":
            arreglo.sort(function(a,b){
                 if (a.name > b.name) {
                    return 1;
                    }
                if (a.name < b.name) {
                        return -1;
                    }
                return 0;            
            });
            break;
        case "peso":
            arreglo.sort(function(a,b){
                 if (a.mass > b.mass) {
                    return 1;
                    }
                if (a.mass < b.mass) {
                        return -1;
                    }
                return 0;            
            });
            break;
        case "altura":
            arreglo.sort(function(a,b){
                 if (a.height > b.height) {
                    return 1;
                    }
                if (a.height < b.height) {
                        return -1;
                    }
                return 0;            
            });
            break;
        default:
            console.log("No existe opcion");
            break;
    }
    res.send(arreglo);
});

var planetas = [];
app.get('/residentes',function(req,res){
        if(planetas.length == 0){
        var siguiente = 'http://swapi.co/api/planets/?page=1';
    while(true){
        var respuesta = request('GET', siguiente);
    var respuesta = respuesta.body.toString('utf-8');
    var resultado = JSON.parse(respuesta);
    var personajes = resultado.results;
    
    
    siguiente = null;
    for(var x=0; x<personajes.length;x++){
        planetas.push(personajes[x]);        
    }        
   if(siguiente == null || siguiente== undefined) break;   
}       
   }
    
    var objetoPlaneta = {};
    for(var x=0;x<planetas.length;x++){
       var planeta = planetas[x];
       var nombrePlaneta = planeta.name;
       var residentes = planeta.residents;
        objetoPlaneta[nombrePlaneta]=[];
       for(var j=0;j<residentes.length;j++){
         var respuesta = request('GET', residentes[j]);
           var respuesta = respuesta.body.toString('utf-8');
           var resultado = JSON.parse(respuesta).name;
            objetoPlaneta[nombrePlaneta].push(resultado);
       }
        
    }
    
    res.send(objetoPlaneta);
});



app.listen(8080,function(){
    console.log("Servidor funcionando en el puerto 8000");    
});
