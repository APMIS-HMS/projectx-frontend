import { CorporateFacilityService } from './../../services/facility-manager/setup/corporate-facility.service';
import { FacilitiesService } from './../../services/facility-manager/setup/facility.service';
import { Router } from '@angular/router';
import { FeatureModuleService } from './../../services/module-manager/setup/feature-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage/src/cool-local-storage';
import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthFacadeService {
	logingEmployee: any;
	access: any;
	loginUser: any;
	auth: any;

	private selectedFacility: any;
	constructor(
		private _socketService: SocketService,
		private _restService: RestService,
		private locker: CoolLocalStorage,
		private featureService: FeatureModuleService,
		private router: Router
	) {}

	setLogingEmployee(employee) {
		this.logingEmployee = employee;
	}

	setLoginUser(user) {
		this.loginUser = user;
	}

	setSelectedFacility(facility) {
		this.selectedFacility = facility;
	}

	setAuth(auth) {
		this.auth = auth;
	}

	getServerTime() {
		const self = this;
		return new Promise(function(resolve, reject) {
			self._socketService.authenticateService();
			self._socketService.getService('get-server-time').get(self.selectedFacility._id).then(
				(payload) => {
					if (payload !== undefined) {
						resolve(payload);
					} else {
						resolve(undefined);
					}
				},
				(error) => {}
			);
		});
	}

	getAuth() {
		return this.auth;
	}

	getSelectedFacility() {
		return this.selectedFacility;
	}

	getLogingEmployee() {
		let facId = this.locker.getObject('fac');
		let self = this;

		return new Promise(function(resolve, reject) {
			if (self.logingEmployee !== undefined) {
				resolve(self.logingEmployee);
			} else {
				self._socketService.authenticateService();
				const socket = self._socketService.getService('save-employee');
				socket.timeout = 10000;
				socket.get(facId).then(
					(payload) => {
						if (payload !== undefined) {
							const selectedFacility: any = self.locker.getObject('selectedFacility');
							self.logingEmployee = payload.selectedEmployee;
							self.setLogingEmployee(payload.selectedEmployee);
							self.setLoginUser(payload.selectedUser);
							if (
								self.logingEmployee !== undefined &&
								self.logingEmployee.workSpaces !== undefined &&
								selectedFacility.minorLocations !== undefined
							) {
								if (
									self.logingEmployee.workSpaces.length > 0 &&
									selectedFacility.minorLocations.length > 0
								) {
									const len = self.logingEmployee.workSpaces.length - 1;
									for (let index = 0; index <= len; index++) {
										const len2 = selectedFacility.minorLocations.length - 1;
										for (let index2 = 0; index2 <= len2; index2++) {
											if (self.logingEmployee.workSpaces[index].locations !== undefined) {
												if (self.logingEmployee.workSpaces[index].locations.length > 0) {
													const len3 =
														self.logingEmployee.workSpaces[index].locations.length - 1;
													for (let index3 = 0; index3 <= len3; index3++) {
														if (
															selectedFacility.minorLocations[index2]._id.toString() ===
															self.logingEmployee.workSpaces[index].locations[
																index3
															].minorLocationId.toString()
														) {
															self.logingEmployee.workSpaces[index].locations[
																index3
															].minorLocationObject =
																selectedFacility.minorLocations[index2];
														}
													}
												}
											}
										}
									}
								}
							}
							resolve(self.logingEmployee);
						} else {
							resolve(undefined);
						}
					},
					(error) => {
						reject(error);
					}
				);
			}
		});
	}

	getCheckedInEmployee(id, data) {
		const self = this;
		return new Promise(function(resolve, reject) {
			self._socketService.authenticateService();
			self._socketService.getService('employee-checkins').patch(id, data).then(
				(payload) => {
					const selectedFacility: any = self.locker.getObject('selectedFacility');
					if (payload !== null) {
						self.logingEmployee = payload;
						self.setLogingEmployee(payload);
						if (
							self.logingEmployee.workSpaces !== undefined &&
							selectedFacility.minorLocations !== undefined
						) {
							if (
								self.logingEmployee.workSpaces.length > 0 &&
								selectedFacility.minorLocations.length > 0
							) {
								const len = self.logingEmployee.workSpaces.length - 1;
								for (let index = 0; index <= len; index++) {
									const len2 = selectedFacility.minorLocations.length - 1;
									for (let index2 = 0; index2 <= len2; index2++) {
										if (self.logingEmployee.workSpaces[index].locations !== undefined) {
											if (self.logingEmployee.workSpaces[index].locations.length > 0) {
												const len3 = self.logingEmployee.workSpaces[index].locations.length - 1;
												for (let index3 = 0; index3 <= len3; index3++) {
													if (
														selectedFacility.minorLocations[index2]._id.toString() ===
														self.logingEmployee.workSpaces[index].locations[
															index3
														].minorLocationId.toString()
													) {
														self.logingEmployee.workSpaces[index].locations[
															index3
														].minorLocationObject =
															selectedFacility.minorLocations[index2];
													}
												}
											}
										}
									}
								}
							}
						}
						resolve(self.logingEmployee);
					} else {
						resolve(undefined);
					}
				},
				(error) => {}
			);
		});
	}
	getLogingUser(id?) {
		let facId = this.locker.getObject('fac');
		if (facId === null && id !== undefined) {
			facId = id;
		}
		let self = this;
		return new Promise(function(resolve, reject) {
			if (self.loginUser !== undefined) {
				resolve(self.loginUser);
			} else {
				self._socketService.authenticateService();
				self._socketService.getService('save-employee').get(facId).then(
					(payload) => {
						if (payload !== undefined) {
							self.setLogingEmployee(payload.selectedEmployee);
							self.setLoginUser(payload.selectedUser);
							self.setAuth({ data: payload.selectedUser });
							resolve(self.loginUser);
						} else {
							resolve(undefined);
						}
					},
					(error) => {}
				);
			}
		});
	}
	getUserAccessControls(force?, id?) {
		let facId = this.locker.getObject('fac'); // TO Do: check if fac is in user's facilityRoles
		let self = this;
		return new Promise(function(resolve, reject) {
			if (self.access !== undefined && self.access.modules !== undefined && !force) {
				resolve(self.access);
			} else {
				self.featureService.getUserRoles({ query: { facilityId: facId } }).then(
					(payload) => {
						self.access = payload;
						self.setSelectedFacility(payload.selectedFacility);
						resolve(self.access);
					},
					(error) => {}
				);
			}
		});
	}
}
