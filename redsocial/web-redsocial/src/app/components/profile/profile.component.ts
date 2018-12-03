import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserServices } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [ UserServices, FollowService ]
})
export class ProfileComponent implements OnInit {
  public title: String;
  public identity;
  public tokken;
  public user: User;
  public follower;
  public following;
  public url;
  public stats;
  public status: String;
  public followUserOver;

  constructor(private _router: Router,
              private _act_router: ActivatedRoute,
              private _userServices: UserServices,
              private _followService: FollowService) {
     this.title = 'Perfil';
     this.identity = this._userServices.getEntity();
     this.tokken = this._userServices.getTokken();
     this.url = GLOBAL.url;
     this.user = new User('', '', '', '', '', '', '', '');
     this.follower = false;
     this.following = false;

  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage() {
    this._act_router.params.subscribe((params) => {
      const id = params['id'];
      this.getUser(id);
      this.getCounter(id);
    });
  }

  getUser(id) {
    this._userServices.getUser(id).subscribe(
      (response) => {
        if (response.user) {
          this.user = response.user;
          console.log(this.user);
          this.status = 'success';
          if (response.value.followers != null) {
            this.follower = true;
          }

          if (response.value.following != null) {
            this.following = true;
          }
        } else {
          this.status = 'error';
        }
      },
      (err) => {
        console.log(<any>err);
        // this._router.navigate(['/perfil', this.identity._id]);
      }
    );
  }

  getCounter(id) {
    this._userServices.getCounter(id).subscribe(
      (response) => {
        this.stats = response;
      },
      (err) => {
        console.log(<any>err);
      }
    );
  }

  followUSer(followed) {
    const follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.tokken, follow).subscribe(
      (response) => {
        this.following = true;
      },
      (err) => {
        console.log(<any>err);
      }
    );

  }

  onFollowUser(follow) {
    this._followService.deleteFollow(this.tokken, follow).subscribe(
      (response) => {
        this.following = false;
      },
      (err) => {
        console.log(<any>err);
      }
    );
  }

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave() {
    this.followUserOver = 0;
  }
}
