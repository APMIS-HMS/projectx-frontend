import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IStoreSummaryItem} from './store-summary-model';

/*This Component is a Dumb Component ie: it Displays only the data given to it which is an Interface*/
@Component({
    selector: 'store-summary',
    templateUrl: 'store-summary-component.html',
    styles : [`
        div.store-summary-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
            flex-wrap: wrap;
            min-height: 120px;
            /*background-color: #ececec;*/
            padding: 20px 0 20px 0;
        }
        .flex-2
        {
            flex : 2;
        }
    `]
})

export class StoreSummaryComponent implements OnInit {
    @Input() data: IStoreSummaryItem[]  = [];
    @Output() onItemDetailsClicked: EventEmitter< IStoreSummaryItem>  =  new EventEmitter<IStoreSummaryItem>();

    constructor() {
    }

    ngOnInit() {
    }

    onItemClickHandler( item : IStoreSummaryItem) {
        this.onItemDetailsClicked.emit(item);
    }
}