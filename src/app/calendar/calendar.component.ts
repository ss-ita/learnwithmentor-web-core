import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
    OnInit
  } from '@angular/core';
  import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
  } from 'date-fns';
  import { Subject } from 'rxjs';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView
  } from 'angular-calendar';
  import { AuthService } from '../common/services/auth.service';
  import { CalendarService } from '../common/services/calendar.service';

  const colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

  @Component({
    selector: 'app-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'calendar.component.html',
  styleUrls: ['./calendar.component.css']
  })

  export class CalendarComponent implements OnInit {
    @ViewChild('modalContent')
    modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];
    nameOfEvent: string = "justForTest";
    
    activeDayIsOpen = true;
    isLogin = false;
    isMentor = false;

    counterForEvent = false;

    constructor(
      private modal: NgbModal,
      private authService: AuthService,
      private calendarService: CalendarService
      ) {}

      ngOnInit() {
        this.authService.isAuthenticated().subscribe(authResponse => {
          this.isLogin = authResponse;
          if (this.isLogin) {
            this.isMentor = this.authService.isMentor();
          }
        });
      this.authService.updateUserState();
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      if (isSameMonth(date, this.viewDate)) {
        this.viewDate = date;
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
      }
    }

    eventTimesChanged({
      event,
      newStart,
      newEnd
    }: CalendarEventTimesChangedEvent): void {
      event.start = newStart;
      event.end = newEnd;
      this.refresh.next();
    }

    addEvent(): void {
      this.events.push({
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      })
      this.nameOfEvent = this.events[this.events.length].title;
      this.calendarService.sendCalendarEvent(this.nameOfEvent);
      if (this.events.length > 0) {
        this.counterForEvent = true;
      } else {
        this.counterForEvent = false;
      }
      this.refresh.next();
    }
  }

