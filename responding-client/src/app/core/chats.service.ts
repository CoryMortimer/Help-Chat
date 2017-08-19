import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { GetAuthService } from './get-auth.service';
import { TransformResponseService } from './transform-response.service';

@Injectable()
export class ChatsService {
  private chatsUrl = '/api/chats'

  constructor(
    private http: Http,
    private getAuthService: GetAuthService,
    private transformResponseService: TransformResponseService
  ) { }

  getChats(options?: {active?: boolean}): Observable<any> {
    const authorization = this.getAuthService.getBase64Auth();
    const httpOptions = {headers: new Headers({Authorization: 'Basic ' + authorization})};
    if (options && options.active) {
      httpOptions['params'] = {connected: true};
    }
    return this.http
      .get(this.chatsUrl, httpOptions)
      .map(r => this.transformResponseService.transform(r))
      .catch(e => Observable.throw(this.transformResponseService.transform(e)));
  }

  sendMessage(id: string, name: string, msg: string): Observable<any> {
    const authorization = this.getAuthService.getBase64Auth();
    const httpOptions = {headers: new Headers({Authorization: 'Basic ' + authorization})};
    return this.http
      .post(this.chatsUrl + '/' + id, {name: name, message: msg}, httpOptions)
      .map(r => this.transformResponseService.transform(r))
      .catch(e => Observable.throw(this.transformResponseService.transform(e)));
  }

  getMessages(id: string): Observable<any> {
    const authorization = this.getAuthService.getBase64Auth();
    const httpOptions = {headers: new Headers({Authorization: 'Basic ' + authorization})};
    return this.http
      .get(this.chatsUrl + '/' + id, httpOptions)
      .map(r => this.transformResponseService.transform(r))
      .catch(e => Observable.throw(this.transformResponseService.transform(e)));
  }

}
