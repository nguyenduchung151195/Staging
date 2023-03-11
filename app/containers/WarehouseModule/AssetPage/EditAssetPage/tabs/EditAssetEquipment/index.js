/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * EditAssetEquipment
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TextField, AsyncAutocomplete } from 'components/LifetekUi';

import { Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button, FormHelperText, MenuItem } from '@material-ui/core';
import { API_ASSET, API_PERSONNEL, API_ASSET_TYPE_STOCK } from '../../../../../../config/urlConfig';
import SimpleListPage from '../../../../../../components/List/SimpleListPage';

import { DatePicker } from 'material-ui-pickers';
import request from '../../../../../../utils/request';
import { changeSnackbar } from '../../../../../../containers/Dashboard/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
// import { AsyncAutocomplete } from '../../';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

const columns = [
  {
    name: 'name',
    title: 'Tên thiết bị',
  },
  {
    name: 'type',
    title: 'Loại thiết bị',
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
  },
];

/* eslint-disable react/prefer-stateless-function */
class EditAssetEquipment extends React.PureComponent {
  state = {
    equipments: [],
    equipment: {},
    openDialog: false,
  };

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  componentDidUpdate(preProps) {
    const { asset } = this.props;
    if (asset && !this.state.isSubmit && preProps.asset !== asset) {
      this.state.equipments = asset.assetIds.filter(c => c._id && c._id.status !== 3).map(id => ({ ...id._id }));
    }
  }

  handleAdd = () => {
    this.setState({ openDialog: true, equipment: {} });
  };

  handleEdit = item => {
    try {
      request(`${API_ASSET}/${item._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(data => {
        const newData = {...data, depreciationCalculatedUnit:data.depreciationCalculatedUnit._id }
        this.setState(prevState => ({
          equipment: newData,
        }));
      });;
    } catch (error) {}
   
    this.setState({ equipment: item, openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };
  handleCancel = () => {
    this.setState({ openDialog: false, equipment: {} });
  };

  handleChangeInput = e => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      equipment: {
        ...prevState.equipment,
        [name]: value,
      },
    }));
    console.log(value, "value");

  };

  handleDateChange = (name, value) => {
    this.setState(prevState => ({
      equipment: {
        ...prevState.equipment,
        [name]: value,
      },
    }));
  };

  handleSave = () => {
    const { equipment } = this.state;
    
    let type = equipment && equipment.type;
    const newEquipment = { ...this.state.equipment, type: type, level: 1 };
    
    if (equipment && equipment.type && equipment.name) {
      this.setState({ equipment: {} });
      this.handleUpdateData(newEquipment);
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại!', variant: 'error' });
    }
  };

  handleUpdateData = data => {
    // console.log(data,'datadata');
    try {
      if (!data._id) {
        request(API_ASSET, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then(data => {
          this.setState(prevState => ({
            equipments: [...prevState.equipments, data],
            equipment: {},
            openDialog: false,
          }));
        });
      } else {
        request(`${API_ASSET}/${data._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then(() => {
          const index = this.state.equipments.findIndex(e => e._id === data._id);
          if (index > -1) {
            this.state.equipments[index] = {
              ...data,
              
              usingDate: data.usingDate && data.usingDate.toString(),
              depreciationTime: data.depreciationTime && data.depreciationTime.toString(),
              warrantyPeriod: data.warrantyPeriod && parseInt(data.warrantyPeriod),
              maintenanceQuota: data.maintenanceQuota && parseInt(data.maintenanceQuota),
              depreciationValue: data.depreciationValue && parseInt(data.depreciationValue),
            };
            this.setState({
              equipments: [...this.state.equipments],
              equipment: {},
              openDialog: false,
            });
          }
        });
      }
    } catch (error) {}
  };

  handleDete = items => {
    const ids = this.state.equipments.filter((item, index) => items.includes(index)).map(i => i._id);
    const self = this;
    try {
      request(API_ASSET, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: ids }),
      }).then(respon => {
        // eslint-disable-next-line eqeqeq
        let newEquipments = [...self.state.equipments];
        // console.log('1212121', self.state.equipments);
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];
          newEquipments.splice(item, 1);
        }
        self.setState({ equipments: newEquipments });
      });
    } catch (error) {}
  };

  getData = () => {
    this.setState({ isSubmit: true });
    return this.state.equipments.filter(i => i._id).map(c => ({ _id: c._id }));
  };

  handleImport = () => {};
  mapFunction = item => (
    {
    ...item,
    usingDate: moment(item.usingDate).format('DD/MM/YYYY'),
    depreciationTime: moment(item.depreciationTime).format('DD/MM/YYYY'),
    warrantyPeriod: item.warrantyPeriod && parseInt(item.warrantyPeriod),
    maintenanceQuota: item.maintenanceQuota && parseInt(item.maintenanceQuota),
    depreciationValue: item.depreciationValue && parseInt(item.depreciationValue),
  });
  render() {
    const { equipments, equipment } = this.state;
    // console.log(equipment,'equipment');
    // console.log(equipments,'equipments');
    equipments.sort(function() {
      return -1;
    })
    const { units } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <SimpleListPage
            onAdd={this.handleAdd}
            onEdit={this.handleEdit}
            showAction
            columns={columns}
            rows={equipments}
            onDelete={this.handleDete}
            mapFunction={this.mapFunction}
            // onImport={this.handleImport}
          />
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
        <Dialog maxWidth="md" open={this.state.openDialog} onClose={this.handleClose}>
          <DialogTitle>
            <h4>Thiết bị tài sản </h4>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid md={6} item>
                <TextField
                  label="Tên thiết bị"
                  name="name"
                  fullWidth
                  value={equipment && equipment.name || ''}
                  onChange={this.handleChangeInput}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={equipment && equipment.name ? false : true}
                  helperText={equipment && equipment.name ? '' : 'Không được để trống tên thiết bị'}
                />
                {/* {this.state.errorName && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Tên có độ dài không quá 200 kí tự và không được để trống
                  </FormHelperText>
                )} */}
              </Grid>

              <Grid md={6} item>
                {/* <TextField
                  //select
                  label="Loại thiết bị"
                  name="type"
                  fullWidth
                  value={equipment.type || ''}
                  onChange={this.handleChangeInput}
                >
                </TextField> */}

                <AsyncAutocomplete
                  label="Loại thiết bị"
                  // isMulti
                  onChange={value => {
                    equipment.type = value;
                    this.setState({...equipment});
                  }}
                  value={equipment && equipment.type}
                  url={API_ASSET_TYPE_STOCK}
                  error={equipment && equipment.type ? false : true}
                  helperText={equipment && equipment.type ? '' : 'Không được để trống loại thiết bị'}
                />
              </Grid>
              <Grid md={6} item>
                <TextField
                  //select
                  label="Loại khấu hao"
                  name="depreciationType"
                  fullWidth
                  value={equipment.depreciationType || ''}
                  onChange={this.handleChangeInput}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Giá trị tính khấu hao"
                      value={equipment.depreciationValue || ''}
                      onChange={this.handleChangeInput}
                      name="depreciationValue"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      fullWidth
                      label="Giá trị"
                      name="depreciationCalculatedUnit"
                      value={equipment.depreciationCalculatedUnit || ''}
                      // value={equipment.depreciationCalculatedUnit && equipment.depreciationCalculatedUnit._id || ''}
                      onChange={this.handleChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {units &&
                        units.map(item => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={equipment.usingDate || null}
                  variant="outlined"
                  label="Ngày bắt đầu sử dụng"
                  margin="dense"
                  fullWidth
                  onChange={date => this.handleDateChange('usingDate', date)}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={equipment.depreciationTime || null}
                  variant="outlined"
                  label="Thời gian khấu hao"
                  margin="dense"
                  fullWidth
                  onChange={date => this.handleDateChange('depreciationTime', date)}
                />
              </Grid>
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Thời gian bảo hành"
                      value={equipment.warrantyPeriod || ''}
                      onChange={this.handleChangeInput}
                      name="warrantyPeriod"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      fullWidth
                      label="Giá trị"
                      name="warrantyPeriodUnit"
                      value={equipment.warrantyPeriodUnit || ''}
                      onChange={this.handleChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {units &&
                        units.map(item => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid md={6} item>
                <Grid container spacing={8}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Định mức bảo trì"
                      value={equipment.maintenanceQuota || ''}
                      onChange={this.handleChangeInput}
                      name="maintenanceQuota"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      fullWidth
                      label="Giá trị"
                      name="maintenanceQuotaUnit"
                      value={equipment.maintenanceQuotaUnit || ''}
                      onChange={this.handleChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {units &&
                        units.map(item => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid md={6} item>
                <TextField
                  label="Mô tả"
                  multiline
                  rows={3}
                  fullWidth
                  name="note"
                  value={equipment.note}
                  onChange={this.handleChangeInput}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.handleSave} color="primary">
              Lưu
            </Button>
            <Button variant="contained" color="default" onClick={this.handleCancel}>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}
const withConnect = connect(
  null,
  mapDispatchToProps,
);

EditAssetEquipment.propTypes = {};

export default compose(withConnect)(EditAssetEquipment);
