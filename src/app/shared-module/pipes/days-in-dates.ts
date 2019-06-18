import {Pipe, Injectable, PipeTransform } from '@angular/core';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Pipe({
    name: 'daysInCalenderDate'
  })

@Injectable()
export class DaysInDates implements PipeTransform {

    transform(startDate: string, endDate: string) {
        return differenceInCalendarDays(endDate, startDate);
    }
}
