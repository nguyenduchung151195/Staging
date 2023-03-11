/**
 *
 * ConfigHrmTimekeepPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { VerticalTab, VerticalTabs, Paper } from 'components/LifetekUi';
import { Grid } from '@material-ui/core';
import {
  mergeData,
  getAllHoliday,
  getAllSymbol,
  getAllTimekeepType,
  addHoliday,
  addSymbol,
  addTimekeepType,
  updateHoliday,
  deleteHoliday,
  deleteTimekeepType,
  deleteSymbol,
  updateSymbol,
  updateTimekeepType,
} from './actions';
import makeSelectConfigHrmTimekeep from './selectors';
import HolidaysPage from './../HolidaysPage/Loadable';
import SymbolPage from './../SymbolPage/Loadable';
import TimekeepingTypePage from './../TimekeepingTypePage/Loadable';
import { changeSnackbar } from '../../../Dashboard/actions';
import HrmConfigSalaryFormula from 'containers/HRM/HrmConfig/ConfigSalaryPage/components/HrmConfigSalaryFormula';
/* eslint-disable react/prefer-stateless-function */

export class ConfigHrmTimekeepPage extends React.Component {
  state = {
    tab: 0,
    tabIndex: 0,
  };

  componentDidMount() {
    this.props.getAllHoliday();
    this.props.getAllTimekeepType();
    this.props.getAllSymbol();
  }

  handleHolidaySave = data => {
    if (data._id) {
      this.props.updateHoliday(data);
    } else {
      this.props.addHoliday(data);
    }
  };

  handleSymboldSave = data => {
    if (data._id) {
      this.props.updateSymbol(data);
    } else {
      this.props.addSymbol(data);
    }
  };

  handleTimekeepingTypeSave = data => {
    if (data._id) {
      this.props.updateTimekeepType(data);
    } else {
      this.props.addTimekeepType(data);
    }
  };

  render() {
    const { tab, tabIndex } = this.state;
    const { configHrmTimekeepPage, deleteSymbol, deleteTimekeepType, deleteHoliday } = this.props;
    const { holidays, symbols, timekeepTypes } = configHrmTimekeepPage;
    console.log('tab', tab)
    return (
      <div>
        <Helmet>
          <title>Config HRM</title>
          <meta name="description" content="Description of ConfigHrmTimekeepPage" />
        </Helmet>
        <Paper>
          <Grid container>
            <Grid item xs={2}>
              <VerticalTabs style={{ display: 'inline-block' }} value={tab} onChange={(e, tab) => this.setState({ tab })}>
                <VerticalTab value={0} label="Cấu hình ký hiệu chấm công" />
                <VerticalTab value={1} label="Cấu hình loại chấm công" />
                <VerticalTab value={2} label="Cấu hình ngày nghỉ lễ" />
                <VerticalTab value={3} label="Công thức lương" />
              </VerticalTabs>
            </Grid>
            <Grid item xs={10}>
              {tab === 0 && (
                <SymbolPage
                  data={symbols}
                  holidays={holidays}
                  timekeepTypes={timekeepTypes}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onSave={this.handleSymboldSave}
                  onDelete={deleteSymbol}
                />
              )}

              {tab === 1 && (
                <TimekeepingTypePage
                  data={timekeepTypes}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onSave={this.handleTimekeepingTypeSave}
                  onDelete={deleteTimekeepType}
                />
              )}
              {tab === 2 && (
                <HolidaysPage
                  data={holidays}
                  onSave={this.handleHolidaySave}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onDelete={deleteHoliday}
                />
              )}
              {tab === 3 && (
                <HrmConfigSalaryFormula
                // data={holidays}
                // onSave={this.handleHolidaySave}
                // onChangeSnackBar={this.props.onChangeSnackbar}
                // onDelete={deleteHoliday}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ConfigHrmTimekeepPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  configHrmTimekeepPage: makeSelectConfigHrmTimekeep(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => {
      dispatch(mergeData(data));
    },
    getAllHoliday: () => {
      dispatch(getAllHoliday());
    },
    getAllTimekeepType: () => {
      dispatch(getAllTimekeepType());
    },
    getAllSymbol: () => {
      dispatch(getAllSymbol());
    },
    // add
    addHoliday: data => {
      dispatch(addHoliday(data));
    },
    addTimekeepType: data => {
      dispatch(addTimekeepType(data));
    },
    addSymbol: data => {
      dispatch(addSymbol(data));
    },
    // update
    updateHoliday: (_id, data) => {
      dispatch(updateHoliday(_id, data));
    },
    updateTimekeepType: data => {
      dispatch(updateTimekeepType(data));
    },
    updateSymbol: data => {
      dispatch(updateSymbol(data));
    },
    // delete
    deleteHoliday: _id => {
      dispatch(deleteHoliday(_id));
    },
    deleteTimekeepType: data => {
      dispatch(deleteTimekeepType(data));
    },
    deleteSymbol: data => {
      dispatch(deleteSymbol(data));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'configHrmTimekeep', reducer });
const withSaga = injectSaga({ key: 'configHrmTimekeep', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ConfigHrmTimekeepPage);
