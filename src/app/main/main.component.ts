import { Component, OnInit } from '@angular/core';
import {ChatService} from "../chat.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  public inputUsuario;
  constructor(private servicioChat: ChatService) {

  }

  public avatar = 0;

  ngOnInit() {

  }



  enviarUsuario(){
    this.servicioChat.sendUsuario({usuario: this.inputUsuario, avatar: this.devuelveImagen()});

  }

  imagenSeleccionada(valor){
    this.avatar = valor;
  }

  devuelveImagen(){
    if(this.avatar == 1){
      return '../../assets/hombre.svg'
    };
    if(this.avatar == 2){
      return '../../assets/mujer.svg'
    };
  };

}
