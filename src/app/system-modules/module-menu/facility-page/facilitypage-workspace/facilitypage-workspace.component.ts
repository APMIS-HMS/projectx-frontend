import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import {
	FacilitiesService,
	EmployeeService,
	WorkSpaceService
} from '../../../../services/facility-manager/setup/index';
import { Facility, WorkSpace } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocationService } from '../../../../services/module-manager/setup/location.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-facilitypage-workspace',
	templateUrl: './facilitypage-workspace.component.html',
	styleUrls: [ './facilitypage-workspace.component.scss' ]
})
export class FacilitypageWorkspaceComponent implements OnInit {
	employee: any;

	del_workspace = false;
	globalDialog = false;

	createWorkspace = false;
	searchControl: FormControl = new FormControl();
	selectedFacility: Facility = <Facility>{};
	workSpaces: WorkSpace[] = [];

	employees: any[] = [];

	deleteWorkspace;
	deleteLocation;

	selectedLocationId;

	public title = 'Popover title';
	public message = 'Popover description';
	public confirmClicked = false;
	public cancelClicked = false;

	gdTitle = 'Delete Workspace';
	gdItem = '';
	gdComponent = 'Workspace';

	selectedWorkSpace: any = <any>{};
	// loadIndicatorVisible = true;
	constructor(
		private locker: CoolLocalStorage,
		private locationService: LocationService,
		private employeeService: EmployeeService,
		private route: ActivatedRoute,
		private workspaceService: WorkSpaceService,
		public facilityService: FacilitiesService,
		private systemModule: SystemModuleService
	) {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.workspaceService.listenerCreate.subscribe((payload) => {
			this.getWorkSpace();
		});
		this.workspaceService.listenerUpdate.subscribe((payload) => {
			this.getWorkSpace();
		});
	}

	ngOnInit() {
		// this.route.data.subscribe(data => {
		//   data['workSpaces'].subscribe((payload) => {
		//     this.workSpaces = payload;
		//   });
		// });
		this.getWorkspaces();
	}
	getWorkSpace() {
		this.workspaceService.find({ query: { facilityId: this.selectedFacility._id, $limit: 40 } }).then((payload) => {
			const result = payload.data.filter((x) => x.isActive === true || x.isActive === undefined);
			result.forEach((itemi: WorkSpace, i) => {
				itemi.locations = itemi.locations.filter((x) => x.isActive === true);
			});
			this.workSpaces = result;
		});
	}

	getWorkspaces() {
		this.workspaceService
			.findworkspaces({
				query: {
					facilityId: this.selectedFacility._id
				}
			})
			.then((payload) => {
				// this.workSpaces = payload;
				this.employees = payload;
			});
	}
	deleteLocation_popup(locationId, workspace) {
		this.deleteLocation = true;
		this.deleteWorkspace = true;
		let text = 'You are about to delete this location from employee workspace';
		this.systemModule.announceSweetProxy(text, 'question', this);

		this.selectedLocationId = locationId;
		this.selectedWorkSpace = workspace;
		// this.gdItem = workSpace.employeeObject.employeeDetails.lastName + ' ' + workSpace.employeeObject.employeeDetails.firstName;
		// this.globalDialog = true;
	}
	removeLocation(id, workspace) {
		this.systemModule.on();
		let filteredLocation = workspace.locations.filter((x) => x._id == id);
		let workspaceI = workspace.locations.indexOf(filteredLocation[0]);
		if (workspaceI > -1) {
			workspace.locations[workspaceI].isActive = false;
		}

		this.workspaceService
			.patch(
				workspace._id,
				{
					locations: workspace.locations
				},
				{}
			)
			.then((payload) => {
				this.systemModule.off();
				this.systemModule.announceSweetProxy('Location successfully Deleted', 'success');
			})
			.catch((err) => {
				this.systemModule.off();
				this.systemModule.announceSweetProxy('Something went wrong! Please try again', 'error');
			});
	}
	deletion_popup(workspace) {
		this.deleteLocation = false;
		this.deleteWorkspace = true;
		let text =
			'You are about to delete ' +
			workspace.employee.personDetails.lastName.toUpperCase() +
			' ' +
			workspace.employee.personDetails.firstName.toUpperCase() +
			' from workspace';
		this.systemModule.announceSweetProxy(text, 'question', this);

		this.selectedWorkSpace = workspace;
	}

	removeWorkspace() {
		this.workspaceService
			.patch(
				this.selectedWorkSpace._id,
				{
					isActive: false
				},
				{}
			)
			.then((payload) => {
				this.systemModule.announceSweetProxy('Workspace was successfully Deleted', 'success');
				this.getWorkspaces();
				this.close_onClick(true);
			});
	}

	sweetAlertCallback(result) {
		if (result.value) {
			if (this.deleteLocation === true) {
				this.removeLocation(this.selectedLocationId, this.selectedWorkSpace);
			} else if (this.deleteWorkspace === true) {
				this.removeWorkspace();
			}
		}
	}

	createWorkspace_pop() {
		this.createWorkspace = true;
	}
	close_onClick(e) {
		this.createWorkspace = false;
		this.globalDialog = false;
	}
	getActiveWorkSpaceCount(workSpace: WorkSpace) {
		return workSpace.locations.filter((x) => x.isActive === true).length;
	}
	getActiveWorkSpaceLength(workspaces) {
		let wsc = workspaces.filter((x) => x.isActive === true);
		let wscLen = wsc.length;
		return wscLen;
	}
	delete_onClick($event) {
		if ($event) {
			this.selectedWorkSpace.isActive = false;
			const update$ = Observable.fromPromise(this.workspaceService.update(this.selectedWorkSpace));
			const get$ = Observable.fromPromise(
				this.workspaceService.find({ query: { facilityId: this.selectedFacility._id, $limit: 40 } })
			);

			Observable.forkJoin([ update$, get$ ]).subscribe(
				(results: any) => {
					const result = results[1].data.filter((x) => x.isActive === true);
					result.forEach((itemi: WorkSpace, i) => {
						itemi.locations = itemi.locations.filter((x) => x.isActive === true);
					});
					this.workSpaces = result;
					this.globalDialog = false;
				},
				(error) => {
					this.globalDialog = false;
				}
			);
		}
	}
	newWorkspace_onClick(employee?) {
		this.employee = employee;
		if (!!employee) {
			this.employee = employee;
		}
		this.createWorkspace = true;
	}
}
