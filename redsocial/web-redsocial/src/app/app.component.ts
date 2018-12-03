import { Component, OnInit, DoCheck } from '@angular/core';
import { UserServices } from './services/user.service';
import { User } from './models/user';
import { Router, ActivatedRoute} from '@angular/router';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ UserServices ]
})
export class AppComponent implements OnInit, DoCheck {
  public title: string;
  public entity;
  public url: String;

  constructor(private userServices: UserServices, private _route: Router,
    private _activateRoute: ActivatedRoute) {
    this.title = 'NGSOCIAL';
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    this.entity = this.userServices.getEntity();

  }

  ngDoCheck() {
    this.entity = this.userServices.getEntity();
  }

  logout() {
    localStorage.clear();
    this.entity = null;
    this._route.navigate(['/']);
  }

}
