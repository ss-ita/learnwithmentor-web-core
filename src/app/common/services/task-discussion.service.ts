import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { TaskDiscussion } from '../models/taskDiscussion';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgClass } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TaskDiscussionService {

  constructor(private http: HttpClient) {}

  private url = `${environment.apiUrl}`;
  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  getTaskdiscussion(taskId: number): Observable<TaskDiscussion[]> {
    return this.http.get<TaskDiscussion[]>(`${this.url}task/discussion/${taskId}`, { headers: this.reqHeader }).pipe();
  }
}
