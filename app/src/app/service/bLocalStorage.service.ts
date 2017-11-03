import { Injectable } from '@angular/core';

@Injectable()
export class BLocalStorageService {

  private localStorageCache = {};

  constructor() {
    this.localStorageCache = localStorage;
  }

  getLocalStorage() {
    return this.localStorageCache;
  }

  setValue(key, value) {
    // if (!this.localStorageCache.hasOwnProperty(key)) {
    //   value = JSON.stringify(value);
    //   localStorage.setItem(key, value);
    //   this.localStorageCache[key] = value;
    // }

    if (typeof value != 'string') {
      value = JSON.stringify(value);
    }
     localStorage.setItem(key, value);
     this.localStorageCache[key] = value;

  }

  getValue(key) {
    if (!this.localStorageCache[key]) {
      return null;
    }
    try {
      return JSON.parse(this.localStorageCache[key]);
    } catch (e) {
      return this.localStorageCache[key];
    }
  }

  remove(key) {
    if (this.localStorageCache.hasOwnProperty(key)) {
      localStorage.removeItem(key);
      delete localStorage[key];
    }
  }


  getLocalSotageData() {
    let tokenObj = {};
    let key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      tokenObj[key] = localStorage[key];
      
    }
    return tokenObj;
  }


  clearLocalStorage() {
    this.remove('userObj');
    this.remove('accessToken');
    this.remove('refreshToken');
    this.remove('registrationId');
  }
}
