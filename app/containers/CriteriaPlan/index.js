/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-prop-types */
/**
 *
 * CriteriaPlan
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { MenuItem, TableHead, TableCell, Table, TableRow, TableBody, Typography, Tooltip } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
// import Buttons from 'components/CustomButtons/Button';
import makeSelectCriteriaPlan from './selectors';
import { TextField, Grid, Autocomplete, Dialog } from '../../components/LifetekUi';
// import TableColSpan from '../../components/LifetekUi/TableColSpan';
// import TableColSpanPrecious from '../../components/LifetekUi/TableColSpanPrecious';
import { mergeData, getData, putCriteria } from './actions';
import reducer from './reducer';
// import { serialize } from '../../utils/common';
import CalendarContainer from '../CalendarContainer';
import saga from './saga';
import { API_CRITERIA } from '../../config/urlConfig';
import { getListOpen, convertTableNested, getKpiPlan, totalArray } from '../../helper';

// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */

export class CriteriaPlan extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      plan: 0,
      quarterPlan: [0, 0, 0, 0],
      parentPlan: 0,
      monthPlan: Array.from({ length: 12 }, () => 0),
      criteriaId: null,
      departId: null,
      open: false,
      years: Array.from({ length: 8 }, (a, b) => new Date().getFullYear() - 5 + b),
    };
  }

  componentDidMount() {
    this.props.getData();
  }

  handlePrecious = id => _e => {
    // eslint-disable-next-line no-console
    console.log('ID', id);
  };

  handleChangeTime = e => {
    this.props.mergeData({ times: e.target.value });
    const data = this.handleDate(e.target.value);
    const filter = { date: { $gte: data.start, $lte: data.end } };
    this.props.mergeData({ filter });
  };

  handleDate(type) {
    let time;
    const dt = new Date();
    // theo ngay
    const interval = 1000 * 60 * 60 * 24;
    const daystart = Math.floor(Date.now() / interval) * interval;
    const startOfDay = new Date(daystart);
    const dayend = new Date(daystart + interval - 1);
    const endOfDay = new Date(dayend);
    // theo quy
    const quarter = Math.floor((dt.getMonth() + 3) / 3);
    let firstQuarter;
    let endQuarter;
    // theo thang
    const firstDay = new Date(dt.getFullYear(), dt.getMonth(), 1);
    const lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    // theo nam
    const dateStart = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0);
    const dateEnd = new Date(new Date().getFullYear(), 11, 31, 0, 0, 0);

    switch (type) {
      case 1:
        time = this.props.mergeData({ startDate: dateStart.toISOString(), endDate: dateEnd.toISOString() });
        break;
      case 2:
        // time = this.props.mergeData({ startDate: wkStart.toISOString(), endDate: dateStart.toISOString() });
        if (quarter === 1) {
          firstQuarter = new Date(dt.getFullYear(), quarter * 3, 1);
          endQuarter = new Date(firstQuarter.getFullYear(), firstQuarter.getMonth() + 3, 0);
          time = this.props.mergeData({ startDate: firstQuarter.toISOString(), endDate: endQuarter.toISOString() });
        } else if (quarter === 2) {
          firstQuarter = new Date(dt.getFullYear(), quarter * 3, 1);
          endQuarter = new Date(firstQuarter.getFullYear(), firstQuarter.getMonth() + 3, 0);
          time = this.props.mergeData({ startDate: firstQuarter.toISOString(), endDate: endQuarter.toISOString() });
        } else if (quarter === 3) {
          firstQuarter = new Date(dt.getFullYear(), quarter * 3, 1);
          endQuarter = new Date(firstQuarter.getFullYear(), firstQuarter.getMonth() + 3, 0);
          time = this.props.mergeData({ startDate: firstQuarter.toISOString(), endDate: endQuarter.toISOString() });
        } else if (quarter === 4) {
          firstQuarter = new Date(dt.getFullYear(), quarter * 3, 1);
          endQuarter = new Date(firstQuarter.getFullYear(), firstQuarter.getMonth() + 3, 0);
          time = this.props.mergeData({ startDate: firstQuarter.toISOString(), endDate: endQuarter.toISOString() });
        }
        break;
      case 3:
        time = this.props.mergeData({ startDate: firstDay.toISOString(), endDate: lastDay.toISOString() });
        break;
      case 4:
        time = this.props.mergeData({ startDate: startOfDay.toISOString(), endDate: endOfDay.toISOString() });
        break;
      default:
        break;
    }
    return time;
  }

  render() {
    const { quarterPlan, monthPlan, plan, parentPlan } = this.state;
    const { criteriaPlan } = this.props;
    const level = 0;
    const { kpiPlan } = criteriaPlan;
    const criterias = criteriaPlan.criterias.filter(i => i && i.criterionType && criteriaPlan && criteriaPlan.setCriteras && i.criterionType._id === criteriaPlan.setCriteras._id);
    // console.log(1, criterias);

    const list = getListOpen(criteriaPlan.departments);
    const newCriterias = convertTableNested(criterias, 'criterionType._id');
    this.state.content = criteriaPlan.departments.map(depart => {
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

    // const Bt = props => (
    //   <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
    //     {props.children}
    //   </Buttons>
    // );

    return (
      <div>
        <Grid container>
          <TextField
            InputLabelProps={{ shrink: true }}
            select
            label="Thời gian"
            value={criteriaPlan.times}
            name="employees"
            onChange={this.handleChangeTime}
            style={{ width: '10%' }}
          >
            <MenuItem value={1}>Năm</MenuItem>
            <MenuItem value={2}>Quý</MenuItem>
            <MenuItem value={3}>Tháng</MenuItem>
            <MenuItem value={4}>Ngày</MenuItem>
          </TextField>
          <TextField
            InputLabelProps={{ shrink: true }}
            select
            label="Năm"
            value={criteriaPlan.year}
            name="employees"
            onChange={e => this.props.mergeData({ year: e.target.value })}
            style={{ width: '10%', marginLeft: 30, marginRight: 30 }}
          >
            {this.state.years.map(i => (
              <MenuItem value={i}>{i}</MenuItem>
            ))}
          </TextField>

          <Autocomplete
            name="Chọn..."
            label="Bộ tiêu chí"
            onChange={value => this.props.mergeData({ setCriteras: value })}
            suggestions={criteriaPlan.setCriteria}
            value={criteriaPlan.setCriteras}
            isClearable={false}
            style={{ width: '50%' }}
          />
        </Grid>
        <Grid container md={12}>
          {criteriaPlan.times === 4 ? null : (
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
          )}
          <Grid style={{ overflow: 'auto' }} item md={criteriaPlan.times === 4 ? 12 : 9}>
            {criteriaPlan.times === 1 ? (
              <Table style={{ whiteSpace: 'nowrap' }}>
                <TableHead>
                  <TableRow>
                    {newCriterias.map(
                      i =>
                        i.ord === 0 ? (
                          <TableCell align="center" colSpan={i.total}>
                            {i.criterionType.name}
                          </TableCell>
                        ) : null,
                    )}
                  </TableRow>
                  <TableRow />
                </TableHead>
                <TableBody>
                  <TableRow>
                    {newCriterias.map(i => (
                      <TableCell>{i.name}</TableCell>
                    ))}
                  </TableRow>
                  {list.map(item => (
                    <TableRow>
                      {newCriterias.map(i => {
                        const dt = getKpiPlan(item, i._id, kpiPlan);
                        return (
                          <Tooltip
                            title={
                              <p>
                                {dt.yearPlan}/{totalArray(dt.quarterPlan)}/{dt.verticalYearPlan}
                              </p>
                            }
                          >
                            <TableCell onClick={() => this.changePlan(i._id, item._id)}>{dt.yearPlan}</TableCell>
                          </Tooltip>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
            {criteriaPlan.times === 2 ? (
              <Table style={{ whiteSpace: 'nowrap' }}>
                <TableHead>
                  <TableRow>
                    {newCriterias.map(i => (
                      <TableCell align="center" colSpan={5}>
                        {i.name}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow />
                </TableHead>
                <TableBody>
                  <TableRow>
                    {newCriterias.map(() => (
                      <React.Fragment>
                        <TableCell>KH Năm</TableCell>
                        <TableCell>Quý I</TableCell>
                        <TableCell>Quý II</TableCell>
                        <TableCell>Quý III</TableCell>
                        <TableCell>Quý IV</TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                  {list.map(item => (
                    <TableRow>
                      {newCriterias.map(i => {
                        const dt = getKpiPlan(item, i._id, kpiPlan);
                        const totalArr = totalArray(dt.quarterPlan);
                        return (
                          <React.Fragment>
                            <Tooltip
                              title={
                                <p>
                                  {dt.yearPlan}/{totalArr}/{dt.verticalYearPlan}
                                </p>
                              }
                            >
                              <TableCell onClick={() => this.changePlan(i._id, item._id, totalArr)}>{dt.yearPlan}</TableCell>
                            </Tooltip>

                            {dt.quarterPlan.map((el, ei) => (
                              <Tooltip
                                title={
                                  <p>
                                    {el}/{totalArray(dt.monthPlan, Math.ceil(ei + 1 / 3) * 3 - 3, Math.ceil(ei + 1 / 3) * 3)}/
                                    {dt.verticalQuarterPlan[ei]}
                                  </p>
                                }
                              >
                                <TableCell onClick={() => this.changePlan(i._id, item._id, totalArr)}>{el}</TableCell>
                              </Tooltip>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
            {criteriaPlan.times === 3 ? (
              <Table style={{ whiteSpace: 'nowrap' }}>
                <TableHead>
                  <TableRow>
                    {newCriterias.map(i => (
                      <TableCell align="center" colSpan={12}>
                        {i.name}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    {newCriterias.map(() => (
                      <React.Fragment>
                        <TableCell align="center" colSpan={3}>
                          Quý I
                        </TableCell>

                        <TableCell align="center" colSpan={3}>
                          Quý II
                        </TableCell>
                        <TableCell align="center" colSpan={3}>
                          Quý III
                        </TableCell>
                        <TableCell align="center" colSpan={3}>
                          Quý IV
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {newCriterias.map(() => (
                      <React.Fragment>
                        {Array.from({ length: 12 }, (u, v) => v + 1).map(i => (
                          <TableCell>Tháng {i}</TableCell>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableRow>
                 
                  {list.map(item => (
                    <TableRow>
                      {newCriterias.map(i =>
                        getKpiPlan(item, i._id, kpiPlan).monthPlan.map(el => {
                           var monthData = getKpiPlan(item, i._id, kpiPlan).monthPlan;
                          return (
                          <TableCell onClick={() => this.changePlan2(i._id, item._id,monthData)}>{el}</TableCell>
                        )}
                        ),
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
            {criteriaPlan.times === 4 ? (
              <CalendarContainer
                column={{
                  Id: '_id',
                  Subject: 'name',
                  Location: '',
                  StartTime: 'createdAt',
                  EndTime: 'updatedAt',
                  CategoryColor: '#357cd2',
                }}
                isCloneModule
                url={API_CRITERIA}
                handleAdd={this.handleAddClick}
                handleEdit={this.handleClickEdit}
              />
            ) : null}
          </Grid>
        </Grid>
        <Dialog maxWidth="sm" onSave={this.updateCriteria} onClose={() => this.setState({ open: false })} open={this.state.open}>
          {criteriaPlan.times === 1 && (
            <React.Fragment>
              <TextField label="Kế hoạch năm" type="number" onChange={e => this.setState({ plan: e.target.value })} value={plan} />
              {/* <Typography color="primary">Tổng Kế hoạch cả năm : plan</Typography> */}
            </React.Fragment>
          )}
          {criteriaPlan.times === 2 && (
            <React.Fragment>
              <TextField label="Kế hoạch quý I" type="number" id='blockMouseScroll13' onClick={e => this.blockMouseScroll(e,13)} onChange={e => this.changePlanArr('quarterPlan', 0, e)} value={quarterPlan[0]} />
              <TextField label="Kế hoạch quý II" type="number" id='blockMouseScroll14' onClick={e => this.blockMouseScroll(e,14)} onChange={e => this.changePlanArr('quarterPlan', 1, e)} value={quarterPlan[1]} />
              <TextField label="Kế hoạch quý III" type="number" id='blockMouseScroll15' onClick={e => this.blockMouseScroll(e,15)} onChange={e => this.changePlanArr('quarterPlan', 2, e)} value={quarterPlan[2]} />
              <TextField label="Kế hoạch quý IV" type="number" id='blockMouseScroll16' onClick={e => this.blockMouseScroll(e,16)} onChange={e => this.changePlanArr('quarterPlan', 3, e)} value={quarterPlan[3]} />
              <Typography color="primary">
                Tổng Kế hoạch cả năm : {totalArray(quarterPlan)}/{parentPlan}
              </Typography>
            </React.Fragment>
          )}
          {criteriaPlan.times === 3 && (
            <React.Fragment>
              <TextField label="Kế hoạch tháng 1" type="number" id='blockMouseScroll1' onClick={e => this.blockMouseScroll(e,1)} onChange={e => this.changePlanArr('monthPlan', 0, e)} value={monthPlan[0]} />
              <TextField label="Kế hoạch tháng 2" type="number" id='blockMouseScroll2' onClick={e => this.blockMouseScroll(e,2)} onChange={e => this.changePlanArr('monthPlan', 1, e)} value={monthPlan[1]} />
              <TextField label="Kế hoạch tháng 3" type="number" id='blockMouseScroll3' onClick={e => this.blockMouseScroll(e,3)} onChange={e => this.changePlanArr('monthPlan', 2, e)} value={monthPlan[2]} />
              {/* <Typography color="primary">Tổng Kế hoạch cả quý I : 190.888.000</Typography> */}
              <TextField label="Kế hoạch tháng 4" type="number" id='blockMouseScroll4' onClick={e => this.blockMouseScroll(e,4)} onChange={e => this.changePlanArr('monthPlan', 3, e)} value={monthPlan[3]} />
              <TextField label="Kế hoạch tháng 5" type="number" id='blockMouseScroll5' onClick={e => this.blockMouseScroll(e,5)} onChange={e => this.changePlanArr('monthPlan', 4, e)} value={monthPlan[4]} />
              <TextField label="Kế hoạch tháng 6" type="number" id='blockMouseScroll6' onClick={e => this.blockMouseScroll(e,6)} onChange={e => this.changePlanArr('monthPlan', 5, e)} value={monthPlan[5]} />
              {/* <Typography color="primary">Tổng Kế hoạch cả quý II : 190.888.000</Typography> */}
              <TextField label="Kế hoạch tháng 7" type="number" id='blockMouseScroll7' onClick={e => this.blockMouseScroll(e,7)} onChange={e => this.changePlanArr('monthPlan', 6, e)} value={monthPlan[6]} />
              <TextField label="Kế hoạch tháng 8" type="number" id='blockMouseScroll8' onClick={e => this.blockMouseScroll(e,8)} onChange={e => this.changePlanArr('monthPlan', 7, e)} value={monthPlan[7]} />
              <TextField label="Kế hoạch tháng 9" type="number" id='blockMouseScroll9' onClick={e => this.blockMouseScroll(e,9)} onChange={e => this.changePlanArr('monthPlan', 8, e)} value={monthPlan[8]} />
              {/* <Typography color="primary">Tổng Kế hoạch cả quý III : 190.888.000</Typography> */}
              <TextField label="Kế hoạch tháng 10" type="number" id='blockMouseScroll10' onClick={e => this.blockMouseScroll(e,10)} onChange={e => this.changePlanArr('monthPlan', 9, e)} value={monthPlan[9]} />
              <TextField label="Kế hoạch tháng 11" type="number" id='blockMouseScroll11' onClick={e => this.blockMouseScroll(e,11)} onChange={e => this.changePlanArr('monthPlan', 10, e)} value={monthPlan[10]} />
              <TextField label="Kế hoạch tháng 12" type="number" id='blockMouseScroll12' onClick={e => this.blockMouseScroll(e,12)} onChange={e => this.changePlanArr('monthPlan', 11, e)} value={monthPlan[11]} />
              {/* <Typography>Tổng Kế hoạch cả quý IV : 190.888.000</Typography> */}
            </React.Fragment>
          )}
        </Dialog>
      </div>
    );
  }

  changePlanArr = (type, index, e) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const data = [...this.state[type]];
    data[index] = e.target.value;
    this.setState({ [type]: data });
  };

  blockMouseScroll = (e, index) => {
    const inp = document.getElementById("blockMouseScroll"+index);
    inp.addEventListener("mousewheel", function(event){ this.blur() })
  };
  updateCriteria = () => {
    const { criteriaId, departId, plan, monthPlan, quarterPlan } = this.state;
    const { year, times } = this.props.criteriaPlan;
    const data = { year, plan, kpi: criteriaId, rangeId: departId, rangeType: 1, month: monthPlan, quarter: quarterPlan, type: times };
    this.props.updateCriteria(data);
    this.setState({ open: false });
  };

  changePlan = (criteriaId, departId, parentPlan) => {
    this.setState({
      open: true,
      criteriaId,
      departId,
      parentPlan,
      plan: 0,
      monthPlan: Array.from({ length: 12 }, () => 0),
      quarterPlan: [0, 0, 0, 0],
    });
  };
  changePlan2 = (criteriaId, departId, monthData) => {
    this.setState({
      open: true,
      criteriaId,
      departId,
      plan: 0,
      monthPlan: monthData,
      quarterPlan: [0, 0, 0, 0],
    });
  };
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

    console.log(depart);

    this.setState({ changeOpen: true });
    /* eslint-enable */
  };

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
}

CriteriaPlan.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  criteriaPlan: makeSelectCriteriaPlan(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getData: data => dispatch(getData(data)),
    updateCriteria: data => dispatch(putCriteria(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'criteriaPlan', reducer });
const withSaga = injectSaga({ key: 'criteriaPlan', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CriteriaPlan);
