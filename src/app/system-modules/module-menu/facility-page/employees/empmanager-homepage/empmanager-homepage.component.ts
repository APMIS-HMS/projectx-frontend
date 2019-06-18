import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, OnChanges, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	FacilitiesService,
	EmployeeService,
	PersonService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { IPagerSource } from '../../../../../core-ui-modules/ui-components/PagerComponent';
@Component({
	selector: 'app-empmanager-homepage',
	templateUrl: './empmanager-homepage.component.html',
	styleUrls: [ './empmanager-homepage.component.scss' ]
})
export class EmpmanagerHomepageComponent implements OnInit, OnDestroy, OnChanges {
	@Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
	@Output() empDetail: EventEmitter<string> = new EventEmitter<string>();
	@Input() resetData: Boolean;
	@Output() resetDataNew: EventEmitter<Boolean> = new EventEmitter<Boolean>();

	facility: any = <any>{};
	employees: Employee[] = [];
	searchControl = new FormControl();

	index = 0;
	inde: any = [];
	limit = 100;
	total = 0;
	showLoadMore: Boolean = false;
	loadIndicatorVisible = false;
	/* Added the new Data pager Component*/
	paginationObj: IPagerSource = { currentPage: 0, pageSize: 10, totalRecord: 0, totalPages: 0 };

	constructor(
		private employeeService: EmployeeService,
		private facilityService: FacilitiesService,
		private personService: PersonService,
		private locker: CoolLocalStorage,
		private toast: ToastsManager,
		private authFacadeService: AuthFacadeService,
		private router: Router,
		private route: ActivatedRoute,
		private systemService: SystemModuleService
	) {
		this.employeeService.listner.subscribe((payload) => {
			this.employees = [];
			this.getEmployees();
		});
		this.employeeService.createListener.subscribe((payload) => {
			// this.employees = [];
			this.paginationObj.currentPage = 0;
			this.getEmployees();
		});

		const away = this.searchControl.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.switchMap((term: Employee[]) =>
				this.employeeService.searchEmployee(this.facility._id, this.searchControl.value, true)
			);

		away.subscribe((payload: any) => {
			this.employees = payload.body;
		});
	}

	ngOnChanges() {
		// if (this.resetData === true) {
		//   this.index = 0;
		//   this.getEmployees();
		//   this.showLoadMore = true;
		// }
	}

	ngOnInit() {
		this.authFacadeService.getLogingEmployee().then((payload: any) => {});
		/* this.route.data.subscribe(data => {
      data['employees'].subscribe((payload) => {
        if (payload !== null) {
          this.total = payload.total;
          this.employees = payload.data;
          this.inde[0] = payload.index;
          if (this.total <= this.employees.length) {
            this.showLoadMore = false;
          } else {
            this.index = 1;
            this.showLoadMore = true;
          }
        }
      });
      this.index = this.inde[0];
    }); */
		this.pageInView.emit('Employee Manager');
		this.facility = <Facility>this.locker.getObject('selectedFacility');
		this.getEmployees();
	}
	searchEmployees(searchText: string) {
		this.searchControl.setValue(searchText);
	}
	filterByDepartment(department: string) {
		this.getByDepartment(department);
	}
	navEpDetail(val) {
		this.router.navigate([ '/dashboard/facility/employees', val._id ]).then((result) => {
			// this.employeeService.announceEmployee(val);
			this.locker.setObject('selectedEmployee', val);
		});
	}
	getByDepartment(departmentId: string) {
		this.loadIndicatorVisible = true;
		this.systemService.on();
		this.employeeService
			.find({
				query: {
					facilityId: this.facility._id,
					departmentId: departmentId,
					showbasicinfo: true,
					$limit: this.paginationObj.pageSize
				}
			})
			.then(
				(payload) => {
					this.paginationObj.totalRecord = payload.total;
					this.employees = payload.data;
					this.loadIndicatorVisible = false;
				},
				(error) => {
					this.loadIndicatorVisible = false;
					this.systemService.off();
				}
			)
			.catch((err) => {
				this.systemService.off();
			});
	}
	getByUnit(departmentId: string, unitId: string) {
		this.loadIndicatorVisible = true;
		this.employeeService
			.find({
				query: {
					facilityId: this.facility._id,
					departmentId: departmentId,
					showbasicinfo: true,
					$limit: this.paginationObj.pageSize,
					units: unitId
				}
			})
			.then(
				(payload) => {
					this.paginationObj.totalRecord = payload.total;
					this.employees = payload.data;
					this.loadIndicatorVisible = false;
				},
				(error) => {
					this.loadIndicatorVisible = false;
				}
			);
	}
	getEmployees() {
		this.systemService.on();
		this.loadIndicatorVisible = true;
		this.employeeService
			.find({
				query: {
					facilityId: this.facility._id,
					$limit: this.paginationObj.pageSize,
					$skip: this.paginationObj.currentPage * this.paginationObj.pageSize
				}
			})
			.then(
				(payload) => {
					this.paginationObj.totalRecord = payload.total;
					if (this.resetData !== true) {
						this.employees = payload.data;
					} else {
						this.resetData = false;
						this.resetDataNew.emit(this.resetData);
						this.employees = payload.data;
					}
					if (this.total <= this.employees.length) {
						this.showLoadMore = false;
					}
					this.loadIndicatorVisible = false;
					this.systemService.off();
				},
				(error) => {
					this.loadIndicatorVisible = false;
					this.systemService.off();
				}
			);
		this.index++;
	}
	contactEmployees(employeeData: Employee[]) {
		const newEmployees: Employee[] = [];
		this.employees.forEach((employee, i) => {
			let found = false;
			let newEmp: Employee = <Employee>{};
			employeeData.forEach((empData, j) => {
				newEmp = empData;
				if (employee._id === empData._id) {
					employee = empData;
					found = true;
				}
			});
			if (!found) {
				newEmployees.push(newEmp);
			}
		});
		this.employees = this.employees.concat(newEmployees);
	}
	loadMore() {
		this.getEmployees();
	}

	gotoPage(index: number) {
		this.paginationObj.currentPage = index;
		this.getEmployees();
	}
	ngOnDestroy() {}
}
