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
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  private _hubConnection: HubConnection;
  
  mainTag = 'Learn with mentor';
  isLogin = false;
  isAdmin = false;
  fullName: string;
  userId: number;
  userImage = null;
  notificationCounter = "";
  notificationCounterLogic = 0;

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

        if (this._hubConnection == null) {
          this._hubConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44338/api/notifications', { accessTokenFactory: () => localStorage.getItem('userToken') })
            .build();
          this._hubConnection
            .start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection :('));
          this._hubConnection.on('Notify', () => {
            this.pushNotificationToArray();
          });
        }
      }
    });    
    
    this.authService.updateUserState();
  }

  pushNotificationToArray(){
  this.notificationService.getNotifications(this.userId).subscribe(response => {
    this.notifications = [];
    this.notificationCounterLogic = 0;
    response.forEach(element => {
      this.notifications.push(element);
      this.notificationCounterLogic++;
      this.notificationCounter = this.notificationCounterLogic.toString();
    });
  });
  }

  setUserPic(img: Image) {
    const extension = img.Name.split('.').pop().toLowerCase();
    const imgUrl = `data:image/${extension};base64,${img.Base64Data}`;
    this.userImage = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }
  
  clearCounter() {
    console.log(this.notificationCounter);
    this.notificationCounter = "";
    this.notificationCounterLogic = 0;
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
