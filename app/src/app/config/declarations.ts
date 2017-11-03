import { PageNotFoundComponent } from '../not-found.component';
import { LayoutComponent } from '../layout/layout.component';
import { TestComponent } from '../test/test.component';
import { NotificationService } from '../service/notification.service';
import { LocalStorageService } from '../service/local-storage.service';
import { ImgSrcDirective } from '../directives/imgSrc.directive';
import { BAuthGuard } from '../service/bAuthGuard.service';
import { BAppService } from '../service/bApp.service';
import { BLocalStorageService } from '../service/bLocalStorage.service';
import { BSessionStorage } from '../service/bSessionStorage.service';
import { BLoginService } from '../service/bLogin.service';
import { HttpModule, Http, XHRBackend, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { BHttp } from '../service/bHTTP';
import { BHTTPLoader } from '../service/bHTTPLoader';
import { PubSubService } from '../service/pubSub.service';
import { AlertComponent } from '../alertComponent/alert.component'; 
import { BDataSourceService } from '../service/bDataSource.service';

//CORE_REFERENCE_IMPORTS



export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, bHTTPLoader: BHTTPLoader) {
  return new BHttp(backend, defaultOptions, bHTTPLoader);
}


/**
*bootstrap for @NgModule
*/
export const appBootstrap: any = [
  LayoutComponent,
];

/**
*Entry Components for @NgModule
*/
export const appEntryComponents: any = [
  AlertComponent
];

/**
*declarations for @NgModule
*/
export const appDeclarations = [
  ImgSrcDirective,
  LayoutComponent,
  TestComponent,
  AlertComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
  PageNotFoundComponent
];

/**
* provider for @NgModuke
*/
export const appProviders = [
  {
    provide: Http,
    useFactory: httpFactory,
    deps: [XHRBackend, RequestOptions, BHTTPLoader]
  },
  NotificationService,
  BAuthGuard,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY
  LocalStorageService,
  PubSubService,
  BLoginService,
  BSessionStorage,
  BLocalStorageService,
  BAppService,
  BHTTPLoader,
  BDataSourceService

];

/**
* Routes available for bApp
*/

// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_START
export const appRoutes = [{ path: '', redirectTo: '/', pathMatch: 'full' }, { path: '**', component: PageNotFoundComponent }];
// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_END
