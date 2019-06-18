import { Component, OnInit, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Prescription, PrescriptionItem, Dispense, User, 
	Dispensed, DispensedArray, DispenseByNoprescription, DispenseItem,  } from '../../../../../models/index';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, PrescriptionService,
	DispenseService} from '../../../../../services/facility-manager/setup/index';


@Component({
  selector: 'app-walk-in-details',
  templateUrl: './walk-in-details.component.html',
  styleUrls: ['./walk-in-details.component.scss']
})
export class WalkInDetailsComponent implements OnInit {
  facility: Facility = <Facility>{};
  user: User = <User>{};
  store: any = {};
  prescription: any = {};
  prescriptions: any = [];
  dispenseId: string = '';
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilitiesService,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
		private _dispenseService: DispenseService,
  ) { }

  ngOnInit() {
    this._pharmacyEventEmitter.setRouteUrl('Walk In Details');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.store = this._locker.getObject('checkingObject');
		this.user = <User>this._locker.getObject('auth');

		this._route.params.subscribe(params => {
			this.dispenseId = params['id'];
    });
    
    this._getDispenseDetails();
  }

  private _getDispenseDetails() {
		this._dispenseService.get(this.dispenseId, {}).then(res => {
        if(!res.isPrescription) {      
          this.loading = false;
          this.prescription = res;
          this.prescriptions = res.nonPrescription.drugs;
        }
    }).catch(err => console.error(err));
	}

}
