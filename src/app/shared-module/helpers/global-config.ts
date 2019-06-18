export const onAdmission = '1';
export const transfer = '2';
export const discharge = '3';
export const inTheater = '4';

export const DurationUnits = [
	{ id: 5, name: 'Minutes', selected: false },
	{ id: 1, name: 'Hours', selected: true },
	{ id: 2, name: 'Days', selected: false },
	{ id: 3, name: 'Weeks', selected: false },
	{ id: 4, name: 'Months', selected: false }
];
export const DosageUnits = [
	{ id: 1, name: 'mL', selected: true },
	{ id: 2, name: 'mg', selected: false },
	{ id: 3, name: 'g', selected: false },
	{ id: 4, name: 'g/mL', selected: false },
	{ id: 5, name: 'L', selected: false },
	{ id: 6, name: 'cm', selected: false }
];

export const BloodGroups = [
	{ id: 1, name: 'N/A', selected: true, recipients: [] },
	{ id: 1, name: 'A+', selected: false, recipients: [ 'A+', 'AB+' ] },
	{ id: 2, name: 'A-', selected: false, recipients: [ 'A+', 'A-', 'AB+', 'AB-' ] },
	{ id: 3, name: 'B+', selected: false, recipients: [ 'B+', 'AB+' ] },
	{ id: 4, name: 'B-', selected: false, recipients: [ 'B+', 'B-', 'AB+', 'AB-' ] },
	{ id: 5, name: 'O+', selected: false, recipients: [ 'A+', 'O+', 'B+', 'AB+' ] },
	{
		id: 6,
		name: 'O-',
		selected: false,
		recipients: [ 'A+', 'A-', 'O+', 'O-', 'B+', 'B-', 'AB+', 'AB-' ]
	},
	{ id: 7, name: 'AB+', selected: false, recipients: [ 'AB+' ] },
	{ id: 8, name: 'AB-', selected: false, recipients: [ 'AB+', 'AB-' ] }
];

export const Genotypes = [
	{ id: 1, name: 'N/A', selected: true },
	{ id: 1, name: 'AA', selected: false },
	{ id: 2, name: 'AS', selected: false },
	{ id: 3, name: 'AC', selected: false },
	{ id: 4, name: 'SS', selected: false },
	{ id: 5, name: 'SC', selected: false },
	{ id: 6, name: 'CC', selected: false }
];

export const Clients = [
	{ id: 1, name: 'Individual', selected: true },
	{ id: 2, name: 'Corporate', selected: false },
	{ id: 3, name: 'Internal', selected: false }
];
export const PaymentChannels = [
	{ id: 1, name: 'Cash' },
	// { 'id': 2, 'name': 'Cheque' },
	{ id: 3, name: 'Flutterwave' },
	{ id: 4, name: 'Paystack' } // { 'id': 5, 'name': 'POS' },
	// { 'id': 6, 'name': 'Transfer' }
];
export const PAYSTACK_CLIENT_KEY = 'pk_test_3c53bcffeb3c889d04ea0f905c44d36fc342aa85';
export const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK-8da67f59fe34994e78c5f77022ba8178-X'; // Add public keys generated
// on your dashboard here
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const WEBSITE_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
export const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
export const NUMERIC_REGEX = /^[0-9]+$/;
export const CACNO_REGEX = /^rc[0-9]|bn[0-9]+$/;
export const ALPHABET_REGEX = '[a-zA-Z][a-zA-Z ]+';
export const GEO_LOCATIONS = [ 'ng' ];
export const HTML_SAVE_PATIENT = `  <i class="fa fa-info-circle" aria-hidden="true"></i>
SUCCESS!!! An auto-generated password has been sent to your phone number`;
export const DONT_USE_AUTH_GUARD = false;
export const VISIBILITY_FACILITY = '5901fe0b86a46a00dc7cca77';
export const VISIBILITY_UNIT = '5901fe1686a46a00dc7cca79';
export const VISIBILITY_GLOBAL = '5901fdfd86a46a00dc7cca76';
export const VISIBILITY_INDIVIDUAL = '5901fdea86a46a00dc7cca75';
export const VISIBILITY_DEPARTMENT = '5901fe1186a46a00dc7cca78';
export const USE_DOC_AUTHORIZATION = false;
export const API_TEST = 'https://apmisapitest.azurewebsites.net';
export const API_DEV = 'https://demo.apmis.ng';
export const API_LIVE = 'https://live.apmis.ng';
export const API_LOCALHOST = 'http://localhost:3031';
export const USE_LOGIN_ENCRYPTION = false;
export const USE_FACILITY_ACTIVATION = true;
export const APMIS_STORE_PAGINATION_LIMIT = 10;
export const ApointmentScheduleStatus = {
	ACTIVE: 'Active',
	SUSPENDED: 'Suspended',
	ABORTED: 'Aborted',
	SCHEDULED: 'Scheduled',
	POSTPONED: 'Postponed',
	PLANNED: 'Planned',
	CANCELLED: 'Cancelled',
	EXPIRED: 'Expired',
	COMPLETED: 'Completed'
};

export const TreatmentSheetActions = {
	SUSPENDED: 'Suspended',
	ADMINISTERED: 'Administered',
	ACTIVATED: 'Activated',
	DISCONTINUED: 'Discontinued',
	COMPLETED: 'Completed',
	CANCELLED: 'Cancelled',
	EXPIRED: 'Expired',
	TAKEN: 'Taken',
	NOT_TAKEN: 'Not Taken',
	DONE: 'Done',
	NOT_DONE: 'NOT Done',
	EDIT: 'Edit',
	REMOVED: 'Removed',
	ADDED: 'Added'
};

export const InvalidTreatmentReport = {
	NILL: 'NILL',
	EMPTY: '',
	SPACE: ' ',
	NOT_AVAILABLE: 'N/A'
};
