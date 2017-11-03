import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { appDeclarations, appBootstrap, appProviders, appEntryComponents } from './config/declarations';
import { appImportModules } from './config/import-modules';

@NgModule({
  declarations: [...appDeclarations],
  imports: [...appImportModules],
  providers: [...appProviders],
  entryComponents: [...appEntryComponents],
  bootstrap: [...appBootstrap]
})
export class AppModule { }
