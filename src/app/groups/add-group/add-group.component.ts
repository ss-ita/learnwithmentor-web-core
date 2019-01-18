import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GroupService } from '../../common/services/group.service';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { AuthService } from '../../common/services/auth.service';
import { Group } from '../../common/models/group';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  constructor(private authService: AuthService,
    private httpStatusCodeService: HttpStatusCodeService,
    public thisDialogRef: MatDialogRef<AddGroupComponent>,
    private alertwindow: AlertWindowsComponent,
    private groupService: GroupService,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.groups = data;
     }

  group: Group;
  groups: Group[];
  progresSpinerActive: boolean;
  errorMessage: string;
  errorMessageActive = false;
  groupName: string;
  someGroupCreated = false;

  ngOnInit() {
    this.thisDialogRef.disableClose = true;
    this.thisDialogRef.backdropClick().subscribe(result => {
      this.thisDialogRef.close(this.someGroupCreated);
  });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.thisDialogRef.close(this.someGroupCreated);
  }

  createGroup(form: NgForm) {
    this.progresSpinerActive = true;
    form.form.disable();
    const group = {
      Name: form.value.Name,
      MentorId: this.authService.getUserId(),
      MentorName: this.authService.getUserFullName()
    };
    this.groupService.createGroup(group as Group).subscribe(
      resp => {
        if (this.httpStatusCodeService.isOk(resp.status)) {
          this.someGroupCreated = true;
          this.alertwindow.openSnackBar("Succesfully created group: \"" + group.Name + "\".", 'Ok');

          this.group = {
            Id : resp.body,
            Name : group.Name,
            MentorId : group.MentorId,
            MentorName : group.MentorName
          }
          this.groups.push(this.group);
          this.thisDialogRef.close();
        }
      },
      error => {
        this.activateErrorMessage(error.error.Message);
        form.form.enable();
        this.progresSpinerActive = false;
      },
      () => {
        form.form.enable();
        this.progresSpinerActive = false;
      }
    );
  }

  activateErrorMessage(message: string): void {
    this.errorMessage = message;
    this.errorMessageActive = true;
  }

  onGroupNameChange() {
    if (this.errorMessageActive) {
      this.errorMessage = null;
      this.errorMessageActive = false;
    }
  }
}
