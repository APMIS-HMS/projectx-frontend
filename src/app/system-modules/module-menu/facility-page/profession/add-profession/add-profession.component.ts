import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { FacilitiesService, ProfessionService } from '../../../../../services/facility-manager/setup/index';
import { Facility, Profession } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-add-profession',
  templateUrl: './add-profession.component.html',
  styleUrls: ['./add-profession.component.scss']
})
export class AddProfessionComponent implements OnInit {

  public frm_profession: FormGroup;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  mainErrCadre = true;
  errMsgCadre = 'you have unresolved errors';
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  professions: Profession[] = [];
  cadreForm: FormGroup;
  facilityObj: Facility = <Facility>{};
  professionCtrl:FormControl = new FormControl();
  constructor(private formBuilder: FormBuilder, private locker: CoolLocalStorage,
    public facilityService: FacilitiesService, private professionService: ProfessionService) { }

  ngOnInit() {
    this.frm_profession = this.formBuilder.group({
      profession: ['', [<any>Validators.required]],
    });
    this.addNewProfessionArray();
    this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
  }
  addNewProfessionArray() {
    this.cadreForm = this.formBuilder.group({
      'cadreArray': this.formBuilder.array([
        this.formBuilder.group({
          name: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
          'readonly': [false],
        })
      ])
    });
  }
  onRemoveBill(cadre, i) {
    (<FormArray>this.cadreForm.controls['cadreArray']).controls.splice(i, 1);
    if ((<FormArray>this.cadreForm.controls['cadreArray']).controls.length === 0) {
      this.addNewProfessionArray();
    }
  }
  onAddHobby(children: any, valid: boolean) {
    if (valid) {
      if (children.name === '' || children.name === ' ') {
        this.mainErrCadre = false;
        this.errMsgCadre = 'You left out a required field';
      } else {

        if (children != null) {
          children.value.readonly = true;
          // children.disabled = true;
          (<FormArray>this.cadreForm.controls['cadreArray'])
            .push(
            this.formBuilder.group({
              name: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
              'readonly': [false],
            })
            );
          this.mainErrCadre = true;
          this.errMsgCadre = '';
        } else {
          const innerChildren: any = children.value;
        }
      }
    } else {
      this.mainErrCadre = false;
      this.errMsgCadre = 'You left out a required field';
    }
  }
  save(valid, val) {
    if (valid) {
      if (val.profession === '' || val.profession === ' ') {
        this.mainErr = false;
        this.errMsg = 'You left out a required field';
      } else {
        const cadres = (<FormArray>this.cadreForm.controls['cadreArray']).controls.filter((x: any) => x.value.readonly);
        const cadreList = [];
        cadres.forEach((itemi, i) => {
          cadreList.push({ name: itemi.value });
        });
        const profession: Profession = <Profession>{};
        profession.name = val.profession;
        profession.caders = [];
        profession.caders = cadreList;
          this.professionService.create(profession).then((payload) => {
            this.frm_profession.reset();
            this.cadreForm.controls['cadreArray'] = this.formBuilder.array([]);
            this.addNewProfessionArray();
          })

        this.mainErr = true;
      }
    } else {
      this.mainErr = false;
    }
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

}
