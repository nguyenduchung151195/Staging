/**
 *
 * EmailSms
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { templateColumns, EmaiColumns, campaignEmailColums, campaignSmsColums } from 'variable';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import AddEmail from 'containers/AddEmail';
import AddEmailCampaign from 'containers/AddEmailCampaign';
import AddEmailHistory from 'containers/AddEmailHistory';
import AddSmsCampaign from 'containers/AddSmsCampaign';
import { Add } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import makeSelectEmailSms from './selectors';
import { Tabs, Tab, Paper, Grid, SwipeableDrawer } from '../../components/LifetekUi';
import reducer from './reducer';
import saga from './saga';
import { getTemplate, mergeData } from './actions';
import { API_TEMPLATE, API_SALE_POLICY, API_CAMPAIGN } from '../../config/urlConfig';
import { clientId } from '../../variable';
import makeSelectDashboardPage from '../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */

export class EmailSms extends React.Component {
  state = {
    tab: 0,
    tabIndex: 0,
    count: 0,
  };

  componentDidMount() {
    this.props.getTemplate();
  }

  handleTab = tabIndex => {
    this.setState({ tabIndex });
  };

  customFunctionSMS = item => {
    let newItem = [];
    newItem = item.filter(ele => ele.formType === 'sms').map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    return newItem;
  };

  customFunctionEmail = item => {
    let newItem = [];
    newItem = item.filter(ele => ele.formType === 'email').map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    this.setState({ count: newItem.length });
    return newItem;
  };

  addItem = () => <Add onClick={() => this.props.mergeData({ openDrawer: true, formType: 'sms', id: 'add' })}>Open Menu</Add>;

  addItem1 = id => (
    <Add style={{ color: 'none' }} onClick={() => this.props.mergeData({ openCampaign: true, id: 'add' })}>
      Open Menu
    </Add>
  );

  addItem2 = () => <Add onClick={() => this.props.mergeData({ openHistory: true, id: 'add' })}>Open Menu</Add>;

  addSms = () => <Add onClick={() => this.props.mergeData({ openSms: true, id: 'add' })}>Open Menu</Add>;

  mapFunctionCampaignEmail = (item, index) => ({
    ...item,
    index: index + 1,
    name: (
      <button onClick={() => this.handleDialogCampaignEmail(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
        {item.name}
      </button>
    ),
    senderName: item['senderName.name'],
    active: item.active === true ? 'Có' : 'Không',
  });

  handleDialogCampaignEmail = id => {
    this.props.mergeData({ openCampaign: true, id });
  };

  mapFunctionCampaignSms = item => ({
    ...item,
    name: (
      // eslint-disable-next-line react/button-has-type
      <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openSms: true, id: item._id })}>
        {item.name}
      </button>
    ),
  });

  // mapFunctionCampaignSms = (item, index) => ({
  //   ...item,
  //   index: index + 1,
  //   name: (
  //     <button onClick={() => this.handleDialogCampaignSms(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
  //       {item.name}
  //     </button>
  //   ),
  // });

  // handleDialogCampaignSms = id => {
  //   this.props.mergeData({ openSms: true, id });
  // };

  render() {
    const { tab, tabIndex, count } = this.state;
    const { emailSms, miniActive } = this.props;
    const { id, formType } = emailSms;
    const roles = this.props.dashboardPage.role.roles;
    const roleEmail = roles && roles.find(item => item.codeModleFunction === 'Email');
    const roleSms = roles && roles.find(item => item.codeModleFunction === 'SMS');
    const roleModuleEmail = roleEmail && roleEmail.methods ? roleEmail.methods : [];
    const roleModuleSMS = roleSms && roleSms.methods ? roleSms.methods : [];
    const Bt = props => (
      <Buttons
        onClick={() => this.handleTab(props.tabIndex)}
        {...props}
        color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </Buttons>
    );
    const columnExtensions = [{ columnName: 'index', width: 100 }, { columnName: 'edit', width: 150 }];
    return (
      <div>
        {/* <Paper> */}
        <div>
          <Helmet>
            <title>Email - Sms</title>
            <meta name="description" content="Description of TaskPage" />
          </Helmet>
          <Grid item md={12} spacing={4}>
            <Tabs
              value={tab}
              onChange={(event, value) => {
                this.setState({ tab: value });
              }}
            >
              {(roleModuleEmail.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? <Tab value={0} label="Email" /> : null}
              {(roleModuleSMS.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? <Tab value={1} label="SMS" /> : null}
            </Tabs>
          </Grid>

          {tab === 0 && (
            <div>
              <Grid container>
                <Grid item sm={12}>
                  <Bt tabIndex={-2}>Lịch sử Email</Bt>
                  <Bt tabIndex={-1}>Danh sách chiến dịch Email</Bt>
                  <Bt tabIndex={0}>Danh sách mẫu Email</Bt>
                </Grid>
              </Grid>
              {tabIndex === 0 ? (
                <Paper className="py-3" style={{ height: '100%' }}>
                  <ListPage
                    client
                    height="700px"
                    code="Email"
                    parentCode="setting"
                    apiUrl={API_TEMPLATE}
                    // columns={EmaiColumns}
                    newPaging
                    perPage={10}
                    count={count}
                    filter={{ clientId }}
                    customFunction={this.customFunctionEmail}
                    columnExtensions={columnExtensions}
                  />
                </Paper>
              ) : null}
              {tabIndex === -1 ? (
                <Paper className="py-3" style={{ height: '100%' }}>
                  <ListPage
                    // columns={campaignEmailColums}
                    // code="EmailCampaign"
                    height="700px"
                    code="Email"
                    parentCode="setting"
                    mapFunction={this.mapFunctionCampaignEmail}
                    apiUrl={API_CAMPAIGN}
                    settingBar={[this.addItem1('add')]}
                    disableAdd
                    columnExtensions={columnExtensions}
                    reload={emailSms.reload}
                    onEdit={row => {
                      // this.props.history.push({
                      //   pathname: `/setting/email/${row._id}`,
                      //   state: {
                      //     status: true,
                      //   },
                      // })
                      this.props.mergeData({ openCampaign: true, id: row._id });
                    }}
                  />

                  <SwipeableDrawer
                    anchor="right"
                    onClose={() => this.props.mergeData({ openCampaign: false, id: 'add' })}
                    open={this.props.emailSms.openCampaign}
                    width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
                  >
                    <div>
                      <AddEmailCampaign
                        miniActive={miniActive}
                        id={id}
                        callback={() => this.props.mergeData({ openCampaign: false, reload: emailSms.reload + 1 })}
                        // onCloseTab={() => this.props.mergeData({ openCampaign: false, reload: emailSms.reload + 1 })}
                        propsAll={this.props}
                      />
                    </div>
                  </SwipeableDrawer>
                </Paper>
              ) : null}
              {tabIndex === -2 ? (
                <Paper className="py-3" style={{ height: '100%' }}>
                  <ListPage height="700px" code="SalesPolicy" apiUrl={API_SALE_POLICY} settingBar={[this.addItem2()]} disableAdd mapfun />
                  <SwipeableDrawer
                    width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
                    anchor="right"
                    onClose={() => this.props.mergeData({ openHistory: false, id: 'add' })}
                    open={this.props.emailSms.openHistory}
                  >
                    <div style={{ width: window.innerWidth - 260 }}>
                      <AddEmailHistory id={id} onClose={() => this.props.mergeData({ openHistory: false, id: 'add' })}/>
                    </div>
                  </SwipeableDrawer>
                </Paper>
              ) : null}
            </div>
          )}
          {tab === 1 && (
            <div>
              <Grid container>
                <Grid item sm={12}>
                  <Bt tabIndex={-2}>Lịch sử sms</Bt>
                  <Bt tabIndex={-1}>Danh sách chiến dịch sms</Bt>
                  <Bt tabIndex={0}>Danh sách mẫu sms</Bt>
                </Grid>
              </Grid>
              {tabIndex === 0 ? (
                <Paper className="py-3" style={{ height: '100%' }}>
                  <ListPage
                    height="700px"
                    disableAdd
                    settingBar={[this.addItem()]}
                    code="SMS"
                    parentCode="setting"
                    // columns={templateColumns}
                    customFunction={this.customFunctionSMS}
                    client
                    filter={{ clientId }}
                    apiUrl={API_TEMPLATE}
                    reload={emailSms.reload}
                  />
                  <SwipeableDrawer
                    anchor="right"
                    onClose={() => this.props.mergeData({ openDrawer: false, id: 'add' })}
                    open={this.props.emailSms.openDrawer}
                    width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
                  >
                    <div style={{ width: window.innerWidth - 260 }}>
                      <AddEmail
                        onCloseTab={() => this.props.mergeData({ openDrawer: false, reload: emailSms.reload + 1 })}
                        id={id}
                        formType={formType}
                        callback={() => this.props.mergeData({ openDrawer: false, reload: emailSms.reload + 1 })}
                        propsAll={this.props}
                      />
                    </div>
                  </SwipeableDrawer>
                </Paper>
              ) : null}
              {tabIndex === -1 ? (
                <Paper className="py-3" style={{ height: '100%' }}>
                  <ListPage
                    apiUrl={API_CAMPAIGN}
                    disableAdd
                    height="700px"
                    settingBar={[this.addSms()]}
                    // columns={campaignSmsColums}
                    // code="SMSCampaign"
                    code="SMS"
                    parentCode="setting"
                    mapFunction={this.mapFunctionCampaignSms}
                    columnExtensions={columnExtensions}
                  />
                  <SwipeableDrawer
                    anchor="right"
                    onClose={() => this.props.mergeData({ openSms: false, id: 'add' })}
                    open={this.props.emailSms.openSms}
                    width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
                  >
                    <div style={{ width: window.innerWidth - 260 }}>
                      <AddSmsCampaign id={id} propsAll={this.props} onCloseAdd={() => this.props.mergeData({ openSms: false, id: 'add' })} />
                    </div>
                  </SwipeableDrawer>
                </Paper>
              ) : null}
            </div>
          )}
        </div>
        {/* </Paper> */}
      </div>
    );
  }
}

EmailSms.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
  emailSms: makeSelectEmailSms(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTemplate: () => dispatch(getTemplate()),
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'emailSms', reducer });
const withSaga = injectSaga({ key: 'emailSms', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(EmailSms);
