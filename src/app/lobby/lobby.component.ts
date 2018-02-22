import {Component, OnInit} from '@angular/core';
import {ChatService} from "../chat.service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private servicioChat: ChatService) {
  }

  public usuario: any;
  public numeroSala: string;
  public jsonLobby;

  ngOnInit() {


    this.servicioChat.usuarioConectado().subscribe((data) => {
      this.usuario = data.usuario
      this.jsonLobby = data;
    })

    this.servicioChat.usuarioDesconectado().subscribe((data) => {
      this.usuario = data.usuario
    })
  }



  darUsuario() {
    alert('Bienvenido ' + this.usuario);
  }


  enviameAlChat(usuario){
    this.servicioChat.enviarChat(usuario);
  }

  enviameAlJuego(usuario) {
    this.servicioChat.enviarJuego(usuario);
  }

}
