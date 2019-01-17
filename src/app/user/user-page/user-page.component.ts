import { Component, OnInit } from '@angular/core';
import { User } from '../../common/models/user';
import { UserService } from '../../common/services/user.service';
import { Image } from '../../common/models/image';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { Statistics } from '../../common/models/statistics';
import { Email } from '../../common/models/email';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { AuthService } from '../../common/services/auth.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  displayedColumns = ['In Progress'];
  userId: number;
  userEmail: string;
  userData: User;
  userStats: Statistics[];
  users: string[];
  selectedFile: File = null;
  imageLoading = false;
  statisticsLoading = false;
  maxImageSize = 1024 * 1024;
  imageData = null;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private alertWindow: AlertWindowsComponent,
    private authService: AuthService,
    private httpStatusCodeService: HttpStatusCodeService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute) {

    }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = +params['id'];

      if (!this.userId) {
        this.userId = this.authService.getUserId();
      }

      this.userService.getUser(this.userId).subscribe(
        resp => {
          this.userData = resp;
          this.imageLoading = true;
          this.statisticsLoading = true;
          this.userService.getImage(this.userId).subscribe(
            response => {
              if (this.httpStatusCodeService.isOk(response.status)) {
                this.setUserPic(response.body);
              } else {
                this.imageData = '../../../assets/images/user-default.png';
              }
              this.imageLoading = false;
            }
          );

          if (this.userData.Role === 'Admin' || this.userData.Role === 'Mentor') {
            this.statisticsLoading = false;
          } else {
            this.userService.getRating().subscribe(
              r => {
                if (this.httpStatusCodeService.isOk(r.status)) {
                  this.userStats = Object.values(r.body);
                  this.users = Object.keys(r.body);
                }
                this.statisticsLoading = false;
              }
            );
          }
        }
      );
    });
  }

  onFileSelected(event) {
    const selected: File = event.target.files[0];
    if (selected == null) {
      return null;
    }
    if (selected.size > this.maxImageSize) {
      this.alertWindow.openSnackBar(`Image size must be less then ${this.maxImageSize / (1024 * 1024)} mb, please select another`, 'Ok');
    } else {
      this.selectedFile = selected;
      const reader = new FileReader();
      reader.onloadend = () => this.imageData = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  setUserPic(img: Image) {
    const extension = img.Name.split('.').pop().toLowerCase();
    const imgUrl = `data:image/${extension};base64,${img.Base64Data}`;
    this.imageData = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  onSaveClick() {
    this.userService.updateImage(this.userData.Id, this.selectedFile).subscribe(responce =>{
      this.selectedFile = null;
      if (this.httpStatusCodeService.isOk(responce.status)){
      this.alertWindow.openSnackBar('User image updated.', 'Ok');
      }
    });
  }

  onEditClick(): void {
    const dialofRef = this.dialog.open(UserEditComponent, {
      data: this.userData
    });
  }
}
