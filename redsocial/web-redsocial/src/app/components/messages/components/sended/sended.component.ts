import {Component, OnInit, DoCheck} from '@angular/core';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  providers: []
})
export class SendedComponent implements OnInit, DoCheck {
  public title: String;

  constructor() {
    this.title = 'Mensajes Enviados';
  }

  ngOnInit(): void {

  }
  ngDoCheck(): void {

  }

}
