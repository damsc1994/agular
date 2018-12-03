import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserServices } from '../../services/user.service';
import { UploadServices } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-edit-user',
  templateUrl: './user-edit.component.html',
  providers: [ UserServices, UploadServices ]
})
export class UserEditComponent implements OnInit {
  public title: String;
  public user: User;
  public identity;
  public tokken;
  public status: any;
  public error_mesage: String;
  public filedArray: Array<File>;
  public url: String;

  constructor(private _router: Router,
              private _act_rputer: ActivatedRoute,
              private userService: UserServices,
              private _uploadService: UploadServices) {
              this.title = 'Actualizar mis datos';
              this.user = this.userService.getEntity();
              this.identity = this.user;
              this.tokken = this.userService.getTokken();
              this.url = GLOBAL.url;

  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.userService.updateUSer(this.user).subscribe(
      (response) => {
        if (!response) {
          this.status = 'error';
        } else {
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;



          /*SUBIDA IMAGEN DE USUARIO*/
          if (this.filedArray) {
              this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id,
                                                [], this.filedArray, this.tokken, 'image').then((result: any) => {
                                                  this.user.image = result.user.image;
                                                  localStorage.setItem('identity', JSON.stringify(this.user));
                                                });
          }
        }
      },
      (err) => {
        const error = <any> err;
        this.status = 'error';
        this.error_mesage = error.error.message;
      }
    );
  }


  fileChangedEvent(fileInput: any) {
    this.filedArray = <Array<File>> fileInput.target.files;

  }

}
