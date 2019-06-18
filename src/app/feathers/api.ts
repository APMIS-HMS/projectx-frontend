export abstract class APIService {

    private _url: string = 'https://your-api-base-url.com';

    get url(): string {
        return this._url;
    }

}