import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-patient-manager-report',
  templateUrl: './patient-manager-report.component.html',
  styleUrls: ['./patient-manager-report.component.scss']
})
export class PatientManagerReportComponent implements OnInit {

	patientRegistrationAnalytics = false;
	patientRegistration = false;
    pageInView = 'Patient Registration Report';

  constructor(private _router: Router) { }

  ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
  }

  checkPageUrl(param: string) {
		if (param.includes('patientRegistration')) {
			this.patientRegistrationAnalytics = false;
			this.patientRegistration = true;
			this._router.navigate([ '/dashboard/reports/report-dashboard/patientManagerReport/patientRegistration' ]);
		} else if (param.includes('patientAnalytics')) {
			this.patientRegistrationAnalytics = true;
			this.patientRegistration = false;
			this._router.navigate([ '/dashboard/reports/report-dashboard/patientManagerReport/patientAnalytics' ]);
		} else {
			this.patientRegistrationAnalytics = false;
			this.patientRegistration = true;
			this._router.navigate([ '/dashboard/reports/report-dashboard/patientManagerReport/patientRegistration' ]);
		}
	}
	// route(link) {
	// 	console.log(link);
	// 	if (link === 'patientAnalytics') {
	// 		this.patientRegistrationAnalytics = true;
	// 	}  else {
	// 		this.patientRegistrationAnalytics = false;
	// 	}
	// 	this._router.navigate([ '/dashboard/reports/report-dashboard/patient-manager-report' + link ]);
	// }

 // pageInViewLoader(title) {
		//this.pageInView = title;
  //}

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
  }
	patientRegistrationReport() {
		this._router.navigate(['/dashboard/reports/report-dashboard/patientManagerReport/patientRegistration']);
	 }


 patientRegistration_analytics() {
		this._router.navigate(['/dashboard/reports/report-dashboard/patientManagerReport/patientAnalytics']);
	 }

}
