import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-recieve-payment',
  templateUrl: './recieve-payment.component.html',
  styleUrls: ['./recieve-payment.component.scss']
})
export class RecievePaymentComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  public frmRecieve: FormGroup;
  recieve = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmRecieve = this.formBuilder.group({
      paytype: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      payfor: ['', [<any>Validators.required]],
      invoiceNo: ['', [<any>Validators.required]],
      comment: ['', [<any>Validators.required]]
    });
  }

  recieve_show(){
    this.recieve = !this.recieve;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  show_beneficiaries(){

  }

  public upload(e) {

    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("excelfile", fileBrowser.files[0]);
      // formData.append("hmoId", hmo._id);
      // this.facilityService.upload(formData, this.selectedHMO._id).then(res => {
      //   // do stuff w/my uploaded file
      //   let enrolleeList: any[] = [];
      //   if (res.body !== undefined && res.body.error_code === 0) {
      //     res.body.data.Sheet1.forEach(row => {
      //       let rowObj: any = <any>{};
      //       rowObj.serial = row.A;
      //       rowObj.surname = row.B;
      //       rowObj.firstName = row.C;
      //       rowObj.gender = row.D;
      //       rowObj.filNo = row.E;
      //       rowObj.category = row.F;
      //       rowObj.sponsor = row.G;
      //       rowObj.plan = row.H;
      //       rowObj.type = row.I;
      //       rowObj.date = this.excelDateToJSDate(row.J);
      //       enrolleeList.push(rowObj);
      //     });
      //     const index = this.loginHMOListObject.hmos.findIndex(x => x._id === hmo._id);
      //     let facHmo = this.loginHMOListObject.hmos[index];
      //     let enrolleeItem = {
      //       month: new Date().getMonth() + 1,
      //       year: new Date().getFullYear(),
      //       enrollees: enrolleeList
      //     }

      //     facHmo.enrolleeList.push(enrolleeItem);
      //     this.loginHMOListObject.hmos[index] = facHmo;


      //     this.hmoService.update(this.loginHMOListObject).then(pay => {
      //       this.getLoginHMOList();
      //     })
      //   }
      // }).catch(err => {
      //   this._notification('Error', "There was an error uploading the file");
      // });
    }
  }
}
