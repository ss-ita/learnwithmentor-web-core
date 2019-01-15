import { TestBed } from '@angular/core/testing';

import { TaskDiscussionService } from './task-discussion.service';

describe('TaskDiscussionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskDiscussionService = TestBed.get(TaskDiscussionService);
    expect(service).toBeTruthy();
  });
});
