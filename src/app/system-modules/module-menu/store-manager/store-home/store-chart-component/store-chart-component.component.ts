import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IStoreSummaryItem } from '../new-store-manager-components/store-summary-model';

@Component({
	selector: 'store-chart',
	templateUrl: './store-chart-component.component.html',
	styleUrls: [ './store-chart-component.component.scss' ]
})
export class StoreChartComponentComponent implements OnInit, OnChanges {
	@Input() chartObj: IStoreSummaryItem[] = [];
	// Chart configurtation setup
	public barChartLabels: string[];
	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLegend = true;
	public barChartType = 'bar';
	public barChartData: {};
	public dataSource: Object;
	constructor() {}

	ngOnInit() {}
	ngOnChanges(simple: SimpleChanges) {
		if (simple['chartObj'].currentValue != null) {
			// construct label and data object for the store chart
			setTimeout(() => (this.barChartLabels = this.getPropFromArray(this.chartObj, 'key')));

			this.barChartData = [
				{
					data: this.getPropFromArray(this.chartObj, 'value'),
					label: 'Summary',
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)'
					]
				}
			];
		}
	}

	// This method extracts the value of a particular property in an array
	private getPropFromArray(data: any, prop): any {
		return data.map((d) => d[prop]);
	}
	public chartClicked(e: any): void {}
	public chartHovered(e: any): void {}
}
