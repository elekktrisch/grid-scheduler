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
  events: Array<Event> = [
    {
      start: moment("2017-08-01", "YYYY-MM-DD"),
      end: moment("2017-08-02", "YYYY-MM-DD"),
      resource: {
        name: "Maule"
      },
      reservationHolder: {
        name: "Peter"
      }
    }
  ];

  rowHeight: number = 30;
  cellWidth: number = 10;
  hoursPerDay: number = 24;

  ngOnInit(): void {
    let headerIdx = 0;
    for (let i = 0; i < 50; i++) {
      this.rows[i] = [];
      for (let j = 0; j < 365 * 24; j++) {
        let now: Moment = moment();
        if (i === 0) {
          if (j % 24 === 0) {
            this.headers[headerIdx++] = {
              start: now.clone(),
              formatted: now.format("DD.MM.YYYY")
            };
          }
          now = now.add(1, "hours");
        }
        var hour = {
          start: now.clone(),
          events: []
        };
        this.events.forEach(event => {
          if (hour.start.isAfter(event.start)
            && hour.start.isBefore(event.end)) {
            hour.events.push(event);
          }
        });
        this.rows[i][j] = hour;
      }
    }
  }
}

class Event {
  start: Moment;
  end: Moment;
  resource: Resource;
  reservationHolder: ReservationHolder;
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
