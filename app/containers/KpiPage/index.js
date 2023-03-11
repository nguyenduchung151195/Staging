/* eslint-disable eqeqeq */
/* eslint-disable no-case-declarations */
/* eslint-disable react/no-unused-prop-types */
/**
 *
 * KpiPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Avatar, TableHead, TableBody, TableRow, TableCell, Table } from '@material-ui/core';
import { SubdirectoryArrowRight, TrendingUpOutlined, TrendingDownOutlined } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectKpiPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Tabs, Tab, AsyncAutocomplete as Autocomplete, Paper, Grid, Typography } from '../../components/LifetekUi';
import { mergeData, getData } from './actions';
import PlanKpi from '../../components/LifetekUi/PlanKpi';
import ColumnChart from './ColumnChart';
import GaugeChart from './GaugeChart';
import { makeSelectProfile } from '../Dashboard/selectors';
import { API_ORIGANIZATION, API_USERS } from '../../config/urlConfig';

import makeSelectDashboardPage from '../Dashboard/selectors';

// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */

am4core.useTheme(Am4themesAnimated);

function ColumnYChart({ id, data, ...rest }) {
  // eslint-disable-next-line no-unused-vars

  let columnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = 'BIẾN ĐỘNG DOANH SỐ';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.colors.step = 2;
    // Add data
    chart.data = generateChartData();
    // Create axes
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    // Create series
    function createAxisAndSeries(field, name, opposite, bullet) {
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = 'date';
      series.strokeWidth = 2;
      series.yAxis = valueAxis;
      series.name = name;
      series.tooltipText = '{name}: [bold]{valueY}[/]';
      series.tensionX = 0.8;
      const interfaceColors = new am4core.InterfaceColorSet();

      switch (bullet) {
        case 'triangle':
          const bullet = series.bullets.push(new am4charts.Bullet());
          bullet.width = 12;
          bullet.height = 12;
          bullet.horizontalCenter = 'middle';
          bullet.verticalCenter = 'middle';

          const triangle = bullet.createChild(am4core.Triangle);
          triangle.stroke = interfaceColors.getFor('background');
          triangle.strokeWidth = 2;
          triangle.direction = 'top';
          triangle.width = 12;
          triangle.height = 12;
          break;
        case 'rectangle':
          const bullet1 = series.bullets.push(new am4charts.Bullet());
          bullet1.width = 10;
          bullet1.height = 10;
          bullet1.horizontalCenter = 'middle';
          bullet1.verticalCenter = 'middle';

          const rectangle = bullet.createChild(am4core.Rectangle);
          rectangle.stroke = interfaceColors.getFor('background');
          rectangle.strokeWidth = 2;
          rectangle.width = 10;
          rectangle.height = 10;
          break;
        default:
          const bullet2 = series.bullets.push(new am4charts.CircleBullet());
          bullet2.circle.stroke = interfaceColors.getFor('background');
          bullet2.circle.strokeWidth = 2;
          break;
      }
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = series.stroke;
      valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.opposite = opposite;
      valueAxis.renderer.grid.template.disabled = true;
    }
    createAxisAndSeries('visits', 'Doanh số', false, 'circle');
    createAxisAndSeries('views', 'Doanh thu', true, 'triangle');
    createAxisAndSeries('hits', 'Đã thu', true, 'rectangle');
    // Add legend
    chart.legend = new am4charts.Legend();

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    function generateChartData() {
      const chartData = [];
      const firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 100);
      firstDate.setHours(0, 0, 0, 0);

      let visits = 10000;
      let hits = 10000;
      let views = 8700;

      for (let i = 0; i < 15; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        const newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        hits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        views += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

        chartData.push({
          date: newDate,
          visits,
          hits,
          views,
        });
      }
      return chartData;
    }
    columnChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (columnChart) {
        columnChart.dispose();
      }
    },
    [],
  );
  return <div {...rest} id={id} />;
}

// const GridRight = ({ children }) => (
//   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px', alignItems: 'flex-end' }}>{children}</div>
// );
export class KpiPage extends React.Component {
  componentDidMount() {
    this.getDataKpi();
  }

  getDataKpi = () => {
    const id = this.props.kpiPage.employee ? this.props.kpiPage.employee._id : this.props.profile._id;
    this.props.getData(id);
  };

  componentDidUpdate(props) {
    if (this.props.kpiPage.employee._id !== props.kpiPage.employee._id) this.getDataKpi();
  }

  render() {
    const { kpiPage, profile, dashboardPage } = this.props;
    const { tab } = kpiPage;
    return (
      <div>
        <Helmet>
          <title>KPI</title>
          <meta name="description" content="Description of KPI" />
        </Helmet>
        <Tabs value={tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
          <Tab value={0} label="Thống kê nhân viên" />
          {/* <Tab value={1} label="Thống kê phòng ban" /> */}
        </Tabs>
        {tab === 0 ? (
          <div>
            <Paper>
              <Grid container md={12}>
                <Grid item md={8}>

                  <GaugeChart style={{ width: '100%', height: '100%' }} data={this.props.kpiPage.totalPercent || 0} id="chart2" />
                </Grid>
                <Grid item md={4}>
                  <div style={{ width: '60%' }}>
                    <Autocomplete
                      name="Chọn..."
                      label="Nhân viên"
                      onChange={employee => this.props.mergeData({ employee: employee || '' })}
                      url={API_USERS}
                      value={kpiPage.employee}
                    />
                  </div>
                  {kpiPage.employee ? (
                    <div style={{ display: 'flex', marginTop: 10 }}>
                      <Avatar style={{ width: 120, height: 120 }} src={kpiPage.employee.avatar} />
                      <Typography variant="body1">
                        {kpiPage.employee.name} <p style={{ fontSize: 11 }}>Nhân viên</p>
                        <p style={{ fontSize: 11 }}> SDT: {kpiPage.employee.phoneNumber} </p>
                        <p style={{ fontSize: 11 }}>Email: {kpiPage.employee.email} </p>
                      </Typography>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', marginTop: 10 }}>
                      <Avatar style={{ width: 120, height: 120 }} src={profile.avatar} />
                      <Typography variant="body1">
                        {profile.name} <p style={{ fontSize: 11 }}>Nhân viên</p>
                        <p style={{ fontSize: 11 }}> SDT: {profile.phoneNumber} </p>
                        <p style={{ fontSize: 11 }}>Email: {profile.email} </p>
                      </Typography>
                    </div>
                  )}
                  <div
                    style={{
                      padding: '7px',
                      background: '#077ae6',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#ffffff',
                      marginTop: 5,
                    }}
                  >
                    Đạt chỉ tiêu
                  </div>

                  <ColumnChart style={{ width: '100%', height: '40vh' }} data={this.props.kpiPage.kpis} id="chart1" />
                </Grid>
              </Grid>
              <Grid container md={12}>
                <Typography component="p" style={{ marginTop: 20, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  BẢNG CHỈ TIÊU KPI
                </Typography>
                <Table style={{ width: '95%' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên tiêu chí</TableCell>
                      <TableCell>Kế hoạch</TableCell>
                      <TableCell>Thực tế</TableCell>
                      <TableCell>Kết quả</TableCell>
                      <TableCell>Chỉ tiêu</TableCell>
                      <TableCell>Độ quan trọng x ĐCKQ</TableCell>
                      <TableCell>Điểm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.kpiPage.kpis.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.plan}</TableCell>
                        <TableCell>{row.reality}</TableCell>
                        <TableCell>{row.important}</TableCell>
                        <TableCell>
                          {row.trend === 1 ? (
                            <TrendingUpOutlined fontSize="large" color="primary" />
                          ) : row.trend === 2 ? (
                            <SubdirectoryArrowRight fontSize="large" color="action" />
                          ) : row.trend === 3 ? (
                            <TrendingDownOutlined fontSize="large" color="secondary" />
                          ) : (
                            'Không xác định'
                          )}
                        </TableCell>
                        <TableCell>{row.result}</TableCell>
                        <TableCell>{row.point}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid container md={12}>
                <PlanKpi columns={this.props.kpiPage.kpis} />
              </Grid>
            </Paper>
          </div>
        ) : null}

        {tab === 1 ? (
          <div>
            <Paper>
              <Grid container md={12}>
                <div style={{ width: '20%' }}>
                  <Autocomplete
                    url={API_ORIGANIZATION}
                    name="Chọn..."
                    label="Phòng Ban"
                    onChange={department => this.props.mergeData({ department })}
                    value={kpiPage.department}
                  />
                </div>
                <Grid item md={12}>
                  <ColumnYChart style={{ width: '85%', height: '600px' }} data={[]} id="chart2" />
                </Grid>
                {/* <Grid item md={12}>
                  <PlanKpi columns={this.state.kpis} />
                </Grid> */}
              </Grid>
            </Paper>
          </div>
        ) : null}
      </div>
    );
  }
}

KpiPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kpiPage: makeSelectKpiPage(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getData: id => dispatch(getData(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kpiPage', reducer });
const withSaga = injectSaga({ key: 'kpiPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(KpiPage);
