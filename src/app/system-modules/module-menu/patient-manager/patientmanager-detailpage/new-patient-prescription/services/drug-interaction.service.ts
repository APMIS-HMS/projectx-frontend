import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DrugInteractionService {
	private interactionSource = new BehaviorSubject([]);
	currentInteraction = this.interactionSource.asObservable();

	constructor() {}

	checkDrugInteractions(drugs: any) {
		this.interactionSource.next(drugs);
	}
}
