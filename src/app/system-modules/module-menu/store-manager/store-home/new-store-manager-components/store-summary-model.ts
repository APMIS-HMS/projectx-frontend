export interface IStoreSummaryItem {
    key: string;
    value: string | number;
    relativeUrl?: string;
    absoluteUrl?: string;
    /*This fields are for UI customization*/
    tag?: string ;
    tagColor?:  string;
}

