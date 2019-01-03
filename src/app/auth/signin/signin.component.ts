import { Component, OnInit } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { MatDialogRef } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { AuthService } from '../../common/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  private authWindow: Window;
  failed: boolean;
  errorDescription: string;
  private url = `${environment.uiUrl}`;
  authState = 0;

  constructor(public thisDialogRef: MatDialogRef<SigninComponent>, private auth: AuthService,
    private userService: UserService, private router: Router,
    private  alertwindow: AlertWindowsComponent) {
      this.authState = 0;
      if (window.addEventListener) {
        window.addEventListener('message', this.handleMessage.bind(this), false);
      } else {
        (<any>window).attachEvent('onmessage', this.handleMessage.bind(this));
      }
  }

  launchFbLogin() {
    this.authWindow = window.open(`https://www.facebook.com/v3.2/dialog/oauth?&response_type=token&display=popup&client_id=318651702058203&display=popup&redirect_uri=${this.url}facebook-auth&scope=email`, null, 'width=600,height=400,top=400,left=400');
  }

  launchGoogleLogin() {
    this.authWindow = window.open(`https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/userinfo.email&client_id=289151810162-vch7l94sbd0jh3f2u5v3g0lnf3sfjqn5.apps.googleusercontent.com&redirect_uri=${this.url}signin-google&response_type=token`, null, 'width=600,height=400,top=400,left=400');
  }

  closeSigninComponent(): void {
    this.thisDialogRef.close();
  }

  ngOnInit() {
  }

  hideDialog() {
    this.closeSigninComponent();
  }

  OnSubmit(form: NgForm) {
    this.userService.userAuthentication(form.value).subscribe((data: any) => {
      this.auth.setUserData(data);
      this.closeSigninComponent();
    },
    (err: HttpErrorResponse) => {
      this.alertwindow.openSnackBar('Incorrect email or password', '');
    });
  }

  isJson(data: any) {
    if (/^[\],:{}\s]*$/.test(data.replace(/\\["\\\/bfnrtu]/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      return true;
    } else {
      return false;
    }
  }

  handleMessage(event: Event) {
    const message = event as MessageEvent;

    if (this.authState !== 0 || !this.isJson(message.data)) {
      return;
    }

    this.url = this.url.substring(0, this.url.length - 1);
    if (message.origin !== this.url) { return; }

    const result = JSON.parse(message.data);
    if (!result.status) {
      this.failed = true;
      this.errorDescription = result.errorDescription;
      this.alertwindow.openSnackBar('Error! ' + this.errorDescription, '');
    } else {
      if (result.provider === 'facebook') {
        this.failed = false;
        this.userService.facebookLogin(result.accessToken).subscribe((data: string) => {
          this.auth.setUserData(data);
          this.authWindow.close();
          this.closeSigninComponent();
        });
      } else if (result.provider === 'google') {
        this.failed = false;
        this.userService.googleLogin(result.accessToken).subscribe((data: string) => {
          this.auth.setUserData(data);
          this.authWindow.close();
          this.closeSigninComponent();
        });
      }
    }
    this.authState = 1;
  }
}
