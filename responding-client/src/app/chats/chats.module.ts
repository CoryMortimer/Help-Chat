import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ChatsRoutingModule } from './chats-routing.module';
import { ChatsComponent } from './chats.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  imports: [
    CommonModule,
    ChatsRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ChatsComponent, ChatComponent]
})
export class ChatsModule { }
