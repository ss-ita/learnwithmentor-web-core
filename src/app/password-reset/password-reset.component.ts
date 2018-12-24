import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../common/services/email.service';
import { HttpStatusCodeService } from '../common/services/http-status-code.service';
import { AlertWindowsComponent } from '../components/alert-windows/alert-windows.component';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { NgForm } from '../../../node_modules/@angular/forms';
import { Email } from '../common/models/email';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(public activateRoute: ActivatedRoute,
    private emailService: EmailService,
    private httpStatusCodeService: HttpStatusCodeService,
    private alertwindow: AlertWindowsComponent) { }

  token: string;
  message: string;
  progresSpinerActive = false;
  errorMessage: string;
  errorMessageActive = false;
  tokenValid = false;
  userId: number;

  progresResetSpinerActive = false;
  errorResetMessage: string;
  errorResetMessageActive = false;

  ngOnInit() {
    this.activateRoute.params.subscribe(params => this.token = params['token']);
    this.emailService.verifyPasswordResetToken(this.token).subscribe(
      data => {
        this.userId = data;
        this.tokenValid = true;
        this.message = 'Please input new password';
      },
      (error: HttpErrorResponse) => {
        this.message = error.error.Message;
      }
    );
  }

  resetPassword(form: NgForm) {
    if (form.value.Password === form.value.Password2) {
      this.progresSpinerActive = true;
      this.emailService.resetPassword(this.userId, form.value.Password, form.value.OldPassword).subscribe(
        resp => {
          if (this.httpStatusCodeService.isOk(resp.status)) {
            this.alertwindow.openSnackBar('Password successfully changed', 'Ok');
            this.errorMessageActive = false;
          }
          if (this.httpStatusCodeService.isNoContent(resp.status)) {
            this.activateErrorMessage('User not found');
          }
        },
        error => {
          this.activateErrorMessage(error.error.Message);
          this.progresSpinerActive = false;
        },
        () => {
          this.progresSpinerActive = false;
        }
      );
    } else {
      this.activateErrorMessage('Password must be equal in both fields');
    }
  }

  activateErrorMessage(message: string): void {
    this.errorMessage = message;
    this.errorMessageActive = true;
  }

  onPasswordChange() {
    if (this.errorMessageActive) {
      this.errorMessage = null;
      this.errorMessageActive = false;
    }
  }

}
