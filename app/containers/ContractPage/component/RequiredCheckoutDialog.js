import React from 'react';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { Grid } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

export default class FormDialog extends React.Component {
  state = {
    dialogData: {
      stage: null,
      checkoutTime: new Date(),
      money: null,
      type: 0,
    },
  };

  componentDidMount() {
    /* eslint react/prop-types: 0 */
    if (this.props.isEdittingRequiredCheckoutDialog === true) {
      /* eslint react/prop-types: 0 */
      const data = this.props.editData;

      data.checkoutTime = moment(data.checkoutTime);

      this.setState({ dialogData: data });
    }
  }

  handleClose = () => {
    this.props.callBack('close-required-checkout-dialog', {});
  };

  handleInputChange = name => event => {
    const newData = this.state.dialogData;

    newData[name] = event.target.value;

    this.setState(() => ({ dialogData: newData }));
  };

  handleSubmit = () => {
    if (this.props.isEdittingRequiredCheckoutDialog) {
      this.props.callBack('update-required-checkout', this.state.dialogData);
    } else {
      this.props.callBack('add-required-checkout', this.state.dialogData);
    }
  };

  handleDateChange = event => {
    const newData = this.state.dialogData;

    newData.checkoutTime = event;

    this.setState(() => ({ dialogData: newData }));
  };

  render() {
    return (
      <div>
        <Dialog fullWidth maxWidth="md" open={this.props.openRequiredCheckoutDialog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Thêm yêu cầu thanh toán</DialogTitle>
          <DialogContent>
            <ValidatorForm onSubmit={this.handleSubmit}>
              <TextValidator
                onChange={this.handleInputChange('stage')}
                value={this.state.dialogData.stage}
                validators={['required']}
                autoFocus
                margin="dense"
                id="name"
                label="Tên giai đoạn"
                errorMessages={['Tên giai đoạn không được để trống']}
                fullWidth
              />
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker value={this.state.dialogData.checkoutTime} onChange={this.handleDateChange} fullWidth label="Thời hạn thanh toán" />
              </MuiPickersUtilsProvider>
              <Grid container justify="center">
                <Grid item sm={9} className="pr-3">
                  <TextValidator
                    type="number"
                    onChange={this.handleInputChange('money')}
                    value={this.state.dialogData.money}
                    validators={['required']}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Số tiền"
                    errorMessages={['Số tiền không được để trống']}
                    fullWidth
                  />
                </Grid>
                <Grid item sm={3} className="pl-3">
                  <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-simple">Age</InputLabel>
                    <Select
                      fullWidth
                      native
                      value={this.state.dialogData.type}
                      onChange={this.handleInputChange('type')}
                      inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                      }}
                    >
                      <option value={0}>USD</option>
                      <option value={1}>%</option>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button onClick={this.handleClose} color="primary">
                Huỷ
              </Button>
              <Button type="submit" color="primary">
                {this.props.isEdittingRequiredCheckoutDialog ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </ValidatorForm>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
