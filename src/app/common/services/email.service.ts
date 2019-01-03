import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse,  } from '@angular/common/http';
import { Email } from '../models/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });

  private url = `${environment.apiUrl}user`;
  private resetPage = `${environment.uiUrl}password-reset`;
  private emailConfirmPage = `${environment.uiUrl}confirm-email`;

  sendPasswordResetEmail(email: Email): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/password-reset?resetPasswordLink=${this.resetPage}`,
    email, { observe: 'response', headers: this.reqHeader });
  }

  sendEmailConfirmationEmail(email: Email): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/confirm-email?emailConfirmLink=${this.emailConfirmPage}`,
    email, { observe: 'response', headers: this.reqHeader });
  }

  verifyPasswordResetToken(token: string): Observable<number> {
    return this.http.get<number>(`${this.url}/verify-token?token=${token}`, { headers: this.reqHeader }).pipe();
  }

  confirmUserEmail(token: string): Observable<string> {
    return this.http.get<string>(`${this.url}/confirm-email?token=${token}`, { headers: this.reqHeader }).pipe();
  }

  resetPassword(id: number, NewPassword: string, OldPassword: string): Observable<HttpResponse<any>> {
    const body = {
      NewPassword: NewPassword,
      OldPassword: OldPassword
    };
    return this.http.put(`${this.url}/resetpasswotd?id=${id}`, body, { observe: 'response', headers: this.reqHeader });
  }
}
