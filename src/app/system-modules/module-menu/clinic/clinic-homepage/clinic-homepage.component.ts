import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-clinic-homepage',
	templateUrl: './clinic-homepage.component.html',
	styleUrls: [ './clinic-homepage.component.scss' ]
})
export class ClinicHomepageComponent implements OnInit {
	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [
		{ data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
		{ data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
	];

	// events
	public chartClicked(e: any): void {}

	public chartHovered(e: any): void {}

	public randomize(): void {
		// Only Change 3 values
		let data = [ Math.round(Math.random() * 100), 59, 80, Math.random() * 100, 56, Math.random() * 100, 40 ];
		let clone = JSON.parse(JSON.stringify(this.barChartData));
		clone[0].data = data;
		this.barChartData = clone;
		/**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
	}

	constructor() {}

	ngOnInit() {}
}
