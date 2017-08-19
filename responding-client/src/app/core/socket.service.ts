import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

import { GetAuthService } from './get-auth.service';

@Injectable()
export class SocketService {
  private socketPath = '/socket/responding';
  private socket;
  private socketEvent = new EventEmitter();

  constructor(private getAuthService: GetAuthService) {
    this.socket = io('', {path: this.socketPath, query: {auth: this.getAuthService.getBase64Auth()}});

    this.socket.on('message', (msg) => {
      this.socketEvent.emit({message: msg});
    });
    this.socket.on('info', (info) => {
      this.socketEvent.emit({info: info});
    });
    this.socket.on('error', (e) => {
      this.socketEvent.emit({error: e});
    });
  }

  onMessage(): Observable<any> {
    return this.socketEvent;
  }
}
