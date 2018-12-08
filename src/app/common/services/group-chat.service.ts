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
  
import { Email } from '../models/email';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({
  providedIn: 'root'
})

export class GroupChatService {

  constructor(private http: HttpClient) { }

  private url = `${environment.apiUrl}`;

  sendMessageToGroup(id:number, message:string){
      this.http.get(`${this.url}chat/${id}/${message}/group`).subscribe();
  }

  sendMessageToAll(id: number, message: string ){
    var body = {}; 
    console.log("group-chat.service works");
    //this.http.get('https://localhost:44338/api/chat/message').subscribe();//(data:string) => this.idc = data); 
    this.http.get(`${this.url}chat/${id}/${message}/group`).subscribe();
    
  } 
  connectToGroup(id: number)
  {
    this.http.get(`${this.url}chat/connect/${id}`).subscribe();
  }
}