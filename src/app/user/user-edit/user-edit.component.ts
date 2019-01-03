import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../common/models/user';
import { AuthService } from '../../common/services/auth.service';
import { UserService } from '../../common/services/user.service';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {
  @Input()
  newData = new User;
  userData: User;
  oldPassword = '';
  password = '';
  passwordRepeat = '';
  editPass = false;
  namePattern = '[a-zA-Z0-9]{1,20}$';
  passwordPattern = '.{3,20}$';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertwindow: AlertWindowsComponent,
    public dialogRef: MatDialogRef<UserEditComponent>,
    private httpStatusCodeService: HttpStatusCodeService,
    @Inject(MAT_DIALOG_DATA) public data: User) {
    this.userData = data;
  }

  ngOnInit() {
    this.newData.FirstName = this.userData.FirstName;
    this.newData.LastName = this.userData.LastName;
    this.newData.Id = this.userData.Id;
  }

  onEditPassClick() {
    this.editPass = true;
  }

  onSaveClick() {
    let message = '';
    if (this.userData.FirstName !== this.newData.FirstName || this.userData.LastName !== this.newData.LastName) {
      this.userService.updateUser(this.newData).subscribe(
        resp => {
          if (this.httpStatusCodeService.isOk(resp.status)) {
            this.dialogRef.close();
            this.data.FirstName = this.newData.FirstName;
            this.data.LastName = this.newData.LastName;
            this.alertwindow.openSnackBar('Your data successfully updated!', 'Ok');
            message = 'and data ';
          } else {
            this.alertwindow.openSnackBar('Some error occured, please try again later', 'Ok');
          }
        }
      );
    }
    if (this.editPass && this.password && this.password === this.passwordRepeat) {
      this.userService.updatePassword(this.password, this.oldPassword).subscribe(
        resp => {
          if (this.httpStatusCodeService.isOk(resp.status)) {
            this.alertwindow.openSnackBar(`Password ${message}successfully updated`, 'Ok');
          } else {
            this.alertwindow.openSnackBar('Some error occured, please try again later', 'Ok');
          }
        }
      );
    }
    if (this.editPass && this.password === '') {
      this.alertwindow.openSnackBar('Password can not be empty', 'Ok');
    } else if (this.password !== this.passwordRepeat) {
      this.alertwindow.openSnackBar('Passwords does not match. Please reenter new passwords.', 'Ok');
    } else {
      this.dialogRef.close();
    }
  }
}
