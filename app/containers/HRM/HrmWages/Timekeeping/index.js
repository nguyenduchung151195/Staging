/**
 *
 * TimekeepingPage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTimekeepingPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTimekeepings, updateCellData, getAllTimekeepType } from './actions';
import { Grid, Paper } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import TimekeepTable from './components/TimekeepTable';
import VerticalDepartmentTree from '../../../../components/Filter/VerticalDepartmentTree';
import makeSelectDashboardPage from '../../../Dashboard/selectors';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Fab } from '@material-ui/core';
import CustomIconButton from 'components/CustomButtons/IconButton';
/* eslint-disable react/prefer-stateless-function */
function Bt(props) {
  return (
    <Buttons
      // color={props.tab === tab ? 'gradient' : 'simple'}
      color={props.color}
      right
      round
      size="sm"
      onClick={props.onClick}
    >
      {props.children}
    </Buttons>
  );
}

function TimekeepingPage(props) {
  const {
    timekeepingPage,
    dashboardPage,
    tableId,
    onGetTimekeepingData,
    onSaveCellData,
    onGetAllTimekeepType,
    organizationUnitId,
    onClose,
    filter,
  } = props;
  const { timekeepingData, updateCellDataSuccess, timekeepTypes } = timekeepingPage;
  const { allDepartment, allSymbol } = dashboardPage;

  const [query, setQuery] = useState({
    tableId,
    hrmEmployeeId: null,
    organizationId: null,
  });
  const [expansive, setExpansive] = useState(true);
  const [widthColumn, setWidthColumn] = useState(300);

  function parseQuery(newQuery) {
    const { tableId, hrmEmployeeId, organizationId } = newQuery;
    const parsedQuery = {};
    if (tableId) parsedQuery.tableId = tableId;
    if (hrmEmployeeId) parsedQuery.hrmEmployeeId = hrmEmployeeId;
    if (organizationId) parsedQuery.organizationId = organizationId;
    return parsedQuery;
  }

  useEffect(
    () => {
      const newQuery = {
        ...query,
        tableId,
      };
      onGetTimekeepingData(parseQuery(newQuery));
      onGetAllTimekeepType();
    },
    [tableId],
  );

  useEffect(
    () => {
      const newQuery = {
        ...query,
        organizationId: organizationUnitId,
      };
      onGetTimekeepingData(parseQuery(newQuery));
    },
    [organizationUnitId],
  );

  const onClickExpansive = () => {
    if (expansive) {
      setExpansive(false);
      setWidthColumn(50);
    } else {
      setExpansive(true);
      setWidthColumn(300);
    }
  };

  const handleSelectDepart = useCallback(
    depart => {
      try {
        const { hrmEmployeeId, organizationId, ...rest } = query;
        const newQuery = {
          ...rest,
        };
        if (depart && depart._id) {
          if (depart.isHrm) {
            newQuery.hrmEmployeeId = depart._id;
          } else {
            newQuery.organizationId = depart._id;
          }
        }
        setQuery(newQuery);
        onGetTimekeepingData(parseQuery(newQuery));
      } catch (error) {
        console.log('errr', error);
      }
    },
    [query],
  );
  return (
    <>
      <Grid>
        <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%' }}>
          {props.hiddenSideBar === true ? null : expansive ? (
            <Grid item container style={{ width: `${widthColumn}px` }}>
              <Grid item container>
                <ArrowBackIcon color="primary" onClick={onClickExpansive} />
              </Grid>

              <VerticalDepartmentTree
                addUser={false}
                addHrm={true}
                departments={allDepartment}
                onChange={handleSelectDepart}
                departmentId={organizationUnitId}
              />
            </Grid>
          ) : (
            <Grid item container style={{ width: `${widthColumn}px` }}>
              <Grid item container className="ml-1">
                <ArrowForwardIcon color="primary" onClick={onClickExpansive} />
              </Grid>
            </Grid>
          )}

          <Grid item style={{ width: props.hiddenSideBar === true ? '100%' : `calc(100% - ${widthColumn}px)` }}>
            <TimekeepTable
              {...props}
              filterName={filter}
              onClose={onClose}
              timekeepTypes={timekeepTypes}
              data={timekeepingData}
              allSymbol={allSymbol}
              onSaveCellData={onSaveCellData}
              updateCellDataSuccess={updateCellDataSuccess}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

TimekeepingPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  timekeepingPage: makeSelectTimekeepingPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTimekeepingData: data => dispatch(getTimekeepings(data)),
    onSaveCellData: data => dispatch(updateCellData(data)),
    onGetAllTimekeepType: data => dispatch(getAllTimekeepType(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'timekeeping', reducer });
const withSaga = injectSaga({ key: 'timekeeping', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TimekeepingPage);
