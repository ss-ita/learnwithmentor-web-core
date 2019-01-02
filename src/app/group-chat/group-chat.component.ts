import {Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../common/services/auth.service';
import { GroupService } from '../common/services/group.service';
import { UserService } from '../common/services/user.service';
import { HttpBackend } from '@angular/common/http';
import { Image } from '../common/models/image';
import { HttpStatusCodeService } from '../common/services/http-status-code.service';
import { GroupChatService } from '../common/services/group-chat.service';
import { User } from '../common/models/user';
import { Group } from '../common/models/group';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})

export class GroupChatComponent implements OnInit {

  public _hubConnection: HubConnection;
  private url = `${environment.apiUrl}`;

  group: Group;
  userName = '';
  groupName = '';
  userId = 0;
  userImage = null;
  message = '';
  messages = [];
  user: User;

  isLogin = false;

  constructor(private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private httpStatusCodeService: HttpStatusCodeService,
    private groupChatService: GroupChatService) {
  }

  ngOnInit() {

    const jwt = new JwtHelperService();

    this.authService.isAuthenticated().subscribe(val => {
      this.isLogin = val;
      this.userId = this.authService.getUserId();
      this.isVisible();
      if (this.isLogin) {
        this.userService.getImage(this.userId).subscribe(response => {
          if (this.httpStatusCodeService.isOk(response.status)) {
            this.setUserPic(response.body);
          } else {
            this.userImage = '../../../assets/images/user-default.png';
          }
        });
      }
    });

    this.authService.updateUserState();
    this.userName = this.authService.getUserFullName();
  }

  connectToChat(userId) {
    this.groupChatService.connectToGroup(userId);
  }

  addMessage(senderId, name, message, time) {
    this.messages.push({senderName: name, textMessage: message, timeSent: time});
  }

  setUserPic(img: Image) {
    const extension = img.Name.split('.').pop().toLowerCase();
    const imgUrl = `data:image/${extension};base64,${img.Base64Data}`;
    this.userImage = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  public isVisible() {
    if (this.isLogin) {
      document.getElementById('chatBlock').style.display = 'block';
    }
  }

  public sendMessage(): void {
    this.groupChatService.sendMessageToAll(this.userId, this.message);
  }

  public sendMessageToGroup(): void {
    this.groupChatService.sendMessageToGroup(this.userId, this.message);
    document.getElementById('message').nodeValue = '';
  }

  public openForm(): void {
    this.connectToChat(this.userId);
    document.getElementById('groupChatForm').style.display = 'block';
    this.groupChatService.getLastMessages(this.userId);
  }

  public closeForm() {
    document.getElementById('groupChatForm').style.display = 'none';
    this.messages = [];
  }

  public getAllMessages(): void {
    document.getElementById('getAllMessages-button').style.display = 'none';
    this.messages = [];
    this.groupChatService.getMessages(this.userId);
  }

}
