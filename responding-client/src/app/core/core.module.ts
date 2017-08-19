import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { LocalStorageService } from './local-storage.service';
import { ChatsService } from './chats.service';
import { TransformResponseService } from './transform-response.service';
import { SocketService } from './socket.service';
import { GetAuthService } from './get-auth.service';

@NgModule({
  imports: [
    HttpModule
  ],
  declarations: [],
  providers: [
    LocalStorageService,
    ChatsService,
    TransformResponseService,
    SocketService,
    GetAuthService
  ],
  exports: [HttpModule]
})
export class CoreModule { }
