import { Component, ViewChild, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { NavbarComponent } from './navbar/navbar.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { AuthService } from './common/services/auth.service';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('navbar')
  private navbar: NavbarComponent;
  @ViewChild('chat')
  private chat: GroupChatComponent;
  private hubConnection: HubConnection;
  private url = `${environment.apiUrl}`;

  title = 'app';
  isLogin = false;
  userId = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    /*this.authService.isAuthenticated().subscribe(val => {
      this.isLogin = val;
      this.userId = this.authService.getUserId();
      if (this.isLogin) {
        this.navbar.pullNotifications();
        if (this.hubConnection == null) {
          this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${this.url}notifications`, { accessTokenFactory: () => localStorage.getItem('userToken') })
            .build();
          this.hubConnection
            .start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection :('));
          this.hubConnection.on('Notify', () => {
            this.navbar.pullNotifications();
          });
          this.hubConnection.on('SendMessage', (senderId: number, name: string, message: string, time: string) => {
            this.chat.addMessage(senderId, name, message, time);
          });
        }
      } else {
        if (this.hubConnection != null) {
          this.hubConnection.stop();
          this.hubConnection = null;
        }
      }
    });*/
  }
}
