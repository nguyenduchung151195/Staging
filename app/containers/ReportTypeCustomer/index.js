/**
 *
 * ReportTypeCustomer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TrendingFlat } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { CustomerGroupColumns } from 'variable';
import ListPage from 'components/List';
import { Grid } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectReportTypeCustomer from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getData } from './actions';
import CircleChart from '../ReportSource/CircleChart';
// import messages from './messages';
import { API_REPORT } from '../../config/urlConfig';
/* eslint-disable react/prefer-stateless-function */
export class ReportTypeCustomer extends React.Component {
  componentDidMount() {
    this.props.getData(this.props.reportTypeCustomer.filter);
  }

  render() {
    const { reportTypeCustomer } = this.props;
    const { filter, reload } = reportTypeCustomer;

    return (
      <div>
        <Grid item md={12}>
          <CircleChart
            style={{ width: '100%', height: '500px' }}
            title="BÁO CÁO DOANH SỐ THEO NHÓM KHÁCH HÀNG"
            data={reportTypeCustomer.circleChart}
            id="chart2"
          />
        </Grid>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: 50,
          }}
        >
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 30 }}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY HH:mm"
                label="Từ Ngày"
                value={reportTypeCustomer.startDate}
                name="startDate1"
                error={false}
                helperText={null}
                variant="outlined"
                margin="dense"
                onChange={value => this.props.mergeData({ startDate: value })}
                // style={{ padding: 10 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                <TrendingFlat color="primary" />
              </div>

              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY HH:mm"
                label="Đến"
                error={false}
                helperText={null}
                value={reportTypeCustomer.endDate}
                name="endDate"
                margin="dense"
                variant="outlined"
                onChange={value => this.handleChangeDate(value)}
                // style={{ padding: 10 }}
              />
            </div>
          </MuiPickersUtilsProvider>
        </div>

        <Grid container md={12}>
          <ListPage
            disableEdit
            disableAdd
            disableConfig
            columns={CustomerGroupColumns}
            apiUrl={`${API_REPORT}/groupCustomer`}
            filter={filter}
            client
            mapFunction={this.mapLiabilitiReport}
            reload={reload}
          />
        </Grid>
      </div>
    );
  }

  mapLiabilitiReport = (item, index) => ({
    ...item,
    index: index + 1,
  });

  handleChangeDate = value => {
    if (new Date(this.props.reportTypeCustomer.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      filter: {
        startDate: new Date(this.props.reportTypeCustomer.startDate).toISOString(),
        endDate: new Date(value).toISOString(),
      },
      reload: this.props.reportTypeCustomer.reload + 1,
    });
  };
}

ReportTypeCustomer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportTypeCustomer: makeSelectReportTypeCustomer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    mergeData: data => dispatch(mergeData(data)),
    getData: param => dispatch(getData(param)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportTypeCustomer', reducer });
const withSaga = injectSaga({ key: 'reportTypeCustomer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReportTypeCustomer);
