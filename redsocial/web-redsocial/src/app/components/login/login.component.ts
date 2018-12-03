import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { UserServices } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [ UserServices ]
})
export class LoginComponent implements OnInit {

  public title: string;
  public user: User;
  public status: string;
  public message: string;
  public identity: User;
  public tokken: string;

  constructor(public _router: Router, public _actRoute: ActivatedRoute, public userServices: UserServices) {
    this.title = 'Identificate';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');

  }

  ngOnInit(): void {
  }


  onSubmit(form) {
    this.userServices.login(this.user).subscribe(
      (response) => {
          this.identity = response.user;
          if (!this.identity._id || !this.identity) {
            this.status = 'error';
          } else {
            this.getTokken();
            localStorage.setItem('identity', JSON.stringify(this.identity));

          }

      },
      (error) => {
        const errorMessage = <any> error;

        if (errorMessage != null) {
          this.status = 'error';
          this.message = errorMessage.error.message;
        }
      }
    );
  }

  getTokken() {
    this.userServices.login(this.user, true).subscribe(
      (response) => {
        this.tokken = response.tokken;
        localStorage.setItem('tokken', this.tokken);
        this.getCounter();
      },
      (error) => {
        const errorMessage = <any> error;

        if (errorMessage != null) {
          this.status = 'error';
          this.message = errorMessage.error.message;
        }
      }
    );
  }


  getCounter() {
    this.userServices.getCounter().subscribe(
      (response) => {
        localStorage.setItem('stats', JSON.stringify(response));
        this._router.navigate(['/']);
        this.status = 'success';
      },
      (error) => {
        console.log(<any> error);
      }
    );
  }




}
