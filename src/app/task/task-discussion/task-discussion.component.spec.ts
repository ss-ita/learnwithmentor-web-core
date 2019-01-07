import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDiscussionComponent } from './task-discussion.component';

describe('TaskDiscussionComponent', () => {
  let component: TaskDiscussionComponent;
  let fixture: ComponentFixture<TaskDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
