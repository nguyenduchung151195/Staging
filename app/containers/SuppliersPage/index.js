/**
 *
 * SuppliersPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Avatar, Drawer } from '@material-ui/core';
import SupplierDetail from 'containers/SupplierDetail';
import { API_SUPPLIERS } from '../../config/urlConfig';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSuppliersPage from './selectors';
import { Paper } from '../../components/LifetekUi';
import { mergeData } from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectProfile, makeSelectMiniActive } from 'containers/Dashboard/selectors';

import avatarDefault from '../../images/default-avatar.png';
import List from '../../components/List';
import moment from "moment"
class SuppliersPage extends React.Component {
  toggleDrawer = () => {
    const { openDrawer } = this.props.suppliersPage;
    this.props.mergeData({ openDrawer: !openDrawer });
  };

  mapFunction = item => ({

    ...item,
    createdAtSupplier: item.createdAtSupplier && moment(item.createdAtSupplier).format("DD/MM/yyyy"),
    // representativeBirthDate: item.representativeBirthDate && moment(item.representativeBirthDate).format("DD/MM/YYYY"),
    logo: <Avatar src={item.logo ? `${item.logo}?allowDefault=true` : avatarDefault} />,
    name: (
      // eslint-disable-next-line react/button-has-type
      <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawer: true, suppliers: item })}>
        {item.name}
      </button>
    ),
    representativeGender: item.representativeGender === 'male' ? 'Nam' : item.representativeGender === 'female' ? 'Nữ' : 'Không xác định',
    classifySupplier: item['classifySupplier.companyType'] === 0 ? 'Cổ phần' : item['classifySupplier.companyType'] === 1 ? 'TNHH' : '',
  }
  );

  render() {
    const { suppliersPage } = this.props;
    const { openDrawer } = suppliersPage;
    return (
      <div>
        <Helmet>
          <title>Supplier</title>
          <meta name="description" content="Description of SuppliersPage" />
        </Helmet>
        <Paper className="py-3" style={{ height: '100%', marginTop: 30 }}>
          <List
            height="615px"
            exportExcel
            apiUrl={API_SUPPLIERS}
            showDepartmentAndEmployeeFilter
            withPagination
            code="Supplier"
            mapFunction={this.mapFunction}
            importExport="Supplier"
          />
        </Paper>
        <Drawer anchor="right" open={openDrawer} onClose={this.toggleDrawer} style={{ width: 700 }}>
          <div style={{ width: 700, marginTop: 80 }}>
            <SupplierDetail onClose={this.toggleDrawer} suppliers={suppliersPage.suppliers} />
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  suppliersPage: makeSelectSuppliersPage(),
  miniActive: makeSelectMiniActive(),
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

const withReducer = injectReducer({ key: 'suppliersPage', reducer });
const withSaga = injectSaga({ key: 'suppliersPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SuppliersPage);
