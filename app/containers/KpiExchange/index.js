/* eslint-disable react/no-unused-prop-types */
/**
 *
 * KpiExchange
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Breadcrumbs } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { MenuItem, Table, TableHead, TableCell, TableRow, TableBody, Button, AppBar, Toolbar } from '@material-ui/core';
import { OpenInBrowser, Cancel, SubdirectoryArrowRight, TrendingUpOutlined, TrendingDownOutlined, Equalizer, Close } from '@material-ui/icons';
import { TextField, Paper, Typography, Grid } from '../../components/LifetekUi';
import IconButton from '@material-ui/core/IconButton';
import { injectIntl } from 'react-intl';
import makeSelectKpiExchange from './selectors';
import { mergeData, putExchange, getCurrentExchange } from './actions'; 
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
export class KpiExchange extends React.Component {
  state = {
    columns: [
      { name: 'name', title: 'Tên', type: 'text' },
      { name: 'direction', title: 'Chiều hướng', type: 'text' },
      { name: 'priority', title: 'Độ ưu tiên', type: 'number' },
    ],
    columnsK: [
      { name: 'to', title: 'Khoảng giá trị hệ số hoàn thành (K)', type: 'text' },
      { name: 'point', title: 'Điểm', type: 'number' },
      { name: 'trend', title: 'Xu hướng', type: 'text' },
    ],
  };

  componentDidMount() {
    this.props.getCurrentExchange();
  }

  changeName = index => e => {
    const tendency = [...this.props.kpiExchange.tendency];
    tendency[index].name = e.target.value;
    this.props.mergeData({ tendency });
  };

  changeDirection = index => e => {
    const tendency = [...this.props.kpiExchange.tendency];
    tendency[index].direction = e.target.value;
    this.props.mergeData({ tendency });
  };

  changePriority = index => e => {
    const tendency = [...this.props.kpiExchange.tendency];
    tendency[index].priority = e.target.value;
    this.props.mergeData({ tendency });
  };

  changeTrend = index => e => {
    const points = [...this.props.kpiExchange.points];
    points[index].trend = e.target.value;
    this.props.mergeData({ points });
  };

  changePoint = index => e => {
    const points = [...this.props.kpiExchange.points];
    points[index].point = e.target.value;
    this.props.mergeData({ points });
  };

  changeNameKpi = index => e => {
    const points = [...this.props.kpiExchange.points];
    const newRow = [...points];
    points[index].to = e.target.value;
    this.props.mergeData({ points: newRow });
  };

  deleteRow = index => {
    const tendency = [...this.props.kpiExchange.tendency];
    const newRow = [...tendency];
    newRow.splice(index, 1);
    this.props.mergeData({ tendency: newRow });
  };

  addRow = () => {
    const tendency = [...this.props.kpiExchange.tendency];
    const data = { name: '', direction: '', priority: '' };
    const newRow = tendency.concat(data);
    this.props.mergeData({ tendency: newRow });
  };

  addpoints = () => {
    const points = [...this.props.kpiExchange.points];
    const data = { to: '', point: '', trend: '' };
    const newRow = points.concat(data);
    this.props.mergeData({ points: newRow });
  };

  deletepoints = index => {
    const points = [...this.props.kpiExchange.points];
    const newRow = [...points];
    newRow.splice(index, 1);
    this.props.mergeData({ points: newRow });
  };
  closeKpiCriteria = () => {
    this.props.history.push('/Kpi');
  };

  render() {
    const { kpiExchange, intl } = this.props;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 8, nameAdd.length);
    return (
      <div>
        <CustomAppBar
          title={
            addStock === 'exchange'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới bảng quy đổi điểm số' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật bảng quy đổi điểm số' })}`
          }
          onGoBack={this.closeKpiCriteria}
          onSubmit={this.onSaveExchange}
        />
        <Paper style={{ marginBottom: 10, padding: 2 }} style={{ display: 'none' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Typography color="textPrimary"> Bảng quy đổi</Typography>
          </Breadcrumbs>
        </Paper>
        <Paper>
          <Grid item md={12}>
            <Typography variant="h6">Thông tin KPI mặc định</Typography>
          </Grid>
          <Grid item md={12} style={{ display: 'flex', justifyContent: 'space-around' }}>
            <TextField
              id="outlined-select-currency"
              select
              label="Tần suất"
              value={kpiExchange.frequency}
              onChange={e => this.props.mergeData({ frequency: e.target.value })}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              style={{ width: '30%' }}
            >
              <MenuItem key="1" value={1}>
                Ngày
              </MenuItem>
              <MenuItem key="1" value={2}>
                Tuần
              </MenuItem>
              <MenuItem key="1" value={3}>
                Tháng
              </MenuItem>
              <MenuItem key="1" value={4}>
                Quý
              </MenuItem>
              <MenuItem key="1" value={5}>
                Năm
              </MenuItem>
            </TextField>
            <TextField
              id="outlined-select-currency"
              select
              label="Đơn vị đo"
              value={kpiExchange.unit}
              onChange={e => this.props.mergeData({ unit: e.target.value })}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              style={{ width: '30%' }}
            >
              <MenuItem key="1" value={1}>
                Triệu đồng
              </MenuItem>
              <MenuItem key="1" value={2}>
                Nghìn đồng
              </MenuItem>
            </TextField>
            <TextField
              id="outlined-select-currency"
              select
              label="Hệ số KPI (K)"
              value={kpiExchange.coefficient}
              onChange={e => this.props.mergeData({ coefficient: e.target.value })}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              style={{ width: '30%' }}
            >
              <MenuItem key="1" value={1}>
                Phần trăm (Kết quả thực hiện/chỉ tiêu * 100%)
              </MenuItem>
              <MenuItem key="1" value={2}>
                Kết quả thực hiện
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item md={12}>
            <div style={{ display: 'flex', marginTop: 50, alignItems: 'center' }}>
              <OpenInBrowser fontSize="large" />
              <Typography variant="subtitle2">Xu hướng</Typography>
            </div>
          </Grid>
          <Grid item md={10}>
            <Table>
              <TableHead>
                <TableRow>
                  {this.state.columns.map(item => (
                    <TableCell style={{ fontWeight: 'bold', color: 'black' }}>{item.title}</TableCell>
                  ))}
                  <TableCell style={{ fontWeight: 'bold', color: 'black' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kpiExchange.tendency.map((item, index) => (
                  <TableRow>
                    <TableCell>
                      <TextField value={item.name} select onChange={this.changeName(index)} fullWidth>
                        <MenuItem value={1}>Tốt</MenuItem>
                        <MenuItem value={2}>Đạt</MenuItem>
                        <MenuItem value={3}>Không đạt</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField value={item.direction} select onChange={this.changeDirection(index)} fullWidth>
                        <MenuItem value={1}>
                          <TrendingUpOutlined fontSize="large" color="primary" />
                        </MenuItem>
                        <MenuItem value={2}>
                          <SubdirectoryArrowRight fontSize="large" color="action" />
                        </MenuItem>
                        <MenuItem value={3}>
                          <TrendingDownOutlined fontSize="large" color="secondary" />
                        </MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField value={item.priority} name="priority" onChange={this.changePriority(index)} fullWidth />
                    </TableCell>
                    <TableCell>
                      <Cancel onClick={this.deleteRow} style={{ cursor: 'pointer' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <Button onClick={this.addRow} color="primary" variant="outlined">
                Thêm xu hướng
              </Button>
            </Table>
          </Grid>
          <Grid item md={12}>
            <div style={{ display: 'flex', marginTop: 50, alignItems: 'center' }}>
              <Equalizer fontSize="large" />
              <Typography variant="subtitle2">Đánh giá KPI mặc định</Typography>
            </div>
            <Grid item md={10}>
              <Table>
                <TableHead>
                  <TableRow>
                    {this.state.columnsK.map(item => (
                      <TableCell style={{ fontWeight: 'bold', color: 'black' }}>{item.title}</TableCell>
                    ))}
                    <TableCell style={{ fontWeight: 'bold', color: 'black' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kpiExchange.points.map((item, index) => (
                    <TableRow>
                      <TableCell>
                        {index === 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ fontSize: 14, fontWeight: 'bold', marginRight: 10 }}>K {`<`} </p>
                            <TextField value={item.to} onChange={this.changeNameKpi(index)} style={{ width: '20%' }} />
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ fontSize: 14, fontWeight: 'bold', marginRight: 10 }}>
                              {kpiExchange.points[index - 1].to} {`<=`} K {`<`}
                            </p>
                            <TextField value={item.to} onChange={this.changeNameKpi(index)} style={{ width: '20%' }} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField value={item.point} name="tendency" onChange={this.changePoint(index)} fullWidth />
                      </TableCell>
                      <TableCell>
                        <TextField value={item.trend} name="trend" onChange={this.changeTrend(index)} fullWidth />
                      </TableCell>
                      <TableCell>
                        <Cancel onClick={this.deletepoints} style={{ cursor: 'pointer' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <Button onClick={this.addpoints} color="primary" variant="outlined">
                  Thêm thang điểm mới
                </Button>
              </Table>
            </Grid>
          </Grid>
          {/* <Grid item md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={this.onSaveExchange} color="primary" variant="contained" style={{ marginRight: 20 }}>
              Lưu
            </Button>
            <Button onClick={this.goBack} color="primary" variant="contained">
              Hủy
            </Button>
          </Grid> */}
        </Paper>
      </div>
    );
  }

  onSaveExchange = () => {
    const kpiExchange = this.props.kpiExchange;
    const data = {
      frequency: kpiExchange.frequency,
      unit: kpiExchange.unit,
      coefficient: kpiExchange.coefficient,
      tendency: kpiExchange.tendency,
      points: kpiExchange.points,
    };
    this.props.putExchange(data);
  };

  goBack = () => {
    this.props.history.goBack();
  };
}

KpiExchange.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kpiExchange: makeSelectKpiExchange(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    putExchange: data => dispatch(putExchange(data)),
    getCurrentExchange: () => dispatch(getCurrentExchange()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kpiExchange', reducer });
const withSaga = injectSaga({ key: 'kpiExchange', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(KpiExchange);
