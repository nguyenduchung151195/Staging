/**
 *
 * HolidaysPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Button,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';

import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import styles from './styles';
import './styles.css';
import CustomTheme from 'components/ThemeSortBar/index';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import CustomInputBase from 'components/Input/CustomInputBase';

/* eslint-disable react/prefer-stateless-function */
class HolidaysPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialogRemove: false,
      isEditting: false,
      dialogData: { date: 0, month: 0, weight: 0, type: false },
      openDialog: false,
      rowInfo: undefined,
      treeData: [],
    };
  }

  componentDidMount() {
    this.setState({ treeData: this.props.data });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      this.setState({
        treeData: props.data,
      });
    }
  }

  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };

  handleUpdate = () => {
    const { rowInfo, dialogData, treeData } = this.state;
    if (dialogData.date !== 0 && dialogData.month !== 0 && dialogData.weight !== 0) {
      const newData = {
        _id: dialogData._id,
        date: dialogData.date,
        month: dialogData.month,
        weight: dialogData.weight,
        type: dialogData.type,
      };
      if (newData.date > 0 && newData.date <= 31 && newData.month > 0 && newData.month <= 12) {
        const index = ({ treeIndex }) => treeIndex;
        this.props.onSave(newData);
        treeData[index] = newTree;
        this.setState({ treeData });
      } else {
        this.setState({ isEditting: true, openDialog: true });
        this.props.onChangeSnackBar({ status: true, message: 'Date or month must valid', variant: 'error' });
      }
    } else {
      this.props.onChangeSnackBar({ status: true, message: 'Fields data must fill', variant: 'error' });
    }
  };

  handleDelete = rowInfo => {
    const { treeData } = this.state;
    const id = rowInfo.node._id;
    const answer = confirm('Do you want delete this element?');
    if (answer) {
      treeData.splice(rowInfo.treeIndex, 1);
      this.setState({ treeData });
      this.props.onDelete(id);
    }
  };

  handleAdd = () => {
    const { dialogData, treeData } = this.state;
    if (dialogData.date !== 0 && dialogData.month !== 0 && dialogData.weight !== 0) {
      if (dialogData.date > 0 && dialogData.date <= 31 && dialogData.month > 0 && dialogData.month <= 12) {
        dialogData.type = dialogData.type === false ? 'sun' : 'moon';
        const newTree = [...treeData, dialogData];
        treeData.push(dialogData);
        this.setState({ treeData: newTree, openDialog: false, isEditting: false });
        this.props.onSave(dialogData);
      } else {
        this.setState({ isEditting: true, openDialog: true });
        this.props.onChangeSnackBar({ status: true, message: 'Date or month must valid', variant: 'error' });
      }
    } else {
      this.setState({ isEditting: true, openDialog: true });
      this.props.onChangeSnackBar({ status: true, message: 'Fields data must fill', variant: 'error' });
    }
  };
  handleOnchange = event => {
    const { dialogData } = this.state;
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target.checked ? 'moon' : 'sun') : target.value;
    dialogData[name] = value;
    this.setState({
      dialogData,
    });
  };

  render() {
    const { classes } = this.props;
    const { dialogData } = this.state;
    let newData = [];
    this.state.treeData.length > 0 &&
      this.state.treeData.map(item =>
        newData.push({
          ...item,
          ...{ title: `Ngày ${item.date} - Tháng ${item.month} ${item.type === 'moon' ? '(Âm lịch)' : ''} / ${item.weight}%` },
        }),
      );
    return (
      <div>
        <div className="text-right">
          <Button
            color="primary"
            size="small"
            variant="outlined"
            round
            onClick={() => {
              this.setState({ isEditting: false, dialogData: { day: 0, month: 0, weight: 0, type: false }, openDialog: true });
            }}
          >
            <Add /> Thêm mới
          </Button>
        </div>
        <div className={classes.listStyle}>
          <SortableTree
            treeData={newData}
            onChange={treeData => {
              this.setState({ treeData: this.state.treeData });
            }}
            theme={CustomTheme}
            canDrag={({ node }) => !node.noDragging}
            isVirtualized
            // eslint-disable-next-line consistent-return
            generateNodeProps={rowInfo => {
              if (!rowInfo.node.noDragging) {
                return {
                  buttons: [
                    <Fab
                      color="primary"
                      size="small"
                      onClick={() => {
                        const dialogData = Object.assign({}, rowInfo.node);
                        this.setState({ isEditting: true, openDialog: true, dialogData, rowInfo });
                      }}
                      style={{ marginLeft: 10 , position: 'absolute', right: 50, top: 10}}
                    >
                      <Edit />
                    </Fab>,
                    <Fab
                      color="secondary"
                      size="small"
                      style={{ marginLeft: 10 , position: 'absolute', right: 5, top: 10}}
                      title="Xóa"
                      onClick={() => {
                        this.handleDelete(rowInfo);
                      }}
                    >
                      <Delete />
                    </Fab>,
                  ],
                };
              }
            }}
            style={{ fontFamily: 'Tahoma' }}
          />
          <DialogAcceptRemove
            title="Bạn có muốn xóa ngày nghỉ lễ này không?"
            openDialogRemove={this.state.openDialogRemove}
            handleClose={this.handleDialogRemove}
          />{' '}
          <Dialog open={this.state.openDialog} onClose={this.handleDialogAdd}>
            <DialogTitle id="alert-dialog-title">{this.state.isEditting ? 'Cập nhật ngày nghỉ lễ' : 'Thêm mới ngày nghỉ lễ'}</DialogTitle>
            <DialogContent style={{ width: 600 }}>
              <Grid container spacing={16}>
                <Grid item xs={6}>
                  <CustomInputBase
                    label="Ngày"
                    type="number"
                    className={classes.textField}
                    value={this.state.dialogData.date}
                    onChange={e => this.handleOnchange(e)}
                    error={this.state.dialogData.date === '' || this.state.dialogData.date < 1 || this.state.dialogData.date > 31}
                    helperText={
                      (this.state.dialogData.date === '' && 'Field must fill') ||
                      ((this.state.dialogData.date > 31 && 'Date is not valid') || (this.state.dialogData.date < 1 && 'Date is not valid'))
                    }
                    name="date"
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomInputBase
                    label="Tháng"
                    type="number"
                    className={classes.textField}
                    value={this.state.dialogData.month}
                    onChange={e => this.handleOnchange(e)}
                    error={this.state.dialogData.month === '' || this.state.dialogData.month < 1 || this.state.dialogData.month > 12}
                    helperText={
                      (this.state.dialogData.month === '' && 'Field must fill') ||
                      ((this.state.dialogData.month > 12 && 'Month is not valid') || (this.state.dialogData.month < 1 && 'Month is not valid'))
                    }
                    name="month"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInputBase
                    label="Hệ số"
                    type="number"
                    className={classes.textField}
                    value={this.state.dialogData.weight}
                    onChange={e => this.handleOnchange(e)}
                    error={this.state.dialogData.weight === ''}
                    helperText={this.state.dialogData.weight === '' && 'Field must fill'}
                    name="weight"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={dialogData.type === 'moon' ? true : false} onChange={e => this.handleOnchange(e)} name="type" />}
                    label="Lịch âm"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  if (this.state.isEditting) {
                    this.setState({ openDialog: false });
                    this.handleUpdate();
                  } else {
                    this.handleAdd();
                  }
                }}
                variant="outlined"
                color="primary"
              >
                {this.state.isEditting ? 'LƯU' : 'LƯU'}
              </Button>
              <Button
                onClick={() => {
                  this.setState({ openDialog: false });
                }}
                variant="outlined"
                color="secondary"
                // autoFocus
              >
                Hủy
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

HolidaysPage.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(HolidaysPage);
