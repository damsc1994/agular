import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';


@Injectable()
export class UserServices {
 public url: string;
 public tokken;
 public identity;
 public stats;

 constructor(public _httpClient: HttpClient) {
   this.url = GLOBAL.url;
 }


 register(user: User): Observable<any> {
  const params = JSON.stringify(user);
  const headers = new HttpHeaders().set('Content-Type', 'application/json');

  return this._httpClient.post(this.url + 'register', params, {headers: headers});
 }

 login(user, gettoken = null): Observable<any> {
   if (gettoken != null) {
     user.gettoken = gettoken;
   }
   const params = JSON.stringify(user);
   const headers = new HttpHeaders().set('Content-Type', 'application/json');

   return this._httpClient.post(this.url + 'login', params, {headers: headers});
 }

 getEntity() {
   const identity = JSON.parse(localStorage.getItem('identity'));
   if (identity !== 'undefined') {
      this.identity = identity;
   } else {
     this.identity = null;
   }

   return this.identity;
 }

 getTokken() {
   const tokken = localStorage.getItem('tokken');

   if (tokken !== 'undefined') {
     this.tokken = tokken;
   } else {
     this.tokken = null;
   }

   return this.tokken;
  }

  getStats() {
    const stats = JSON.parse(localStorage.getItem('stats'));
    if (stats != null) {
      this.stats = stats;
    } else {
      this.stats = null;
    }

    return this.stats;
  }

  getCounter(userID = null): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', this.getTokken());
    if (userID != null) {
      return this._httpClient.get(this.url + 'count-user/' + userID, {headers: headers});
    } else {
      return this._httpClient.get(this.url + 'count-user', {headers: headers});
    }
  }

  counters() {
    this.getCounter().subscribe(
      (response) => {
        localStorage.setItem('stats', JSON.stringify(response));
      },
      (error) => {
        console.log(<any> error);
      }
    );
  }


  updateUSer(user: User): Observable<any> {
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', this.getTokken());

     return this._httpClient.put(this.url + 'update-user/' + user._id, params, {headers: headers});
  }

  getUsers(page = null): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json')
                                     .set('authorization', this.getTokken());
    return this._httpClient.get(this.url + 'users/' + page, {headers});
  }

  getUser(userID): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json')
                                     .set('authorization', this.getTokken());
    return this._httpClient.get(this.url + 'user/' + userID, {headers});
  }



}
