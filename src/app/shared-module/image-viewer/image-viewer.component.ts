import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ImageEmitterService } from '../../services/facility-manager/image-emitter.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-image-viewer',
	templateUrl: './image-viewer.component.html',
	styleUrls: [ './image-viewer.component.scss' ]
})
export class ImageViewerComponent implements OnInit {
	@Input() imageSrc: String = <String>'';

	constructor(public logoService: ImageEmitterService) {
		// this.imageSrc = this.logoService.src;
	}

	ngOnInit() {
		if (this.imageSrc === null || this.imageSrc === undefined) {
			this.imageSrc = '../../../../../assets/images/logos/default.png';
		}
	}
}
