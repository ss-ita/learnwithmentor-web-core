import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailWindowComponent } from './task-detail-window.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailWindowComponent;
  let fixture: ComponentFixture<TaskDetailWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDetailWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
