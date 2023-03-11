/**
 *
 * SymbolPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import {
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Grid,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
  Button,
} from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';

import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import styles from './styles';
import './styles.css';
import CustomTheme from 'components/ThemeSortBar/index';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import CustomInputBase from 'components/Input/CustomInputBase';

/* eslint-disable react/prefer-stateless-function */

class SymbolPage extends React.Component {
  state = {
    openDialogRemove: false,
    isEditting: false,
    dialogData: { symbol: '1', description: '', data: [] },
    openDialog: false,
    rowInfo: undefined,
    treeData: [],
    timekeepTypes: [],
  };
  componentDidMount() {
    this.setState({ treeData: this.props.data, timekeepTypes: this.props.timekeepTypes });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      this.setState({ treeData: props.data, timekeepTypes: props.timekeepTypes });
    }
    // console.log(props);
  }
  handleOnchange = (event, index = '') => {
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const { dialogData } = this.state;
    const { data } = this.state.dialogData;

    if (index !== '') {
      data[index] = {
        hrmTimekeepingTypeCode: name,
        value: value,
      };
      this.setState({ data });
    } else {
      dialogData[name] = value;
    }
    const newData = { ...dialogData, data };
    this.setState({
      dialogData: newData,
    });
  };

  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };
  displayTimekeepTypes = () => {
    const { timekeepTypes, dialogData } = this.state;
    if (timekeepTypes && timekeepTypes.length > 0) {
      const displayData = timekeepTypes.map(item => {
        if (dialogData && Array.isArray(dialogData.data)) {
          const itemDataSource = dialogData.data.find(d => d.hrmTimekeepingTypeCode === item.code);
          if (itemDataSource) {
            item.value = itemDataSource.value;
          }
        }

        return item;
      });
      return displayData.map((item, key) => (
        <Grid container alignItems="center" key={key} justify="space-between" className="mb-2">
          <Grid item md={6} xs={12}>
            <FormLabel>{item.name}</FormLabel>
          </Grid>
          <FormControl>
            <TextField
              className={this.props.classes.inputStyle}
              onChange={e => this.handleOnchange(e, key)}
              type="number"
              min={0}
              name={item.code}
              value={item.value}
            />
          </FormControl>
        </Grid>
      ));
    }
  };

  handleUpdate = () => {
    const { rowInfo, dialogData, treeData } = this.state;
    const newTree = {};
    if (dialogData.symbol !== '' && dialogData.description !== '' && dialogData.data.length > 0) {
      const data = {};
      newTree._id = rowInfo.node._id;
      data.symbol = dialogData.symbol;
      data.description = dialogData.description;
      data.list = dialogData.data;
      newTree.data = data;
      if (rowInfo.node.symbol === dialogData.symbol || (treeData.length > 0 && treeData.find(item => item.symbol === data.symbol) === undefined)) {
        this.props.onSave(newTree);
      } else {
        this.setState({ isEditting: true, openDialog: true });
        this.props.onChangeSnackBar({ status: true, message: 'Symbol is exists', variant: 'error' });
      }
    } else {
      this.setState({ isEditting: true, openDialog: true });
      this.props.onChangeSnackBar({ status: true, message: 'Field cannot be left blank', variant: 'error' });
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
    if (dialogData.symbol !== '' && dialogData.description !== '' && dialogData.data.length > 0) {
      if (treeData.find(item => item === dialogData.symbol) === undefined) {
        const newTree = [...treeData, dialogData];
        this.setState({ treeData: newTree, openDialog: false, isEditting: false });
        this.props.onSave(dialogData);
      } else {
        this.setState({ isEditting: true, openDialog: true });
        this.props.onChangeSnackBar({ status: true, message: 'symbol is exists', variant: 'error' });
      }
    } else {
      this.setState({ isEditting: true, openDialog: true });
      this.props.onChangeSnackBar({ status: true, message: 'field must full fill', variant: 'error' });
    }
  };

  render() {
    const { classes } = this.props;
    let newData = [];
    const { treeData, timekeepTypes, dialogData } = this.state;
    if (treeData) treeData.map(item => newData.push({ ...item, ...{ title: `${item.symbol && `(${item.symbol})`}  ${item.description}` } }));
    return (
      <div>
        <div className="text-right">
          <Button
            color="primary"
            size="small"
            variant="outlined"
            round
            onClick={() => {
              this.setState({ isEditting: false, dialogData: { symbol: '1', description: '', data: [] }, openDialog: true });
            }}
          >
            <Add /> Thêm mới
          </Button>
        </div>
        <div style={{ width: '100%', height: '500px' }}>
          <SortableTree
            treeData={newData}
            onChange={treeData => {
              this.setState({ treeData });
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
          />
          <Dialog open={this.state.openDialog} onClose={this.handleDialogAdd}>
            <DialogTitle id="alert-dialog-title">{this.state.isEditting ? 'Cập nhật ký hiệu chấm công ' : 'Thêm mới ký hiệu chấm công'}</DialogTitle>
            <DialogContent style={{ width: 600 }}>
              <CustomInputBase
                label="Ký hiệu"
                type="text"
                className={classes.textField}
                value={dialogData.symbol}
                onChange={e => this.handleOnchange(e)}
                error={dialogData.symbol === ''}
                name="symbol"
              />
              <CustomInputBase
                label="Mô tả"
                type="text"
                className={classes.textField}
                value={dialogData.description}
                onChange={e => this.handleOnchange(e)}
                error={dialogData.description === ''}
                name="description"
              />
              {this.displayTimekeepTypes(dialogData.data)}
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

SymbolPage.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(SymbolPage);
