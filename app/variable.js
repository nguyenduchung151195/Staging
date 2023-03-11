/* eslint-disable no-undef */
import {
  printGroupSaleClosure,
  printSaleOffer,
  addressPoint,
  destinationPoint,
  getCustomer,
  getAddress,
  getPhone,
  getTax,
  getBank,
  getRepresent,
  getPosition,
  printGroupTask,
  printUndertakingPerson,
  printSupervisor,
  getIncharge,
  getJoin,
  getViewable,
  getApproved,
  printQuotation,
  printCustomerInfo,
  printName,
  getNameByApi,
  printTable,
  printCode,
  getInfo,
  printPall,
  printRate,
  printProduct,
  printContentTable
} from './helper';

export const rowsList = [
  {
    title: 'Vinfast',
    id: '1425',
    created_date: '20-10-2016',
    description:
      'VinFast is a private automotive startup manufacturer headquartered in Vietnam, a member of Vingroup which is one of the largest private enterprises in the country.',
    contact: 'Linhdam, Hoangmai, Hanoi',
    phone: '0987489732',
    product: 'Car',
    email: 'kiendc@lifetek.vn',
    action: 'DEL',
    status: 0,
  },
];

export const showMap = true;

export const columnsList = [
  { name: 'title', title: 'Cơ hội kinh doanh', visibility: true },
  { name: 'created_date', title: 'Đã tạo', visibility: true },
  { name: 'contact', title: 'Liên hệ', visibility: true },
  { name: 'phone', title: 'SĐT', visibility: true },
  { name: 'email', title: 'Email', visibility: true },
  { name: 'product', title: 'Sản phẩm/ Dịch vụ', visibility: false },
  { name: 'action', title: 'Hành động', visibility: true },
  { name: 'status', title: 'Trạng thái', visibility: true },
];

// Trao đổi thỏa thuận

export const tradingList = [
  {
    title: 'BIDV',
    id: '21',
    created_date: '09-12-2014',
    description:
      'Apple Inc. is an American multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services. It is considered one of the Big Four of technology along with Amazon, Google, and Facebook',
    contact: '1 Apple Park Way, Cupertino, California, U.S.',
    phone: '0987489543',
    email: 'contact@apple.com',
    action: 'DEL',
    status: 2,
    budget: 426,
    focal: 'Nguyễn Thu Lan',
    fees: 202,
    inCharge: 'Nguyễn Mạnh Trường',
  },
];

export const tradingColumns = [
  { name: 'title', title: 'Trao đổi thỏa thuận', visibility: true },
  { name: 'created_date', title: 'Được tạo từ', visibility: true },
  { name: 'budget', title: 'Ngân sách', visibility: true },
  { name: 'focal', title: 'Đầu mối', visibility: true },
  { name: 'inCharge', title: 'Phụ trách', visibility: true },
  { name: 'fees', title: 'Bổ sung thêm phí', visibility: true },
  { name: 'action', title: 'Hành động', visibility: true },
  { name: 'status', title: 'Trạng thái', visibility: true },
];

// Calendar

export const appointments = [
  {
    title: 'Customer Workshop',
    startDate: new Date(2018, 6, 1),
    endDate: new Date(2018, 6, 2),
    allDay: true,
    id: 39,
    location: 'Room 1',
    priorityId: 1,
  },
];

export const priorities = [
  {
    id: 0,
    title: 'Low',
  },
  {
    id: 1,
    title: 'Medium',
  },
  {
    id: 2,
    title: 'High',
  },
];

// template
export const templateRows = [
  {
    title: 'Niêm yết',
    template_type: 'Biểu mẫu bảo hành',
    id: '1425',
    created_date: '20-10-2018',
  },
  {
    title: 'Thoái vốn',
    template_type: 'Biểu mẫu hóa đơn',
    id: '1253',
    created_date: '20-10-2018',
  },
  {
    title: 'Đơn dài hạn',
    template_type: 'Biểu mẫu bảo hành',
    id: '1266',
    created_date: '20-10-2018',
  },
  {
    title: 'Hợp đồng',
    template_type: 'Biểu mẫu hóa đơn',
    id: '1276',
    created_date: '20-10-2018',
  },
  {
    title: 'Hóa đơn bán hàng mẫu',
    template_type: 'Biểu mẫu hóa đơn',
    id: '129',
    created_date: '20-10-2018',
  },
];

export const templateColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'title', title: 'Tiêu đề', checked: true },
  { name: 'code', title: 'Mã', checked: true },
  // { name: 'categoryDynamicForm', title: 'Loại văn bản', checked: true },
  { name: 'createdAt', title: 'Ngày tạo', checked: true },
];
export const fieldColumns = [
  // { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên', checked: true, order: 1, hideSearchCheckBox: true, isRequired: true },
  { name: 'fields', title: 'Các trường', checked: true, order: 2, hideSearchCheckBox: true, isRequired: true },
  { name: 'code', title: 'Module', checked: true, order: 3, hideSearchCheckBox: true, isRequired: true },
  // { name: 'categoryDynamicForm', title: 'Loại văn bản', checked: true },
  // { name: 'createdAt', title: 'Ngày tạo', checked: true },
];

export const templateTypeColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'title', title: 'Tiêu đề', checked: true },
  { name: 'code', title: 'Mã', checked: true },
  // { name: 'categoryDynamicForm', title: 'Loại văn bản', checked: true },
  { name: 'createdAt', title: 'Ngày tạo', checked: true },
];

// template type
export const templateTypeRows = [
  {
    title: 'Biểu mẫu biên bản bàn giao',
    code: 'BMBBBG',
    id: '1425',
    status: 'Luôn sử dụng',
  },
  {
    title: 'Biểu mẫu báo giá',
    code: 'BMBG',
    id: '1253',
    status: 'Luôn sử dụng',
  },
  {
    title: 'Biểu mẫu bảo hành',
    code: 'BMBH',
    id: '1266',
    status: 'Luôn sử dụng',
  },
  {
    title: 'Biểu mẫu hóa đơn',
    code: 'BMHD',
    id: '1276',
    status: 'Luôn sử dụng',
  },
  {
    title: 'Biểu mẫu hợp đồng',
    code: 'BMHD',
    id: '129',
    status: 'Luôn sử dụng',
  },
];

// Expenses

export const expensesRows = [
  {
    title: 'Biểu mẫu biên bản bàn giao',
    code: 'BMBBBG',
    id: '1425',
    status: 'Chưa sử dụng',
    created_by: 'Nguyễn Văn Minh',
  },
  {
    title: 'Biểu mẫu báo giá',
    code: 'BMBG',
    id: '1253',
    status: 'Chưa sử dụng',
    created_by: 'Nguyễn Văn Minh',
  },
  {
    title: 'Biểu mẫu bảo hành',
    code: 'BMBH',
    id: '1266',
    status: 'Chưa sử dụng',
    created_by: 'Nguyễn Văn Minh',
  },
  {
    title: 'Biểu mẫu hóa đơn',
    code: 'BMHD',
    id: '1276',
    status: 'Chưa sử dụng',
    created_by: 'Nguyễn Văn Minh',
  },
  {
    title: 'Biểu mẫu hợp đồng',
    code: 'BMHD',
    id: '129',
    status: 'Chưa sử dụng',
    created_by: 'Nguyễn Văn Minh',
  },
];

export const expensesColumns = [
  { name: 'code', title: 'Mã dự toán', checked: true },
  { name: 'name', title: 'Nhu cầu / Trao đổi', checked: true },
  { name: 'createdBy', title: 'Người tạo', checked: true },
  { name: 'status', title: 'Trạng thái', checked: true },
  { name: '_id', title: 'ID', checked: false },
];

// Expenses detail

export const expensesDetailRows = [
  {
    title: 'Sản xuất bàn ghế phòng họp',
    code: 'BMBBBG',
    unit: '1425',
    price: 'Nguyễn Văn Minh',
    quantity: 12,
    vat: 10,
    note: 'Không có gì',
    amount: 146,
  },
];

export const expensesDetailColumns = [
  { name: 'title', title: 'Tên hạng mục diễn giải', visibility: true },
  { name: 'code', title: 'Mã số', visibility: true },
  { name: 'unit', title: 'Đơn vị tính', visibility: true },
  { name: 'price', title: 'Đơn giá', visibility: true },
  { name: 'quantity', title: 'Số lượng', visibility: true },
  { name: 'vat', title: 'VAT', visibility: true },
  { name: 'amount', title: 'Thành tiền', visibility: true },
  { name: 'note', title: 'Ghi chú', visibility: true },
];

// Chính sách bán hàng
export const rowsSale = [
  {
    title: 'Giảm giá',
    id: '21',
    start_date: '09-03-2019',
    end_date: '09-04-2019',
    rule_type: 'Giảm giá đơn giản',
    status: 'Hoạt động',
  },
  {
    title: 'Giảm giá mặt hàng nhà bếp',
    id: '11',
    start_date: '04-08-2018',
    end_date: '03-09-2018',
    rule_type: 'Giảm giá cao cấp',
    status: 'Không hoạt động',
  },
];

export const columnsSale = [
  { name: 'id', title: 'ID', visibility: true },
  { name: 'title', title: 'Tên quy tắc', visibility: true },
  { name: 'start_date', title: 'Ngày bắt đầu', visibility: true },
  { name: 'end_date', title: 'Ngày kết thúc', visibility: true },
  { name: 'rule_type', title: 'Loại quy tắc', visibility: true },
  { name: 'status', title: 'Tình trạng', visibility: true, data: { type: 'SALE_POLICY' } },
];

export const customers = [
  { label: 'NGUYEN VAN A', value: 1 },
  { label: 'NGUYEN VAN B', value: 2 },
  { label: 'NGUYEN VAN C', value: 3 },
  { label: 'NGUYEN VAN D', value: 4 },
  { label: 'NGUYEN VAN E', value: 5 },
  { label: 'NGUYEN VAN F', value: 6 },
];

// Phê duyệt động

export const rowsApproved = [
  {
    title: 'Nhóm công việc phòng kinh doanh',
    id: '21',
    stage: 'Báo giá',
    employees: 'Hỗ trợ Lifetek',
  },
  {
    title: 'Nhóm tài chính',
    id: '11',
    stage: 'Chuyển kho',
    employees: 'Nguyễn Văn Bình',
  },
];

export const columnsApproved = [
  { name: 'id', title: 'ID', visibility: true },
  { name: 'title', title: 'Tên nhóm', visibility: true },
  { name: 'stage', title: 'Công đoạn', visibility: true },
  { name: 'employees', title: 'Nhân viên', visibility: true },
];

// Bao gia
export const priceColumns = [
  { name: 'code', title: 'Báo Giá', checked: true },
  { name: 'moneyDiscount', title: 'Tổng Tiền', checked: true },
  { name: 'name', title: 'Khách Hàng', checked: true },
  { name: 'updatedAt', title: 'Ngày Hết Hạn', checked: true },
  { name: 'name', title: 'Người Phụ Trách', checked: true },
  { name: 'createdAt', title: 'Khởi tạo', checked: true },
  { name: 'discount', title: 'Bổ Sung Thêm Chi Phí', checked: true },
  { name: '', title: 'Loại', checked: true },
  { name: '', title: 'Ngày giao hàng', checked: true },
  { name: 'po', title: '', checked: true },
  { name: 'status', title: 'Trạng Thái', checked: true },
  { name: '_id', title: 'ID', checked: false },
];

// CRM currency
export const currencyColumns = [
  { name: 'setting', title: ' ', checked: true, order: 1 },
  { name: 'code', title: 'ID', checked: true, isRequire: true, checkedRequireForm: true, order: 2 },
  { name: 'name', title: 'Tên', checked: true, isRequire: true, checkedRequireForm: true, order: 3 },
  { name: 'sort', title: 'Phân loại', checked: true, isRequire: true, checkedRequireForm: true, order: 4 },
  { name: 'exchangeRate', title: 'Tỷ giá hối đoái', isRequire: true, checkedRequireForm: true, checked: true, order: 5 },
  { name: 'faceValue', title: 'Mệnh giá', checked: true, order: 6 },
  { name: 'base', title: 'Cơ sở', checked: true, order: 7 },
  { name: 'reportingCurrency', title: 'Báo cáo tiền tệ', checked: true, order: 7 },
  { name: 'defaultInvoicingCurrency', title: 'Báo cáo tiền tệ mặc định', checked: true, order: 8 },
  { name: 'edit', title: 'Sửa', checked: true, order: 9 },
];

// CRM Location
export const locationColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'code', title: 'ID', checked: true },
  { name: 'sort', title: 'Sắp xếp', checked: true },
  { name: 'type', title: 'Kiểu', checked: true },
  { name: 'name', title: 'Name', checked: true },
  { name: 'edit', title: 'Sửa', checked: true },
];

// CRM Tax
export const taxColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên/miêu tả', checked: true },
  { name: 'code', title: 'Các mức thuế', checked: true },
  { name: 'updatedAt', title: 'Đã tạo vào', checked: true },
  { name: 'edit', title: 'Sửa', checked: true },
];
export const taxVATColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên', checked: true },
  { name: 'exchangeRate', title: 'Tỷ giá', checked: true },
  { name: 'effective', title: 'Có hiệu lực', checked: true },
  { name: 'classify', title: 'Phân Loại', checked: true },
  { name: 'edit', title: 'Sửa', checked: true },
];
// EditTask
export const editTaskColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'exchangeRate', title: 'STT', checked: true },
  { name: 'priceTax', title: 'Tên công việc', checked: true },
  { name: 'typeCustomer', title: 'Tiến độ', checked: true },
  { name: 'effective', title: 'Tình trạng', checked: true },
  { name: 'order', title: 'Ưu tiên', checked: true },
  { name: 'updatedAt', title: 'Người phụ trách', checked: true },
  { name: 'updatedAt', title: 'Người tham gia', checked: true },
  { name: 'updatedAt', title: 'Ngày bắt đầu', checked: true },
  { name: 'updatedAt', title: 'Ngày kết thúc dự kiến', checked: true },
];

export const ltAccountColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'username', title: 'Tên người dùng', checked: true, width: 180 },
  { name: 'status', title: 'Trạng thái', checked: true },
  { name: 'moduleName', title: 'Module tương ứng', checked: true, width: 180 },
  { name: 'moduleCode', title: 'Mã module', checked: true },
  { name: 'fullname', title: 'Họ và tên', checked: true, width: 180 },
  { name: 'cellphone', title: 'Số điện thoại', checked: true },
  { name: 'email', title: 'Email', checked: true },
];

// SampleProcess
export const sampleProcesskColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên lộ trình mẫu', checked: true },
  { name: 'updatedAt', title: 'Cập nhật mới', checked: true },
  { name: 'updateBy', title: 'Cập nhật bởi', checked: true },
  { name: 'state', title: 'Trạng thái', checked: true },
];
// nhà cung cấp trong sửa dự án
export const supplierColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên hợp đồng', checked: true },
  { name: 'typeContract', title: 'Loại hợp đồng', checked: true },
  { name: 'paymentRequest', title: 'Chi phí', checked: true },
];
// Lịch sử Tiến độ Dự án
export const historyColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'taskId.name', title: 'Tên công việc', checked: true },
  { name: 'progress', title: 'Tiến độ', checked: true },
  { name: 'taskStatus', title: 'Tình trạng', checked: true },
  { name: 'priority', title: 'Ưu tiên', checked: true },
  { name: 'updatedBy.name', title: 'Người thay đổi', checked: true },
  { name: 'updatedAt', title: 'Ngày cập nhật', checked: true },
  { name: 'note', title: 'Ghi chú', checked: true },
];
// Phê duyệt Tiến độ Dự án
export const approvedColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên dự án', checked: true },
  { name: 'taskStatus', title: 'Trạng thái', checked: true },
  { name: 'pheduyet', title: 'Phê duyệt', checked: true },
  { name: 'dateFinish', title: 'Thời gian hoàn thành', checked: true },
  { name: 'dateApproved', title: 'Thời gian phê duyệt', checked: true },
  { name: 'approved', title: 'Người phê duyệt', checked: true },
];
// Tiến độ Dự án
export const progressColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên công việc', checked: true },
  { name: 'progress', title: 'Tiến độ', checked: true },
  { name: 'taskStatus', title: 'Tình trạng', checked: true },
  { name: 'priority', title: 'Ưu tiên', checked: true },
  { name: 'approved', title: 'Người phụ trách', checked: true },
  { name: 'join', title: 'Người tham gia', checked: true },
  { name: 'startDate', title: 'Ngày bắt đầu', checked: true },
  { name: 'endDate', title: 'Ngày kết thúc', checked: true },
  { name: 'desHtml', title: 'Mô tả chi tiết', checked: true },
];
// người thay thế/chuyen cong viec Dự án
export const replaceColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'tranferEmployees', title: 'Người thay thế', checked: true },
  { name: 'currentEmployees', title: 'Người bị thay thế', checked: true },
  { name: 'createdAt', title: 'Thời gian', checked: true },
];
// Danh sách công việc đang thực hiện
export const relateColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên dự án', checked: true },
  { name: 'taskStatus', title: 'Trạng thái', checked: true },
  { name: 'ratio', title: 'Tiến độ', checked: true },
  { name: 'priority', title: 'Ưu tiên', checked: true },
  { name: 'approved', title: 'Người phụ trách', checked: true },
  { name: 'join', title: 'Người tham gia', checked: true },
  { name: 'approved', title: 'Nhu cầu liên quan', checked: true },
  { name: 'approved', title: 'Hợp đồng liên quan', checked: true },
  { name: 'startDate', title: 'Ngày bắt đầu', checked: true },
  { name: 'endDate', title: 'Ngày kết thúc dự kiến', checked: true },
  { name: 'endDate', title: 'Ngày kết thúc', checked: true },
  { name: 'note', title: 'Ghi chú', checked: true },
];

// Email - SMS
export const EmaiColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'title', title: 'Biểu mẫu mail', checked: true },
  { name: 'code', title: 'Mã', checked: true },
];

export const EmailReportCols = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'campaignId.name', title: 'Tên chiến dịch', checked: true, width: 200 },
  { name: 'subject', title: 'Tiêu đề', checked: true, width: 200 },
  { name: 'employee.name', title: 'Người gửi', checked: true, width: 200 },
  { name: 'updatedAt', title: 'Ngày gửi', checked: true, width: 150 },
  { name: 'campaignId.template.title', title: 'Biểu mẫu', checked: true },
  { name: 'status', title: 'Trạng thái', checked: true },
  { name: 'error', title: 'Mã lỗi', checked: true, width: 200 },
];

export const logNames = {
  UPDATE: 'update',
  VIEW: 'view',
  MESSAGE: 'message',
  REMINDER: 'Reminder',
  MEETING: 'Meeting',
  VISIT: 'Visit',
  TASK: 'task',
  CALL: 'call',
};
// dự toán chi phí chi tiết trong cơ hội kinh doanh, trao doi thoa thuan
export const expensesDetail = [
  { name: 'add', title: 'Hành động', checked: true },
  { name: 'code', title: 'Mã', checked: true },
  { name: 'name', title: 'Tên', checked: true },
  { name: 'businessOpportunities', title: 'Cơ hội kinh doanh', checked: true },
  { name: 'exchangingAgreement', title: 'Trao đổi thỏa thuận', checked: true },
  { name: 'salesQuotation', title: 'salesQuotation', checked: true },
  { name: '_id', title: 'ID', checked: false },
];

export const taskStatusArr = ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành', 'Đóng', 'Tạm dừng', 'Không thực hiện'];

export const categoryTaskArr = ['Bán hàng ( Mở rộng thị trường)', 'Công việc hành chính', 'Công việc thi công', 'Công việc bảo hành'];
// bo tieu chi tron KPI
export const criteriaColumns = [
  // { name: '_id', title: 'ID', checked: false },
  // { name: 'ratio', title: 'Tỷ trọng', checked: true },
  { name: 'criterionType', title: 'Bộ tiêu chí', checked: true },
  { name: 'name', title: 'Tiêu chí', checked: true },
  { name: 'formula', title: 'Công thức tính', checked: true },
  { name: 'expected', title: 'Kỳ vọng', checked: true },
  { name: 'unit', title: 'Đơn vị đo', checked: true },
  { name: 'frequency', title: 'Tần suất đo', checked: true },
  { name: 'ranges', title: 'Phạm vi', checked: true },
  { name: 'order', title: 'Thứ tự', checked: true },
  { name: 'use', title: 'Sử dụng', checked: true },
  { name: 'note', title: 'Ghi chú', checked: true },
];
// KPI ca nhan
export const kpiPersonColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên dự án', checked: true },
  { name: 'code', title: 'Mã KPI', checked: true },
  { name: 'codeProject', title: 'Mã dự án', checked: true },
  { name: 'customer', title: 'Khách hàng', checked: true },
  { name: 'status', title: 'Trang thái', checked: true },
  { name: 'join', title: 'Tần suất đo', checked: true },
  { name: 'action', title: 'Thao tác', checked: true },
  { name: 'delete', title: 'Xóa', checked: true },
];

export const priorityArr = ['Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'];

// KPI loai pham vi
export const kpiTypeColumns = [
  'Sơ đồ tổ chức công ty',
  'Khách hàng',
  'Nhà cung cấp',
  'Danh mục sản phẩm trong kho',
  'Danh mục cấu hình CMR',
  'Sản phẩm và nhóm sản phẩm',
  'Nhân viên',
  // 'Chức vụ',
];

// KPI loai cong thuc
export const kpiFormulaColumns = [
  'Tổng doanh số theo nhân viên,phòng ban công ty',
  // 'Nhóm sản phẩm số đơn hàng thành công/thất bại',
  'Khách hàng mới',
  // 'Số lần tương tác với khách hàng',
  // 'Tổng chi phí cho 1 nhân sự,1 phòng',
  'Nhập công thức',
  'Theo tiêu chí chuẩn',
];

// KPI loai quy trinh
export const kpiProcessTypeColumns = [
  { name: '_id', title: 'ID', checked: false, order: 0 },
  { name: 'index', title: 'STT', checked: true, order: 1 },
  { name: 'code', title: 'Mã loại quy trình', checked: true, order: 2 },
  { name: 'name', title: 'Tên loại quy trình', checked: true, order: 3 },
  { name: 'method', title: 'Phương pháp', checked: true, order: 4 },
  // { name: 'process', title: 'Quy trình', checked: true },
];

// KPI quy trinh Danh gia
export const kpiProcessColumns = [
  { name: '_id', title: 'ID', checked: false, order: 0 },
  { name: 'code', title: 'Mã loại quy trình', checked: true, order: 1 },
  { name: 'name', title: 'Tên loại quy trình', checked: true, order: 2 },
  { name: 'processType', title: 'Loại quy trình', checked: true, order: 3 },
];

// KPI quan ly nhom Danh gia
export const kpiEvaluateGroupColumns = [
  { name: '_id', title: 'ID', checked: false, order: 0 },
  { name: 'code', title: 'Mã nhóm', checked: true, order: 1 },
  { name: 'name', title: 'Tên nhóm', checked: true, order: 2 },
  { name: 'nameTA', title: 'Tên TA', checked: true, order: 3 },
  { name: 'startDate', title: 'Ngày bắt đầu đánh giá', checked: true, order: 4 },
  { name: 'endDate', title: 'Ngày kết thúc đánh giá', checked: true, order: 5 },
  { name: 'startDateDetail', title: 'Ngày bắt đầu nhập chỉ tiêu', checked: true, order: 6 },
  { name: 'endDateDetail', title: 'Ngày kết thúc nhập chỉ tiêu', checked: true, order: 7 },
  { name: 'target', title: 'Có thiết lập mục tiêu', checked: true, order: 8 },
  { name: 'evaluate', title: 'Có tự đánh giá', checked: true, order: 9 },
  { name: 'active', title: 'Sử dụng', checked: true, order: 10 },
];

// KPI Bản đánh giá
export const kpiReviewColumns = [
  { name: '_id', title: 'ID', checked: false, order: 0 },
  { name: 'employee', title: 'Nhân viên', checked: true, order: 1 },
  { name: 'processType', title: 'Loại đánh giá', checked: true, order: 2 },
  { name: 'process', title: 'Quy trình đánh giá', checked: true, order: 3 },
  { name: 'startDate', title: 'Ngày bắt đầu ', checked: true, order: 4 },
  { name: 'endDate', title: 'Ngày kết thúc ', checked: true, order: 5 },
  { name: 'finishDate', title: 'Hạn hoàn thành đánh giá', checked: true, order: 6 },
];

// KPI Bang quy doi diem so
export const kpiExchangeColumns = [
  { name: '_id', title: 'ID', checked: false, order: 0 },
  { name: 'frequency', title: 'Tần suất', checked: true, order: 1 },
  { name: 'unit', title: 'Đơn vị đo', checked: true, order: 2 },
  { name: 'coefficient', title: 'Hệ số KPI', checked: true, order: 3 },
  { name: 'tendency', title: 'Xu hướng', checked: true, order: 4 },
  // { name: 'points', title: 'Điểm đánh giá', checked: true },
];

// KPI cau hinh he so K
export const kpiConfigColumns = [
  { name: '_id', title: 'ID', checked: false, order: 0 },
  { name: 'name', title: 'Tên công thức', checked: true, order: 1 },
  { name: 'code', title: 'Mã công thức', checked: true, order: 2 },
  { name: 'formula', title: 'Công thức K', checked: true, order: 3 },
  { name: 'range', title: 'Phạm vi', checked: true, order: 4 },
  { name: 'module', title: 'Mã Module', checked: true, order: 5 },
];
export const taskStageArr = [
  'Giai đoạn thông tin thị trường, chốt chủ trương',
  'Giai đoạn tiền dự án',
  'Dự Án GĐ Đang Thi Công',
  'Dự Án GĐ Chuẩn Bị Thi Công',
  'Dự Án Giai Đoạn Nghiệm Thu',
  'Dự Án Giai Đoạn Thu Hồi Công Nợ',
];

export const campaignEmailColums = [
  { name: '_id', title: 'ID', checked: false, order: 0 },
  { name: 'index', title: 'STT', checked: true, order: 1 },
  { name: 'name', title: 'Tên chiến dịch', checked: true, order: 2 },
  { name: 'title', title: 'Tiêu đề gửi Email', checked: true, order: 3 },
  { name: 'senderName', title: 'Người gửi, nhóm gửi', checked: true, order: 4 },
  // { name: 'receiver', title: 'Người nhận, nhóm nhận', checked: true },
  { name: 'timer', title: 'Thời gian gửi', checked: true, order: 5 },
  { name: 'repeat', title: 'Lặp lại', checked: true, order: 6 },
  { name: 'active', title: 'Đang hoạt động', checked: true, order: 7 },
];

export const extraRoles = [
  {
    methods: [
      {
        name: 'GET',
        allow: false,
      },
      {
        name: 'POST',
        allow: false,
      },
      {
        name: 'PUT',
        allow: false,
      },
      {
        name: 'DELETE',
        allow: false,
      },
      {
        name: 'EXPORT',
        allow: false,
      },
      {
        name: 'IMPORT',
        allow: false,
      },
    ],
    titleFunction: 'Dashboard',
    codeModleFunction: 'test',
    clientId: '20_CRM',
  },
];

export const campaignSmsColums = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên chiến dịch', checked: true },
  { name: 'title', title: 'Tiêu đề gửi sms', checked: true },
  { name: 'receiver', title: 'Người nhận, nhóm nhận', checked: true },
  { name: 'time', title: 'Thời gian gửi', checked: true },
  { name: 'repeat', title: 'Lặp lại', checked: true },
  { name: 'active', title: 'Đang hoạt động', checked: true },
];

export const customerColumns = [
  { name: 'code', title: 'Mã', checked: true },
  { name: 'name', title: 'Tên', checked: true },
  { name: 'email', title: 'Email', checked: true },
  { name: 'address', title: 'Dia chi', checked: true },
];

export const extraFields = [
  {
    code: 'SalesQuotation',
    data: [
      { name: 'PRODUCT_GROUP', type: 'extra', title: 'BẢNG NHÓM SẢN PHẨM', function: printGroupSaleClosure() },
      { name: 'PRODUCT_GROUP_EN', type: 'extra', title: 'BẢNG NHÓM SẢN PHẨM', function: printGroupSaleClosure('en') },
      { name: 'SALES_VINCAS', type: 'extra', title: 'Bao gia Vincas', function: printQuotation },
      { name: 'SALES_PALL', type: 'extra', title: 'Bao gia PALL', function: printPall },
      { name: 'RATE', type: 'extra', title: 'Tỷ giá ngoại tệ', function: printRate },
    ],
  },
  {
    code: 'CostEstimate',
    data: [
      { name: 'SALE_OFFER', type: 'extra', title: 'MẪU ĐỀ XUẤT BÁN HÀNG', function: printSaleOffer },
      { name: 'DELIVERY_POINT', type: 'extra', title: 'ĐIỂM GIAO HÀNG', function: addressPoint },
      { name: 'DENTINATION_POINT', type: 'extra', title: 'ĐIỂM NHẬN HÀNG', function: destinationPoint },
    ],
  },
  {
    code: 'Stock',
    data: [{ name: 'Product_Pall', type: 'extra', title: 'BIỂU MẪU SẢN PHẨM PALL', function: printProduct }],
  },
  {
    code: 'Contract',
    data: [
      { name: 'CUSTOMER_NAME', type: 'extra', title: 'TÊN KHÁCH HÀNG', function: getCustomer },
      { name: 'ADDRESS', type: 'extra', title: 'ĐỊA CHỈ', function: getAddress },
      { name: 'PHONENUMBER', type: 'extra', title: 'SỐ ĐIỆN THOẠI', function: getPhone },
      { name: 'TAXCODE', type: 'extra', title: 'MÃ SỐ THUẾ', function: getTax },
      { name: 'BANKACCCOUNTNUMBER', type: 'extra', title: 'TÀI KHOẢN', function: getBank },
      { name: 'REPRESENTNAME', type: 'extra', title: 'ĐẠI DIỆN', function: getRepresent },
      { name: 'POSITION', type: 'extra', title: 'CHỨC VỤ', function: getPosition },
      // { name: 'DOB', type: 'extra', title: 'Ngày sinh', function: getDob },
      // { name: 'CARDNUMBER', type: 'extra', title: 'CMTND', function: getCard },
      // { name: 'GENDER', type: 'extra', title: 'GIỚI TÍNH', function: getGender },
    ],
  },
  {
    code: 'hrm',
    data: [
      { name: 'name', type: 'extra', title: 'Họ và tên', function: getInfo },
      { name: 'gender', type: 'extra', title: 'Giới tính', function: getInfo },
      { name: 'phoneNumber', type: 'extra', title: 'Số điện thoại', function: getInfo },
      { name: 'birthday', type: 'extra', title: 'Ngày sinh', function: getInfo },
      { name: 'avatar', type: 'extra', title: 'Ảnh đại diện', function: getInfo },
      { name: 'nation', type: 'extra', title: 'Dân tộc', function: getInfo },
      { name: 'address', type: 'extra', title: 'Địa chỉ', function: getInfo },
      { name: 'religion', type: 'extra', title: 'Tôn giáo', function: getInfo },
      { name: 'locationProvide', type: 'extra', title: 'Nơi cấp', function: getInfo },
      { name: 'dateProvide', type: 'extra', title: 'Ngày cấp', function: getInfo },
      { name: 'identityCardNumber', type: 'extra', title: 'Ngày cấp', function: getInfo },
    ]
  },

  {
    code: 'Task',
    data: [
      { name: 'TASK_GROUP', type: 'extra', title: 'BẢNG NHÓM DỰ ÁN', function: printGroupTask },
      { name: 'INCHARGE', type: 'extra', title: 'NGƯỜI PHỤ TRÁCH', function: getIncharge },
      { name: 'JOIN', type: 'extra', title: 'NGƯỜI THAM GIA', function: getJoin },
      { name: 'VIEWABLE', type: 'extra', title: 'NGƯỜI ĐƯỢC XEM', function: getViewable },
      { name: 'APPROVED', type: 'extra', title: 'NGƯỜI PHÊ DUYỆT', function: getApproved },
    ],
  },
  {
    code: 'ExchangingAgreement',
    data: [
      { name: 'UNDERTAKING_PERSON', type: 'extra', title: 'NGƯỜI CHỐT CHỦ TRƯƠNG', function: printUndertakingPerson },
      { name: 'SUPERVISOR', type: 'extra', title: 'THEO DÕI DỰ ÁN', function: printSupervisor },
    ],
  },
  {
    code: 'BusinessOpportunities',
    data: [{ name: 'CUSTOMER_INFO', type: 'extra', title: 'THÔNG TIN KH', function: printCustomerInfo }],
  },
  {
    code: 'Customer',
    data: [
      { name: 'NAME', type: 'extra', title: 'TÊN DỰ ÁN', function: printName },
      { name: 'CODE', type: 'extra', title: 'Mã DỰ ÁN', function: printCode },
    ],
  },
  {
    code: 'InsuranceInformation',
    data: [
      { name: 'NAME', type: 'extra', title: 'Tên doanh nghiệp', function: getNameByApi },
      { name: 'ADDRESS', type: 'extra', title: 'Địa chỉ', function: getAddress },
      { name: 'PHONENUMBER', type: 'extra', title: 'Số điện thoại', function: getPhone },
      { name: 'CODE', type: 'extra', title: 'Mã số thuế', function: getCustomer },
      { name: 'TABLE', type: 'extra', title: 'Tình hình sử dụng lao động', function: printTable },
      { name: 'contentTable', type: 'extra', title: '', function: printContentTable }
    ],
  },
];

// KPI Du an
export const kpiProjectColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'taskCode', title: 'Mã dự án', checked: true },
  { name: 'code', title: 'Mã KPI', checked: true },
  { name: 'employees', title: 'Nhân viên', checked: true },
  { name: 'status', title: 'Trang thái', checked: true },
  { name: 'state', title: 'Trạng thái phê duyệt', checked: true },
];

// Lịch
// export const calendarColumns = [
//   { name: '_id', title: 'ID', checked: false },
//   { name: 'name', title: 'Lịch', checked: true },
//   { name: 'typeCalendar', title: 'Loại', checked: true },
//   { name: 'people', title: 'Người tham gia', checked: true },
//   { name: 'organizer', title: 'Người tổ chức', checked: true },
//   { name: 'prepare', title: 'Người chuẩn bị', checked: true },
//   { name: 'date', title: 'Ngày họp', checked: true },
//   { name: 'timeStart', title: 'Thời gian bắt đầu', checked: true },
//   { name: 'timeEnd', title: 'Thời gian kết thúc', checked: true },
//   { name: 'kanbanStatus', title: 'Trạng thái', checked: true },
//   { name: 'roomMetting', title: 'Phòng họp', checked: true },
//   { name: 'address', title: 'Địa điểm', checked: true },
//   { name: 'prepareMeeting', title: 'Chuẩn bị cuộc họp', checked: true },
//   // { name: 'editcustom', title: 'Tạo Công việc', checked: true },
// ];

// Phong hop
export const meetingRoomColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên phòng họp', checked: true },
  { name: 'address', title: 'Địa chỉ', checked: true },
  { name: 'acreage', title: 'Diện tích', checked: true },
  // { name: 'utilities', title: 'Tiện ích', checked: true },
];

export const provincialColumns = ['Khu vực phía Bắc', 'Khu vực phía Nam'];

// Bao cao tong hop cong no khach hang
export const liabilitiesColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'customer', title: 'Tên khách hàng', checked: true },
  { name: 'totalAmount', title: 'Tổng tiền', checked: true },
  { name: 'pay', title: 'Thanh toàn thực tế', checked: true },
  { name: 'totalDebt', title: 'Còn thiếu', checked: true },
  { name: 'completionRate', title: 'Tỷ lệ hoàn thành', checked: true },
  // { name: 'utilities', title: 'Deadline thanh toán', checked: true },
];

// Báo cáo chi tiết công nợ theo bán hàng
export const liabilitiesSalesColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'customer', title: 'Tên khách hàng', checked: true },
  { name: 'totalAmount', title: 'Tổng tiền', checked: true },
  { name: 'pay', title: 'Thanh toàn thực tế', checked: true },
  { name: 'totalDebt', title: 'Còn thiếu', checked: true },
  { name: 'completionRate', title: 'Tỷ lệ hoàn thành', checked: true },
  { name: 'createdAt', title: 'Ngày xuất kho', checked: true },
  { name: 'dateReturnDebt', title: 'Deadline thanh toán', checked: true },
];

// Báo cáo chi tiết công nợ theo hợp đồng
export const liabilitiesContractColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên hợp đồng', checked: true },
  { name: 'totalAmount', title: 'Tổng tiền', checked: true },
  { name: 'pay', title: 'Thanh toán thực tế', checked: true },
  { name: 'totalDebt', title: 'Còn thiếu', checked: true },
  { name: 'completionRate', title: 'Tỷ lệ hoàn thành', checked: true },
];

// Báo cáo doanh thu theo san pham
export const productSalesColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên sản phẩm', checked: true },
  { name: 'countProduct', title: 'Số sản phẩm', checked: true },
  { name: 'countOrder', title: 'Số lượng đơn hàng', checked: true },
  { name: 'countTotalMoney', title: 'Doanh số', checked: true },
  { name: 'rate', title: '% Doanh số', checked: true },
];

// Báo cáo công nợ phai tra
export const debtSupplierColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên nhà cung câp', checked: true },
  { name: 'total', title: 'Tổng tiền', checked: true },
  { name: 'totalPaidList', title: 'Thanh toán thực tế', checked: true },
  { name: 'totalDebt', title: 'Còn nợ', checked: true },
  { name: 'completionRate', title: 'Tỷ lệ hoàn thành', checked: true },
];

// Báo cáo công nợ phai tra
export const inventoryColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'name', title: 'Tên sản phầm', checked: true },
  { name: 'code', title: 'Mã', checked: true },
  { name: 'unit', title: 'Đơn vị tính', checked: true },
  { name: 'beginningInventory', title: 'Tồn đầu kỳ', checked: true },
  { name: 'importPeriod', title: 'Nhập trong kỳ', checked: true },
  { name: 'exportedPeriod', title: 'Xuất trong kỳ', checked: true },
  { name: 'lastInventory', title: 'Tồn cuối kỳ', checked: true },
];

// Báo cáo san pham chi tiet
export const detailProductColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'code', title: 'Mã', checked: true },
  { name: 'name', title: 'Tên hợp đồng/ Đơn hàng', checked: true },
  { name: 'customer', title: 'Tên khách hàng', checked: true },
  { name: 'amount', title: 'Số lượng', checked: true },
  { name: 'costPrice', title: 'Đơn giá', checked: true },
  { name: 'total', title: 'Thành tiền', checked: true },
];
// Báo cáo nhóm khách hàng
export const CustomerGroupColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Nhóm khách hàng', checked: true },
  { name: 'amount', title: 'Số lượng đơn hàng', checked: true },
  { name: 'total', title: 'Doanh số', checked: true },
  { name: 'rate', title: '% Doanh số', checked: true },
];

// Báo cáo doanh thu theo nhan vien
export const salesEmployeeColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Tên nhân viên', checked: true },
  { name: 'amount', title: 'Số lượng đơn hàng', checked: true },
  { name: 'total', title: 'Doanh số', checked: true },
  { name: 'rate', title: '% Doanh số', checked: true },
];

// Báo cáo doanh thu theo nguon den
export const reportSourceColumns = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'index', title: 'STT', checked: true },
  { name: 'name', title: 'Nguồn đến', checked: true },
  { name: 'amount', title: 'Số lượng đơn hàng', checked: true },
  { name: 'total', title: 'Doanh số', checked: true },
  { name: 'rate', title: '% Doanh số', checked: true },
];
// Báo cáo tỷ lệ chuyển đổi khách hàng
export const reportConverCustomer = [
  { name: '_id', title: 'ID', checked: false },
  { name: 'em', title: 'Nhân viên', checked: true },
  { name: 'name', title: 'Số cơ hội', checked: true },
  { name: 'amount', title: 'Số hợp đồng', checked: true },
  { name: 'rate', title: '% Chuyển đổi', checked: true },
];

export const typeCustomer = [
  { value: 1, name: 'Khách hàng loại 1' },
  { value: 2, name: 'Khách hàng loại 2' },
  { value: 3, name: 'Khách hàng loại 3' },
];

export const typeEmployee = [{ value: 1, name: 'Nhân viên loại 1' }, { value: 2, name: 'Nhân viên loại 2' }, { value: 3, name: 'Nhân viên loại 3' }];
export const clientId = CLIENT;
export const allowedFileExts = ALLOW_FILE_EXT;
export const DriveId = '03_Driver';
// export const DriveId = 'DRIVE';

// Cấu hình máy chấm công
export const configTimeKeeping = [
  { name: 'code', title: 'Mã máy chấm công', checked: true, width: 500 },
  { name: 'name', title: 'Tên máy chấm công', checked: true, width: 500 },
];

// Cập nhật máy chấm công
export const configAddTimeKeeping = [
  { name: 'codeEmployee', title: 'Mã nhân viên', checked: true, width: 350 },
  { name: 'equipmentId.name', title: 'Tên nhân viên', checked: true, width: 350 },
  { name: 'gender', title: 'Giới tính', checked: true, width: 350 },
  { name: 'equipmentId.code', title: 'Mã máy chấm công', checked: true, width: 350 },
];

// báo cáo tồn kho
export const inventoryReportByMonthColumns = [
  { name: 'groupName', title: 'Nhóm sản phẩm', checked: true, width: 120 },
  { name: 'month_1', title: 'Tháng 1', checked: true, width: 120 },
  { name: 'month_2', title: 'Tháng 2', checked: true, width: 120 },
  { name: 'month_3', title: 'Tháng 3', checked: true, width: 120 },
  { name: 'month_4', title: 'Tháng 4', checked: true, width: 120 },
  { name: 'month_5', title: 'Tháng 5', checked: true, width: 120 },
  { name: 'month_6', title: 'Tháng 6', checked: true, width: 120 },
  { name: 'month_7', title: 'Tháng 7', checked: true, width: 120 },
  { name: 'month_8', title: 'Tháng 8', checked: true, width: 120 },
  { name: 'month_9', title: 'Tháng 9', checked: true, width: 120 },
  { name: 'month_10', title: 'Tháng 10', checked: true, width: 120 },
  { name: 'month_11', title: 'Tháng 11', checked: true, width: 120 },
  { name: 'month_12', title: 'Tháng 12', checked: true, width: 120 },
];
export const aggregateSalesOfSaleStaff = [
  { name: 'name', title: 'Nhân viên KD', checked: true, width: 120 },
  { name: 'sum', title: 'Doanh số', checked: true, width: 120 },
  { name: 'kpiPlanEmpl', title: 'Kế hoạch', checked: true, width: 120 },
  { name: 'proportion', title: 'Tỷ trọng', checked: true, width: 120 },
  { name: 'scalePlanDone', title: 'Tỷ lệ hoàn thành kế hoạch', checked: true, width: 120 },
  { name: 'popular', title: 'Nổi bật', checked: true, width: 120 },
];

export const VIEWCONFIG_FILTER_FIELD_CONFIG = {
  Calendar: {
    columns: ['typeCalendar'],
    defaultFieldList: {
      typeCalendar: [
        {
          title: 'Lịch họp',
          value: '1',
        },
        {
          title: 'Lịch công tác',
          value: '2',
        },
      ],
    },
  },
  TaskContract: {
    columns: ['typeContract'],
    defaultFieldList: {
      typeContract: [
        {
          title: 'HỢP ĐỒNG KHÁCH HÀNG',
          value: '1',
        },
        {
          title: 'HỢP ĐỒNG NHÀ CUNG CẤP',
          value: '2',
        },
      ],
    },
  },
};
