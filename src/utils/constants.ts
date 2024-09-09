import { OrderBy } from './enums';

export const IMAGE_DUMMY = 'https://source.unsplash.com/random';
export const VIDEO_DUMMY =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
export const UNDEFINED = -1;
export const LOCAL_STORAGE = {
    KEY_ACCESS_TOKEN: 'ACCESS_TOKEN',
    KEY_REFRESH_TOKEN: 'REFRESH_TOKEN',
    KEY_VEHICLE: 'VEHICLE',
    KEY_PERSIST_ROOT: 'persist:root',
};

export const SETTING_PRODUCT_TYPE = {
    DEFAULT: 0,
    HAVE_TYPE: 1,
};

export const STATUS_CODE = {
    fulfilled: 'fulfilled',
};

export const ACCEPT_FILE_IMAGE = ['image/png', 'image/jpeg'];

export const CONSTANT_ROUTE = {
    LOGIN: 'login',
    MAIN_MENU: 'main-menu',
    COLLECTED_SUMMARY: 'collected-summary',
    JOB_SELECTED: 'job-selected',
    ONSITE_MEMORY: 'onsite-memory',
    SELECT_VEHICLE: 'select-vehicle',
    SYSTEM_SETTING: 'system-setting',
    COLLECTION_RECORD_INPUT: 'collection-record-input',
    COLLECTION_SITE_INFORMATION: 'collection-site-information',
    WORK_SELECTION: 'work-selection',
    SITE_NOTES: 'site-notes',
    CARRY_IN_LIST: 'carry-in/list',
    CARRY_IN_INPUT: 'carry-in/input',
    FACILITY_INFORMATION: 'facility-information',
    PAST_COMPLAINTS: 'past-complaints',
    PAST_COMPLAINT_DETAIL: 'past-complaints-detail',
    COLLECTION_CONTAINER: 'collection-container',
    SITE_NOTE_INPUT: 'site-notes-input',
    OPERATION_STATUS: 'operation-status',
    SOURCE_COLLECTION_SITE_SELECTION: 'source-collection-site-selection',
    SUBTITUTE_WORK_SETTING_SPOT: 'subtitute-work-setting-spot',
    SUBTITUTE_WORK_SETTING_COURSE: 'subtitute-work-setting-course',
    DISPATCH_STATUS: 'dispatch-status',
    COLLECTION_CONTAINER_INPUT: 'collection-container-input',
    WEIGHING_INFORMATION_SELECTION: 'weighing-information-selection',
    RECEIPT_RECORD_LIST: 'receipt-record/list',
    RECEIPT_RECORD_INPUT: 'receipt-record/input',
    MANIFEST_REGISTER: 'manifest-register',
    MANIFEST_CONFIRM: 'manifest-confirm',
    CONTRACTS: 'contracts',
    CONTRACT_DETAIL: 'contract-detail',
    GROUP_CHAT_LIST: 'group-chat/list',
    GROUP_CHAT_INPUT: 'group-chat/input',
    ROOM_CHAT: 'room-chat',
    BUNKAI_TO_CHUUKAN: 'bunkaitochuukan',
};

export const DEFAULT_QUERY_OPTION = {
    retry: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
};

export default undefined;

export const DISPATCH_TYPES = [
    {
        label: 'スポットのみ',
        value: 1,
    },
    {
        label: 'コースのみ',
        value: 0,
    },
    {
        label: 'すべて',
        value: 2,
    },
];

// export const
export const SETTING_WHEN_SELECT_VEHICLE = {
    PRIORITIZE_LAST_USED_VEHICLE: 1,
    SPECIFY_VEHICLE_EACH_TIME: 2,
};

export const DEFAULT_COLOR = {
    GREEN: 'GREEN',
    PURPLE: 'PURPLE',
};

export const COLLECTION_RESULT_INPUT_SETTING = {
    PRIORITIZE: {
        QUANTITY_INPUT: 1,
        WORK_SELECTION: 2,
    },
};

export const IMPORT_RECORD_REGISTRAION_SETTING = {
    CARRIED_TO_EACH_COLLECTION_SITE: 0,
    BRING_IN_EACH_ITEM_TO_BE_COLLECTED: 1,
};

export const WORK_LINE_VOUCHER_SETTING = {
    DISPLAY_PRINT: 1,
    DISPLAY_PDF: 2,
    NOT_DISPLAY_NOT_PRINT: 3,
    DISPLAY_PRINT_WITH_SIGNATURE: 4,
};

export const SETTING_SEARCH_DISPATCH_STATUS = {
    PRIORITIZE_PREVIOUS_SEARCH: 1,
    SET_EACH_TIME: 2,
};

export const SPOT_WORK_DATE_TYPE = {
    MATCH: 0,
    UNSPECIFIED: 1,
    ALL: 2,
};

export const SORT_TYPE = {
    ASCENDING: 0,
    DESCENDING: 1,
};

export const SPOT_CONVERT = {
    CONVERTED_QUANTITY: 0,
    PACKAGE_QUANTITY: 1,
};

export const PAGE_SIZE = 50;

export const SOURCE_CONST: Record<
    string,
    {
        cd: string;
        name: string;
    }
> = {
    '0': { cd: '0', name: '' },
    '1': { cd: '1', name: '発生元無し' },
    '2': { cd: '2', name: '収集受付' },
    '3': { cd: '3', name: '出荷受付' },
    '4': { cd: '4', name: '持込受付' },
    '5': { cd: '5', name: '定期配車' },
};

export const ROLES = {
    MOBILE001: 'MOBILE001',
    MOBILE002: 'MOBILE002',
    MOBILE003: 'MOBILE003',
    MOBILE004: 'MOBILE004',
    MOBILE005: 'MOBILE005',
    MOBILE006: 'MOBILE006',
    MOBILE007: 'MOBILE007',
    MOBILE008: 'MOBILE008',
    MOBILE009: 'MOBILE009',
};

export const WEEKDAYLIST = ['日', '月', '火', '水', '木', '金', '土'];

export const SORT_ORDER_FIELDS = [
    {
        cd: 1,
        name: '区分(スポット/定期)',
    },
    {
        cd: 2,
        name: '作業日',
    },
    {
        cd: 3,
        name: '拠点',
    },
    {
        cd: 4,
        name: '営業者',
    },
    {
        cd: 5,
        name: '運転者',
    },
    {
        cd: 6,
        name: '車種',
    },
    {
        cd: 7,
        name: '車輌',
    },
    {
        cd: 8,
        name: '業者',
    },
    {
        cd: 9,
        name: '現場',
    },
    {
        cd: 10,
        name: '配車状況',
    },
];

export const DROPDOWN_ORDER_BY = [
    {
        label: '時間順',
        value: OrderBy.CHRONOLOGICAL_ORDER,
    },
    {
        label: 'カタカナ',
        value: OrderBy.KANA_ORDER,
    },
];
