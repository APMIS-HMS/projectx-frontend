import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { SystemModuleService } from '../module-manager/setup/system-module.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorsService } from 'app/feathers/errors.service';

@Injectable()
export class ApmisErrorHandler extends ErrorHandler {
	constructor(
		private systemModuleService: SystemModuleService,
		// Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
		private injector: Injector //
	) {
		super();
	}

	// handleError(err) {
	// 	this.systemModuleService.off();
	// 	// const date = new Date();
	// 	// console.error('There was an error:', {
	// 	// 	timestamp: date.toISOString(),
	// 	// 	'stack-track': err.stack,
	// 	// 	message: err.message,
	// 	// 	zone: err.zone,
	// 	// 	task: err.task
	// 	// });
	// }

	handleError(error: Error | HttpErrorResponse) {
		this.systemModuleService.off();
		// const notificationService = this.injector.get(NotificationService);
		const errorsService = this.injector.get(ErrorsService);
		const router = this.injector.get(Router);
		if (error instanceof HttpErrorResponse) {
			// Server or connection error happened
			if (!navigator.onLine) {
				// Handle offline error
				// return notificationService.notify('No Internet Connection');
			} else {
				// Handle Http Error (error.status === 403, 404...)
				errorsService.log(error).subscribe();
				// return notificationService.notify(`${error.status} - ${error.message}`);
			}
		} else {
			// Handle Client Error (Angular Error, ReferenceError...)
			// router.navigate([ '/error' ], { queryParams: { error: error } });

			errorsService.log(error).subscribe((errorWithContextInfo) => {
				// router.navigate([ '/error' ], { queryParams: errorWithContextInfo });
			});
		}
		// Log the error anyway
		console.error('It happens: ', error);
	}
}
