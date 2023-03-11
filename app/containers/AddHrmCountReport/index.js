import React, { useState, useEffect } from 'react';
import { Grid, Paper, Table, TableHead, TableRow, TableCell, Typography, TableBody } from '@material-ui/core';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { API_REPORT_REVENUE_INVENTORY_BY_TIME, API_REPORT_DEPT_COST_PRICE, API_REPORT_DEBT_BY_TIME } from '../../config/urlConfig';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import ReportHrmCountBySigned from '../ReportReportCustomer/components/ReportHrmCountBySigned';
import ReportHrmCountByOrg from '../ReportReportCustomer/components/ReportHrmCountByOrg';
import ReportHrmExpertContract from '../ReportReportCustomer/components/ReportExpertContract';
import ReportHrmCountByContract from '../ReportReportCustomer/components/ReportHrmCountByContract';
import ReportHrmWageByOrg from '../ReportReportCustomer/components/ReportHrmWageByOrg';
import ReportRecruitment from '../ReportReportCustomer/components/ReportRecruitment';
import ReportChartBySource from '../ReportReportCustomer/components/ReportChartBySource';
import ReportHrmFeeRecruiment from '../ReportReportCustomer/components/ReportHrmFeeRecruiment';
import ReportHrmDetailRecruiment from '../ReportReportCustomer/components/ReportHrmDetailRecruiment';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import request from '../../utils/request';
import { serialize } from '../../helper';
import moment from 'moment';
import ReportHrmRecruimentAmount from '../ReportReportCustomer/components/ReportHrmRecruimentAmount';
function customData(obj) {
  const { revenue = [], invetory = [] } = obj || {};

  let count = 0;
  let result = [];
  while (count < 12) {
    let object = {};
    object.month = count + 1;
    object.totalValue = invetory[count] && invetory[count].totalValue;
    object.totalRevenue = revenue[count] && revenue[count].totalRevenue;
    result.push(object);
    count += 1;
  }
  return result;
}
function ColumnChart1(props) {
  const { data = {}, titleTex, id, isExport } = props;
  const [chartExport, setChartExport] = useState();
  let result = customData(data);
  let ColumnChart;
  useEffect(
    () => {
      let chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.data = result;
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'month';
      categoryAxis.numberFormatter.numberFormat = '#';
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;

      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';

      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.opposite = true;

      function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = 'month';
        series.name = name;
        series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
        series.columns.template.height = am4core.percent(100);
        series.sequencedInterpolation = true;

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = '{valueX}';
        valueLabel.label.horizontalCenter = 'left';
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = '{name}';
        categoryLabel.label.horizontalCenter = 'right';
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color('#fff');
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
      }
      createSeries('totalRevenue', 'Doanh thu bán hàng');
      createSeries('totalValue', 'Giá trị tồn kho');
      setChartExport(chart);
      ColumnChart = chart;
    },
    [data],
  );
  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}

function ColumnChart2(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport } = props;
  const [chartExport, setChartExport] = useState();
  let ColumnChart;
  useEffect(
    () => {
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
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.dataFields.valueY = field;
        series.name = name;
        series.columns.template.tooltipText = '{valueY.value}';
        series.columns.template.tooltipY = 0;
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }
      createSeries('revenue', 'Doanh thu bán hàng');
      createSeries('mac', 'Giá vốn bán hàng');
      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';
      ColumnChart = chart;
      setChartExport(chart);
    },
    [data],
  );

  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );

  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}

function AddGeneralReport(props) {
  const INTIAL_QUERY = {
    year: 2021,
    organizationUnitId: '',
    employeeId: '',
    skip: 0,
    limit: 10,
  };
  const { tab, profile, miniActive, name } = props;
  const [data, setData] = useState([]);
  const [zoom, setZoom] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const [data1, setData1] = useState([]);
  const [queryFilter, setQueryFilter] = useState(INTIAL_QUERY);
  const [chooseYear, setChooseYear] = useState(moment().format('YYYY'));
  function getUrlByValue(tab) {
    let url = {
      // 1: API_REPORT_DEBT_BY_TIME,
      1: 'https://g.lifetek.vn:220/api/report-debt/business-situation',
      2: API_REPORT_REVENUE_INVENTORY_BY_TIME,
    };
    return url[tab];
  }
  const getData = obj => {
    if (tab !== 2) {
      let url = getUrlByValue(tab);
      request(`${url}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res.message) {
          this.props.onChangeSnackbar({
            content: res.message,
            variant: 'error',
          });
        } else {
          if (res) {
            setData(res.data);
          }
        }
      });
    } else {
      let url = API_REPORT_REVENUE_INVENTORY_BY_TIME;
      let url_cost = API_REPORT_DEPT_COST_PRICE;
      request(`${url}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res.message) {
          this.props.onChangeSnackbar({
            content: res.message,
            variant: 'error',
          });
        } else {
          if (res) {
            setData(res.data);
          }
        }
      });
      request(`${url_cost}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res.message) {
          this.props.onChangeSnackbar({
            content: res.message,
            variant: 'error',
          });
        } else {
          if (res) {
            setData1(res.data.data);
          }
        }
      });
    }
  };

  const handleExportSuccess = () => {
    setIsExport(false);
  };

  const handleSearch = obj => {
    setChooseYear(obj.year);
    getData(obj);
    setQueryFilter(obj);
  };

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const { year, organizationUnitId, employeeId } = queryFilter || {};
    const obj = {
      year,
      organizationUnitId,
      employeeId,
      skip,
      limit,
    };
    getData(obj);
    setQueryFilter(obj);
  };
  const handleClear = () => {
    getData(INTIAL_QUERY);
  };
  useEffect(() => {
    getData(INTIAL_QUERY);
  }, []);
  const monthOfYear = [
    { name: 'Tháng 1' },
    { name: 'Tháng 2' },
    { name: 'Tháng 3' },
    { name: 'Tháng 4' },
    { name: 'Tháng 5' },
    { name: 'Tháng 6' },
    { name: 'Tháng 7' },
    { name: 'Tháng 8' },
    { name: 'Tháng 9' },
    { name: 'Tháng 10' },
    { name: 'Tháng 11' },
    { name: 'Tháng 12' },
  ];

  // Số lượng tồn kho
  const impProduct =
    data && Array.isArray(data.data)
      ? data.data.map((x, i) => ({
          month: x.month,
          nowPeriod: x.sumProductImp,
          prePeriod: x.preSumProductImp,
        }))
      : [];
  const expProduct =
    data && Array.isArray(data.data)
      ? data.data.map((x, i) => ({
          month: x.month,
          nowPeriod: x.SumProductExp,
          prePeriod: x.preSumProductExp,
        }))
      : [];
  const totalProduct =
    data && Array.isArray(data.data)
      ? data.data.map((x, i) => ({
          month: x.month,
          nowPeriod: Number(x.sumProductImp) - Number(x.SumProductExp),
          prePeriod: Number(x.preSumProductImp) - Number(x.preSumProductExp),
        }))
      : [];
  const totalProductPrice =
    data && Array.isArray(data.data)
      ? data.data.map((x, i) => ({
          month: x.month,
          nowPeriod: x.total,
          prePeriod: x.preTotal,
        }))
      : [];
  const sltk = [
    { name: 'Nhập kho', data: impProduct },
    { name: 'Xuất kho', data: expProduct },
    { name: 'Tồn kho', data: totalProduct },
    { name: 'Giá trị tồn kho (vnđ)', data: totalProductPrice },
  ];
  // const getNameDepartment=(lists, id)=>{
  //   let nameDepartment=null;
  //   if(!Array.isArray(lists) || lists.length<=0) return;
  //   nameDepartment=lists.find(x=>x._id===id) && lists.find(x=>x._id===id).name;
  //   if(!nameDepartment){
  //     lists.map(item=>{
  //       if(Array.isArray(item.child) && item.child.length>0 && !nameDepartment){
  //         nameDepartment=getNameDepartment(item.child, id)
  //       }
  //     })
  //   }
  //   return nameDepartment;
  // }
  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
      {name === "reportHrmCountByOrg" ? (
        <Paper>
          <ReportHrmCountByOrg profile={profile} />
        </Paper>
      ) : null}
      {name === "reportHrmCountByContract" ? <ReportHrmCountByContract profile={profile} /> : null}
      {name === "reportHrmCountByAboutExpiredContract" ? (
        <Paper>
          <ReportHrmExpertContract profile={profile} />
        </Paper>
      ) : null}
      {name === "reportHrmCountBySignedContractDate" ? (
        <Paper>
          <ReportHrmCountBySigned profile={profile} />
        </Paper>
      ) : null}
      {name === "reportHrmWageByOrg" ? (
        <Paper>
          <ReportHrmWageByOrg profile={profile} />
        </Paper>
      ) : null}
      {name === "ReportTotalCandidate" ? (
        <Paper>
          <ReportRecruitment profile={profile} />
        </Paper>
      ) : null}
      {name === "ReportHrmCandidate" ? (
        <Paper>
          <ReportHrmDetailRecruiment profile={profile} />
        </Paper>
      ) : null}
      {/* {tab === 7 ? (
        <Paper>
          <ReportChartBySource profile={profile} />
        </Paper>
      ) : null} */}
      {name === "reportHrmRecruitmentWave" ? (
        <Paper>
          <ReportHrmFeeRecruiment profile={profile} />
        </Paper>
      ) : null}
      {name === "reportAnalystWage" ? (
        <Paper>
          <ReportHrmRecruimentAmount profile={profile} />
        </Paper>
      ) : null}
      {/* {tab === 2 ? (
        <div>
          <Paper>
            <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp doanh thu </Typography> <Grid item xs={12} />
            <Grid item xs={12}>
              <CustomChartWrapper
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                code="reportRevenueInventory"
                id="generalChart3"
                onExport={() => setIsExport(true)}
              >
                <ColumnChart1
                  style={{ width: '100%', maxHeight: '100vh', height: zoom ? '95vh' : '80vh' }}
                  data={data}
                  onExportSuccess={handleExportSuccess}
                  isExport={isExport}
                  id="chart5"
                />
                <ColumnChart2
                  style={{ width: '100%', maxHeight: '100vh', height: zoom ? '95vh' : '80vh' }}
                  data={data1}
                  onExportSuccess={handleExportSuccess}
                  isExport={isExport}
                  id="chart6"
                />
              </CustomChartWrapper>
            </Grid>
            <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
             
            </Grid>
          </Paper>
        </div>
      ) : null} */}
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AddGeneralReport);
