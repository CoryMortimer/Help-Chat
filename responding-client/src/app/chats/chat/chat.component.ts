import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ChatsService } from '../../core/chats.service';
import { SocketService } from '../../core/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chatForm: FormGroup;
  id: string;
  messages = [];
  private socketSubscription;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private chatsService: ChatsService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.chatsService.getMessages(this.id)
        .subscribe(d => {
          console.log('messages', d.rows);
          this.messages = d.rows;
        }, e => console.log('error getting messages', e));

        this.socketSubscription = this.socketService.onMessage()
          .subscribe(data => {
            if (data.message) {
              if (data.message.id === this.id) {
                this.messages.push({speaker: data.message.from, message: data.message.msg});
              }
            } else if (data.error) {
              alert(data.error);
            }
          });
    });
    this.createForm();
  }

  private createForm() {
    this.chatForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  onSubmit() {
    console.log('submitted');
    const name = this.chatForm.get('name').value;
    const msg = this.chatForm.get('message').value;
    console.log('name', name);
    console.log('msg', msg);
    if (name && msg) {
      this.chatsService.sendMessage(this.id, name, msg)
        .subscribe(d => console.log('sent!'), e => {
          console.log('error with sending msg', e);
          alert(e.error || 'error with sending message');
        });
    } else {
      alert('name and message need to be filled in!');
    }
  }
}
