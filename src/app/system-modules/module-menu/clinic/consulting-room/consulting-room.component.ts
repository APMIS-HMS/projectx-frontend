import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, OnInit } from "@angular/core";
import {
  ConsultingRoomService,
  SchedulerTypeService,
  FacilitiesService
} from "../../../../services/facility-manager/setup/index";
import {
  RoomModel,
  Facility,
  Location,
  ConsultingRoomModel,
  User
} from "../../../../models/index";
import { LocationService } from "../../../../services/module-manager/setup/index";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CoolLocalStorage } from "angular2-cool-storage";

@Component({
  selector: "app-consulting-room",
  templateUrl: "./consulting-room.component.html",
  styleUrls: ["./consulting-room.component.scss"]
})
export class ConsultingRoomComponent implements OnInit {
  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  user: User = <User>{};

  consultingRoomForm: FormGroup;
  locationTypeControl = new FormControl();
  clinic: Location = <Location>{};
  selectedFacility: Facility = <Facility>{};
  selectedSchedulerType: any = <any>{};
  selectedMinorLocation: any = <any>{};
  selectedManager: ConsultingRoomModel = <ConsultingRoomModel>{};
  clinics: any[] = [];
  clinicLocations: any[] = [];
  schedules: any[] = [];
  roomManager: ConsultingRoomModel[] = [];
  loading: Boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private locker: CoolLocalStorage,
    private schedulerTypeService: SchedulerTypeService,
    private consultingRoomService: ConsultingRoomService,
    private systemModuleService:SystemModuleService,
    private facilityService: FacilitiesService
  ) {}
  ngOnInit() {
    this.subscribToFormControls();
    this.getClinicMajorLocation();
    this.selectedFacility = <Facility>this.locker.getObject("selectedFacility");
    // this.selectedFacility.departments.forEach((itemi, i) => {
    //   itemi.units.forEach((itemj, j) => {
    //     itemj.clinics.forEach((itemk, k) => {
    //       let clinicModel: ClinicModel = <ClinicModel>{};
    //       clinicModel.clinic = itemk;
    //       clinicModel.department = itemi;
    //       clinicModel.unit = itemj;
    //       clinicModel._id = itemk._id;
    //       clinicModel.clinicName = itemk.clinicName;
    //       this.clinics.push(clinicModel);
    //     });
    //   });
    // });
    // this.getSchedulerType();
    this.addNewConsultingRoom();
    // this.getConsultingRooms();
  }
  getConsultingRooms(majorLocation: Location) {
    this.clearAllRooms();
    this.consultingRoomService
      .find({
        query: {
          facilityId: this.selectedFacility._id,
          majorLocationId: majorLocation._id
        }
      })
      .then(
        payload => {
          this.loading = false;
          this.roomManager = payload.data;
        },
        error => {}
      );
  }
  subscribToFormControls() {
    this.locationTypeControl.valueChanges.subscribe(value => {
      this.selectedMinorLocation = value;
      this.clearAllRooms();
      this.consultingRoomService
        .find({
          query: {
            minorLocationId: value,
            facilityId: this.selectedFacility._id
          }
        })
        .then(payload => {
          if (payload.data.length > 0) {
            this.selectedManager = payload.data[0];
            this.loadManagerRooms(false);
          }
        });
    });
  }
  onSelectSchedulerManager(manager: ConsultingRoomModel) {
    this.selectedManager = manager;
    const filteredClinic = this.clinicLocations.filter(
      x => x.name === this.selectedManager.minorLocationId
    );
    if (filteredClinic.length > 0) {
      this.selectedMinorLocation = filteredClinic[0];
    }
    this.locationTypeControl.setValue(this.selectedManager.minorLocationId);
    this.loadManagerRooms(false);
  }
  loadManagerRooms(force: boolean) {
    this.clearAllRooms();
    if (
      this.selectedManager !== undefined &&
      this.selectedManager.rooms !== undefined &&
      force === false
    ) {
      this.selectedManager.rooms.forEach((itemi, i) => {
        (<FormArray>this.consultingRoomForm.controls[
          "consultingRoomArray"
        ]).push(
          this.formBuilder.group({
            name: [itemi.name, [<any>Validators.required]],
            capacity: [itemi.capacity, [<any>Validators.required]],
            readOnly: [true]
          })
        );
      });
    } else {
      this.getConsultingRooms(this.clinic);
    }
  }
  clearAllRooms() {
    this.consultingRoomForm.controls[
      "consultingRoomArray"
    ] = this.formBuilder.array([]);
  }
  getClinicMajorLocation() {
    this.locationService.findAll().then(payload => {
      payload.data.forEach((itemi, i) => {
        if (itemi.name === "Clinic") {
          this.clinic = itemi;
          this.getConsultingRooms(this.clinic);
          this.getClinicLocation();
        }
      });
    });
  }
  getSchedulerType() {
    this.schedulerTypeService.findAll().then(payload => {
      payload.data.forEach((itemi, i) => {
        if (itemi.name === "Clinic") {
          this.selectedSchedulerType = itemi;
        }
      });
    });
  }
  getClinicLocation() {
    this.clinicLocations = this.selectedFacility.minorLocations.filter(
      x => x.locationId === this.clinic._id
    );
  }
  addNewConsultingRoom() {
    this.consultingRoomForm = this.formBuilder.group({
      consultingRoomArray: this.formBuilder.array([
        this.formBuilder.group({
          name: ["", [<any>Validators.required]],
          capacity: [0, [<any>Validators.required]],
          readOnly: [false]
        })
      ])
    });
  }
  pushNewConsultingRoom(schedule: any) {
    (<FormArray>this.consultingRoomForm.controls["consultingRoomArray"]).push(
      this.formBuilder.group({
        name: ["", [<any>Validators.required]],
        capacity: [0, [<any>Validators.required]],
        readOnly: [false]
      })
    );
    // (<FormArray>this.consultingRoomForm.controls['consultingRoomArray']).controls.reverse();
    this.subscribToFormControls();
  }
  onCreateSchedule() {
    this.schedules = [];
    let hasReadOnly = false;

    (<FormArray>this.consultingRoomForm.controls[
      "consultingRoomArray"
    ]).controls.forEach((itemi, i) => {
      if (itemi.value.readOnly === true) {
        hasReadOnly = true;
      }
    });
    if (this.selectedManager !== undefined && hasReadOnly) {
      this.selectedManager.rooms = [];
      (<FormArray>this.consultingRoomForm.controls[
        "consultingRoomArray"
      ]).controls.forEach((itemi, i) => {
        this.selectedManager.rooms.push(itemi.value);
      });
      this.consultingRoomService.update(this.selectedManager).then(payload => {
        this.selectedManager = payload;
        this._notification(
          "Success",
          "Consulting Room has been updated successfully."
        );
        this.systemModuleService.announceSweetProxy('Consulting Room has been updated successfully', 'success', null, null, null, null, null, null, null);
        this.loadManagerRooms(true);
      });
    } else {
      const manager: ConsultingRoomModel = <ConsultingRoomModel>{ rooms: [] };
      manager.majorLocationId = this.clinic._id;
      manager.minorLocationId = this.selectedMinorLocation;
      manager.facilityId = this.selectedFacility._id;

      (<FormArray>this.consultingRoomForm.controls[
        "consultingRoomArray"
      ]).controls.forEach((itemi, i) => {
        manager.rooms.push(itemi.value);
      });
      this.consultingRoomService.create(manager).then(payload => {
        this.loading = false;
        this._notification(
          "Success",
          "Consulting Room has been created successfully."
        );
        this.systemModuleService.announceSweetProxy('Consulting Room has been created successfully.', 'success', null, null, null, null, null, null, null);
        this.roomManager = payload.data;
        this.loadManagerRooms(true);
      });
    }
  }

  // Notification
  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  closeConsultingRoom(clinic: any, i: any) {
    (<FormArray>this.consultingRoomForm.controls[
      "consultingRoomArray"
    ]).controls.splice(i, 1);
    this.loadManagerRooms(false);
  }
}
