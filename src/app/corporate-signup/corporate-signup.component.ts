import { Component, OnInit, EventEmitter, NgZone, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  CountriesService, CorporateFacilityService, GenderService,
  PersonService, TitleService, UserService, MaritalStatusService
} from '../services/facility-manager/setup/index';
import { Address, CorporateFacility, Gender, ModuleViewModel, User, Title, MaritalStatus, Person } from '../models/index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'app-corporate-signup',
  templateUrl: './corporate-signup.component.html',
  styleUrls: ['./corporate-signup.component.scss']
})
export class CorporateSignupComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';


  // uploader variables
  private zone: NgZone;
  // private options: NgUploaderOptions;
  private progress = 0;
  private response: any = {};
  hasBaseDropZoneOver = true;
  sizeLimit = 2000000;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  // facility setup stage switch controls
  sg1_show = true;
  sg1_1_show = false;
  sg1_1_1_show = false;
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
  selectedFacility: CorporateFacility = <CorporateFacility>{};
  InputedToken: string;
  closeSubscription: Subscription;
  countDown = 10;
  closeMsg = '';
  isSuccessful = false;
  isDuplicateEmail = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private countriesService: CountriesService,
    private genderService: GenderService,
    private titleService: TitleService,
    private maritalStatusService: MaritalStatusService,
    private userService: UserService,
    private personService: PersonService,
    private corporateFacilityService: CorporateFacilityService) { }

  ngOnInit() {

    // ------------- Beginning of image init values -----------------

    // ------------- End of image init values -----------------------

    this.getCountries();
    this.getTitles();
    this.getGenders();
    this.getMaritalStatus();

    this.facilityForm1 = this.formBuilder.group({

      facilityname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],

      facilityemail: ['', [<any>Validators.required, <any>Validators.
        pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      facilitywebsite: ['', [<any>Validators.required, <any>Validators
        .pattern('^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      facilitycountry: ['', [<any>Validators.required]]
    });

    this.facilityForm1_1 = this.formBuilder.group({
      facilitystate: ['', [<any>Validators.required]],
      facilitylga: ['', [<any>Validators.required]],
      facilitycity: ['', [<any>Validators.required]],
      facilityaddress: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      facilitylandmark: ['', [<any>Validators.required]],

      contactFName: ['', [<any>Validators.required, <any>Validators.minLength(3)]],
      contactLName: ['', [<any>Validators.required, <any>Validators.minLength(3)]],
      facilityphonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      repass: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });

    this.facilityForm1.controls['facilityemail'].valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(value => this.corporateFacilityService.find({ query: { email: value } }))
      .subscribe((payload: any) => {
        if (payload.total > 0) {
          this.isDuplicateEmail = true;
          this.errMsg = 'Duplicate email detected, please use another email';
          this.mainErr = false;
        } else {
          this.isDuplicateEmail = false;
          this.errMsg = '';
          this.mainErr = true;
        }
      });

    //     const subscribeForTag = this.searchTag.valueChanges
    //   .debounceTime(200)
    //   .distinctUntilChanged()
    //   .switchMap((term: Tag[]) => this._tagService.find({
    //     query:
    //     { search: this.searchTag.value, facilityId: this.facility._id }
    //   }).
    //     then(payload => {
    //       this.tags = payload.data;
    //     }));

    // subscribeForTag.subscribe((payload: any) => {
    // });

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

  getCountries() {
    this.countriesService.findAll().then((payload) => {
      this.countries = payload.data;
    })
  }
  getGenders() {
    this.genderService.findAll().then((payload) => {
      this.genders = payload.data;
    })
  }
  getTitles() {
    this.titleService.findAll().then((payload: any) => {
      this.titles = payload.data;
    })
  }
  getMaritalStatus() {
    this.maritalStatusService.findAll().then((payload: any) => {
      this.maritalStatuses = payload.data;
    })
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
      if (val.facilityname === '' || val.facilityname === ' ' || val.facilityemail === ' ' ||
        val.facilityemail === '' || val.facilitywebsite === '' || val.facilitywebsite === ' ' ||
        val.facilitycountry === '' || val.facilitycountry === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
      } else {
        if (this.isDuplicateEmail === true) {
          this.errMsg = 'Duplicate email detected, please use another email';
          this.mainErr = false;
        } else {
          this.sg1_1_show = true;
          this.sg1_1_1_show = true;
          this.sg1_show = false;
          this.sg2_show = false;
          this.sg3_show = false;
          this.selectModules_show = false;
          this.sg4_show = false;
          this.mainErr = true;
        }
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
        this.sg1_1_show = false;
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
        this.sg1_1_1_show = false;
        this.mainErr = true;
        if (this.selectedFacility._id != null || this.selectedFacility._id !== undefined) {
          this.corporateFacilityService.update(this.selectedFacility).then(fpayload => {
            this.selectedFacility = fpayload;
          });
        } else {
          const model: CorporateFacility = <CorporateFacility>{
            name: this.facilityForm1.controls['facilityname'].value,
            email: this.facilityForm1.controls['facilityemail'].value,
            contactPhoneNo: val.facilityphonNo,
            contactFullName: val.contactLName + ' ' + val.contactFName,
            address: <Address>({
              state: this.facilityForm1_1.controls['facilitystate'].value._id,
              lga: this.facilityForm1_1.controls['facilitylga'].value,
              city: this.facilityForm1_1.controls['facilitycity'].value,
              street: this.facilityForm1_1.controls['facilityaddress'].value,
              landmark: this.facilityForm1_1.controls['facilitylandmark'].value,
              country: this.facilityForm1.controls['facilitycountry'].value,
            }),
            website: this.facilityForm1.controls['facilitywebsite'].value,

          };
          this.corporateFacilityService.create(model).then((payload) => {
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
              corporateOrganisationId: this.selectedFacility._id,
              password: this.facilityForm1_1.controls['password'].value
            };

            this.personService.create(personModel).then((ppayload) => {
              userModel.personId = ppayload._id;
              this.userService.create(userModel).then((upayload) => {
              });


            });
          });
        }
      }
    } else {
      this.sg1_1_1_show = false;
      this.mainErr = false;
    }
  }

  numberVerifier(valid) {
    if (valid) {
      if (this.InputedToken === '' || this.InputedToken === ' ') {
        this.mainErr = false;
        this.errMsg = 'Kindly key in the code sent to your mobile phone';
      } else if (true) {
        this.corporateFacilityService.find({ query: { 'verificationToken': this.InputedToken } }).then((payload) => {
          if (payload.data.length > 0) {
            this.mainErr = true;
            this.errMsg = '';
            this.sg3_show = false;
            this.sg2_show = true;
            this.sg1_show = false;
            this.sg1_1_show = false;
            this.selectModules_show = false;
            this.sg4_show = false;

            this.selectedFacility.isTokenVerified = true;
            this.corporateFacilityService.update(this.selectedFacility).then(payload2 => {
              // this.closeMsg = 'Your facility is set up completely, you will be taking to login page in ' + this.countDown + ' minutes'
              // this.isSuccessful = true;
              this.closeSubscription = Observable.interval(1000).throttleTime(1000).subscribe(rx => {
                this.closeMsg = 'Your facility completely set up, you will be redirected to login page in ' + this.countDown + ' seconds'
                this.isSuccessful = true;
                this.countDown = this.countDown - 1;
                if (rx === 9) {
                  // this.nextForm.emit(true);
                  this.router.navigate(['/login']);
                  this.closeSubscription.unsubscribe();
                }

              });
            });
          } else {
            this.mainErr = false;
            this.errMsg = 'Wrong Token, try again.';
            this.sg1_1_show = true;
          }
        });
      }
    } else {
      this.mainErr = false;
      this.sg1_1_show = true;
    }
  }

  f_sg4_show() {
    this.corporateFacilityService.update(this.selectedFacility).then(payload => {
      if (payload != null && payload !== undefined) {
        this.sg3_show = false;
        this.sg2_show = false;
        this.sg1_show = false;
        this.sg1_1_show = false;
        this.selectModules_show = true;
        this.sg4_show = false;
        this.router.navigate(['/']);
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

    this.corporateFacilityService.update(this.selectedFacility).then(payload => {
      this.selectedFacility = payload;
    });
  }

  facilitySetup_finish(valid) { }

  // go back buttons
  back_verifier() {
    this.sg3_show = false;
    this.sg2_show = false;
    this.sg1_show = false;
    this.sg1_1_show = true;
    this.selectModules_show = false;
    this.sg4_show = false;
    this.sg1_1_1_show = true;
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

  close_onClick() {
    this.closeModal.emit(true);
  }

}

