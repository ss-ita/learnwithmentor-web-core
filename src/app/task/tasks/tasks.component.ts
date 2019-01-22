import { Component, OnInit, Optional, Input } from '@angular/core';
import { TaskService } from '../../common/services/task.service';
import { Task } from '../../common/models/task';
import { Plan } from '../../common/models/plan';
import { PlanService } from '../../common/services/plan.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @Input()
  planId: number;
  tasks: Task[];
  selectedTask: Task;
  plan: Plan;
  constructor(private taskService: TaskService, private planService: PlanService) {
  }
  ngOnInit() {
    if (this.planId != null) {
      this.planService.getPlan(this.planId).subscribe((u: Plan) => this.plan = u);
      this.taskService.getTasks(this.planId).subscribe((data: Task[]) => this.tasks = data);
    } else {
      this.taskService.getTasks().subscribe((data: Task[]) => {
        this.tasks = data;
      });
    }
  }
  onSelect(task: Task): void {
    this.selectedTask = task;
  }
}
