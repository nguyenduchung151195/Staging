/**
 *
 * InventoryPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Button, Grid, MenuItem, Paper, Step, StepLabel, Stepper, Typography, withStyles } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';
import { Breadcrumbs } from '@material-ui/lab';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectInventoryPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import { Grid as GridLT } from 'components/LifetekUi';
import { API_ASSET } from 'config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';

import { TextField } from 'components/LifetekUi';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import styles from './styles';
import { API_STOCK } from '../../../config/urlConfig';
import SimpleListPage from '../../../components/List/SimpleListPage';

const columns = [
  {
    name: 'name',
    title: 'Tên thiết bị',
  },
  {
    name: 'depreciationType',
    title: 'Loại khấu hao',
  },
  {
    name: 'depreciationValue',
    title: 'Giá trị',
  },
  {
    name: 'usingDate',
    title: 'Ngày bắt đầu sử dụng',
  },
  {
    name: 'depreciationTime',
    title: 'Thời gian khấu hao',
  },
  {
    name: 'note',
    title: 'Mô tả',
  }
]


function KanbanStep(props) {
  const { listStatus, currentStatus, onChange } = props;

  return (
    <Stepper style={{ background: 'transparent' }} activeStep={currentStatus}>
      {listStatus.map((item, i) => (
        <Step key={i} onClick={() => onChange(item.code)}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}


function InventoryPage(props) {


  const { inventoryPage, classes } = props;

  const [status, setStatus] = useState(0);

  const [filter] = useState({ level: 0 });

  const [product, setProduct] = useState(null);

  const [serial, setSerial] = useState('');

  const [dateReceive, setDateReceive] = useState(null);

  const [note, setNote] = useState('');


  useEffect(() => {

  }, [])

  const handleSubmit = () => {

  }

  const handleGoback = () => {
    props.history.goBack();
  }

  return (
    <div>
      <Paper className={classes.breadcrumbs}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{ margin: 2 }}>
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Typography color="textPrimary">Kiểm kê </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={24}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper>
            <GridLT container spacing={16}>
              <Grid item sm={12}>
                <Grid container spacing={8}>
                  <Grid item xs={6}>
                    <AsyncAutocomplete
                      name="Chọn sảm phẩm..."
                      label="Sản phẩm/Vật tư"
                      onChange={value => setProduct(value)}
                      url={API_STOCK}
                      value={product}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <AsyncAutocomplete
                      name="Chọn sảm phẩm..."
                      label="Sản phẩm/Vật tư"
                      onChange={value => setProduct(value)}
                      url={API_STOCK}
                      value={product}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Serial"
                      name="serial"
                      value={serial}
                      margin="dense"
                      onChange={e => setSerial(e.target.value)}>
                    </TextField>
                  </Grid>
                  <Grid item xs={4} >
                    <Button
                      variant="contained"
                      className={classes.button}
                      color="primary"
                      size="large"
                      onClick={() => { }}>
                      Thêm mới
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper>
                      <GridLT container spacing={16}>
                        <SimpleListPage columns={columns} rows={[]} />
                      </GridLT>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.button}
                          color="primary"
                          size="large"
                          onClick={() => { }}>
                          Đóng/kết thúc KIỂM và CẬP NHẬT hàng tồn kho
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.button}
                          color="primary"
                          size="large"
                          onClick={() => { }}>
                          Đóng/kết thúc KIỂM và không CẬP NHẬT hàng tồn kho
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.button}
                          color="primary"
                          size="large"
                          onClick={() => { }}>
                          Tiếp tục KIỂM sau
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} >
                    <Button
                      variant="contained"
                      className={classes.button}
                      color="primary"
                      size="large"
                      onClick={() => { }}>
                      Sản phẩm chưa được kiểm kho
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper style={{paddingBottom: 20}}>
                      <GridLT container spacing={8}>
                        <SimpleListPage columns={columns} rows={[]} />
                      </GridLT>
                      <Grid container justify="center">
                        <Button
                          variant="contained"
                          className={classes.button}
                          color="primary"
                          onClick={() => { }}>
                          Xuất file Excel
                        </Button>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </GridLT>
          </Paper>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Button variant="contained" className={classes.button} color="primary" onClick={handleSubmit}>
                Lưu
              </Button>
              <Button variant="contained" className={classes.button} onClick={handleGoback}>
                Hủy
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {inventoryPage.loading ? <LoadingIndicator /> : ''}
    </div>
  );
}

InventoryPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  inventoryPage: makeSelectInventoryPage(),
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

const withReducer = injectReducer({ key: 'inventoryPage', reducer });
const withSaga = injectSaga({ key: 'inventoryPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(InventoryPage);