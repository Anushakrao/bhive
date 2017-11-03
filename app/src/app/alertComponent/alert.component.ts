import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert.template.html',
  styleUrls: ['./alert.style.css']
})

export class AlertComponent {
  static title = '';
  static message = '';
  messageContent;
  titleContent;
  constructor(public dialogRef?: MdDialogRef<AlertComponent>) {
    this.messageContent = AlertComponent.message;
    this.titleContent = AlertComponent.title;
  }

}
