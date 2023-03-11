import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Grid, TextField, Button, Menu, MenuItem } from '@material-ui/core';
import compact from 'lodash/compact';
import { API_CUSTOMERS_SEARCH_REPORT, API_CUSTOMERS } from 'config/urlConfig';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/ru';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { API_REPORT_VISIT_CUSTOMER } from '../../../../config/urlConfig';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import { AsyncAutocomplete, Typography } from '../../../../components/LifetekUi';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF } from 'helper';

moment.locale('vi');

const FIX_COLUMNS = [
  { name: 'businessName', title: 'Tên khách hàng', checked: true },
  { name: 'startTime', title: 'Thời gian tiếp xúc', checked: true },
  { name: 'people', title: 'Nhân viên', checked: true },
  { name: 'organizationUnitId', title: 'Phòng ban/ chi nhánh', checked: true },
  // { name: 'organizationUnitId', title: 'Chi nhánh', checked: true },
  { name: 'result', title: 'Kết quả tiếp xúc', checked: true },
];
function ReportCustomerContract(props) {
  const { profile } = props;
  const [filter, setFilter] = useState({
    // organizationUnit: '',
    // employeeId: '',
  });
  const [dateExport, setDateExport] = useState('');
  const [employee, setEmployee] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);

  const [openExcel, setOpenExcel] = useState(null);
  const [exportDate, setExportDate] = useState('');
  const [reload, setReload] = useState(false);
  const [exportAnchor, setExportAnchor] = useState(null);
  // TT
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [exportRole, setExportRole] = useState(false);
  const [customer, setCustomer] = useState();
  const [maxLimit, setMaxLimit] = useState();
  const [locale, setLocale] = useState('vi');

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    setExportDate(date);

    // get first day of month
    const firstDayOfMonth = moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD');
    // get today
    const today = moment().format('YYYY-MM-DD');
    setFilter({ ...filter, startDate: firstDayOfMonth, endDate: today });
    setReload(true);
    return () => setReload(false);
  }, []);

  const handleChangeFiler = (e, isDate, isStartDate) => {
    const name = isDate ? (isStartDate ? 'startDate' : 'endDate') : 'typeEmp';
    const value = isDate ? (isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    const newFilter = { ...filter, [name]: value };

    // TT
    if (!newFilter.startDate && newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('nhập thiếu: "Từ ngày"');
      setErrorTextEndDate('');
    } else if (newFilter.startDate && !newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('');
      setErrorTextEndDate('nhập thiếu: "Đến ngày"');
    } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
      setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
    } else {
      setErrorStartDateEndDate(false);
      setErrorTextStartDate('');
      setErrorTextEndDate('');
    }

    setFilter(newFilter);
    setReload(true);
  };

  const handleChangeDepartmentAndEmployee = useCallback(
    result => {
      const { department, employee } = result;
      if (department) {
        const newFilter = { ...filter, organizationUnitId: department };
        delete newFilter.employeeId;
        setFilter(newFilter);
        setEmployee(null);
      }
      if (employee && employee._id) {
        setFilter({ ...filter, employeeId: employee && employee._id });
        setEmployee(employee);
      }
    },
    [filter],
  );

  const handleChangeDateExport = useCallback(
    e => {
      setExportDate(e.target.value);
    },
    [exportDate],
  );


  const customFunction = data =>
    // console.log('BÁO CÁO TIẾP XÚC KHÁCH HÀNG', data);
    data.map(item => ({
      ...item,
      // businessName: item['businessName.name'],
      startTime: moment(item.startTime).format('DD/MM/YYYY'),
      endTime: moment(item.endTime).format('DD/MM/YYYY'),
      people: item.people,
      organizationUnitId: item['organizationUnitId.name'],

      // businessName: te
      result: item.result,
    }));
  const getTotalRecord = count => {
    setTotalRecord(count);
  };

  const getTotalCustomer = count => {
    setTotalCustomer(count);
  };

  //   const onExportExcel = () => setOpenExcel('Excel');
  //   const onExportPDF = () => setOpenExcel('PDF');
  const onExportExcel = () => {
    if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }

    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
    if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }

    setOpenExcel('PDF');
  };

  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);

  useEffect(
    () => {
      if (html.length > 0 && htmlTotal !== 0) {
        if (html.length === htmlTotal) {
          for (let index = 0; index < htmlTotal; index++) {
            const win = window.open();
            win.document.write(html[index].content);
            win.document.close();
            win.print();
          }

          setHtml([]);
          setHtmlTotal(0);
        }
      }
    },
    [html, htmlTotal],
  );

  const handleCloseExcel = payload => {
    const type = openExcel;
    setOpenExcel(null);

    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
        props.onChangeSnackbar({ status: true, message, variant: 'error' });
      } else props.onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
      return;
    }

    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF('reportMeetingCustomer');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('reportMeetingCustomer', 'W3C Example Table');
    }

    // setOpenExcel(null);
    // tableToExcel('excel-table-customer-contract', 'W3C Example Table');
  };
  const handleChangeCustomer = useCallback(
    value => {
      const newFilter = { ...filter };
      if (value && value._id) {
        setFilter({ ...filter, customerId: value && value._id, });
        setCustomer(value);
      } else {
        delete newFilter.customerId;
        setFilter({ ...newFilter });
        setCustomer(null);
      }
    },
    [filter],
  );

  const newFilter = { ...filter };
  if (newFilter.typeEmp === 0) {
    delete newFilter.typeEmp;
  }
  return (
    <React.Fragment>
      <div style={{ width: window.innerWidth - 260 }}>
        <Grid container spacing={16}  >
          <Grid xs={12}>
            <Typography gutterBottom align="center" variant='h5' style={{ marginTop: 30 }}>
              BÁO CÁO TIẾP XÚC KHÁCH HÀNG
            </Typography>

            <Grid spacing={16} container direction="row" justify="flex-start" alignItems="center" xs={12} style={{ paddingLeft: 50, paddingTop: 20 }}>
              <Grid item xs={2} style={{ marginBottom: 5 }}>
                <AsyncAutocomplete
                  label="Khách hàng" // value={filter.template}
                  onChange={handleChangeCustomer}
                  url={API_CUSTOMERS} // optionLabel="name"
                // optionValue="_id"
                // isMulti
                />
              </Grid>
              <Grid item xs={4}>
                <DepartmentAndEmployee
                  department={filter.organizationUnitId}
                  employee={employee || ''}
                  onChange={handleChangeDepartmentAndEmployee}
                  profile={profile}
                  moduleCode="reportMeetingCustomer"
                // disableEmployee
                />
              </Grid>
              {/* <Grid container style={{ paddingLeft: 15, marginBottom: 5 }} xs={6}> */}
              <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
                <MuiPickersUtilsProvider utils={MomentUtils} locale={locale} libInstance={moment}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={filter.startDate}
                    variant="outlined"
                    label="Từ ngày"
                    margin="dense"
                    required
                    name="startDate"
                    onChange={e => handleChangeFiler(e, true, true)}
                    fullWidth
                  />
                </MuiPickersUtilsProvider>
                {errorStartDateEndDate ? (
                  <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextStartDate}</p>
                ) : null}
              </Grid>
              <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
                <MuiPickersUtilsProvider utils={MomentUtils} locale={locale} libInstance={moment}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={filter.endDate}
                    variant="outlined"
                    fullWidth
                    label="Đến ngày"
                    margin="dense"
                    required
                    name="endDate"
                    onChange={e => handleChangeFiler(e, true, false)}
                  />
                </MuiPickersUtilsProvider>
                {errorStartDateEndDate ? (
                  <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextEndDate}</p>
                ) : null}
              </Grid>
              {/* </Grid> */}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {newFilter.startDate <= newFilter.endDate ? (
              <ListPage
                apiUrl={API_REPORT_VISIT_CUSTOMER}
                code="reportMeetingCustomer"
                customFunction={customFunction}
                filter={newFilter}
                disableImport
                disableViewConfig
                disableSearch
                disableAdd
                disableSelect
                disableEdit
                filterType
                totalRecord={getTotalRecord}
                totalCustomer={getTotalCustomer}
                reload={reload}
                disableFieldName={[{ name: 'edit' }]}
                disabledRow
                getMaxLimit={setMaxLimit}
              />
            ) : (
              <ListPage
                code="reportMeetingCustomer"
                customFunction={
                  customFunction // apiUrl={API_REPORT_VISIT_CUSTOMER}
                }
                disableSearch
                disableAdd
                disableViewConfig
                disableImport
                disableSelect
                disableEdit
                filterType
                reload={
                  false // filter={filter}
                }
                setNoDataReports
                disableFieldName={[{ name: 'edit' }]}
                disabledRow
              />
            )}

            {/* <ListReport
            apiUrl={API_REPORT_VISIT_CUSTOMER}
            filter={filter}
            columns={FIX_COLUMNS}
            customFunction={customFunction}
            totalRecord={getTotalRecord}
            disableSearch
          /> */}
          </Grid>
          <ExportTable
            exportType={openExcel}
            filter={newFilter}
            url={API_REPORT_VISIT_CUSTOMER}
            open={openExcel}
            onClose={handleCloseExcel}
            exportDate={exportDate}
            startDate={filter.startDate}
            endDate={filter.endDate}
            employee={employee}
            department={filter.organizationUnitId}
            customer={customer}
            maxLimit={maxLimit}
          />

          <Grid item xs={12} container direction="row" alignItems="center" spacing={16}>
            {/* <Grid item xs={2} container direction="row" alignItems="flex-start">
            <CustomInputBase disabled label="Tổng số khách hàng" value={totalCustomer} />
          </Grid> */}
            {/* <Grid item xs={4} container direction="row" alignItems="flex-end" style={{ paddingLeft: 50 }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                value={exportDate}
                variant="outlined"
                label="Ngày xuất báo cáo"
                margin="dense"
                required
                name="exportDate"
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Grid> */}

            <Grid item xs={12} container direction="row" justify="flex-end" >
              {/* <Button variant="outlined" onClick={onExportPDF} style={styles.importBtn}>
              Xuất PDF
            </Button>
            <Button variant="outlined" onClick={onExportExcel} style={styles.importBtn}>
              Xuất báo cáo
            </Button> */}

              <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
                Xuất báo cáo
              </Button>
              <Button variant="outlined" color="secondary" onClick={props.onClose} style={styles.importBtn}>
                Thoát
              </Button>

              <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
                <MenuItem onClick={onExportExcel} style={styles.menuItem}>
                  Excel
                </MenuItem>
                <MenuItem onClick={onExportPDF} style={styles.menuItem}>
                  PDF
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </div>

    </React.Fragment>
  );
}

export default memo(ReportCustomerContract);

const styles = {
  importBtn: {
    marginLeft: 10,
    width: 200,
  },
  menuItem: {
    width: 200,
    justifyContent: 'center',
  },
};
