import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserServices } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  providers: [UserServices, PublicationService]
})
export class PublicationsComponent implements OnInit {
  public title: String;
  public tokken;
  public identity;
  public status: String;
  public url: String;
  public page: number;
  public pages;
  public publications: any[];
  public total;
  public itemPerPage;
  public noMore = false;
  @Input() user: String;

  constructor(private _router: Router,
              private _acti_route: ActivatedRoute,
              private _userService: UserServices,
              private _publicationService: PublicationService) {
              this.title = 'Publicaciones';
              this.identity = _userService.getEntity();
              this.tokken = _userService.getTokken();
              this.url = GLOBAL.url;
              console.log('publicaciasd' + this.user);
  }

  ngOnInit(): void {
    this.getPublications(this.user, this.page = 1);
  }

  getPublications(user_id, page, addPagin = false) {
    this._publicationService.getPublicationsUser(this.tokken, page, user_id).subscribe(
      (response) => {
        if (response) {
          this.total = response.total;
          this.pages = response.pages;
          this.itemPerPage = response.itemPerPage;

          if (!addPagin) {
            this.publications = response.publications;
          } else {
            const paginA = this.publications;
            const paginB = response.publications;
            if (this.publications.length !== this.total) {
              this.publications = paginA.concat(paginB);
              console.log(this.publications);
            }

            $('html, body').animate({ scrollTop: $('html').prop('scrollHeight')}, 500);
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


  viewMore() {
    if (this.publications.length === this.total) {
      this.noMore = true;
    } else {
      this.page = this.page +  1;
      this.noMore = false;
    }


    this.getPublications(this.user, this.page, true);
  }

}
