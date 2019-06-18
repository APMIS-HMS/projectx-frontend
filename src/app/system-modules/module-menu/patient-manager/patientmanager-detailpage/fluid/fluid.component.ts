import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

import {
	ProfessionService,
	RelationshipService,
	MaritalStatusService,
	GenderService,
	TitleService,
	CountriesService,
	PatientService,
	PersonService,
	EmployeeService,
	FacilitiesService,
	FacilitiesServiceCategoryService,
	BillingService,
	ServicePriceService,
	HmoService,
	FamilyHealthCoverService,
	FluidService
} from '../../../../../services/facility-manager/setup/index';

const moment = require('moment');
const _ = require('lodash');
import * as format from 'date-fns/format';
import * as isWithinRange from 'date-fns/is_within_range';

@Component({
	selector: 'app-fluid',
	templateUrl: './fluid.component.html',
	styleUrls: [ './fluid.component.scss' ]
})
export class FluidComponent implements OnInit, AfterViewInit {
	public frmIntake: FormGroup;
	public frmOutput: FormGroup;
	inInterval = new FormControl();
	outInterval = new FormControl();
	fluidType_pop = false;

	intakeFluidList;
	outputFluidList;

	loading;
	intakeLoading;
	outputLoading;
	filterIntakeLoading;
	filterOutputLoading;

	patient = <any>this.locker.getObject('patient');
	facility = this.facilityService.getSelectedFacilityId();

	patientIntakeFluidList: any = [];
	patientOutputFluidList: any = [];

	totalPatientIntakeFluid;
	totalPatientOutputFluid;

	rateOfIntakeFluid;
	rateOfOutputFluid;

	intakeFilterTime;
	outputFilterTime;

	patientFluidSummary;
	lineChartSummary: Array<any> = [];

	lineChartColors: any;

	// lineChart
	public lineChartData: any[] = [ { data: [], label: '' } ];
	public lineChartLabels: Array<any> = [];
	public lineChartLegend: boolean = true;
	public lineChartType: string = 'line';
	public lineChartOptions: any = {
		responsive: true
	};

	public chartClicked(e: any): void {}

	public chartHovered(e: any): void {}

	getFluids(type: any) {
		this.fluidService
			.find({
				query: {
					type: type,
					facilityId: this.facility._id
				}
			})
			.then((payload) => {
				if (type === 'intake') {
					this.intakeFluidList = payload.data;
				} else if (type === 'output') {
					this.outputFluidList = payload.data;
				}
			});
	}

	constructor(
		private formBuilder: FormBuilder,
		private fluidService: FluidService,
		private locker: CoolLocalStorage,
		private patientService: PatientService,
		private personService: PersonService,
		private employeeService: EmployeeService,
		private facilityService: FacilitiesService,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.frmIntake = this.formBuilder.group({
			infusion: [ '', [ <any>Validators.required ] ],
			infusion_volume: [ '', [ <any>Validators.required ] ],
			infusion_quantity: [ '', [ <any>Validators.required ] ]
		});
		this.frmOutput = this.formBuilder.group({
			fluid: [ '', [ <any>Validators.required ] ],
			output_volume: [ '', [ <any>Validators.required ] ],
			output_quantity: [ '', [ <any>Validators.required ] ]
		});
		this.getFluids('intake');
		this.getFluids('output');
		this.getPatientFluids('intake');
		this.getPatientFluids('output');
		// this.filterByTime('intake', '2');
	}

	ngAfterViewInit() {
		this.getFluidSummary();
	}

	addPatientFluid(type: any) {
		if (type === 'intake') {
			this.intakeLoading = true;
		} else if (type === 'output') {
			this.outputLoading = true;
		}

		const fluidItem =
			type === 'intake' ? this.frmIntake.controls['infusion'].value : this.frmOutput.controls['fluid'].value;
		const volume =
			type === 'intake'
				? this.frmIntake.controls['infusion_volume'].value
				: this.frmOutput.controls['output_volume'].value;
		const quantity =
			type === 'intake'
				? this.frmIntake.controls['infusion_quantity'].value
				: this.frmOutput.controls['output_quantity'].value;

		const fluidsCont = {
			fluid: {
				name: fluidItem.name,
				_id: fluidItem._id
			},
			type: type,
			volume: volume,
			measurement: quantity,
			patientId: this.patient._id,
			facilityId: this.facility._id
		};

		this.fluidService
			.createPatientFluid(fluidsCont)
			.then((payload) => {
				this.loading = false;
				if (type === 'intake') {
					this.frmIntake.reset();
				} else if (type === 'output') {
					this.frmOutput.reset();
				}

				this.systemModuleService.announceSweetProxy('Fluid was successfully created', 'success');
				this.getPatientFluids(type);
				this.getFluidSummary();
			})
			.catch((err) => {
				this.loading = false;
				this.systemModuleService.announceSweetProxy(
					"Something went wrong. Fuild wasn't created, please try again! ",
					'error'
				);
			});
	}

	getPatientFluids(type) {
		this.fluidService
			.findPatientFluid({
				query: {
					facilityId: this.facility._id,
					patientId: this.patient._id,
					type: type,
					$sort: {
						createdAt: -1
					}
				}
			})
			.then((payload) => {
				if (type === 'intake') {
					this.patientIntakeFluidList = payload.data;
					const len = this.patientIntakeFluidList.length;
					let lol = 0;
					for (let i = len - 1; i >= 0; i--) {
						lol += Number(this.patientIntakeFluidList[i].volume);
					}
					this.totalPatientIntakeFluid = lol;
					const firstTimeDate = this.patientIntakeFluidList[0].createdAt;
					const lastTimeDate = this.patientIntakeFluidList[len - 1].createdAt;
					const timeDateDifference =
						(new Date(firstTimeDate).getTime() - new Date(lastTimeDate).getTime()) / (1000 * 60 * 60);
					if (timeDateDifference > 0) {
						this.rateOfIntakeFluid = Math.floor(this.totalPatientIntakeFluid / timeDateDifference);
					} else {
						this.rateOfIntakeFluid = this.totalPatientIntakeFluid;
					}
					this.intakeFilterTime = 'All';
				} else if (type === 'output') {
					this.patientOutputFluidList = payload.data;
					const len = this.patientOutputFluidList.length;
					let lol = 0;
					for (let i = len - 1; i >= 0; i--) {
						lol += Number(this.patientOutputFluidList[i].volume);
					}
					this.totalPatientOutputFluid = lol;
					const firstTimeDate = this.patientOutputFluidList[0].createdAt;
					const lastTimeDate = this.patientOutputFluidList[len - 1].createdAt;
					const timeDateDifference =
						(new Date(firstTimeDate).getTime() - new Date(lastTimeDate).getTime()) / (1000 * 60 * 60);
					if (timeDateDifference > 0) {
						this.rateOfOutputFluid = Math.floor(this.totalPatientOutputFluid / timeDateDifference);
					} else {
						this.rateOfOutputFluid = this.totalPatientOutputFluid;
					}
					this.rateOfOutputFluid = Math.floor(this.totalPatientOutputFluid / 24);
					//this.patientOutputFluidList = payload.data;
					this.outputFilterTime = 'All';
				}
			})
			.catch((err) => {});
	}

	filterByTime(type?, time?) {
		if (type === 'intake') {
			this.filterIntakeLoading = true;
		} else if (type === 'output') {
			this.filterOutputLoading = true;
		}

		this.fluidService
			.findPatientFluid({
				query: {
					facilityId: this.facility._id,
					patientId: this.patient._id,
					type: type,
					$sort: {
						createdAt: -1
					}
				}
			})
			.then((payload) => {
				const a = moment();
				let b;
				const len = payload.data.length;
				let lol = 0;

				if (time === 0) {
					this.getPatientFluids(type);
				} else {
					if (type === 'intake') {
						this.filterIntakeLoading = false;

						this.patientIntakeFluidList = [];

						for (let i = len - 1; i >= 0; i--) {
							b = moment(payload.data[i].createdAt);
							const mm2 = a.diff(b, 'hours');
							if (mm2 <= time) {
								this.patientIntakeFluidList.push(payload.data[i]);
								lol += Number(payload.data[i].volume);
							}
						}
						this.totalPatientIntakeFluid = lol;
						this.rateOfIntakeFluid = Math.floor(this.totalPatientIntakeFluid / time);
						this.intakeFilterTime = `the last ${time}hrs`;
					} else if (type === 'output') {
						this.filterOutputLoading = false;
						this.patientOutputFluidList = [];

						for (let i = len - 1; i >= 0; i--) {
							b = moment(payload.data[i].createdAt);
							const mm2 = a.diff(b, 'hours');
							if (mm2 <= time) {
								this.patientOutputFluidList.push(payload.data[i]);
								lol += Number(payload.data[i].volume);
							}
						}
						this.totalPatientOutputFluid = lol;
						this.rateOfOutputFluid = Math.floor(this.totalPatientOutputFluid / time);
						this.outputFilterTime = `the last ${time}hrs`;
					}
				}
			})
			.catch((err) => {
				this.filterIntakeLoading = false;
				this.filterOutputLoading = false;
			});
	}

	getFluidSummary() {
		this.fluidService
			.findPatientFluid({
				query: {
					facilityId: this.facility._id,
					patientId: this.patient._id,
					type: 'intake',
					$sort: {
						createdAt: -1
					}
				}
			})
			.then((payload) => {
				let data = <any[]>payload.data;
				let len = data.length;
				let label = [];

				for (let i = 0; i < len; i++) {
					// this.lineChartData[0].data.push(data[i].volume);
					// this.lineChartData[0].label = data[i].fluid.name;
					const d = new Date(data[i].createdAt);
					let dt = format(d, 'DD/MM/YY HH:mm:ss a');
					//this.lineChartLabels[0] = 0;
					//this.lineChartLabels.push(dt);
					label.push(dt);
				}
				// console.log(this.lineChartData);
				this.mapTypeOfData(data, label);
				//this.lineChartData = JSON.parse(JSON.stringify(this.refreshGraph(this.lineChartData)));
			});
	}

	mapTypeOfData(data, label) {
		let v = [];
		let _data = _.chain(data)
			.groupBy('fluid.name')
			.map((x, y) => {
				//let v = x.filter((b) => {})
				let finalArray = x.map(function(obj) {
					return obj.volume;
				});
				//finalArray.unshift(0);
				return {
					data: finalArray,
					label: y
				};
			})
			.value();
		let chartData = {
			lineChartData: _data
		};
		this.loopChartData(_data, label);
	}

	private loopChartData(chartData, label) {
		if (chartData.length > 0) {
			this.lineChartData.splice(0, 1);
		}
		for (let index = 0; index < chartData.length; index++) {
			this.lineChartData.push({ data: [], label: '' });
		}
		for (let i = 0; i < chartData.length; i++) {
			this.lineChartData[i].label = chartData[i].label;
			for (let index = 0; index < chartData[i].data.length; index++) {
				this.lineChartData[i].data.push(chartData[i].data[index]);
			}
		}
		this.lineChartData = JSON.parse(JSON.stringify(this.lineChartData));
		this.lineChartLabels = label;
	}

	refreshGraph(lineChartData: any[]) {
		let _lineChartData: Array<any> = new Array(lineChartData.length);
		for (let i = 0; i < lineChartData.length; i++) {
			_lineChartData[i] = { data: new Array(lineChartData[i].data.length), label: lineChartData[i].label };
			for (let j = 0; j < lineChartData[i].data.length; j++) {
				_lineChartData[i].data[j] = lineChartData[i].data[j];
			}
		}
		return _lineChartData;
	}

	fluidType_show() {
		this.fluidType_pop = true;
	}
	close_onClick(message: boolean): void {
		this.fluidType_pop = false;
		this.getFluids('intake');
		this.getFluids('output');
	}
}
