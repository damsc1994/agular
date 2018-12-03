import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { resolve } from 'q';


@Injectable()
export class UploadServices {
  private url: String;

  constructor() {
    this.url = GLOBAL.url;
  }

  makeFileRequest(url: string, params: Array<String>, file: Array<File>, tokken: string, name: String) {
    return new Promise(function(resolver, reject) {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (let i = 0 ; i < file.length ; i++ ) {
         formData.append(name, file[i], file[i].name);
      }

      xhr.onreadystatechange = function() {
         if (xhr.readyState === 4) {
           if (xhr.status === 200) {
             resolver(JSON.parse(xhr.response));
           } else {
             reject(xhr.response);
           }
         }
      };

      xhr.open('PUT', url, true);
      xhr.setRequestHeader('authorization', tokken);
      xhr.send(formData);
    });
  }
}
