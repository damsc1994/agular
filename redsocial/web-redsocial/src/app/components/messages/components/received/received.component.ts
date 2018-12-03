import {Component, OnInit, DoCheck} from '@angular/core';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  providers: []
})
export class ReceivedComponent implements OnInit, DoCheck {
  public title: String;

  constructor() {
    this.title = 'Mensajes recibidos';
  }


  ngOnInit(): void {

  }
  ngDoCheck(): void {

  }

}
