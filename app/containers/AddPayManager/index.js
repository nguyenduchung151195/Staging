/**
 *
 * AddPayManager
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableBody, TableCell, Table, TableRow, TableHead, Button } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TrendingFlat } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import Buttons from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import ListPage from 'components/List';
import { tableToExcel } from '../../helper';
import makeSelectAddPayManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_REPORT } from '../../config/urlConfig';
import LiabilitiesChart from '../LiabilitiesReport/LiabilitiesChart';
import { Grid, Paper, Typography } from '../../components/LifetekUi';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, getData, getReportPayManager } from './actions';
import { debtSupplierColumns } from '../../variable';
import { MENU_REPORTS } from '../../contants';
am4core.useTheme(Am4themesAnimated);

function CircleChart(props) {
  const { id, data, titleTex } = props;
  let circleChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.PieChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 10;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0;
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;

    // Add data
    chart.data = data;

    // Add and configure Series
    const series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = 'value';
    series.dataFields.category = 'country';

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    chart.legend = new am4charts.Legend();
    circleChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (circleChart) {
        circleChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

function CircleChart1(props) {
  const { id, data, titleTex } = props;
  let circleChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    title.margintop = 20;

    // Add data
    chart.data = data;

    // Add and configure Series
    const series = chart.series.push(new am4charts.FunnelSeries());
    series.colors.step = 2;
    series.dataFields.value = 'value';
    series.dataFields.category = 'name';
    series.alignLabels = true;
    series.orientation = 'horizontal';
    series.bottomRatio = 1;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';
    circleChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (circleChart) {
        circleChart.dispose();
      }
    },
    [],
  );
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
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 200;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'country';
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('x1');
    createSeries('x2');
    createSeries('x3');
    createSeries('x4');
    createSeries('x5');

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

const GridRight = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px', alignItems: 'flex-end' }}>{children}</div>
);
/* eslint-disable react/prefer-stateless-function */
export class AddPayManager extends React.Component {
  state = {
    circleColumns1: [
      {
        name: 'Nguyễn Quốc Khánh',
        value: 215,
      },
      {
        name: 'Nguyễn Xuân Sơn ',
        value: 32.4,
      },
      {
        name: 'Hoàng Tiến Đạt',
        value: 4.5,
      },
      {
        name: 'Dương Quốc Tuấn',
        value: 10.9,
      },
      {
        name: 'Nguyễn Văn Kiên',
        value: 4.4,
      },
      {
        name: 'Mai Văn Luyện',
        value: 1.12,
      },
      {
        name: 'Hoàng Minh Hải',
        value: 31.7,
      },
      {
        name: 'Nguyễn Hoàng Tùng',
        value: 16.7,
      },
      {
        name: 'Nguyễn Hải Nam',
        value: 367,
      },
      {
        name: 'Chưa phân Nhóm',
        value: 0.8,
      },
    ],

    partColumn2: [
      {
        country: 'Tháng 1',
        x2: 4.4,
        x3: 185.6,

        x5: 4.2,
      },
      {
        country: 'Tháng 2',
        x2: 1.3,
        x3: 62,
        x4: 11,
      },
      {
        country: 'Tháng 3  ',
        x2: 2,
        x3: 100,
        x4: 1.9,
      },
      {
        country: 'Tháng 4',
        x2: 2.2,
        x3: 57.5,
      },
      {
        country: 'Tháng 5',
        x2: 3.0,
        x3: 40.1,
      },
      {
        country: 'Tháng 6',
        x2: 2.8,
        x3: 11.2,
        x4: 1.6,
        x5: 3.1,
      },
      {
        country: 'Tháng 7',
        x3: 4.5,
        x4: 1.6,
        x5: 8.2,
      },
      {
        country: 'Tháng 8',
        x2: 1.3,
        x3: 13.8,
      },
      {
        country: 'Tháng 9',

        x3: 16.9,
      },
      {
        country: 'Tháng 10',
      },

      {
        country: 'Tháng 11',
      },
      {
        country: 'Tháng 12',
      },
    ],
  };

  componentDidMount() {
    this.props.getData();
    const { addPayManager } = this.props;
    const { tab } = addPayManager;
    const foundMenu = MENU_REPORTS.MENU_PAY_MANAGER.find(item => item.tab === tab);
    const { path } = foundMenu;
    this.props.getReportPayManager(path);
  }

  componentWillReceiveProps(props) {
    if (this.props.addPayManager.tab !== props.addPayManager.tab) {
      const { addPayManager: { tab } } = props;
      const foundMenu = MENU_REPORTS.MENU_PAY_MANAGER.find(item => item.tab === tab);
      const { path } = foundMenu;
      this.props.getReportPayManager(path);
    }
  }

  handleTab(tab) {
    this.props.mergeData({ tab });
  }

  mapLiabilitiReport = item => ({
    ...item,

    name: <p>{item.nameSupplier}</p>,
  });
  render() {
    const addPayManager = this.props.addPayManager;
    const { tab, filter, reports } = this.props.addPayManager;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );
    return (
      <div>
        <Grid container>
          <Grid item sm={12}>
            {/* <Bt tab={3} style={{ marginLeft: 30 }}>
              <i>Tổng hợp công nợ phải trả</i>
            </Bt>
            <Bt tab={0} style={{ marginLeft: 30 }}>
              <i>Tổng hợp công nợ theo khu vực</i>
            </Bt>
            <Bt tab={1}>
              <i>Tổng hợp công nợ theo nhân viên kd</i>
            </Bt>
            <Bt tab={2}>
              <i>Số dư công nợ phải thu theo thời gian</i>
            </Bt> */}
          </Grid>
        </Grid>
        {tab === 0 ? (
          <div>
            <Paper>
              <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp công nợ theo khu vực</Typography>
            </Paper>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <CircleChart data={addPayManager.circleColumns} id="chart4" style={{ width: '100%', height: '50vh', marginTop: 30 }} />
              </Grid>
            </Grid>
            <Paper>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nội dung</TableCell>
                      <TableCell>Miền Bắc </TableCell>
                      <TableCell>Miền Trung</TableCell>
                      <TableCell>Miền Nam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Số dư công nợ</TableCell>
                      <TableCell>285,629,736</TableCell>
                      <TableCell align="left">18,788,200 </TableCell>
                      <TableCell>380,318,922</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Paper>
          </div>
        ) : null}

        {tab === 1 ? (
          <div>
            <Paper>
              <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp công nợ theo nhân viên kd</Typography>
            </Paper>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <CircleChart1 data={this.state.circleColumns1} id="chart2" style={{ width: '100%', height: '50vh', marginTop: 30 }} />
              </Grid>
            </Grid>
            <Paper>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nội dung</TableCell>
                      <TableCell>Bắc Cạn </TableCell>
                      <TableCell>Bắc Giang</TableCell>
                      <TableCell>Bắc Ninh</TableCell>
                      <TableCell>Hải Dương</TableCell>
                      <TableCell>Hà Nam</TableCell>
                      <TableCell>Hà Nội </TableCell>
                      <TableCell>Hải Phòng</TableCell>
                      <TableCell>Hưng Yên</TableCell>
                      <TableCell>Nam Định</TableCell>
                      <TableCell>Phú Thọ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Số dư </TableCell>
                      <TableCell>231,016,745</TableCell>
                      <TableCell align="left">811,194,163</TableCell>
                      <TableCell>816,235,627 </TableCell>
                      <TableCell align="left">1,110,021,699</TableCell>
                      <TableCell>708,359,997</TableCell>
                      <TableCell>2,336,090,635</TableCell>
                      <TableCell align="left">343,410,910</TableCell>
                      <TableCell>1,943,587,407 </TableCell>
                      <TableCell align="left">1,030,406,551</TableCell>
                      <TableCell>340,467,513</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Paper>
          </div>
        ) : null}
        {tab === 2 ? (
          <div>
            <Paper>
              <Typography style={{ marginTop: 25, fontSize: 25 }}>Tổng hợp thu tiêu trong năm</Typography>
            </Paper>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <ColumnChart2 style={{ width: '100%', height: '50vh' }} data={this.state.partColumn2} id="chart3" />
              </Grid>
            </Grid>
            <Paper>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nội dung</TableCell>
                      <TableCell>Tháng 1</TableCell>
                      <TableCell>Tháng 2</TableCell>
                      <TableCell>Tháng 3</TableCell>
                      <TableCell>Tháng 4</TableCell>
                      <TableCell>Tháng 5</TableCell>
                      <TableCell>Tháng 6</TableCell>
                      <TableCell>Tháng 7</TableCell>
                      <TableCell>Tháng 8</TableCell>
                      <TableCell>Tháng 9</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Công ty CP SX - TM Hằng Nga - CN Biên Hòa</TableCell>
                      <TableCell>4,425,200</TableCell>
                      <TableCell>1,313,200 </TableCell>
                      <TableCell>2,090,800 </TableCell>
                      <TableCell>2,249,400</TableCell>
                      <TableCell>3,032,800</TableCell>
                      <TableCell>2,787,800</TableCell>
                      <TableCell>623,600</TableCell>
                      <TableCell>1,339,400 </TableCell>
                      <TableCell>132,000 </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Công ty CP thương mại An Khang</TableCell>
                      <TableCell>185,610,008</TableCell>
                      <TableCell>62,025,812 </TableCell>
                      <TableCell>100,479,058 </TableCell>
                      <TableCell>57,583,470</TableCell>
                      <TableCell>40,117,256</TableCell>
                      <TableCell>11,212,142 </TableCell>
                      <TableCell>4,482,560 </TableCell>
                      <TableCell>13,814,570</TableCell>
                      <TableCell>16,900,840</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cty TNHH TM Thanh Anh</TableCell>
                      <TableCell>91,800 </TableCell>
                      <TableCell>10,931,800 </TableCell>
                      <TableCell>1,923,200</TableCell>
                      <TableCell>- </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>1,650,200</TableCell>
                      <TableCell>- </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>- </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cty TNHH TM DV Minh Tâm</TableCell>
                      <TableCell>4,230,600</TableCell>
                      <TableCell>534,000 </TableCell>
                      <TableCell>1,011,000</TableCell>
                      <TableCell>379,000 </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>3,132,600 </TableCell>
                      <TableCell>8,127,800 </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Paper>
          </div>
        ) : null}
        {tab === 3 ? (
          <div>
            {' '}
            <div>
              <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                <Grid item md={12}>
                  <LiabilitiesChart
                    titles="BÁO CÁO TỔNG HỢP CÔNG NỢ PHẢI TRẢ"
                    data={addPayManager.circleColumns}
                    id="chart5"
                    style={{ width: '100%', height: '50vh', marginTop: 30 }}
                  />
                </Grid>
                <Grid item md={2} style={{ marginLeft: 30, marginTop: 30 }}>
                  <GridRight>
                    <Typography color="primary">Tổng công nợ: </Typography>
                    <p>{reports.total}</p>
                  </GridRight>
                </Grid>
              </Grid>

              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}>
                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Từ Ngày"
                    value={addPayManager.startDate}
                    name="startDate1"
                    error={false}
                    helperText={null}
                    variant="outlined"
                    margin="dense"
                    onChange={value => this.props.mergeData({ startDate: value })}
                    style={{ padding: 10 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingFlat color="primary" />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Đến"
                    error={false}
                    helperText={null}
                    value={addPayManager.endDate}
                    name="endDate"
                    margin="dense"
                    variant="outlined"
                    onChange={value => this.handleChangeDate(value)}
                    style={{ padding: 10 }}
                  />
                </div>
              </MuiPickersUtilsProvider>
              <div id="report-task1">
                <ListPage
                  // kanban="ST11"
                  disableEdit
                  disableAdd
                  disableConfig
                  columns={debtSupplierColumns}
                  apiUrl={`${API_REPORT}/debtSupplier`}
                  filter={filter}
                  // client
                  mapFunction={this.mapLiabilitiReport}
                />
              </div>
              <Button
                variant="outlined"
                color="primary"
                style={{ cursor: 'pointer', marginRight: 70, float: 'right', marginBottom: 40 }}
                type="button"
                onClick={() => tableToExcel('report-task1', 'W3C Example Table')}
              >
                Xuất File Excel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  handleChangeDate = value => {
    if (new Date(this.props.addPayManager.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      filter: {
        startDate: new Date(this.props.addPayManager.startDate).toISOString(),
        endDate: new Date(value).toISOString(),
      },
    });
  };
}

AddPayManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addPayManager: makeSelectAddPayManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData, getData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
    getReportPayManager: (path) => dispatch(getReportPayManager(path))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPayManager', reducer });
const withSaga = injectSaga({ key: 'addPayManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddPayManager);
