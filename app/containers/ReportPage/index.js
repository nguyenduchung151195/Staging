/* eslint-disable jsx-a11y/iframe-has-title */
/**
 *
 * ReportPage
 *
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TableBody, TableCell, Table, TableRow, TableHead } from '@material-ui/core';
import { Public, SignalCellularAlt, StartRate } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import { Helmet } from 'react-helmet';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import ReportReportCustomer from 'containers/ReportReportCustomer';
import ReportTask from 'containers/ReportTask';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectReportPage from './selectors';

import messages from './messages';
import { injectIntl } from 'react-intl';

import reducer from './reducer';
import saga from './saga';

import { Tabs, Tab, Grid, Typography, Paper } from '../../components/LifetekUi';
import { getAllReportInventory, getChargeProportion, getSumInYear, getSumRevenueCostInYear, getSumRevenueInventoryInYear, getCompareSalesPersonSalesOfYear, getProportionOfCostByItem } from './actions';
import ListPage from 'components/List';
import { API_REPORT_INVENTORY } from 'config/urlConfig';
import { aggregateSalesOfSaleStaff, inventoryReportByMonthColumns } from '../../variable';
import { formatNumber } from 'utils/common';
import { API_REPORT_AGGREGATE_SALES_OF_BUSINESS_STAff } from '../../config/urlConfig';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
/* eslint-disable react/prefer-stateless-function */

am4core.useTheme(Am4themesAnimated);

const ReportBox = memo(props => (
  <div
    item
    md={3}
    spacing={4}
    style={{ background: props.color, borderRadius: '3px', padding: '25px 10px', width: props.size ? props.size : '30%', position: 'relative' }}
  >
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </div>
));

function ColumnChart(props) {
  const { id, data } = props;
  let columnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    const title = chart.titles.create();
    title.text = 'Tỷ trọng chi phí theo khoản mục';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    // Create axes
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'expendName';
    categoryAxis.numberFormatter.numberFormat = '#';
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;
    valueAxis.min = 0;

    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = 'expendName';
      series.name = name;
      series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;

      const valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = '{valueX}';
      valueLabel.label.horizontalCenter = 'left';
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;

      const categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.text = '{name}';
      categoryLabel.label.horizontalCenter = 'right';
      // categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color('#fff');
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }
    createSeries('expendValue', 'Tỷ trọng');
    columnChart = chart;
    return () => {
      chart.dispose();
    }
  }, [data]);
  // useEffect(
  //   () => () => {
  //     if (columnChart) {
  //       columnChart.dispose();
  //     }
  //   },
  //   [],
  // );
  return <div {...props} id={id} />;
}

function CircleChart(props) {
  const { id, data, titleTex, value, category } = props;

  let circleChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.PieChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';

    // Add data
    chart.data = data;

    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = value;
    pieSeries.dataFields.category = category;
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    chart.legend = new am4charts.Legend();

    chart.legend.labels.template.textDecoration = "none";
    chart.legend.valueLabels.template.textDecoration = "none";

    var as = chart.legend.labels.template.states.getKey("active");
    as.properties.textDecoration = "line-through";
    as.properties.fill = am4core.color("#000");

    var as2 = chart.legend.valueLabels.template.states.getKey("active");
    as2.properties.textDecoration = "line-through";
    as2.properties.fill = am4core.color("#000");

    circleChart = chart;
    return () => {
      circleChart.dispose();
    }
  }, [data]);
  // useEffect(
  //   () => () => {
  //     if (circleChart) {
  //       circleChart.dispose();
  //     }
  //   },
  //   [],
  // );
  return <div {...props} id={id} />;
}

function BarChart(props) {
  const { id, data } = props;
  let barChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    const title = chart.titles.create();
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    // Create axes
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'month';
    categoryAxis.numberFormatter.numberFormat = '#';
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;

    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = 'month';
      series.name = name;
      series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
      series.columns.template.height = am4core.percent(130);
      series.sequencedInterpolation = true;

      const valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = '{valueX}';
      valueLabel.label.horizontalCenter = 'left';
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;

      const categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.text = '{name}';
      categoryLabel.label.horizontalCenter = 'right';
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color('#fff');
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }
    chart.cursor = new am4charts.XYCursor();
    chart.legend = new am4charts.Legend();
    createSeries('realityKpi', 'Doanh thu bán hàng');
    createSeries('inventory', 'Giá vốn tồn kho');
    barChart = chart;
  }, [data]);
  useEffect(
    () => () => {
      if (barChart) {
        barChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

function ColumnXYChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let columnXYChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'month';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 1500;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'month';
      series.dataFields.valueY = field;
      series.name = name;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      series.columns.template.strokeOpacity = 0;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('totalPlan', 'Kế hoạch');
    createSeries('totalExpense', 'Chi phí');
    createSeries('totalExpenseLastYear', 'Cùng kỳ');

    chart.legend = new am4charts.Legend();

    columnXYChart = chart;
  }, [data]);
  useEffect(
    () => () => {
      if (columnXYChart) {
        columnXYChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}
function ColumnChart1(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 4000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'name';
      series.name = name;
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    chart.cursor = new am4charts.XYCursor();
    createSeries('sum', 'Doanh số');
    createSeries('kpiPlanEmpl', 'Kế hoạch');

    ColumnChart = chart;
    return () => {
      chart.dispose();
    }
  }, [data]);
  return <div {...props} id={id} />;
}
function ColumnChart2(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'month';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 2000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'month';
      series.name = name;
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;


      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    chart.cursor = new am4charts.XYCursor();
    createSeries('sourcePrice', 'Giá nhập');
    createSeries('realityKpi', 'Doanh thu');
    // createSeries('x3');
    // createSeries('x4');

    ColumnChart = chart;
    return () => {
      chart.dispose();
    }
  }, [data]);
  return <div {...props} id={id} />;
}

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
    <div
      style={{
        width: `${props.value}%`,
        background: 'linear-gradient(to right, #2196F3, #03a9f4b0)',
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    {/* <div
      style={{
        width: `${100 - props.value}%`,
        background: `${props.color}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    /> */}
    <span style={{ fontSize: 13, marginLeft: 3, color: '#e0e0e0', position: 'absolute' }}>
      {props.scale} %
      {/* %- {props.time} */}
      {/* ngày */}
    </span>
  </div>
);


export class ReportPage extends React.Component {
  state = {
    tab: 1,
    tabIndex: 0,
    columnData: [
      {
        year: 'Lương và phụ cấp cán bộ kinh doanh',
        income: 23.5,
      },
      {
        year: 'BHYT,BHXH',
        income: 26.2,
      },
      {
        year: 'Thưởng tháng, Quỹ phòng ',
        income: 30.1,
      },
      {
        year: 'Chi phí thanh toán',
        income: 29.5,
      },
      {
        year: 'CP điện thoại, internet của phòng kinh doanh',
        income: 14.6,
      },
      {
        year: 'Chi phí VPP, công cụ đồ dùng phòng KD',
        income: 32.5,
      },
      {
        year: 'Chi phí quảng cáo Marketing',
        income: 27.6,
      },
    ],
    circleData: [
      {
        country: 'Bộ phận kinh doanh 1',
        litres: 501.9,
      },
      {
        country: 'Bộ phận kinh doanh 2',
        litres: 301.9,
      },
      {
        country: 'Bộ phận kinh doanh 3',
        litres: 201.1,
      },
      {
        country: 'Bộ phận kinh doanh 4',
        litres: 165.8,
      },
      {
        country: 'Bộ phận kinh doanh 5',
        litres: 139.9,
      },
      {
        country: 'Bộ phận kinh doanh 6',
        litres: 128.3,
      },
      {
        country: 'Bộ phận kinh doanh 7 ',
        litres: 99,
      },
      {
        country: 'Bộ phận kế toán',
        litres: 60,
      },
      {
        country: 'Bộ phận sản xuất',
        litres: 50,
      },
    ],

    barChart: [
      {
        year: 'Tháng 1',
        income: 3322.5,
        expenses: 2918.1,
      },
      {
        year: 'Tháng 2',
        income: 3326.2,
        expenses: 2612.8,
      },
      {
        year: 'Tháng 3',
        income: 3330.1,
        expenses: 2513.9,
      },
      {
        year: 'Tháng 4',
        income: 3229.5,
        expenses: 2625.1,
      },
      {
        year: 'Tháng 5',
        income: 3424.6,
        expenses: 2925,
      },
      {
        year: 'Tháng 6',
        income: 3030.1,
        expenses: 2623.9,
      },
      {
        year: 'Tháng 7',
        income: 3429.5,
        expenses: 2725.1,
      },
      {
        year: 'Tháng 8',
        income: 3129.5,
        expenses: 2525.1,
      },
      {
        year: 'Tháng 9',
        income: 2629.5,
        expenses: 3425.1,
      },
      {
        year: 'Tháng 10',
        income: 3229.5,
        expenses: 3325.1,
      },
      {
        year: 'Tháng 11',
        income: 2829.5,
        expenses: 3525.1,
      },
      {
        year: 'Tháng 12',
        income: 3369.5,
        expenses: 2825.1,
      },
    ],

    partColumn2: [
      {
        country: 'Tháng 1',

        x2: 1232,
        x3: 516.3,
      },
      {
        country: 'Tháng 2',
        x2: 113.3,
        x3: 45.2,
      },
      {
        country: 'Tháng 3 ',
        x2: 1012.7,
        x3: 526.1,
      },
      {
        country: 'Tháng 4',
        x2: 1005.4,
        x3: 514.4,
      },
      {
        country: 'Tháng 5 ',
        x2: 1293.6,
        x3: 631.9,
      },
      {
        country: 'Tháng 6 ',
        x2: 957.6,
        x3: 444.2,
      },
      {
        country: 'Tháng 7 ',
        x2: 723.3,
        x3: 302,
      },
      {
        country: 'Tháng 8	 ',
        x2: 992.5,
        x3: 449.2,
      },
      {
        country: 'Tháng 9 ',
        x2: 997,
        x3: 442.6,
      },
      {
        country: 'Tháng 10 ',
        x2: 1453.3,
        x3: 586.6,
      },
      {
        country: 'Tháng 11	 ',
        x2: 1209.2,
        x3: 524.3,
      },
      {
        country: 'Tháng 12 ',
        x2: 337.3,
      },
    ],
    // Tổng hợp giá trị tồn kho

    // columnPay: [
    //   {
    //     year: 'Miền bắc',
    //     x1: 23.5,
    //   },

    //   {
    //     year: 'Miền Trung ',
    //     x2: 30.1,
    //   },

    //   {
    //     year: 'Miền nam',
    //     x2: 14.6,
    //   },
    // ],
    // circlePay: [
    //   {
    //     country: 'Tiền mặt việt nam',
    //     litres: 260.5,
    //   },
    //   {
    //     country: 'Tiền viện nam gửi tại ACB',
    //     litres: 270.35,
    //   },
    //   {
    //     country: 'Tiền việt nam gửi tại AgriBank',
    //     litres: 300.19,
    //   },
    //   {
    //     country: 'Tiền việt nam gửi Techcombank',
    //     litres: 160.4,
    //   },
    // ],
  };

  handleTab = tabIndex => {
    this.setState({ tabIndex });
  };

  componentDidUpdate(prevProps, prevState) {
    const { tab, tabIndex } = this.state;
    if (tab !== prevState.tab || tabIndex !== prevState.tabIndex) {
      if (tabIndex === 0) {
        this.props.getProportionOfCostByItem();
      }
      if (tabIndex === -1) {
        this.props.getCompareSalesPersonSalesOfYear();
      }
      if (tabIndex === -2) {

        this.props.getSumRevenueCostInYear();
        this.props.getSumRevenueInventoryInYear();
      }
      if (tabIndex === -3) {
        // tổng hợp chi phí bộ phận và khoản mục
        this.props.getSumInYear();
        this.props.getChargeProportion();
      }

    }
  }

  customFunction = (data) => {
    let max = 1;
    const newData = [...data];

    function division(dividend, divisor) {
      dividend = dividend;
      divisor = divisor || 1;
      return dividend / divisor;
    }

    newData.map(item => {
      const newMax = division(item.sum, item.kpiPlanEmpl);
      if (newMax >= max) {
        max = newMax;
      }
    })
    return data.map(item => ({
      ...item,
      scalePlanDone: <Process value={((division(item.sum, item.kpiPlanEmpl)) / max) * 100} scale={division(item.sum, item.kpiPlanEmpl) * 100} />,
    }))
  }

  render() {
    const { tab, tabIndex, circleData } = this.state;
    const { intl, reportPage, getSumInYear, getChargeProportion, getSumRevenueCostInYear, getSumRevenueInventoryInYear, getProportionOfCostByItem, getCompareSalesPersonSalesOfYear } = this.props;
    const { sumInYear, chargeProportion, sumRevenueCost, sumRevenueInventory, compareSalesPerson, proportionCostByItem,
      loadingProportionOfCostByItem, loadingCompareSalesPerson, loadingSumRevenueCost, loadingSumRevenueInventory, loadingChargeProportion, loadingSumInYear } = reportPage;
    const { totalRevenue, prevMonthPlanRevenue, prevMonthRealRevenue, prevYearPlanRevenue, prevYearRealRevenue, reportExpenseByType, prevMonth, prevYear,
      reportExpenseByOrganization, twoYearAgo, prevYearProfit, twoYearAgoProfit } = proportionCostByItem;
    const Bt = props => (
      <Buttons
        onClick={() => this.handleTab(props.tabIndex)}
        {...props}
        color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </Buttons>
    );
    const scalePrevMonth = Number.isInteger((prevMonthRealRevenue / (prevMonthPlanRevenue || 1)) * 100) ? (prevMonthRealRevenue / (prevMonthPlanRevenue || 1)) * 100 : ((prevMonthRealRevenue / (prevMonthPlanRevenue || 1)) * 100).toFixed(2);
    const scalePrevYear = Number.isInteger((prevYearRealRevenue / (prevYearPlanRevenue || 1)) * 100) ? (prevYearRealRevenue / (prevYearPlanRevenue || 1)) * 100 : ((prevYearRealRevenue / (prevYearPlanRevenue || 1)) * 100).toFixed(2);
    return (
      <div>
        <Helmet>
          <title>Báo cáo</title>
          <meta name="description" content="Description of ProjectPage" />
        </Helmet>

        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })}>
          <Tab value={0} label={intl.formatMessage(messages.synthesisreport || { id: 'synthesisreport' })} />
          <Tab value={1} label={intl.formatMessage(messages.report || { id: 'report' })} />
          <Tab value={2} label={intl.formatMessage(messages.plan || { id: 'plan' })} />
        </Tabs>
        {tab === 1 ? <ReportReportCustomer /> : null}
        {tab === 2 ? <ReportTask /> : null}
        {tab === 0 ? (
          <Paper>
            <Grid container>
              <Grid item sm={12}>
                <Bt tabIndex={0}>{intl.formatMessage(messages.generalbusinesssituation || { id: 'generalbusinesssituation' })}</Bt>
                <Bt tabIndex={-1}>{intl.formatMessage(messages.aggregatesalesbysalesstaff || { id: 'aggregatesalesbysalesstaff' })}</Bt>
                <Bt tabIndex={-2}>{intl.formatMessage(messages.aggregatesalesbycustomeranditem || { id: 'aggregatesalesbycustomeranditem' })}</Bt>
                <Bt tabIndex={-3}>{intl.formatMessage(messages.aggregatecostbydeparmentanditem || { id: 'aggregatecostbydeparmentanditem' })}</Bt>
                <Bt tabIndex={-4}>{intl.formatMessage(messages.aggregateinventoryvalue || { id: 'aggregateinventoryvalue' })}</Bt>
                <Bt tabIndex={-5}>{intl.formatMessage(messages.businessopportunityreporting || { id: 'businessopportunityreporting' })}</Bt>
              </Grid>
            </Grid>
            {tabIndex === -1 ? (
              <div>
                <Grid container>
                  <Grid item md={12} style={{ paddingBottom: '30px' }}>
                    <Paper>
                      Nguyễn Thành Tạo
                      <Typography style={{ fontWeight: 'bold', marginTop: 30 }}>Chi tiết bán hàng theo nhân viên kinh doanh</Typography>
                    </Paper>
                    <ListPage
                      apiUrl={`${API_REPORT_AGGREGATE_SALES_OF_BUSINESS_STAff}?flag=true`}
                      columns={aggregateSalesOfSaleStaff}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                      customFunction={this.customFunction}
                    />
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Typography style={{ fontWeight: 'bold', marginTop: 30 }}>So sánh doanh số của nhân viên bán hàng trong năm</Typography>
                </Paper>

                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper height="650px" onRefresh={getCompareSalesPersonSalesOfYear} isLoading={loadingCompareSalesPerson}>
                      <ColumnChart1 style={{ width: '100%', height: '90%' }} data={compareSalesPerson} id="chart6" />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {tabIndex === 0 ? (
              <div>
                <Grid style={{ display: 'flex', justifyContent: 'space-between' }} container>
                  <ReportBox
                    icon={<Public style={{ fontSize: 80 }} />}
                    number={`${formatNumber(totalRevenue || 0)} VNĐ`}
                    text="Tổng doanh thu"
                    color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                  />
                  <ReportBox
                    icon={<Public style={{ fontSize: 80 }} />}
                    number={`${scalePrevMonth} %`}
                    text={`Tỷ lệ hoàn thành tháng ${prevMonth + 1}`}
                    color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
                  />
                  <ReportBox
                    icon={<Public style={{ fontSize: 80 }} />}
                    number={`${scalePrevYear} %`}
                    text={`Tỷ lệ hoàn thành doanh số năm ${prevYear}`}
                    color="linear-gradient(to right, #FFC107, rgba(255, 193, 7, 0.79))"
                  />
                </Grid>

                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '30px 0px' }} container>
                  <Grid item md={6}>
                    <CustomChartWrapper height="650px" onRefresh={getProportionOfCostByItem} isLoading={loadingProportionOfCostByItem}>
                      <ColumnChart style={{ width: '100%', height: '90%' }} data={reportExpenseByType} id="chart1" />
                    </CustomChartWrapper>
                  </Grid>
                  <Grid item md={6}>
                    <CustomChartWrapper height="650px" onRefresh={getProportionOfCostByItem} isLoading={loadingProportionOfCostByItem}>
                      <CircleChart data={reportExpenseByOrganization} id="chart2" style={{ width: '100%', height: '90%' }} titleTex="Tỷ trọng chi phí theo bộ phận" value="totalExpense" category="orgName" />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Typography variant="h6">Tổng lợi nhuận</Typography>

                <Grid style={{ display: 'flex', justifyContent: 'space-around' }} container>
                  <ReportBox
                    icon={<SignalCellularAlt style={{ fontSize: 100 }} />}
                    number={`Năm ${twoYearAgo}`}
                    text={`${formatNumber(twoYearAgoProfit)} VNĐ`}
                    color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                    size="35%"
                  />
                  <ReportBox
                    icon={<SignalCellularAlt style={{ fontSize: 100 }} />}
                    number={`Năm ${prevYear}`}
                    text={`${formatNumber(prevYearProfit)} VNĐ`}
                    color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
                    size="35%"
                  />
                </Grid>
              </div>
            ) : null}
            {tabIndex === -2 ? (
              <div>
                <Paper>
                  {' '}
                  <Typography style={{ fontWeight: 'bold', marginTop: 30 }}>Tổng hợp doanh thu, giá vốn trong năm</Typography>
                </Paper>

                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper height="650px" onRefresh={getSumRevenueCostInYear} isLoading={loadingSumRevenueCost}>
                      <ColumnChart2 style={{ width: '100%', height: '90%' }} data={sumRevenueCost} id="chart6" />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Typography style={{ fontWeight: 'bold', marginTop: 30 }}>Tổng hợp doanh thu, tồn kho trong năm</Typography>
                </Paper>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '30px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper height="700px" onRefresh={getSumRevenueInventoryInYear} isLoading={loadingSumRevenueInventory}>
                      <BarChart style={{ width: '100%', height: '90%' }} data={sumRevenueInventory} id="chart4" />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {tabIndex === -3 ? (
              <div>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '30px 0px' }} container>
                  <Grid item md={6}>
                    <CustomChartWrapper height="650px" onRefresh={getSumInYear} isLoading={loadingSumInYear}>
                      <ColumnXYChart
                        titleTex="Tổng hợp chi phí trong năm"
                        style={{ width: '100%', height: '90%' }}
                        // data={this.state.partColumn}
                        data={sumInYear}
                        id="chart6"
                      />
                    </CustomChartWrapper>
                  </Grid>
                  <Grid item md={6}>
                    <CustomChartWrapper height="650px" onRefresh={getChargeProportion} isLoading={loadingChargeProportion}>
                      <CircleChart data={chargeProportion} id="chart7" style={{ width: '100%', height: '90%' }} titleTex="Tỷ trọng chi phí" value="expendValue" category="expendName" />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {tabIndex === -4 ? (
              <div>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item xs={12} md={12} style={{ paddingBottom: '30px' }}>
                    <Typography style={{ fontWeight: 'bold', marginTop: 30 }}>TỔNG HỢP GIÁ TRỊ TỒN KHO TRONG NĂM</Typography>
                    <ListPage
                      apiUrl={API_REPORT_INVENTORY}
                      columns={inventoryReportByMonthColumns}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                    />
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {tabIndex === -5 ? (
              <div>
                <iframe
                  style={{ marginLeft: 200 }}
                  width="933"
                  height="700"
                  src="https://app.powerbi.com/view?r=eyJrIjoiNWI5OWEyZTItZGNlNC00NzlmLTk2YmQtMTRhNzg3YzczMDBlIiwidCI6ImMzNzE5ZDc0LWIyOWItNDE0Zi05OWJmLWVhNjQ2YzZiZGI3OCIsImMiOjEwfQ%3D%3D"
                  frameBorder="0"
                  allowFullScreen="true"
                />
              </div>
            ) : null}
          </Paper>
        ) : null}

      </div>
    );
  }
}

ReportPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportPage: makeSelectReportPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getSumInYear: () => dispatch(getSumInYear()),
    getChargeProportion: () => dispatch(getChargeProportion()),
    getSumRevenueCostInYear: () => dispatch(getSumRevenueCostInYear()),
    getSumRevenueInventoryInYear: () => dispatch(getSumRevenueInventoryInYear()),
    getCompareSalesPersonSalesOfYear: () => dispatch(getCompareSalesPersonSalesOfYear()),
    getProportionOfCostByItem: () => dispatch(getProportionOfCostByItem()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportPage', reducer });
const withSaga = injectSaga({ key: 'reportPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(ReportPage);
