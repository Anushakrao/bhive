import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class BDataSourceService {

  constructor(private http: Http) { }


  getDataSource() {
    return this.http.get('constants/app.const.json').map(res => {
      if (res && res.hasOwnProperty('_body')) {
        return res['_body'];
      }
    })
  }

}