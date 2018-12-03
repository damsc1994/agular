import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { GLOBAL } from './global';
import { Message } from '../models/message';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessaegService {
  private url: String;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addMessage(tokken, message): Observable<any> {
    const params = JSON.stringify(message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', tokken);

    return  this._http.post(this.url + 'save-message', params, {headers});
  }

  getMessageReceiver(tokken, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', tokken);

    return this._http.get(this.url + 'messages-receiver/' + page, {headers});
  }

  getMessageEmmiter(tokken, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('authorization', tokken);

    return this._http.get(this.url + 'messages-emitter/' + page, {headers});
  }
}
