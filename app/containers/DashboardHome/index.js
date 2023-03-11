/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * DashboardHome
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TableBody, TableCell, Table, TableRow, TableHead, Tabs, Tab, Avatar, Tooltip, MenuItem, Menu } from '@material-ui/core';
import { CardTravel, NextWeek, Receipt, PermContactCalendar, Add } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectDashboardHome from './selectors';
import { makeSelectProfile, makeSelectRole } from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getApi, getKpi, getRevenueChartData, getProfitChart } from './actions';
import { Paper, Grid, Typography, Steper, RadarChart } from '../../components/LifetekUi';
import ColumnXYChart, { ProfitChart } from '../../components/Charts/ColumnXYChart';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import makeSelectReportHrmPage from '../ReportHrmPage/selectors';
import { getLate } from '../ReportHrmPage/actions';

import { mergeDataProject } from '../ProjectPage/actions';
import { mergeData as mergeDataTask } from '../TaskPage/actions';
import { mergeData as mergeDataRelate } from '../TaskRelatePage/actions';
import { mergeDataContract } from '../ContractPage/actions';
import lang from '../../assets/img/faces/lang.jpg';
import { fetchData, removeWaterMark } from '../../helper';
import { clientId } from '../../variable';
import ColumnXChart from './EmployeeChart';
import CylinderChart from './CustomerChart';
import { formatNumber } from '../../utils/common';
import moment from 'moment';
import Snackbar from '../../components/Snackbar';
import { API_ROLE, API_LATE_AND_LEAVE, API_INCREASES_OR_DECREASES } from '../../config/urlConfig';
import makeSelectDashboardPage from '../Dashboard/selectors';
import CalendarComponent from '../../components/Calendar/index';

/* eslint-disable react/prefer-stateless-function */
am4core.useTheme(Am4themesAnimated);

const ReportBox = props => (
  <div style={{ background: props.color, padding: '25px 10px', width: '100%', height: 170, position: 'relative' }}>
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 555,
      }}
      // onClick={props.openDetail}
      onClick={() => {
        props.updateVersion()
        // props.openDetail()
      }}
    >
      Xem chi tiết
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
);
function ColumnPieChart(props) {
  const { id, data, type = '', titleTex, isExport, all, leave, isFullScreen } = props;

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

      {isFullScreen ? (
        <>
          {/*   - full màn hình */}
          <div
            style={{
              position: 'relative',
              top: '-48%',
              left: '93%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
            }}
          >
            {`${all - leave} / ${all}`} <br />
          </div>
          <div
            style={{
              position: 'relative',
              top: '-47%',
              left: '91%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              color: 'rgb(192 123 131)',
            }}
          >
            <p>Tổng số nhân sự</p>
          </div>{' '}
        </>
      ) : (
        <>
          {/*  lúc ban đầu - nửa màn hình */}
          <div
            style={{
              position: 'relative',
              top: '-48%',
              left: '84%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
            }}
          >
            {`${all - leave} / ${all}`} <br />
          </div>
          <div
            style={{
              position: 'relative',
              top: '-47%',
              left: '80%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              color: 'rgb(192 123 131)',
            }}
          >
            <p>Tổng số nhân sự</p>
          </div>{' '}
        </>
      )}
    </React.Fragment>
  );
}
export class DashboardHome extends React.Component {
  state = {
    tabTask: 0,
    tabs: 1,
    isExportRevenueChart: false,
    width: window.innerWidth,
    total: { variant: '', message: '', open: false },
    count: 0,
    taskAllow: false,
    contractAllow: false,
    customerAllow: false,
    businessOpportunitiesAllow: false,
    chartProfit: 1,
    fields: [],
    fullScreen: false,
    exportAnchor: null,
    allData: [],
    humanResource: 0

  };

  async componentDidMount() {
    this.props.getApi();
    this.props.getKpi();
    this.props.onGetRevenueChartData();
    this.props.getProfitChart();
    window.addEventListener('resize', () => this.setState({ width: window.innerWidth }));
    const hrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const foundKanban = hrmStatus && hrmStatus.find(item => item.code === 'ST01');
    const data = foundKanban ? foundKanban.data : []
    let formatData = []
    if (data) {
      formatData = data.map(item => ({ field: item._id, name: item.name }));
    }
    let lateData = await fetchData(API_LATE_AND_LEAVE)
    if (lateData && lateData.data)
      this.setState({ lateData: lateData.data })
    else this.setState({ lateData: {} })
    const dataPie = [
      {
        name: 'Nhân viên đi muộn',
        value: lateData && lateData.data && lateData.data.hrmLate,
      },
      {
        name: 'Nhân viên vắng mặt',
        value: lateData && lateData.data && lateData.data.hrmLeave,
      },
    ];
    // console.log(lateData, "lateData", dataPie)
    fetchData(API_INCREASES_OR_DECREASES).then((res) => {
      if (res && res.data) {
        const increasesOrDecreases = res.data
        if (increasesOrDecreases && formatData) {
          const currentMonth = moment().get('M');
          const currentMonthData = increasesOrDecreases[currentMonth];
          if (currentMonthData) {
            formatData.forEach(itemKb => {
              itemKb.value = currentMonthData[itemKb.field];
            });
          }
        }
        const allData = Array.isArray(formatData) && formatData.concat(dataPie || []);
        this.setState({ fields: formatData, allData });

      }
      else {
        const allData = Array.isArray(formatData) && formatData.concat(dataPie || []);
        this.setState({ fields: formatData, allData });
      }
    }).catch((err) => {
      const allData = Array.isArray(formatData) && formatData.concat(dataPie || []);
      this.setState({ fields: formatData, allData });
      console.log(err, "err")

    })

  }

  componentWillUnmount() {
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (this.columnChart) {
      this.columnChart.dispose();
    }
  }

  openContract = () => {
    this.props.history.push('./crm/Contract');
    this.props.mergeDataContract({
      dashboard: 1,
      contractDashboard: this.props.dashboardHome.contracts,
    });
  };

  openProject = () => {
    this.props.history.push('/Task');
    this.props.mergeDataProject({
      filter: {
        isProject: true,
        taskStatus: 2,
      },
    });
    this.props.mergeDataTask({
      tab: 2,
    });
  };

  openCustomer = () => {
    this.props.history.push('/crm/Customer');
  };

  openBusiness = () => {
    this.props.history.push('/crm/BusinessOpportunities');
  };

  // mở cong viec
  openTask = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // open phu trach
  openInCharge = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        inCharge: profile ? profile._id : '5d7b1bed6369c11a047844e7',
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở được xem
  openViewable = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        viewable: profile ? profile._id : '5d7b1bed6369c11a047844e7',
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở đóng dung
  openStop = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 4 || 5,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // CHưa thực hiện
  openCancel = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 1,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở đang thực hiện
  openDoing = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 2,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở chậm tiến độ
  openProgress = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: { $not: { $eq: 3 } },
        endDate: { $lte: new Date().toISOString() },
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // mở cong viec hoan thanh
  openComplete = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 3,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // mo k thuc hien

  openNotDoing = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataRelate({
      filterAll: {
        isProject: false,
        taskStatus: 6,
        $or: [
          { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
      tabIndex: 0,
      dashboard: 1,
    });
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    removeWaterMark();
    // console.log(this.props.dashboardPage, "dashboardPage");
    const { dashboardPage } = this.props
    if (dashboardPage && !this.state.count) {
      const profile = this.props.profile;
      // fetchData(`${API_ROLE}/${profile && profile.userId}`).then((data)=>{
      const { role } = dashboardPage
      let roles
      if (role) roles = role.roles
      if (roles && Array.isArray(roles) && roles.length > 0) {
        this.setState({ count: 1 })
        let taskAllow = false
        let contractAllow = false
        let customerAllow = false
        let businessOpportunitiesAllow = false
        //Tổng số dự án đang thực hiện
        const permisionTask = roles.find(el => el.codeModleFunction === "Task")
        if (permisionTask && permisionTask.methods && Array.isArray(permisionTask.methods) && permisionTask.methods.length > 0 && permisionTask.methods[0].allow && permisionTask.methods[0].name) {
          taskAllow = permisionTask.methods[0].allow
        }
        //Tổng hợp đồng đang thực hiện
        const permisionContract = roles.find(el => el.codeModleFunction === "Contract")
        if (permisionContract && permisionContract.methods && Array.isArray(permisionContract.methods) && permisionContract.methods.length > 0 && permisionContract.methods[0].allow && permisionContract.methods[0].name) {
          contractAllow = permisionContract.methods[0].allow
        }

        //Tổng số khách hàng
        const permisionCustomer = roles.find(el => el.codeModleFunction === "Customer")
        if (permisionCustomer && permisionCustomer.methods && Array.isArray(permisionCustomer.methods) && permisionCustomer.methods.length > 0 && permisionCustomer.methods[0].allow && permisionCustomer.methods[0].name) {
          customerAllow = permisionCustomer.methods[0].allow
        }
        //Tổng nhu cầu khách hàng
        const permisionBusinessOpportunities = roles.find(el => el.codeModleFunction === "BusinessOpportunities")
        if (permisionBusinessOpportunities && permisionBusinessOpportunities.methods && Array.isArray(permisionBusinessOpportunities.methods) && permisionBusinessOpportunities.methods.length > 0 && permisionBusinessOpportunities.methods[0].allow && permisionBusinessOpportunities.methods[0].name) {
          businessOpportunitiesAllow = permisionBusinessOpportunities.methods[0].allow
        }

        // console.log(permisionTask,permisionContract, permisionCustomer,permisionBusinessOpportunities, "permisionCustomer" );
        this.setState({ taskAllow, contractAllow, customerAllow, businessOpportunitiesAllow })
      }

      // })
      // .catch(()=>{

      // })
    }


  }
  handleCheckFullScreen = () => {
    this.setState({ fullScreen: !this.state.fullScreen });
  };
  handleChangeOpenExcel = () => {
    console.log("hsbdvbs")
  }
  handleChangeExportAnchor = data => {
    this.setState({ exportAnchor: data });
  };
  render() {
    const { tabTask, tabs, chartProfit, fields, lateData, allData, humanResource } = this.state;
    const { dashboardHome, onGetRevenueChartData, getProfitChart, profile, role, reportHrmPage } = this.props;

    const {
      contracts,
      projects,
      customers,
      businessOpportunities,
      tasks,
      inChargeSelect,
      viewableSelect,
      stopSelect,
      cancelSelect,
      doingSelect,
      progressSelect,
      completeSelect,
      projectSkip,
      notDoingSelect,
      columnXYRevenueChart,
      profitChart,
      loadingRevenueChart,
      loadingProfitChart,
    } = dashboardHome;


    return (
      <div>
        <Paper style={{ padding: 0 }}>
          <Grid style={{ padding: 0, width: '100%' }} container>
            <Snackbar
              message={this.state.total.message}
              style={{}}
              onClose={() => this.setState({ total: { variant: 'warning', message: 'Cần nâng cấp phiên bản để thực hiện tính năng', open: false } })}
              variant={this.state.total.variant}
              open={this.state.total.open}
            />
            <Grid item xs={3}>
              <ReportBox
                icon={<CardTravel style={{ fontSize: 50 }} />}
                number={formatNumber(contracts) || 0}
                text="Tổng hợp đồng đang thực hiện"
                color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                backColor="rgb(0, 126, 255)"
                // openDetail={this.openContract}
                updateVersion={() => {
                  if (this.state.contractAllow === false) {
                    return this.setState({ total: { variant: 'warning', message: 'Cần nâng cấp phiên bản để thực hiện tính năng', open: true } })
                  } else {
                    this.openContract()
                  }
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <ReportBox
                icon={<NextWeek style={{ fontSize: 50 }} />}
                number={formatNumber(projects) || 0}
                text="Tổng số dự án đang thực hiện"
                color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
                backColor="#237f1c"
                // openDetail={this.openProject}
                updateVersion={() => {
                  if (this.state.taskAllow === false) {
                    return this.setState({ total: { variant: 'warning', message: 'Cần nâng cấp phiên bản để thực hiện tính năng', open: true } })
                  } else {
                    this.openProject()
                  }
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <ReportBox
                icon={<PermContactCalendar style={{ fontSize: 50 }} />}
                number={formatNumber(customers) || 0}
                text="Tổng khách hàng"
                color="linear-gradient(to right, #FFC107, rgba(255, 193, 7, 0.79))"
                backColor="#cd7e2c"
                // openDetail={this.openCustomer}
                updateVersion={() => {
                  if (this.state.customerAllow === false) {
                    this.setState({ total: { variant: 'warning', message: 'Cần nâng cấp phiên bản để thực hiện tính năng', open: true } })
                  }
                  else {
                    this.openCustomer()
                  }
                }}
              />
            </Grid>
            {clientId === 'MIPEC' ? null : (
              <Grid item xs={3}>
                <ReportBox
                  icon={<Receipt style={{ fontSize: 50 }} />}
                  number={formatNumber(businessOpportunities) || 0}
                  text="Tổng nhu cầu khách hàng"
                  color="linear-gradient(to right, #FF5722, rgba(255, 87, 34, 0.79))"
                  backColor="red"
                  // openDetail={this.openBusiness}
                  updateVersion={() => {
                    if (this.state.businessOpportunitiesAllow === false) {
                      this.setState({ total: { variant: 'warning', message: 'Cần nâng cấp phiên bản để thực hiện tính năng', open: true } })
                    }
                    else {
                      this.openBusiness()
                    }
                  }}
                />
              </Grid>
            )}
          </Grid>

          <Grid style={{ display: 'flex', alignItems: 'stretch' }} container>
            {/* <Grid item style={{ display: 'flex', flexDirection: 'column' }} md={7}>
              {clientId === 'MIPEC' ? null : (
                <CustomChartWrapper
                  height="550px"
                  onRefresh={onGetRevenueChartData}
                  isLoading={loadingRevenueChart}
                  onExport={() => {
                    this.setState({ isExportRevenueChart: true });
                  }}
                >
                  <ColumnXYChart
                    style={{ height: '100%' }}
                    data={columnXYRevenueChart}
                    id="chart1"
                    isExport={this.state.isExportRevenueChart}
                    onExportSuccess={() => this.setState({ isExportRevenueChart: false })}
                  />
                </CustomChartWrapper>
              )} */}

            {/* <ColumnXYChart style={{ width: '100%', height: '500px' }} data={columnXYRevenueChart} id="chart1" /> */}

            {/* <div id="chartdiv" style={{ width: '100%', height: '550px' }} /> */}
            {/* {clientId === 'MIPEC' ? null : (
                <CustomChartWrapper
                  height="550px"
                  onRefresh={getProfitChart}
                  isLoading={loadingProfitChart}
                  onExport={() => {
                    this.setState({ isExportChart: true });
                  }}
                >
                  <ProfitChart
                    id="chartdiv"
                    style={{ width: '100%', height: '100%' }}
                    data={profitChart}
                    isExport={this.state.isExportChart}
                    onExportSuccess={() => this.setState({ isExportChart: false })}
                  />
                </CustomChartWrapper>
              )}
            </Grid> */}
            <Grid item style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }} md={7}>
              <Grid item md={12}>
                <Tabs value={this.state.chartProfit} onChange={(e, value) => this.setState({ chartProfit: value })}>
                  <Tab value={1} label="Biểu đồ doanh thu" />
                  <Tab value={0} label="Biểu đồ lợi nhuận" />
                  {/* {clientId === 'MIPEC' ? null : <Tab value={2} label="KPI" />} */}
                </Tabs>
                {/* biểu đồ lợi nhuận */}
                {clientId === 'MIPEC' ? null : (
                  <>
                    {
                      !chartProfit && <CustomChartWrapper
                        height="550px"
                        onRefresh={getProfitChart}
                        isLoading={loadingProfitChart}
                        onExport={() => {
                          this.setState({ isExportChart: true });
                        }}
                      >
                        <ProfitChart
                          id="chartdiv"
                          style={{ width: '100%', height: '100%' }}
                          data={profitChart}
                          isExport={this.state.isExportChart}
                          onExportSuccess={() => this.setState({ isExportChart: false })}
                        />
                      </CustomChartWrapper>
                    }
                  </>
                )}
                {/* biểu đồ doanh thu */}
                {clientId === 'MIPEC' ? null : (
                  <>
                    {
                      chartProfit && <CustomChartWrapper
                        height="550px"
                        onRefresh={onGetRevenueChartData}
                        isLoading={loadingRevenueChart}
                        onExport={() => {
                          this.setState({ isExportRevenueChart: true });
                        }}
                      >
                        <ColumnXYChart
                          style={{ height: '100%' }}
                          data={columnXYRevenueChart}
                          id="chart1"
                          isExport={this.state.isExportRevenueChart}
                          onExportSuccess={() => this.setState({ isExportRevenueChart: false })}
                        />
                      </CustomChartWrapper>
                    }

                  </>
                )}
              </Grid>

              <Grid item md={12}>
                <Tabs value={this.state.humanResource} onChange={(e, value) => this.setState({ humanResource: value })}>
                  <Tab value={0} label="Tình hình nhân sự" />
                  <Tab value={1} label="Lịch họp" />
                  {/* {clientId === 'MIPEC' ? null : <Tab value={2} label="KPI" />} */}
                </Tabs>
                {/* biểu đồ lợi nhuận */}

                {/* biểu đồ doanh thu */}
                {
                  !humanResource ? <>
                    <CustomChartWrapper
                      height="450px"
                      onRefresh={getLate}
                      isLoading={undefined}
                      handleCheckFullScreen={() => this.handleCheckFullScreen()}
                      handleOpenExcel={() => this.handleOpenExcel()}
                      handleChangeExportAnchor={this.handleChangeExportAnchor}
                      handleChangeOpenExcel={this.handleChangeOpenExcel}
                    // exportLate
                    >
                      <ColumnPieChart
                        id="chartData"
                        data={allData}
                        all={lateData && lateData.hrm}
                        leave={lateData && lateData.hrmLeave}
                        titleTex="Tình hình nhân sự"
                        isFullScreen={this.state.fullScreen}
                      />
                    </CustomChartWrapper>
                  </> : null
                }

                {
                  humanResource ? <>
                    <Grid item md={12}>
                      <CalendarComponent profile={this.props.profile} />
                    </Grid>
                  </> : null
                }

              </Grid>

              {/* <Grid item md={12} style={{ marginTop: 10, borderTop: '1px solid #7f7f8d' }}>
                <Tabs value={tabs} onChange={(e, value) => this.setState({ tabs: value })}>
                  {clientId === 'MIPEC' ? null : <Tab value={0} label="Doanh số" />}
                  {clientId === 'MIPEC' ? null : <Tab value={1} label="Khách hàng" />}
                </Tabs>
                {tabs === 0 ? (
                  <Grid container md={12}>
                    <ColumnXChart style={{ width: '100%', height: '50vh' }} data={this.props.dashboardHome.columnXChart} id="chart2" />
                  </Grid>
                ) : null}
                {tabs === 1 ? (
                  <Grid container md={12}>
                    <CylinderChart style={{ width: '100%', height: '50vh' }} data={this.props.dashboardHome.columnCylinder} id="chart3" />
                  </Grid>
                ) : (
                  ''
                )}
              </Grid> */}
            </Grid>

            <Grid item md={5} >
              <Grid item md={12} style={{ marginTop: 10, maxHeight: '100%', overflow: "auto" }}>
                <Steper profile={profile} openComplete={this.openComplete} />
              </Grid>
            </Grid>
          </Grid>
          <Grid style={{ display: 'flex', alignItems: 'stretch' }} container>
            <Grid item md={6}>
              <Tabs value={this.state.tabTask} onChange={(e, value) => this.setState({ tabTask: value })}>
                <Tab value={0} label="Dự án" />
                <Tab value={1} label="Tình Trạng công việc" />
                <Tab value={2} label="KPI" />

              </Tabs>
              {tabTask === 0 ? (
                <React.Fragment>
                  <div style={{ marginLeft: 30 }}>
                    <Typography style={{ fontWeight: 'bold' }}>TOP DỰ ÁN</Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell width={30} style={{ padding: 5 }}>
                            STT
                          </TableCell>
                          <TableCell width={260} align="left" style={{ paddingLeft: 20 }}>
                            Tên dự án
                          </TableCell>
                          <TableCell width={150} align="left" style={{ padding: 5 }}>
                            Ngày bắt đầu
                          </TableCell>
                          <TableCell width={150} align="left" style={{ padding: 5 }}>
                            Ngày kết thúc
                          </TableCell>
                          <TableCell>Người tham gia</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(projectSkip) && projectSkip.length > 0
                          ? projectSkip.map((item, index) => (
                            <TableRow>
                              <TableCell width={30} style={{ padding: 5 }} align="center">
                                {index + 1}
                              </TableCell>
                              <TableCell width={260} style={{ paddingLeft: 20 }} align="left">
                                {item.name}
                              </TableCell>
                              <TableCell width={150} style={{ padding: 5 }} align="left">
                                {moment(item.startDate).format('DD/MM/YYYY')}
                              </TableCell>
                              <TableCell width={150} style={{ padding: 5 }} align="left">
                                {moment(item.endDate).format('DD/MM/YYYY')}
                              </TableCell>
                              <TableCell>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
                                  <Tooltip className="kanban-avatar" placement="top-start" title={item.join.name ? item.join[0].name : ''}>
                                    <Avatar src={item.join.avatar ? `${item.join[0].avatar}?allowDefault=true` : ''} />
                                  </Tooltip>

                                  <span style={{ fontWeight: 'bold', padding: 5 }}>
                                    {item.join.length > 1 ? `+${item.join.length - 1}` : item.join.length}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                          : null}
                      </TableBody>
                    </Table>
                  </div>
                </React.Fragment>
              ) : null}
              {tabTask === 1 ? (
                <React.Fragment>
                  <div style={{ marginLeft: 30 }}>
                    <Typography style={{ fontWeight: 'bold' }}>TÌNH TRANG CÔNG VIỆC</Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Công việc:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openTask}>
                        {tasks || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Phụ trách:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openInCharge}>
                        {inChargeSelect || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Theo dõi:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openViewable}>
                        {viewableSelect || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Đóng dừng:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openStop}>
                        {stopSelect || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Chưa thực hiện:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openCancel}>
                        {cancelSelect || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Đang tiến hành:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openDoing}>
                        {doingSelect || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Chậm tiến độ:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openProgress}>
                        {progressSelect || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Đã hoàn thành:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openComplete}>
                        {completeSelect || 0}
                      </b>
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Không thực hiện:
                      <b style={{ cursor: 'pointer', marginLeft: 6, color: 'red' }} onClick={this.openNotDoing}>
                        {notDoingSelect || 0}
                      </b>
                    </Typography>
                  </div>
                </React.Fragment>
              ) : null}
              {tabTask === 2 ? <RadarChart /> : null}
            </Grid>
            <Grid item md={6}>
              <Grid item md={12} style={{ marginTop: 10 }}>
                <Tabs value={tabs} onChange={(e, value) => this.setState({ tabs: value })}>
                  {clientId === 'MIPEC' ? null : <Tab value={0} label="Doanh số" />}
                  {clientId === 'MIPEC' ? null : <Tab value={1} label="Khách hàng" />}
                </Tabs>
                {tabs === 0 ? (
                  <Grid container md={12}>
                    <ColumnXChart style={{ width: '100%', height: '50vh' }} data={this.props.dashboardHome.columnXChart} id="chart2" />
                  </Grid>
                ) : null}
                {tabs === 1 ? (
                  <Grid container md={12}>
                    <CylinderChart style={{ width: '100%', height: '50vh' }} data={this.props.dashboardHome.columnCylinder} id="chart3" />
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

// DashboardHome.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  dashboardHome: makeSelectDashboardHome(),
  profile: makeSelectProfile(),
  role: makeSelectRole(),
  dashboardPage: makeSelectDashboardPage(),
  reportHrmPage: makeSelectReportHrmPage(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getApi: () => dispatch(getApi()),
    getKpi: () => dispatch(getKpi()),
    onGetRevenueChartData: () => dispatch(getRevenueChartData()),
    mergeDataProject: data => dispatch(mergeDataProject(data)),
    mergeDataTask: data => dispatch(mergeDataTask(data)),
    mergeDataRelate: data => dispatch(mergeDataRelate(data)),
    mergeDataContract: data => dispatch(mergeDataContract(data)),
    getProfitChart: () => dispatch(getProfitChart()),
    getLate: () => dispatch(getLate()),

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dashboardHome', reducer });
const withSaga = injectSaga({ key: 'dashboardHome', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashboardHome);

ReportBox.defaultProps = {
  color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
  icon: 'CardTravel',
};
