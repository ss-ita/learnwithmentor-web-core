import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private jwt = new JwtHelperService();

  private authenticated = new Subject<boolean>();

  isValid(token: string): boolean {
    if (!this.jwt.isTokenExpired(token)) {
      this.authenticated.next(true);
      return true;
    }
    this.authenticated.next(false);
    return false;
  }

  setUserData(token: string): void {
    const helper = new JwtHelperService();
    const user = helper.decodeToken(token);
    localStorage.setItem('userToken', token);
    this.authenticated.next(true);
  }

  removeUserData(): void {
    localStorage.clear();
    this.authenticated.next(false);
  }

  updateUserState() {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.authenticated.next(this.isValid(token));
    } else {
      this.authenticated.next(false);
    }
  }

  isAuthenticated(): Subject<boolean> {
    return this.authenticated;
  }

  private getUser() {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    return helper.decodeToken(token);
  }

  getUserId(): number {
    if (!this.getUser()) {
      return null;
    }
    return parseInt(this.getUser().Id, 10);
  }

  isEmailConfirmed(): boolean {
    if (!this.getUser()) {
      return null;
    }
    return this.getUser().EmailConfirmed === 'True' ;
  }

  getUserFullName(): string {
    if (!this.getUser()) {
      return null;
    }
    return this.getUser().unique_name;
  }

  private getUserRole(): string {
    if (!this.getUser()) {
      return null;
    }
    return this.getUser().role;
  }

  isMentor(): boolean {
    return this.getUserRole() === 'Mentor';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isStudent(): boolean {
    return this.getUserRole() === 'Student';
  }

  getUserEmail(): string {
    if (!this.getUser()) {
      return null;
    }
    return this.getUser().email;
  }
}
