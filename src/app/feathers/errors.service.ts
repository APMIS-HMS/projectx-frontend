import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
// Cool library to deal with errors: https://www.stacktracejs.com
// import * as StackTraceParser from 'error-stack-parser';
import { Router, NavigationError, Event } from '@angular/router';
@Injectable()
export class ErrorsService {
	constructor(private injector: Injector, private router: Router) {
		this.router.events.subscribe((event: Event) => {
			// Redirect to the ErrorComponent
			if (event instanceof NavigationError) {
				if (!navigator.onLine) {
					return;
				}
				// Redirect to the ErrorComponent
				this.log(event.error).subscribe((errorWithContext) => {
					// this.router.navigate([ '/error' ], { queryParams: errorWithContext }); // commented out by starday
				});
			}
		});
	}
	log(error) {
		console.log('error: ', error);
		// Log the error to the console
		console.error(error);
		// Send error to server
		// console.log('error: ', 1);
		const errorToSend = this.addContextInfo(error);
		return Observable.of({ error: error }); // this was done by me starday
		// return fakeHttpService.post(errorToSend); // commented out by starday, to do when ready by starday
	}
	addContextInfo(error) {
		// All the context details that you want (usually coming from other services; Constants, UserService...)
		const name = error.name || null;
		const appId = 'shthppnsApp';
		const user = 'ShthppnsUser';
		const time = new Date().getTime();
		const id = `${appId}-${user}-${time}`;
		const location = this.injector.get(LocationStrategy);
		const url = location instanceof PathLocationStrategy ? location.path() : '';
		const status = error.status || null;
		const message = error.message || error.toString();
		// const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
		// const errorToSend = { name, appId, user, time, id, url, status, message, stack };
		const errorToSend = { name, appId, user, time, id, url, status, message };
		return errorToSend;
	}
}
