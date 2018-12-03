import { Injectable } from '@angular/core';
import { Observable, of, observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { Group } from '../models/group';
import { Plan } from '../models/plan';
import { Message } from '../models/message'
import { UserWithImage } from '../models/userWithImage';
import { AlertWindowsComponent } from './../../components/alert-windows/alert-windows.component';


@Injectable({
  providedIn: 'root'
})
export class GroupChatService {

  constructor(private http: HttpClient,
    private alertWindow: AlertWindowsComponent) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  private url = `${environment.apiUrl}chat`;

  sendMessageToAll(userName: string, receivedMessage: string){
    var body = {userName: userName, receivedMessage: receivedMessage}; 
    console.log("this works");
    return this.http.post(`${this.url}/${userName}/${receivedMessage}`, body);
  }
}