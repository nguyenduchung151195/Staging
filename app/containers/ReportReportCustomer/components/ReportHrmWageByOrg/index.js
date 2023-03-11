import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Grid, TextField, MenuItem, Button, Menu, Tooltip, IconButton } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { API_REPORT_HRM_WAGE_BY_ORG } from '../../../../config/urlConfig';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import { Typography } from '../../../../components/LifetekUi';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import ExportTable from './exportTable';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { tableToExcel, tableToPDF, serialize } from 'helper';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { Archive } from '@material-ui/icons';
am4core.useTheme(Am4themesAnimated);

const FIX_COLUMNS = [
  { name: 'name', title: 'Tên', checked: true },
  { name: 'total', title: 'Tổng cộng', checked: true },
  { name: 'newTask', title: 'Công việc mới', checked: true },
  { name: 'doing', title: 'Công việc đang thực hiện', checked: true },
  { name: 'success', title: 'Công việc hoàn thành', checked: true },
];
function ColumnPieChart(props) {
  const { id, data, type = '', titleTex, isExport } = props;
  let circleChart1;

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart3D);
      chart.depth = 30;
      chart.angle = 40;
      // remove logo am4chart
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 16;
      title.marginBottom = 20;
      title.fontWeight = '500';

      // Add data
      chart.data = data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries3D());
      pieSeries.dataFields.value = 'wage';
      pieSeries.dataFields.category = 'name';
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;
      chart.legend = new am4charts.Legend();
      pieSeries.legendSettings.itemValueText = '{value}';
      chart.legend.width = 200;
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      circleChart1 = chart;
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

  return <div {...props} style={{ height: 630, padding: '20px 0', marginTop: 20, width: '100%' }} id={id} />;
}
function ReportBusinessOpportunities(props) {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState({
    date: moment().format('YYYY-MM-DD'),
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
    setFilter({ ...filter, date: today });
    setReload(true);
    return () => setReload(false);
  }, []);
  useEffect(
    () => {
      const filters = {
        date: filter.date,
      };
      const dataFil = serialize(filters);
      console.log(dataFil);
      fetch(`${API_REPORT_HRM_WAGE_BY_ORG}?date=${filter.date}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setDataCharts(data.data);
        });
    },
    [filter],
  );

  const handleChangeFilter = (e, isDate, isStartDate) => {
    const name = isDate ? 'date' : 'typeEmp';
    const value = isDate ? (isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    const newFilter = { ...filter, [name]: value };
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
    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
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
        const content = tableToPDF('excelTableWageOrg');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excelTableWageOrg', 'W3C Example Table');
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
            Báo cáo thống kê lương theo phòng ban
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
                  views={['year', 'month']}
                  inputVariant="outlined"
                  fullWidth
                  // format="DD/MM/YYYY"
                  value={filter.date}
                  variant="outlined"
                  label="Lọc theo tháng"
                  margin="dense"
                  // required
                  name="date"
                  onChange={e => handleChangeFilter(e, true, false)}
                />
              </MuiPickersUtilsProvider>
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
          <ListPage
            apiUrl={API_REPORT_HRM_WAGE_BY_ORG}
            code="reportHrmWageByOrg"
            customFunction={customFunction}
            filter={newFilter}
            disableSearch
            disableAdd
            disablePaging
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
        </Grid>
        <Grid item xs={6} style={{ marginTop: 20 }}>
          <CustomChartWrapper height={650} disableReload disableExport>
            <ColumnPieChart id="chartData" data={dataCharts} titleTex="BIỂU ĐỒ LƯƠNG" />
          </CustomChartWrapper>
        </Grid>
        <ExportTable
          exportType={openExcel}
          filter={{ ...newFilter }}
          url={API_REPORT_HRM_WAGE_BY_ORG}
          open={openExcel}
          onClose={handleCloseExcel}
          // exportDate={exportDate}
          // startDate={filter.startDate}
          // endDate={filter.endDate}
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
                // required
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
