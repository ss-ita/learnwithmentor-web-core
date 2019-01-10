import { Component, OnInit, Input, Inject} from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../common/services/auth.service';
import { TaskEditorComponent } from '../task-editor/task-editor.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TaskSubmitorComponent } from '../task-submitor/task-submitor.component';
import { ConversationComponent } from '../conversation/conversation.component';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  safeURL;
  @Input()
  task: Task;
  url = '';
  isUrl = false;
  hasPermisionsToComment = false;
  hasPermisionsToEdit = false;

  constructor(public dialogRef: MatDialogRef<TaskDetailComponent>,
    public dialog: MatDialog,
    private authService: AuthService,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: Task) {
      this.task = data;
  }

  ngOnInit() {
    if (this.authService.isAdmin() || this.authService.isMentor() || this.authService.isStudent()) {
      this.hasPermisionsToComment = true;
    }
    if (this.authService.isAdmin() || this.authService.isMentor()) {
      this.hasPermisionsToEdit = true;
    }
    if(this.task.Youtube_Url != null && this.task.Youtube_Url != "") {
      this.isUrl = true;
      this.url = this.createUrl(this.task.Youtube_Url);
      this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.url);
    }
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(TaskEditorComponent, {
      data: this.task
    });
  }

  createUrl(url: string) {
    if (url.length > 43) {
      return url.slice(url.indexOf('=') + 1, url.indexOf('&'));
    } else if (url.length > 28) {
      return url.slice(url.indexOf('=') + 1);
    } else {
      return url.slice(url.indexOf('e') + 2);
    }
  }

  openConversationDialog(): void {
    const dialogRef = this.dialog.open(ConversationComponent, {
      width: '600px',
      data: { task: this.task, userTask: this }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
