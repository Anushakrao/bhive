import { Injectable } from '@angular/core';
import { AlertComponent } from '../alertComponent/alert.component';
// import { MdDialog } from '@angular/material';
import { MdDialog, MdSnackBar } from '@angular/material';


@Injectable()
export class BAppService {

  constructor(private dialog: MdDialog, private snackBar: MdSnackBar) { }

  alert(message, title, data?) {
    console.log(message);
    AlertComponent.message = message;
    AlertComponent.title = title;
    return this.dialog.open(AlertComponent, data);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close', { duration: 3000 });
  }
}