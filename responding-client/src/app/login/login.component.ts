import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LocalStorageService } from '../core/local-storage.service';
import { ChatsService } from '../core/chats.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private chatsService: ChatsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      key: ['', Validators.required],
      secret: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('submitted');
    if (!this.loginForm.valid) {
      alert('Please fill out all fields');
      return;
    }
    const key = this.loginForm.get('key').value;
    const secret = this.loginForm.get('secret').value;
    this.localStorageService.setItem('credentials', {key: key, secret: secret});
    this.chatsService.getChats()
      .subscribe(d => {
        this.router.navigate(['chats']);
      }, e => {
        alert('error with auth');
      });
  }

}
