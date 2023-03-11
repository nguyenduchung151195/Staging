/**
 *
 * ImportProduct
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import HOCTable from '../HocTable';
import makeSelectBillsPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getOrderAct } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
// import messages from './messages';

const ProductColumn = props => {
  const { products } = props.item;
  if (products) {
    return products.map(item => item.name).join();
  }
  return <div />;
};
const PaidListColumn = props => {
  const { paidList } = props.item;
  if (paidList) {
    return paidList.map(item => item.payMethod).join();
  }
  return <div />;
};
const SupplierColumn = props => {
  const { supplier } = props.item;
  if (supplier) {
    return supplier.name;
  }
  return <div />;
};
const FinishedColumn = props => {
  const { isFinished } = props.item;
  if (isFinished) {
    return 'Đã hoàn thành';
  }
  return 'Chưa hoàn thành';
};
const TypeColumn = props => {
  const { type } = props.item;
  switch (type) {
    case 0:
      return 'Đơn đặt hàng';
    case 1:
      return 'Đặt hàng PO';
    case 2:
      return 'Trả hàng';
    case 3:
      return 'Nhập hàng';
    case 4:
      return 'Chuyển kho';

    default:
      break;
  }
};

/* eslint-disable react/prefer-stateless-function */
export class ImportProduct extends React.Component {
  state = {};

  componentDidMount() {
    this.props.onGetOrder();
  }

  handleAddClick = () => {
    this.props.history.push(`/crm/OrderPo/add`);
  };

  // handleEdiClick = props => {
  //   this.props.history.push(`/crm/OrderPo/${props._id}`);
  // };

  handleDeleteClick = props => {
    const { orders } = this.state;
    const ids = [];
    props.forEach(index => {
      ids.push(orders[index]._id);
    });
    // this.setState({ idDelete: ids, onDelete: true });
    // this.props.onDeleteContract({ ids });
  };

  render() {
    const { orders } = this.props.importProduct;
    const Bt = props => (
      <CustomButton color="gradient" right round size="sm">
        {props.children}
      </CustomButton>
    );
    return (
      <div>
        {this.props.importProduct.loading ? <LoadingIndicator /> : null}
        <Grid container>
          <Grid item sm="12">
            <Bt tab={0}>Danh sách</Bt>
          </Grid>
          <Grid item sm="12">
            <HOCTable
              enablePaging={false}
              onRef={ref => (this.HOCTable = ref)}
              handleEditClick={this.handleEdiClick}
              handleAddClick={this.handleAddClick}
              handleDeleteClick={this.handleDeleteClick}
              customColumns={[
                {
                  columnName: 'paidList',
                  CustomComponent: PaidListColumn,
                },
                {
                  columnName: 'supplier.name',
                  CustomComponent: SupplierColumn,
                },
                {
                  columnName: 'products',
                  CustomComponent: ProductColumn,
                },
                {
                  columnName: 'isFinished',
                  CustomComponent: FinishedColumn,
                },
                {
                  columnName: 'type',
                  CustomComponent: TypeColumn,
                },
              ]}
              path="/crm/Order"
              collectionCode="Order"
              data={orders}
              enableDelete={false}
              enableApproved
            />
          </Grid>
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }
}

ImportProduct.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  importProduct: makeSelectBillsPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetOrder: () => {
      dispatch(getOrderAct());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'importProduct', reducer });
const withSaga = injectSaga({ key: 'importProduct', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ImportProduct);
