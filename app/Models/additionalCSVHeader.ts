import { ValueCSVHeader } from "./valueCSVHeader";

export class AdditionalCSVHeader {
    AdditionalCSVHeaderID: number;
    MailingGroupID: number;
    HeaderName: string;
    CSVLine: number;
    Values: ValueCSVHeader[];
    Disabled: boolean;

    //public GetFullName() {
    //    return this.CSVLine + "." + this.HeaderName + "(" + this.Values[0].Value + ")";
    //}
}
 