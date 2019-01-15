import { Component, OnInit, Input, Inject } from '@angular/core';
import { TaskDiscussion } from 'src/app/common/models/taskDiscussion';
import { TaskDiscussionService } from 'src/app/common/services/task-discussion.service';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

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
  url = '';
  safeURL;
  isUrl = false;

  constructor(public dialogRef: MatDialogRef<TaskDiscussionComponent>,
    private taskDiscussionService: TaskDiscussionService,
    private _sanitizer: DomSanitizer,
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
          this.isMessages = this.taskDiscussion.length !== 0;
        });
  }

  onSendClick() {
    if (this.message.length > 0) {
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

  createUrl(url: string) {
    if (url.length > 43) {
      return url.slice(url.indexOf('=') + 1, url.indexOf('&'));
    } else if (url.length > 28) {
      return url.slice(url.indexOf('=') + 1);
    } else {
      return url.slice(url.indexOf('e') + 2);
    }
  }

  ngOnInit() {
    this.GetTaskDiscussion(this.task.Id);
    if (this.task.Youtube_Url != null && this.task.Youtube_Url !== '') {
      this.isUrl = true;
      this.url = this.createUrl(this.task.Youtube_Url);
      this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.url);
    }
  }
}
