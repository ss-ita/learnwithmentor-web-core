import { Component, OnInit, Input, Inject } from '@angular/core';
import { TaskDiscussion } from 'src/app/common/models/taskDiscussion';
import { TaskDiscussionService } from 'src/app/common/services/task-discussion.service';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { reference } from '@angular/core/src/render3';

@Component({
  selector: 'app-task-discussion',
  templateUrl: './task-discussion.component.html',
  styleUrls: ['./task-discussion.component.css']
})

export class TaskDiscussionComponent implements OnInit {

  @Input()
  task: Task;
  taskDiscussion: TaskDiscussion[] = null;
  users: string[] = null;
  isDiscussionLoaded = false;
  isMessages = true;
  isUpdated = true;
  message = '';

  constructor(public dialogRef: MatDialogRef<TaskDiscussionComponent>,
    private taskDiscussionService: TaskDiscussionService,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.task = data.task || {}; }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  GetTaskDiscussion(taskId: number) {
    this.isDiscussionLoaded = false;
    this.taskDiscussionService.getTaskdiscussion(taskId).subscribe(
      responce => {
          this.taskDiscussion = responce;
          this.isDiscussionLoaded = true;
          if(this.taskDiscussion.length === 0) {
            this.isMessages = false; } else {
              this.isMessages = true; }
        });           
  }

  onSendClick() {
    if(this.message.length > 0) {
      this.isUpdated = false;
      this.taskDiscussionService.postTaskDiscussionMessage(this.task.Id, this.message).subscribe(
        responce => {
          this.updateTaskDiscussion();
        });     
      this.message = '';     
    }
  }

  updateTaskDiscussion() {
    this.isUpdated = false;
    this.taskDiscussionService.getTaskdiscussion(this.task.Id).subscribe(
      responce => {               
        this.taskDiscussion = responce;
        this.isMessages = true;
        this.isUpdated = true;
    }); 
  }

  ngOnInit() {
    this.GetTaskDiscussion(this.task.Id);
  }
}
