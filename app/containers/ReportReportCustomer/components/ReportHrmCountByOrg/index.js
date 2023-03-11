import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Grid, TextField, MenuItem, Button, Menu, Tooltip, IconButton } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { API_REPORT_HRM_BY_ORG } from '../../../../config/urlConfig';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import { Typography } from '../../../../components/LifetekUi';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import ExportTable from './exportTable';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { tableToExcel, tableToPDF } from 'helper';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { Fullscreen, Refresh, FullscreenExit, ImportExport, Archive, Remove } from '@material-ui/icons';

am4core.useTheme(Am4themesAnimated);

const FIX_COLUMNS = [
  { name: 'name', title: 'Tên', checked: true },
  { name: 'total', title: 'Tổng cộng', checked: true },
  { name: 'newTask', title: 'Công việc mới', checked: true },
  { name: 'doing', title: 'Công việc đang thực hiện', checked: true },
  { name: 'success', title: 'Công việc hoàn thành', checked: true },
];
function ColumnPieChart(props) {
  const { id, data, type = '', titleTex, isExport, male, feMale } = props;
  let circleChart1;

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);

      // Add data
      chart.data = data;

      const title = chart.titles.create();
      title.text = titleTex && titleTex.toUpperCase();
      title.fontSize = 20;
      title.marginBottom = 10;
      title.fontWeight = 'bold';

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'name';
      pieSeries.dataFields.id = 'fields';
      chart.legend = new am4charts.Legend();
      pieSeries.legendSettings.itemValueText = '{value}';
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      circleChart1 = chart;

      chart.innerRadius = am4core.percent(55);

      // disable logo
      if (chart.logo) {
        chart.logo.disabled = true;
      }

      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (circleChart1) {
        circleChart1.dispose();
      }
    },
    [data],
  );

  return (
    <React.Fragment style={{ position: 'relative' }}>
      <div {...props} style={{ height: '100%', padding: '20px 0', marginTop: 20, width: '100%' }} id={id} />
      <div style={{ position: 'relative', top: '-48%', left: '85%', transform: 'translate(-50%, -50%)', fontWeight: 'bold' }}>
        {`${male} / ${feMale}`} <br />
      </div>
      <div
        style={{ position: 'relative', top: '-47%', left: '84%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', color: 'rgb(192 123 131)' }}
      >
        <p>Nam / Nữ</p>
      </div>
    </React.Fragment>
  );
}
function ReportBusinessOpportunities(props) {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState({
    startDate: moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const [employee, setEmployee] = useState(null);
  const [dataCharts, setDataCharts] = useState([]);
  const [exportDate, setExportDate] = useState('');
  const [openExcel, setOpenExcel] = useState(null);
  const [reload, setReload] = useState(false);
  const [productGroup, setProductGroup] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  // TT
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [exportRole, setExportRole] = useState(false);
  const [maxLimit, setMaxLimit] = useState();
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    setExportDate(date);

    // get first day of month
    const firstDayOfMonth = moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD');
    // // get today
    const today = moment().format('YYYY-MM-DD');
    setFilter({ ...filter, startDate: firstDayOfMonth, endDate: today });
    setReload(true);
    return () => setReload(false);
  }, []);
  useEffect(() => {
    fetch(API_REPORT_HRM_BY_ORG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.data, 'kdkaskdska');
        let allData = [];
        let allMale = 0;
        let allFemale = 0;
        data.data.forEach(item => {
          allMale = allMale + item.totalMale;
          allFemale = allFemale + item.totalFemale;
        });
        console.log(allMale, allFemale, 'pdpsadp');
        const dataChart = [
          {
            name: 'Nhân viên nam',
            value: allMale,
          },
          {
            name: 'Nhân viên nữ',
            value: allFemale,
          },
        ];
        setDataCharts(dataChart);
      });
  }, []);

  const handleChangeFilter = (e, isDate, isStartDate) => {
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
  const handleChangeShow = value => {
    setShow(value);
  };

  const customFunction = data => {
    return data.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
  };

  const getTotalRecord = count => {
    setTotalRecord(count);
  };
  const getTotalCustomer = count => {
    setTotalCustomer(count);
  };

  const onExportExcel = () => {
    if (!filter.startDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.endDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
    if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }
    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
    if (!filter.startDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.endDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
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
      if ((html.length > 0) & (htmlTotal !== 0)) {
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
        const content = tableToPDF('excelTableOrg');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excelTableOrg', 'W3C Example Table');
    }

    // setOpenExcel(null);
    // tableToExcel('excel-table-bos', 'W3C Example Table');
  };

  const handleChangeExportDate = e => {
    setExportDate(e);
  };

  const customChildRows = (row, rootRows) => {
    let childRows = [];

    if (!row) {
      let remainRow = [];
      rootRows.map(e => {
        if (!e.parent) childRows.push(e);
        else remainRow.push(e);
      });

      remainRow = remainRow.filter(e => !rootRows.find(remain => remain._id === e.parent));

      childRows = [...remainRow, ...childRows];
    } else childRows = rootRows.filter(r => r.parent === row._id);

    return childRows.length ? childRows : null;
  };
  const newFilter = { ...filter };
  if (newFilter.typeEmp === 0) {
    delete newFilter.typeEmp;
  }

  return (
    <React.Fragment>
      <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
        <Grid xs={12}>
          <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
            Báo cáo thống kê nhân sự theo phòng ban
          </Typography>
          <Grid item spacing={16} container direction="row" justify="flex-start" alignItems="center" style={{ paddingLeft: 50, paddingTop: 20 }}>
            <Grid item xs={2}>
              <DepartmentAndEmployee
                department={filter.organizationUnitId}
                employee={employee}
                disableEmployee
                onChange={handleChangeDepartmentAndEmployee}
                profile={props.profile}
                moduleCode="reportHrmCountByOrg"
              />
            </Grid>
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={filter.startDate}
                  fullWidth
                  variant="outlined"
                  label="Từ ngày ký hợp đồng"
                  margin="dense"
                  required
                  name="startDate"
                  onChange={e => handleChangeFilter(e, true, true)}
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextStartDate}</p>
              ) : null}
            </Grid>
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
                  fullWidth
                  format="DD/MM/YYYY"
                  value={filter.endDate}
                  variant="outlined"
                  label="Đến ngày ký hợp đồng"
                  margin="dense"
                  required
                  name="endDate"
                  disableFuture
                  onChange={e => handleChangeFilter(e, true, false)}
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextEndDate}</p>
              ) : null}
            </Grid>
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
              <Tooltip title="Xuất dữ liệu">
                <IconButton aria-label="Export" onClick={e => setExportAnchor(e.currentTarget)}>
                  <Archive style={{ width: '30px', height: '30px' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          {newFilter.startDate <= newFilter.endDate ? (
            <ListPage
              apiUrl={API_REPORT_HRM_BY_ORG}
              code="reportHrmCountByOrg"
              customFunction={customFunction}
              filter={newFilter}
              disableSearch
              disableAdd
              disableImport
              // noQuery
              disableViewConfig
              disableSelect
              disableEdit
              withPagination
              filterType
              //   totalRecord={getTotalRecord}
              //   totalCustomer={getTotalCustomer}
              //   disableFieldName={[{ name: 'edit' }]}
              //   disabledRow
              //   tree
              //   customChildRows={customChildRows}
              //   getMaxLimit={setMaxLimit}
            />
          ) : (
            <ListPage
              code="reportHrmCountByOrg"
              customFunction={
                customFunction // reload={reload} // null // apiUrl={API_REPORT_STATISTICAL_BOS}
              }
              disableSearch
              disableAdd
              disabledImport
              disableSelect
              disableEdit
              filterType
              reload={
                false // filter={filter}
              }
              noData
              disableFieldName={[{ name: 'edit' }]}
              disabledRow
              // tree
              // customChildRows={customChildRows}
            />
          )}
        </Grid>
        <Grid item xs={6} style={{ marginTop: 20 }}>
          <CustomChartWrapper height={500} disableReload disableExport>
            <ColumnPieChart
              id="chartData"
              data={dataCharts}
              male={dataCharts.length > 0 ? dataCharts[0].value : 0}
              feMale={dataCharts.length > 0 ? dataCharts[1].value : 0}
              titleTex="BIỂU ĐỒ TỔNG NHÂN SỰ"
            />
          </CustomChartWrapper>
        </Grid>
        <ExportTable
          exportType={openExcel}
          filter={{ ...newFilter, endDate: moment(exportDate).isBefore(moment(filter.endDate)) ? exportDate : filter.endDate }}
          url={API_REPORT_HRM_BY_ORG}
          open={openExcel}
          onClose={handleCloseExcel}
          exportDate={exportDate}
          startDate={filter.startDate}
          endDate={filter.endDate}
          employee={employee}
          department={filter.organizationUnitId}
          //   maxLimit={maxLimit}
        />
        <Grid item xs={12} style={{ padding: '8px' }} spacing={4} container direction="row" alignItems="center">
          <Grid item xs={2} container direction="row" alignItems="flex-start" style={{ paddingLeft: 50 }}>
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
                onChange={handleChangeExportDate}
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={10} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
            {/* <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
              Xuất báo cáo
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
// const mapStateToProps = createStructuredSelector({
//   stockPage: makeSelectStockPage(),
// });

// const withConnect = connect(
//   mapStateToProps,
// );

export default memo(ReportBusinessOpportunities);
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
