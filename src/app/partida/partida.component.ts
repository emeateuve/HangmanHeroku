import {AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import {ChatService} from "../chat.service";
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
@Component({
  selector: 'app-partida',
  templateUrl: './partida.component.html',
  styleUrls: ['./partida.component.css']
})
export class PartidaComponent implements OnInit, OnDestroy {

  public empiezaPartida;
  public turnoCambiado;
  public returnLobby;
  public ganadorPartida;
  public recibeLetraCorrecta;

  public nuevaFrase;
  public nuevaPista;
  public splitteada;
  public enviada;
  public abecedario;
  public usuariosPartida = [];
  public valorTurno = 0;

  public usuario: any;

  public puntuacion = 15;
  public partida = false;
  messages: string[] = [];



  constructor(private chatService: ChatService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.partida = true;

    this.chatService.empezarPartida();

    this.empiezaPartida = this.chatService.empiezaPartida().subscribe((data) => {
      this.usuario = data.usuario;
      this.usuariosPartida = data.jugadoresEnPartida;
      this.nuevaFrase = data.fraseCompleta;
      this.nuevaPista = data.pista;
      this.splitteada = data.splitteada;
      this.enviada = data.enviada;
      this.abecedario = data.botones;

    })

    this.turnoCambiado = this.chatService.turnoCambiado().subscribe((data) => {
      this.usuariosPartida = this.chatService.array;
      this.usuario.turno = true;
    })

    this.returnLobby = this.chatService.returnLobby().subscribe((data) =>{
      this.router.navigate(['lobby']);
    });

    this.ganadorPartida = this.chatService.ganadorPartida().subscribe((data) =>{
    });

    this.recibeLetraCorrecta = this.chatService.recibeLetraCorrecta().subscribe((data) => {
      this.enviada = data;
    })

  }
  adivinaLetra(letra){
    this.chatService.enviar_letra(letra);
  }


  cambiaTurno(lista){
    this.chatService.cambiaTurnoSv(lista)
  }

  ngOnDestroy(){
    this.empiezaPartida.unsubscribe()
    this.recibeLetraCorrecta.unsubscribe()
    this.ganadorPartida.unsubscribe()
    this.returnLobby.unsubscribe()
    this.turnoCambiado.unsubscribe()
  }
}
