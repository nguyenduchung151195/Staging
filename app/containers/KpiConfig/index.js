/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unused-prop-types */
/**
 *
 * KpiConfig
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
// import {  List, ListItem,  } from '@material-ui/core';
// import { Add } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { kpiConfigColumns } from 'variable';
import ListPage from 'components/List';
import makeSelectKpiConfig from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_CRITERIA } from '../../config/urlConfig';
import { mergeData } from './actions';
import { Tabs, Tab, Paper } from '../../components/LifetekUi';

import makeSelectDashboardPage from '../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */

export class KpiConfig extends React.Component {
  render() {
    const { kpiConfig, intl } = this.props;
    const roles = this.props.dashboardPage.role.roles;
    console.log('aaaa', roles);
    const roleKpiConfig = roles.find(item => item.codeModleFunction === 'Kpi');
    console.log('roleKpiConfig', roleKpiConfig);
    return (
      <div>
        <Tabs value={kpiConfig.tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
          <Tab value={0} label={intl.formatMessage(messages.configkpi || { id: 'configkpi' })} />
          {/* <Tab value={1} label={intl.formatMessage(messages.configkanban || { id: 'configkanban' })} /> */}
        </Tabs>
        {kpiConfig.tab === 0 ? (
          <div>
            <Paper className="py-3" style={{ height: '100%' }}>
              <ListPage apiUrl={`${API_CRITERIA}/config`} mapFunction={this.mapFunction} client columns={kpiConfigColumns} code="Kpi" />
            </Paper>
          </div>
        ) : null}
        {/* {kpiConfig.tab === 1 ? alert('Bạn không có quyền truy cập chức năng này') : null} */}
      </div>
    );
  }
}

KpiConfig.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kpiConfig: makeSelectKpiConfig(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kpiConfig', reducer });
const withSaga = injectSaga({ key: 'kpiConfig', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(KpiConfig);
