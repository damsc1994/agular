import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Publication } from '../models/publication';
import { GLOBAL } from './global';


@Injectable()
export class PublicationService {
  public url: String;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addPublication(tokken, publication): Observable<any> {
    const params = JSON.stringify(publication);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', tokken);
    return this._http.post(this.url + '/save-publication', params, {headers: headers});
  }

  getPublications(tokken, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', tokken);
    return this._http.get(this.url + '/publications/' + page, {headers: headers});
  }


  getPublicationsUser(tokken, page = 1, user_id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', tokken);
    return this._http.get(this.url + '/publications-user/' + user_id + '/' + page, {headers: headers});
  }

  deletePublication(tokken, id): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json')
                                     .set('authorization', tokken);
    return this._http.delete(this.url + 'publication-delete/' + id, {headers});
  }
}
