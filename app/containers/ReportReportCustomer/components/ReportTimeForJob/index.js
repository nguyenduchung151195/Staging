import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Grid, TextField, Button, Menu, MenuItem, Tooltip, IconButton } from '@material-ui/core';
import compact from 'lodash/compact';
import { API_CUSTOMERS_SEARCH_REPORT } from 'config/urlConfig';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/ru';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { API_REPORT_TIME_FOR_JOB, API_SAMPLE_PROCESS } from '../../../../config/urlConfig';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import { AsyncAutocomplete, Typography } from '../../../../components/LifetekUi';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF } from 'helper';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';
import { Archive } from '@material-ui/icons';
moment.locale('vi');
import {  serialize } from '../../../../helper';

const FIX_COLUMNS = [
  { name: 'businessName', title: 'Tên khách hàng', checked: true },
  { name: 'startTime', title: 'Thời gian tiếp xúc', checked: true },
  { name: 'people', title: 'Nhân viên', checked: true },
  { name: 'organizationUnitId', title: 'Phòng ban/ chi nhánh', checked: true },
  // { name: 'organizationUnitId', title: 'Chi nhánh', checked: true },
  { name: 'result', title: 'Kết quả tiếp xúc', checked: true },
];
function ReportPersonnelStatistics(props) {
  const { profile, miniActive } = props;
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
  const [template, setTemplate] = useState();
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
  const getAllData = response => {
    const {
      response: { stageList },
    } = response;
    // const defaultColumns = [
    //   { name: 'name', title: 'Tên nhân viên', checked: true },
    //   { name: 'countTimeEmp', title: 'Thời gian TB thực hiện quy trình', checked: true },
    // ];
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === 'reportDoingTask');
    const defaultColumns = currentViewConfig.listDisplay.type.fields.type.columns;
    if (Array.isArray(stageList) && stageList.length > 0) {
      const columns = [...stageList];
      const columnDb = columns.map(it => ({ name: it.leafIndex, title: it.name, checked: true }));
      const newColumns = [...defaultColumns, ...columnDb];
      const newBand = columns.map(it => ({
        title: it.name,
        children: [{ columnName: `${it.leafIndex}count` }, { columnName: `${it.leafIndex}countTime` }],
      }));

      setColumns(newColumns || []);
    } else {
      setColumns(null);
    }
  };

  const handleChangeDepartmentAndEmployee = useCallback(
    result => {
      const { department, employee } = result;
      const newFilter = { ...filter };
      if (department) {
        setFilter({ ...filter, organizationUnitId: department });
      } else if (department === 0) {
        delete newFilter.organizationUnitId;
        setFilter({ ...newFilter });
      }
      if (employee && employee._id) {
        setFilter({ ...filter, employeeId: employee && employee._id });
        setEmployee(employee);
      } else if (!employee && newFilter.employeeId) {
        delete newFilter.employeeId;
        setFilter({ ...newFilter });
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
  const handleChangeTemplate = useCallback(
    value => {
      const newFilter = { ...filter };
      if (value && value._id) {
        setFilter({ ...filter, template: value && value._id });
        setTemplate(value);
      } else {
        delete newFilter.template;
        setTemplate(null);
        setFilter({ ...newFilter });
      }
    },
    [filter],
  );

  const customFunction = data => {
    const newData = data.map(it => {
      const {
        originItem: { time },
      } = it;
      const dataMapColumnDb = {};
      if (Array.isArray(time)) {
        time.forEach(it => {
          dataMapColumnDb[it.leafIndex] = it.countTime;
        });
      }

      return { ...it, ...dataMapColumnDb };
    });

    return newData;
    // return data.map(item => ({
    //   ...item,
    // }));
  };
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
        const content = tableToPDF('reportDoingTask');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('reportDoingTask', 'W3C Example Table');
    }

    // setOpenExcel(null);
    // tableToExcel('excel-table-customer-contract', 'W3C Example Table');
  };
  return (
    <React.Fragment>
      <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
        <Grid xs={12}>
          <Typography gutterBottom align="center" variant="h5" style={{ marginTop: 30 }}>
            Báo cáo thời gian thực hiện công việc
          </Typography>

          <Grid spacing={16} container direction="row" justify="flex-start" alignItems="center" xs={12} style={{ paddingLeft: 50, paddingTop: 20 }}>
            <Grid item xs={2} style={{ marginBottom: 5 }}>
              <AsyncAutocomplete
                label="Loại quy trình" // value={filter.template}
                onChange={handleChangeTemplate}
                url={API_SAMPLE_PROCESS} // optionLabel="name"
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
                moduleCode="reportDoingTask"
              />
            </Grid>

            {/* <Grid container xs={4} style={{ paddingLeft: 15, marginBottom: 5 }}> */}
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 5 }}>
              <MuiPickersUtilsProvider utils={MomentUtils} locale={locale} libInstance={moment}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={filter.startDate}
                  variant="outlined"
                  label="Từ ngày"
                  margin="dense"
                  fullWidth
                  required
                  name="startDate"
                  onChange={e => handleChangeFiler(e, true, true)}
                />
              </MuiPickersUtilsProvider>
              {/* <CustomInputBase label="Từ ngày" type="date" name="startDate" value={filter.startDate} onChange={handleChangeFiler} /> */}
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextStartDate}</p>
              ) : null}
            </Grid>
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 5 }}>
              <MuiPickersUtilsProvider utils={MomentUtils} locale={locale} libInstance={moment}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={filter.endDate}
                  variant="outlined"
                  label="Đến ngày"
                  margin="dense"
                  fullWidth
                  required
                  name="endDate"
                  onChange={e => handleChangeFiler(e, true, false)}
                />
              </MuiPickersUtilsProvider>
              {/* <CustomInputBase label="Đến ngày" type="date" name="endDate" value={filter.endDate} onChange={handleChangeFiler} /> */}
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextEndDate}</p>
              ) : null}
            </Grid>
            {/* </Grid> */}
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 5 }}>
              <Tooltip title="Xuất dữ liệu">
                <IconButton aria-label="Export" onClick={e => setExportAnchor(e.currentTarget)}>
                  <Archive style={{ width: '30px', height: '30px' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {filter.startDate <= filter.endDate ? (
            <ListPage
              apiUrl={`${API_REPORT_TIME_FOR_JOB}`}
              code="reportDoingTask"
              customFunction={customFunction}
              filter={filter}
              filterH={filter}
              disableImport
              disableViewConfig
              disableSearch
              disableAdd
              disableSelect
              disableEdit
              filterType
              getAllData={getAllData}
              totalRecord={getTotalRecord}
              totalCustomer={getTotalCustomer}
              reload={reload}
              disableFieldName={[{ name: 'edit' }]}
              disabledRow
              getMaxLimit={setMaxLimit}
            />
          ) : (
            <ListPage
              code="reportDoingTask"
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
              noData
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
          filter={filter}
          url={API_REPORT_TIME_FOR_JOB}
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
          <Grid item xs={4} container direction="row" alignItems="flex-end" style={{ paddingLeft: 50 }}>
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
          </Grid>

          <Grid item xs={8} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
            {/* <Button variant="outlined" onClick={onExportPDF} style={styles.importBtn}>
              Xuất PDF
            </Button>
            <Button variant="outlined" onClick={onExportExcel} style={styles.importBtn}>
              Xuất báo cáo
            </Button> */}

            {/* <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
              Xuất báo cáo
            </Button> */}
            {/* <Button variant="outlined" color="secondary" onClick={props.onClose} style={styles.importBtn}>
                            Thoát
                        </Button> */}

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
    </React.Fragment>
  );
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ReportPersonnelStatistics);

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
