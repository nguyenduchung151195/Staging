/* eslint-disable react/no-this-in-sfc */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * SalesQuotations
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import dot from 'dot-object';
import { Grid, LinearProgress, Menu, MenuItem, IconButton, Toolbar, AppBar, SwipeableDrawer } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import CustomButton from 'components/CustomButtons/Button';
import { API_SALE } from 'config/urlConfig';
import Kanban from '../KanbanPlugin';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import AddExportStockPage from 'containers/AddExportStockPage';
import AddSalesQuotation from 'containers/AddSalesQuotation';
import AddContractPage from 'containers/AddContractPage';
import AddDeliveryPage from 'containers/AddDeliveryPage';
import AddImportProduct from 'containers/AddImportProduct';
import { Dialog, SwipeableDrawer as Drawer } from '../../components/LifetekUi';
import makeSelectSalesQuotations from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getSales, handleChange, getData } from './actions';
import ListPage from '../../components/List';
import messages from './messages';
import { convert2Money } from '../../helper';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
/* eslint-disable react/prefer-stateless-function */
let branchesCustomer = [];
const crmSourceData = JSON.parse(localStorage.getItem('crmSource'));
if (crmSourceData && crmSourceData.find(item => item.code === 'pckh')) {
  branchesCustomer = crmSourceData.find(item => item.code === 'pckh').data;
}
const contactMethod = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S06')) || { data: [] }
).data;
const groupCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S07')) || { data: [] }
).data;
export class SalesQuotations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      kanbanFilter: {},
      kanbanData: {},
      openKanbanDialog: false,
    };
  }

  ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }} className="kanban" onClick={() => this.handleOpenSales(data._id)}>
        {data.code}
      </p>
      <p className="kanban-planner">
        Khách hàng: <b> {data.customer ? data.customer.name : ''}</b>
      </p>
      <p className="kanban-planner">
        Tổng tiền: <b>{convert2Money(data.totalAmount)} VNĐ</b>
      </p>
    </div>
  );

  componentDidMount() {
    this.props.getSales();
    this.props.getData();
  }

  mapFunction = item => {
    const { businessData, exchangingData } = this.props.salesQuotations;
    const newBusiness = businessData.data ? businessData.data.find(elm => elm._id === item.businessOpportunities) : '';
    const newExchanging = exchangingData.data ? exchangingData.data.find(elm => elm._id === item.exchangingAgreement) : '';
    const branches = branchesCustomer ? branchesCustomer.find(elm => elm.value === item['customer.customerLevel']) : '';
    const contactMethods = contactMethod ? contactMethod.find(elm => elm.value === item.originItem.customer.contactWays[0]) : '';
    const group = groupCustomer.find(elm => elm.value === item['customer.group']);
    return {
      ...item,
      status: item.status === 1 ? <LinearProgress variant="determinate" value={50} /> : 'Không xác định',
      customer: item.customer ? item.customer.name : '',
      businessOpportunities: newBusiness ? newBusiness.name : '',
      exchangingAgreement: newExchanging ? newExchanging.name : '',
      'customer.customerLevel': branches ? branches.title : '',
      // paymentAmount: paymentTotal,
      // eslint-disable-next-line eqeqeq
      typeOfSalesQuotation: item.typeOfSalesQuotation == 1 ? <p>Bán hàng</p> : item.typeOfSalesQuotation == 2 ? 'Báo giá' : 'Đăt hàng',
      template: item.templateName ? item.templateName : null,
      salePoint: item.salePointName ? item.salePointName : null,
      'customer.customerId': item.customerCode ? item.customerCode : null,
      'salesman.employeeId': item.salesmanCode ? item.salesmanCode : null,
      'customer.contactWays': contactMethods ? contactMethods.title : '',
      'customer.group': group ? group.title : '',
    };
  };

  customColumns(items) {
    return items.concat([
      {
        name: 'po',
        title: 'Đơn hàng PO',
      },
    ]);
  }

  handleClick = (id, itemSales, e) => {
    this.setState({ anchorEl: e.currentTarget });
    this.props.mergeData({ printId: id, itemSales });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleOpenPO = () => _e => {
    this.props.mergeData({ openDrawerPO: true });
  };
  // handleOpenPO = () => {
  //   this.props.history.push('/crm/OrderPo/add');
  // };

  handleOpenSales = id => {
    this.props.mergeData({ addDialog: true, id });
  };

  callBack = (cmd, data) => {
    if (cmd === 'kanban-dragndrop-sale') {
      this.props.getSales(data);
      return;
    }
    if (cmd === 'CommentDialog') {
      this.setState({ openKanbanDialog: true, kanbanData: data });
      return;
    }
  };

  render() {
    const {
      OriginItem,
      tab,
      openDrawerStock,
      id,
      openDrawerContract,
      typeContract,
      itemSales,
      addDialog,
      addData,
      reload,
      openDrawerDelivery,
      openDrawerPO,
    } = this.props.salesQuotations;
    const { anchorEl } = this.state;
    const Bt = props => (
      <CustomButton
        onClick={() => this.props.mergeData({ tab: props.tab })}
        {...props}
        color={props.tab === tab ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </CustomButton>
    );
    const { intl, profile } = this.props;
    const products = OriginItem.originItem ? OriginItem.originItem.products : [];
    const newProduct = products.map(item => ({
      amount: item.amount,
      delivered: 0,
      discountPercent: item.discount,
      importPrice: item.costPrice,
      name: item.name,
      productId: item.productId,
      unit: item.nameUnit,
    }));
    const nameCallBack = 'sale';

    const kbStatus = (
      (JSON.parse(localStorage.getItem('crmStatus')) && JSON.parse(localStorage.getItem('crmStatus')).find(item => item.code === 'ST02')) || { data: [] }
    ).data;
    const successKb = kbStatus.find(k => k.code == 3);
    return (
      <div>
        <Helmet>
          <title>{intl.formatMessage(messages.baogiabanhang || { id: 'baogiabanhang', defaultMessage: 'baogiabanhang' })}</title>
          <meta name="description" content="Description of SalesQuotations" />
        </Helmet>
        <Grid container>
          <Grid item md={12}>
            <Bt tab={2}>Kanban</Bt>
            <Bt tab={1}>{intl.formatMessage(messages.donhangthanhcong || { id: 'donhangthanhcong', defaultMessage: 'donhangthanhcong' })}</Bt>
            <Bt tab={0}>{intl.formatMessage(messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' })}</Bt>
          </Grid>
          <Grid style={{ margin: ' 0px' }} item md={12}>
            {tab === 0 ? (
              <ListPage
                height="610px"
                showDepartmentAndEmployeeFilter
                // customColumns={this.customColumns}
                exportExcel
                deleteOption="salesQuotations"
                code="SalesQuotation"
                apiUrl={API_SALE}
                mapFunction={this.mapFunction}
                kanban="ST02"
                kanbanKey="_id"
                rightColumns={['po', 'edit', 'action']}
              />
            ) : null}
            {tab === 1 ? (
              <ListPage
                height="610px"
                mapFunction={this.mapFunction}
                deleteOption="salesQuotations"
                code="SalesQuotation"
                apiUrl={API_SALE}
                kanban="ST02"
                kanbanKey="_id"
                rightColumns={['po', 'edit', 'action']}
                filter={{
                  kanbanStatus: successKb ? successKb._id : '',
                }}
              />
            ) : null}

            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDrawerStock: false })}
              open={openDrawerStock}
              onOpen={() => this.props.mergeData({ openDrawerStock: true })}
            >
              <div style={{ width: window.innerWidth - 260 }}>
                <AppBar style={{ position: 'relative' }}>
                  <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => this.props.mergeData({ openDrawerStock: false })} aria-label="Close">
                      <Close />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <AddExportStockPage id={id} />
              </div>
            </SwipeableDrawer>
            {tab === 2 ? (
              <Kanban
                isOpenSinglePage
                enableTotal
                titleField="name" // tên trường sẽ lấy làm title trong kanban
                callBack={this.callBack} // sự kiện trả về kanban
                // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                // data={bos} // list dữ liệu
                reload={reload}
                path={API_SALE}
                code="ST02" // code của danh sách trạng thái kanban
                filter={this.state.kanbanFilter}
                customContent={customContent}
                nameCallBack={nameCallBack}
                customActions={[
                  {
                    action: 'comment',
                    // params: 'typeLine=4',
                  },
                ]}
                history={this.props.history}
                params="SalesQuotation"
              />
            ) : // <Kanban itemComponent={this.ItemComponent} reload={reload} addItem={this.addSale} module="crmStatus" code="ST02" apiUrl={API_SALE} />
              null}
            <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
              <BODialog
                setCoverTask={() => { }}
                profile={profile}
                taskId={this.state.kanbanData._id}
                // filterItem={innerFilterItem}
                data={this.state.kanbanData}
                API={API_SALE}
                customContent={customContent}
              />
            </Dialog>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDrawerContract: false, id })}
              open={openDrawerContract}
              onOpen={() => this.props.mergeData({ openDrawerContract: true })}
            >
              <div style={{ width: window.innerWidth - 260 }}>
                <AddContractPage
                  callback={() => this.props.mergeData({ openDrawerContract: false })}
                  id={id}
                  typeContract={typeContract}
                  itemSales={itemSales}
                />
              </div>
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDrawerDelivery: false, id })}
              open={openDrawerDelivery}
              onOpen={() => this.props.mergeData({ openDrawerDelivery: true })}
            >
              <div style={{ width: window.innerWidth - 260 }}>
                <AddDeliveryPage callback={() => this.props.mergeData({ openDrawerDelivery: false })} id={id} />
              </div>
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDrawerPO: false, id })}
              open={openDrawerPO}
              onOpen={() => this.props.mergeData({ openDrawerPO: true })}
            >
              <div style={{ width: window.innerWidth - 260 }}>
                <AddImportProduct callback={() => this.props.mergeData({ openDrawerPO: false })} id={id} products={newProduct} />
              </div>
            </SwipeableDrawer>
          </Grid>
          <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={this.handleClose}>
            <MenuItem value={1}>
              {intl.formatMessage(messages.hoanthanhdonhang || { id: 'hoanthanhdonhang', defaultMessage: 'hoanthanhdonhang' })}
            </MenuItem>
            <MenuItem value={2} onClick={this.handleApproved}>
              {intl.formatMessage(messages.yeucaupheduyet || { id: 'yeucaupheduyet', defaultMessage: 'yeucaupheduyet' })}
            </MenuItem>
            <MenuItem value={3}>{intl.formatMessage(messages.guimailbaogia || { id: 'guimailbaogia', defaultMessage: 'guimailbaogia' })}</MenuItem>
            <MenuItem value={4} onClick={this.handleContract}>
              {intl.formatMessage(messages.hopdong || { id: 'hopdong', defaultMessage: 'hopdong' })}
            </MenuItem>
            <MenuItem value={5} onClick={this.handleStock}>
              {intl.formatMessage(messages.yeucauxuathang || { id: 'yeucauxuathang', defaultMessage: 'yeucauxuathang' })}
            </MenuItem>
            <MenuItem value={6} onClick={this.handleFile}>
              {intl.formatMessage(messages.xuatfile || { id: 'xuatfile', defaultMessage: 'xuatfile' })}
            </MenuItem>
            <MenuItem value={7} onClick={this.handleDelivery}>
              Yêu cầu giao hàng
            </MenuItem>
          </Menu>
        </Grid>
        <Drawer onClose={() => this.props.mergeData({ addDialog: false, id: 'add' })} open={addDialog}>
          <AddSalesQuotation callback={this.callback} data={addData} id={id} />
        </Drawer>
      </div>
    );
  }

  callback = () => {
    this.props.mergeData({ addDialog: false, reload: this.props.salesQuotations.reload + 1 });
  };

  addSale = id => {
    this.props.mergeData({ addDialog: true, addData: { kanbanStatus: id } });
  };

  selectForm = form => {
    this.setState({
      anchorEl: null,
    });
    this.handleChange('form', form);
    this.props.mergeData({ templateId: form._id });
    // console.log(templateId);
  };

  selectApproves = approves => {
    this.handleChange('approves', approves);
    this.props.mergeData({ approvesId: approves._id });
  };

  handleChange = (name, value) => {
    this.props.handleChange(name, value);
  };

  handleStock = () => {
    this.props.mergeData({ openDrawerStock: true });
    this.setState({
      anchorEl: null,
    });
  };

  handleContract = () => {
    this.props.mergeData({ openDrawerContract: true });
    this.setState({
      anchorEl: null,
    });
  };

  handleDelivery = () => {
    this.props.mergeData({ openDrawerDelivery: true });
    this.setState({
      anchorEl: null,
    });
  };
}
SalesQuotations.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  salesQuotations: makeSelectSalesQuotations(),
  profile: makeSelectEditProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getSales: data => dispatch(getSales(data)),
    handleChange: (name, value) => dispatch(handleChange(name, value)),
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'salesQuotations', reducer });
const withSaga = injectSaga({ key: 'salesQuotations', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(SalesQuotations);
const customContent = [
  {
    title: 'Giám sát',
    fieldName: 'supervisor.name',
    type: 'string',
  },
  {
    title: 'Khách hàng',
    fieldName: 'customer.name',
    type: 'string',
  },
  {
    title: 'Giá trị',
    fieldName: 'value.amount',
    type: 'number',
  },
];
