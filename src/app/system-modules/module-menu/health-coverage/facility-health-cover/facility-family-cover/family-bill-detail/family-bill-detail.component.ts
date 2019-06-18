import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core"; import { FormControl } from '@angular/forms';
import { BillingService, FacilitiesService, PatientService } from '../../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-family-bill-detail',
  templateUrl: './family-bill-detail.component.html',
  styleUrls: ['./family-bill-detail.component.scss']
})
export class FamilyBillDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshBills: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedBill;

  workspace: any;
  authCode_show = false;
  hmoPaymentType = [];
  bill: any = <any>{};
  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private facilitiesService: FacilitiesService,
    private patientService: PatientService) {
      console.log(this.selectedBill);
     }

  ngOnInit() {
    
  }

  confirmBill_onClick(bill) {
    this.bill = bill;
    this.bill.acceptFunction = true;
    this.systemModuleService.announceSweetProxy('You are about to confirm this bill', 'question', this);
  }

  sweetAlertCallback(result) {
    if (result.value) {
      this.hmoConfirmBill(this.bill.acceptFunction);
    }
  }

  hmoConfirmBill(isAccept: boolean) {
    console.log(this.selectedBill);
    if (isAccept) {
      const index = this.selectedBill.billItems.filter(x => x._id.toString() === this.bill._id.toString());
      index[0].covered.isVerify = true;
      index[0].covered.billAccepted = true;
      index[0].covered.verifiedAt = new Date();
      index[0].isBearerConfirmed = true;
      this.billingService.patch(this.selectedBill._id, this.selectedBill, {}).then(payload => {
        this.systemModuleService.announceSweetProxy('Service successfully cleared', 'success');
        this.refreshBills.emit(true);
      });
    } else {
      const index = this.selectedBill.billItems.filter(x => x._id.toString() === this.bill._id.toString());
      index[0].covered.isVerify = true;
      index[0].active = false;
      index[0].covered.billAccepted = false;
      index[0].covered.verifiedAt = new Date();
      this.billingService.patch(this.selectedBill._id, this.selectedBill, {}).then(payload => {
        console.log(payload);
        this.selectedBill = payload;
        const _selectedBill = JSON.parse(JSON.stringify(this.selectedBill));
        console.log(_selectedBill);
        delete _selectedBill._id;
        delete _selectedBill.coverFile;
        _selectedBill.patientId =  index[0].patientId;
        _selectedBill.billItems = index;
        _selectedBill.billItems[0].active = true;
        _selectedBill.billItems[0].covered = {};
        _selectedBill.billItems[0].covered.coverType = "wallet";
        _selectedBill.billItems[0].isBearerConfirmed = true;
        console.log(_selectedBill);
        this.billingService.create(_selectedBill).then(payload2 => {
          console.log(payload2);
          const indx = payload2.principalObject.paymentPlan.filter(x => x.planType === 'wallet');
          console.log(indx);
          if (indx.length > 0) {
            indx[0].bearerPersonId =  index[0].patientObject.personDetails._id;
            console.log(indx[0]);
          }

          this.patientService.patch(payload2.principalObject._id, payload2.principalObject, {}).then(payld => {console.log(payld); }, error => { console.log(error)});
          
        }, error => { console.log(error);});
        this.systemModuleService.announceSweetProxy('Service successfully cleared', 'success');
        this.refreshBills.emit(true);
        this.close_onClick();
      });
    }
  }

  declineBill_onClick(bill) {
    this.bill = bill;
    this.bill.acceptFunction = false;
    this.systemModuleService.announceSweetProxy('You are about to DECLINE this bill and geneate bill on PATIENT account', 'question', this)
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
