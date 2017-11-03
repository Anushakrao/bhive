import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BAppService } from './bApp.service';

@Injectable()
export class BHTTPLoader {
  constructor(private bAppService: BAppService) {
  }
  private _isHTTPRequestInProgress = new Subject<boolean>();
  _isHTTPRequestInProgress$ = this._isHTTPRequestInProgress.asObservable();

  isHTTPRequestInProgress(bool) {
    this._isHTTPRequestInProgress.next(bool);
  }

  alertError(error) {
    if (error.message) {
      this.bAppService.openSnackBar('Error ' + error.message)
    } else if (error.status < 200 || error.status > 500) {
      if (error.status == 0) {
        this.bAppService.openSnackBar('Connectivity issue');
      } else {
        this.bAppService.openSnackBar('Response failure');
      }
    } else {
      if (error.hasOwnProperty('_body') && error._body) {
        // if(typeof error._body == 'string' && JSON.parse(error._body).hasOwnProperty('message')) {
          if(error.status == 403) {
            this.bAppService.openSnackBar(JSON.parse(error._body)['message'])
        } else {
           this.bAppService.openSnackBar(error._body,); 
        }
      } else {
        this.bAppService.openSnackBar('Response failure');
      }
    }

  }
}