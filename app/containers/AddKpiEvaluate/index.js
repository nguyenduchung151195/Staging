/**
 *
 * AddKpiEvaluate
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { LabelImportant, Close } from '@material-ui/icons';
import { Radio, FormControlLabel, RadioGroup, Button, AppBar, Toolbar, IconButton } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Buttons from 'components/CustomButtons/Button';
import { injectIntl } from 'react-intl';
import './style.scss'
import makeSelectAddKpiEvaluate from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';
import { TextField, Typography, Paper, Grid, AsyncAutocomplete } from '../../components/LifetekUi';
import { API_USERS, API_CRITERIA } from '../../config/urlConfig';
import { mergeData, postData, getDefault, getCurrent, putData } from './actions';
import CustomDatePicker from '../../components/CustomDatePicker';
import moment from 'moment'
import { changeSnackbar } from '../../containers/Dashboard/actions';

/* eslint-disable react/prefer-stateless-function */
export class AddKpiEvaluate extends React.Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === 'add') this.props.getDefault();
    else this.props.getCurrent(id);
  }

  handleChangeButton(tab) {
    this.props.mergeData({ tab });
  }

  render() {
    const { addKpiEvaluate, intl } = this.props;
    const { tab } = addKpiEvaluate;
    const BT = props => (
      <Buttons onClick={() => this.handleChangeButton(props.tab)} {...props} color={props.tab === tab ? 'gradient' : ''} round right>
        {props.children}
      </Buttons>
    );
    const id = this.props.match.params.id
    return (
      <div>
        {/* <AppBar className='HearderappBarKpiEvaluate'>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className='BTNKpiEvaluate'
            color="inherit"
            variant="contained"
            onClick={() => this.props.history.goBack()}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id !== 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm Mới' })}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            type="submit"
            onClick={this.onSaveData}
          >
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar>
      </AppBar> */}
        <CustomAppBar
          className='HearderappBarKpiEvaluate'
          title={
            id !== 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm Mới' })}`
          }
          onGoBack={() => this.props.history.goBack()}
          onSubmit={this.onSaveData}
        ></CustomAppBar>
        <Helmet>
          <title>Bản đánh giá</title>
          <meta name="description" content="Description of AddKpiEvaluate" />
        </Helmet>
        {/* <Paper style={{ marginBottom: 20, padding: '0px 16px' }}>
          {this.props.id ? null : (
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Kpi/manage">
                Danh sách đánh giá
              </Link>
              <Typography color="textPrimary">Quy trình đánh giá</Typography>
            </Breadcrumbs>
          )}
        </Paper> */}
        <Paper>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LabelImportant color="primary" fontSize="large" />
            <Typography variant="h6">Quy trình bản đánh giá</Typography>
          </div>
          <Grid md={10} style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20 }}>
            <BT tab={1} style={{ width: 250 }}>
              1. Chọn nhân viên
            </BT>
            <BT tab={2} style={{ width: 250 }}>
              2. Chọn mẫu đánh giá
            </BT>
            <BT tab={3} style={{ width: 250 }}>
              3. Chọn quy trình đánh giá
            </BT>
            <BT tab={4} style={{ width: 250 }}>
              4. Thời gian tạo và đánh giá
            </BT>
            <BT tab={5} style={{ width: 250 }}>
              5. Hoàn thành
            </BT>
          </Grid>
          <Grid item md={10}>
            {tab === 1 ? (
              <div style={{ width: '30%' }}>
                <AsyncAutocomplete
                  name="Chọn..."
                  label="Nhân viên"
                  onChange={value => this.props.mergeData({ employee: value })}
                  url={API_USERS}
                  value={addKpiEvaluate.employee}
                  isMulti
                />
              </div>
            ) : null}
            {tab === 2 ? (
              <div style={{ width: '30%' }}>
                <AsyncAutocomplete
                  name="Chọn..."
                  label="Loại đánh giá"
                  onChange={value => this.props.mergeData({ processType: value })}
                  url={`${API_CRITERIA}/processType`}
                  value={addKpiEvaluate.processType}
                />
              </div>
            ) : null}
            {tab === 3 ? (
              <div>
                <div style={{ width: '30%' }}>
                  <AsyncAutocomplete
                    name="Chọn..."
                    label="Quy trình đánh giá"
                    onChange={value => this.props.mergeData({ process: value })}
                    url={`${API_CRITERIA}/process`}
                    value={addKpiEvaluate.process}
                  />
                </div>
                <Typography variant="subtitle2">Thông tin quy trình đánh giá</Typography>
                {addKpiEvaluate.process === '' ? (
                  <p style={{ color: 'red' }}>Chưa chọn quy trình đánh giá</p>
                ) : (
                  <div>
                    <Typography>Tên quy trình: {addKpiEvaluate.process.name}</Typography>
                    <Typography>Mã quy trình: {addKpiEvaluate.process.code}</Typography>
                  </div>
                )}
              </div>
            ) : null}
            {tab === 4 ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    style={{
                      marginRight: 250,
                    }}
                  >
                    Giai đoạn
                  </Typography>
                  <RadioGroup aria-label="gender" name="gender1" value={addKpiEvaluate.time} onChange={this.handleChangeTime}>
                    <FormControlLabel value={1} control={<Radio />} label="Năm trước" />
                    <FormControlLabel value={2} control={<Radio />} label="Năm nay" />
                  </RadioGroup>
                </div>
                <Typography align="center" variant="subtitle1">
                  Tùy chọn
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    style={{
                      marginRight: 250,
                    }}
                  >
                    Từ ngày
                  </Typography>
                  {/* <TextField
                    validators={['required']}
                    errorMessages={['Không được bỏ trống']}
                    required
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    label="Từ ngày"
                    value={addKpiEvaluate.startDate}
                    name="startDate"
                    onChange={e => this.props.mergeData({ startDate: e.target.value })}
                  /> */}
                  <CustomDatePicker
                    value={addKpiEvaluate.startDate ? moment(addKpiEvaluate.startDate, "YYYY-MM-DD") : null}
                    onChange={e => {
                      this.props.mergeData({ startDate: e ? moment(e) : null })
                    }}
                    label="Từ ngày"
                    helperText={addKpiEvaluate.startDate ? null : 'Từ ngày không được bỏ trống'}
                    error={!addKpiEvaluate.startDate}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    style={{
                      marginRight: 250,
                    }}
                  >
                    Đến ngày
                  </Typography>
                  {/* <TextField
                    validators={['required']}
                    errorMessages={['Không được bỏ trống']}
                    required
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    label="Từ ngày"
                    value={addKpiEvaluate.endDate}
                    name="endDate"
                    onChange={e => this.props.mergeData({ endDate: e.target.value })}
                  /> */}
                  <CustomDatePicker
                    value={addKpiEvaluate.endDate ? moment(addKpiEvaluate.endDate, "YYYY-MM-DD") : null}
                    onChange={e => {
                      this.props.mergeData({ endDate: e ? moment(e) : null })
                    }}
                    label="Đến ngày"
                    helperText={addKpiEvaluate.endDate ? null : 'Đến ngày không được bỏ trống'}
                    error={!addKpiEvaluate.endDate}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    style={{
                      marginRight: 150,
                    }}
                  >
                    Hạn hoàn thành đánh giá
                  </Typography>
                  {/* <TextField
                    validators={['required']}
                    errorMessages={['Không được bỏ trống']}
                    required
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    value={addKpiEvaluate.finishDate}
                    name="finishDate"
                    onChange={e => this.props.mergeData({ finishDate: e.target.value })}
                  /> */}
                  <CustomDatePicker
                    value={addKpiEvaluate.finishDate ? moment(addKpiEvaluate.finishDate, "YYYY-MM-DD") : null}
                    onChange={e => {
                      this.props.mergeData({ finishDate: e ? moment(e) : null })
                    }}
                    label="Hạn hoàn thành đánh giá"
                    helperText={addKpiEvaluate.finishDate ? null : ''}
                    error={false}
                  />
                </div>
              </div>
            ) : null}
            {tab === 5 ? (
              <div>
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: 280 }}>
                    <Typography variant="subtitle2">Chọn nhân viên</Typography>
                    <Typography variant="subtitle2">Chọn mẫu đánh giá</Typography>
                    <Typography variant="subtitle2">Chọn quy trình đánh giá</Typography>
                    <Typography variant="subtitle2">Thời gian tạo và đánh giá</Typography>
                  </div>
                  <div>
                    <Typography>Tổng số nhân viên được chọn: {addKpiEvaluate.employee.length}</Typography>
                    <Typography>{addKpiEvaluate.processType.name}</Typography>
                    <Typography>{addKpiEvaluate.process.name}</Typography>
                    <Typography>
                      Thời gian đánh giá: Từ {new Date(addKpiEvaluate.startDate).toISOString().substring(0, 10)} {` đến `}
                      {addKpiEvaluate.endDate !== '' ? new Date(addKpiEvaluate.endDate).toISOString().substring(0, 10) : null}
                      <p>
                        Hạn hoàn thành:
                        {` `}
                        {addKpiEvaluate.finishDate !== '' ? new Date(addKpiEvaluate.finishDate).toISOString().substring(0, 10) : null}
                      </p>
                    </Typography>
                  </div>
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="primary" style={{ width: 100 }} onClick={this.onSaveData}>
                    Lưu
                  </Button>
                </div> */}
              </div>
            ) : null}
          </Grid>
        </Paper>
      </div>
    );
  }

  onSaveData = () => {
    const id = this.props.match.params.id;
    const addKpiEvaluate = this.props.addKpiEvaluate;
    const startDate = addKpiEvaluate.startDate
    const endDate = addKpiEvaluate.endDate
    const finishDate = addKpiEvaluate.finishDate


    if (!startDate) {
      return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: 'Vui lòng điền từ ngày!', variant: 'error' });
    }
    else if (!endDate) {
      return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: 'Vui lòng điền đến ngày!', variant: 'error' });
    }
    else if (!finishDate) {
      return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: 'Vui lòng điền hạn hoàn thành đánh giá!', variant: 'error' });
    }
    const data = {
      employee: addKpiEvaluate.employee,
      processType: addKpiEvaluate.processType,
      process: addKpiEvaluate.process,
      time: addKpiEvaluate.time,
      startDate: addKpiEvaluate.startDate ? moment(addKpiEvaluate.startDate, "DD-MM-YYYY").format("DD-MM-YYYY") : null,
      endDate: addKpiEvaluate.endDate ? moment(addKpiEvaluate.endDate, "DD-MM-YYYY").format("DD-MM-YYYY") : null,
      finishDate: addKpiEvaluate.finishDate ? moment(addKpiEvaluate.finishDate, "DD-MM-YYYY").format("DD-MM-YYYY") : null,

    };

    if (id === 'add') {
      this.props.postData(data);
    } else {
      this.props.putData(id, data);
    }
    this.props.history.goBack();
  };

  handleChangeTime = e => {
    this.props.mergeData({ time: e.target.value * 1 });
  };
}

AddKpiEvaluate.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addKpiEvaluate: makeSelectAddKpiEvaluate(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: data => dispatch(postData(data)),
    getDefault: () => dispatch(getDefault()),
    getCurrent: id => dispatch(getCurrent(id)),
    putData: (id, data) => dispatch(putData(id, data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addKpiEvaluate', reducer });
const withSaga = injectSaga({ key: 'addKpiEvaluate', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddKpiEvaluate);
