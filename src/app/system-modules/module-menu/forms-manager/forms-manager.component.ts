import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, Event, NavigationStart, ActivatedRoute, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-forms-manager',
  templateUrl: './forms-manager.component.html',
  styleUrls: ['./forms-manager.component.scss']
})
export class FormsManagerComponent implements OnInit {
  pageInView = 'Treatement Template Manager';
  treatementTemplate = true;
  formGen = false;

  constructor(private router: Router) { }

  ngOnInit() {
    const page: string = this.router.url;
    this.checkPageUrl(page);
  }

  treatementTemplate_show() {
    this.treatementTemplate = true;
    this.formGen = false;
    this.pageInView = 'Treatement Template Manager';
    this.router.navigate(['/dashboard/clinical-documentation/treatement-template']);
  }
  formGen_show() {
    this.treatementTemplate = false;
    this.formGen = true;
    this.pageInView = 'Form Generator';
    this.router.navigate(['/dashboard/clinical-documentation/forms']);
  }
  private checkPageUrl(param: string) {
		if (param.includes('treatement-template')) {
			this.treatementTemplate = true;
      this.formGen = false;
      this.pageInView = 'Treatement Template Manager';
		} else if (param.includes('forms')) {
			this.treatementTemplate = false;
      this.formGen = true;
      this.pageInView = 'Form Generator';
		}
	}

}
