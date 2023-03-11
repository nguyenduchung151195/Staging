/**
 *
 * ConfigHrmPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';
import { Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@material-ui/core';
// import { Add } from '@material-ui/icons';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  addCategoryAction,
  fetchAllCategoryAction,
  getDefault,
  updateCategoryAction,
  fetchAllStatusAction,
  addStatusAction,
  addHRMStatusAction,
  deleteStatusAction,
  updateStatusIndexAction,
  updateStatusAction,
  mergeData,
  resetAllCategory,
  resetAllStatus,
  editHRMStatusAction,
  deleteHRMStatusAction,
  editHRMCategoryAction,
  deleteCategoryAction,
} from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectConfigHrmPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Paper } from 'components/LifetekUi';
import TabContainer from 'components/TabContainer';
import BusinessStatus from 'components/BusinessStatus/index';
import CategoryPage from 'components/CategoryPage';
import CustomerVerticalTabList from '../../components/CustomVerticalTabList';
import DialogCreateEdit from 'components/CustomDialog/DialogCreateEdit';
import ConfirmDialog from 'components/CustomDialog/ConfirmDialog';
import ConfigHrmTimekeepPage from 'containers/HRM/HrmConfig/ConfigHrmTimekeepPage/Loadable';
import ConfigSalaryPage from 'containers/HRM/HrmConfig/ConfigSalaryPage/Loadable';
import ConfigHrmSalaryCategory from 'containers/HRM/HrmConfig/HrmConfigSalaryCategory';
import ConfigRecruitmentPage from 'containers/HRM/HrmConfig/ConfigRecruitmentPage';

/* eslint-disable react/prefer-stateless-function */
export class ConfigHrmPage extends React.Component {
  state = {
    sourceTabIndex: 0,
    statusTabIndex: 0,
    openDialog: false,
    idChoose: '',
    newCategory: '',
    newStatus: '',
    code: '',
    openStatus: false,
    openCategory: false,
    deleteStatus: false,
    deleteCategory: false,
    returnStatus: false,
    returnCategory: false,
    isEdit: false,
  };

  componentDidMount() {
    this.props.GetHRMStatus();
    this.props.getCategory();
  }

  // function Status

  handleChange = (_, statusTabIndex) => this.setState({ statusTabIndex });

  handleChangeInputStatus = val => {
    this.setState({
      newStatus: val,
    });
  };

  handleOpenStatus = (item, isEdit) => {
    if (isEdit) {
      this.setState({
        openStatus: true,
        isEdit: isEdit,
        idChoose: item._id,
        newStatus: item.title,
      });
    } else {
      this.setState({
        openStatus: true,
        isEdit: isEdit,
        idChoose: '',
        newStatus: '',
      });
    }
  };

  handleCloseStatus = () => {
    this.setState({
      openStatus: false,
      isEdit: false,
      idChoose: '',
      newStatus: '',
    });
  };

  handleSubmitStatusAddEdit = () => {
    if (this.state.isEdit) {
      this.props.onEditHRMStatus(this.state.newStatus, this.state.idChoose);
    } else {
      this.props.onAddHRMStatus(this.state.newStatus);
    }
    this.handleCloseStatus();
  };

  handleOpenStatusDelete = item => {
    this.setState({
      deleteStatus: true,
      idChoose: item._id,
    });
  };

  handleCloseStatusDelete = () => {
    this.setState({
      deleteStatus: false,
      idChoose: '',
    });
  };

  handleSubmitStatusDelete = () => {
    this.props.onDeleteHRMStatus(this.state.idChoose);
    this.handleCloseStatusDelete();
  };

  handleOpenReturnStatus = () => {
    this.setState({
      returnStatus: true,
    });
  };

  handleOpenReturnCategory = () => {
    this.setState({
      returnCategory: true,
    });
  };

  handleSubmitStatusReturn = () => {
    this.props.onResetAllStatus();
    this.handleCloseReturnStatus();
  };

  // function Category

  handleChangeCategory = (_, sourceTabIndex) => this.setState({ sourceTabIndex });

  handleChangeInputCategory = val => {
    this.setState({
      newCategory: val,
    });
  };

  handleOpenCategory = (item, isEdit) => {
    if (isEdit) {
      this.setState({
        openCategory: true,
        isEdit: isEdit,
        idChoose: item._id,
        newCategory: item.title,
      });
    } else {
      this.setState({
        openCategory: true,
        isEdit: isEdit,
        idChoose: '',
        newCategory: '',
      });
    }
  };

  handleCloseCategory = () => {
    this.setState({
      openCategory: false,
      isEdit: false,
      idChoose: '',
      newCategory: '',
    });
  };

  handleSubmitCategoryAddEdit = () => {
    if (this.state.isEdit) {
      this.props.editHRMCategory(this.state.newCategory, this.state.idChoose);
    } else {
      this.props.addHRMCategory(this.state.newCategory);
    }
    this.handleCloseCategory();
  };

  handleOpenCategoryDelete = item => {
    this.setState({
      deleteCategory: true,
      idChoose: item._id,
    });
  };

  handleCloseCategoryDelete = () => {
    this.setState({
      deleteCategory: false,
      idChoose: '',
    });
  };

  handleSubmitCategoryDelete = () => {
    this.props.deleteHRMCategory(this.state.idChoose);
    this.handleCloseCategoryDelete();
  };

  handleCloseReturnStatus = () => {
    this.setState({
      returnStatus: false,
    });
  };

  handleCloseReturnCategory = () => {
    this.setState({
      returnCategory: false,
    });
  };

  handleSubmitCategoryReturn = () => {
    this.props.onResetAllCategory();
    this.handleCloseReturnCategory();
  };

  callBack = (cmd, data, param) => {
    switch (cmd) {
      case 'add-status':
        this.props.AddHRMStatusItem(data, param._id);
        break;
      case 'delete-status':
        this.props.DeleteHRMStatusIteme(data, param._id);
        break;
      case 'update-status':
        this.props.UpdateHRMStatus(data, param._id);
        break;
      case 'update-status-index':
        this.props.UpdateHRMStatusIndex(data, param._id);
        break;
      case 'update-source':
        this.props.updateCategory(data, param);
        break;
      default:
        break;
    }
  };

  render() {
    const { sourceTabIndex, statusTabIndex } = this.state;
    const { sources, listSt, tab } = this.props.configHrmPage;
    const { intl } = this.props;
    return (
      <div>
        <Helmet>
          <title>Config HRM</title>
          <meta name="description" content="Description of ConfigHrmPage" />
        </Helmet>
        <div>
          <Tabs value={tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
            <Tab value={0} label={intl.formatMessage(messages.statetype || { id: 'statetype' })} />
            <Tab value={1} label={intl.formatMessage(messages.categorytype || { id: 'categorytype' })} />
            <Tab value={2} label={intl.formatMessage(messages.configtimekeeping || { id: 'configtimekeeping' })} />
            <Tab value={3} label={intl.formatMessage(messages.salarylist || { id: 'salarylist' })} />
            <Tab value={4} label={intl.formatMessage(messages.configsalary || { id: 'configsalary' })} />
            <Tab value={5} label={'Cấu hình tuyển dụng'} />
          </Tabs>
          {tab === 0 ? (
            <div className="my-3">
              <Paper className="py-3" style={{ height: '100%' }}>
                <Grid container>
                  <Grid item container sm={6} md={4} xl={3}>
                    <Grid item>
                      <CustomerVerticalTabList
                        value={statusTabIndex}
                        data={listSt}
                        onChange={this.handleChange}
                        onChangeAdd={this.handleOpenStatus}
                        onChangeEdit={this.handleOpenStatus}
                        onChangeDelete={this.handleOpenStatusDelete}
                        onChangeUndo={this.handleOpenReturnStatus}
                      />
                    </Grid>
                  </Grid>
                  <Grid item sm={6} md={8} xl={9}>
                    {listSt.map((item, index) => {
                      let renderPaper;
                      if (statusTabIndex === index && listSt[index] !== undefined) {
                        renderPaper = (
                          <TabContainer>
                            <BusinessStatus callBack={this.callBack} data={listSt[index]} />
                          </TabContainer>
                        );
                      }
                      return renderPaper;
                    })}
                  </Grid>
                </Grid>
              </Paper>
            </div>
          ) : null}

          {tab === 1 ? (
            <Paper>
              <Grid container>
                <Grid item container sm={6} md={4} xl={3}>
                  <Grid item className="pl-4">
                    <CustomerVerticalTabList
                      value={sourceTabIndex}
                      data={sources}
                      onChange={this.handleChangeCategory}
                      onChangeAdd={this.handleOpenCategory}
                      onChangeEdit={this.handleOpenCategory}
                      onChangeDelete={this.handleOpenCategoryDelete}
                      onChangeUndo={this.handleOpenReturnCategory}
                    />
                  </Grid>
                </Grid>
                <Grid item sm={6} md={8} xl={9}>
                  {sources.map((item, index) => {
                    let renderPaper;
                    if (sourceTabIndex === index && sources[index] !== undefined) {
                      renderPaper = <CategoryPage onChangeSnackbar={this.props.onChangeSnackbar} callBack={this.callBack} data={sources[index]} />;
                    }
                    return renderPaper;
                  })}
                </Grid>
              </Grid>
            </Paper>
          ) : null}
          {tab === 2 ? <ConfigHrmTimekeepPage propsAll={this.props} /> : null}

          {tab === 3 && <ConfigHrmSalaryCategory />}
          {/* ----------- thêm mới/ sửa danh mục ------------------- */}
          {tab === 4 && <ConfigSalaryPage />}
          {
            this.state.openCategory && <DialogCreateEdit
              data={sources}
              onChangeSnackbar={this.props.onChangeSnackbar}
              openModal={this.state.openCategory}
              handleClose={this.handleCloseCategory}
              title="Danh mục"
              label="Tên cấu hình Danh mục"
              isEdit={this.state.isEdit}
              value={this.state.newCategory}
              onChangeInput={this.handleChangeInputCategory}
              handleAdd={this.handleSubmitCategoryAddEdit}
              handleEdit={this.handleSubmitCategoryAddEdit}
            // error = {this.state.newCategory}
            />
          }


          {tab === 5 && <ConfigRecruitmentPage />}

          {/* ---------------- thêm mới / chính sửa status ---------------- */}
          {
            this.state.openStatus && <DialogCreateEdit
              onChangeSnackbar={this.props.onChangeSnackbar}
              openModal={this.state.openStatus}
              handleClose={this.handleCloseStatus}
              title="Trạng thái"
              label="Tên cấu hình trạng thái"
              isEdit={this.state.isEdit}
              value={this.state.newStatus}
              onChangeInput={this.handleChangeInputStatus}
              handleAdd={this.handleSubmitStatusAddEdit}
              handleEdit={this.handleSubmitStatusAddEdit}
              data={listSt}
            />
          }


          {/* ---------------- kiểu trạng thái delete ----------------------  */}

          <ConfirmDialog
            open={this.state.deleteStatus}
            handleClose={this.handleCloseStatusDelete}
            description={'Bạn có chắc chắn xóa trạng thái này không?'}
            handleSave={this.handleSubmitStatusDelete}
          />

          {/* ---------------- kiểu danh mục delete ----------------------  */}

          <ConfirmDialog
            open={this.state.deleteCategory}
            handleClose={this.handleCloseCategoryDelete}
            description={'Bạn có chắc chắn xóa danh mục này không?'}
            handleSave={this.handleSubmitCategoryDelete}
          />

          {/* ------------------------------- hoàn tác trạng thái -------------------------------------- */}

          <ConfirmDialog
            open={this.state.returnStatus}
            handleClose={this.handleCloseReturnStatus}
            description={'Bạn có chắc chắn hoàn tác kiểu trạng thái không?'}
            handleSave={this.handleSubmitStatusReturn}
          />

          {/* ------------------------------- hoàn tác danh mục -------------------------------------- */}

          <ConfirmDialog
            open={this.state.returnCategory}
            handleClose={this.handleCloseReturnCategory}
            description={'Bạn có chắc chắn hoàn tác kiểu danh mục không?'}
            handleSave={this.handleSubmitCategoryReturn}
          />
        </div>
      </div>
    );
  }
}

ConfigHrmPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  configHrmPage: makeSelectConfigHrmPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,

    // Status

    GetHRMStatus: () => {
      dispatch(fetchAllStatusAction());
    },
    AddHRMStatusItem: (data, id) => {
      dispatch(addStatusAction(data, id));
    },
    onAddHRMStatus: title => {
      dispatch(addHRMStatusAction(title));
    },
    DeleteHRMStatusIteme: (statusId, id) => {
      dispatch(deleteStatusAction(statusId, id));
    },
    UpdateHRMStatus: (data, id) => {
      dispatch(updateStatusAction(data, id));
    },
    UpdateHRMStatusIndex: (data, id) => {
      dispatch(updateStatusIndexAction(data, id));
    },
    onResetAllStatus: () => dispatch(resetAllStatus()),
    onEditHRMStatus: (title, id) => {
      dispatch(editHRMStatusAction(title, id));
    },
    onDeleteHRMStatus: id => {
      dispatch(deleteHRMStatusAction(id));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },

    // Category

    getCategory: () => {
      dispatch(fetchAllCategoryAction());
    },
    addHRMCategory: (title, code) => {
      dispatch(addCategoryAction(title, code));
    },
    updateCategory: (newData, param) => {
      dispatch(updateCategoryAction(newData, param));
    },
    mergeData: data => dispatch(mergeData(data)),
    getDefault: () => {
      dispatch(getDefault());
    },
    editHRMCategory: (title, id) => {
      dispatch(editHRMCategoryAction(title, id));
    },
    deleteHRMCategory: id => {
      dispatch(deleteCategoryAction(id));
    },
    onResetAllCategory: () => dispatch(resetAllCategory()),

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'configHrmPage', reducer });
const withSaga = injectSaga({ key: 'configHrmPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(ConfigHrmPage);
