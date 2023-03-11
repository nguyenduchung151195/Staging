/**
 *
 * DetailProductPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles, Grid, Paper, Typography, Checkbox, Tab, Tabs, Button, Hidden } from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import SwipeableViews from 'react-swipeable-views';
// import Accordion from 'components/Accordion/Accordion';
import { NavLink, Link } from 'react-router-dom';
// import ImageUpload from 'components/CustomUpload/ImageUpload';
import saga from './saga';
import reducer from './reducer';
import makeSelectDetailProductPage from './selectors';
import styles from './styles';
import ProductInfo from '../../components/ProductInfo';
import SetOfAttribute from '../../components/SetOfAttribute';
import PricePolicy from '../../components/PricePolicy';
import CustomSellingPoint from '../../components/CustomSellingPoint';
import ExtendedInformation from '../../components/ExtendedInformation';
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3, overflow: 'hidden' }}>
      {children}
    </Typography>
  );
}
/* eslint-disable react/prefer-stateless-function */
export class DetailProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      value: 0,
      // activeProduct: 3,
      // tableColumnExtensions: [{ columnName: 'codePro', width: 100 }],
      rows: [
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/stock/detail/1">Mũ GC</NavLink>,
          image: 'http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg',
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 2,
          codePro: 'T1189',
          barCode: '234',
          name: 'Quần Kaki Túi Hộp HST727',
          image: 'http://erpdemo.lifetek.vn/customImages/5898663372c8e19c34cd6927/589892421e8e013c32868ea7.jpeg',
          cate: 'Quần',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 3,
          codePro: 'HD112',
          barCode: '234',
          name: 'Quần đũi nam dáng quần âu ghi',
          image: 'http://erpdemo.lifetek.vn/customImages/5898663372c8e19c34cd691d/58988eabcb05c94840f456f1.jpeg',
          cate: 'Quần',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
      ],
    };
  }

  onShowPro = value => {
    alert(value);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { rows, value } = this.state;
    const { classes, theme } = this.props;
    return (
      <div>
        <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/stock">
              Kho
            </Link>
            <Typography color="textPrimary">Chi tiết sản phẩm</Typography>
          </Breadcrumbs>
        </Paper>
        <Grid container spacing={24}>
          <Hidden only={['sm', 'xs']}>
            <Grid item xs={3} className={classes.fullBlockProduct}>
              <Paper className={classes.root} elevation={1}>
                <IconButton className={classes.iconButton} aria-label="Menu">
                  <MenuIcon />
                </IconButton>
                <InputBase className={classes.input} placeholder="Tìm kiếm sản phẩm" />
                <IconButton className={classes.iconButton} aria-label="Tìm kiếm">
                  <SearchIcon />
                </IconButton>
              </Paper>
              {rows.map(item => (
                <Paper
                  key={item.id}
                  className={classnames(classes.paper, classes.productBlock)}
                  // style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}
                >
                  <div className={classes.boxProductBlock}>
                    <Checkbox color="primary" />
                  </div>
                  <div style={{ width: '70%' }}>
                    <Typography color="primary" style={{ fontWeight: 'bold' }}>
                      Áo thun nam
                    </Typography>
                    <Typography p>Sản phẩm hci tiết</Typography>
                  </div>
                  <div style={{ width: '20%' }}>
                    <img
                      height={50}
                      alt="Áo thun nam"
                      src="http://erpdemo.lifetek.vn/customImages/589877f0788414bc44fca6ee/589878b9ea6711a419c30912.jpeg"
                    />
                  </div>
                </Paper>
              ))}
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={12} md={9} lg={9}>
            <Paper className={classes.paper}>
              <Tabs
                value={value}
                variant="scrollable"
                scrollButtons="on"
                onChange={this.handleChange}
                classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
              >
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin sản phẩm" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Bộ thuộc tính" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Chính sách giá" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Cài đặt kho & điểm bán hàng" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin mở rộng" />
              </Tabs>
              <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={this.state.value} onChangeIndex={this.handleChangeIndex} width={window.innerWidth - 260}>
                <TabContainer dir={theme.direction}>
                  <ProductInfo />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <SetOfAttribute />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <PricePolicy />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <CustomSellingPoint />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <ExtendedInformation />
                </TabContainer>
              </SwipeableViews>
            </Paper>
            <Button variant="outlined" color="primary" className={classes.button}>
              Lưu
            </Button>
            <Button variant="outlined" color="secondary" className={classes.button}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

DetailProductPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  theme: PropTypes.object,
};
TabContainer.propTypes = {
  children: PropTypes.object,
  dir: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  detailProductPage: makeSelectDetailProductPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'detailProductPage', reducer });
const withSaga = injectSaga({ key: 'detailProductPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(DetailProductPage);
