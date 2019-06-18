import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dhis-report',
  templateUrl: './dhis-report.component.html',
  styleUrls: ['./dhis-report.component.scss']
})
export class DhisReportComponent implements OnInit {

  nhmis = false;
  registers = false;

  pageInView = 'DHIS Report';

  constructor(private _router: Router) { }

  ngOnInit() {
    const page: string = this._router.url;
    this.checkPageUrl(page);
  }

  
  checkPageUrl(param: string) {
    if (param.includes('nhmis')) {
      this.nhmis = true;
      this.registers = false;
      this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport/nhmis']);
    } else if (param.includes('registers')) {
      this.nhmis = false;
      this.registers = true; 
      this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport/registers']);
    } else {
      this.nhmis = true;
      this.registers = false; 
      this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport/nhmis']);
    }
  }

  // route(link){
  //   if(link === 'nhmis'){
  //     this.nhmis = true;
  //     this.registers = false;
  //     this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport/nhmis']);
  //   } else if(link === 'registers'){
  //     this.nhmis = false;
  //     this.registers = true;
  //     console.log('going to resiger');
  //     this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport/registers']).then(r =>{

  //     }, error =>{
  //       console.log(error);
  //     });
  //   } else{
  //     this.nhmis = true;
  //     this.registers = false;
  //   }
  //   this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport' + link]);
  // }

  call_nhmis(){
    this.nhmis = true;
    this.registers = false;
    this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport/nhmis']);
  }

  call_registers(){
    this.nhmis = false;
    this.registers = true;
    this._router.navigate(['/dashboard/reports/report-dashboard/dhisReport/registers']);
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }
}

