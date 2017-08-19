import { Component, OnInit, OnDestroy } from '@angular/core';

import { ChatsService } from '../core/chats.service';
import { SocketService } from '../core/socket.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {
  chats = [];
  private chatMap = {};
  private _activeChats = true;
  private socketSubscription;
  set activeChats(isActive) {
    this._activeChats = isActive;
    this.getChats();
  }
  get activeChats(): boolean {
    return this._activeChats;
  }
  connectedChats = 0;
  connectedRespondingClients = 0;

  constructor(
    private chatsService: ChatsService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.getChats();
    this.socketSubscription = this.socketService.onMessage()
      .subscribe(data => {
        if (data.info) {
          this.getChats();
          this.connectedRespondingClients = data.info.respondingClients;
          this.connectedChats = data.info.connectedToChat;
        } else if (data.message) {
          const chat = this.chatMap[data.message.id] ;
          chat.newMessages = data.message.from === data.message.id ? chat.newMessages += 1 : 0;
        } else if (data.error) {
          alert(data.error);
        }
      });
  }

  private getChats() {
    this.chatsService.getChats({active: this.activeChats})
      .subscribe(d => {
        console.log('d', d);
        if (d.hasOwnProperty('connectedChats')) {
          d.chats = d.connectedChats;
        }
        this.chats = d.chats.map(chatId => {
          const activeChat = {id: chatId, newMessages: 0};
          this.chatMap[chatId] = activeChat;
          return activeChat;
        });
      });
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
  }

}
