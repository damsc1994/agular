import { Component, OnInit, DoCheck } from '@angular/core';
import { UserServices } from '../../services/user.service';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   providers: [ UserServices ]
})
export class HomeComponent implements OnInit, DoCheck {
  public entity;
  public title: String;

  constructor(private userService: UserServices) {
    this.title = 'Bienvenido a NGSocial';
  }

  ngOnInit(): void {
    this.entity = this.userService.getEntity();
  }

  ngDoCheck(): void {
    this.entity = this.userService.getEntity();
  }

}
