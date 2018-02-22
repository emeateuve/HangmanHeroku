import {Component, OnInit, OnDestroy} from '@angular/core';
import {ChatService} from "../chat.service";

@Component({
  selector: 'app-chatglobal',
  templateUrl: './chatglobal.component.html',
  styleUrls: ['./chatglobal.component.css']
})
export class ChatglobalComponent implements OnInit, OnDestroy {

  public usuarioConectadoChat;
  public usuarioDesconectadoChat;
  public getMessages;


  message: string;
  messages: string[] = [];
  usuariosChat = [];
  jsonChat;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    console.log('Conectado al Chat.')
    this.usuarioConectadoChat = this.chatService.usuarioConectadoChat().subscribe((data) => {
      this.usuariosChat = data.array;
      this.messages.push(data.msg)
    });
    this.usuarioDesconectadoChat = this.chatService.usuarioDesconectadoChat().subscribe((data) => {
      this.messages.push(data.msg);
      this.usuariosChat = data.array
    });
    this.getMessages = this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });


    // this.chatService.usuarioEnJuego()
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnDestroy(){
    this.usuarioDesconectadoChat.unsubscribe()
    this.usuarioConectadoChat.unsubscribe()
    this.getMessages.unsubscribe()

  }

}
