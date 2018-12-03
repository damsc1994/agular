import { Component, OnInit, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { UserServices } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UploadServices } from '../../services/upload.service';


@Component({
  selector: 'app-sindebar',
  templateUrl: './sindebar.component.html',
  providers: [ UserServices, PublicationService, UploadServices ]
})
export class SindebarComponent implements OnInit, DoCheck {

  public url: String;
  public identity;
  public tokken;
  public stats;
  public status;
  public publication: Publication;
  public filesToUpload: Array<File>;

  @Output() sended = new EventEmitter();

  constructor(private _userService: UserServices,
              private _publicationService: PublicationService,
              private _router: Router,
              private _act_rputer: ActivatedRoute,
              private _uploadService: UploadServices) {
    this.identity = _userService.getEntity();
    this.tokken = _userService.getTokken();
    this.stats = _userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', '', this.identity._id);
  }

  ngOnInit(): void {
    this.stats = this._userService.getStats();
  }

  ngDoCheck(): void {
    this.stats = this._userService.getStats();
  }

  onSubmit(form, event) {
    this._publicationService.addPublication(this.tokken, this.publication).subscribe(
      (response) => {
        if (response.publication) {
          const publication = response.publication;
          if ( this.filesToUpload) {
            this._uploadService.makeFileRequest(this.url + 'upload-image/' + publication._id, [],
              this.filesToUpload, this.tokken, 'file').then(
                (result: any) => {
                    this.publication.file = result.image;
                    const publicaciones = this.stats.publications + 1;
                    this.stats.publications = publicaciones;
                    localStorage.setItem('stats', JSON.stringify(this.stats));
                    form.reset();
                    this._router.navigate(['/timeline']);
                    /*this._userService.counters()*/
                    this.status = 'success';
                    this.sended.emit({send: 'true'});


                }
            );
          } else {
            const publicaciones = this.stats.publications + 1;
            this.stats.publications = publicaciones;
            localStorage.setItem('stats', JSON.stringify(this.stats));
            form.reset();
            this._router.navigate(['/timeline']);
            /*this._userService.counters()*/
            this.status = 'success';
            this.sended.emit({send: 'true'});

          }



        } else {
          this.status = 'error';
        }
      },
      (err) => {
        const error = <any> err;
        if (error != null) {
          console.log(error);
          this.status = 'error';
        }
      }
    );
  }

  sendPublication(event) {
    this.sended.emit({send: 'true'});
  }

  filechangeEvent(file: any) {
    this.filesToUpload = <Array<File>> file.target.files;
  }

}

