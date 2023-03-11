/**
 *
 * CrmCollection
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
// import GridContainer from 'components/Grid/GridContainer';
// import GridItem from 'components/Grid/ItemGrid';
// import RegularCard from '../../components/Cards/RegularCard';
import { withStyles, AppBar, Tabs, Tab, Fab } from '@material-ui/core';
import { Link, Route, Switch } from 'react-router-dom';
// import messages from './messages';
import { Add } from '@material-ui/icons';
import saga from './saga';
import reducer from './reducer';
import makeSelectCrmCollection from './selectors';
import makeSelectDashboardPage from 'containers/Dashboard/selectors';
// import Kanban from '../../components/Kanban';
// import Calendar from '../../components/Calendar';
// import Report from '../../components/Report/TradingReport';
// import Automation from '../../components/Automation';

import styles from './styles';
import { getAllCollection } from './actions';
import messages from './messages';
import { injectIntl } from 'react-intl';
import ContractsPage from '../ContractPage/Loadable';
import BusinessOpportunities from '../BusinessOpportunitiesPage/Loadable';
import Customer from '../CustomersPage/Loadable';
// import Workflow from '../WorkFlowPage';
import SalesPolicyPage from '../SalesPolicyPage/Loadable';
import CRMConfig from '../CrmConfigPage';
import SuppliersPage from '../SuppliersPage';
import CloneModule from '../CloneModuleComponent';
import BillsPage from '../BillsPage/Loadable';
import ExpensesPage from '../ExpensesPage/Loadable';
import SalesQuotations from '../SalesQuotations/Loadable';
import Trading from '../TradingPage/Loadable';
import ImportItemsPage from '../ImportItemsPage/Loadable';
import Documentary from '../DispatchManager/Loadable';
// import ImportProduct from '../ImportProduct';

const routeFake = [
  {
    name: 'businessopportunities',
    code: 'BusinessOpportunities',
    component: BusinessOpportunities,
    isDisplay: true,
  },
  {
    name: 'exchangeofagreement',
    code: 'ExchangingAgreement',
    component: Trading,
    isDisplay: true,
  },
  {
    name: 'costestimates',
    code: 'CostEstimate',
    component: ExpensesPage,
    isDisplay: true,
  },

  {
    name: 'salesquotation',
    code: 'SalesQuotation',
    component: SalesQuotations,
    isDisplay: true,
  },
  {
    name: 'contract',
    code: 'Contract',
    component: ContractsPage,
    isDisplay: true,
  },
  {
    name: 'bill',
    code: 'Bill',
    component: BillsPage,
    isDisplay: true,
  },
  {
    // name: 'purchase',
    name: "Đặt hàng(PO)",
    code: 'OrderPo',
    component: ImportItemsPage,
    isDisplay: true,
  },
];
// routes cho các màn hình không hiển thị trên menu ngang (add, edit, menu left)
const hiddenRoutes = [
  {
    name: 'Khách hàng',
    code: 'Customer',
    component: Customer,
    isDisplay: false,
  },
  {
    name: 'Nhà cung cấp',
    code: 'Supplier',
    component: SuppliersPage,
    isDisplay: false,
  },
  {
    name: 'Chính sách bán hàng',
    code: 'SalesPolicy',
    component: SalesPolicyPage,
    isDisplay: false,
  },
  {
    name: 'Cấu hình CRM',
    code: 'configCRM',
    component: CRMConfig,
    isDisplay: true,
  },
];
class CrmCollection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: {
        name: 'businessopportunities',
        code: 'BusinessOpportunities',
      },
      pathname: '',
    };
  }

  componentDidMount() {
    this.props.getCollection();
    const code = window.location.pathname.split('/')[2];
    const collection = [...routeFake, ...hiddenRoutes];
    const current = collection.find(item => item.code === code);

    this.setState({ current });
  }
  componentDidUpdate() {
    if (window.location.pathname !== this.state.pathname) this.setState({ pathname: window.location.pathname });
  }
  componentWillReceiveProps(props) {
    const { crmCollection } = props;
    const listCloneModule = crmCollection.allCRMCollection || [];
    const collection = [...routeFake, ...hiddenRoutes, ...listCloneModule];

    if (!window.location.pathname.includes('module')) {
      const code = window.location.pathname.replace('/crm/', '');

      let newTab = collection.find(item => item.code === code);
      if (!newTab) {
        collection.forEach(item => {
          if (code.includes(item.code)) {
            newTab = item;
          }
        });
      }
      this.state.current = newTab;
    } else {
      const code = window.location.pathname.replace('/crm/module/', '');

      const newTab = collection.find(item => item.code === code);

      this.state.current = newTab;
    }
  }

  handleOnClickSelectCRM = code => {
    const { crmCollection } = this.props;
    const collection = [...crmCollection.allCRMCollection, ...routeFake];
    const current = collection.find(item => item.code === code);
    if (crmCollection.allCRMCollection.find(item => item.code === code)) {
      this.props.history.push(`/crm/module/${code}`);
    } else {
      this.props.history.push(`/crm/${code}`);
    }
    this.setState({ current });
  };
  handleFilter(arr, ...rest) {
    return arr
      .filter(item => {
        if (rest[0].includes(item.code)) {
          return true;
        }
        return false;
      })
      .map(item => (
        <Tab
          key={item.code}
          className={rest[1].tabRoot}
          value={item.code}
          onClick={() => this.handleOnClickSelectCRM(item.code)}
          label={this.props.intl.formatMessage(messages[item.name] || { id: item.name })}
        />
      ));
  }

  render() {
    // const { tab, size, defaultColor, color, current, anchorEl } = this.state;
    const { role } = this.props.dashboardPage;
    const codeModleFunctionAllowForFunction = [];
    if (role.roles) {
      role.roles.forEach(item => {
        if (item.methods.find(method => method.name === 'GET').allow) {
          codeModleFunctionAllowForFunction.push(item.codeModleFunction);
        }
      });
    }
    const { current, pathname } = this.state;
    const collection = this.props.crmCollection.allCRMCollection || [];
    // );
    const { classes, intl } = this.props;
    const routeFakeNoHidden = ['/crm/BusinessOpportunities', '/crm/ExchangingAgreement', '/crm/CostEstimate', '/crm/SalesQuotation', '/crm/Contract', '/crm/Bill', '/crm/OrderPo']
    return (
      <div>
        <Helmet>
          <title>CRM</title>
        </Helmet>
        {
          // pathname === '/crm/BusinessOpportunities'
          routeFakeNoHidden.includes(pathname)
            ? (
              <AppBar style={{ zIndex: 100, boxShadow: 'none' }} position="relative" color="#fff">
                <Tabs
                  style={{ width: '95%', marginLeft: '-56px' }}
                  value={current && current.code}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  // textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {this.handleFilter(routeFake, codeModleFunctionAllowForFunction, classes)}
                  {this.handleFilter(collection, codeModleFunctionAllowForFunction, classes)}
                </Tabs>
              </AppBar>
            ) : (
              ''
            )}
        <div style={{ backgroundColor: 'white' }}>
          <Switch>
            {routeFake.map(item => (
              <Route key={item.code} exact path={`/crm/${item.code}`} component={item.component} />
            ))}
            {hiddenRoutes.map(item => (
              <Route key={item.code} exact path={`/crm/${item.code}`} component={item.component} />
            ))}

            {collection.map(item => (
              <Route key={item.code} exact path="/crm/module/:collectionCode" component={CloneModule} />
            ))}
            <Route exact path="/crm/ExchangingAgreement/:id" component={Trading} />
            <Route exact path="/crm/BusinessOpportunities/:id" component={BusinessOpportunities} />
            <Route exact path="/Documentary/inComingDocument/:id" component={Documentary} />
            <Route exact path="/Documentary/outGoingDocument/:id" component={Documentary} />
          </Switch>
        </div>
      </div>
    );
  }
}

CrmCollection.propTypes = {
  //   dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  crmCollection: makeSelectCrmCollection(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
    getCollection: () => {
      dispatch(getAllCollection());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'crmCollection', reducer });
const withSaga = injectSaga({ key: 'crmCollection', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(CrmCollection);
