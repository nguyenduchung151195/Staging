/**
 *
 * TimekeepingTypePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Fab, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Button } from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';

import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import styles from './styles';
import './styles.css';
import CustomTheme from 'components/ThemeSortBar/index';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import CustomInputBase from 'components/Input/CustomInputBase';

/* eslint-disable react/prefer-stateless-function */
class TimekeepingTypePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialogRemove: false,
      isEditting: false,
      dialogData: { code: '', name: '' },
      openDialog: false,
      rowInfo: undefined,
      treeData: [],
    };
  }

  componentDidMount() {
    this.setState({
      treeData: this.props.data,
    });
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps !== this.props.data) {
  //     this.setState({
  //       treeData: props.data,
  //     });
  //   }
  // }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      this.setState({
        treeData: props.data,
      });
    }
    // console.log(props);
  }
  handleOnchange = event => {
    const { dialogData } = this.state;
    const target = event.target;
    const name = target.name;
    const value = target.value;
    dialogData[name] = value;
    this.setState({
      dialogData,
    });
  };
  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };

  handleUpdate = () => {
    const { rowInfo, dialogData } = this.state;
    const { treeData } = this.state;
    const newTree = {};
    if (dialogData.code !== '' && dialogData.name !== '') {
      const data = { ...dialogData };
      newTree._id = rowInfo.node._id;
      data.code = dialogData.code;
      data.name = dialogData.name;
      newTree.data = data;
      if (rowInfo.node.code === dialogData.code || treeData.find(item => item.code === data.code) === undefined) {
        this.setState({ dialogData: data });
        this.props.onSave(newTree);
      } else {
        this.setState({ isEditting: true, openDialog: true });
        this.props.onChangeSnackBar({ status: true, message: 'Code is exists', variant: 'warning' });
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
      this.props.onDelete(id);
    }
  };

  handleAdd = () => {
    const { dialogData, treeData } = this.state;
    if (dialogData.code !== '' && dialogData.name !== '') {
      if (treeData.find(item => item.code === dialogData.code) === undefined) {
        const newTree = [...treeData, dialogData];
        this.setState({ treeData: newTree, openDialog: false, isEditting: false });
        this.props.onSave(dialogData);
      } else {
        this.setState({ isEditting: true, openDialog: true });
        this.props.onChangeSnackBar({ status: true, message: 'Code is exists', variant: 'warning' });
      }
    } else {
      this.setState({ isEditting: true, openDialog: true });
      this.props.onChangeSnackBar({ status: true, message: 'Field cannot be left blank', variant: 'error' });
    }
  };

  render() {
    const { classes } = this.props;
    const { code, name } = this.state.dialogData;
    const newData = [];
    this.state.treeData.length > 0 && this.state.treeData.map(item => newData.push({ ...item, ...{ title: item.name } }));
    return (
      <div>
        <div className="text-right">
          <Button
            color="primary"
            size="small"
            variant="outlined"
            round
            onClick={() => {
              this.setState({ isEditting: false, dialogData: { code: '', name: '' }, openDialog: true });
            }}
          >
            <Add /> Thêm mới
          </Button>
        </div>
        <div style={{ width: '100%', height: '500px' }}>
          <SortableTree
            treeData={newData}
            theme={CustomTheme}
            onChange={treeData => {
              this.setState({ treeData });
            }}
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
                      disabled={!rowInfo.node.canDelete}
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
            <DialogTitle id="alert-dialog-title">{this.state.isEditting ? 'Cập nhật loại chấm công' : 'Thêm mới loại chấm công'}</DialogTitle>
            <DialogContent style={{ width: 600 }}>
              <CustomInputBase
                label="Mã"
                type="text"
                className={classes.textField}
                value={code}
                onChange={e => this.handleOnchange(e)}
                error={code === ''}
                name="code"
              />
              <CustomInputBase
                label="Mô tả"
                type="text"
                className={classes.textField}
                value={name}
                onChange={e => this.handleOnchange(e)}
                error={name === ''}
                name="name"
              />
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
                autoFocus
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

TimekeepingTypePage.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(TimekeepingTypePage);
