import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './declarations';
import {MdMenuModule} from '@angular/material';
import { MdDatepickerModule } from '@angular/material';
import { MdNativeDateModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import 'hammerjs';
import { BhiveChartModule } from '@jatahworx/bad-charts';
import { ChartsModule } from 'ng2-charts';
import { HttpModule } from '@angular/http';

/**
*imports for @NgModule
*/
export const appImportModules: any = [
  BrowserModule,
  FormsModule,
  MaterialModule,
  BrowserAnimationsModule,
  FlexLayoutModule,
  RouterModule.forRoot(appRoutes),
  NgxChartsModule,
  BhiveChartModule,
  ChartsModule,
  MdMenuModule,
  HttpModule,
  MdDatepickerModule,
  MdNativeDateModule
];
