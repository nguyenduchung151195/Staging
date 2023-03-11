/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable eqeqeq */
/**
 *
 * AddKpiConfig
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Add, Cancel } from '@material-ui/icons';
import { MenuItem, List, ListItem, Table, TableBody, TableRow, TableCell, Menu, Checkbox, Button, AppBar,Toolbar } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
import './style.scss';
import CustomAppBar from 'components/CustomAppBar';
import makeSelectAddKpiConfig from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, postConfig, getDefault, getCurrentConfig, putConfig } from './actions';
import { Paper, TextField, Typography, Grid, Dialog } from '../../components/LifetekUi';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */

function PrintData({ data, column = 3 }) {
  if (!data.length) return <p>Không có viewConfig cho tham chiếu này</p>;
  const number = Math.ceil(data.length / column);
  const dataColumn = [];

  const count = column - 1;
  for (let index = 0; index <= count; index++) {
    switch (index) {
      case 0:
        dataColumn[index] = data.slice(0, number);
        break;
      case count:
        dataColumn[index] = data.slice(number * count, data.length);
        break;
      default:
        dataColumn[index] = data.slice(number * index, number * (index + 1));
        break;
    }
  }

  return (
    <React.Fragment>
      {dataColumn.map(item => (
        <List>
          {item.map(element => (
            <ListItem>{element}</ListItem>
          ))}
        </List>
      ))}
    </React.Fragment>
  );
}

export class AddKpiConfig extends React.Component {
  state = {
    modules: JSON.parse(localStorage.getItem('viewConfig')),
    arrNumber: [
      { value: 1, name: 'Lớn hơn' },
      { value: 2, name: 'Lớn hơn hoặc bằng' },
      { value: 3, name: 'Bằng' },
      { value: 4, name: 'Nhỏ hơn' },
      { value: 5, name: 'Nhỏ hơn hoặc bằng' },
    ],
    arrArray: [{ value: 1, name: 'Là' }, { value: 2, name: 'Không là' }],
    arrString: [{ value: 1, name: 'Chứa' }, { value: 2, name: 'Không chứa' }, { value: 3, name: 'Bằng' }, { value: 4, name: 'Không bằng' }],
    anchorEl: null,
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === 'add') this.props.getDefault();
    else this.props.getCurrentConfig(id);
  }

  convertData = (code, ref = true, prefix = false) => {
    const result = [];
    if (code) {
      const data = this.state.modules.find(item => item.code === code);
      if (!data) return [];
      const viewArr = data.listDisplay.type.fields.type;
      const newData = [...viewArr.columns, ...viewArr.others];
      newData.forEach((item, index) => {
        const dt = prefix ? `{${prefix}.${item.name}} : ${item.title}` : `{${item.name}} : ${item.title}`;
        if (!ref) result[index] = dt;
        else if (item.type.includes('ObjectId')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.substring(9), item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type.includes('Array')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p>
              {`{${item.name}} :`}
              <span
                style={{ cursor: 'pointer', color: '#9c27b0', fontWeight: 'bold' }}
                onClick={() => this.referenceArray(item.type)}
                onKeyDown={this.handleKeyDown}
              >{`${item.title}`}</span>
            </p>
          );
        } else if (item.type.includes('Relation')) {
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              onClick={() => this.referenceDialog(item.type.split("'")[3], item.name)}
              onKeyDown={this.handleKeyDown}
              style={{ color: '#2196f3', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {dt}
            </p>
          );
        } else if (item.type === 'extra')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#f47536', fontWeight: 'bold' }}>{dt}</p>
          );
        else if (item.type === 'required')
          result[index] = (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p style={{ color: '#e3165b', fontWeight: 'bold' }}>{dt}</p>
          );
        else result[index] = dt;
      });
    }
    return result;
  };

  referenceArray(data) {
    const list = data.split('|');
    const items = list[1];
    let listItem = [];
    if (items) {
      listItem = items.split(',').map(i => `{${i}}`);
    }
    this.props.mergeData({ listItem, arrayDialog: true });
  }

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  handleCondition = index => e => {
    const { modules } = this.state;
    const { addKpiConfig } = this.props;
    const Arr = modules.find(elm => elm.code === addKpiConfig.module);
    const ArrCondition = Arr ? Arr.listDisplay.type.fields.type.columns : [];
    const current = ArrCondition.find(elm => elm.name === e.target.value);
    const compares = this.props.addKpiConfig.compares;
    compares[index].condition = e.target.value;
    this.props.mergeData({ compares, currentCondition: current });
  };

  handleCompare = index => e => {
    const { addKpiConfig } = this.props;
    const compares = addKpiConfig.compares;
    compares[index].compare = e.target.value;
    this.props.mergeData({ compares });
  };

  itemCompare = () => {
    const { currentCondition } = this.props.addKpiConfig;
    const type = currentCondition ? currentCondition.type : '';
    let result;
    switch (type) {
      case 'Number':
        result = this.state.arrNumber.map(item => <MenuItem value={item.value}>{item.name}</MenuItem>);
        break;
      case 'Hard Array':
      case 'Relation':
      case 'Object':
        result = this.state.arrArray.map(item => <MenuItem value={item.value}>{item.name}</MenuItem>);
        break;
      case 'String':
      case 'Boolean':
      case 'ObjectId':
        result = this.state.arrString.map(item => <MenuItem value={item.value}>{item.name}</MenuItem>);
        break;
      default:
        break;
    }
    return result;
  };

  handleValue = index => e => {
    const compares = this.props.addKpiConfig.compares;
    compares[index].value = e.target.value;
    this.props.mergeData({ compares });
  };

  addRow = () => {
    const compares = this.props.addKpiConfig.compares;
    const data = { condition: '', compares: '', value: '' };
    const newRow = compares.concat(data);
    this.props.mergeData({ compares: newRow });
    this.setState({ anchorEl: null });
  };

  deleteRow = index => {
    const compares = this.props.addKpiConfig.compares;
    const newRow = compares.filter((it, idx) => idx !== index);
    if (!newRow.length) return;
    this.props.mergeData({ compares: newRow });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { modules } = this.state;
    const { addKpiConfig, intl } = this.props;
    const Arr = modules.find(elm => elm.code === addKpiConfig.module);
    const ArrCondition = Arr ? Arr.listDisplay.type.fields.type.columns : [];
    const id = this.props.match.params.id;
    return (
      <div>
        <CustomAppBar 
        className='HeaderKPIConfig'
        title={
          id === 'add'
            ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới ' })}`
            : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật ' })}`
        }
        onGoBack={this.onGoBack}
        onSubmit={this.onSaveConfig}
        >
              {/* <Toolbar> */}
                {/* <IconButton
                  // className={addStock === "criteria" ? 'BTNClose' : ''}
                  className='BTNKPIConfig'
                  color="inherit"
                  variant="contained"
                  onClick={this.onGoBack}
                  aria-label="Close"
                >
                  <Close />
                </IconButton> */}
                {/* <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}> */}
                  {/* {id === 'add'
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật' })}`} */}
                  {/* {intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'aaaaaa' })} */}
                {/* </Typography> */}
                {/* {showButtonEx()} */}
                {/* <Button
                  variant="outlined"
                  color="inherit"
                  onClick={this.onSaveConfig}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button> */}
              {/* </Toolbar> */}
        </CustomAppBar>
        <Paper>
          <Typography variant="subtitle2">K: Hệ số KPI</Typography>
          <Typography variant="subtitle2">KH: Kế hoạch thực hiện </Typography>
          <Typography variant="body1">Thông tin các từ thay thế </Typography>
          <Grid style={{ padding: 5 }} container>
            <Grid style={{ display: 'flex', justifyContent: 'space-around' }} item md={12}>
              <PrintData data={this.convertData(addKpiConfig.module)} />
            </Grid>
            <Grid item md={12}>
              <Typography style={{ fontWeight: 'bold' }}>Ghi chú</Typography>
              <Typography>
                <span style={{ fontStyle: 'italic' }}>Loại thường</span>
              </Typography>
              <Typography>
                <span style={{ color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic' }}>Loại tham chiếu: </span> Click vào để chọn trường tham
                chiếu
              </Typography>
              <Typography>
                <span style={{ color: '#9c27b0', fontWeight: 'bold', fontStyle: 'italic' }}>Loại mảng: </span> Dùng trong bảng
              </Typography>
            </Grid>
          </Grid>
          <TextField
            required
            label="Tên công thức"
            value={addKpiConfig.name}
            onChange={e => this.props.mergeData({ name: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={addKpiConfig.name === ''}
            helperText={addKpiConfig.name === '' ? 'Tên công thức không được bỏ trống' : null}
          />
          <TextField
            required
            label="Mã công thức"
            value={addKpiConfig.code}
            onChange={e => this.props.mergeData({ code: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={addKpiConfig.code === ''}
            helperText={addKpiConfig.code === '' ? 'Mã công thức không được bỏ trống' : null}
          />
          <TextField
            select
            label="Module"
            value={addKpiConfig.module}
            onChange={e => this.props.mergeData({ module: e.target.value })}
            fullWidth
            // helperText="Please select your currency"
            InputLabelProps={{ shrink: true }}
          >
            {modules.map(option => (
              <MenuItem key={option.code} value={option.code}>
                {option.code}
              </MenuItem>
            ))}
          </TextField>
          <Grid item md={12}>
            <Table>
              <TableBody>
                {addKpiConfig.compares.map((item, index) => (
                  <TableRow>
                    <TableCell>
                      <TextField
                        select
                        value={item.condition}
                        label="Điều kiện"
                        fullWidth
                        onChange={this.handleCondition(index)}
                        InputLabelProps={{ shrink: true }}
                      >
                        {ArrCondition.map(item => (
                          <MenuItem value={item.name}>{item.title}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        label="So sánh"
                        value={item.compare}
                        fullWidth
                        onChange={this.handleCompare(index)}
                        InputLabelProps={{ shrink: true }}
                        select
                      >
                        {this.itemCompare()}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField value={item.value} label="Giá trị" fullWidth onChange={this.handleValue(index)} InputLabelProps={{ shrink: true }} />
                    </TableCell>
                    <TableCell>
                      <Add onClick={this.handleClick} style={{ cursor: 'pointer' }} />
                      <Cancel onClick={() => this.deleteRow(index)} style={{ cursor: 'pointer', marginLeft: 10 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">K =</Typography>
              <TextField
                required
                label="Tên công thức"
                value={addKpiConfig.formula}
                onChange={e => this.props.mergeData({ formula: e.target.value })}
                style={{ width: '94%', marginLeft: 30 }}
                // helperText="Plase select your currency"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <Typography variant="subtitle2">Phạm vi</Typography>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div>
                Công ty
                <Checkbox color="primary" checked={addKpiConfig.range == 1} value={1} onClick={this.changeRange} />
              </div>
              <div>
                Khu vực
                <Checkbox color="primary" checked={addKpiConfig.range == 2} value={2} onChange={this.changeRange} />
              </div>
              <div>
                Phòng ban
                <Checkbox color="primary" checked={addKpiConfig.range == 3} value={3} onChange={this.changeRange} />
              </div>
              <div>
                Nhân viên
                <Checkbox color="primary" checked={addKpiConfig.range == 4} value={4} onChange={this.changeRange} />
              </div>
            </div>
          </Grid>
          {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <Button variant="contained" color="primary" style={{ marginRight: 30 }} onClick={this.onSaveConfig}>
              Lưu
            </Button>
            <Button variant="contained" color="secondary" onClick={this.onGoBack}>
              Hủy
            </Button>
          </div> */}
        </Paper>
        <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.addRow}>OR</MenuItem>
          <MenuItem onClick={this.addRow}>AND</MenuItem>
        </Menu>

        <Dialog
          maxWidth="xs"
          dialogAction={false}
          title="Tham chieu array"
          open={addKpiConfig.arrayDialog}
          onClose={() => this.props.mergeData({ arrayDialog: false })}
        >
          <PrintData column={1} data={addKpiConfig.listItem} />
        </Dialog>

        <Dialog dialogAction={false} title="Bang tham chieu" open={addKpiConfig.dialogRef} onClose={() => this.props.mergeData({ dialogRef: false })}>
          <Grid style={{ display: 'flex', justifyContent: 'space-between' }} item md={12}>
            <PrintData column={2} data={this.convertData(addKpiConfig.codeRef, false, addKpiConfig.name)} />
          </Grid>
        </Dialog>
      </div>
    );
  }

  changeRange = e => {
    this.props.mergeData({ range: e.target.value });
  };

  onSaveConfig = () => {
    const { addKpiConfig } = this.props;
    const id = this.props.match.params.id;
    if (addKpiConfig.name === '' || addKpiConfig.code === '') return;
    const data = {
      name: addKpiConfig.name,
      code: addKpiConfig.code,
      module: addKpiConfig.module,
      compares: addKpiConfig.compares,
      formula: addKpiConfig.formula,
      range: addKpiConfig.range,
    };
    if (id === 'add') this.props.postConfig(data);
    else this.props.putConfig(data, id);
  };

  onGoBack = () => {
    this.props.history.goBack();
  };
}

AddKpiConfig.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addKpiConfig: makeSelectAddKpiConfig(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postConfig: data => dispatch(postConfig(data)),
    getDefault: () => dispatch(getDefault()),
    getCurrentConfig: id => dispatch(getCurrentConfig(id)),
    putConfig: (data, id) => dispatch(putConfig(data, id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addKpiConfig', reducer });
const withSaga = injectSaga({ key: 'addKpiConfig', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddKpiConfig);
