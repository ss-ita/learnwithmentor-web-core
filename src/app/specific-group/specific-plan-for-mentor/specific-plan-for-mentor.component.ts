import { Input, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersWithTasks } from '../../specific-group/specific-plan/specific-plan.component';
import { UserTask } from '../../common/models/userTask';

@Component({
  selector: 'app-specific-plan-for-mentor',
  templateUrl: './specific-plan-for-mentor.component.html',
  styleUrls: ['./specific-plan-for-mentor.component.css']
})
export class SpecificPlanForMentorComponent implements OnInit {

  @Input() users: UsersWithTasks[];
  @Output() selectedUser = new EventEmitter<number>();
  @Input() isLoadedUsers: boolean;

  selectUser(index: number) {
    this.selectedUser.emit(index);
  }

  getState (state: string) {
    if (state.toLowerCase() === 'p') {
      return 'InProgress';
    }
    if (state.toLowerCase() === 'r') {
      return 'Rejected';
    }
    if (state.toLowerCase() === 'a') {
      return 'Approved';
    }
    return 'Done';
  }
  constructor() {
  }

  ngOnInit() {
  }
}
