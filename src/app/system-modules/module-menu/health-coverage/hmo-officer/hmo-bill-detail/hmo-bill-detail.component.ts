import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BillingService, FacilitiesService, PatientService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-hmo-bill-detail',
  templateUrl: './hmo-bill-detail.component.html',
  styleUrls: ['./hmo-bill-detail.component.scss']
})
export class HmoBillDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshBills: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedBill;

  workspace: any;
  authCode_show = false;
  hmoPaymentType = [];
  hmoTypeControl: FormControl = new FormControl();
  authCodeControl: FormControl = new FormControl();
  priceControl: FormControl = new FormControl();
  bill: any = <any>{};
  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private facilitiesService: FacilitiesService,
    private patientService: PatientService) { }

  ngOnInit() {
    this.hmoPaymentType = [{
      name: 'Capitation',
      id: 0
    }, {
      name: 'Fee For Service',
      id: 1
    }];
    this.hmoTypeControl.setValue(this.hmoPaymentType[0]);

    this.hmoTypeControl.valueChanges.subscribe(value => {
      if (value === 0) {
        this.authCode_show = false;
      } else if (value === 1) {
        this.authCode_show = true;
      }
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  confirmBill_onClick(bill) {
    this.bill = bill;
    this.bill.acceptFunction = true;
    this.systemModuleService.announceSweetProxy('You are about to confirm this bill', 'question', this);
  }
  sweetAlertCallback(result) {
    if (result.value) {
      if (this.bill.acceptFunction === true) {
        this.hmoConfirmBill(true);
      } else {
        this.hmoConfirmBill(false);
      }
    }
  }

  onChangePrice(index) {
    this.selectedBill = JSON.parse(JSON.stringify(this.selectedBill));
    this.selectedBill.billItems[index].totalPrice = parseFloat(this.priceControl.value);
    this.selectedBill.billItems[index].unitPrice = parseFloat(this.priceControl.value);
  }


  hmoConfirmBill(isAccept: boolean) {
    if (this.hmoTypeControl.value === 1 && isAccept === true) {
      this.selectedBill.grandTotal = 0;
      this.selectedBill.subTotal = 0;
      this.selectedBill.billItems.forEach(x => {
        this.selectedBill.grandTotal += x.totalPrice;
        this.selectedBill.subTotal = this.selectedBill.grandTotal;
      });
      if (this.authCodeControl.value !== null) {
        const index = this.selectedBill.billItems.filter(x => x._id.toString() === this.bill._id.toString());
        index[0].covered.authorizationCode = this.authCodeControl.value;
        index[0].covered.isVerify = true;
        if (isAccept) {
          index[0].covered.billAccepted = true;
        }
        index[0].covered.verifiedAt = new Date();
        index[0].paymentCompleted = true;
        this.billingService.patch(this.selectedBill._id,
          {
            grandTotal: this.selectedBill.grandTotal,
            subTotal: this.selectedBill.subTotal,
            billItems: this.selectedBill.billItems
          },
          {
            query: {
              isCoveredPage: true
            }
          }).then(payload => {
            this.selectedBill = payload;
            this.systemModuleService.announceSweetProxy('Service successfully cleared', 'success');
            this.refreshBills.emit(true);
          });
      } else {
        this.systemModuleService.announceSweetProxy('This service require an authorization code', 'error');
      }
    } else if (this.hmoTypeControl.value === 0 || isAccept === false) {
      this.selectedBill.grandTotal = 0;
      this.selectedBill.subTotal = 0;
      this.selectedBill.billItems.forEach(x => {
        this.selectedBill.grandTotal += x.totalPrice;
        this.selectedBill.subTotal = this.selectedBill.grandTotal;
      });
      const index = this.selectedBill.billItems.filter(x => x._id.toString() === this.bill._id.toString());
      index[0].covered.isVerify = true;
      if (isAccept) {
        index[0].covered.billAccepted = true;
      } else {
        index[0].active = false;
        index[0].covered.billAccepted = false;
      }
      index[0].covered.verifiedAt = new Date();
      index[0].paymentCompleted = true;
      this.billingService.patch(this.selectedBill._id,
        {
          grandTotal: this.selectedBill.grandTotal,
          subTotal: this.selectedBill.subTotal,
          billItems: this.selectedBill.billItems
        }, {
          query: {
            isCoveredPage: true
          }
        }).then(payload => {
          this.selectedBill = payload;
          if (!isAccept) {
            const _selectedBill = JSON.parse(JSON.stringify(this.selectedBill));
            delete _selectedBill._id;
            delete _selectedBill.coverFile;
            _selectedBill.patientId = index[0].patientId;
            _selectedBill.billItems = index;
            _selectedBill.billItems[0].active = true;
            _selectedBill.billItems[0].isBearerConfirmed = true;
            _selectedBill.billItems[0].covered = {};
            _selectedBill.billItems[0].covered.coverType = "wallet";
            this.billingService.create(_selectedBill).then(payload2 => {
              const indx = payload2.principalObject.paymentPlan.filter(x => x.planType === 'wallet');
              if (indx.length > 0) {
                indx[0].bearerPersonId = index[0].patientObject.personDetails._id;;
              }

              this.patientService.patch(payload2.principalObject._id, payload2.principalObject, {}).then(payld => { }, error => { })
            }, error => { });
          }
          this.systemModuleService.announceSweetProxy('Service successfully cleared', 'success');
          this.refreshBills.emit(true);
        }, err => {
          // console.log(err);
        });
    } else {
      this.systemModuleService.announceSweetProxy('Please select a cover type', 'error');
    }
  }

  declineBill_onClick(bill) {
    this.bill = bill;
    this.bill.acceptFunction = false;
    this.systemModuleService.announceSweetProxy('You are about to DECLINE this bill and geneate bill on PATIENT account', 'question', this)
  }

  newWorkspace_onClick() { }

  deletion_popup() { }

}
