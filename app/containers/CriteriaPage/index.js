/* eslint-disable no-alert */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-prop-types */
/**
 *
 * CriteriaPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  MenuItem,
  Table,
  AppBar,
  Toolbar,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Tab,
  Tabs,
} from '@material-ui/core';
import { Cancel, Close } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import CriteriaPlan from '../CriteriaPlan';
import { API_CRITERIA } from '../../config/urlConfig';
import { TextField, SwipeableDrawer, Grid, Typography, Paper, AsyncAutocomplete } from '../../components/LifetekUi';
import IconButton from '@material-ui/core/IconButton';
import TableRowSpan from '../../components/LifetekUi/TableRowSpan';
import makeSelectCriteriaPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getData, addSetCriteria, getDefault, addCriteria, putCriteria, getItem, deleteCriteria } from './actions';
import { kpiTypeColumns, kpiFormulaColumns } from '../../variable';
import { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';
import * as messData from '../Dashboard/actions';
import { changeSnackbar } from '../Dashboard/actions';

/* eslint-disable react/prefer-stateless-function */
export class CriteriaPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequencyArr: ['Ngày', 'Tuần', 'Tháng', 'Quý', 'Năm'],
      checkLengthCode: '',
      checkLengthName: '',
    };
  }

  componentDidMount() {
    this.props.getData();
  }

  findChildren(data) {
    data.forEach(item => {
      const child = data.filter(ele => ele.parent === item._id);
      if (child.length) {
        item.child = child;
      }
    });

    const newData = data.filter(item => item.parent === null);

    this.getLevel(newData, 0);
    return newData;
  }

  findChildren2(data) {
    data.forEach(item => {
      const child = data.filter(ele => ele.parent === item._id);
      item.child = child;
    });
    const newData = data.filter(item => item.parent === null);
    this.getLevel(newData, 0);
    return newData;
  }

  getLevel(arr, lv) {
    arr.forEach(item => {
      item.level = lv;
      if (item.child) {
        this.getLevel(item.child, lv + 1);
      }
    });
  }

  mapItem(rows, result = []) {
    rows.forEach(item => {
      result.push(
        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
          {item.name}
        </MenuItem>,
      );
      if (item.child) {
        this.mapItem(item.child, result);
      }
    });
    return result;
  }

  mapChild(data, r = [], last = false) {
    data.forEach(item => {
      r.push(item);
      if (item.child) {
        this.mapChild(item.child, r);
      }
    });
    if (last) return r;
  }

  totalRatio = item => {
    let total;
    if (item) total += item * 1;
    return total;
  };

  editItem = id => {
    this.props.mergeData({ openDrawer: true, id });
    this.props.getItem(id);
  };

  deleteItem = listId => {
    this.props.deleteCriteria(listId);
    this.props.getData();
  };

  addCriteria = () => {
    this.props.mergeData({ openDrawer: true, id: null, isDelete: true });
    this.props.getDefault();
  };

  changetype = e => {
    this.props.mergeData({ rangeType: e.target.value });
  };
  closeKpiCriteria = () => {
    this.props.history.goBack();
  };

  render() {
    const { criteriaPage, intl, miniActive } = this.props;
    const { openDialog, active, name, code, openDrawer, departments, tab, criterias } = criteriaPage;
    const child = this.mapChild(departments, [], true);
    const newItem = child.filter(item => item.parent === criteriaPage.ranges);
    const newChild = child.filter(item => item.child && item.child.length).map(i => ({ ...i, child: undefined }));
    const criteriasArr = criterias.data ? criterias.data : criterias;
    const crmStatus = JSON.parse(localStorage.getItem('crmSource'));
    const childCategory = this.mapChild(this.findChildren2(criteriaPage.categoryStock), [], true);
    const newCategory = criteriaPage.categoryStock.filter(item => item.parent === criteriaPage.ranges);
    const newChildCategory = childCategory.filter(item => item.child && item.child.length).map(i => ({ ...i, child: undefined }));
    const crmStatusCurrent = crmStatus.find(it => it._id === criteriaPage.ranges) ? crmStatus.find(it => it._id === criteriaPage.ranges).data : [];
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 8, nameAdd.length);
    return (
      <div>
        <Tabs value={tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
          <Tab value={0} label={intl.formatMessage(messages.criteriasetcriteria || { id: 'criteriasetcriteria' })} />
          <Tab value={1} label={intl.formatMessage(messages.plan || { id: 'plan' })} />
          {/* <Tab value={2} label="Kết quả" /> */}
        </Tabs>

        {tab === 0 ? (
          <Paper>
            <div style={{ margin: '20px 0px' }}>
              <Button variant="outlined" color="primary" onClick={() => this.props.mergeData({ openDialog: true })}>
                {intl.formatMessage(messages.addsetcriteria || { id: 'addsetcriteria' })}
              </Button>
              <Button variant="outlined" color="primary" style={{ marginLeft: 20 }} onClick={this.addCriteria}>
                {intl.formatMessage(messages.addcriteria || { id: 'addcriteria' })}
              </Button>
            </div>
            <TableRowSpan rows={criteriasArr} rangesArr={child} edit={this.editItem} delete={this.deleteItem} />
          </Paper>
        ) : null}
        {tab === 1 ? (
          <Paper>
            <CriteriaPlan child={child} setChild={newChild => this.props.mergeData({ child: newChild })} />
          </Paper>
        ) : null}
        {tab === 2 && <div>{alert('Bạn không có quyền truy cập chức năng này')} </div>}

        <Dialog
          scroll="body"
          open={openDialog}
          onClose={() => {
            // eslint-disable-next-line no-sequences
            this.props.mergeData({ openDialog: false }), this.props.getDefault();
          }}
        >
          <DialogTitle id="alert-dialog-title">Thêm mới bộ tiêu chí</DialogTitle>
          <DialogContent style={{ width: 600, height: 200 }}>
            <TextField
              required
              helperText={name === '' ? 'Tên bộ tiêu chí không được bỏ trống' : null}
              error={name === ''}
              value={name}
              fullWidth
              onChange={e => this.props.mergeData({ name: e.target.value })}
              label="Tên bộ tiêu chí"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              helperText={code === '' ? 'Mã bộ tiêu chí không được bỏ trống' : null}
              error={code === ''}
              value={code}
              fullWidth
              onChange={e => this.props.mergeData({ code: e.target.value })}
              label="Mã bộ tiêu chí"
              InputLabelProps={{ shrink: true }}
            />
            <Checkbox
              checked={active}
              onChange={e => this.handleDiscount('active', e.target.checked)}
              value="active"
              color="primary"
              inputProps={{
                'aria-label': 'secondary checkbox',
              }}
            />
            Sử dụng
          </DialogContent>
          <DialogActions>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={this.onSaveSetCriteria} variant="outlined" color="primary" style={{ marginRight: 15 }}>
                Lưu
              </Button>
              <Button
                onClick={() =>
                  // eslint-disable-next-line no-sequences
                  this.props.mergeData({ openDialog: false })
                }
                variant="outlined"
                color="secondary"
              >
                Hủy
              </Button>
            </div>
          </DialogActions>
        </Dialog>
        <SwipeableDrawer
          anchor="left"
          onClose={() => {
            this.props.mergeData({ openDrawer: false });
            setTimeout(() => {
              this.props.onMergeData({ hiddenHeader: false });
            }, 1000);
          }}
          open={openDrawer}
          width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
        >
          <div>
            <CustomAppBar
              title={intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới tiêu chí' })}
              onGoBack={() => {
                this.props.mergeData({ openDrawer: false });
                setTimeout(() => {
                  this.props.onMergeData({ hiddenHeader: false });
                }, 1000);
              }}
              onSubmit={this.onSaveCriteria}
            />
          </div>

          <Grid
            container
            md={12}
            style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)', marginTop: '5rem', paddingLeft: '1rem' }}
          >
            <Grid item md={5}>
              <TextField
                fullWidth
                label="Mã tiêu chí"
                required
                value={code}
                // onChange={e => this.props.mergeData({ code: e.target.value })}
                onChange={this.handleChangeCode}
                InputLabelProps={{ shrink: true }}
                helperText={code === '' ? 'Mã tiêu chí không được bỏ trống' : null || this.state.checkLengthCode}
                error={code === '' || this.state.checkLengthCode}
              />
              <div>
                <AsyncAutocomplete
                  label="Thuộc bộ tiêu chí"
                  value={criteriaPage.criterionType}
                  onChange={value => this.props.mergeData({ criterionType: value })}
                  url={`${API_CRITERIA}/criterionType`}
                  helperText={criteriaPage.criterionType === '' ? 'Bộ tiêu chí không được bỏ trống' : null}
                  error={criteriaPage.criterionType === ''}
                />
              </div>
              <TextField
                label="Loại phạm vi"
                fullWidth
                value={criteriaPage.rangeType}
                name="rangeType"
                onChange={this.changetype}
                InputLabelProps={{ shrink: true }}
                select
                disabled={!criteriaPage.isDelete}
              >
                {kpiTypeColumns.map((item, index) => (
                  <MenuItem value={index + 1}>{item}</MenuItem>
                ))}
              </TextField>
              {criteriaPage.rangeType === 1 ? (
                <TextField
                  select
                  fullWidth
                  label="Phạm vi"
                  value={criteriaPage.ranges}
                  onChange={e => this.props.mergeData({ ranges: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                >
                  {this.mapItem(this.findChildren(newChild))}
                </TextField>
              ) : criteriaPage.rangeType === 2 ? (
                <TextField fullWidth label="Phạm vi" value="Khách hàng" InputLabelProps={{ shrink: true }} />
              ) : criteriaPage.rangeType === 3 ? (
                <TextField fullWidth label="Phạm vi" value="Nhà cung cấp" InputLabelProps={{ shrink: true }} />
              ) : criteriaPage.rangeType === 4 ? (
                <TextField
                  select
                  fullWidth
                  label="Phạm vi"
                  value={criteriaPage.rangeType}
                  onChange={e => this.props.mergeData({ ranges: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                >
                  {this.mapItem(this.findChildren2(newChildCategory))}
                </TextField>
              ) : criteriaPage.rangeType === 5 ? (
                <TextField
                  select
                  fullWidth
                  label="Phạm vi"
                  name="Danh muc cấu hình CRM"
                  value={criteriaPage.ranges}
                  onChange={e => this.props.mergeData({ ranges: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                >
                  {crmStatus.map(item => (
                    <MenuItem value={item._id}>{item.title}</MenuItem>
                  ))}
                </TextField>
              ) : criteriaPage.rangeType === 6 ? (
                <TextField fullWidth label="Phạm vi" value="Sản phẩm và nhóm sản phẩm" InputLabelProps={{ shrink: true }} />
              ) : null}
            </Grid>
            <Grid item md={5} style={{ marginLeft: 40 }}>
              <TextField
                fullWidth
                label="Tên tiêu chí"
                required
                value={name}
                // onChange={e => this.props.mergeData({ name: e.target.value })}
                onChange={this.handleChangeName}
                InputLabelProps={{ shrink: true }}
                helperText={name === '' ? 'Tên bộ tiêu chí không được bỏ trống' : null || this.state.checkLengthName}
                error={name === '' || this.state.checkLengthName}
              />
              <TextField
                fullWidth
                label="Loại công thức"
                disabled={!criteriaPage.isDelete}
                value={criteriaPage.formulaType}
                onChange={e => this.props.mergeData({ formulaType: e.target.value })}
                InputLabelProps={{ shrink: true }}
                select
              >
                {kpiFormulaColumns.map((item, index) => (
                  <MenuItem value={index + 1}>{item}</MenuItem>
                ))}
              </TextField>
              {criteriaPage.formulaType === 3 ? (
                <TextField
                  fullWidth
                  label="Công thức"
                  value={criteriaPage.formula}
                  onChange={e => this.props.mergeData({ formula: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              ) : null}

              {/* <TextField
                fullWidth
                label="Kế hoạch"
                value={criteriaPage.plan}
                onChange={e => this.props.mergeData({ plan: e.target.value })}
                InputLabelProps={{ shrink: true }}
              /> */}
            </Grid>
            <Grid item md={12}>
              <Checkbox
                checked={criteriaPage.active}
                onChange={e => this.handleDiscount('active', e.target.checked)}
                value="active"
                color="primary"
                inputProps={{
                  'aria-label': 'secondary checkbox',
                }}
              />
              Phạm vi chi tiết
              {criteriaPage.active === true && criteriaPage.rangeType !== 7 ? (
                <Grid item md={10}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {criteriaPage.columnsLimit.map(item => (
                          <TableCell>{item.title[criteriaPage.rangeType - 1]}</TableCell>
                        ))}
                        <TableCell>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.criteriaPage.detailRanges.map((i, index) => (
                        <TableRow>
                          <TableCell>
                            {criteriaPage.rangeType === 1 ? (
                              <TextField
                                InputLabelProps={{ shrink: true }}
                                select
                                // label="Chọn danh mục"
                                value={i.id}
                                name="id"
                                onChange={this.changeEmployees(index)}
                                fullWidth
                              >
                                {/* gia trị condition tu 1 den 5 */}
                                {newItem.map(item => (
                                  <MenuItem value={item._id}>{item.name}</MenuItem>
                                ))}
                              </TextField>
                            ) : criteriaPage.rangeType === 2 ? (
                              <TextField
                                select
                                fullWidth
                                value={i.id}
                                name="Khách hàng"
                                onChange={this.changeEmployees(index)}
                                InputLabelProps={{ shrink: true }}
                              >
                                {criteriaPage.customers.map(item => (
                                  <MenuItem value={item._id}>{item.name}</MenuItem>
                                ))}
                              </TextField>
                            ) : criteriaPage.rangeType === 3 ? (
                              <TextField
                                select
                                fullWidth
                                value={i.id}
                                name="Nhà cung cap"
                                onChange={this.changeEmployees(index)}
                                InputLabelProps={{ shrink: true }}
                              >
                                {criteriaPage.suppliers.map(item => (
                                  <MenuItem value={item._id}>{item.name}</MenuItem>
                                ))}
                              </TextField>
                            ) : criteriaPage.rangeType === 4 ? (
                              <TextField
                                select
                                fullWidth
                                value={i.id}
                                name="Danh muc sản phẩm trong kho"
                                onChange={this.changeEmployees(index)}
                                InputLabelProps={{ shrink: true }}
                              >
                                {newCategory.map(item => (
                                  <MenuItem value={item._id}>{item.name}</MenuItem>
                                ))}
                              </TextField>
                            ) : criteriaPage.rangeType === 5 ? (
                              <TextField
                                select
                                fullWidth
                                value={i.id}
                                name="Danh muc cấu hình CRM"
                                onChange={this.changeEmployees(index)}
                                InputLabelProps={{ shrink: true }}
                              >
                                {crmStatusCurrent.map(item => (
                                  <MenuItem value={item.value}>{item.name ? item.name : item.title}</MenuItem>
                                ))}
                              </TextField>
                            ) : (
                              <TextField
                                select
                                fullWidth
                                value={i.id}
                                name="Sản phẩm và nhóm sản phẩm"
                                onChange={this.changeEmployees(index)}
                                InputLabelProps={{ shrink: true }}
                              >
                                {criteriaPage.products.map(item => (
                                  <MenuItem value={item._id}>{item.name}</MenuItem>
                                ))}
                              </TextField>
                            )}
                          </TableCell>

                          <TableCell>
                            <div style={{ display: 'flex' }}>
                              <Cancel onClick={this.deleteRow} style={{ margin: 5, cursor: 'pointer' }} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      <Button variant="outlined" onClick={this.addRowLimit} color="primary">
                        Thêm hàng
                      </Button>
                    </TableBody>
                  </Table>
                </Grid>
              ) : null}
            </Grid>
            <Grid container md={12} style={{ marginTop: 40 }}>
              <Grid item md={5}>
                <TextField
                  fullWidth
                  label="Tỷ trọng (%)"
                  value={criteriaPage.ratio}
                  onChange={e => this.props.mergeData({ ratio: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                />
                <TextField
                  fullWidth
                  label="Đơn vị đo"
                  value={criteriaPage.unit}
                  onChange={e => this.props.mergeData({ unit: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Thứ tự"
                  value={criteriaPage.order}
                  onChange={e => this.props.mergeData({ order: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                />
                <TextField
                  fullWidth
                  label="Tần suất đo"
                  disabled={!criteriaPage.isDelete}
                  value={criteriaPage.frequency}
                  onChange={e => this.props.mergeData({ frequency: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  select
                >
                  {this.state.frequencyArr.map((item, index) => (
                    <MenuItem value={index}>{item}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Kỳ vọng"
                  value={criteriaPage.expected}
                  onChange={e => this.props.mergeData({ expected: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={criteriaPage.note}
                  onChange={e => this.props.mergeData({ note: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item md={6} style={{ marginLeft: 20 }}>
                <Typography variant="subtitle2">Tính điểm đánh giá KPI</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Điểm</TableCell>
                      <TableCell>Ưu tiên</TableCell>
                      <TableCell>Đánh giá</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.criteriaPage.points.map((i, index) => (
                      <TableRow>
                        {index === 0 ? (
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <p style={{ fontWeight: 'bold', margin: '0px 20px' }}>K {` < `}</p>
                              <TextField
                                value={i.to}
                                name="to"
                                onChange={this.changeCoefficient(index)}
                                InputLabelProps={{ shrink: true }}
                                style={{ width: '40%' }}
                              />
                            </div>
                          </TableCell>
                        ) : index === this.props.criteriaPage.points.length - 1 ? (
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <p style={{ fontWeight: 'bold', margin: '0px 20px' }}>
                                {this.props.criteriaPage.points[index - 1].to} {`<=`} K
                              </p>
                            </div>
                          </TableCell>
                        ) : (
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <p style={{ fontWeight: 'bold', margin: '0px 20px' }}>
                                {this.props.criteriaPage.points[index - 1].to} {`<=`} K {`<`}
                              </p>
                              <TextField
                                value={i.to}
                                name="to"
                                onChange={this.changeCoefficient(index)}
                                InputLabelProps={{ shrink: true }}
                                style={{ width: '40%' }}
                              />
                            </div>
                          </TableCell>
                        )}

                        <TableCell>
                          <TextField fullWidth value={i.point} name="point" onChange={this.changeScore(index)} InputLabelProps={{ shrink: true }} />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            value={i.trend}
                            name="trend"
                            onChange={this.changeTendency(index)}
                            InputLabelProps={{ shrink: true }}
                            select
                          >
                            <MenuItem value={1}>Tốt</MenuItem>
                            <MenuItem value={2}>Đạt</MenuItem>
                            <MenuItem value={3}>Không đạt</MenuItem>
                          </TextField>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex' }}>
                            <Cancel onClick={this.deleteRowPoint} style={{ margin: 5, cursor: 'pointer' }} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <Button onClick={this.addRowPoint} color="primary">
                      Thêm mới thang điểm x
                    </Button>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Grid>
          {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 150, marginBottom: 50 }}>
            <Button style={{ width: 80 }} variant="outlined" color="primary" onClick={this.onSaveCriteria}>
              Lưu
            </Button>
          </div> */}
        </SwipeableDrawer>
      </div>
    );
  }
  handleChangeName = e => {
    const rex = /^.{5,}$/;
    const errorName = !rex.test(e.target.value);
    const text = e.target.value;
    if (text.length > 0 && text.length < 5) {
      this.state.checkLengthName = 'TÊN BỘ TIÊU CHÍ  phải có ít nhất 5 ký tự trở lên';
    } else {
      this.state.checkLengthName = '';
    }
    this.props.mergeData({ name: e.target.value, errorName });
  };
  handleChangeCode = e => {
    const rex = /^.{5,}$/;
    const errorName = !rex.test(e.target.value);
    const text = e.target.value;
    if (text.length > 0 && text.length < 5) {
      this.state.checkLengthCode = 'MÃ TIÊU CHÍ  phải có ít nhất 5 ký tự trở lên';
    } else {
      this.state.checkLengthCode = '';
    }
    this.props.mergeData({ code: e.target.value, errorName });
  };
  handleDiscount = (name, checked) => {
    this.props.mergeData({ [name]: checked });
  };

  handleDrawer = () => {
    this.props.mergeData({ openDrawer: true });
  };

  changeEmployees = index => e => {
    const detailRanges = this.props.criteriaPage.detailRanges;
    detailRanges[index].id = e.target.value;
    this.props.mergeData({ detailRanges });
  };

  changePlan = index => e => {
    const detailRanges = [...this.props.criteriaPage.detailRanges];
    detailRanges[index].plan = e.target.value;
    this.props.mergeData({ detailRanges });
  };

  onSaveSetCriteria = () => {
    const { criteriaPage } = this.props;
    if (criteriaPage.name === '' || criteriaPage.code === '') return;
    const data = {
      name: criteriaPage.name,
      code: criteriaPage.code,
      use: criteriaPage.use,
    };
    this.props.addSetCriteria(data);
    this.props.mergeData({ openDialog: false });
    this.props.getData();
  };

  onSaveCriteria = () => {
    const { criteriaPage } = this.props;
    const id = this.props.criteriaPage.id;
    if (criteriaPage.code === '' || criteriaPage.name === '' || criteriaPage.criterionType === '') return;
    const data = {
      name: criteriaPage.name,
      code: criteriaPage.code,
      plan: criteriaPage.plan,
      criterionType: criteriaPage.criterionType,
      formula: criteriaPage.formula,
      ranges: criteriaPage.ranges,
      ratio: criteriaPage.ratio,
      order: criteriaPage.order,
      frequency: criteriaPage.frequency,
      note: criteriaPage.note,
      points: criteriaPage.points,
      active: criteriaPage.active,
      detailRanges: criteriaPage.detailRanges,
      unit: criteriaPage.unit,
      rangeType: criteriaPage.rangeType,
      formulaType: criteriaPage.formulaType,
    };
    // if (this.state.checkLengthName === '') {
    //   this.props.onChangeSnackbar({ status: true, message: 'TÊN BỘ TIÊU CHÍ phải có ít nhất 5 ký tự trở lên', variant: 'error' });
    //   return;
    // }
    // if (this.state.checkLengthCode === '') {
    //   this.props.onChangeSnackbar({ status: true, message: 'MÃ TIÊU CHÍ phải có ít nhất 5 ký tự trở lên', variant: 'error' });
    //   return;
    // }
    if (id !== null) {
      this.props.putCriteria(data, id);
    } else {
      this.props.addCriteria(data);
    }

    this.props.mergeData({ openDrawer: false });
    this.props.getData();
  };

  addRowLimit = () => {
    const data = {
      id: '',
      plan: '',
    };
    const tabData = this.props.criteriaPage.detailRanges.concat(data);
    this.props.mergeData({ detailRanges: tabData });
  };

  deleteRow = index => {
    const newData = this.props.criteriaPage.detailRanges;
    newData.splice(index, 1);
    if (!newData.length) return;
    this.props.mergeData({ detailRanges: newData });
  };

  changeScore = index => e => {
    const points = this.props.criteriaPage.points;
    points[index].point = e.target.value;
    this.props.mergeData({ points });
  };

  changeTendency = index => e => {
    const points = this.props.criteriaPage.points;
    points[index].trend = e.target.value;
    this.props.mergeData({ points });
  };

  changeCoefficient = index => e => {
    const points = this.props.criteriaPage.points;
    points[index].to = e.target.value;
    this.props.mergeData({ points });
  };

  addRowPoint = () => {
    const data = {
      score: '',
      tendency: '',
      coefficient: '',
    };
    const tabData = this.props.criteriaPage.points.concat(data);
    this.props.mergeData({ points: tabData });
  };

  deleteRowPoint = index => {
    const newData = this.props.criteriaPage.points;
    newData.splice(index, 1);
    if (!newData.length) return;
    this.props.mergeData({ points: newData });
  };
}

CriteriaPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  criteriaPage: makeSelectCriteriaPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getData: () => dispatch(getData()),
    addSetCriteria: data => dispatch(addSetCriteria(data)),
    getDefault: () => dispatch(getDefault()),
    addCriteria: data => dispatch(addCriteria(data)),
    putCriteria: (data, id) => dispatch(putCriteria(data, id)),
    getItem: id => dispatch(getItem(id)),
    deleteCriteria: ids => dispatch(deleteCriteria(ids)),
    onMergeData: data => dispatch(messData.mergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'criteriaPage', reducer });
const withSaga = injectSaga({ key: 'criteriaPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(CriteriaPage);
