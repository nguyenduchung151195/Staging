/* eslint-disable no-undef */
// // config common

// export const BASE_URL = 'http://localhost:10201';
// export const APP_URL = 'http://localhost:10020';

export const BASE_URL = BASE;
export const UPLOAD_APP_URL = UPLOAD_APP;
// export const UPLOAD_APP_URL = 'http://localhost:10203/api';
// //
export const APP_URL = APP;

//  Api tim kiem bang hinh anh
export const URL_FACE_API_URL = URL_FACE_API;
export const SEARCH_IMAGE = `${URL_FACE_API_URL}/search_image`;
//  Api tim kiem bang video
export const SEARCH_VIDEO = `${URL_FACE_API_URL}/search_video`;
//
export const APP_REPORT_URL = APP_REPORT;
export const DYNAMIC_FORM_URL = DYNAMIC_FORM;
export const AUTOMATION_URL = AUTOMATION;
// export const AUTOMATION_URL = 'http://localhost:10208';
export const PROPERTIES_APP_URL = PROPERTIES_APP;
export const APPROVE_URL = APPROVE;
export const UPLOAD_AI_URL = UPLOAD_AI;
// export const APPROVE_URL = 'http://localhost:10010';
export const VERSION_NO = versionNo;
export const DEV = dev;
export const URL_MEETTING = URL_MEETING
// FACE_RECONIZE
// export const FACE_RECONIZE_URL = 'http://192.168.1.238:5000';
export const FACE_RECONIZE_WS = 'ws://192.168.1.238:5000';
export const HRM_UPLOAD_AVATAR = `http://192.168.1.238:10099/async-images`;
export const SPEECH_2_TEXT = `${SPEECH2TEXT}/speech2text`;

// api CCall
export const API_CCALL = 'https://api.ccall.vn/cdrs/json';
export const API_CALL = `${APP_URL}/api/call`;

// api auth
export const API_LOGIN = `${BASE_URL}/oauth/token`;
export const API_GET_TOKEN = `${BASE_URL}/oauth/authorize`;
export const REGISTER = `${BASE_URL}/users/register`;
export const CREATE = `${BASE_URL}/users/create`;
export const API_ROLE = `${BASE_URL}/roles`;
export const API_ROLE_GROUP = `${BASE_URL}/role-groups`;
export const API_CHANGE_MY_PASSWORD = `${BASE_URL}/users/change-my-pass`;
export const API_CHANGE_PASSWORD = `${BASE_URL}/users/change-password`;
export const API_CHANGE_PASSWORD_PERSON = `${BASE_URL}/users/admin-change-password`;

export const API_APPROVE_GROUPS = `${APPROVE_URL}/api/approve-group`;
export const API_APPROVE = `${APPROVE_URL}/api/approve-request`;

// api system config
export const SYS_CONF = `${APP_URL}/api/system-config`;

// api users
export const API_FIELD = `${APP_URL}/api/field`;
export const API_COMMON = `${APP_URL}/api/common`;
export const API_COMMON_MODULE = `${APP_URL}/api/common/module-dynamic`;
export const API_COMMON_APPROVE_FINISH = `${APP_URL}/api/common/approve/finish`;
export const WHO_AM_I = `${APP_URL}/api/users/whoami`; // GET users //POST user // DELETE user
export const API_USERS = `${APP_URL}/api/employees`; // GET users //POST user // DELETE user
export const API_USERS_SEARCH = `${APP_URL}/api/employees/search`; // GET users //POST user // DELETE user
export const API_ORIGIN = `${APP_URL}/api/inventory/origin`; // GET users //POST user // DELETE user
export const API_ORIGANIZATION = `${APP_URL}/api/organization-units`; // GET users //POST user // DELETE user
export const API_DELETE_ORIGANIZATION = `${APP_URL}/api/organization-units/remove-more`; // GET users //POST user // DELETE user
export const API_SEARCH_ORIGANIZATION = `${APP_URL}/api/organization-units/search`; // GET users //POST user // DELETE user
export const API_CHANGE_WORKING_ORIGANIZATION = `${APP_URL}/api/organization-units/change-working-organization`;
export const API_VIEWCONFIG = `${APP_URL}/api/view-configs/myconfig`; // +id user  //PUT view config
export const API_UNIT_STOCK = `${APP_URL}/api/inventory/unit`; // +id user  //PUT view config
export const API_CATEGORY_STOCK = `${APP_URL}/api/inventory/catalog`; // +id user  //PUT view config
export const API_CATEGORY_STOCK_TREE = `${APP_URL}/api/inventory/catalog/tree`; // +id user  //PUT view config
export const API_SERVICES_STOCK = `${APP_URL}/api/inventory/service`; // +id user  //PUT view config
export const API_TAG_STOCK = `${APP_URL}/api/inventory/tag`; // +id user  //PUT view config
export const API_ASSET_TYPE_STOCK = `${APP_URL}/api/inventory/assetType`; // +id user  //PUT view config
export const API_UPDATE_VIEWCONFIG = `${APP_URL}/api/view-configs`; // +id user  //PUT view config
export const DYNAMIC_COLLECTION = `${APP_URL}/api/dynamic-collections`; // +id user  //PUT view config
export const CRM_SOURCE = `${APP_URL}/api/crm-source`; // +id user  //PUT view config
export const API_ADD_NEW_PRODUCT = `${APP_URL}/api/inventory`;
// api properties
export const GET_PROP_SET = `${PROPERTIES_APP_URL}/attribute-temps`;
export const GET_PROP_GROUP = `${PROPERTIES_APP_URL}/attributesGroup`;
export const GET_PROP_LIST = `${PROPERTIES_APP_URL}/attributes`;

export const API_REPORT_TASK_STATUS = `${APP_URL}/api/report/report-taskstatus`;
export const API_EXPORT_TASKSTATUS = `${APP_URL}/api/report/export-taskstatus`;

export const API_REPORT_HRM_BY_SIGNED = `${APP_URL}/api/hrmEmployee/report-hrm-with-signed-date`;
export const API_REPORT_HRM_SENIORITY = `${APP_URL}/api/hrmEmployee/report-hrm-seniority`;
export const API_REPORT_HRM_DEGREE = `${APP_URL}/api/hrmEmployee/report-hrm-degree`;
export const API_REPORT_HRM_CONTRACT_TYPE = `${APP_URL}/api/hrmEmployee/report-hrm-contract-type`;
export const API_REPORT_HRM_BY_CONTRACT = `${APP_URL}/api/hrmEmployee/report-hrm-count-by-contract`;
export const API_REPORT_HRM_BY_ORG = `${APP_URL}/api/hrmEmployee/report-hrm-count-by-org`;
export const API_REPORT_HRM_WAGE_BY_ORG = `${APP_URL}/api/hrmEmployee/report-wage-by-org`;
export const API_REPORT_HRM_BY_EXPERT_CONTRACT = `${APP_URL}/api/hrmEmployee/report-hrm-about-expired-contract`;
export const API_REPORT_STATISTICAL_BOS = `${APP_URL}/api/report/report-statistical-bussinessoppotunities`;
export const API_REPORT_VISIT_CUSTOMER = `${APP_URL}/api/report/report-visit-customer`;
export const API_REPORT_TIME_FOR_JOB = `${APP_URL}/api/report-time`;
export const API_REPORT_HRM_BY_FEE_RECRUIMENT = `${APP_URL}/api/report-recruitment/report-hrm-recruitment-wave`;
export const API_REPORT_HRM_BY_FEE_RECRUIMENT_POSITION_PRICE = `${APP_URL}/api/report-recruitment/report-position-price-hrm-recruitment`;
export const API_REPORT_HRM_BY_FEE_RECRUIMENT_BIAS_PRICE = `${APP_URL}/api/report-recruitment/report-bias-price-hrm-recruitment`;
export const API_REPORT_HRM_BY_FEE_RECRUIMENT_AMOUNT = `${APP_URL}/api/report-recruitment/report-amount-hrm-recruitment`;
export const API_REPORT_HRM_BY_CANDIDATE = `${APP_URL}/api/candidate/report-by-unit`;

// api cusomers
export const API_CUSTOMERS = `${APP_URL}/api/customers`; // GET customer //POST customer // DELETE customer

export const API_KEY = '';
export const API_EXPORT = `${APP_URL}/api/customers`;
// api upload
export const UPLOAD_IMG_SINGLE = `${UPLOAD_APP_URL}/files/single`;
export const API_LOGOUT = `${APP_URL}/api/user-login`;
export const API_REPORT_USED = `${UPLOAD_APP_URL}/reportUsed`;
export const API_REPORT_USED_REPORT = `${UPLOAD_APP_URL}/reportCapacity`;

// view config
export const API_VIEW_CONFIG = `${APP_URL}/api/view-configs`; // +id user  //PUT view config

// api supplier
export const API_SUPPLIERS = `${APP_URL}/api/suppliers`;
export const API_STATUS_CRMCONFIG = `${APP_URL}/api/crm-status`; // +id user  //PUT view config
export const API_SOURCE_CRMCONFIG = `${APP_URL}/api/crm-source`; // +id user  //PUT view config

// api supplier
export const SUPPLIER = `${APP_URL}/api/suppliers`; // +id user  //PUT view config

// api template
export const API_TEMPLATE = `${DYNAMIC_FORM_URL}/api/dynamic-forms`;
export const API_TEMPLATE_LIST = `${DYNAMIC_FORM_URL}/api/dynamic-forms/list`;
export const API_NEWS_FEED = `${APP_URL}/api/news-feed`;

export const API_ADD_CANDIDATE = `${APP_URL}/api/candidate`;

export const API_TO_LINK = `${APP_URL}/api/hrmEmployee/tolink`;
export const API_TO_LINK_IDS = `${APP_URL}/api/hrmEmployee/tolinkIds`;

// CLONE MODULE

export const API_DOCS = `${APP_URL}/api/collections`;
export const API_PLUGINS = `${APP_URL}/api/plugins`;
// api expenses
export const API_EXPENSES = `${APP_URL}/api/cost-estimates`;

// api stock
export const API_STOCK = `${APP_URL}/api/inventory`;
// export const API_LOWER_LIMIT_STOCK = `${APP_URL}/api/inventory/`;
// export const API_UPPER_LIMIT_STOCK = `${APP_URL}/api/inventory/`;
// api sales-quotations
export const API_PRICE = `${APP_URL}/api/sales-quotations`;
// api profile
export const API_PROFILE = `${APP_URL}/api/employees/profile`;
export const API_IMPORT = `${APP_URL}/api/import`;
export const API_IMPORT_FIELD = `${APP_URL}/api/import-field`;
export const API_BOS = `${APP_URL}/api/business-opportunities`;
export const API_BUS_CALENDER = `${APP_URL}/api/business-opportunities/calendar`;
export const API_TRADINGS = `${APP_URL}/api/exchanging-agreements`;
export const API_CREATE_TRADDING_BY_BUS = `${APP_URL}/api/exchanging-agreements/create-by-businessOpportunities`;
export const API_TRADINGS_CALENDAR = `${APP_URL}/api/exchanging-agreements/calendar`;

// API sales-policy
export const API_SALE_POLICY = `${APP_URL}/api/sales-policy`;

// CLONE MODULE
// export const API_DOCS = `${APP_URL}/api/collections`;

// Configuration CRM
export const API_CURRENCY = `${APP_URL}/api/currency`;
export const API_MONEY = `${APP_URL}/api/moneys`;
export const API_LOCATION = `${APP_URL}/api/location`;
export const API_TAX = `${APP_URL}/api/tax`;
export const API_SALE = `${APP_URL}/api/sales-quotations`;
export const API_SALE_FOR_CONTRACT = `${APP_URL}/api/sales-quotations/for-contract`;

// contract
export const GET_CONTRACT = `${APP_URL}/api/contract`;
export const GET_TASK_CONTRACT = `${APP_URL}/api/tasks/contract`;
export const GET_CONTRACT_BY_TYPE = `${APP_URL}/api/contract/by-type`;
export const API_DYNAMIC_FORM = `${DYNAMIC_FORM_URL}/api/dynamic-forms`;
export const API_AUTOMATION = `${AUTOMATION_URL}/api/automation-rule`;
//new wf
export const API_WORKFLOW = `${AUTOMATION_URL}/api/automation/workflow`;
export const API_COMMON_MODULE_WORKFLOW = `${APP_URL}/api/common/module-dynamic-4-workflow`;

export const API_QUESTION = `${APP_URL}/api/question`;
export const API_RECRUITMENT_AGENCY = `${APP_URL}/api/hrm-recruitment-unit`;
export const API_EXAM = `${APP_URL}/api/exam`;
export const API_ROUND_EXAM = `${APP_URL}/api/round-exam`;
export const API_VANCANCIES = `${APP_URL}/api/vacancies`;
export const API_CANDIDATE = `${APP_URL}/api/hrmEmployee/candidate`;
export const API_CANDIDATE_LINK = `${APP_URL}/api/candidate-link`;
// bills
export const API_BILLS = `${APP_URL}/api/bills`;
export const API_BILLS_PRINT = `${APP_URL}/api/e-bill/print-bill`;
export const API_HRM_EDUCATE = `${APP_URL}/api/hrmEducate`;
// order
export const API_ORDER_PO = `${APP_URL}/api/orders-po`;

// Task Project
export const API_TASK_PROJECT = `${APP_URL}/api/tasks`;
export const API_TASK_CONTRACT_PROJECT = `${APP_URL}/api/tasks/projects`;
export const API_PROGRESS = `${APP_URL}/api/tasks/progress`;
export const API_TRANFER = `${APP_URL}/api/tasks/tranfer`;
// Cấu hình Task Project
export const API_TASK_CONFIG = `${APP_URL}/api/tasks/config`;
export const API_UPDATE_TASK_CONFIG = `${APP_URL}/api/tasks/config/update`;
export const API_CREAT_TASK_CONFIG = `${APP_URL}/api/tasks/config/create`;
export const API_DELETE_TASK_CONFIG = `${APP_URL}/api/tasks/config/delete`;

// Sample Process
export const API_SAMPLE_PROCESS = `${APP_URL}/api/templates`;

// thu chi
export const API_RNE = `${APP_URL}/api/revenue-expenditure`;
export const API_RNE_COUNT = `${APP_URL}/api/revenue-expenditure/count`;
export const API_RNE_ADVANCE = `${APP_URL}/api/advance-require`;
export const API_RNE_REMBUR = `${APP_URL}/api/reimbursement-require`;
export const API_PAYMENT = `${APP_URL}/api/payment-require`;
export const API_LOG = `${APP_URL}/api/logs`;
export const API_NOTIFY = `${APP_URL}/api/notifications`;
export const API_MEETING = `${APP_URL}/api/metting-schedule`;
export const API_VISIT = `${APP_URL}/api/business-visit`;
// nhập kho
export const API_STOCK_IMPORT = `${APP_URL}/api/stock-import`;
export const API_STOCK_EXPORT = `${APP_URL}/api/stock-export`;
export const API_MAPPING_CONVERT = `${APPROVE_URL}/api/convert-mapping`;
export const CONTACT_CENTER = `${APP_URL}/api/contact-center`;

// chat
export const API_CONVERSATION = `${APP_URL}/api/conversation`;
export const API_CONVERSATION_LIST = `${APP_URL}/api/employees/list-conversation`;
export const API_REMOVE_MESSAGE = `${APP_URL}/api/conversation/message/removeMessage`;
export const API_UPDATE_MESSAGE = `${APP_URL}/api/conversation/message/editMessage`;
export const API_UPDATE_EMOTION = `${APP_URL}/api/conversation/message/updateEmotion`;
// export const API_DATA_FORM = `${APP_URL}/api/collections/for-template`;

// delivery
export const API_DELIVERY = `${APP_URL}/api/delivery`;

export const API_CODE_CONFIG = `${APP_URL}/api/code-config`;
// HRM
export const API_STATUS_HRMCONFIG = `${APP_URL}/api/hrm-status`;
export const API_SOURCE_HRMCONFIG = `${APP_URL}/api/hrm-source`;

// công văn
export const API_DISPATCH = `${APP_URL}/api/documentary`;
export const API_DISPATCH_INCOMING = `${APP_URL}/api/documentary/incoming-document`;
export const API_DISPATCH_OUTGOING = `${APP_URL}/api/documentary/incoming-document`;

export const API_NOTE = `${APP_URL}/api/note`;
export const API_REPORT = `${APP_URL}/api/report`;

export const API_PERSONNEL = `${APP_URL}/api/hrmEmployee`;
export const API_PERSONNEL_REPORT = `${APP_URL}/api/report-employee-management/hrm`;
export const API_INCREASES_OR_DECREASES = `${APP_URL}/api/hrmEmployee/report-by-kanban-status-in-year`;
export const API_LATE_AND_LEAVE = `${APP_URL}/api/timekeeping/reportPeopleCheckin`;
export const API_HRM_BY_MONTH = `${APP_URL}/api/hrmEmployee/report-hrm-by-month`;
export const API_WAGE_BY_MONTH = `${APP_URL}/api/hrmEmployee/report-wage-by-month`;
export const API_RECRUITMENT = `${APP_URL}/api/hrm-recruitment`;
export const API_RECRUITMENT_WAVE = `${APP_URL}/api/hrm-recruitment-wave`;
export const API_FINISH_EXAM = `${APP_URL}/api/round-exam/finishExam`;
export const API_CAMPAIGN = `${APP_URL}/api/campaign`;
export const API_SHARE_INSURANCE = `${APP_URL}/api/insurance-information/list-change-insurrance`;
export const API_INSURANCE_INFOMATION_HISTORY = `${APP_URL}/api/insurance-information/history-insurrance`;

// vote
export const API_VOTE = `${APP_URL}/api/vote`;
export const API_COMMENT = `${APP_URL}/api/comment`;

export const API_ROLE_APP = `${APP_URL}/api/roleApp`;
export const API_MAIL = `${APP_URL}/api/mail`;

// dashboard hrm
export const API_HRM_REPORT = `${APP_URL}/api/hrmReport`;
export const API_HRM_TIMEKEEPPTABLE = `${APP_URL}/api/timekeeping/Detail`;
// TT :
export const API_CREATE_CONFIG_CODE = `${APP_URL}/api/generate`;
export const API_GET_CONFIG_CODE = `${APP_URL}/api/generate`;

export const API_HRM_SALARY = `${APP_URL}/api/salary-development`;
export const API_HRM_SOCIAL = `${APP_URL}/api/insurance-information`;
export const API_HRM_SOCIAL_NEW = `${APP_URL}/api/insurance-information/list-change-insurrance`;
export const API_HRM_EXPERIENCE = `${APP_URL}/api/work-experience`;
export const API_HRM_PROCESS = `${APP_URL}/api/work-progress`;
export const API_HRM_MATERNITY = `${APP_URL}/api/maternity-process`;
export const API_HRM_INDENTURE = `${APP_URL}/api/contract-process`;
export const API_HRM_EDUCATION = `${APP_URL}/api/educate-process`;
export const API_HRM_BONUS = `${APP_URL}/api/bonus-process`;
export const API_HRM_DISCIPLINE = `${APP_URL}/api/discipline-process`;
export const API_HRM_SABBATICAL = `${APP_URL}/api/information-takeleave`;
export const API_HRM_RELATION = `${APP_URL}/api/informaion-relationship`;

export const API_HRM_DISMISSED = `${APP_URL}/api/concurrently`;
export const API_HRM_PRAISE = `${APP_URL}/api/bonusChild`;
export const API_HRM_BUSINESS_TRIP = `${APP_URL}/api/businessTrip`;

export const API_TIMEKEEPING = `${APP_URL}/api/timekeeping`;
export const API_TIMEKEEPING_TABLE = `${APP_URL}/api/timekeepingTable`;
export const API_TIMEKEEPING_LOG = `${APP_URL}/api/timekeeping/log`;
export const API_TIMEKEEPING_EQUIPMENT = `${APP_URL}/api/timekeepingequipment`;
export const API_TIMEKEEPING_EQUIPMENT_2 = `${APP_URL}/api/hrm2equipment`;
export const API_TIMEKEEPING_ADDEQUIPMENT = `${APP_URL}/api/hrm2equipment`;
export const API_TAKE_LEAVE = `${APP_URL}/api/takeleave`;
export const API_OVER_TIME = `${APP_URL}/api/overtime`;
export const API_PLAN_OT = `${APP_URL}/api/overtime-plan`;

// TIMEKEEPING CHECK IN
export const API_TIMEKEEPING_2 = `${APP_URL}/api/timekeeping/face-check-in`;

// import
export const API_IMPORT_TIMEKEEPING = `${APP_URL}/api/timekeeping/import`;

export const API_BANK_ACCOUNT = `${APP_URL}/api/bank-account`;
// config hrm

export const API_HRM_HOLIDAY = `${APP_URL}/api/hrmHolidays`;
export const API_HRM_TIMEKEEP_TYPE = `${APP_URL}/api/hrmTimekeepingType`;
export const API_HRM_SYMBOL = `${APP_URL}/api/hrmTimekeepingSymbol`;
export const API_HRM_SALARY_CATEGORY = `${APP_URL}/api/hrmWageSource`;
export const API_HRM_SHIFT = `${APP_URL}/api/shift`;
export const API_HRM_PROJECT_BONUS = `${APP_URL}/api/project-bonus`;
// config salary
export const API_DATA_SALARY = `${APP_URL}/api/timekeeping/contract-2-allowance`;
export const API_SALARY_FORMULA = `${APP_URL}/api/formula`;
export const API_PUT_BILL = `${APP_URL}/api/cyber-bill/search-bill`;
export const API_PUT_BILL_ORIGIN = `${APP_URL}/api/e-bill/send-bill`;
export const API_ATTRIBUTE_FORMULA = `${APP_URL}/api/attributeformula`;
export const API_ATTRIBUTE_LISTATTRIBUTE = `${APP_URL}/api/attributeformula/listattribute`;
// export const API_HRM_WAGES = `${APP_URL}/api/hrmHolidays`;
export const API_HRM_WAGES = `${APP_URL}/api/hrmWage`;

// check Duplicate data
export const API_CHECK_DUPLICATE_DATA = `${APP_URL}/api/check-duplicate`;
export const API_CHECK_DUPLICATE_USERNAME = `${BASE_URL}/check-duplicate`;

// wages Salary
export const API_TITLE_WAGES_SALARY = `${APP_URL}/api/attributeformula/attributeformula`;
export const API_TIMEKEEPING_PAYCHECK = `${APP_URL}/api/timekeeping/paycheck`;

// TakeLeaveManager
export const API_TAKE_LEAVE_MANAGER = `${APP_URL}/api/takeleave-manager`;
export const API_HRM_EMPLOYEE = `${APP_URL}/api/hrmEmployee`;
export const API_HUMAN_RESOURCE = `${APP_URL}/api/human-resource`;

export const API_VIEW_CONFIG_FORMULA = `${APP_URL}/api/viewconfig-formula`;

// reports
export const API_TASK_EXPORT = `${APP_REPORT_URL}/api/tasks/export`;
export const API_RECRUIMENT_WAVE = `${APP_URL}/api/hrm-recruitment-wave/report`;
// KPI
export const API_CRITERIA = `${APP_REPORT_URL}/api/kpi`;

// Favorite
export const API_REPORT_FAVORITE_BANK_BLANCE = `${APP_REPORT_URL}/api/report-favorite/bank-balance`;
export const API_REPORT_FAVORITE_COST = `${APP_REPORT_URL}/api/report-favorite/cost-ratio-year`;
export const API_REPORT_FAVORITE_SALES = `${APP_REPORT_URL}/api/report-favorite/sales-employees`;

// General
export const API_REPORT_COST_REVENUE = `${APP_REPORT_URL}/api/report-debt/cost-revenue`;
export const API_REPORT_DEPT_COST_PRICE = `${APP_REPORT_URL}/api/report-debt/cost-price`;
// export const API_REPORT_REVENUE_INVENTORY_BY_TIME = `${APP_REPORT_URL}/api/report/revenue-inventory-by-time`;
export const API_REPORT_REVENUE_INVENTORY_BY_TIME = `https://g.lifetek.vn:220/api/report-debt/aggregate-revenue`;

export const API_REPORT_DEBT_BY_TIME = `${APP_REPORT_URL}/api/report-debt/business-situation`;

// Cost
export const API_REPORT_RATIO_ITME = `${APP_REPORT_URL}/api/cost-management/cost-ratio-item`;
export const API_REPORT_COST_MANAGEMENT = `${APP_REPORT_URL}/api/cost-management/cost-ratio`;

// dept
export const API_REPORT_ACCOMPLISH_GOAL = `${APP_REPORT_URL}/api/report-debt/to-pay`;
export const API_DEPT_EMPLOYEE = `${APP_REPORT_URL}/api/report-debt/employee`;
export const API_REPORT_RECEIVABLES = `${APP_REPORT_URL}/api/report-debt/receivables`;

// reports sales
// export const API_TOP_SALES_CUSTOMER = `${APP_REPORT_URL}/api/report/top-sales-customer`;
// export const API_TOP_SALES_PRODUCTS = `${APP_REPORT_URL}/api/report/top-sales-product`;
// export const API_SALES_MANAGEMENT = `${APP_REPORT_URL}/api/report-sales-management/kpi-sales`;
// export const API_TARGET_SALES_MONTH = `${APP_REPORT_URL}/api/report-sales-management/monthly-sales-target`;

export const API_TOP_SALES_CUSTOMER = `${APP_REPORT_URL}/api/report-sales-management/top-sales-customer`;
export const API_TOP_SALES_PRODUCTS = `${APP_REPORT_URL}/api/report-sales-management/top-sales-product`;
export const API_SALES_MANAGEMENT = `${APP_REPORT_URL}/api/report-sales-management/kpi-sales`;
export const API_TARGET_SALES_MONTH = `${APP_REPORT_URL}/api/report-sales-management/monthly-sales-target`;

export const API_REPORT_INVENTORY = `${APP_REPORT_URL}/api/report/inventory-report-by-month`;
export const API_REPORT_SUM_IN_YEAR = `${APP_REPORT_URL}/api/report/report-expense-in-year`;
export const API_REPORT_CHARGE_PROPORTION = `${APP_REPORT_URL}/api/report/report-expense-by-type`;
export const API_REPORT_SUM_REVENUE_COST_IN_YEAR = `${APP_REPORT_URL}/api/report/aggregatesales-customer-merchandise`;
export const API_REPORT_SUM_REVENUE_INVENTORY_IN_YEAR = `${APP_REPORT_URL}/api/report/sales-inventory`;

export const API_REPORT_TASK_WEEK = `${APP_REPORT_URL}/api/report/task-week`;
export const API_REPORT_TASK_DEBT = `${APP_REPORT_URL}/api/report/task-debt`;
export const API_REPORT_TASK_SUMMARY = `${APP_REPORT_URL}/api/report/task-summary`;
export const API_REPORT_TASK_VALUE_AND_PAID = `${APP_REPORT_URL}/api/report/task-value-and-paid`;

// Employee
export const API_REPORT_FINISH_LEVEL = `${APP_REPORT_URL}/api/report-employee-management/accomplish-goal`;
export const API_REPORT_EMPLOYEE_KPI_SALES = `${APP_REPORT_URL}/api/report-employee-management/sales`;
// CASH
export const API_REPORT_MONEY_MANAGEMENT = `${APP_REPORT_URL}/api/money-management/statistical-receipt`;
export const API_REPORT_MANAGEMENT_MONEY = `${APP_URL}/api/money-management/statistical-receipt`;
export const API_REPORT_TOP_CUSTOMER_MONEY = `${APP_REPORT_URL}/api/money-management/top-customer-receipts-month`;

// process
export const API_REPORT_TASK_PROCESS = `${APP_REPORT_URL}/api/report-task/progress`;
// Customer
export const API_REPORT_CUSTOMER_SELL = `${APP_REPORT_URL}/api/report-customer/number-sell`;
export const API_REPORT_FREQUENCY_SELL = `${APP_REPORT_URL}/api/report-customer/frequency-sell`;

export const API_REPORT_EXPENSE_REPORT_BY_TYPE = `${APP_REPORT_URL}/api/report/business-synthesis-report`;
export const API_REPORT_AGGREGATE_SALES_OF_BUSINESS_STAff = `${APP_REPORT_URL}/api/report/aggregatesales-of-businesstaff`;
export const API_REPORT_AGGREGATE_SALES_OF_SALES_STAff = `${APP_REPORT_URL}/api/report/aggregatesales-of-salesstaff`;
export const API_REPORT_TASKS_STATUS = `${APP_REPORT_URL}/api/report/tasks-status`;

// report stock
export const API_REPORT_PRODUCT_INVENTORY = `${APP_REPORT_URL}/api/report-product/inventory`;
export const API_REPORT_STOCK_INVENTORY_BY_YEAR = `${APP_REPORT_URL}/api/report-product/inventory-by-year`;

//
export const API_UPLOAD_IMAGE_AI = `${UPLOAD_AI_URL}/insert`;

export const UPLOAD_FILE_METADATA = `${UPLOAD_APP_URL}/file-system/company/metadata`;

export const API_LT_ACCOUNT = `${APP_URL}/api/lt-account`;

// Asset
export const API_ASSET = `${APP_URL}/api/asset`;
export const API_ASSET_ALLOCATE_LOG = `${APP_URL}/api/asset/log`;
export const API_ASSET_ALLOCATION = `${APP_URL}/api/asset/allocation`;

export const API_HISTORY = `${APP_URL}/api/modulehistory`;

///
export const API_E_BILL_PROVIDER_LIST = `${APP_URL}/api/e-bill/provider/list`;
export const API_E_BILL_PROVIDER_SEARCH = `${APP_URL}/api/e-bill/provider`;
export const API_E_BILL_PROVIDER = `${APP_URL}/api/e-bill/provider`;

//đăng tuyển
export const API_HRM_RECRUIT = `${APP_URL}/api/hrm-recruitment-wave/hrmRecruit`;
//đào tạo
export const API_EDUCATE_PLAN = `${APP_URL}/api/educate-plan`;
export const API_EDUCATE_ROUND = `${APP_URL}/api/educate-round`;
//  view-config
export const API_UPDATE_ALL_SYSTEM = `${APP_URL}/api/view-configs/updateAllSystem`;
//follow  and add fr
export const API_FOLLOWED_EMPLOYEE = `${APP_URL}/api/followed-employee`;
export const API_FOLLOWED_EMPLOYEE_SUGGEST = `${APP_URL}/api/followed-employee/suggest`;
export const API_EMPLOYEE_FRIEND = `${APP_URL}/api/employees/friend`;
export const API_EMPLOYEE_FRIENDREPLY = `${APP_URL}/api/employees/friendreply`;
export const API_ADD_EMPLOYEE_FRIEND = `${APP_URL}/api/employees/friend`;
export const API_GET_EMPLOYEE_FRIEND = `${APP_URL}/api/employees/list-friend`;
export const API_EMPLOYEE_CHECK_RELATIONSHIP = `${APP_URL}/api/employees/check-relationship`;
export const API_VERSION_CONFIG = `${APP_URL}/api/version-system/version`;

// hóa đơn PDF
export const API_E_BILL_PRINT_UNSIGNED_BILL = `${APP_URL}/api/e-bill/print-unsigned-bill`;
export const API_ROLEAPP_CHANGE_PASSWORD_PERSON = `${APP_URL}/api/roleApp/admin-change-password`;
export const API_GET_EMPLOYEE_BY_USER = `${APP_URL}/api/employees/get-by-username`;
export const API_CONVERSATION_MESSAGE_UN_READ = `${APP_URL}/api/conversation/message/unRead`;
export const API_CONVERSATION_MESSAGE_UNREADCONVERSASION = `${APP_URL}/api/conversation/message/unreadConversation`;

export const API_TAKE_LEAVE_MANAGER_LISTBYHRMEMPLOYEE = `${APP_URL}/api/takeleave-manager/listByHrmEmployee`;
export const API_SMART_FORM_URL = `${API_SMART_FORM}/detect`;
export const API_SMART_FORM_PDF_URL = `${API_SMART_FORM}/detect_pdf`;

//sms
export const API_SMS1 = `${APP_URL}/api/campaign/sendsms`;
export const API_ROUND_EXAM_EXAMINATION = `${APP_URL}/api/round-exam/examination`;

