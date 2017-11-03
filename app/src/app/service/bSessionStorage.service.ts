import { Injectable } from '@angular/core';

@Injectable()
export class BSessionStorage {
  private sessionStorageCache = {};
  constructor() {
    this.sessionStorageCache = sessionStorage;
  }

  getSessionStorage() {
    return this.sessionStorageCache;
  }

  setValue(key, value) {
    if (typeof value != 'string') {
      value = JSON.stringify(value);
    }
    this.sessionStorageCache[key] = value;
    sessionStorage.setItem(key, value)
  }

  getValue(key) {
    // if (!this.sessionStorageCache.hasOwnProperty(key)) {
    //   this.sessionStorageCache[key] = sessionStorage.getItem(key);
    //   return this.sessionStorageCache[key];
    // } else {
    //   return this.sessionStorageCache[key];
    // }
    return sessionStorage.getItem(key);
  }

  remove(key) {
    if (this.sessionStorageCache.hasOwnProperty(key)) {
      delete this.sessionStorageCache[key];
      sessionStorage.removeItem(key);
    }
  }

  clearSessionStorage() {
    this.sessionStorageCache = {};
    sessionStorage.clear();
  }

}