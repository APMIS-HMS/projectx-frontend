import { CountryServiceFacadeService } from './../system-modules/service-facade/country-service-facade.service';
import { Component, OnInit, EventEmitter, NgZone, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  CountriesService, FacilityTypesService, FacilitiesService, GenderService,
  PersonService, TitleService, UserService, MaritalStatusService, FacilityModuleService
} from '../services/facility-manager/setup/index';
import { FacilityOwnershipService } from '../services/module-manager/setup/index';
import { Address, Role, Facility, Gender, ModuleViewModel, User, Title, MaritalStatus, Person } from '../models/index';

@Component({
  selector: 'app-facility-setup',
  templateUrl: './facility-setup.component.html',
  styleUrls: ['./facility-setup.component.scss']
})
export class FacilitySetupComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  facilityInfo = false;
  apmisID = true;

  // uploader variables
  private zone: NgZone;
  private progress = 0;
  private response: any = {};
  hasBaseDropZoneOver = true;
  sizeLimit = 2000000;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  isBackEnable = true;
  isEmailExist = true;
  sg1_show = true;
  sg1_1_show = false;
  sg2_show = false;
  sg3_show = false;
  selectModules_show = false;
  sg4_show = false;
  modules: ModuleViewModel[] = [];
  partOneModules: ModuleViewModel[] = [];
  partTwoModules: ModuleViewModel[] = [];

  public facilityForm1: FormGroup;
  public facilityForm1_1: FormGroup;
  public frm_numberVerifier: FormGroup;
  public frm_selectModules: FormGroup;
  public facilityForm4: FormGroup;

  // public submitted: boolean; // keep track on whether form is submitted
  public events: any[] = []; // use later to display form changes

  selectedCountry_key = []; // states of the selected country load key
  stateAvailable = false; // boolean variable to check if the list of user selected state exists in code

  countries: any[] = [];
  titles: Title[] = [];
  genders: Gender[] = [];
  cities: any[] = [];
  lgas: any[] = [];
  maritalStatuses: MaritalStatus[] = [];
  facilityTypes: any[] = [];
  ownerships: any[] = [];
  selectedFacilityType: any = {};
  selectedCountry: any = {};
  selectedFacility: Facility = <Facility>{};
  InputedToken: string;

  constructor(private formBuilder: FormBuilder,
    private facilityOwnershipService: FacilityOwnershipService,
    // private countriesService: CountriesService,
    private countryFacadeService: CountryServiceFacadeService,
    private genderService: GenderService,
    private titleService: TitleService,
    private maritalStatusService: MaritalStatusService,
    private userService: UserService,
    private personService: PersonService,
    private facilityTypeService: FacilityTypesService,
    private facilityModuleService: FacilityModuleService,
    public facilityService: FacilitiesService) { }

  ngOnInit() {

    // ------------- Beginning of image init values -----------------

    // ------------- End of image init values -----------------------

    this.getCountries();
    this.getFacilityTypes();
    this.getModules();
    this.getTitles();
    this.getGenders();
    this.getMaritalStatus();
    this.getOwnerships();

    this.facilityForm1 = this.formBuilder.group({

      facilityname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      facilityalias: ['', [<any>Validators.minLength(2)]],
      facilitytype: ['', [<any>Validators.required]],
      facilitycategory: ['', [<any>Validators.required]],

      facilityownership: ['', [<any>Validators.required]],
      facilityemail: ['', [<any>Validators.required,
        <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      facilitywebsite: ['', [<any>Validators.pattern('^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      facilitycountry: ['', [<any>Validators.required]]
    });

    this.facilityForm1_1 = this.formBuilder.group({
      facilitystate: ['', [<any>Validators.required]],
      facilitylga: ['', [<any>Validators.required]],
      facilitycity: ['', [<any>Validators.required]],
      facilityaddress: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      facilitylandmark: ['', [<any>Validators.required]],

      contactFName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.pattern('^[a-zA-Z ]+$')]],
      contactLName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.pattern('^[a-zA-Z ]+$')]],
      facilityphonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      repass: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });

    this.frm_selectModules = this.formBuilder.group({
      chk_pharmacy: [''],
      chk_diagnostic: [''],
      chk_clinics: [''],
      chk_theater: [''],
      chk_documentation: [''],
      chk_registeration: [''],
      chk_ward: [''],
      chk_facility: ['']
    });

    this.facilityForm4 = this.formBuilder.group({
      buildingtype: [''],
      regPoint_count: [''],
      wards_count: [''],
      paymentPoint_count: [''],
      pharmacyDispense_count: [''],
      pharmacyStore_count: [''],
      theater_count: [''],
      lab_Count: ['']
    });

    this.frm_numberVerifier = this.formBuilder.group({
      txt_numberVerifier: ['', [<any>Validators.required, <any>Validators.minLength(6),
         <any>Validators.maxLength(6), <any>Validators.pattern('^[0-9]+$')]]
    });
    this.facilityForm1.controls['facilitycountry'].valueChanges.subscribe((value: any) => {
      this.stateAvailable = false;
      const country = this.countries.find(item => item._id === value);
      this.selectedCountry = country;
      if (this.selectedCountry.states.length > 0) {
        this.stateAvailable = true;
      }

    });
    this.facilityForm1_1.controls['facilitystate'].valueChanges.subscribe(payload => {
      this.cities = payload.cities;
      this.lgas = payload.lgs;
    })
    this.facilityForm1.controls['facilityemail'].valueChanges.subscribe(value => {
      this.onCheckEmailAddress(value);
    });

  }

  onCheckEmailAddress(value) {
    this.facilityService.find({ query: { email: value } }).then(payload => {
      if (payload.data.length > 0) {
        this.isEmailExist = false;
      }
      // tslint:disable-next-line:one-line
      else {
        this.isEmailExist = true;
      }
    })
  }

  // ---------------- Beggining of image methods ------------------
  handleUpload(data: any): void {
    this.zone.run(() => {
      this.response = data;
      this.progress = Math.floor(data.progress.percent / 100);
    });
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  beforeUpload(uploadingFile): void {
    this.getDataUri(uploadingFile.originalName, function (dataUri) {
      // Do whatever you'd like with the Data URI!
    });

    if (uploadingFile.size > this.sizeLimit) {
      uploadingFile.setAbort();
      alert('File is too large');
    }
  }
  imageChange(fileInput: any) {
    this.previewFile(fileInput.target.files[0]);
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e: any) {
      };
      reader.onprogress = function (e: any) {
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  previewFile(value: File) {
    const file = value;
    const reader = new FileReader();
    const facility = this.selectedFacility;
    reader.addEventListener('load', function () {
      facility.logo = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  getDataUri(url, callback) {
    const image = new Image();

    image.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = image.width; // or 'width' if you want a special/scaled size
      canvas.height = image.width; // or 'height' if you want a special/scaled size

      canvas.getContext('2d').drawImage(image, 0, 0);

      // Get raw image data
      callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

      // ... or get as Data URI
      callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
  }

  getOwnerships() {
    this.facilityOwnershipService.findAll().then((payload) => {
      this.ownerships = payload.data;
    }, error => {

    });
  }
  getCountries() {
    this.countryFacadeService.getOnlyCountries().then(payload => {
    }).catch(error => {
    });
  }
  getGenders() {
    this.genderService.findAll().then((payload) => {
      this.genders = payload.data;
    }, error => {

    });
  }
  getTitles() {
    this.titleService.findAll().then((payload: any) => {
      this.titles = payload.data;
    }, error => {

    });
  }
  getMaritalStatus() {
    this.maritalStatusService.findAll().then((payload: any) => {
      this.maritalStatuses = payload.data;
    }, error => {

    });
  }
  getFacilityTypes() {
    this.facilityTypeService.findAll().then((payload) => {
      this.facilityTypes = payload.data;
    }, error => {

    });
  }
  getModules() {
    this.facilityModuleService.findAll().then((payload) => {
      this.modules = payload.data;
      const count: number = this.modules.length;
      const partOne: number = Math.floor(count / 2);
      const partTwo = count - partOne;
      const partOneModule = this.modules.slice(0, partOne);
      const partTwoModule = this.modules.slice(partOne);

      partOneModule.forEach((item, i) => {
        this.partOneModules.push({
          _id: item._id,
          name: item.name,
          checked: false
        });
      });

      partTwoModule.forEach((item, i) => {
        this.partTwoModules.push({
          _id: item._id,
          name: item.name,
          checked: false
        })
      })
    }, error => {

    });
  }

  /* Component Events */
  onFacilityTypeChange(value: any) {
    const facilityType = this.facilityTypes.find(item => item._id === value);
    this.selectedFacilityType = facilityType;
  }
  onStateChange(value: any) {
  }
  onChangeCountry(value: any) {
    const country = this.countries.find(item => item._id === value);
    this.selectedCountry = country;
  }

  facilitySetup1(valid, val, selectedCountry) {
    if (valid) {
      if (val.facilityname === '' || val.facilityname === ' ' || val.facilityownership === '' ||
        val.facilityownership === ' ' || val.facilitytype === '' || val.facilitytype === ' ' ||
        val.facilitycategory === ' ' || val.facilitycategory === '' || val.facilityemail === ' ' ||
        val.facilityemail === '' || val.facilitycountry === '' || val.facilitycountry === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
      } else {

        this.sg1_1_show = true;
        this.sg1_show = false;
        this.sg2_show = false;
        this.sg3_show = false;
        this.selectModules_show = false;
        this.sg4_show = false;
        this.mainErr = true;

      }
    } else {
      this.mainErr = false;
    }
  }

  facilitySetup1_1(valid, val) {
    if (valid) {
      if (val.facilitystate === '' || val.facilitystate === ' ' || val.facilitylga === '' || val.facilitylga === ' ' ||
        val.facilitycity === '' || val.facilitycity === ' ' || val.facilityaddress === ' ' ||
        val.facilityaddress === '' || val.facilitylandmark === ' ' || val.facilitylandmark === '' || val.contactFName === ''
        || val.contactFName === ' ' || val.contactLName === ''
        || val.contactLName === ' ' || val.facilityphonNo === '' || val.facilityphonNo === ' ' || val.password === '' ||
        val.password === ' ' || val.repass === '' || val.repass === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
      } else if (val.password !== val.repass) {
        this.mainErr = false;
        this.errMsg = 'your passwords do not match';
      } else {
        this.sg1_1_show = false;
        this.sg1_show = false;
        this.sg2_show = true;
        this.sg3_show = false;
        this.selectModules_show = false;
        this.sg4_show = false;

        this.mainErr = true;

        const model: Facility = <Facility>{
          name: this.facilityForm1.controls['facilityname'].value,
          email: this.facilityForm1.controls['facilityemail'].value,
          contactPhoneNo: val.facilityphonNo,
          contactFullName: val.contactLName + ' ' + val.contactFName,
          facilityTypeId: this.facilityForm1.controls['facilitytype'].value,
          facilityClassId: this.facilityForm1.controls['facilitycategory'].value,
          address: <Address>({
            state: this.facilityForm1_1.controls['facilitystate'].value._id,
            lga: this.facilityForm1_1.controls['facilitylga'].value,
            city: this.facilityForm1_1.controls['facilitycity'].value,
            street: this.facilityForm1_1.controls['facilityaddress'].value,
            landmark: this.facilityForm1_1.controls['facilitylandmark'].value,
            country: this.facilityForm1.controls['facilitycountry'].value,
          }),
          website: this.facilityForm1.controls['facilitywebsite'].value,
          shortName: this.facilityForm1.controls['facilityalias'].value,

        }
        this.facilityService.create(model).then((payload) => {
          this.selectedFacility = payload;
          // create person and user
          const personModel = <Person>{
            title: this.titles[0]._id,
            firstName: this.facilityForm1_1.controls['contactFName'].value,
            lastName: this.facilityForm1_1.controls['contactLName'].value,
            gender: this.genders[0]._id,
            homeAddress: model.address,
            primaryContactPhoneNo: model.contactPhoneNo,
            lgaOfOriginId: this.facilityForm1_1.controls['facilitylga'].value,
            nationalityId: this.facilityForm1.controls['facilitycountry'].value,
            stateOfOriginId: this.facilityForm1_1.controls['facilitystate'].value._id,
            email: model.email,
            maritalStatus: this.maritalStatuses[0].name
          };
          const userModel = <User>{
            email: model.email,
            password: this.facilityForm1_1.controls['password'].value
          };

          this.personService.create(personModel).then((ppayload) => {
            userModel.personId = ppayload._id;
            if (userModel.facilitiesRole === undefined) {
              userModel.facilitiesRole = [];
            }
            userModel.facilitiesRole.push(<Role>{ facilityId: payload._id })
            this.userService.create(userModel).then((upayload) => {
            });


          });
        },
          error => {
          });

      }
    } else {
      this.mainErr = false;
    }
  }

  numberVerifier(valid) {
    if (valid) {
      if (this.InputedToken === '' || this.InputedToken === ' ') {
        this.mainErr = false;
        this.errMsg = 'Kindly key in the code sent to your mobile phone';
      } else if (true) {
        this.facilityService.find({ query: { 'verificationToken': this.InputedToken } }).then((payload) => {
          if (payload.data.length > 0) {
            this.mainErr = true;
            this.errMsg = '';
            this.sg3_show = true;
            this.sg2_show = false;
            this.sg1_show = false;
            this.sg1_1_show = false;
            this.selectModules_show = false;
            this.sg4_show = false;
            this.selectedFacility.isTokenVerified = true;
            this.facilityService.update(this.selectedFacility).then(payload2 => { });
          } else {
            this.mainErr = false;
            this.errMsg = 'Wrong Token, try again.';
          }
        });
      }
    } else {
      this.mainErr = false;
    }
  }

  f_sg4_show() {
    this.sg3_show = false;
    this.sg2_show = false;
    this.sg1_show = false;
    this.sg1_1_show = false;
    this.selectModules_show = true;
    this.sg4_show = false;
    this.selectedFacility.logo = this.response;
    this.facilityService.update(this.selectedFacility).then(payload => { });
    this.facilityService.update(this.selectedFacility).then(payload => {
      if (payload != null && payload !== undefined) {
        this.sg3_show = false;
        this.sg2_show = false;
        this.sg1_show = false;
        this.sg1_1_show = false;
        this.selectModules_show = true;
        this.sg4_show = false;
      }
    });

  }

  selectModules_next() {
    this.sg3_show = false;
    this.sg2_show = false;
    this.sg1_show = false;
    this.sg1_1_show = false;
    this.selectModules_show = false;
    this.sg4_show = true;

    this.partOneModules.forEach((item, i) => {
      if (item.checked) {
        this.selectedFacility.facilitymoduleId.push(item._id)
      }
    })
    this.partTwoModules.forEach((item, i) => {
      if (item.checked) {
        this.selectedFacility.facilitymoduleId.push(item._id)
      }
    });
    this.facilityService.update(this.selectedFacility).then(payload => {
      this.selectedFacility = payload;
    });
  }

  facilitySetup_finish(valid) {
    this.close_onClick(valid);
  }

  // go back buttons
  back_verifier() {
    this.sg3_show = false;
    this.sg2_show = false;
    this.sg1_show = false;
    this.sg1_1_show = true;
    this.selectModules_show = false;
    this.sg4_show = false;
  }
  back_facilityForm4() {
    this.sg3_show = false;
    this.sg2_show = false;
    this.sg1_show = false;
    this.sg1_1_show = false;
    this.selectModules_show = true;
    this.sg4_show = false;
  }
  back_selectModules() {
    this.sg3_show = true;
    this.sg2_show = false;
    this.sg1_show = false;
    this.sg1_1_show = false;
    this.selectModules_show = false;
    this.sg4_show = false;
  }
  back_logoUp() {
    this.sg3_show = false;
    this.sg2_show = true;
    this.sg1_show = false;
    this.sg1_1_show = false;
    this.selectModules_show = false;
    this.sg4_show = false;
  }
  back_facilityForm1_1() {
    this.sg3_show = false;
    this.sg2_show = false;
    this.sg1_show = true;
    this.sg1_1_show = false;
    this.selectModules_show = false;
    this.sg4_show = false;
  }
  facilityInfo_show() {
    this.apmisID = false;
    this.facilityInfo = true;
  }
  close_onClick(e) {
    this.closeModal.emit(true);
  }

}
