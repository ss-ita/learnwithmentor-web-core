import { Component, OnInit, ViewEncapsulation, HostListener, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatMenu, MatMenuTrigger } from '@angular/material';
import { SigninComponent } from '../auth/signin/signin.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { Router } from '@angular/router';
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
  isMentor = false;
  fullName: string;
  userId: number;
  userImage = null;
  notificationCounter = 0;
  notificationCounterDisabled = true;
  notificationInitialPull = true;

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
    this.dialog.open(SigninComponent, {});
  }

  openSignUpDialog() {
    this.dialog.open(SignupComponent, {});
  }

  logout() {
    this.authService.removeUserData();
    this.isLogin = false;
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe(authResponse => {
      this.isLogin = authResponse;
      if (this.isLogin) {
        this.isAdmin = this.authService.isAdmin();
        this.isMentor = this.authService.isMentor();
        this.userId = this.authService.getUserId();
        this.fullName = this.authService.getUserFullName();
        if (this.userImage == null) {
          this.userImage = '../../../assets/images/user-default.png';
        }
        this.userService.getImage(this.userId).subscribe(userResponse => {
          if (this.httpStatusCodeService.isOk(userResponse.status)) {
            this.setUserPic(userResponse.body);
          } 
        });
        if (this.notificationInitialPull) {
          this.pullNotifications();
          this.notificationInitialPull = false;
        }        
      } else {
        this.notificationInitialPull = true;
        this.userImage = null;
      }      
    });

    this.authService.updateUserState();
  }

  pullNotifications() {
    if (this.isLogin) {
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
  }

  clearCounter() {
    if (this.isLogin) {
      this.notificationCounter = 0;
      this.notificationCounterDisabled = true;
      this.notificationService.markNotificationsAsRead(this.userId).subscribe();
    }
  }

  setUserPic(img: Image) {
    const extension = img.Name.split('.').pop().toLowerCase();
    const imgUrl = `data:image/${extension};base64,${img.Base64Data}`;
    this.userImage = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
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
