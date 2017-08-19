import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';

@Injectable()
export class GetAuthService {

  constructor(private localStorageService: LocalStorageService) { }

  getBase64Auth(): string {
    const credentials = this.localStorageService.getItem('credentials') || {};
    let authorization = credentials.key + ':' + credentials.secret;
    try {
      authorization = btoa(authorization);
    } catch (e) {}
    return authorization;
  }
}
