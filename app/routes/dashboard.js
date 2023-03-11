// import React from 'react';
import { MODULE_CODE } from 'utils/constants';
import ListOfDepartmentPage from 'containers/ListOfDepartmentPage/Loadable';
// import PublicRoute from 'components/PublicRoute';
// import PrivateRoute from 'components/PrivateRoute';
// import MainLayout from 'components/MainLayout';
import AddUserPage from 'containers/AddUserPage/Loadable';
// import LoginPage from 'containers/LoginPage';
// import Login from 'views/Login';
// import EmptyLayout from '../../components/EmptyLayout';
import UsersPage from 'containers/UsersPage/Loadable';
import RoleGroupPage from 'containers/RoleGroupPage';
import SystemConfigPage from 'containers/SystemConfigPage';
import StockPage from 'containers/StockPage/Loadable';

// import BusinessOpportunities from 'containers/BusinessOpportunities';
// import Calendar from 'containers/CalendarPage';
import {
  Dashboard,
  Apps,
  Widgets,
  DateRange,
  Settings,
  AssignmentInd,
  BusinessCenter,
  Equalizer,
  Commute,
  CardTravel,
  Assignment,
  Receipt,
  Dns,
} from '@material-ui/icons';
// import DetailBusinessOpportunities from 'containers/DetailBusinessOpportunities';
// import ExchangingAgreement from 'containers/ExchangingAgreement';
// import ExchangingAgreementDetail from '../containers/ExchangingAgreementDetail';
import AddRolesGroupPage from '../containers/AddRolesGroupPage';
import AddCustomerPage from '../containers/AddCustomerPage/Loadable';
// import Demo from '../views/Demo';
import CrmConfigPage from '../containers/CrmConfigPage';
// import CustomerPage from '../containers/CustomerPage';
// import Kanban from '../components/Kanban';
import PropertiesGroup from '../containers/AddPropertiesGroup';
import AddPropertie from '../containers/AddPropertie';
import DetailProductPage from '../containers/DetailProductPage/Loadable';
import StockConfigPage from '../containers/StockConfigPage/Loadable';
import StockExportPage from '../containers/StockExportPage/Loadable';
import StockImportPage from '../containers/StockImportPage/Loadable';
import PropertiesPage from '../containers/PropertiesPage';
import TemplatePage from '../containers/TemplatePage';
import TaskPage from '../containers/TaskPage/Loadable';
import AddTemplatePage from '../containers/AddTemplatePage/Loadable';
import AddTtPage from '../containers/AddTtPage/Loadable';
import AddNewsFeed from '../containers/AddNewsFeed/Loadable';
import NewsFeed from '../containers/NewsFeed/Loadable';
import AddAutomations from '../containers/AddAutomations/Loadable';
import Automations from '../containers/Automations/Loadable';
import HistotyLog from '../containers/UsersPage/HistoryLogin';
// import ExchangingAgreementReport from '../components/Report/ExchangingAgreementReport';

// import EmailForm from '../components/Email';
import CrmCollection from '../containers/CrmCollection/Loadable';
import AddNewCrmCollection from '../containers/AddNewCrmCollection/Loadable';
import AddNewProductPage from '../containers/AddNewProductPage';
import InventoryDetailPage from '../containers/InventoryDetailPage';
import EmailSms from '../containers/EmailSms';
import TemplateTypePage from '../containers/TemplateTypePage';
import EditProductPage from '../containers/EditProductPage';

// import WorkFlowPage from '../containers/WorkFlowPage';
// import AddWorkFlowPage from '../containers/AddWorkFlowPage/Loadable';
import ApproveGroupPage from '../containers/ApproveGroupPage';
// import ExpensesPage from '../containers/ExpensesPage';
import ApproveGroupDetailPage from '../containers/ApproveGroupDetailPage';
import OrganizationalStructurePage from '../containers/OrganizationalStructurePage';
import TaskProgress from '../components/TaskProgress/Loadable';
import PersonnelPage from '../containers/PersonnelPage/Loadable';
import PersonalPage from '../containers/PersonalPage/Loadable';
import WagesPage from '../containers/WagesPage/Loadable';
import RecruitmentPage from '../containers/RecruitmentPage/Loadable';
import EducatePage from '../containers/EducatePage/Loadable';
import ConfigHrmPage from '../containers/ConfigHrmPage/Loadable';

import AddExpensesPage from '../containers/AddExpensesPage/Loadable';
import AddSupplierPage from '../containers/AddSupplierPage/Loadable';
import AddPropertiesSet from '../containers/AddPropertiesSet/Loadable';
import AddBillPage from '../containers/AddBillPage/Loadable';
import EditPropertiesSet from '../containers/EditPropertiesSet';
import ImportPage from '../containers/ImportPage';
import AddContractPage from '../containers/AddContractPage/Loadable';
import AddSupplierContract from '../containers/AddSupplierContract/Loadable';
// import ProfilePage from '../containers/ProfilePage/Loadable';
import EditProfilePage from '../containers/EditProfilePage';
import AddSalesQuotation from '../containers/AddSalesQuotation/Loadable';
import RevenueAndExpenditure from '../containers/RevenueAndExpenditure/Loadable';
import BankAccount from '../containers/BankAccount/Loadable';
import AddRevenueAndExpenditurePage from '../containers/AddRevenueAndExpenditurePage/Loadable';
import AddImportProduct from '../containers/AddImportProduct/Loadable';
// import ImportItemsPage from '../containers/ImportItemsPage';
import AddSalesPolicy from '../containers/AddSalesPolicy/Loadable';
import AddEmail from '../containers/AddEmail/Loadable';
// import AddTask from '../containers/AddTask/Loadable';
import SampleProcess from '../containers/SampleProcess/Loadable';
import AddSampleProcess from '../containers/AddSampleProcess/Loadable';
import ImportProduct from '../containers/ImportProduct';
// import ProjectPage from '../containers/ProjectPage';
import AddProjects from '../containers/AddProjects/Loadable';
import ConfigTask from '../containers/ConfigTask/Loadable';
import AddAdvancePage from '../containers/AddAdvancePage/Loadable';
import AddReimbursementRequirePage from '../containers/AddReimbursementRequirePage/Loadable';
// import TaskRelatePage from '../containers/TaskRelatePage';
import DashboardHome from '../containers/DashboardHome';
import Home from '../containers/Home';
import AddImportStock from '../containers/AddImportStock/Loadable';
import AddExportStockPage from '../containers/AddExportStockPage/Loadable';
import AddLtAccountPage from '../containers/AddLtAccountPage/Loadable';
import AddBankAccountPage from '../containers/AddBankAccountPage/Loadable';
import AddPaymentPage from '../containers/AddPaymentPage/Loadable';
import ReportPage from '../containers/ReportPage';
import ContactCenterPage from '../containers/ContactCenterPage';
import ContactCenterFormPage from '../containers/ContactCenterFormPage';
import DeliveryPage from '../containers/DeliveryPage/Loadable';
import DeliveryPageForm from '../containers/DeliveryPageForm';
import KpiPage from '../containers/KpiPage/Loadable';
import KpiConfig from '../containers/KpiConfig/Loadable';
import CriteriaPage from '../containers/CriteriaPage/Loadable';
import KpiProject from '../containers/KpiProject/Loadable';
import KpiEvaluate from '../containers/KpiEvaluate/Loadable';
import AddKpiEvaluate from '../containers/AddKpiEvaluate/Loadable';
import KpiExchange from '../containers/KpiExchange/Loadable';
// import PersonalPage from '../containers/PersonalPage/Loadable';
import AddPersonnel from '../containers/AddPersonnel/Loadable';
import ReportHrmPage from '../containers/ReportHrmPage/Loadable';
import AddMeetingSchedule from '../containers/AddMeetingSchedule/Loadable';
import MeetingRoom from '../containers/MeetingRoom/Loadable';
// import EducatePage from '../containers/EducatePage/Loadable';
import DispatchManager from '../containers/DispatchManager/Loadable';
import AddDispatchManagerPage from '../containers/AddDispatchManagerPage/Loadable';
import DispatchManagerGo from '../containers/DispatchManagerGo/Loadable';
import FileManager from '../containers/FileManager';
import AddKpiConfig from '../containers/AddKpiConfig/Loadable';
import MeetingCalendar from '../containers/MeetingPage';
import TaskInvite from '../components/TaskInvite';
import WorkingSchedule from '../containers/WorkingSchedule/Loadable';
import AddWorkingSchedule from '../containers/AddWorkingSchedule/Loadable';
import FieldList from '../containers/ListField';
import Field from '../containers/Field';

import SocialInsurance from '../containers/HRM/HrmSocialInsurance/Loadable';
import FaceRecognition from '../containers/FaceRecognition/Loadable';
import BonusPage from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/BonusPage';
import IndenturePage from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/IndenturePage';
import Currency from '../components/Currency';
import DisciplineProcess from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/DisciplineProcess';
import OverTimeManager from '../containers/HRM/HrmWages/OverTimeManager';
import HrmRecruitmentWave from '../containers/HRM/HrmRecruitment/HrmRecruitmentWave';
import HrmRecruitmentManagement from '../containers/HRM/HrmRecruitment/HrmRecruitmentManagement';
import AddWages from '../containers/HRM/HrmWages/WagesManagement/components/AddWages';
import RelationsPage from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/RelationsPage';
import SabbaticalPage from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/SabbaticalPage';
import SocialPage from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/SocialPage';
import TakeLeaveManager from '../containers/HRM/HrmWages/TakeLeaveManager';
import ExperiencePage from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/ExperiencePage';
import ReportTaskStatus from '../containers/ReportReportCustomer/components/ReportTaskStatus';
import ProcessPage from '../containers/HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/ProcessPage';

// Warehouse Module
import AssetPage from '../containers/WarehouseModule/AssetPage/Loadable';
import EditAssetPage from '../containers/WarehouseModule/AssetPage/EditAssetPage';
import EditLiquidationPage from '../containers/WarehouseModule/AssetPage/EditLiquidationPage';

// Warehouse Module
import AllocationPage from '../containers/WarehouseModule/AllocationPage/Loadable';
import EditAllocationPage from '../containers/WarehouseModule/AllocationPage/EditAllocationPage/Loadable';

// import Drive from '../components/Drive';
import LtAccount from '../containers/LtAccount';
import AddEmailCampaign from '../containers/AddEmailCampaign';

import Automation from '../containers/BPMN/App';
const dashRoutes = [
  {
    path: '/',
    name: 'dashboard',
    icon: Dashboard,
    extract: true,
    component: DashboardHome,
  },
  // {
  //   path: '/Task/home',
  //   name: 'Home',
  //   icon: Dashboard,
  //   extract: true,
  //   component: Home,
  //   hide: true,
  // },
  // {
  //   path: '/drive',
  //   name: 'Drive',
  //   mini: 'RP',
  //   icon: Dashboard,
  //   component: Drive,
  // },

  {
    collapse: true,
    path: '/Task',
    name: 'jobproject',
    state: 'openTask',
    dynamicNode: true,
    component: TaskPage,
    defaultModuleCode: 'Task',
    icon: BusinessCenter,
    views: [
      {
        path: '/Task/TemplateTask',
        name: 'sampleprocess',
        mini: 'SP',
        component: SampleProcess,
        moduleCode: 'TemplateTask',
      },
      {
        path: '/Task/TaskConfig',
        name: 'configtask',
        mini: 'CF',
        component: ConfigTask,
        moduleCode: 'TaskConfig',
      },
      {
        path: '/Task/invite',
        name: 'taskinvite',
        mini: 'SP',
        component: TaskInvite,
        hide: true,
      },
      {
        path: '/Task/time',
        name: 'taskprogress',
        mini: 'SP',
        component: TaskProgress,
        hide: true,
      },
    ],
  },
  {
    path: '/Task/:id',
    name: 'Thêm công việc cho dự án',
    mini: 'SP',
    component: AddProjects,
    empty: true,
    hide: true,
  },

  {
    path: '/Task/TemplateTask/:id',
    name: 'Mẫu công việc',
    mini: 'SP',
    empty: true,
    hide: true,
    component: AddSampleProcess,
  },
  {
    path: '/crm/add',
    name: 'Thêm mới',
    mini: 'RP',
    component: AddNewCrmCollection,
    hide: true,
    empty: true,
  },

  {
    collapse: true,
    path: '/crm/BusinessOpportunities',
    name: 'crm',
    state: 'openPages',
    icon: AssignmentInd,
    component: CrmCollection,
    dynamicNode: true,
    defaultModuleCode: 'BusinessOpportunities',
    // childModules: ["BusinessOpportunities, SalesPolicy, ExchangingAgreement, Contract, SalesQuotation, Bill, OrderPo"],
    views: [
      {
        path: '/crm/module/:code',
        name: 'Clone module',
        mini: 'TP',
        component: CrmCollection,
        hide: true,
        moduleCode: 'BusinessOpportunities',
      },
      {
        path: '/crm/SalesPolicy',
        name: 'salespolicy',
        mini: 'CF',
        component: CrmCollection,
        hide: false,
        moduleCode: 'SalesPolicy',
      },
      {
        path: '/crm/SalesPolicy/:id',
        name: 'supplier',
        mini: 'RS',
        component: AddSalesPolicy,
        hide: true,
      },

      {
        path: '/crm/Customer',
        name: 'customer',
        mini: 'RS',
        component: CrmCollection,
        hide: false,
        moduleCode: 'Customer',
      },
      {
        path: '/crm/Supplier',
        name: 'supplier',
        mini: 'RS',
        component: CrmCollection,
        hide: false,
        moduleCode: 'Supplier',
      },
      {
        path: '/crm/ConfigCRM',
        name: 'config',
        mini: 'CF',
        component: CrmCollection,
        hide: false,
      },
      {
        path: '/crm/Supplier/:id',
        name: 'Nhà cung cấp',
        mini: 'RS',
        component: AddSupplierPage,
        hide: true,
      },

      {
        path: '/crm/Customer/:id',
        name: 'Thêm Khách hàng',
        mini: 'RS',
        component: AddCustomerPage,
        hide: true,
      },

      {
        path: '/crm/reports',
        name: 'Báo cáo',
        mini: 'RP',
        component: CrmCollection,
        hide: true,
      },
      {
        path: '/crm/import-product',
        name: 'purchase',
        icon: 'NH',
        component: CrmCollection,
        hide: true,
      },

      // {
      //   path: '/crm/log',
      //   name: 'Log',
      //   mini: 'SC',
      //   component: CrmCollection,
      //   hide: false,
      // },
      {
        path: '/crm/BusinessOpportunities',
        name: 'businessopportunities',
        mini: 'TP',
        component: CrmCollection,
        hide: true,
        moduleCode: 'BusinessOpportunities',
      },
      {
        path: '/crm/BusinessOpportunities/:id',
        name: 'businessopportunities',
        mini: 'TP',
        component: CrmCollection,
        hide: true,
        moduleCode: 'BusinessOpportunities',
      },
      {
        path: '/crm/ExchangingAgreement',
        name: 'exchangeofagreement',
        mini: 'TD',
        component: CrmCollection,
        hide: true,
        moduleCode: 'ExchangingAgreement',
      },
      {
        path: '/crm/ExchangingAgreement/:id',
        name: 'exchangeofagreement',
        mini: 'TP',
        component: CrmCollection,
        hide: true,
        moduleCode: 'ExchangingAgreement',
      },
      {
        path: '/crm/CostEstimate',
        name: 'costestimates',
        mini: 'RS',
        component: CrmCollection,
        hide: true,
        moduleCode: 'CostEstimate',
      },
      {
        path: '/crm/CostEstimate/:id',
        name: 'costestimates',
        mini: 'RS',
        component: AddExpensesPage,
        hide: true,
      },
      {
        path: '/crm/SalesQuotation',
        name: 'salesquotation',
        mini: 'PR',
        component: CrmCollection,
        hide: true,
        moduleCode: 'SalesQuotation',
      },
      {
        path: '/crm/SalesQuotation/:id',
        name: 'Nhà cung cấp',
        mini: 'RS',
        component: AddSalesQuotation,
        hide: true,
      },

      {
        path: '/crm/Contract',
        name: 'contract',
        mini: 'CT',
        component: CrmCollection,
        hide: true,
        moduleCode: 'Contract',
      },
      {
        path: '/crm/OrderPo',
        name: 'purchase',
        mini: 'CT',
        component: CrmCollection,
        hide: true,
        moduleCode: 'OrderPo',
      },
      {
        path: '/crm/Bill',
        name: 'bill',
        mini: 'BI',
        component: CrmCollection,
        hide: true,
        moduleCode: 'Bill',
      },
      {
        path: '/crm/ContactCenter',
        name: 'multichannelsales',
        mini: 'SC',
        component: ContactCenterPage,
        hide: false,
      },
    ],
  },
  /// end crm
  {
    // empty: true,
    collapse: true,
    path: '/hrm',
    name: 'hrm',
    state: 'openHrm',
    component: ReportHrmPage,
    defaultModuleCode: 'hrm',
    dynamicNode: true,
    icon: AssignmentInd,
    views: [
      // hồ sơ nhân sự
      {
        path: '/hrm/personnel',
        name: 'hrrecords',
        mini: 'PN',
        component: PersonnelPage,
        // isNode: true,
        moduleCode: 'hrm',
        // childModules: ['TakeLeaveManager', 'hrm'],
        childModules: ['TakeLeaveManager', 'hrmPersonnelManagement', 'hrmPersonnelRecordsManagement', 'hrm'],
      },
      {
        path: '/hrm/HRMWage',
        name: 'salary',
        mini: 'WG',
        component: WagesPage,
        // isNode: true,
        moduleCode: 'HRMWage',
        childModules: ['TakeLeaveManager', 'hrm'],
      },
      {
        path: '/hrm/HrmRecruitment',
        name: 'recruitment',
        mini: 'WG',
        component: RecruitmentPage,
        // isNode: true,
        moduleCode: 'HrmRecruitment',
        childModules: ['HrmRecruitment', 'HrmRecruitmentWave'],
      },
      {
        path: '/hrm/HrmEducate',
        name: 'educate',
        mini: 'EP',
        component: EducatePage,
        moduleCode: 'HrmEducate',
        childModules: ['EducatePlan', 'EducateRound'],
      },
      {
        path: '/hrm/InsuranceInformation',
        name: 'socialinsurance',
        mini: 'SI',
        component: SocialInsurance,
        moduleCode: 'InsuranceInformation',
      },
      {
        path: '/hrm/HrmSource',
        name: 'config',
        mini: 'CF',
        component: ConfigHrmPage,
        moduleCode: 'HrmSource',
      },
      // {
      //   path: '/hrm/face-recognition',
      //   name: 'Chấm công',
      //   mini: 'CF',
      //   moduleCode: 'TimeKeepingEquipment',
      //   component: FaceRecognition,
      // },
    ],
  },
  {
    path: '/hrm/personnel/:id',
    name: 'Thêm mới nhân sự',
    component: AddPersonnel,
    icon: Widgets,
    empty: true,
  },

  {
    path: '/Stock/stockListProduct/inventory/:id',
    name: 'Chi tiết sản phẩm',
    icon: Widgets,
    component: InventoryDetailPage,
    empty: true,
  },
  {
    path: '/Stock/detail/:id',
    name: 'Chi tiết sản phẩm',
    icon: Widgets,
    component: DetailProductPage,
    empty: true,
  },
  {
    path: '/Stock/add',
    name: 'Chi tiết sản phẩm',
    icon: Widgets,
    component: AddNewProductPage,
    empty: true,
  },
  {
    path: '/Stock/stockListProduct/add',
    name: 'Chi tiết sản phẩm',
    icon: Widgets,
    component: AddNewProductPage,
    empty: true,
  },
  {
    path: '/import',
    name: 'Nhập excel',
    icon: Widgets,
    component: ImportPage,
    empty: true,
  },

  {
    collapse: true,
    path: '/Stock',
    name: 'stock',
    state: 'openComponents',
    component: StockPage,
    dynamicNode: true,
    icon: Apps,
    defaultModuleCode: 'stockListProduct',

    // exact: true,
    views: [
      {
        path: '/Stock/stockListProduct',
        name: 'listofproduct',
        mini: 'SP',
        component: StockPage,
        moduleCode: 'stockListProduct',
      },
      {
        path: `/Stock/${MODULE_CODE.Asset}`,
        name: 'Quản lý tài sản',
        mini: 'TS',
        component: AssetPage,
        moduleCode: MODULE_CODE.Asset,
      },
      {
        path: '/Stock/Asset/:id',
        name: 'Tạo tài sản',
        mini: 'TS',
        component: EditAssetPage,
        hide: true,
        moduleCode: MODULE_CODE.Asset,
      },
      {
        path: '/Stock/liquidation/:id',
        name: 'Tạo tài sản',
        mini: 'TS',
        component: EditLiquidationPage,
        hide: true,
        moduleCode: MODULE_CODE.Asset,
      },
      {
        // /Stock/Allocate
        path: `/Stock/${MODULE_CODE.Allocate}`,
        name: 'Cấp phát',
        mini: 'CP',
        component: AllocationPage,
        moduleCode: MODULE_CODE.Allocate,
      },
      {
        path: `/Stock/${MODULE_CODE.Allocate}/:id`,
        name: 'Cấp phát',
        mini: 'CP',
        component: EditAllocationPage,
        hide: true,
        moduleCode: MODULE_CODE.Allocate,
      },
      {
        path: '/StockExport',
        name: 'Xuất kho',
        mini: 'XK',
        component: StockExportPage,
        moduleCode: 'StockExport',
      },
      {
        path: '/StockImport',
        name: 'stockimport',
        mini: 'NK',
        component: StockImportPage,
        moduleCode: 'StockImport',
      },
      {
        path: '/Stock/StockConfig',
        name: 'stockconfig',
        mini: 'P',
        component: StockConfigPage,
        moduleCode: 'StockConfig',
      },
    ],
  },

  {
    collapse: true,
    path: '/Documentary/file-manager',
    name: 'filingcabinets',
    state: 'openDocumentary',
    component: FileManager,
    icon: Assignment,
    exact: true,
    views: [
      {
        path: '/Documentary/share/:id',
        name: 'Life Driver',
        mini: 'CV',
        component: FileManager,
        hide: true,
      },
    ],
  },
  {
    collapse: true,
    path: '/Documentary',
    name: 'documentary',
    state: 'openDispatch',
    component: DispatchManager,
    icon: Receipt,
    // dynamicNode: true,
    exact: true,
    views: [
      {
        path: '/Documentary/inComingDocument',
        name: 'incomingdispatch',
        mini: 'CV',
        component: DispatchManager,
        moduleCode: 'Documentary',
      },
      {
        path: '/Documentary/inComingDocument/:id',
        name: 'Thêm công văn đến',
        component: AddDispatchManagerPage,
        empty: true,
        hide: true,
      },

      {
        path: '/Documentary/outGoingDocument',
        name: 'officialdispatchgo',
        mini: 'CV',
        component: DispatchManagerGo,
        moduleCode: 'Documentary',
      },

      {
        path: '/Documentary/outGoingDocument/:id',
        name: 'Công văn đi',
        mini: 'CV',
        component: AddDispatchManagerPage,
        hide: true,
      },
      {
        path: '/Documentary/DocumentConfig',
        component: CrmConfigPage,
        name: 'config',
        mini: 'CF',
        moduleCode: 'DocumentConfig',
      },
    ],
  },
  // {
  //   path: '/ContactCenter',
  //   exact: true,
  //   name: 'Bán hàng đa kênh',
  //   icon: Dns,
  //   component: ContactCenterPage,
  // },
  {
    path: '/Documentary/share/:id',
    name: 'File được chia sẻ',
    icon: Settings,
    component: FileManager,
    empty: true,
  },
  {
    path: '/ContactCenter/add',
    name: 'Thêm mới',
    icon: Settings,
    component: ContactCenterFormPage,
    empty: true,
  },
  {
    path: '/ContactCenter/:id',
    name: 'Cập nhập',
    icon: Settings,
    component: ContactCenterFormPage,
    empty: true,
  },
  {
    path: '/Delivery',
    name: 'delivery',
    collapse: true,
    icon: Commute,
    component: DeliveryPage,
    moduleCode: 'Delivery',
    views: [
      {
        path: '/Delivery/DeliveryConfig',
        name: 'Cấu hình',
        mini: 'TC',
        component: CrmConfigPage,
        moduleCode: 'deliveryConfig',
      },
      {
        path: '/Delivery/:id',
        name: 'Cập nhập',
        icon: Settings,
        component: DeliveryPageForm,
        hide: true,
        // empty: true,
      },
    ],
  },

  // tài chính nội bộ
  {
    path: '/RevenueExpenditure',
    name: 'internalfinance',
    collapse: true,
    state: 'openExpense',
    icon: Settings,
    component: RevenueAndExpenditure,
    moduleCode: 'RevenueExpenditure',
    // dynamicNode: true,
    views: [
      {
        path: '/RevenueExpenditure/Account',
        name: 'Tài khoản ngân hàng',
        mini: 'TC',
        component: BankAccount,
        moduleCode: 'BankAccount',
      },
      {
        path: '/RevenueExpenditure/RevenueExpenditureConfig',
        name: 'Cấu hình',
        mini: 'TC',
        component: CrmConfigPage,
        moduleCode: 'BankAccount',
      },
    ],
  },
  {
    path: '/Calendar/meeting-calendar',
    name: 'calender',
    icon: DateRange,
    component: MeetingCalendar,
    collapse: true,
    state: 'openCalendar',
    moduleCode: 'Calendar',

    views: [
      {
        path: '/Calendar/meeting-calendar',
        name: 'meetingschedule',
        mini: 'CV',
        component: MeetingCalendar,
        moduleCode: 'calendarMeeting',
      },
      {
        path: '/Calendar/meeting-calendar/:id',
        name: 'Thêm Lịch họp',
        mini: 'MC',
        component: AddMeetingSchedule,
        hide: true,
      },
      {
        path: '/Calendar/working-calendar',
        name: 'workingschedule',
        mini: 'WS',
        component: WorkingSchedule,
        moduleCode: 'calendarWorking',
      },
      {
        path: '/Calendar/working-calendar/:id',
        name: 'Thêm Lịch Công Tác',
        mini: 'MC',
        component: AddWorkingSchedule,
        hide: true,
      },
      {
        path: '/Calendar/room',
        name: 'meetingroom',
        mini: 'MR',
        component: MeetingRoom,
        moduleCode: 'MettingRoom',
      },
      {
        path: '/Calendar/CalendarConfig',
        name: 'Cấu hình',
        mini: 'TC',
        component: CrmConfigPage,
        moduleCode: 'calendarConfig',
      },
    ],
  },
  {
    path: '/userprofile/:id',
    name: 'Người dùng',
    hide: true,
    state: 'openExpense',
    icon: Settings,
    empty: true,
    component: PersonalPage,
  },
  {
    path: '/reports',
    name: 'reports',
    icon: Equalizer,
    dynamicNode: true,
    defaultModuleCode: 'reports',
    component: ReportPage,
    views: [
      {
        path: '/reports/room',
        name: 'Quản lý phòng họp',
        mini: 'MR',
        component: MeetingRoom,
      },
    ],
  },
  {
    collapse: true,
    path: '/Kpi',
    name: 'bsckpi',
    state: 'openKpi',
    component: KpiPage,
    icon: CardTravel,
    views: [
      {
        path: '/Kpi/criteria',
        name: 'criteria&plans',
        mini: 'CM',
        component: CriteriaPage,
        moduleCode: 'Kpi',
      },
      {
        path: '/Kpi/exchange',
        name: 'scoreconverttable',
        mini: 'CT',
        component: KpiExchange,
        moduleCode: 'Kpi',
      },

      {
        path: '/Kpi/project',
        name: 'projectkpi',
        mini: 'KP',
        component: KpiProject,
        moduleCode: 'Kpi',
      },
      {
        path: '/Kpi/manage',
        name: 'managereviews',
        mini: 'EM',
        component: KpiEvaluate,
        moduleCode: 'Kpi',
      },
      {
        path: '/Kpi/manage/:id',
        name: 'Thêm mới bản đánh giá',
        mini: 'EM',
        component: AddKpiEvaluate,
        hide: true,
      },
      {
        path: '/Kpi/config',
        name: 'kpiconfig',
        mini: 'CF',
        component: KpiConfig,
        moduleCode: 'Kpi',
      },
      {
        name: 'Thêm cấu hình hệ số K',
        path: '/Kpi/config/:id',
        mini: 'ACF',
        component: AddKpiConfig,
        hide: true,
      },
    ],
  },
  {
    collapse: true,
    path: '/setting',
    name: 'settings',
    icon: Settings,
    component: SystemConfigPage,
    dynamicNode: true,
    defaultModuleCode: 'setting',
    views: [
      {
        path: '/setting/LtAccount',
        name: 'Xác thực/Định danh',
        mini: 'AC',
        // extract: true,
        component: LtAccount,
        moduleCode: 'LtAccount',
      },
      {
        path: '/setting/general',
        name: 'systemconfig',
        mini: 'TP',
        component: SystemConfigPage,
        moduleCode: 'setting',
      },
      {
        name: 'template',
        path: '/setting/DynamicForm',
        mini: 'BM',
        component: TemplatePage,
        moduleCode: 'DynamicForm',
      },
      {
        name: 'template',
        path: '/setting/DynamicForm/:id',
        mini: 'BM',
        component: AddTemplatePage,
        hide: true,
      },
      {
        name: 'Field',
        path: '/setting/Field',
        mini: 'FL',
        component: FieldList,
        // hide: true,
        moduleCode: 'Field',
      },
      {
        name: 'NewsFeed',
        path: '/setting/NewsFeed',
        mini: 'NF',
        component: NewsFeed,
        // hide: true,
        moduleCode: 'NewsFeed',
      },
      {
        name: 'NewsFeed',
        path: '/setting/NewsFeed/:id',
        mini: 'NF',
        component: AddNewsFeed,
        hide: true,
      },
      // {
      //   name: 'Workflow',
      //   path: '/setting/Workflow',
      //   mini: 'WF',
      //   component: Automation,
      //   // hide: true,
      //   moduleCode: 'Automations',
      // },
      {
        name: 'AddAutomations',
        path: '/setting/Automations/:id',
        mini: 'AT',
        component: AddAutomations,
        hide: true,
      },
      {
        name: 'Field',
        path: '/setting/field/:id',
        mini: 'FL',
        component: Field,
        hide: true,
      },
      {
        name: 'approvegroup',
        path: '/setting/approved',
        mini: 'BM',
        component: ApproveGroupPage,
        moduleCode: 'approved',
      },
      {
        name: 'Thêm mới phê duyệt động',
        path: '/setting/approved/add',
        mini: 'BM',
        component: ApproveGroupDetailPage,
        hide: true,
      },
      {
        name: 'Chỉnh sửa phê duyệt động',
        path: '/setting/approved/:id',
        mini: 'BM',
        component: ApproveGroupDetailPage,
        hide: true,
      },
      {
        name: 'Loại biểu mẫu',
        path: '/setting/template_type',
        mini: 'BM',
        component: TemplateTypePage,
        hide: true,
        moduleCode: 'TemplateType',
      },
      {
        name: 'Chi tiết văn bản',
        path: '/setting/template_type/:id',
        mini: 'BM',
        component: AddTtPage,
        hide: true,
      },
      {
        name: 'emailsms',
        path: '/setting/email',
        mini: 'EM',
        component: EmailSms,
        isNode: true,
        childModules: ['Email', 'SMS'],
      },
      {
        name: 'Thêm Email',
        path: '/setting/email/:id',
        mini: 'EM',
        component: AddEmail,
        hide: true,
      },
      // {
      //   name: 'Thêm Chiến dịch Email',
      //   path: '/setting/emailCampain/:id',
      //   mini: 'EM',
      //   component: AddEmailCampaign,
      //   hide: true,
      // },
      {
        hide: true,
        name: 'Vai trò',
        path: '/setting/roleGroup',
        mini: 'PQ',
        component: RoleGroupPage,
      },
      {
        name: 'users',
        path: '/setting/Employee',
        mini: 'ND',
        component: UsersPage,
        moduleCode: 'Employee',
        // isNode: true,
      },
      {
        name: 'properties',
        path: '/setting/Properties',
        mini: 'TT',
        component: PropertiesPage,
        moduleCode: 'Properties',
      },
    ],
  },
  {
    name: 'Lịch sử đăng nhập',
    path: '/crm/Employee/history',
    icon: Widgets,
    empty: true,
    component: HistotyLog,
  },
  {
    path: '/setting/roleGroup/add',
    name: 'Thêm mới quyền',
    icon: Widgets,
    component: AddRolesGroupPage,
    empty: true,
  },
  {
    path: '/setting/roleGroup/edit/:id',
    name: 'Chỉnh sửa quyền',
    icon: Widgets,
    component: AddRolesGroupPage,
    empty: true,
  },
  {
    path: '/setting/Properties/propertiesGroup/:id',
    name: 'Nhóm thuộc tính',
    icon: Widgets,
    component: PropertiesGroup,
    empty: true,
  },
  {
    path: '/setting/Properties/properties/:id',
    name: 'Thuộc tính',
    icon: Widgets,
    component: AddPropertie,
    empty: true,
  },
  {
    path: '/setting/Properties/propertiesSet/:id',
    name: 'Bộ thuộc tính',
    icon: Widgets,
    component: EditPropertiesSet,
    empty: true,
  },
  // { path: '/setting/properties/:id', name: 'Bộ thuộc tính', icon: Widgets, component: PropertiesPage, empty: true },
  {
    path: '/setting/Properties/propertiesSet/',
    name: 'Bộ thuộc tính',
    icon: Widgets,
    component: AddPropertiesSet,
    empty: true,
  },
  {
    path: '/crm/Customer/add',
    name: 'Thêm mới khách hàng',
    icon: Widgets,
    component: AddCustomerPage,
    empty: true,
  },
  {
    path: '/setting/Employee/add',
    name: 'Thêm mới nhân sự',
    icon: Widgets,
    component: AddUserPage,
    empty: true,
  },
  {
    path: '/setting/Employee/add/:id',
    name: 'Sửa nhân sự',
    icon: Widgets,
    component: AddUserPage,
    empty: true,
  },
  {
    path: '/setting/Employee/department',
    name: 'Danh sách phòng ban',
    icon: Widgets,
    component: ListOfDepartmentPage,
    empty: true,
  },
  {
    path: '/setting/Employee/structure',
    name: 'Cấu trúc doanh nghiệp',
    icon: Widgets,
    component: OrganizationalStructurePage,
    empty: true,
  },

  {
    path: '/Stock/edit/:id',
    name: 'Sửa hàng hóa',
    icon: Widgets,
    component: EditProductPage,
    empty: true,
  },
  {
    path: '/crm/Contract/add/:id',
    name: 'Thêm hợp đồng',
    icon: Widgets,
    component: AddContractPage,
    empty: true,
  },
  {
    path: '/crm/Contract/edit/:id',
    name: 'Thêm hợp đồng',
    icon: Widgets,
    component: AddContractPage,
    empty: true,
  },
  {
    path: '/crm/Contract/supplier/edit/:id',
    name: 'Thêm hợp đồng',
    icon: Widgets,
    component: AddSupplierContract,
    empty: true,
  },
  {
    path: '/crm/OrderPo/edit/:id',
    name: 'purchase',
    icon: Widgets,
    component: AddImportProduct,
    empty: true,
  },
  {
    path: '/crm/OrderPo/add',
    name: 'purchase',
    icon: Widgets,
    component: AddImportProduct,
    empty: true,
  },
  {
    path: '/crm/Contract/:id',
    name: 'Cập nhật hợp đồng',
    icon: Widgets,
    component: AddContractPage,
    empty: true,
  },
  {
    path: '/crm/Contract/supplier/add/:id',
    name: 'Thêm hợp đồng',
    icon: Widgets,
    component: AddSupplierContract,
    empty: true,
  },
  {
    path: '/crm/Contract/supplier/edit/:id',
    name: 'Cập nhật hợp đồng',
    icon: Widgets,
    component: AddSupplierContract,
    empty: true,
  },
  // {
  //   path: '/admin/profile',
  //   name: 'Thông tin cá nhân',
  //   icon: Widgets,
  //   component: ProfilePage,
  //   empty: true,
  // },
  {
    path: '/admin/profile',
    name: 'Thông tin cá nhân',
    icon: Widgets,
    component: EditProfilePage,
    empty: true,
  },
  {
    path: '/crm/Bill/add',
    name: 'Thêm mới hóa đơn',
    icon: Widgets,
    component: AddBillPage,
    empty: true,
  },
  {
    path: '/crm/OrderPo/list',
    name: 'Thêm mới đơn hàng',
    icon: Widgets,
    component: ImportProduct,
    empty: true,
  },
  {
    path: '/crm/Bill/edit/:id',
    name: 'Sửa hóa đơn',
    icon: Widgets,
    component: AddBillPage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/add',
    name: 'Thu chi',
    icon: Widgets,
    component: AddRevenueAndExpenditurePage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/advance/edit/:id',
    name: 'Tạm ứng',
    icon: Widgets,
    component: AddAdvancePage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/advance/add',
    name: 'Tạm ứng',
    icon: Widgets,
    component: AddAdvancePage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/edit/:id',
    name: 'Thu chi',
    icon: Widgets,
    component: AddRevenueAndExpenditurePage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/reimbursement/edit/:id',
    name: 'Hoàn ứng',
    icon: Widgets,
    component: AddReimbursementRequirePage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/reimbursement/add',
    name: 'Hoàn ứng',
    icon: Widgets,
    component: AddReimbursementRequirePage,
    empty: true,
  },
  {
    path: '/StockImport/add',
    name: 'Nhập kho',
    icon: Widgets,
    component: AddImportStock,
    empty: true,
  },
  {
    path: '/StockImport/edit/:id',
    name: 'Nhập kho',
    icon: Widgets,
    component: AddImportStock,
    empty: true,
  },
  {
    path: '/StockExport/add',
    name: 'Xuất kho',
    icon: Widgets,
    component: AddExportStockPage,
    empty: true,
  },
  {
    path: '/StockExport/edit/:id',
    name: 'Xuất kho',
    icon: Widgets,
    component: AddExportStockPage,
    empty: true,
  },
  {
    path: '/setting/lt-account/add',
    name: 'LtAccount',
    icon: Widgets,
    component: AddLtAccountPage,
    empty: true,
  },
  {
    path: '/setting/lt-account/edit/:id',
    name: 'LtAccount',
    icon: Widgets,
    component: AddLtAccountPage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/Account/edit/:id',
    name: 'Sửa tài khoản ngân hàng',
    icon: Widgets,
    component: AddBankAccountPage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/Account/add',
    name: 'Thêm tài khoản ngân hàng',
    icon: Widgets,
    component: AddBankAccountPage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/payment/add',
    name: 'Thanh toán',
    icon: Widgets,
    component: AddPaymentPage,
    empty: true,
  },
  {
    path: '/RevenueExpenditure/payment/edit/:id',
    name: 'Thanh toán',
    icon: Widgets,
    component: AddPaymentPage,
    empty: true,
  },
  {
    path: '/Delivery/:id',
    // collapse: true,
    name: 'Giao nhận',
    // state: 'openDelivery',
    exact: true,
    icon: Commute,
    component: DeliveryPage,
    empty: true,
  },

  {
    path: '/crm/BonusProcess',
    name: 'Tiền thưởng',
    component: BonusPage,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/ContractProcess',
    name: 'Quy trình hợp đồng',
    component: IndenturePage,
    icon: Widgets,
    empty: true,
    moduleCode: 'ContractProcess',
  },
  {
    path: '/crm/Currency',
    name: 'Currency',
    component: Currency,
    icon: Widgets,
    empty: true,
    moduleCode: 'Currency',
  },
  {
    path: '/crm/DisciplineProcess',
    name: 'DisciplineProcess',
    component: DisciplineProcess,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/HrmOverTime',
    name: 'HrmOverTime',
    component: OverTimeManager,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/HrmOverTimePlan',
    name: 'HrmOverTimePlan',
    component: OverTimeManager,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/HrmRecruitment',
    name: 'HrmRecruitment',
    component: HrmRecruitmentManagement,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/HrmRecruitmentWave',
    name: 'HrmRecruitmentWave',
    component: HrmRecruitmentWave,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/HrmTimekeepingTable',
    name: 'HrmTimekeepingTable',
    component: AddWages,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/InfoRelationship',
    name: 'InfoRelationship',
    component: RelationsPage,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/InformationTakeLeave',
    name: 'InformationTakeLeave',
    component: SabbaticalPage,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/InsuranceInformation',
    name: 'InsuranceInformation',
    component: SocialPage,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TakeLeave',
    name: 'TakeLeave',
    component: TakeLeaveManager,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TaskContract',
    name: 'TaskContract',
    component: AddProjects,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TaskProgress',
    name: 'TaskProgress',
    component: TaskProgress,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TaskUserReplacement',
    name: 'TaskUserReplacement',
    component: AddProjects,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/TemplateTask',
    name: 'TemplateTask',
    component: SampleProcess,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/WorkExperience',
    name: 'WorkExperience',
    component: ExperiencePage,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/ProcessPage',
    name: 'ProcessPage',
    component: ProcessPage,
    icon: Widgets,
    empty: true,
  },
  {
    path: '/crm/reportsTaskStatus',
    name: 'reportsTaskStatus',
    component: ReportTaskStatus,
    icon: Widgets,
    empty: true,
  },
];

export default dashRoutes;
