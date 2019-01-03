import { Injectable } from '@angular/core';
import { Observable, of, observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { Group } from '../models/group';
import { Plan } from '../models/plan';
import { Message } from '../models/message';
import { UserWithImage } from '../models/userWithImage';
import { AlertWindowsComponent } from './../../components/alert-windows/alert-windows.component';

import { Email } from '../models/email';
import { DateTime } from 'date-time-js';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({
  providedIn: 'root'
})

export class GroupChatService {

  constructor(private http: HttpClient) { }

  private url = `${environment.apiUrl}`;

  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  sendMessageToGroup(id: number, message: string) {
    console.log('group-chat.service works');
      this.http.get(`${this.url}chat/${id}/${message}/group`).subscribe();
  }

  connectToGroup(id: number) {
    this.http.get(`${this.url}chat/connect/${id}`, { headers: this.reqHeader }).subscribe();
  }

  getMessages(userId: number) {
    this.http.get(`${this.url}chat/getmessages/${userId}`).subscribe();
  }

  getLastMessages(userId: number) {
    const amount = 20;
    this.http.get(`${this.url}chat/getmessages/${userId}/${amount}`).subscribe();
  }

  sendMessageToAll(id: number, message: string ) {
    this.http.get(`${this.url}chat/${id}/${message}`).subscribe();
  }
}
