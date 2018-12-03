import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserServices } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { FollowService } from '../../services/follow.service';
import { Follow } from '../../models/follow';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  providers: [UserServices, FollowService]
})
export class FollowedComponent implements OnInit {
  public title: String;
  public identity: any;
  public tokken: any;
  public url: String;
  public next_page;
  public prev_page;
  public page;
  public status: String;
  public total;
  public pages;
  public users: User[];
  public follows;
  public followed;
  public following_aux;
  public userId;
  public user: User;

  constructor(
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _userService: UserServices,
    private _followService: FollowService
  ) {
    this.url = GLOBAL.url;
    this.identity = _userService.getEntity();
    this.title = 'Segudires de';
    this.tokken = _userService.getTokken();

  }
  ngOnInit(): void {
    this.getActualPage();
  }

  getActualPage() {
    this._activateRoute.params.subscribe(params => {
      const user_id = params['id'];
      this.userId = user_id;
      let page = +params['page'];
      if (!params['page']) {
        page = 1;
      }
      if (!page) {
        page = 1;
        this.page = 1;
      } else {
        this.page = page;
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }

      this.getUser(user_id, this.page);

    });
  }

  getFollows(user_id, page) {
    this._followService.getFollowed(this.tokken, user_id, page).subscribe(
      (response: any) => {
       if (!response) {
          this.status = 'error';
        } else {
          console.log(response);
          this.total = response.total;
          this.pages = response.pages;
          this.followed = response.follows;
          this.follows = response.followeUser.followers_arr;
          if (page > this.pages) {
            this._router.navigate(['/seguidores', user_id, 1]);
          }
          this.status = 'success';
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage != null) {
          this.status = 'error';
          console.log(errorMessage);
        }
      }
    );
  }

  mouseEnter(userID) {
    this.following_aux = userID;
  }

  mouseLeave(userID) {
    this.following_aux = 0;
  }

  followUsers(followed) {
    const follow = new Follow('', this.identity._id, followed);
    this._followService.addFollow(this.tokken, follow).subscribe(
      (response) => {
          if (!response.follow) {
             this.status = 'error';
          } else {
            this.follows.following_arr.push(response.follow.followed);
            this.getCounter();
          }
      },

      (err) => {
        const errorMessage = <any>err;
        if (errorMessage != null) {
          this.status = 'error';
          console.log(err);
        }
      }
    );
  }


  unFollowUser(followed) {
    this._followService.deleteFollow(this.tokken, followed).subscribe(
      (respose) => {
        const follow = this.follows.following_arr.indexOf(followed);
        if ( follow !== -1) {
          this.follows.following_arr.splice(follow, 1);
          this.getCounter();
        }
      },
      (err) => {
        const errorMessage = <any>err;
        if (errorMessage != null) {
          this.status = 'error';
          console.log(err);
        }
      }
    );
  }

  getCounter() {
    this._userService.getCounter().subscribe(
      (response) => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
      },
      (error) => {
        console.log(<any> error);
      }
    );
  }

  getUser(user_id, page) {
    this._userService.getUser(user_id).subscribe(
      (response) => {
        this.user = response.user;
        this.getFollows(user_id, this.page);
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
}



