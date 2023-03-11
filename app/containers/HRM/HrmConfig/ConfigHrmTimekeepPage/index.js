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
import { Fab, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Button } from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';
import {
  mergeData,
  getAllHoliday,
  getAllSymbol,
  getAllTimekeepType,
  getAllConfigTimekeeping,
  addHoliday,
  addSymbol,
  addTimekeepType,
  addConfigTimekeeping,
  updateHoliday,
  deleteHoliday,
  deleteTimekeepType,
  deleteConfigTimekeeping,
  deleteSymbol,
  updateSymbol,
  updateTimekeepType,
  updateConfigTimekeeping,
  getAllShift,
  updateShift,
  addShift,
  deleteShift,
} from './actions';
import makeSelectConfigHrmTimekeep from './selectors';
import HolidaysPage from './components/HolidaysPage/Loadable';
import SymbolPage from './components/SymbolPage/Loadable';
import TimekeepingTypePage from './components/TimekeepingTypePage/Loadable';
import { changeSnackbar } from 'containers/Dashboard/actions';
import ConfigTimekeeping from './components/ConfigTimekeeping/Loadable';
import ConfigShiftPage from './components/ConfigShiftPage/Loadable';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';
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
    this.props.getAllShift();
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

  handleConfigTimekeepingSave = data => {
    if (data._id) {
      this.props.updateConfigTimekeeping(data);
    } else {
      this.props.addConfigTimekeeping(data);
    }
  };

  handleConfigShiftSave = data => {
    if (data._id) {
      this.props.updateShift(data);
    } else {
      this.props.addShift(data);
    }
  };

  render() {
    const { tab, tabIndex } = this.state;
    const { profile } = this.props;
    const { configHrmTimekeepPage, deleteSymbol, deleteTimekeepType, deleteHoliday, deleteConfigTimekeeping, deleteShift } = this.props;
    const {
      holidays,
      symbols,
      timekeepTypes,
      configTimekeeping,
      shifts,
      addShiftSuccess,
      updateShiftSuccess,
      deleteShiftSuccess,
      reload,
    } = configHrmTimekeepPage;
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
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={0} label="Cấu hình ký hiệu chấm công" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={1} label="Cấu hình loại chấm công" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={2} label="Cấu hình ngày nghỉ lễ" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={4} label="Cấu hình máy chấm công" />
                <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} value={5} label="Cấu hình ca làm việc" />
              </VerticalTabs>
            </Grid>
            <Grid item xs={10} xl={10} md={10}>
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
              {tab === 4 && (
                <ConfigTimekeeping
                  miniActive={this.props.miniActive}
                  profile={this.props.profile}
                  data={configTimekeeping}
                  reload={reload}
                  onChangeSnackBar={this.props.onChangeSnackbar}
                  onSave={this.handleConfigTimekeepingSave}
                  onDelete={deleteConfigTimekeeping}
                />
              )}
              {tab === 5 && (
                <ConfigShiftPage
                  shifts={shifts}
                  onSave={this.handleConfigShiftSave}
                  onDelete={deleteShift}
                  addShiftSuccess={addShiftSuccess}
                  updateShiftSuccess={updateShiftSuccess}
                  deleteShiftSuccess={deleteShiftSuccess}
                  symbols={symbols}
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
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
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
    getAllConfigTimekeeping: () => {
      dispatch(getAllConfigTimekeeping());
    },
    getAllSymbol: () => {
      dispatch(getAllSymbol());
    },
    getAllShift: () => dispatch(getAllShift()),

    // add
    addHoliday: data => {
      dispatch(addHoliday(data));
    },
    addTimekeepType: data => {
      dispatch(addTimekeepType(data));
    },
    addConfigTimekeeping: data => {
      dispatch(addConfigTimekeeping(data));
    },
    addSymbol: data => {
      dispatch(addSymbol(data));
    },
    addShift: data => dispatch(addShift(data)),
    // update
    updateHoliday: (_id, data) => {
      dispatch(updateHoliday(_id, data));
    },
    updateTimekeepType: data => {
      dispatch(updateTimekeepType(data));
    },
    updateConfigTimekeeping: data => {
      dispatch(updateConfigTimekeeping(data));
    },
    updateSymbol: data => {
      dispatch(updateSymbol(data));
    },
    updateShift: data => {
      dispatch(updateShift(data));
    },
    // delete
    deleteHoliday: _id => {
      dispatch(deleteHoliday(_id));
    },
    deleteTimekeepType: data => {
      dispatch(deleteTimekeepType(data));
    },
    deleteConfigTimekeeping: data => {
      dispatch(deleteConfigTimekeeping(data));
    },
    deleteSymbol: data => {
      dispatch(deleteSymbol(data));
    },
    deleteShift: _id => dispatch(deleteShift(_id)),

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
