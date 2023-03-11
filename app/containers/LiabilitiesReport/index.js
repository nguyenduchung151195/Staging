/**
 *
 * LiabilitiesReport
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Button } from '@material-ui/core';
import { TrendingFlat } from '@material-ui/icons';
import ListPage from 'components/List';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { tableToExcel } from '../../helper';
import { liabilitiesColumns } from '../../variable';
import makeSelectLiabilitiesReport from './selectors';
import { mergeData, getData } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { Grid, Typography, SwipeableDrawer } from '../../components/LifetekUi';
import { API_REPORT } from '../../config/urlConfig';
import LiabilitiesChart from './LiabilitiesChart';
import LiabilitiesCustomer from '../../components/LiabilitiesCustomer/Loadable';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */

// function CircleChart(props) {
//   const { id, data, titleTex } = props;
//   let circleChart;
//   useEffect(() => {
//     const chart = am4core.create(id, am4charts.PieChart);
//     const title = chart.titles.create();
//     title.text = titleTex;
//     title.fontSize = 25;
//     title.marginBottom = 10;
//     title.fontWeight = 'bold';
//     chart.hiddenState.properties.opacity = 0;
//     chart.radius = am4core.percent(70);
//     chart.innerRadius = am4core.percent(40);
//     chart.startAngle = 180;
//     chart.endAngle = 360;

//     // Add data
//     chart.data = data;

//     // Add and configure Series
//     const series = chart.series.push(new am4charts.PieSeries());
//     series.dataFields.value = 'value';
//     series.dataFields.category = 'country';

//     series.slices.template.cornerRadius = 10;
//     series.slices.template.innerCornerRadius = 7;
//     series.slices.template.draggable = true;
//     series.slices.template.inert = true;
//     series.alignLabels = false;

//     series.hiddenState.properties.startAngle = 90;
//     series.hiddenState.properties.endAngle = 90;

//     chart.legend = new am4charts.Legend();
//     circleChart = chart;
//   }, []);
//   useEffect(
//     () => () => {
//       if (circleChart) {
//         circleChart.dispose();
//       }
//     },
//     [],
//   );
//   return <div {...props} id={id} />;
// }
const GridRight = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px', alignItems: 'flex-end' }}>{children}</div>
);

export class LiabilitiesReport extends React.Component {
  componentDidMount() {
    this.props.getData();
  }

  handleChangeDate = value => {
    if (new Date(this.props.liabilitiesReport.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      filter: {
        startDate: new Date(this.props.liabilitiesReport.startDate).toISOString(),
        endDate: new Date(value).toISOString(),
      },
    });
  };

  render() {
    // const { tab } = this.state;
    const { liabilitiesReport } = this.props;
    const { filter } = liabilitiesReport;
    return (
      <div>
        <Helmet>
          <title>LiabilitiesReport</title>
          <meta name="description" content="Description of LiabilitiesReport" />
        </Helmet>
        <div>
          <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
            <Grid item md={12}>
              <LiabilitiesChart
                titles="BÁO CÁO TỔNG HỢP CÔNG NỢ KHÁCH HÀNG"
                data={liabilitiesReport.circleColumns}
                id="chart1"
                style={{ width: '100%', height: '50vh', marginTop: 30 }}
              />
            </Grid>
            <Grid item md={2} style={{ marginLeft: 30, marginTop: 30 }}>
              <GridRight>
                <Typography color="primary">Tổng công nợ:</Typography>
                <p>{liabilitiesReport.reports.total}</p>
              </GridRight>
              <GridRight>
                <Typography color="primary">Tổng công nợ bán hàng:</Typography>
                <p> {liabilitiesReport.reports.totalSaleDebtAll}</p>
              </GridRight>
              <GridRight>
                <Typography color="primary">Tổng ông nợ hợp đồng:</Typography>
                <p> {liabilitiesReport.reports.totalContractDebtAll}</p>
              </GridRight>
            </Grid>
          </Grid>

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY HH:mm"
                label="Từ Ngày"
                value={liabilitiesReport.startDate}
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
                value={liabilitiesReport.endDate}
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
              columns={liabilitiesColumns}
              apiUrl={`${API_REPORT}/debtCustomer`}
              filter={filter}
              client
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

        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDrawer: false, id: 'add' })} open={liabilitiesReport.openDrawer} width={window.innerWidth - 260}>
          <div style={{ width: window.innerWidth - 260 }}>
            <LiabilitiesCustomer report={liabilitiesReport.report} id="add" callback={this.callbackTask} />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  mapLiabilitiReport = item => ({
    ...item,
    customer: (
      <button onClick={() => this.handleOpen(item)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
        {item['customer.name']}
      </button>
    ),
  });

  handleOpen = item => {
    this.props.mergeData({ openDrawer: true, report: item });
  };
}

// LiabilitiesReport.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  liabilitiesReport: makeSelectLiabilitiesReport(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'liabilitiesReport', reducer });
const withSaga = injectSaga({ key: 'liabilitiesReport', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LiabilitiesReport);
