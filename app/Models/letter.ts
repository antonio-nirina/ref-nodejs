import { Address } from "./address";

export class Letter {
    LetterID: number;
    ClientReference: string;
    NumberOfPages: number;
    PostNumberForLetter: string;
    PreuvePDF: string;
    GlobalSpAddress: boolean;
    PorteAdresse: boolean;
    ClientReferenceOnDepot?: number;
    DateLetterSent?: Date;
    CreationDate: Date;
    StatusPrintingID?: number;
    MailingGroupID: number;
    Destination: Destination;
    Sender: Sender
    PricePostOffice: number;
    LetterBase64: string;
    HrefURL: any;
    HrefName: string;

}

export class Destination {
    DestiontionID: number;
    Address: Address;
}

export class Sender {
    SenderID: number;
    Address: Address;
}
