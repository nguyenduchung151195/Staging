/**
 *
 * SalesEmployee
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TrendingFlat, ExpandMore, ExpandLess } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { Grid, Button, TableHead, TableCell, Table, TableRow, TableBody } from '@material-ui/core';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { salesEmployeeColumns } from 'variable';
import ListPage from 'components/List';
import Buttons from 'components/CustomButtons/Button';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectSalesEmployee from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getData } from './actions';
// import messages from './messages';
import { API_USERS, API_REPORT } from '../../config/urlConfig';
import { AsyncAutocomplete } from '../../components/LifetekUi';

/* eslint-disable react/prefer-stateless-function */
export class SalesEmployee extends React.Component {
  state = {
    content: null,
  };

  componentDidMount() {
    this.props.getData();
  }

  handleTab(tabCus) {
    this.props.mergeData({ tabCus });
  }

  handleTab1(tab1) {
    this.props.mergeData({ tab1 });
  }

  displayTableContent = (dataList, level) => {
    // eslint-disable-line
    this.state.changeOpen = false;
    return dataList.map(department => {
      const color = department.username ? '#2196F3' : null;
      if (department.child && department.child.length > 0) {
        return (
          <React.Fragment key={department._id}>
            <TableRow className="tbColSpan">
              <TableCell onClick={() => this.clickOpen(department)}>
                <span style={{ padding: `${level}px`, fontWeight: 'bold' }} />
                {department.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {department.name}
              </TableCell>
            </TableRow>

            {department.open ? this.displayTableContent(department.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        <TableRow key={department._id} className="tbColSpan">
          <TableCell>
            <span style={{ padding: `${level}px` }} />
            <span style={{ color }}> {department.name}</span>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const { salesEmployee } = this.props;
    const { filter, tabCus, tab1, departments } = salesEmployee;
    const Bton = props => (
      <Buttons onClick={() => this.handleTab(props.tabCus)} {...props} color={props.tabCus === tabCus ? 'gradient' : 'simple'} left round size="md">
        {props.children}
      </Buttons>
    );
    // console.log('AA', departments);

    const Bt = props => (
      <Buttons onClick={() => this.handleTab1(props.tab1)} {...props} color={props.tab1 === tab1 ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Buttons>
    );
    const level = 0;
    this.state.content = departments.map(depart => {
      if (depart.child && depart.child.length > 0) {
        return (
          <React.Fragment key={depart._id}>
            <TableRow onClick={() => this.selectDepartment(depart)} className="tbColSpan">
              <TableCell onClick={() => this.clickOpen(depart)}>
                {depart.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {depart.name}
              </TableCell>
            </TableRow>
            {depart.open ? this.displayTableContent(depart.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        // <React.Fragment>
        <TableRow key={depart._id} onClick={() => this.selectDepartment(depart)} className="tbColSpan">
          <TableCell>{depart.name}</TableCell>
        </TableRow>
        // </React.Fragment>
      );
    });
    this.state.content.unshift(
      <TableRow onClick={() => this.selectDepartment('')}>
        <TableCell>Tất cả nhân viên</TableCell>
      </TableRow>,
    );
    return (
      <div>
        <Grid item sm={12} style={{ marginLeft: 20 }}>
          <Bton tabCus={0}>Báo cáo doanh số theo nhân viên</Bton>
          <Bton tabCus={1}>Báo cáo theo nhân viên</Bton>
        </Grid>
        {tabCus === 0 ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
              }}
            >
              <div style={{ width: '30%', marginLeft: 15 }}>
                <AsyncAutocomplete
                  name="Chọn..."
                  label="Nhân viên"
                  onChange={employee => this.props.mergeData({ employee })}
                  url={API_USERS}
                  value={salesEmployee.employee}
                  isMulti
                />
              </div>

              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 50 }}>
                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Từ Ngày"
                    value={salesEmployee.startDate}
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
                    value={salesEmployee.endDate}
                    name="endDate"
                    margin="dense"
                    variant="outlined"
                    onChange={value => this.handleChangeDate(value)}
                  // style={{ padding: 10 }}
                  />
                </div>
              </MuiPickersUtilsProvider>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{
                    marginLeft: 30,
                    padding: '10px',
                    marginTop: '9px',
                  }}
                  onClick={this.handleViewReport}
                >
                  Xem báo cáo chi tiết
                </Button>
              </div>
            </div>
            <Grid container md={12}>
              <ListPage
                disableEdit
                disableAdd
                disableConfig
                columns={salesEmployeeColumns}
                customFunction={this.customFunctionSMS}
                apiUrl={`${API_REPORT}/revenueEmployee`}
                filter={filter}
                client
                mapFunction={this.mapLiabilitiReport}
                reload={salesEmployee.reload + 1}
              />
            </Grid>{' '}
          </div>
        ) : null}
        {tabCus === 1 ? (
          <div>
            <Grid container>
              <Grid item sm={12}>
                <Bt tab1={4}>Hợp đồng</Bt>
                <Bt tab1={3}>Báo giá/Bán hàng</Bt>
                <Bt tab1={2}>Cơ hội kinh doanh</Bt>
                <Bt tab1={1}>Công việc dự án</Bt>
              </Grid>
              <Grid item md={3}>
                <Table style={{ whiteSpace: 'nowrap' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sơ đồ tổ chức công ty</TableCell>
                    </TableRow>
                    <TableRow />
                  </TableHead>
                  <TableBody>{this.state.content ? this.state.content : ''}</TableBody>
                </Table>
              </Grid>
            </Grid>
          </div>
        ) : null}
      </div>
    );
  }

  selectDepartment = depart => {
    const { criterias } = this.props.criteriaPlan;

    if (depart !== '') {
      const tc = [];
      criterias.forEach(element => {
        const child = element.detailRanges.find(i => i.id === depart._id);
        if (child) tc.push({ ...element, plan: child.plan, detailRanges: child });
      });
      this.props.mergeData({ criteriaArr: tc });
    }
    this.props.mergeData({ currentDepart: depart._id });
  };

  clickOpen = depart => {
    /* eslint-disable */
    if (!depart.open) {
      depart.open = true;
    } else {
      depart.open = false;
    }

    this.setState({ changeOpen: true });
    /* eslint-enable */
  };

  handleViewReport = () => {
    const salesEmployee = this.props.salesEmployee;

    this.props.mergeData({
      filter: {
        employee: salesEmployee.employee,
        startDate: new Date(salesEmployee.startDate).toISOString(),
        endDate: new Date(salesEmployee.endDate).toISOString(),
      },
      reload: salesEmployee.reload + 1,
    });
  };

  handleChangeDate = value => {
    if (new Date(this.props.salesEmployee.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      // filter: {
      //   startDate: new Date(this.props.salesEmployee.startDate).toISOString(),
      //   endDate: new Date(value).toISOString(),
      // },
    });
  };

  mapLiabilitiReport = (item, index) => ({
    ...item,
    index: index + 1,
  });
}

SalesEmployee.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  salesEmployee: makeSelectSalesEmployee(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    mergeData: data => dispatch(mergeData(data)),
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'salesEmployee', reducer });
const withSaga = injectSaga({ key: 'salesEmployee', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SalesEmployee);
