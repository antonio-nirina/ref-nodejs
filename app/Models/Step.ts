export enum AddressesModalState {
    ERROR = -1,
    NOT_INITIALIZED = 0,
    PREVIEW_ADDRESSES = 1,
    COMPLETED = 2,
   // SELECT_LETTER_TYPE = 3,
    SELECT_SENDER = 4,
    SELECT_METHOD = 5,
    UPLOAD_FILE = 6,
    SELECT_GROUPS = 7,
    FIX_ADDRESSES = 8,
    CUSTOM_FIELDS_ASSOCIATION = 9,
    FILL_IN_CUSTOM_FIELDS = 10,
    MAPP_HEADERS = 11
}


export class Step {
    state: AddressesModalState; 
    isActive: boolean;
    onlyimport?: boolean;
}


