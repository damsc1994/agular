import {Component, OnInit, DoCheck} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  providers: []
})
export class MainComponent implements OnInit, DoCheck {
  public title: String;

  constructor() {
    this.title = 'Mensajes privados';
  }

  ngOnInit(): void {

  }
  ngDoCheck(): void {

  }

}
