import {Component} from '@angular/core';
import {Moment} from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  rows: Array<Array<Hour>> = [];
  headers: Array<Hour> = [];
  events: Array<Event> = [];

  rowHeight: number = 30;
  cellWidth: number = 10;
  hoursPerDay: number = 24;
  drawingEvent: Event;
  now: Moment;
  calendarStart: Moment;

  ngOnInit(): void {
    this.now = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD");
    this.calendarStart = this.now.clone();
    let headerIdx = 0;
    for (let i = 0; i < 20; i++) {
      this.rows[i] = [];
      for (let j = 0; j < 365 * 24; j++) {
        if (i === 0) {
          if (j % 24 === 0) {
            this.headers[headerIdx++] = {
              start: this.now.clone(),
              formatted: this.now.clone().format("DD.MM.YYYY")
            };
          }
          this.now = this.now.add(1, "hours");
        }
        var hour = {
          start: this.now.clone(),
          events: []
        };
        this.events.forEach(event => {
          if (hour.start.isAfter(event.start)
            && hour.start.isBefore(event.start.clone().add(event.durationHours, "hours"))) {
            hour.events.push(event);
          }
        });
        this.rows[i][j] = hour;
      }
    }
  }

  dragStart(event: any): void {
    event.preventDefault();

    if (this.drawingEvent) {
      this.clickedNewEvent();
    } else {
      const coordinates = { x: event.offsetX, y: event.offsetY };
      var start = this.headers[0].start.clone().add(coordinates.x / this.cellWidth, "hours");
      var resourceIndex = Math.round(coordinates.y / this.rowHeight) - 1;
      this.drawingEvent = {
        start: start,
        startCell: moment.duration(start.diff(this.calendarStart)).asHours(),
        durationHours: 1,
        resourceIndex: resourceIndex
      };
    }
  }

  drawing(event: any) {
    event.preventDefault();
    if (this.drawingEvent) {
      this.updateDrawingEvent(this.drawingEvent, event);
    }
  }

  dragEnd(event: any): void {
    if (this.drawingEvent) {
      if (event) {
        const e = this.drawingEvent;
        delete this.drawingEvent;
        this.updateDrawingEvent(e, event);
        this.events.push(e);
      } else {
        this.clickedNewEvent();
      }
    }
  }

  private updateDrawingEvent(e: Event, event: any) {
    const coordinates = { x: event.offsetX, y: event.offsetY };
    var end = this.headers[0].start.clone().add(coordinates.x / this.cellWidth, "hours");
    var durationHours = moment.duration(end.diff(e.start)).asHours();
    if (durationHours > 0) {
      e.durationHours = durationHours;
    }
  }

  eventClicked(event: Event): void {
    console.log("event", event);
  }

  clickedNewEvent(): void {
    if (this.drawingEvent) {
      this.events.push(this.drawingEvent);
      delete this.drawingEvent;
    }
  }
}

interface Event {
  start: Moment;
  startCell: number;
  durationHours: number;
  resourceIndex: number;
  reservationHolder?: ReservationHolder;
}

class Resource {
  name: string;
}

class ReservationHolder {
  name: string;
}

interface Hour {
  start: Moment;
  formatted?: string;
  events?: Array<Event>;
}
