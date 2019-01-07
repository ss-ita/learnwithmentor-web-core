import { Component, OnInit } from '@angular/core';
import { TaskDiscussion } from 'src/app/common/models/taskDiscussion';
import { TaskDiscussionService } from 'src/app/common/services/task-discussion.service';
import { Task } from '../../common/models/task';
import { UserService } from '../../common/services/user.service';
import { User } from 'src/app/common/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-discussion',
  templateUrl: './task-discussion.component.html',
  styleUrls: ['./task-discussion.component.css']
})

export class TaskDiscussionComponent implements OnInit {

  taskDiscussion: TaskDiscussion[] = null;
  users: string[] = null;
  isDiscussionLoaded = false;
  display='none';

  constructor(
    private taskDiscussionService: TaskDiscussionService) { }

  ngOnInit() {
  }

  GetTaskDiscussion(taskId:number)
  {
    this.taskDiscussionService.getTaskdiscussion(taskId).subscribe(
      responce => {               
          this.users = Object.keys(responce);
          this.taskDiscussion = Object.values(responce);
        });         
  }
}
