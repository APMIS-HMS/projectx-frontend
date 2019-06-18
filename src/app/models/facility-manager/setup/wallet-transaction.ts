export interface WalletTransaction {
  ref?: any;
  payment?: any;
  entity: string;
  personId?: string;
  facilityId?: string;
  paidBy?: string;
  sourceId?: string;
  sourceType?: EntityType;
  transactionType?: TransactionType;
  transactionMedium?: TransactionMedium;
  description?: string;
  destinationId?: string;
  destinationType?: EntityType;
  transactionStatus?: string;
  transactionDirection?: TransactionDirection;
  amount?: any;
}
export enum TransactionType {
    Dr,
    Cr
}

export enum TransactionType2 {
    Dr,
    Cr
}
export const TransactionStatus = {
    'Incomplete': 'Incomplete',
    'Complete': 'Complete'
};

export const PaymentPlan = {
    'outOfPocket': 'wallet',
    'insurance': 'insurance',
    'company': 'company',
    'family': 'family',
    'waved': 'waved'
};

export enum EntityType {
    Facility,
    Person,
    POS
}
export enum TransactionMedium {
    POS,
    Wallet,
    Cheque,
    Cash,
    PayStack,
    Flutterwave,
    Transfer
}
export enum TransactionDirection {
    PersonToPerson,
    PersonToFacility,
    FacilityToPerson,
    FacilityToFacility,
    ThirdPartyToPerson,
    ThirdPartyToFacility
}


