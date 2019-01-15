import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { EventColor, CalendarEvent } from 'calendar-utils';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
providedIn: 'root'
})

export class CalendarService {
    constructor(private http: HttpClient) { }

    private url = `${environment.apiUrl}`;

    private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

   /* sendCalendarEvent(calendarId: number, title:string, start: Date, end?: Date, color?:string){ 
        this.http.get(`${this.url}calendar/${calendarId}/${title}/${start}/${end}/${color}`).subscribe();
    }*/
    sendCalendarEvent(currentEvent: string){
        this.http.get(`${this.url}calendar/${currentEvent}`).subscribe();
    }
}