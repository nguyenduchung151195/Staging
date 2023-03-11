/**
 *
 * ProductPage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Avatar, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Paper, withStyles } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import { CameraAlt } from '@material-ui/icons';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import makeSelectProductPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { Grid as GridLT, AsyncAutocomplete, TextField } from '../../../components/LifetekUi';
import { API_CUSTOMERS, API_PERSONNEL } from '../../../config/urlConfig';
import ListPage from '../../../components/List';
import avatarA from '../../../images/avatarCompany.png';
import styles from './styles';
import { getLabelName } from '../../../utils/common';

const tabs = [
  {
    name: 'THÔNG TIN SP',
    index: 0,
  },
  {
    name: 'THÔNG SỐ KT',
    index: 1,
  },
  {
    name: 'CHÍNH SÁCH GIÁ',
    index: 2,
  },
  {
    name: 'THÔNG TIN KHÁC',
    index: 3,
  },
];

function AddProductPage(props) {
  const { classes } = props;

  const [tabIndex, setTabIndex] = useState(0);

  const [avatar, setAvatar] = useState(null);

  const [avatarUrl, setAvatarUrl] = useState(null);

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [supplier, setSupplier] = useState(null);

  const suppliers = [];

  const handleChangeAvatar = e => {
    const fileUrl = e.target.files[0];
    setAvatarUrl(URL.createObjectURL(fileUrl));
    setAvatar(fileUrl);
  };

  const ButtonUI = props => (
    <Buttons onClick={() => setTabIndex(props.index)} color={props.index === tabIndex ? 'gradient' : 'simple'}>
      {props.children}
    </Buttons>
  );

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Paper>
        <GridLT container spacing={16}>
          <Grid item xs={6}>
            <AsyncAutocomplete
              name="Chọn khách hàng..."
              label="Tầng"
              // onChange={value => this.handleCustomer(value)}
              // suggestions={customers.data}
              url={API_CUSTOMERS}

              // value={this.props.customerBos ? this.props.customerBos : addProjects.customer}
            />
          </Grid>
          <Grid item sm={12}>
            <Grid container>
              {tabs.map(tab => (
                <Grid item>
                  <ButtonUI index={tab.index} onClick={() => setTabIndex(tab.index)}>
                    {tab.name}
                  </ButtonUI>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8}>
              <Grid item xs={2}>
                <Grid justify="center" container>
                  <Avatar src={avatarA} className={classes.avatar} srcSet={avatarUrl} />
                  <input
                    className={classes.textFieldAva}
                    onChange={handleChangeAvatar}
                    accept="image/*"
                    name="avatar"
                    type="file"
                    style={{ cursor: 'pointer', opacity: 0, width: '150px', position: 'absolute', zIndex: '999', margin: '0px' }}
                  />
                  <span className={classes.spanAva}>
                    <CameraAlt className={classes.iconCam} />
                  </span>
                  <Grid container justify="center">
                    <span>Ảnh sản phẩm</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={10}>
                <Grid container spacing={8}>
                  <Grid item xs={6}>
                    <TextField fullWidth required onChange={() => {}} value="" name="name" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth required onChange={() => {}} value="" name="name" />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={8}>
                      <Grid item xs={8}>
                        <DateTimePicker
                          fullWidth
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          value={startDate}
                          variant="outlined"
                          label="Ngày bắt đầu"
                          margin="dense"
                          onChange={date => setStartDate(date)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          id="standard-select-currency"
                          select
                          label={getLabelName('supplier.name', 'Stock')}
                          name="supplier"
                          value={supplier}
                          onChange={e => setSupplier(e.target.value)}
                        >
                          {suppliers.map((item, index) => (
                            <MenuItem key={item.id} value={index}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="standard-select-currency"
                      select
                      label={getLabelName('supplier.name', 'Stock')}
                      name="supplier"
                      value={supplier}
                      onChange={e => setSupplier(e.target.value)}
                    >
                      {suppliers.map((item, index) => (
                        <MenuItem key={item.id} value={index}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            // checked={this.state.optionsInfo.isServices}
                            // onChange={this.handleChangeCheckbox('isServices')}
                            value="isServices"
                            color="primary"
                          />
                        }
                        label={getLabelName('isService', 'Stock')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            // checked={this.state.optionsInfo.isDescribe}
                            // onChange={this.handleChangeCheckbox('isDescribe')}
                            value="isDescribe"
                            color="primary"
                          />
                        }
                        label={getLabelName('isDescription', 'Stock')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            // checked={this.state.optionsInfo.displayCaptital}
                            // onChange={this.handleChangeCheckbox('displayCaptital')}
                            value="displayCaptital"
                            color="primary"
                          />
                        }
                        label={getLabelName('isDisplaySourcePrice', 'Stock')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            // checked={this.state.optionsInfo.isSeri}
                            // onChange={this.handleChangeCheckbox('isSeri')}
                            value="isSeri"
                            color="primary"
                          />
                        }
                        label={getLabelName('isSerial', 'Stock')}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth required onChange={() => {}} value="" name="name" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="standard-select-currency"
                      select
                      label={getLabelName('supplier.name', 'Stock')}
                      name="supplier"
                      value={supplier}
                      onChange={e => setSupplier(e.target.value)}
                    >
                      {suppliers.map((item, index) => (
                        <MenuItem key={item.id} value={index}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Grid item xs={6}>
                  <TextField fullWidth required onChange={() => {}} value="" name="name" />
                </Grid>
                <Grid container spacing={8}>
                  <Grid item>
                    <DateTimePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      value={startDate}
                      variant="outlined"
                      label="Ngày bắt đầu"
                      margin="dense"
                      onChange={date => setStartDate(date)}
                    />
                  </Grid>
                  <Grid item>
                    <DateTimePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY HH:mm"
                      value={endDate}
                      variant="outlined"
                      label="Ngày kết thúc"
                      margin="dense"
                      onChange={date => setEndDate(date)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </GridLT>
      </Paper>
    </MuiPickersUtilsProvider>
  );
}

AddProductPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  productPage: makeSelectProductPage(),
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

const withReducer = injectReducer({ key: 'productPage', reducer });
const withSaga = injectSaga({ key: 'productPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddProductPage);
