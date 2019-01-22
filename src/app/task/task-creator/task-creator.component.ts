import { Component, OnInit, Input, Inject } from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../common/services/task.service';
import { AuthService } from '../../common/services/auth.service';
import { Section } from 'src/app/common/models/sections';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.css']
})
export class TaskCreatorComponent implements OnInit {
  selectedPriority;
  selectedSection;
  sections: Section[];
  task: Task;
  @Input()
  planId: number;
  @Input()
  tasks: Task[];
  constructor(private taskService: TaskService, private authService: AuthService) { }

  onSaveClick(name: string, description: string) {
    this.task = new Task();
    this.task.Description = description;
    this.task.Name = name;
    this.task.CreatorId = this.authService.getUserId();
    this.task.PlanTaskId = this.planId;
    this.task.CreateDate = new Date(Date.now());
    this.task.Private = false;
    
    if (this.planId == null) {
      this.taskService.createTask(this.task).subscribe();
    } else {
      this.taskService.createTask(this.task, this.selectedPriority, this.selectedSection).subscribe();
      this.tasks.push(this.task);
    }
  }
  ngOnInit() {
    this.taskService.getTasksInSections(this.planId).subscribe(resp => {
      this.sections = resp;
    })
  }
}
