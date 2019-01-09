import { Component, OnInit, Input, Inject} from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../common/services/auth.service';
import { TaskEditorComponent } from '../task-editor/task-editor.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TaskSubmitorComponent } from '../task-submitor/task-submitor.component';
import { ConversationComponent } from '../conversation/conversation.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  safeURL;
  @Input()
  task: Task;
  hasPermisionsToComment = false;
  hasPermisionsToEdit = false;

  constructor(public dialogRef: MatDialogRef<TaskDetailComponent>,
    public dialog: MatDialog, 
    private authService: AuthService,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: Task) { 
      this.task = data; 
      this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(data.Youtube_Url);
    }
  ngOnInit() {
    if (this.authService.isAdmin() || this.authService.isMentor() || this.authService.isStudent()) {
      this.hasPermisionsToComment = true;
    }
    if (this.authService.isAdmin() || this.authService.isMentor()) {
      this.hasPermisionsToEdit = true;
    }
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(TaskEditorComponent, {
      data: this.task
    });
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
