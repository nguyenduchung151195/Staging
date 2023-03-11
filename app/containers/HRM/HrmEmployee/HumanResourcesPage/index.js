import { TreeDataState, CustomTreeData } from '@devexpress/dx-react-grid';
import {
  Grid as GridDx,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  TableFixedColumns,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';

import { Grid, MenuItem } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import CustomInputBase from 'components/Input/CustomInputBase';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { Fab, Paper, SwipeableDrawer } from '../../../../components/LifetekUi';
import ListPage from '../../../../components/List';
import { addHumanResource, getHumanResource, updateHumanResource } from './actions';
import EditHumanResources from './components/EditHumanResources/Loadable';
import reducer from './reducer';
import saga from './saga';
import makeSelectHumanResourecePage from './selectors';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';
import DatePicker from 'material-ui-pickers/DatePicker';
import { serialize } from '../../../../utils/common';
import { API_HUMAN_RESOURCE } from 'config/urlConfig';
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";

function HumanResourcesPage(props) {
  const { humanResourcesPage, getHumanResource, updateHumanResource, addHumanResource } = props;
  const { reload, fields, humanResource } = humanResourcesPage;
  const [open, setOpen] = useState(false);
  const [selectHumanResources, setSelectHumanResources] = useState(null);
  const [years, setYears] = useState(new Date());
  const [months, setMonths] = useState(null);
  const [localState, setLocalState] = useState({ type: 0 });
  const [filter, setFilter] = useState({
    month: moment().month() + 1,
    year: moment().year(),
  });
  const [columnExtensions] = useState([{ columnName: 'name', width: 200, color: '#fff !important' }]);
  const [sorting, setSorting] = useState([{ columnName: 'name', direction: 'asc' }]);
  const [defaultColumnWidths] = useState([
    // { columnName: "name", width: 200 },
    // {
    //   columnName: "PFC"
    //   , width: 200
    // },
    // { columnName: "MKT", width: 2000 },
    // { columnName: "TGD", width: 2000 },
    // { columnName: "àwsdgfd", width: 2000 },
    // { columnName: "HR", width: 2000 },
    // { columnName: "NV", width: 2000 },
    // { columnName: "edit", width: 2000 }
  ]);

  useEffect(() => {
    getHumanResource();
    // const years = betweenYearToYear(6, 2);
    // setYears(years);
    // const months = monthToMonth(1, 12);
    // setMonths(months);
  }, []);

  useEffect(
    () => {
      if (reload) {
        handleCloseHumanResource();
      }
    },
    [reload],
  );

  // function betweenYearToYear(start, end) {
  //   let years = [];
  //   const startYear = moment().year() - start;
  //   const endYear = moment().year() + end;
  //   for (let i = startYear; i <= endYear; i += 1) {
  //     years.push(i);
  //   }
  //   return years;
  // }
  // function monthToMonth(start, end) {
  //   let months = [];
  //   for (let i = start; i <= end; i += 1) {
  //     months.push(i);
  //   }
  //   return months;
  // }
  const deleteDate = () => {
    setMonths(null);
    const startDay = moment(new Date())
      .startOf('month')
      .format();
    const endDay = moment(new Date())
      .endOf('month')
      .format();
    const filterDay = {
      filter: {
        createdAt: {
          $gte: `${startDay}`,
          $lte: `${endDay}`,
        },
      },
    };
    const params = `${API_HUMAN_RESOURCE}?${serialize(filterDay)}`;
    getHumanResource(params);
  }
  const handleChangeMonth = e => {
    console.log('ss', e);
    setMonths(e);
    const startDay = moment(e)
      .startOf('month')
      .format();
    const endDay = moment(e)
      .endOf('month')
      .format();
    const filterDay = {
      filter: {
        createdAt: {
          $gte: `${startDay}`,
          $lte: `${endDay}`,
        },
      },
    };
    const params = `${API_HUMAN_RESOURCE}?${serialize(filterDay)}`;
    getHumanResource(params);
  };
  const handleChangeYears = e => {
    setYears(e);
    const startDay = moment(e)
      .startOf('year')
      .format();
    const endDay = moment(e)
      .endOf('year')
      .format();
    const filterDay = {
      filter: {
        createdAt: {
          $gte: `${startDay}`,
          $lte: `${endDay}`,
        },
      },
    };
    const params = `${API_HUMAN_RESOURCE}?${serialize(filterDay)}`;
    getHumanResource(params);
  };
  const handleCloseHumanResource = () => {
    setSelectHumanResources(null);
    setOpen(false);
  };

  const handleSave = data => {
    if (data && data.organizationUnit) {
      updateHumanResource(data);
    } else {
      addHumanResource(data);
    }
  };
  const handleChangeType = e => {
    const {
      target: { value, name },
    } = e;
    setLocalState({ ...localState, [name]: value });
  };
  const handleChange = e => {
    const {
      target: { value, name },
    } = e;
    setFilter({ ...filter, [name]: value });
  };

  function formatData(humanResources) {
    if (Array.isArray(humanResources) && humanResources.length > 0) {
      const data = humanResources.map(item => {
        const obj = {};
        Object.keys(item).map(key => {
          if (key === 'roles' && Array.isArray(item[key]) && item[key].length > 0) {
            item[key].map(it => {
              obj[it['code']] = it.value;
            });
          } else {
            if (key === 'organizationUnit') {
              // obj['_id'] = item[key];
              obj[key] = item[key];
            } else if (key === 'organizationUnitName') {
              obj['name'] = item.organizationUnitName;
            } else {
              obj[key] = item[key];
            }
          }
        });
        return obj;
      });
      const newData = data.map(it => {
        return {
          ...it,
          edit: addEdit(it._id, it),
        };
      });
      return newData;
    }
  }

  const addEdit = (id, item) => {
    return (
      <Grid container spacing={16} justify="flex-start">
        <Grid item>
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              setSelectHumanResources(item);
              setOpen(true);
            }}
          >
            <Edit style={{ color: '#fff' }} />
          </Fab>
        </Grid>
      </Grid>
    );
  };

  const customChildRows = (row, rootRows) => {
    const childRows = rootRows.filter(r => r.parentOrg === (row ? row.organizationUnit : null));
    return childRows.length ? childRows : null;
  };
  function DragColumn({ draggingEnabled, sortingEnabled, ...rest }) {
    if (rest.column.name === 'edit') return <TableHeaderRow.Cell {...rest} sortingEnabled={false} draggingEnabled={false} />;
    return <TableHeaderRow.Cell sortingEnabled draggingEnabled={draggingEnabled} {...rest} />;
  }
  return (
    <React.Fragment>
      <Paper>
        <Grid container spacing={16} style={{ paddingTop: 15 }}>
          {/* <Grid item xs={2}>
            <CustomInputBase select onChange={handleChangeType} value={localState.type} name="type" label="Thời gian">
              <MenuItem value={0}>Tháng</MenuItem>
              <MenuItem value={1}>Năm</MenuItem>
            </CustomInputBase>

          </Grid> */}
          {localState.type === 0 && (
            <React.Fragment>
              <Grid item xs={2}>
                {/* <CustomInputBase select label="Tháng" onChange={handleChange} name="month" value={filter.month}>
                  {months.map(it => (
                    <MenuItem value={it}>{`Tháng ${it}`}</MenuItem>
                  ))}
                </CustomInputBase> */}
                <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="vi-VN">
                  <Grid item style={{ textAlign: 'left', padding: '5px' }}>
                    <Grid item xs={12} container style={{position:'relative', width:'150px'}}>
                      <Grid item xs={8}>
                        <DatePicker
                          // disablePast
                          views={['year', 'month']}
                          // keyboard
                          variant="outlined"
                          // disableOpenOnEnter
                          style={{ zIndex: 0, width: '13.5rem' }}
                          // keyboardIcon={<i className="far fa-clock fa-xs" />}
                          label="Chọn tháng"
                          maxDate={new Date()}
                          value={months}
                          onChange={handleChangeMonth}
                          okLabel="Xác nhận"
                          cancelLabel="Hủy"
                          fullWidth
                          // InputProps={{
                          //   endAdornment: (
                          //     <IconButton  onClick={deleteDate}>
                          //       <ClearIcon />
                          //     </IconButton>
                          //   )
                          // }}
                        />
                      </Grid>
                      <Grid item xs={3} style={{position:'absolute', top:'4px', left:'163px'}}>
                        <IconButton  onClick={deleteDate}>
                            <ClearIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
              {/* <Grid item xs={2}>
                <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="vi-VN">
                  <Grid item style={{ textAlign: 'left', padding: '5px' }}>
                    <DatePicker
                      // disablePast
                      views={['year']}
                      // keyboard
                      variant="outlined"
                      // disableOpenOnEnter
                      style={{ zIndex: 0 }}
                      keyboardIcon={<i className="far fa-clock fa-xs" />}
                      label="Chọn năm"
                      maxDate={new Date()}
                      value={years}
                      onChange={handleChangeYears}
                      okLabel="Xác nhận"
                      cancelLabel="Hủy"
                      fullWidth
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid> */}
              {/* <Grid item xs={2}>
                <CustomInputBase select label="Năm" onChange={handleChange} name="year" value={filter.year}>
                  {years.map(it => (
                    <MenuItem value={it}>{it}</MenuItem>
                  ))}
                </CustomInputBase>
              </Grid> */}
            </React.Fragment>
          )}
          {/* {localState.type === 1 && (
            <Grid item xs={2}>
              <CustomInputBase select label="Năm" onChange={handleChange} name="year" value={filter.year}>
                {years.map(it => (
                  <MenuItem value={it}>{it}</MenuItem>
                ))}
              </CustomInputBase>
            </Grid>
          )} */}
        </Grid>
        {Array.isArray(fields) && fields.length > 1 ? (
          <GridDx rows={formatData(humanResource || [])} columns={fields.concat([{ name: 'edit', title: 'Hành động', checked: true }])}>
            <TreeDataState />
            <CustomTreeData getChildRows={customChildRows} />
            <Table columnExtensions={columnExtensions} />
            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
            <TableHeaderRow />
            <TableTreeColumn for="name" />
            <TableFixedColumns rightColumns={['edit']} />
          </GridDx>
        ) : null}
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseHumanResource} open={open} width={window.innerWidth - 260}>
        <div style={{ padding: 15 }}>
          <EditHumanResources
            selectHumanResources={selectHumanResources}
            humanResource={humanResource}
            roles={fields}
            onClose={handleCloseHumanResource}
            onSave={handleSave}
          />
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

const mapStateToProps = createStructuredSelector({
  humanResourcesPage: makeSelectHumanResourecePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    getHumanResource: body => dispatch(getHumanResource(body)),
    updateHumanResource: data => dispatch(updateHumanResource(data)),
    addHumanResource: data => dispatch(addHumanResource(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'humanResourecePage', reducer });
const withSaga = injectSaga({ key: 'humanResourecePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HumanResourcesPage);
