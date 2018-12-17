import { Component, OnInit, ViewEncapsulation, HostListener, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatMenu, MatMenuTrigger } from '@angular/material';
import { SigninComponent } from '../auth/signin/signin.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../common/services/auth.service';
import { UserService } from '../common/services/user.service';
import { NotificationService } from '../common/services/notification.service';
import { HttpStatusCodeService } from '../common/services/http-status-code.service';
import { Image } from '../common/models/image';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  
  mainTag = 'Learn with mentor';
  isLogin = false;
  isAdmin = false;
  fullName: string;
  userId: number;
  userImage = null;
  notificationCounter = 0;
  notificationCounterDisabled = true;

  administrationTooltip = "Admin tools";
  groupsTooltip = "Groups";
  notificationsTooltip = "Notifications";
  logOutTooltip = "Log out";

  notifications = [];

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private httpStatusCodeService: HttpStatusCodeService,
    public elementRef: ElementRef) {
  }

  openSignInDialog() {
    const dialogRef = this.dialog.open(SigninComponent, {});
  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignupComponent, {});
  }

  logout() {
    this.authService.removeUserData();
    this.isLogin = false;
    this.router.navigate(['/']);
  }

  ngOnInit() {
    const jwt = new JwtHelperService();
    this.authService.isAuthenticated().subscribe(val => {
      this.isLogin = val;
      this.fullName = this.authService.getUserFullName();
      this.isAdmin = this.authService.isAdmin();
      this.userId = this.authService.getUserId();
      if (this.isLogin) {
        this.userService.getImage(this.userId).subscribe(response => {
          if (this.httpStatusCodeService.isOk(response.status)) {
            this.setUserPic(response.body);
          } else {
            this.userImage = '../../../assets/images/user-default.png';
          }
        });
      }
    });

    this.authService.updateUserState();
  }

  pullNotifications(){
    this.notificationService.getNotifications(this.userId).subscribe(response => {
      this.notifications = [];
      this.notificationCounter = 0;
      response.forEach(element => {
        this.notifications.push(element);
        if (!element.IsRead) {
          this.notificationCounter++;
        }
      });
      if (this.notificationCounter > 0) {
        this.notificationCounterDisabled = false;
      }
      else {
        this.notificationCounterDisabled = true;
      }
    });
  }

  setUserPic(img: Image) {
    const extension = img.Name.split('.').pop().toLowerCase();
    const imgUrl = `data:image/${extension};base64,${img.Base64Data}`;
    this.userImage = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }
  
  clearCounter() {
    this.notificationCounter = 0;
    this.notificationCounterDisabled = true;
    this.notificationService.markNotificationsAsRead(this.userId).subscribe();
  }

  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      if (this.isLogin){
        const componentPosition = this.elementRef.nativeElement.offsetTop
        const scrollPosition = window.pageYOffset

        if (scrollPosition >= componentPosition) {
          this.menuTrigger.closeMenu();
        }
      }
    }
}
