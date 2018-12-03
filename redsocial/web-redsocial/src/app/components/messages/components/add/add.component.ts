import {Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../../../../models/message';
import { MessaegService } from '../../../../services/message.service';
import { Follow } from '../../../../models/follow';
import { FollowService } from '../../../../services/follow.service';
import { User } from '../../../../models/user';
import { UserServices } from '../../../../services/user.service';
import { GLOBAL } from '../../../../services/global';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  providers: [ MessaegService, FollowService, UserServices]
})
export class AddComponent implements OnInit, DoCheck {
  public title: String;
  public identity;
  public tokken;
  public url: String;
  public status;
  public message: Message;
  public follows;

  constructor(private _router: Router,
              private _act_router: ActivatedRoute,
              private _userService: UserServices,
              private _messageService: MessaegService,
              private _followSErvice: FollowService) {
    this.title = 'Enviar mensajes';
    this.identity = _userService.getEntity();
    this.tokken = _userService.getTokken();
    this.message = new Message('', '', this.identity._id, '', '');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.getMyFollow(this.tokken);
  }
  ngDoCheck(): void {

  }

  getMyFollow(tokken) {
    this._followSErvice.getMyFollow(tokken).subscribe(
      (response) => {
        this.follows = response.follows;
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  onSubmit(form) {
      console.log(this.message);
      this._messageService.addMessage(this.tokken, this.message).subscribe(
        (response) => {
          this.status = 'success';
          form.reset();
        },
        (error) => {
          this.status = 'error';
          console.log(<any>error);
        }
      );
  }

}
