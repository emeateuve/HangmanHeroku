// import {usuario} from "../src/app/chat.service";

let express = require('express');
let app = express();
const publicPath = path.join(__dirname, './public');
let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

var abecedario = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
  'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
  't', 'u', 'v', 'w', 'x', 'y', 'z'];

var arrayFrases = [
  {frase: 'A ver si me muero ya', pista: 'Lo que digo todos los días.'},
  {frase: 'Hay que explorar lo inexplorado', pista: 'Frase de UP'},
  {frase: 'A quien madruga Dios le ayuda', pista: 'Al levantarse'},
  {frase: 'Dos no se pelean si uno no quiere', pista: 'Paz y amor'},
  {frase: 'Soy edicion limitada', pista: 'Buena autoestima'},
  {frase: 'Ellas se lo gastan en ropa y ellos en tetas', pista: 'Presupuesto'},
  {frase: 'Puede ser mi gran noche', pista: '¿Qué pasará, qué misterio habrá?'}
];

var frase = [];
var fraseSplit = [];
var fraseAEnviar = [];
var resultado = [];
var letrasDichas = [];
var usuariosPartida = [];
var valorTurno = 0;

const port = process.env.PORT || 3000;

var arrayUsuarios = [];
var usuariosChat = [];
var usuariosWaiting = [];
var usuariosListos = [];
var numeroListos = 0;


io.on('connection', (socket) => {

  socket.on('confirmarUsuario', (usuario) => {
    existeUsuario = arrayUsuarios.indexOf(usuario.usuario);
    if (existeUsuario >= 0) {
    } else {
      socket.jsonUsuario = {
        usuario: usuario.usuario,
        avatar: usuario.avatar,
        msg: false,
        array: arrayUsuarios,
        turno: false,
        listo: false,
        puntos: 10,
        ganador: false
      };

      arrayUsuarios.push(socket.jsonUsuario.usuario);
      socket.emit('usuarioConectado', socket.jsonUsuario);

      /****************************************CHAT GLOBAL************************************************/
      socket.on('conectameAlChat', function (data) {
        usuariosChat.push(data.usuario);
        socket.jsonUsuario.array = usuariosChat;
        socket.jsonUsuario.msg = 'Se ha conectado: ' + socket.jsonUsuario.usuario + ' al chat.';
        io.emit('usuarioConectadoChat', socket.jsonUsuario);

        socket.on('disconnect', function () {
          let posChat = usuariosChat.indexOf(socket.jsonUsuario.usuario)
          usuariosChat.splice(posChat, 1);
          socket.jsonUsuario.array = usuariosChat;
          socket.jsonUsuario.msg = 'Se ha desconectado ' + socket.jsonUsuario.usuario + ' del chat.';
          io.emit('desconexionChat', socket.jsonUsuario)
        });
      })

      socket.on('new-message', (message) => {
        io.emit('new-message', socket.jsonUsuario.usuario + ': ' + message);
      });
      console.log('ArrayUsuarios ', arrayUsuarios);

      /******************************************WAITING***************************************************/

      socket.on('conectameAlWaiting', function (data) {
        usuariosWaiting.push(data.usuario);
        socket.jsonUsuario.array = usuariosWaiting;
        socket.jsonUsuario.msg = 'Se ha conectado ' + socket.jsonUsuario.usuario + ' al waiting.';

        io.emit('conexionWaiting', socket.jsonUsuario);

        socket.on('disconnect', function () {
          let posWaiting = usuariosWaiting.indexOf(socket.jsonUsuario.usuario)
          usuariosWaiting.splice(posWaiting, 1);
          let posListos = usuariosListos.indexOf(socket.jsonUsuario);
          usuariosListos.splice(posListos, 1);
          socket.jsonUsuario.listo = false;
          socket.jsonUsuario.array = usuariosWaiting;
          socket.jsonUsuario.msg = 'Se ha desconectado ' + socket.jsonUsuario.usuario + ' del waiting.';
          io.emit('desconexionWaiting', socket.jsonUsuario)
        });

        socket.on('usuarioEstaListo', function (data) {
          if (socket.jsonUsuario.listo == false) {
            numeroListos++;
          }
          socket.jsonUsuario.listo = true;
          usuariosListos.push(socket.jsonUsuario);

          if (numeroListos == usuariosWaiting.length) {
            io.emit('empiezaPartida');
          }
          ;
        });

        socket.on('nuevaPartida', function () {
          fraseAEnviar = [];

          socket.jsonUsuario.turno = false
          usuariosPartida.push(socket.jsonUsuario);
          frase.push(arrayFrases[Math.floor(Math.random() * arrayFrases.length)])
          fraseSplit = frase[0].frase.split(' ');
          for (let i = 0; i < fraseSplit.length; i++) {
            for (let o = 0; o < fraseSplit[i].length; o++) {
              fraseAEnviar.push({letra: fraseSplit[i][o].toLowerCase(), estado: false})
            }
          }

          usuariosPartida[usuariosPartida.length - 1].turno = true;


          socket.emit('empiezaPartida', {
            usuario: socket.jsonUsuario,
            jugadoresEnPartida: usuariosPartida,
            fraseCompleta: frase[0].frase,
            pista: frase[0].pista,
            splitteada: fraseSplit,
            enviada: fraseAEnviar,
            botones: abecedario
          });


          socket.on('letraNueva', function (letraNueva) {
            letrasDichas.push(letraNueva);
            for (let i = 0; i < fraseAEnviar.length; i++) {
              if (letraNueva == fraseAEnviar[i].letra) {
                fraseAEnviar[i].estado = true;
                resultado.push(fraseAEnviar[i].letra)
                socket.jsonUsuario.puntos++;
                io.emit('letraAcertada', fraseAEnviar);
              } else {
                io.emit('letraErronea', {
                  letra: letraNueva, puntos: socket.jsonUsuario.puntos--
                }, socket.jsonUsuario.turno = false)
              }
            }
            if (resultado.length == fraseAEnviar.length) {
              io.emit('ganador', {jugador: socket.jsonUsuario.usuario, puntos: socket.jsonUsuario.puntos})
            }
            if (resultado.length == frase.length) {
              io.emit('Ganador', {
                usuario: socket.jsonUsuario.usuario,
                resultado: resultado
              })
              io.emit('returnLobby')
            }
          })
          socket.on('cambiameElTurno', function (data) {
            data[0].turno = false;
            let primerValor = data.shift();
            data[0].turno = true;
            data.push(primerValor);
            io.emit('turnoCambiado', data)
          });
        })

      });
    }

    socket.on('disconnect', function () {
      let pos = arrayUsuarios.indexOf(socket.jsonUsuario.usuario);
      arrayUsuarios.splice(pos, 1);
      io.emit('desconexion', {
        msg: 'Se ha desconectado: ' + socket.jsonUsuario.usuario, array: arrayUsuarios
      })
    })
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
