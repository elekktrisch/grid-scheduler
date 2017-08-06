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

  drawing(event: any) {
    event.preventDefault();

    if (this.drawingEvent) {
      this.updateDrawingEvent(this.drawingEvent, event);
    }
  }

  eventAction(event: any): void {
    if(event) event.preventDefault();

    if (this.drawingEvent) {
      const e = this.clearDrawingEvent();
      if (event && e) {
        this.updateDrawingEvent(e, event);
        this.events.push(e);
      }
    } else if (event) {
      const coordinates = { x: event.offsetX, y: event.offsetY };
      let start = this.headers[0].start.clone().add(coordinates.x / this.cellWidth, "hours");
      let resourceIndex = Math.floor(coordinates.y / this.rowHeight) - 1;
      this.drawingEvent = {
        start: start.clone().minute(this.floor15(start.minute())).second(0),
        startCell: moment.duration(start.diff(this.calendarStart)).asHours(),
        durationHours: 1,
        resourceIndex: resourceIndex
      };
    }
  }

  private floor15(minutes: number) {
    return Math.round(minutes / 15) * 15;
  }

  private updateDrawingEvent(e: Event, event: any) {
    const coordinates = { x: event.offsetX, y: event.offsetY };
    var end = this.headers[0].start.clone().add(coordinates.x / this.cellWidth, "hours");
    var durationHours = Math.round(moment.duration(end.diff(e.start)).asHours() * 4) / 4;
    if (durationHours > 0) {
      e.durationHours = durationHours;
    }
  }

  eventClicked(event: Event): void {
    console.log("event", event);
    window.alert("clicked event " + JSON.stringify(event));
  }

  clearDrawingEvent(): Event {
    const e = this.drawingEvent;
    if (this.drawingEvent) {
      this.events.push(this.drawingEvent);
      delete this.drawingEvent;
    }

    return e;
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
