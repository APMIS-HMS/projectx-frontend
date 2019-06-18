import {Component, OnInit} from '@angular/core';
import {BillingService, FacilitiesService} from '../../../../services/facility-manager/setup/index';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {AuthFacadeService} from '../../../service-facade/auth-facade.service';
import {SystemModuleService} from 'app/services/module-manager/setup/system-module.service';
import {groupBy} from 'lodash/groupBy';
import * as _ from 'lodash';

@Component({
    selector: 'app-hmo-officer',
    templateUrl: './hmo-officer.component.html',
    styleUrls: ['./hmo-officer.component.scss']
})
export class HmoOfficerComponent implements OnInit {
    billDetail_show = false;
    billHistoryDetail_show = false;
    hmoReport_show = false;
    tab1 = true;
    tab2 = false;
    selectedFacility: any = <any>{};
    selectedBill: any = <any>{};
    _selectedBill: any = <any>{};
    bills = [];
    historyBills = [];
    newData = [];
    newDataPending = [];
    grandTotal: number = 0.0;
    loading = false;

    constructor(
        private billingService: BillingService,
        private locker: CoolLocalStorage,
        private authFacadeService: AuthFacadeService,
        private systemModuleService: SystemModuleService,
        private facilitiesService: FacilitiesService
    ) {
    }

    ngOnInit() {
        this.selectedFacility = this.locker.getObject('selectedFacility');
        this.getBills();
    }

    getBills() {
        this.loading = true;
        this.billingService
            .find({
                query: {
                    isCoveredPage: true,
                    facilityId: this.selectedFacility._id,
                    'billItems.covered.coverType': 'insurance',
                    $sort: {updatedAt: -1}
                }
            })
            .then((payload) => {
                this.loading = false;
                payload.data.forEach((element) => {
                    const index = element.billItems.filter((x) => x.covered.isVerify !== undefined);
                    if (index.length === 0) {
                        element.isPending = true;
                    } else {
                        element.isPending = false;
                    }
                });
                /* Perform grouping of billings based the HMO title
            * lodash utility library is use for the grouping
            * */
                this.bills = payload.data.filter((x) => x.isPending === true);
                this.historyBills = payload.data.filter((x) => x.isPending === false);
                this.calTotalBill();

                this.getDefaultData();

            });
    }

    onRefreshBills(value) {
        this.getBills();
    }

    billDetail(bill) {
        this._selectedBill = bill;
        this.selectedBill = bill;
        this.billDetail_show = true;
    }

    billHistoryDetail(bill) {
        this.selectedBill = bill;
        this.billHistoryDetail_show = true;
    }

    hmo_report() {
        this.hmoReport_show = true;
    }

    close_onClick() {
        this.billDetail_show = false;
        this.billHistoryDetail_show = false;
        this.hmoReport_show = false;
    }

    tab1_click() {
        this.tab1 = true;
        this.tab2 = false;
    }

    tab2_click() {
        this.tab1 = false;
        this.tab2 = true;
    }

    private calTotalBill() {
        this.grandTotal = 0;
        this.historyBills.forEach((b) => {
            this.grandTotal += b.grandTotal;
        });
    }

    /*
    *  GROUPING HELPER FUNCTIONS
    *  */

    private getDefaultData() {

        this.newData = this.groupData('coverFile', this.historyBills);
        this.newData = this.subgroup(this.newData);
        console.log(this.newData);

        this.newDataPending = this.groupData('coverFile', this.bills);
        this.newDataPending = this.subgroup(this.newDataPending);
        console.log(this.newDataPending);


    }

    private groupData(field = 'coverFile', data = [], sumField = 'grandTotal') {
        const grouped = _.groupBy(data, (x) => {
            return x[field]['name'];//x.coverFile.name;//
        });

        let newData = this.createArrayFromGroupedData(grouped, sumField);

        /// console.log(newData);
        return newData;
    }

    private createArrayFromGroupedData(grouped, sumField = 'grandTotal') {
        let newData = [];
        _.forIn(grouped, (value, key) => {

            const sum = _.sumBy(value, x => x[sumField]);
            newData.push({
                key,
                value,
                sum
            });

        });

        return newData;
    }


    private groupTheGrouped(entry, field = 'coverFile') {
        let newgroup = [];
        // forEach(prevGroupedData, (x) =>{
        const grouped = _.groupBy(entry.value, (x) => {
            return x[field]['id']; //x.coverFile.id;//
        });
        newgroup = this.createArrayFromGroupedData(grouped, 'grandTotal');
        // });

        return newgroup;
    }

    private subgroup(data = []) {
        _.forEach(data, (x, index) => {
            data[index].subGroup = this.groupTheGrouped(data[index]);
        });
        return data;
    }

}
