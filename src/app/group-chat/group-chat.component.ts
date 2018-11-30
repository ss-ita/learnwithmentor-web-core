import {Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html'
})

export class GroupChatComponent implements OnInit {
  public _hubConnection: HubConnection;
  nick = '';
  message = '';
  messages: string[] = [];

  

  public sendMessage(): void {
      this._hubConnection
      .invoke('sendToAll', this.nick, this.message)
      .then(() => this.message = '')
      .catch(err => console.error(err));
  }

  ngOnInit() {
    this.nick = window.prompt('Your name:', 'John');

    this._hubConnection = new HubConnectionBuilder().withUrl('https://localhost:44338/chat').build();

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

      this._hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
        const text = `${nick}: ${receivedMessage}`;
        this.messages.push(text);
     });

    }
    public openForm(){
      document.getElementById("myForm").style.display = "block";
    }
    public closeForm() {
      document.getElementById("myForm").style.display = "none";
    }
}
