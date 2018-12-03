import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserServices } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  providers: [ UserServices ]
})
export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;

  constructor(private userService: UserServices) {
    this.title = 'Registrate';
    this.user = new User(
      '',
      '',
      '',
      '',
      '',
      '',
      'ROLE_USER',
      '');
  }

  ngOnInit(): void {

  }

  onSubmit(form) {
     this.userService.register(this.user).subscribe(
       (response) => {
         if (response.user && response.user._id) {
           this.status = 'success';
           form.reset();
         } else {
           this.status = 'error';
         }
       },

       (err) => {
         console.log(err);
       }

       );
  }



}
