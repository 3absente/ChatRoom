var express = require('express');
var http = require('http');
var socket = require('socket.io');

var app= express();
var server = http.createServer(app);
var usuarios=[];

server.listen(3000, function(){
	console.log("Servidor corriendo en el puerto: 3000");
})

var io = socket.listen(server);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/cliente.html');
})

io.on('connection', function(socket)){
	socket.on('nuevo usuario', function(usuario,callback){
		if(usuarios.indexOf(usuario) != -1){
			callback(false);
		}else{
			callback(true);
			socket.usuario = usuario;
			usuarios.push(usuario);
			actualizarUsuarios();
		}
	})

	socket.on('nuevo mensaje', function(mensaje){
		io.emit('mensaje', {mensaje: mensaje, usuario: socket.usuario});
	})

	function actualizarUsuarios(){
		io.emit('actualizarUsuarios', usuarios);
	}
})

