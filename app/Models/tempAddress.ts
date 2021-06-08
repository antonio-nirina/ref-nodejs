export class TempAddress {

    constructor(
        public AddressID: number,
        public FirstNameSender: string,
        public LastNameSender: string,
        public CompanySender: string,
        public CountrySenderID: number,
        public CitySender: string,
        public AddressSender1: string,
        public AddressSender2: string,
        public ZipPostalCodeSender: string,
        public FirstNameDest: string,
        public LastNameDest: string,
        public CompanyDest: string,
        public CountryDestID: number,
        public CityDest: string,
        public ZipPostalCodeDest: string,
        public AddressDest1: string,
        public AddressDest2: string,
        public Error: boolean,
        public Deleted: boolean,
        public MailingGroupID: string
    ) { }
}