import { EventStateService, State } from './../../../../../../../services/tools/event-state.service';
import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-search-suggestion',
  templateUrl: './search-suggestion.component.html',
  styleUrls: ['./search-suggestion.component.scss']
})
export class SearchSuggestionComponent implements OnInit, OnDestroy {
showList: boolean;
@Input() searchedList;
showProduct = true;
@Output() onSelectedItem = new EventEmitter();
stateSubscription: Subscription;
  constructor(private eventService: EventStateService) { }

  ngOnInit() {
    this.stateSubscription = this.eventService.eventState.subscribe((state: State) => {
      this.showList = state.show;
  });

  }
  setSelectedItem(data) {
    this.onSelectedItem.emit(data);
  }
  ngOnDestroy() {
    if (this.stateSubscription !== null) {
      this.stateSubscription.unsubscribe();
    }
  }
}
