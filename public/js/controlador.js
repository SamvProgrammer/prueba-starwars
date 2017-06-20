angular.module("iniciar.controlador",[])
.controller("ctrl_personaje",function($scope, $http,$location){
    var peso = $location.$$absUrl.includes("peso");
    var nombre = $location.$$absUrl.includes("nombre");
    var altura = $location.$$absUrl.includes("altura");
    $scope.cargando = "Cargando espere porfavor....";
    var cadena = "";
    if(peso){
        cadena = "?ordenar=peso";
    }else if(altura){
        cadena = "?ordenar=altura";        
    }else if(nombre){
        cadena = "?ordenar=nombre";        
    }
    var url = 'http://localhost:8080/personajes'+cadena;
    var cantidad = 0;
    var personajes = [];
    $http.get(url)
    .then(function(response) {
        if(response.status == 200 && response.statusText == "OK"){
            console.log(response.data);
            personajes = response.data;
            $scope.cantidad = personajes.length;
            $scope.personajes = personajes;   
            console.log(response.data.results);
            $scope.cargando = "";
        }else{
            console.log("Petición incorrecta");            
        }      
    })
    $scope.submit = function(){
        window.location.href = "http://localhost:8080/personaje/"+$scope.texto;
    };
});