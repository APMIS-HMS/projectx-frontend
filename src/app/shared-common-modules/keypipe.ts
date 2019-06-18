import { PipeTransform, Pipe } from '@angular/core'
@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        if (value !== undefined && value !== null) {
            return Object.keys(value)// .map(key => value[key]);
        }

    }
}
