/**
 *
 * CategoryPage
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
import CustomInputField from '../Input/CustomInputField';
import CustomInputBase from '../Input/CustomInputBase';
import styles from './styles';
import './styles.css';
import CustomTheme from '../ThemeSortBar/index';
import DialogAcceptRemove from '../DialogAcceptRemove';
// import { changeSnackbar } from '../../containers/Dashboard/';

/* eslint-disable react/prefer-stateless-function */
function convertToSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
class CategoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialogRemove: false,
      isEditting: false,
      dialogData: { title: '', value: '' },
      openDialog: false,
      rowInfo: undefined,
      treeData: [],
    };
  }

  componentDidMount() {
    this.setState({ treeData: this.props.data.data });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      // this.setState({
      //   treeData: props.data.data,
      // });
    }

    // console.log(props);
  }

  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };

  updateChild = () => {
    const { rowInfo, dialogData, treeData } = this.state;
    if (dialogData.title !== '' && dialogData.value !== '') {
      const getNodeKey = ({ treeIndex }) => treeIndex;
      const newTree = changeNodeAtPath({
        treeData,
        path: rowInfo.path,
        getNodeKey,
        newNode: { ...dialogData, ...{ value: dialogData.value } },
      });

      this.setState({ treeData: newTree });
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Tên danh mục không được để trống', variant: 'warning' });
      // alert('Tên danh mục không được để trống');
    }
  };

  removeChild = rowInfo => {
    const { treeData } = this.state;
    const getNodeKey = ({ treeIndex }) => treeIndex;
    // eslint-disable-next-line no-restricted-globals
    const r = confirm('Bạn có muốn xóa phần tử này?');
    if (r) {
      const newTree = removeNodeAtPath({ treeData, path: rowInfo.path, getNodeKey });
      this.setState({ treeData: newTree });
    }
  };

  addChild = () => {
    // console.log('title', this.state.dialogData.title);
    const { dialogData, treeData } = this.state;
    if (dialogData.title !== '') {
      // dialogData.value = convertToSlug(dialogData.title);
      const newTree = [...treeData, dialogData];
      this.setState({ treeData: newTree, openDialog: false, isEditting: false });
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Tên danh mục không được để trống', variant: 'warning' });
      // alert('Tên và mã danh mục không được để trống');
    }
  };

  render() {
    const { classes } = this.props;
    // this.props.data.data.map(item => console.log('props', item.title))
    // console.log('tree1',  this.state.treeData);
    console.log('data1', this.props);
    const { extraFields } = this.props.data;
    return (
      <div className={classes.root} style={{ height: '80%' }}>
        <h4>{this.props.title}</h4>

        <div className="text-right">
          {this.state.treeData !== this.props.data.data ? (
            <Button
              onClick={() => {
                this.props.callBack('update-source', this.state.treeData, this.props.data);
              }}
              size="small"
              variant="outlined"
              color="primary"
              autoFocus
              round
              className="mx-3"
            >
              Lưu
            </Button>
          ) : (
            ''
          )}
          <Button
            color="primary"
            size="small"
            variant="outlined"
            round
            onClick={() => {
              this.setState({ isEditting: false, dialogData: { title: '', value: '', extraValue: {} }, openDialog: true });
            }}
          >
            <Add /> Thêm mới
          </Button>
        </div>
        <div style={{ width: '100%', height: '100%' }}>
          <SortableTree
            treeData={this.state.treeData}
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
                        const dialogData = Object.assign({ extraValue: {} }, rowInfo.node);
                        this.setState({ isEditting: true, openDialog: true, dialogData, rowInfo });
                      }}
                      style={{ marginLeft: 10, position: 'absolute', right: 50, top: 10 }}
                    >
                      <Edit />
                    </Fab>,
                    <Fab
                      color="secondary"
                      size="small"
                      style={{ marginLeft: 10, position: 'absolute', right: 5, top: 10 }}
                      title="Xóa"
                      disabled={rowInfo.node.disableDelete}
                      onClick={() => {
                        this.removeChild(rowInfo);
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
            title="Bạn có muốn xóa trạng thái này không?"
            openDialogRemove={this.state.openDialogRemove}
            handleClose={this.handleDialogRemove}
          />{' '}
          <Dialog open={this.state.openDialog} onClose={this.handleDialogAdd}>
            <DialogTitle id="alert-dialog-title">{this.state.isEditting ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}</DialogTitle>
            <DialogContent style={{ width: 600 }}>
              {/* <TextField
                id="standard-name"
                label="Tên danh mục"
                className={classes.textField}
                value={this.state.dialogData.title}
                onChange={event => {
                  var check = /^[a-z0-9_-]$/
                  const { dialogData } = this.state;
                  dialogData.title.length < 150 ? (dialogData.title = event.target.value) : (dialogData.title = dialogData.title.slice(0, -1));
                  
                  if(check.test(event.target.value) ===false ){
                    dialogData.title = ''
                  }
                  this.setState({ dialogData });
                }}

                error={this.state.dialogData.title === ''}
                margin="normal"
                name="name"
              /> */}
              <CustomInputBase
                label="Tên danh mục"
                className={classes.textField}
                value={this.state.dialogData.title}
                onChange={event => {
                  const { dialogData } = this.state;
                  dialogData.title.length < 150 ? (dialogData.title = event.target.value) : (dialogData.title = dialogData.title.slice(0, -1));
                  this.setState({ dialogData });
                }}
                name="code"
                error={this.state.dialogData.title === ''}
                // helperText={errors && errors.code}
              />
              {/* <TextField
                id="standard-value"
                label="Mã danh mục"
                className={classes.textField}
                value={this.state.dialogData.value}
                onChange={event => {
                  const { dialogData } = this.state;
                  dialogData.value = event.target.value;
                  this.setState({ dialogData });
                }}
                error={this.state.dialogData.value === ''}
                margin="normal"
                name="value"
              /> */}

              <CustomInputBase
                label="Mã danh mục"
                className={classes.textField}
                value={this.state.dialogData.value}
                onChange={event => {
                  const { dialogData } = this.state;
                  dialogData.value = event.target.value;
                  this.setState({ dialogData });
                }}
                name="code"
                error={this.state.dialogData.value === ''}
                // helperText={errors && errors.code}
              />
              {Array.isArray(extraFields) && extraFields.length > 0
                ? extraFields.map(
                    c =>
                      c.type !== 'String' ? (
                        <CustomInputField
                          options={c.menuItem ? c.menuItem : ''}
                          configType={c.configType ? c.configType : ''}
                          configCode={c.configCode ? c.configCode : ''}
                          type={c.type}
                          name={c.name}
                          label={c.title}
                          value={this.state.dialogData.extraValue ? this.state.dialogData.extraValue[c.title] : null}
                          onChange={(newVal, e) => {
                            const { dialogData } = this.state;
                            // console.log(newVal, e, 'hhh')
                            (dialogData.extraValue[c.title] =
                              c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number' || c.type === 'date'
                                ? newVal.target.value
                                : c.type === 'Date' && (c.filterType || c.dateFilterType)
                                  ? newVal.target.value
                                  : newVal),
                              this.setState({ dialogData });
                            console.log(this.state.dialogData, 'llll');
                          }}
                        />
                      ) : (
                        <TextField
                          label={c.title}
                          className={classes.textField}
                          value={this.state.dialogData.extraValue ? this.state.dialogData.extraValue[c.title] : null}
                          onChange={event => {
                            const { dialogData } = this.state;
                            // console.log(dialogData,'dialogData')
                            dialogData.extraValue[c.title] = event.target.value;
                            this.setState({ dialogData });
                          }}
                          // error={this.state.dialogData.extraValue.value === ''}
                          margin="normal"
                          name="value"
                        />
                      ),
                  )
                : null}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  // if (this.state.isEditting) {
                  //   this.setState({ openDialog: false });
                  //   this.updateChild();
                  //   this.props.data.data.map(item => console.log('props1', item.title))
                  // } else {
                  //   this.props.data.data.map(item => console.log('props2', item.title))
                  //   console.log('text',this.state.dialogData.title );
                  //   if (this.props.data.data) {
                  //     const title1 = this.props.data.data.map(item => item.title);
                  //     const value = this.state.dialogData.title;
                  //     if (title1.includes(value.toLowerCase().trim()) || title1.includes((value.charAt(0).toUpperCase() + value.slice(1)).trim())) {
                  //       alert('Tên cấu hình danh mục đã tồn tại')
                  //     } else this.addChild();
                  //   }
                  //   // this.addChild();
                  // }

                  if (this.props.data.data) {
                    const title1 = this.props.data.data.map(item => item.title);
                    const title2 = this.state.treeData.map(item => item.title);
                    // console.log('title1', title1);
                    const value = this.state.dialogData.title;
                    // if (title1.includes(value.toLowerCase().trim()) || title1.includes((value.charAt(0).toUpperCase() + value.slice(1)).trim())) {
                    //   this.props.onChangeSnackbar({ status: true, message: 'Tên cấu hình danh mục đã tồn tại', variant: 'warning' });
                    //   // alert('Tên cấu hình danh mục đã tồn tại')
                    // } else 
                    if (this.state.isEditting) {
                      this.setState({ openDialog: false });
                      this.updateChild();
                      this.props.onChangeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' });
                    } else {
                      // console.log('tree11111',  this.state.treeData);
                      if(title2.includes(value.toLowerCase().trim()) || title2.includes((value.charAt(0).toUpperCase() + value.slice(1)).trim())){
                        this.props.onChangeSnackbar({ status: true, message: 'Tên cấu hình danh mục đã tồn tại', variant: 'warning' });
                        // alert('Tên cấu hình danh mục đã tồn tại')
                      }else
                        this.addChild();
                    }
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

CategoryPage.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(CategoryPage);
