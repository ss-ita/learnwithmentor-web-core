import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Notification } from '../models/notification';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { userInfo } from 'os';


@Injectable({
  providedIn: 'root'
})
export class NotificationService  {

  constructor(private http: HttpClient){}

  private url = `${environment.apiUrl}`
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  getNotificaions(UserId:number): Observable<HttpResponse<any>> {
    return this.http.get<Notification[]>(`${this.url}/notifications?id=${UserId}`,{observe:'response',headers:this.reqHeader});
  }
}

