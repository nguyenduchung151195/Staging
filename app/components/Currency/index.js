/**
 *
 * Currency
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import { Done, Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import messages from './messages';
import styles from './styles';
import CustomAppBar from 'components/CustomAppBar';
import { currencyColumns } from 'variable';
import { viewConfigCheckFormNoViewConfig } from 'utils/common';

/* eslint-disable react/prefer-stateless-function */
let nameColumn = [];
let t = JSON.parse(localStorage.getItem('viewConfig'));
if (t) {
  let y = t.find(item => item.code === 'Currency');
  if (y) {
    nameColumn = y.listDisplay.type.fields.type.columns;
  }
}
const names = {};
nameColumn.forEach(elm => {
  names[elm.name] = elm.title;
});

class Currency extends React.Component {
  state = {
    // checked: null,
    isDislayForm: true,
    isDislayTab: false,
    money: '',
    infoCurrent: { code: '', name: '' },
    search: '',
    // exchangeRate: '',
    // faceValue: '',
    // sort: '',
  };

  handleChangeInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSelect = e => {
    const money = this.props.money.find(item => item._id === e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
      infoCurrent: money,
    });
  };

  handleSeach = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleDislayForm = () => {
    const isDislayForm = this.state.isDislayForm;
    this.setState({
      isDislayForm: !isDislayForm,
    });
  };

  handleChangeTab = () => {
    const isDislayTab = this.state.isDislayTab;
    this.setState({
      isDislayTab: !isDislayTab,
    });
  };

  onSubmit = () => {


    this.state.isDislayTab === true ? this.onSave() : this.onUpdate();
  };

  render() {
    const { classes, nameCurrency, money, currency } = this.props;
    const { isDislayForm, isDislayTab, infoCurrent } = this.state;
    const { intl } = this.props;
    const stock = this.props.propsAll.match.path;
    const addStock = stock && stock.slice(stock.length - 3, stock.length);

    return (
      <div style={{ marginTop: '70px' }}>
        <ValidatorForm
          onSubmit={this.onSubmit}
        // onClick={() => {
        //   isDislayTab === true ? this.onSave() : this.onUpdate();
        // }}
        >
          {/* <AppBar className="HeaderAppBarAutomation">
            <Toolbar>
              <IconButton
                className="BTNAutomation"
                color="inherit"
                variant="contained"
                onClick={() => this.props.propsAll.history.goBack()}
                aria-label="Close"
              >
                <Close />
              </IconButton>
              <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                {addStock === 'con'
                  ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
              </Typography>
              <Button variant="outlined" color="inherit" type="submit">
                {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
              </Button>
            </Toolbar>
          </AppBar> */}
          <CustomAppBar
            title={
              addStock === 'con'
                ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới Currency' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Currency' })}`
            }
            onGoBack={() => this.props.onCLoseCurrency()}
            onSubmit={this.onSubmit}
          />
          <Paper>
            <Typography style={{ marginTop: '30px', marginLeft: '30px', color: '#143ae5', fontSize: '30px' }}>
              <b>{intl.formatMessage(messages.tiente || { id: 'tiente', defaultMessage: 'tiente' })}</b>
            </Typography>
            <Button variant="outlined" style={{ marginTop: '20px', marginLeft: 25 }} color="primary" onClick={this.handleChangeTab}>
              {isDislayTab === true
                ? intl.formatMessage(messages.themthucong || { id: 'themthucong', defaultMessage: 'themthucong' })
                : intl.formatMessage(messages.themturegistry || { id: 'themturegistry', defaultMessage: 'themturegistry' })}
            </Button>
          </Paper>
          {isDislayTab === false ? (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper>
                  <Typography style={{ marginLeft: 25, marginTop: '30px', color: '#1334ad' }}>
                    {intl.formatMessage(messages.thuoctinhdongtien || { id: 'thuoctinhdongtien', defaultMessage: 'thuoctinhdongtien' })}
                  </Typography>
                  <TextValidator
                    validators={['required', 'matchRegexp:^[a-zA-Z0-9]{3,20}$']}
                    errorMessages={['Không được bỏ trống', 'Mã khách hàng chỉ bao gồm ký tự chữ hoặc số hoặc ký tự "-" ']}
                    label={names.code}
                    onChange={e => this.handleChangeNameCurrency('code', e.target.value)}
                    className={classes.textField}
                    value={this.props.code}
                    name="code"
                    margin="normal"
                    variant="outlined"
                    required
                  />
                  <div style={{ marginLeft: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        validators={['required']}
                        errorMessages={['Không được bỏ trống']}
                        required
                        label={names.exchangeRate}
                        style={{ width: '40%', marginTop: 0 }}
                        onChange={e => this.handleChangeNameCurrency('exchangeRate', e.target.value)}
                        value={this.props.exchangeRate}
                        name="exchangeRate"
                        margin="normal"
                        variant="outlined"
                      />
                      <span style={{ fontSize: 20 }}>{this.props.code}</span>
                      <span style={{ marginLeft: 20, fontSize: 20 }}>=</span>
                      <TextField
                        required
                        validators={['required']}
                        errorMessages={['Không được bỏ trống']}
                        style={{ width: '40%', marginTop: 0 }}
                        onChange={e => this.handleChangeNameCurrency('faceValue', e.target.value)}
                        value={this.props.faceValue}
                        name="faceValue"
                        margin="normal"
                        variant="outlined"
                      />
                      {currency.filter(item => item.base === true).map(item => (
                        <span style={{ fontSize: 20 }}>{item.code}</span>
                      ))}
                    </div>
                  </div>
                  <TextField
                    validators={['required']}
                    errorMessages={['Không được bỏ trống']}
                    required
                    label={names.sort}
                    onChange={e => this.handleChangeNameCurrency('sort', e.target.value)}
                    className={classes.textField}
                    value={this.props.sort}
                    name="sort"
                    margin="normal"
                    variant="outlined"
                    defaultValue="99"
                    type="number"
                  />
                  <FormGroup style={{ marginLeft: 25 }} row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={e => this.handleDiscount('reportingCurrency', e.target.checked)}
                          checked={this.props.reportingCurrency}
                          color="primary"
                        />
                      }
                      label={names.reportingCurrency}
                    />
                  </FormGroup>
                  <FormGroup style={{ marginLeft: 25 }} row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={e => this.handleDiscount('defaultInvoicingCurrency', e.target.checked)}
                          checked={this.props.defaultInvoicingCurrency}
                          color="primary"
                        />
                      }
                      label={names.defaultInvoicingCurrency}
                    />
                  </FormGroup>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Typography style={{ marginTop: '30px', marginLeft: 25, color: '#1334ad' }}>VIETNAMESE</Typography>
                <TextField
                  validators={['required']}
                  errorMessages={['Không được bỏ trống']}
                  required
                  label={names.name}
                  onChange={e => this.handleChangeNameCurrency('name', e.target.value)}
                  className={classes.textField}
                  value={this.props.name}
                  name="name"
                  margin="normal"
                  variant="outlined"
                />
                {nameCurrency.map((item, index) => (
                  <Paper key={item.symbol}>
                    <Grid container style={{ display: 'block' }} alignItems="center" className={classes.textField}>
                      <InputLabel style={{ fontSize: 12, display: 'block' }}>
                        {intl.formatMessage(messages.khuonmaudinhdang || { id: 'khuonmaudinhdang', defaultMessage: 'khuonmaudinhdang' })}
                      </InputLabel>
                      <Select
                        native
                        style={{ width: '55%' }}
                        value={item.formatTemplates}
                        name="formatTemplates"
                        onChange={e => this.onChangeNameCurrency('formatTemplates', index, e.target.value)}
                        input={<OutlinedInput labelWidth={0} id="select" />}
                      >
                        <option value={0}>123.456,7</option>
                        <option value={1}>123,456.7</option>
                        <option value={2}>123 456.7</option>
                      </Select>
                      <TextField
                        onChange={e => this.onChangeNameCurrency('symbol', index, e.target.value)}
                        value={item.symbol}
                        name="symbol"
                        style={{ fontSize: 12, width: '37%', marginTop: 0, marginLeft: '25px' }}
                        label={intl.formatMessage(messages.kyhieutien || { id: 'kyhieutien', defaultMessage: 'kyhieutien' })}
                        margin="normal"
                        variant="outlined"
                      />
                      <InputLabel style={{ fontSize: 12, display: 'block' }}>
                        {intl.formatMessage(messages.vitrikyhieu || { id: 'vitrikyhieu', defaultMessage: 'vitrikyhieu' })}
                      </InputLabel>
                      <Select
                        native
                        style={{ width: '95%' }}
                        value={this.props.locationMoney}
                        name="locationMoney"
                        onChange={e => this.onChangeNameCurrency('locationMoney', index, e.target.value)}
                        input={<OutlinedInput labelWidth={0} id="select" />}
                      >
                        <option value={0}>{intl.formatMessage(messages.sotientrc || { id: 'sotientrc', defaultMessage: 'sotientrc' })}</option>
                        <option value={1}>{intl.formatMessage(messages.sotiensau || { id: 'sotiensau', defaultMessage: 'sotiensau' })}</option>
                      </Select>
                    </Grid>
                    <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleDislayForm}>
                      <Done />
                      {isDislayForm === true
                        ? intl.formatMessage(messages.hienthithamsobosung || { id: 'hienthithamsobosung', defaultMessage: 'hienthithamsobosung' })
                        : intl.formatMessage(messages.anthamsobosung || { id: 'anthamsobosung', defaultMessage: 'anthamsobosung' })}
                    </Button>
                    {isDislayForm === false ? (
                      <form noValidate autoComplete="off">
                        <InputLabel style={{ fontSize: 12, marginLeft: 25, display: 'block' }}>
                          {intl.formatMessage(messages.phancachhangnghin || { id: 'phancachhangnghin', defaultMessage: 'phancachhangnghin' })}
                        </InputLabel>
                        <Select
                          native
                          style={{ marginLeft: '25px', width: '55%' }}
                          value={item.separator}
                          name="separator"
                          onChange={e => this.onChangeNameCurrency('separator', index, e.target.value)}
                          input={<OutlinedInput labelWidth={0} id="select" />}
                        >
                          <option value={0}>{intl.formatMessage(messages.daucham || { id: 'daucham', defaultMessage: 'daucham' })}</option>
                          <option value={1}> {intl.formatMessage(messages.dauphay || { id: 'dauphay', defaultMessage: 'dauphay' })}</option>
                          <option value={2}>
                            {' '}
                            {intl.formatMessage(messages.khoangtrang || { id: 'khoangtrang', defaultMessage: 'khoangtrang' })}
                          </option>
                        </Select>
                        <TextField
                          // label="Mã ký hiệu"
                          style={{ width: '37%', marginLeft: '25px', marginTop: 0 }}
                          onChange={this.handleChangeInput}
                          // value={this.state.companyName}
                          name="value"
                          margin="normal"
                          variant="outlined"
                        />
                        <TextField
                          label={intl.formatMessage(messages.sothapphan || { id: 'sothapphan', defaultMessage: 'sothapphan' })}
                          margin="normal"
                          variant="outlined"
                          className={classes.textField}
                          onChange={e => this.onChangeNameCurrency('decimal', index, e.target.value)}
                          value={item.decimal}
                          name="decimal"
                        />
                        <TextField
                          label={intl.formatMessage(messages.chusothapphan || { id: 'chusothapphan', defaultMessage: 'chusothapphan' })}
                          margin="normal"
                          variant="outlined"
                          className={classes.textField}
                          onChange={e => this.onChangeNameCurrency('numberDecimal', index, e.target.value)}
                          value={item.numberDecimal}
                          name="numberDecimal"
                        />
                      </form>
                    ) : null}
                  </Paper>
                ))}
              </Grid>
            </Grid>
          ) : (
            <div>
              <Grid container spacing={3}>
                <Grid item md={6}>
                  <Paper className={classes.paper}>
                    <Typography style={{ marginTop: '30px', marginLeft: 25, color: '#1334ad' }}>
                      {intl.formatMessage(messages.TIMDONGTIEN || { id: 'TIMDONGTIEN', defaultMessage: 'TIMDONGTIEN' })}
                    </Typography>
                    <TextField
                      label={intl.formatMessage(messages.timdongtien || { id: 'timdongtien', defaultMessage: 'timdongtien' })}
                      onChange={this.handleSeach}
                      className={classes.textField}
                      value={this.state.search}
                      name="search"
                      margin="normal"
                      variant="outlined"
                    />
                    <InputLabel shrink style={{ fontSize: 14, marginLeft: 25, marginTop: 15, display: 'block' }}>
                      {intl.formatMessage(messages.chondongtien || { id: 'chondongtien', defaultMessage: 'chondongtien' })}
                    </InputLabel>
                    <Select
                      native
                      className={classes.textField}
                      value={this.state.money}
                      name="money"
                      onChange={this.handleSelect}
                      input={<OutlinedInput labelWidth={0} id="select" />}
                    >
                      {money.filter(element => element.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1).map(item => (
                        <option value={item._id}>{item.name}</option>
                      ))}
                    </Select>

                    <Typography style={{ marginTop: '30px', marginLeft: 25 }}>
                      {intl.formatMessage(messages.thuoctinhtien || { id: 'thuoctinhtien', defaultMessage: 'thuoctinhtien' })}
                    </Typography>
                    <Typography style={{ marginTop: '30px', marginLeft: 25 }}>
                      {intl.formatMessage(messages.masodang || { id: 'masodang', defaultMessage: 'masodang' })}
                    </Typography>
                    <Typography style={{ marginLeft: 25 }}>{infoCurrent.name}</Typography>
                    <Typography style={{ marginTop: '30px', marginLeft: 25 }}>
                      {intl.formatMessage(messages.makyhieu || { id: 'makyhieu', defaultMessage: 'makyhieu' })}
                    </Typography>
                    <Typography style={{ marginLeft: 25 }}>{infoCurrent.code}</Typography>
                    <div style={{ marginLeft: '25px' }}>
                      <Typography required style={{ marginTop: 15 }}>
                        {names.exchangeRate}
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          style={{ width: '40%', marginTop: 0 }}
                          onChange={e => this.handleChangeNameCurrency('exchangeRate', e.target.value)}
                          value={this.props.exchangeRate}
                          name="exchangeRate"
                          margin="normal"
                          variant="outlined"
                          defaultValue="1"
                        />
                        <span>{infoCurrent.code}</span>
                        <span style={{ marginLeft: 20, fontSize: 20 }}>=</span>
                        <TextField
                          style={{ width: '40%', marginTop: 0 }}
                          onChange={e => this.handleChangeNameCurrency('faceValue', e.target.value)}
                          value={this.props.faceValue}
                          name="faceValue"
                          margin="normal"
                          variant="outlined"
                        />
                        {currency.filter(item => item.base === true).map(item => (
                          <span style={{ fontSize: 20 }}>{item.code}</span>
                        ))}
                      </div>
                    </div>
                    <TextField
                      style={{ marginLeft: 25 }}
                      label={names.sort}
                      onChange={e => this.handleChangeNameCurrency('sort', e.target.value)}
                      value={this.props.sort}
                      name="sort"
                      margin="normal"
                      variant="outlined"
                      defaultValue="10"
                    />
                    <FormGroup style={{ marginLeft: 25 }} row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={e => this.handleDiscount('reportingCurrency', e.target.checked)}
                            checked={this.props.reportingCurrency}
                            color="primary"
                          />
                        }
                        label={names.reportingCurrency}
                      />
                    </FormGroup>
                    <FormGroup style={{ marginLeft: 25 }} row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={e => this.handleDiscount('defaultInvoicingCurrency', e.target.checked)}
                            checked={this.props.defaultInvoicingCurrency}
                            color="primary"
                          />
                        }
                        label={names.defaultInvoicingCurrency}
                      />
                    </FormGroup>
                  </Paper>
                </Grid>
                <Grid item md={6}>
                  <Paper className={classes.paper}>
                    <Typography style={{ marginTop: '30px', marginLeft: 25, color: '#1334ad' }}>VIETNAMESE</Typography>
                    <Typography style={{ marginTop: '30px', marginLeft: 25 }}>
                      {intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}
                    </Typography>
                    <Typography style={{ marginLeft: 25 }}>{infoCurrent.name}</Typography>
                    <Typography style={{ marginTop: '30px', marginLeft: 25 }}>
                      {intl.formatMessage(messages.viduvetien || { id: 'viduvetien', defaultMessage: 'viduvetien' })}
                    </Typography>
                    <Typography style={{ marginLeft: 25 }}>
                      {infoCurrent.symbol}
                      {this.converttoMoney(1234567)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              );
            </div>
          )}
          {/* <div style={{ position: 'fixed', marginLeft: 60, textAlign: 'center' }}>
            <Button variant="outlined" color="primary" className={classes.button} style={{ marginLeft: 30 }} type="submit">
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              style={{ marginLeft: 30 }}
              onClick={() => this.onCLoseCurrency()}
            >
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
            </Button>
          </div> */}
        </ValidatorForm>
      </div>
    );
  }

  handleChangeNameCurrency = (a, b) => {
    this.props.handleChangeNameCurrency(a, b);
  };

  handleChangeCurrency = name => event => {
    const newCurency = this.state.infoCurrent;
    this.setState({
      infoCurrent: { ...newCurency, [name]: event.target.value },
    });
  };

  converttoMoney(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  converttoMoneyTwo(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
  }

  onSave = () => {
    const newCurency = this.state.infoCurrent;
    const data = {
      name: newCurency.name,
      code: !newCurency.code && newCurency.code !== 0 ? "" : newCurency.code,
      sort: this.props.sort,
      exchangeRate: this.props.exchangeRate,
      faceValue: this.props.faceValue,
      reportingCurrency: this.props.reportingCurrency,
      defaultInvoicingCurrency: this.props.defaultInvoicingCurrency,
      base: false,
      isHandmade: true,
    };
    const messages = viewConfigCheckFormNoViewConfig(currencyColumns, data);
    if (Object.keys(messages).length === 0) {
      if (!this.state.isEditPage) {
        this.props.onCreate(body);
      } else {
        this.props.onSave(data);
      }
    } else {
      let mess = ''
      for (const mes in messages) {
        if (!mess)
          mess = mess + `${messages[mes]}`
        else mess = mess + `, ${messages[mes]}`
      }
      this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: mess || 'Thao tác thất bại', variant: 'error' });
    }
  };

  onUpdate = () => {
    const data = {
      nameCurrency: this.props.nameCurrency,
      name: this.props.name,
      code: this.props.code,
      exchangeRate: this.props.exchangeRate,
      faceValue: this.props.faceValue,
      sort: this.props.sort,
      reportingCurrency: this.props.reportingCurrency,
      defaultInvoicingCurrency: this.props.defaultInvoicingCurrency,
      base: false,
      isHandmade: true,
    };
    const messages = viewConfigCheckFormNoViewConfig(currencyColumns, data);
    if (Object.keys(messages).length === 0) {
      if (!this.state.isEditPage) {
        this.props.onCreate(body);
      } else {
        this.props.onUpdate(data);
      }
    } else {
      let mess = ''
      for (const mes in messages) {
        if (!mess)
          mess = mess + `${messages[mes]}`
        else mess = mess + `, ${messages[mes]}`
      }
      this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: mess || 'Thao tác thất bại', variant: 'error' });
    }

  };

  onCLoseCurrency = () => {
    this.props.onCLoseCurrency();
  };

  onChangeNameCurrency = (name, index, value) => {
    const newCurency = [...this.props.nameCurrency];
    newCurency[index] = { ...newCurency[index], [name]: value };
    this.props.onChangeNameCurrency(newCurency);
  };

  handleDiscount = (name, checked) => {
    this.props.handleDiscount(name, checked);
  };

  fetchCurrency = (data, _id) => {
    this.props.fetchCurrency(data, _id);
  };
}

Currency.propTypes = {};

export default compose(
  injectIntl,
  withStyles(styles),
)(Currency);
