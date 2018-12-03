import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Follow } from '../models/follow';
import { GLOBAL } from './global';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FollowService {
  public url: String;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addFollow(tokken, follow): Observable<any> {
    const params = JSON.stringify(follow);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', tokken);

    return this._http.post(this.url + 'save-follow', params, {headers: headers});
  }

  deleteFollow(tokken, id): Observable<any> {
     const headers = new HttpHeaders().set('Content-type', 'application/json')
                                      .set('authorization', tokken);
     return this._http.delete(this.url + 'delete-follow/' + id, {headers: headers});
  }

  getFollowing(tokken, user_id = null, page = 1): Observable<any> {
     const headers = new HttpHeaders().set('Content-type', 'applocation/json')
                                      .set('authorization', tokken);

    return this._http.get(this.url + 'following/' + user_id + '/' + page, {headers});
  }

  getFollowed(tokken, user_id = null, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'applocation/json')
                                     .set('authorization', tokken);

   return this._http.get(this.url + 'followed/' + user_id + '/' + page, {headers});
 }

 getMyFollow(tokken): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json')
                                     .set('authorization', tokken);
    return this._http.get(this.url + 'myfollows/' + 'true', {headers});
 }
}
