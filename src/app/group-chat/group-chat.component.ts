import {Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../common/services/auth.service';
import { GroupService } from '../common/services/group.service';
import { UserService } from '../common/services/user.service';
import { HttpBackend } from '@angular/common/http';
import { GroupChatService } from '../common/services/group-chat.service'
import { User } from '../common/models/user';
import { Group } from '../common/models/group';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})

export class GroupChatComponent implements OnInit {

  public _hubConnection: HubConnection;

  group: Group;
  userName = '';
  groupName = '';
  userId = 0;
  message = '';
  messages: string[] = [];
  user: User;

  isLogin = false;

  constructor(private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService,
    private userService: UserService,
    private groupChatService: GroupChatService) {
  }

  ngOnInit() {

    const jwt = new JwtHelperService();

    this.authService.isAuthenticated().subscribe(val => {
      this.isLogin = val;
      this.isVisible();
      
      if(this.isLogin)
      {
      if (this._hubConnection == null) {
      this._hubConnection = new HubConnectionBuilder().withUrl('https://localhost:44338/api/notifications', { accessTokenFactory: () => localStorage.getItem('userToken') }).build();
  
      this._hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while establishing connection :('));
      }
    }
    });
  
    this.authService.updateUserState();
    this.userName = this.authService.getUserFullName();
    this.userId = this.authService.getUserId();
    if(this.isLogin)
    {
      this.groupChatService.connectToGroup(this.userId);
      this._hubConnection.on('GroupMessage', (userName: string, receivedMessage: string, timeSended: string) => {
      const text = `${userName}: ${receivedMessage} ${timeSended}`;
      this.messages.push(text);
      
      });
    }

    
    }
    public isVisible(){
      if(this.isLogin) {
        document.getElementById("chatBlock").style.display = "block";
      }
    }
    public sendMessage(): void 
    {   
      this.groupChatService.sendMessageToAll(this.userId, this.message);
    }
    public sendMessageToGroup(): void 
    {
      this.groupChatService.sendMessageToGroup(this.userId, this.message);
    }

    public openForm(){
      document.getElementById("groupChatForm").style.display = "block";
    }
    public closeForm() {
      document.getElementById("groupChatForm").style.display = "none";
    }
}
