/**
 *
 * LiquidationPage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, Grid, MenuItem, Paper, Step, StepLabel, Stepper, Typography, withStyles } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import { DateTimePicker } from 'material-ui-pickers';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAssetPage from '../selectors';
import reducer from '../reducer';
import saga from '../saga';
import { Grid as GridLT } from 'components/LifetekUi';
import { API_ASSET } from 'config/urlConfig';
import ListPage from 'components/List';
import styles from './styles';
import { Breadcrumbs } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { AsyncAutocomplete, TextField } from '../../../../components/LifetekUi';
import { API_TAG_STOCK } from '../../../../config/urlConfig';
import { MODULE_CODE } from '../../../../utils/constants';

const listStatus = [
  {
    code: 0,
    name: 'Chưa thanh lý',
  },
  {
    code: 1,
    name: 'Đã thanh lý',
  },
  {
    code: 2,
    name: 'Hủy thanh lý',
  },
];

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

function EditLiquidationPage(props) {

  const { classes, history } = props;

  const [liquidationStatus, setLiquidationStatus] = useState(0);

  const [filter, setFilter] = useState({ level: 0 });

  const [asset, setAsset] = useState(null);

  const [tag, setTag] = useState(null);

  const [liquidationCode, setLiquidationCode] = useState('');

  const [serial, setSerial] = useState('');

  const [liquidationPrice, setLiquidationPrice] = useState('');

  const mapFunctionProject = item => {

    return {
      ...item,
      unit: item['unit.name'] || '',
      supplierId: item['supplierId.name'] || '',
    }
  };

  const handleSubmit = () => {

  }

  const goBack = () => {
    history.push('/Stock/asset');
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
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Stock/Liquidation">
                Tài sản
              </Link>
              <Typography color="textPrimary">Tài sản</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <GridLT container spacing={8}>
          <Grid md={12} item>
            <KanbanStep listStatus={listStatus} currentStatus={liquidationStatus} onChange={setLiquidationStatus} />
          </Grid>
          <Grid item xs={4}>
            <AsyncAutocomplete
              name="Chọn loại tài sản..."
              label="Loại tài sản"
              onChange={value => setTag(value)}
              url={API_TAG_STOCK}
              value={tag}
            />
          </Grid>
          <Grid item xs={4}>
            <AsyncAutocomplete
              name="Chọn mã tài sản..."
              label="Tên tài sản"
              onChange={value => setAsset(value)}
              url={API_ASSET}
              value={asset}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              label="Serial"
              name="serial"
              value={serial}
              onChange={e => setSerial(e.target.value)}>
              {asset &&
                asset.assetSerial.map((item, i) => (
                  <MenuItem key={i} value={item.serial}>
                    {item.serial}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Mã thanh lý"
              value={liquidationCode}
              onChange={e => setLiquidationCode(e.target.value)}>
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Giá thanh lý"
              name="serial"
              value={liquidationPrice}
              onChange={e => setLiquidationPrice(e.target.value)}
              type="number"
            >
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <ListPage code={MODULE_CODE.Asset} apiUrl={API_ASSET} mapFunction={mapFunctionProject} filter={filter} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={12} justify="flex-end">
              <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Lưu
              </Button>
              <Button variant="contained" className={classes.button} onClick={goBack}>
                Hủy
              </Button>
            </Grid>
          </Grid>
        </GridLT>
      </Paper>
    </div >
  );
}

EditLiquidationPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  assetPage: makeSelectAssetPage(),
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

const withReducer = injectReducer({ key: 'assetPage', reducer });
const withSaga = injectSaga({ key: 'assetPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(EditLiquidationPage);
