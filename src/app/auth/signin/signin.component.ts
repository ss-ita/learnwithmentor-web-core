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

  constructor(public thisDialogRef: MatDialogRef<SigninComponent>, private auth: AuthService,
    private userService: UserService, private router: Router,
    private  alertwindow: AlertWindowsComponent) {
      if (window.addEventListener) {
        window.addEventListener("message", this.handleMessage.bind(this), false);
      } else {
         (<any>window).attachEvent("onmessage", this.handleMessage.bind(this));
      } 
     }

  launchFbLogin() {
    this.authWindow = window.open(`https://www.facebook.com/v3.2/dialog/oauth?&response_type=token&display=popup&client_id=318651702058203&display=popup&redirect_uri=${this.url}facebook-auth.html&scope=email`,null,'width=600,height=400,top=400,left=400'); 
    //this.authWindow = window.open('https://www.facebook.com/v3.2/dialog/oauth?&response_type=token&display=popup&client_id=318651702058203&display=popup&redirect_uri=http://localhost:4200/facebook-auth.html&scope=email',null,'width=600,height=400,top=400,left=400'); 
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

  handleMessage(event: Event) {
    const message = event as MessageEvent;
    let url_ = this.url.substring(0, this.url.length - 1);
    if (message.origin !== url_) return;

    this.authWindow.close();

    const result = JSON.parse(message.data);
    if (!result.status)
    {
      this.failed = true;
      this.errorDescription = result.errorDescription;
      this.alertwindow.openSnackBar('Error! ' + this.errorDescription, '');
    }
    else
    {
      this.failed = false;
      this.userService.facebookLogin(result.accessToken).subscribe((data: string) => {
        this.auth.setUserData(data);
        this.closeSigninComponent();
      })
    }
  }
}
