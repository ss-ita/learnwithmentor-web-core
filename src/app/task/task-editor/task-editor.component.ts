import { Component, OnInit, Input, Inject } from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../common/services/task.service';
import { AuthService } from '../../common/services/auth.service';
import { AlertWindowsComponent } from '../.././components/alert-windows/alert-windows.component';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit {

  is_student = true;
  url_pattern = '^((\s)|(http[s]?:\/\/){0,1}(((www\.youtube\.com\/watch[?]v=)([a-zA-Z0-9]*[?&_=]{0,1})*)|((youtu\.be\/)[a-zA-Z0-9]{1,20})))$';
  @Input()
  task: Task;
  constructor(public dialogRef: MatDialogRef<TaskEditorComponent>,
    private taskService: TaskService,
    private authService: AuthService,
    private alertWindow: AlertWindowsComponent,
    @Inject(MAT_DIALOG_DATA) public data: Task) {
      this.task = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(description: string, youtubeUrl: string) {
    this.task.Description = description;
    this.task.Youtube_Url = youtubeUrl;
    this.task.ModifierId = this.authService.getUserId();
    this.taskService.updateTask(this.task).subscribe();
    this.alertWindow.openSnackBar('Saved', 'Ok');
  }

  onDeleteClick() {
    this.taskService.deleteTask(this.task).subscribe();
  }

  ngOnInit() {}

}
