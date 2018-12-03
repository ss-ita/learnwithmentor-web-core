import {Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../common/services/auth.service';
import { GroupService } from '../common/services/group.service';
import { UserService } from '../common/services/user.service';
import { HttpBackend } from '@angular/common/http';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})

export class GroupChatComponent implements OnInit {

  public _hubConnection: HubConnection;

  groupid = '';
  userName = '';
  message = '';
  messages: string[] = [];

  isLogin = false;

  constructor(private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService,
    private userService: UserService) {
  }

  ngOnInit() {

    const jwt = new JwtHelperService();
    this.authService.isAuthenticated().subscribe(val => {
      this.isLogin = val;
    });
    this.authService.updateUserState();
    this.userName = this.authService.getUserFullName();
    
    this.isVisible();
    
    if (this._hubConnection == null) {
    this._hubConnection = new HubConnectionBuilder().withUrl('https://localhost:44338/api/chat').build();

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));
    }
      this._hubConnection.on('BroadcastMessage', (userName: string, receivedMessage: string) => {
        const text = `${userName}: ${receivedMessage}`;
        this.messages.push(text);
     });
    }
    public isVisible(){
      if(this.isLogin) {
        document.getElementById("chatBlock").style.display = "block";
      }
    }
    public sendMessage(): void {    
      /*this._hubConnection
      .invoke('BroadcastMessage', this.userName, this.message)
      .then(() => this.message = '')
      .catch(err => console.error(err));*/
      this.userService.updatePassword(this.userName);
    }
    public openForm(){
      document.getElementById("groupChatForm").style.display = "block";
    }
    public closeForm() {
      document.getElementById("groupChatForm").style.display = "none";
    }
}
