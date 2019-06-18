import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
	selector: 'app-bcr-assessment',
	templateUrl: './bcr-assessment.component.html',
	styleUrls: [ './bcr-assessment.component.scss', '../../../payment/bill-lookup/bill-lookup.component.scss' ]
})
export class BcrAssessmentComponent implements OnInit {
	bcrFormGroup: FormGroup;
	averageRisk = false;
	potentialHighRisk = false;
	knownHighRisk = false;
	patient: any;
	selectedDocument: any;
	docDetail_view = false;
	addProblem_view = false;
	addAllergy_view = false;
	addHistory_view = false;
	addVitals_view = false;

	constructor(private _fb: FormBuilder) {}

	ngOnInit() {
		this.bcrFormGroup = this._fb.group({
			asymptomatic: [ '', Validators.required ],
			hivCounsellingTesting: [ '', Validators.required ],
			personalHistoryOfBreatCancer: [ '', Validators.required ],
			mammogram: [ '', Validators.required ],
			historyOfBreastImplant: [ '', Validators.required ],
			firstDegreeeHasGeneMutation: [ '', Validators.required ],
			firstDegreeeHasGeneticCounsellingAndTesting: [ '', Validators.required ],
			twoOrMoreCasesOfBreastCancerOrOvarianCancer: [ '', Validators.required ],
			bilateralBreastCancer: [ '', Validators.required ],
			bothBreastAndOvarianInTheSameWoman: [ '', Validators.required ],
			seriousInvasiveSeriousOvarian: [ '', Validators.required ],
			breastOrOvarianCancerInAshkenaziJewishFamily: [ '', Validators.required ],
			indentifiedGeneMutationInAnyBloodRelative: [ '', Validators.required ],
			maleBreastCancer: [ '', Validators.required ],
			knownCarrierOfAGeneMutation: [ '', Validators.required ],
			firstDegreeHasHadGeneticCounsellingAndHasDeclinedTesting: [ '', Validators.required ],
			previouslyAssessedAsHavingAGreaterLifetimeRiskOfBreastCancer: [ '', Validators.required ],
			receiveChestXRayBeforeAge30AndAtLeast8YrsPreviously: [ '', Validators.required ]
		});
	}

	onClickSubmitForm(valid: boolean, value: any) {
		const checkStatusOfPatient = this.checkBreatCancerRiskAssessmentOfPatient(value);
		if (checkStatusOfPatient === 'Average Risk') {
			this.averageRisk = true;
			this.potentialHighRisk = false;
			this.knownHighRisk = false;
		} else if (checkStatusOfPatient === 'Known High Risk') {
			this.averageRisk = false;
			this.potentialHighRisk = false;
			this.knownHighRisk = true;
		} else if (checkStatusOfPatient === 'Potential High Risk') {
			this.averageRisk = false;
			this.potentialHighRisk = true;
			this.knownHighRisk = false;
		} else {
			this.averageRisk = false;
			this.potentialHighRisk = false;
			this.knownHighRisk = false;
		}
	}

	checkBreatCancerRiskAssessmentOfPatient(data: any) {
		if (
			data.asymptomatic === '1' &&
			data.hivCounsellingTesting === '0' &&
			(data.personalHistoryOfBreatCancer === '0' && data.mammogram === '0' && data.historyOfBreastImplant === '0')
		) {
			return 'Average Risk';
		} else if (
			data.asymptomatic === '1' &&
			data.hivCounsellingTesting === '1' &&
			(data.firstDegreeeHasGeneMutation === '1' ||
				data.firstDegreeeHasGeneticCounsellingAndTesting === '1' ||
				data.twoOrMoreCasesOfBreastCancerOrOvarianCancer === '1' ||
				data.bilateralBreastCancer === '1' ||
				data.bothBreastAndOvarianInTheSameWoman === '1' ||
				data.seriousInvasiveSeriousOvarian === '1' ||
				data.breastOrOvarianCancerInAshkenaziJewishFamily === '1' ||
				data.indentifiedGeneMutationInAnyBloodRelative === '1' ||
				data.maleBreastCancer === '1')
		) {
			return 'Potential High Risk';
		} else if (
			data.asymptomatic === '1' &&
			data.hivCounsellingTesting === '1' &&
			(data.knownCarrierOfAGeneMutation === '1' ||
				data.firstDegreeHasHadGeneticCounsellingAndHasDeclinedTesting === '1' ||
				data.previouslyAssessedAsHavingAGreaterLifetimeRiskOfBreastCancer === '1' ||
				data.receiveChestXRayBeforeAge30AndAtLeast8YrsPreviously === '1')
		) {
			return 'Known High Risk';
		}
	}

	addProblem_show(event) {}

	addHistory_show(event) {}

	addVitals_show(event) {}

	addAllergy_show(event) {}

	close_onClick(event) {}
}
