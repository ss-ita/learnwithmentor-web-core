import { DateTime } from 'date-time-js';

export class TaskDiscussion {
    Id: number;
    SenderId: number;
    TaskId: number;
    Text: string;
    DatePosted: DateTime;
}