import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private canUseLocalStorage = false;
  private storage = {};

  constructor() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.getItem('test');
      localStorage.removeItem('test');
      this.canUseLocalStorage = true;
    } catch (e) {
      console.log('cannot use local storage');
    }
  }

  setItem(key: string, value: any) {
    if (this.canUseLocalStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      this.storage[key] = JSON.stringify(value);
    }
  }

  getItem(key: string): any {
    const item = this.canUseLocalStorage ? localStorage.getItem(key) : this.storage[key];
    try {
      return JSON.parse(item);
    } catch (e) {
      return null
    }
  }

  removeItem(key: string) {
    delete this.storage[key];
    if (this.canUseLocalStorage) {
      localStorage.removeItem(key);
    }
  }
}
