import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserServices } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  providers: [UserServices, PublicationService]
})
export class TimelineComponent implements OnInit {
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
  public showImage;

  constructor(private _router: Router,
              private _acti_route: ActivatedRoute,
              private _userService: UserServices,
              private _publicationService: PublicationService) {
              this.title = 'Timeline';
              this.identity = _userService.getEntity();
              this.tokken = _userService.getTokken();
              this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.getPublications(this.page = 1);
  }

  getPublications(page, addPagin = false) {
    this._publicationService.getPublications(this.tokken, page).subscribe(
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


    this.getPublications(this.page, true);
  }

  refresh(event) {
    this.getPublications(1);
  }

  getShowImage(id) {
    this.showImage = id;
  }

  getHideImage() {
    this.showImage = 0;
  }

  deletePublocation(id) {
    this._publicationService.deletePublication(this.tokken, id).subscribe(
      (response) => {
        this.refresh(null);
      },
      (error) => {
        console.log(<any>error);
      }
    );

  }

}
