import { Component, OnInit, Input, Inject } from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../common/services/task.service';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit {

  is_student = true;
  url_pattern = '^(http[s]?:\/\/){0,1}(www\.youtube\.com\/embed\/)[a-zA-Z0-9]{1,15}$';
  @Input()
  task: Task;
  constructor(public dialogRef: MatDialogRef<TaskEditorComponent>,
    private taskService: TaskService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Task) {
      this.task = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(description: string, youtubeUrl: string) {
    this.task.Description = description;
    this.task.Youtube_Url = youtubeUrl;
    /// you need to change to real user Id
    this.task.ModifierId = this.authService.getUserId(); // here
    this.taskService.updateTask(this.task).subscribe();
  }

  onDeleteClick() {
    this.taskService.deleteTask(this.task).subscribe();
  }

  ngOnInit() {}

}
