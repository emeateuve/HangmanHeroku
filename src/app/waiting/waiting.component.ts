import { Component, OnInit, OnDestroy } from '@angular/core';
import {ChatService} from "../chat.service";
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit, OnDestroy {

  constructor(private chatService: ChatService, private route: ActivatedRoute, private router: Router) { }

  public usuarioConectadoWaiting;
  public usuarioDesconectadoWaiting;
  public empiezaPartida;
  public getMessages;




  public usuariosConectados = [];
  messages: string[] = [];
  jugador: any;
  public partidaLista;
  public jsonJugador;

  ngOnInit() {
    this.partidaLista = false;
    this.usuarioConectadoWaiting = this.chatService.usuarioConectadoWaiting().subscribe((data) => {
      this.usuariosConectados = data.array;
      this.jugador = data.usuario;
      this.messages.push(data.msg)
      this.jsonJugador = data
    });
    this.usuarioDesconectadoWaiting = this.chatService.usuarioDesconectadoWaiting().subscribe((data) => {
      this.messages.push(data.msg);
      this.usuariosConectados = (data.array)
    });

    this.getMessages = this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.empiezaPartida = this.chatService.empiezaPartida().subscribe((data) =>{
      this.router.navigate(['partida']);
    });
  }

  empezarPartida(){
    if(this.usuariosConectados.length >= 2){
      this.partidaLista = true;
    }
  }

  estoyListo(usuario){
    this.chatService.usuarioListo(usuario);
  }

  ngOnDestroy(){
    this.usuarioConectadoWaiting.unsubscribe();
    this.usuarioDesconectadoWaiting.unsubscribe();
    this.empiezaPartida.unsubscribe()
    this.getMessages.unsubscribe()
  }

}
