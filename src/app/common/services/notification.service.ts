import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Notification } from '../models/notification';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class NotificationService  {

  constructor(private http: HttpClient){}

  private url = `${environment.apiUrl}`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  getNotifications(userId : number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}notifications/${userId}`, { headers: this.reqHeader }).pipe();
  }
}