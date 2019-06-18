import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventStateService {

    private eventSubject = new Subject<State>();
    eventState = this.eventSubject.asObservable();

    show() {
       return this.eventSubject.next(<State>{ show : true });
    }
    hide() {
        this.eventSubject.next(<State> { show : false });
    }
}

export interface State {
    show: boolean;
}
