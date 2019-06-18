import { Component, OnInit } from '@angular/core';
import { FacilitiesService, ProfessionService } from '../../../../services/facility-manager/setup/index';
import { Facility, Profession } from '../../../../models/index';
@Component({
  selector: 'app-profession',
  templateUrl: './profession.component.html',
  styleUrls: ['./profession.component.scss']
})
export class ProfessionComponent implements OnInit {
  newProfession = false;
  professions: Profession[] = [];
  constructor(private professionService: ProfessionService) { }

  ngOnInit() {
    this.getProfessions();
  }
  professionShow() {
    this.newProfession = true;
  }
  getProfessions() {
    this.professionService.findAll().then(payload => {
      this.professions = payload.data;
    })
  }
  close_onClick($event) {
    this.newProfession = false;
  }
}
