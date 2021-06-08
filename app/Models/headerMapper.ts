import { AdditionalCSVHeader } from "./additionalCSVHeader";
import { DocumentVariable } from "./documentVariable";

export class HeaderMapper {
    MandatoryHeaderMapperID: number;
    MailingGroupID: string;
    MandatoryHeaderID: number;
    CSVHeaderID: number;
    Collapsed: boolean;
    Header: AdditionalCSVHeader;
    DocumentVariables: DocumentVariable[];
    InternationalFile: any;

    constructor(mailingGroupID: string, mandatoryHeaderID: number, csvHeaderID: number, header: AdditionalCSVHeader) {
        this.MailingGroupID = mailingGroupID;
        this.MandatoryHeaderID = mandatoryHeaderID;
        this.CSVHeaderID = csvHeaderID;
        this.Header = header;
        this.Collapsed = false;
    }
    
}