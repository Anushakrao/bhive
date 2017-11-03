import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Request, Response, Headers, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { BHTTPLoader } from './bHTTPLoader';
import { SystemService } from './system.service';
import { BSessionStorage } from './bSessionStorage.service';
import { BLocalStorageService } from './bLocalStorage.service';
import { BTokenService } from './bToken.service';


@Injectable()
export class BHttp extends Http {
  timeout = 90000;
  systemService;
  bSessionStorage;
  bLocalStorageService;
  refreshUrl;
  bTokenService;
  // bAppService;
  // constructor(backend: ConnectionBackend,
  //             defaultOptions: RequestOptions,
  //             private loaderService: LoaderService) {
  //     super(backend, defaultOptions);
  // }
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, public bHTTPLoader: BHTTPLoader) {

    super(backend, defaultOptions);
    this.systemService = new SystemService();
    this.bSessionStorage = new BSessionStorage();
    this.bLocalStorageService = new BLocalStorageService();
    this.bTokenService = new BTokenService();
  }
  /**
   * Performs any type of http request.
   * @param url
   * @param options
   * @returns {Observable<Response>}
   */
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).catch((error) => {
      if (error.status === 403 && JSON.parse(error['_body'])['message'] === 'jwt expired') {
        return this.updateToken().flatMap((result: boolean) => {
          //if got new access token - retry request
          if (result) {
            let newRequest: Request = <Request>url;
            newRequest.headers.set('Authorization', 'Bearer ' + this.bSessionStorage.getValue('accessToken'));
            return super.request(newRequest);
          } else {
            return Observable.throw(new Error('Can\'t refresh the token'));
          }
        });
      } else {
        return Observable.throw(error);
      }
    })
  }

  updateToken(): Observable<boolean> {
    var appProperties = this.systemService.getVal('properties');
    this.refreshUrl = this.systemService.getAuthUrl() + 'refresh/' + appProperties.appDataSource + '/' + appProperties.appName;
    return super.request(
      new Request({
        method: RequestMethod.Post,
        url: this.refreshUrl,
        body: {
          'uuid': this.bLocalStorageService.getValue('uuid'),
          'userKey': JSON.parse(this.bSessionStorage.getValue('userObj'))['userKey'],
          'refreshToken': this.bSessionStorage.getValue('refreshToken')
        },
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
    ).map((response: Response) => {
      let tokensObj = JSON.parse(response['_body']);
      if (tokensObj) {
        this.bTokenService.updateTokens(tokensObj);
        return true;
      } else {
        return false;
      }
    });
  }


  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return super.get(this.getFullUrl(url), this.requestOptions(options)).timeout(this.timeout)
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }
  getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
    return super.get(url, options);
  }
  /**
   * Performs a request with `post` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return super.post(this.getFullUrl(url), body, this.requestOptions(options)).timeout(this.timeout)
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }
  /**
   * Performs a request with `put` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return super.put(this.getFullUrl(url), body, this.requestOptions(options)).timeout(this.timeout)
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }
  /**
   * Performs a request with `delete` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return super.delete(this.getFullUrl(url), options).timeout(this.timeout)
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSubscribeSuccess(res);
      }, (error: any) => {
        this.onSubscribeError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }
  /**
   * Request options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    return this.addDefaultHeaders(options);
  }
  /**
   * Default options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  protected addDefaultHeaders(options?: RequestOptionsArgs): RequestOptionsArgs {
    /**
     * TODO: Add all default Headers over here
     */
    if (!options.headers.has('Access-Control-Allow-Origin')) {
      options.headers.append('Access-Control-Allow-Origin', '*');
    }
    if (!options.headers.has('Content-Type')) {
      options.headers.append('Content-Type', 'application/json');
    }
    if (!options.headers.has('Accept')) {
      options.headers.append('Accept', 'application/json');
    }
    if (!options.headers.has('Authorization')) {
      //user id and password hardcoded
      // options.headers.append('Authorization', 'Basic YmhpdmUtYXJ0LXByb3h5dXNlcjphcnRwcm94eUAxMzU3OSEjJSYoKQ==');
    }
    if (this.bSessionStorage.getValue('accessToken')) {
      options.headers.append('Authorization', 'Bearer ' + this.bSessionStorage.getValue('accessToken'));
    }
    return options;
  }
  /**
   * Build API url.
   * @param url
   * @returns {string}
   */
  private getFullUrl(url: string): string {
    // return full URL to API here
    return url;
  }
  /**
   * Request interceptor.
   */
  private requestInterceptor(): void {
    this.bHTTPLoader.isHTTPRequestInProgress(true);
  }
  /**
   * Response interceptor.
   */
  private responseInterceptor(): void {
    this.bHTTPLoader.isHTTPRequestInProgress(false);
  }
  /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    // console.log(error);
    // if (error.message) {
    //   btoastService.showBottom(error.message)
    // } else if (error.status < 200 || error.status > 500) {
    //   if (error.status == 0) {
    //     btoastService.showBottom('Connectivity issue');
    //   } else {
    //     btoastService.showBottom('Response failure');
    //   }
    // } else {
    //   if (error.hasOwnProperty('_body') && error._body) {
    //     btoastService.showBottom(error._body);
    //   } else {
    //     btoastService.showBottom("Response failure");
    //   }
    // }
    return Observable.throw(error);
  }
  /**
   * onSubscribeSuccess
   * @param res
   */
  private onSubscribeSuccess(res: Response): void { }
  /**
   * onSubscribeError
   * @param error
   */
  private onSubscribeError(error: any): void {
    this.bHTTPLoader.alertError(error);
  }
  /**
   * onFinally
   */
  private onFinally(): void {
    this.responseInterceptor();
  }
}
