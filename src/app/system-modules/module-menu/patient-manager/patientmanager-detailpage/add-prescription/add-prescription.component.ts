import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem, User } from '../../../../../models/index';
import {
    FacilitiesService, ProductService, EmployeeService
} from '../../../../../services/facility-manager/setup/index';
import { Subject } from 'rxjs/Subject';
import { ISubscription } from 'rxjs/Subscription';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss']
})
export class AddPrescriptionComponent implements OnInit, OnDestroy {
	@Input() prescriptionItems: Prescription = <Prescription>{};
	@Output() prescriptionData: Prescription = <Prescription>{};
	@Input() isDispensed: Subject<any>;
	facility: Facility = <Facility>{};
	user: User = <User>{};
	employeeDetails: any = {};
	billShow: boolean = false;
	billShowId: number = 0;
	isExternal: boolean = false;
	loading: boolean = false;
	totalCost: number = 0;
	totalQuantity: number = 0;
	isDispensePage: boolean = false;
	isPrescriptionPage: boolean = false;
	storeId: string;
	subscription: ISubscription;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _productService: ProductService,
		private _employeeService: EmployeeService,
		private _facilityService: FacilitiesService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService,
	) {
		const url = this._router.url;
		// const url = window.location.href;
		if (!url.includes('patient-manager-detail')) {
			this.loading = true;
			this.isDispensePage = true;
		} else {
			this.isPrescriptionPage = true;
		}

		this._authFacadeService.getLogingEmployee().then((res: any) => {
			this.employeeDetails = res;
			if (!!res.storeCheckIn && res.storeCheckIn.length > 0) {
				const store = res.storeCheckIn.filter(x => x.isOn);
				this.storeId = store[0].storeId;
			}
		}).catch(err => { });

		this.subscription = this._employeeService.checkInAnnounced$.subscribe(res => {
			if (!!res && !!res.typeObject) {
				this.storeId = res.typeObject.storeId;
			}
		});
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.prescriptionItems.prescriptionItems = [];

		if (this.isDispensed !== undefined) {
			this.isDispensed.subscribe(event => {
				if (event) {
					this.totalCost = 0;
					this.totalQuantity = 0;
					this.prescriptionData = <Prescription>{};
					this.prescriptionItems.prescriptionItems = [];
				}
			});
		}
	}

	onClickDeleteItem(index: number, value: any) {
		const item = this.prescriptionItems.prescriptionItems[index];
		if(item.isBilled) {
			this.totalCost -= item.totalCost;
			this.totalQuantity -= item.quantity;
			this.prescriptionItems.prescriptionItems.splice(index, 1);
		} else {
			this.prescriptionItems.prescriptionItems.splice(index, 1);
		}
	}

	// On click is external checkbox
	onClickIsExternal(index, value, prescription) {
		this.isExternal = value;
		this.billShowId = index;
		this.prescriptionItems.prescriptionItems[index].initiateBill = !prescription.initiateBill;
		this.prescriptionItems.prescriptionItems[index].isExternal = value;
	}

	// Bill toggel button
	toggleBill(index, item) {
		// I have this here because the doctor might have billed this item from patient prescription.
		if (!item.isBilled) {
			this.billShow = !this.billShow;
			this.billShowId = index;
			this.prescriptionItems.index = index;
			this.prescriptionItems.totalCost = this.totalCost;
			this.prescriptionItems.totalQuantity = this.totalQuantity;
			if (this.prescriptionItems.prescriptionItems[index].isExternal) {
				this.prescriptionItems.prescriptionItems[index].isExternal = false;
			}
			this.prescriptionData = this.prescriptionItems;
		} else {
			this._systemModuleService.announceSweetProxy('The item selected has been billed!', 'error');
			// this._notification('Info', 'The item selected has been billed!');
		}
	}

	close_onClick(e) {
		this.billShow = false;
		this.totalCost = this.prescriptionData.totalCost;
		this.totalQuantity = this.prescriptionData.totalQuantity;
	}

	// Notification
	// private _notification(type: string, text: string): void {
	// 	this._facilityService.announceNotification({
	// 		users: [this.user._id],
	// 		type: type,
	// 		text: text
	// 	});
	// }

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
