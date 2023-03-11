import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Dialog, DialogContent, withStyles, Slide, AppBar, Tab, Tabs, Toolbar, Tooltip, IconButton } from '@material-ui/core';
import { Grid, TextField, MenuItem, Button, Menu } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  API_REPORT_HRM_BY_SIGNED,
  API_REPORT_HRM_SENIORITY,
  API_REPORT_HRM_DEGREE,
  API_ADD_CANDIDATE,
  API_REPORT_HRM_BY_CANDIDATE,
} from '../../../../config/urlConfig';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { Typography } from '../../../../components/LifetekUi';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import CustomInputBase from 'components/Input/CustomInputBase';
import ExportTable from './exportTable';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { tableToExcel, tableToPDF, serialize } from 'helper';
import HrmSignedChart from './hrmSignedChart';
import HrmDegreeChart from './hrmDegreeChart';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { Archive } from '@material-ui/icons';
am4core.useTheme(Am4themesAnimated);

const fakeData = [
  { name: 'Đại học', value: 20 },
  { name: 'Cao đẳng', value: 12 },
  { name: 'Giáo sư', value: 22 },
  { name: 'Tiến sĩ', value: 11 },
  { name: 'Thạc sĩ', value: 9 },
];
const fakeDataXY = [
  { name: '< 1 năm', value: 20 },
  { name: '1-2 năm', value: 12 },
  { name: '2-3 năm', value: 22 },
  { name: '3-4 năm', value: 11 },
  { name: '> 5 năm', value: 9 },
];
function ColumnPieChart(props) {
  const { id, data, type = '', titleTex, isExport } = props;
  let circleChart1;
  //   let final = [];
  //   if (!Array.isArray(data)) {
  //     let keys = (data && Object.keys(data)) || [];
  //     keys.map(key => {
  //       let obj = {
  //         name: getNameBy(key, type),
  //         proportion: data && data[key],
  //       };
  //       final.push(obj);
  //     });
  //   }

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart3D);
      chart.depth = 30;
      chart.angle = 40;
      // remove logo am4chart
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 19;
      title.marginBottom = 30;
      title.fontWeight = 'bold';

      // Add data
      chart.data = data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries3D());
      pieSeries.dataFields.value = 'value';
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

  return <div {...props} style={{ height: 530, padding: '20px 0', width: '100%' }} id={id} />;
}

function ColumnChart2(props) {
  const { id, data = [], titleTex, dataName = [] } = props;

  // eslint-disable-next-line no-unused-vars
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0;

    chart.data = data;
    //set color
    chart.colors.list = [am4core.color('green'), am4core.color('#D65DB1')];
    // add chart legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom';
    chart.legend.paddingBottom = 0;
    chart.legend.labels.template.maxWidth = 150;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'recruitmentUnit';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    // valueAxis.max = 6000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(value, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'recruitmentUnit';
      series.dataFields.valueY = value;
      series.name = name;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      //set width series
      series.columns.template.width = am4core.percent(60);
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    // createSeries('add', 'Tuyển dụng ngày 21-1  -  Nhân viên');
    // createSeries('123121', 'Đợt tuyển dụng 1  -  Marketting');
    // createSeries('323', 'Đợt tuyển dụng 2  -  Giám đốc sản xuất');
    // createSeries('dot4', 'Đợt 4');
    // createSeries('dot5', 'Đợt 5');
    dataName.map(i => {
      createSeries(i.code, i.name);
    });

    ColumnChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

function ReportBusinessOpportunities(props) {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState({
    gender: '0',
    degree: null,
    beginWorkStartDate: moment()
      .subtract(30, 'years')
      .format('YYYY-MM-DD'),
    beginWorkEndDate: moment().format('YYYY-MM-DD'),
  });
  const [employee, setEmployee] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [dataCharts, setDataCharts] = useState([]);
  const [dataName, setDataName] = useState([]);
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
  const [reportSeniorityData, setReportSeniorityData] = useState([]);
  const [reportDegreeData, setReportDegreeData] = useState([]);
  const degree = JSON.parse(localStorage.getItem('hrmSource')).find(item => item.code === 'S07');
  const dataDegree = degree && degree.data;

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
    setFilter({ ...filter, beginWorkEndDate: today });
    setReload(true);
    fetchReportSeniority();
    fetchReportDegree();
    return () => setReload(false);
  }, []);

  useEffect(
    () => {
      const filters = {
        date: filter.date,
      };
      const dataFil = serialize(filters);
      fetch(`${API_ADD_CANDIDATE}/byUnit`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setDataName(data.noteArray);
          setDataCharts(data.data);
        });
    },
    [filter],
  );

  const fetchReportSeniority = () => {
    fetch(`${API_REPORT_HRM_SENIORITY}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.status && data.data) {
          setReportSeniorityData([
            { name: '< 1 năm', value: data.data.underOneYear },
            { name: '1-2 năm', value: data.data.underTwoYear },
            { name: '2-3 năm', value: data.data.underThreeYear },
            { name: '3-4 năm', value: data.data.underFourYear },
            { name: '> 4 năm', value: data.data.aboveFourYear },
          ]);
        }
      })
      .catch(error => console.log('error', error));
  };

  const fetchReportDegree = () => {
    fetch(`${API_REPORT_HRM_DEGREE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.status && data.data) {
          setReportDegreeData(data.data);
        }
      })
      .catch(error => console.log('error', error));
  };

  const handleChangeFilter = (e, isDate, isStartDate) => {
    let newFilter;
    if (isDate) {
      const name = isDate ? (isStartDate ? 'beginWorkStartDate' : 'beginWorkEndDate') : 'typeEmp';
      const value = isDate ? (isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
      newFilter = { ...filter, [name]: value };
      // TT
      if (!newFilter.beginWorkStartDate && newFilter.beginWorkEndDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('nhập thiếu: "Từ ngày"');
        setErrorTextEndDate('');
      } else if (newFilter.beginWorkStartDate && !newFilter.beginWorkEndDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('');
        setErrorTextEndDate('nhập thiếu: "Đến ngày"');
      } else if (
        newFilter.beginWorkStartDate &&
        newFilter.beginWorkEndDate &&
        new Date(newFilter.beginWorkEndDate) < new Date(newFilter.beginWorkStartDate)
      ) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
        setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
      } else {
        setErrorStartDateEndDate(false);
        setErrorTextStartDate('');
        setErrorTextEndDate('');
      }
    } else {
      const name = e.target.name;
      const value = e.target.value;
      newFilter = { ...filter, [name]: value };
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

  const customFunction = (data, curr) =>
    data.map((item, index) => ({
      ...item,
      birthday: item.birthday && moment(item.birthday).format('DD/MM/YYYY'),
      ['recruitmentWave.name']: item.recruitmentWaveName,
      statusRecruitment: item.status,
      'specialize.title': item['informatics.title'],
      experienceYear: item.experienceYear,
      university: item['certificate.title'],
      position: item.position,
    }));

  const getTotalRecord = count => {
    setTotalRecord(count);
  };
  const getTotalCustomer = count => {
    setTotalCustomer(count);
  };

  const onExportExcel = () => {
    if (!filter.beginWorkStartDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.beginWorkEndDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
    if (!exportDate || moment(exportDate).isBefore(moment(filter.beginWorkStartDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }
    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
    if (!filter.beginWorkStartDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.beginWorkEndDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
    if (!exportDate || moment(exportDate).isBefore(moment(filter.beginWorkStartDate))) {
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
        const content = tableToPDF('excelTableBySign');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excelTableBySign', 'W3C Example Table');
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
      <Tabs
        value={tabIndex}
        onChange={(event, tabIndex) => {
          setTabIndex(tabIndex);
        }}
        indicatorColor="primary"
        textColor="primary"
        style={{ width: 500 }}
      >
        <Tab value={0} label={'Báo cáo'} />
        <Tab value={1} label={'Biểu đồ'} />
      </Tabs>
      {tabIndex === 0 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 250 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Báo cáo chi tiết hồ sơ theo nhu cầu/đợt tuyển dụng
            </Typography>
            <Grid item spacing={16} container direction="row" justify="flex-start" alignItems="center" style={{ paddingLeft: 50, paddingTop: 20 }}>
              <Grid item xs={2}>
                <DepartmentAndEmployee
                  department={filter.organizationUnitId}
                  employee={employee}
                  disableEmployee
                  onChange={handleChangeDepartmentAndEmployee}
                  profile={props.profile}
                  moduleCode="reportHrmCountBySignedContractDate"
                />
              </Grid>
              <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={filter.beginWorkStartDate}
                    fullWidth
                    variant="outlined"
                    label="Từ ngày"
                    margin="dense"
                    name="beginWorkStartDate"
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
                    value={filter.beginWorkEndDate}
                    variant="outlined"
                    label="Đến ngày"
                    margin="dense"
                    name="beginWorkEndDate"
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

          <Grid item xs={12}>
            {newFilter.beginWorkStartDate <= newFilter.beginWorkEndDate ? (
              <ListPage
                apiUrl={API_REPORT_HRM_BY_CANDIDATE}
                code="ReportHrmCandidate"
                customFunction={customFunction}
                filter={newFilter}
                disableSearch
                disableAdd
                disableImport
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
                code="ReportHrmCandidate"
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
          {/* <Grid item xs={6} style={{marginTop: 20}}>
                    <CustomChartWrapper height={500}>
                        <ColumnPieChart
                            id="chartData"
                            data={dataCharts}
                            male={dataCharts.length > 0 ? dataCharts[0].value : 0}
                            feMale={dataCharts.length > 0 ? dataCharts[1].value : 0}
                            titleTex="BIỂU ĐỒ TỔNG NHÂN SỰ"
                        />
                    </CustomChartWrapper>
                </Grid> */}
          <ExportTable
            exportType={openExcel}
            filter={{ ...newFilter, endDate: moment(exportDate).isBefore(moment(filter.endDate)) ? exportDate : filter.endDate }}
            url={API_REPORT_HRM_BY_CANDIDATE}
            open={openExcel}
            onClose={handleCloseExcel}
            exportDate={exportDate}
            startDate={filter.beginWorkStartDate}
            endDate={filter.beginWorkEndDate}
            employee={employee}
            department={filter.organizationUnitId}
            //   maxLimit={maxLimit}
          />
          <Grid item xs={12} style={{ padding: '8px' }} spacing={4} container direction="row" alignItems="center">
            <Grid item xs={3} container direction="row" alignItems="flex-start" style={{ paddingLeft: 50 }}>
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
            <Grid item xs={9} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
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
      ) : null}
      {tabIndex === 1 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              BÁO CÁO THỐNG KÊ SỐ LƯỢNG HỒ SƠ TUYỂN DỤNG THEO ĐỢT
            </Typography>
            {/* <Grid item spacing={16} container direction="row" justify="flex-start" alignItems="center" style={{ paddingLeft: 50, paddingTop: 20 }}>
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
        </Grid> */}
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <CustomChartWrapper height={650} disableReload disableExport>
              <ColumnChart2
                id="chart4"
                data={dataCharts}
                dataName={dataName}
                titleTex="BIỂU ĐỒ SỐ LƯỢNG HỒ SƠ THEO ĐỢT TUYỂN DỤNG THEO ĐỢT"
                style={{ width: '100%', maxHeight: '100vh', height: '70vh' }}
              />
            </CustomChartWrapper>
          </Grid>
        </Grid>
      ) : null}
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
