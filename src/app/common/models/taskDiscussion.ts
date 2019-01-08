import { DateTime } from 'date-time-js';

export class TaskDiscussionMessage {
    Id: number;
    SenderId: number;
    TaskId: number;
    Text: string;
    DatePosted: DateTime;
}

export class TaskDiscussion {
    FullName: string;
    DiscussionMessage: TaskDiscussionMessage;
}