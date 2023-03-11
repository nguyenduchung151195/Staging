import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Dialog, DialogContent, withStyles, Slide, AppBar, Tab, Tabs, Toolbar } from '@material-ui/core';
import { Grid, TextField, MenuItem, Button, Menu } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  API_REPORT_HRM_BY_SIGNED,
  API_REPORT_HRM_SENIORITY,
  API_REPORT_HRM_DEGREE,
  API_REPORT_HRM_BY_FEE_RECRUIMENT,
  API_REPORT_HRM_BY_FEE_RECRUIMENT_POSITION_PRICE,
  API_REPORT_HRM_BY_FEE_RECRUIMENT_BIAS_PRICE,
  API_REPORT_HRM_BY_FEE_RECRUIMENT_AMOUNT,
} from '../../../../config/urlConfig';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { Typography } from '../../../../components/LifetekUi';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import CustomInputBase from 'components/Input/CustomInputBase';
import ExportTable from './exportTable';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { tableToExcel, tableToPDF } from 'helper';
import HrmSignedChart from './hrmSignedChart';
import HrmDegreeChart from './hrmDegreeChart';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);

function ReportHrmRecruimentAmount(props) {
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
  const [reportAmountData, setReportAmountData] = useState([]);
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
    fetchReportAmount();
    return () => setReload(false);
  }, []);

  const fetchReportAmount = () => {
    fetch(`${API_REPORT_HRM_BY_FEE_RECRUIMENT_AMOUNT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.status && data.data) {
          let listData = [];
          data.data.map(item => {
            listData.push({ name: item.name, value: item.costPrice, count: item.wage });
          });
          setReportAmountData(listData);
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
      order: index + 1 + curr * 10,
      birthday: item.birthday && moment(item.birthday).format('YYYY'),
      degree: item['degree.title'] ? item['degree.title'] : '',
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

  function createChart(id, data, titleTex) {
    const chart = am4core.create(id, am4charts.XYChart);

    chart.data = data.result;

    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 19;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.numberFormatter.numberFormat = '#';
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = 'value';
    series.dataFields.categoryY = 'name';
    series.name = '';
    series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
    series.columns.template.height = am4core.percent(100);
    series.sequencedInterpolation = true;

    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = '{valueX}';
    valueLabel.label.horizontalCenter = 'left';
    valueLabel.label.dx = 10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;

    let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
    categoryLabel.label.text = '{count}';
    categoryLabel.label.horizontalCenter = 'right';
    categoryLabel.label.dx = -10;
    categoryLabel.label.fill = am4core.color('#fff');
    categoryLabel.label.hideOversized = false;
    categoryLabel.label.truncate = false;

    //   createSeries('income', 'Hợp đồng có kì hạn');
    //   createSeries('expenses', 'Hợp đồng không kì hạn');
    //   createSeries('cumi', 'Hợp đồng theo mùa vụ');
    // disable logo
    if (chart.logo) {
      chart.logo.disabled = true;
    }
    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';

    // Add scrollbar
    // chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX.series.push(series2);
    // chart.scrollbarX.parent = chart.bottomAxesContainer;
    return chart;
  }

  function ColumnXYChartSIgned(props) {
    const [chart, setChart] = useState(null);
    const { id, data, isExport, onExportSuccess, titleTex } = props;
    useEffect(
      () => {
        if (isExport && chart) {
          chart.exporting.export('pdf');
          onExportSuccess();
        }
      },
      [isExport, onExportSuccess],
    );

    useEffect(() => {
      createChart(id, data, titleTex);
    }, []);

    return <div {...props} style={{ height: 700, padding: '20px 0', width: '100%' }} id={id} />;
  }

  return (
    <React.Fragment>
      <Grid container spacing={16} style={{ width: window.innerWidth - 240, marginTop: 60 }}>
      <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 15 }}>
              Báo cáo phân tích chi phí tuyển dụng
            </Typography>
        <Grid xs={12} style={{ marginTop: 20 }}>
          <CustomChartWrapper disableReload disableExport height={700}>
            <ColumnXYChartSIgned
              id="amount"
              data={reportAmountData}
              titleTex="Chi phí theo nguồn"
              style={{ width: '100%', maxHeight: '100vh', height: '100vh' }}
            />
          </CustomChartWrapper>
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

export default memo(ReportHrmRecruimentAmount);
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
