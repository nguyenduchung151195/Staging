/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/**
 *
 * BusinessStatus
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import styled from 'styled-components';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { Menu, Edit, Delete } from '@material-ui/icons';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, TextField, Fab } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import arrayMove from 'array-move';
import ColorPicker from 'material-ui-color-picker';

import styles from './styles';
import { fetchGetAllServices } from '../../containers/StockConfigPage/saga';

const DragHandle = sortableHandle(() => (
  <span style={{ cursor: 'pointer', marginRight: 10 }}>
    <Menu />
  </span>
));

const SortableItem = sortableElement(({ value, callBack }) => (
  <li
    style={{
      width: '100%',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);',
      borderRadius: 5,
      listStyle: 'none',
      color: 'white',
      padding: 10,
      margin: 2,
      background: value.color,
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ float: 'left', width: 'auto', marginTop: 7 }}>
      <DragHandle />
      {value.index !== undefined ? `${value.index}.${value.name}` : `${value.name}`}
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Fab
        onClick={() => {
          callBack('edit-status', value);
        }}
        size="small"
        color="primary"
        style={{ marginLeft: 5 }}
      >
        <Edit />
      </Fab>
      {value.isDelete ? (
        <Fab
          onClick={() => {
            callBack('delete-status', value._id);
          }}
          size="small"
          color="secondary"
          style={{ marginLeft: 5 }}
        >
          <Delete />
        </Fab>
      ) : null}
    </div>
  </li>
));

const SortableContainer = sortableContainer(({ children }) => <ul style={{ width: '100%', padding: 0 }}>{children}</ul>);
/* eslint-disable react/prefer-stateless-function */
class BusinessStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAdd: false,
      openFinal: false,
      isEditting: false,
      items: [],
      statusAdded: [],
      statusFail: [],
      dialogData: { name: '', color: '#FFFFFF', code: '', type: '' },
      dataClone: {},
      isUpdateSuccess: false,
    };
  }

  componentDidMount() {
    const statusAdded = [];
    const statusFail = [];

    this.props.data.data.forEach(element => {
      if (element.code === 2) {
        statusAdded.push(element);
      }
      if (element.code === 4) {
        statusFail.push(element);
      }
    });
    this.setState({
      statusAdded: statusAdded.sort((current, last) => current.index - last.index),
      statusFail: statusFail.sort((current, last) => current.index - last.index),
      items: this.props.data.data,
    });
  }

  componentWillUpdate(props) {
    this.state.items = props.data;
    const statusAdded = [];
    const statusFail = [];
    props.data.data.forEach(element => {
      if (element.code === 2) {
        statusAdded.push(element);
      }
      if (element.code === 4) {
        statusFail.push(element);
      }
    });
    this.state.statusAdded = statusAdded;
    this.state.statusFail = statusFail;
  }

  componentWillReceiveProps(props) {
    // console.log(props);
    const statusAdded = [];
    const statusFail = [];

    props.data.data.forEach(element => {
      if (element.code === 2) {
        statusAdded.push(element);
      }
      if (element.code === 4) {
        statusFail.push(element);
      }
    });
    this.setState({
      statusAdded: statusAdded.sort((current, last) => current.index - last.index),
      statusFail: statusFail.sort((current, last) => current.index - last.index),
      items: props.data.data,
    });
  }

  onSortEnd = ({ oldIndex, newIndex, collection }) => {
    if (oldIndex !== newIndex) {
      const { statusAdded, statusFail } = this.state;

      if (collection === 2) {
        const newArr = arrayMove(statusAdded, oldIndex, newIndex);
        newArr.forEach((element, index) => {
          newArr[index].index = index + 1;
        });
        this.setState({ statusAdded: newArr });
        this.props.callBack('update-status-index', newArr, this.props.data);
        // console.log(newArr);
      }

      if (collection === 4) {
        const newArr = arrayMove(statusFail, oldIndex, newIndex);
        newArr.forEach((element, index) => {
          newArr[index].index = index + 1;
        });
        this.setState({ statusAdded: statusFail });
        this.props.callBack('update-status-index', newArr, this.props.data);
      }
    }
  };

  onDrag(color) {
    const { dialogData } = this.state;
    dialogData.color = color;
    this.setState({
      dialogData,
    });
  }

  handleClickOpen = (name, code) => {
    this.setState({ [name]: true, dialogData: { name: '', color: '#FFFFFF', code, type: '' } });
  };

  handleCloseDialog = () => {
    this.setState({ openAdd: false, openFinal: false, dataClone: {} });
  };

  handleAddStatus = () => {
    // const { items } = this.state;
  };

  handleClose = () => {
    this.setState({ openAdd: false, isEditting: false , isUpdateSuccess: false});
  };

  callBack = (cmd, data, isUpdateSuccess) => {
    console.log(cmd, data, isUpdateSuccess, 'mxmxm');
    this.setState({ dataClone: data || {} , isUpdateSuccess: isUpdateSuccess || false})
    switch (cmd) {
      case 'delete-status':
        // eslint-disable-next-line no-restricted-globals
        // eslint-disable-next-line no-case-declarations
        const r = confirm('Bạn có muốn xóa trạng thái này?');
        if (r) {
          this.props.callBack('delete-status', data, this.props.data);
        }
        break;
      case 'edit-status':
        this.setState({ dialogData: Object.assign({}, data), openAdd: true, isEditting: true });
        break;
      default:
        break;
    }
  };
  handleCheckValidate = (dialogData, listData) => {
    console.log(dialogData, 'dialogData')
    const { dataClone } = this.state
    const { code, color, name, type } = dialogData
    if (!type) {
      alert("Vui lòng nhập mã của trạng thái!")
      return false
    }
    else if (!name) {
      alert("Vui lòng nhập tên của trạng thái!")
      return false
    }
    else if (!color) {
      alert("Vui lòng nhập màu của trạng thái!")
      return false
    } else {
      // check validate
      // console.log(da)
      const { data = [] } = listData
      const oldName = data.find(it => it.name === name) && data.find(it => it.name === name)._id !== dataClone._id
      const oldType = data.find(it => it.type === type) && data.find(it => it.type === type)._id !== dataClone._id
      if (oldName) {
        alert("Không được để trùng tên của trạng thái!")
        return false
      }
      else if (oldType) {
        alert("Không được để trùng mã của trạng thái!")
      } else {
        const reg = /\w/g;
        const regType = /^[a-zA-Z0-9]+$/
        const checkname = reg.test(name)
        const checktype = regType.test(type);
        if (checkname && checktype)
          return true
        else alert("Vui lòng nhập tên hoặc mã của trạng thái hợp lệ!")
      }


    }
  }
  render() {
    const { items } = this.state;

    const { classes } = this.props;
    return (
      <div style={{ width: '100%' }} className={classes.root}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Trạng thái khởi tạo</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SortableContainer useDragHandle>
              {items.filter(item => item.code === 1).map((value, index) => (
                <SortableItem {...this.props} key={`item-${value.index}`} index={index} value={value} color={value.color} callBack={this.callBack} />
              ))}
            </SortableContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Trạng thái được thêm</Typography>
          </ExpansionPanelSummary>
          <Button
            style={{ marginLeft: '1.8rem', marginBottom: '0px', marginTop: 0 }}
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => this.handleClickOpen('openAdd', 2)}
          >
            Thêm mới
          </Button>
          <ExpansionPanelDetails>
            <SortableContainer collection={2} onSortEnd={this.onSortEnd} useDragHandle>
              {this.state.statusAdded.map((value, index) => (
                <SortableItem collection={2} key={`item-${value.index}`} index={index} value={value} color={value.color} callBack={this.callBack} />
              ))}
            </SortableContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Grid container>
          <Grid md={12} item>
            <ExpansionPanel defaultExpanded style={{ marginBottom: 10 }}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Trạng thái hoàn thành</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <SortableContainer useDragHandle>
                  {items.filter(item => item.code === 3).map((value, index) => (
                    <SortableItem key={`item-${value.index}`} index={index} value={value} color={value.color} callBack={(cmd, data) => this.callBack(cmd, data, true)} />
                  ))}
                </SortableContainer>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid md={12} item>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Trạng thái thất bại</Typography>
              </ExpansionPanelSummary>
              <Button
                style={{ marginLeft: '1.8rem', marginBottom: '0px', marginTop: 0 }}
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => this.handleClickOpen('openAdd', 4)}
              >
                Thêm mới
              </Button>
              <ExpansionPanelDetails>
                <SortableContainer onSortEnd={this.onSortEnd} collection={4} useDragHandle>
                  {this.state.statusFail.map((value, index) => (
                    <SortableItem
                      collection={4}
                      key={`item-${value.index}`}
                      index={index}
                      value={value}
                      color={value.color}
                      callBack={this.callBack}
                    />
                  ))}
                </SortableContainer>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>

        <Dialog open={this.state.openAdd || this.state.openFinal} onClose={this.handleClose}>
          <DialogTitle id="alert-dialog-title">{this.state.isEditting ? 'Cập nhật trạng thái' : 'Thêm mới trạng thái'}</DialogTitle>
          <DialogContent style={{ width: 600, height: 300 }}>
            <TextField
              id="standard-name"
              label="Tên trạng thái *"
              className={classes.textField}
              value={this.state.dialogData.name}
              onChange={event => {
                const { dialogData } = this.state;
                const newData = dialogData;
                newData.name.length < 150 ? (newData.name = event.target.value) : (newData.name = newData.name.slice(0, -1));
                this.setState({ dialogData: newData });
              }}
              margin="normal"
              name="name"
              error={this.state.dialogData.name !== '' ? '' : 'Tên trạng thái không được để trống'}
              helperText={this.state.dialogData.name !== '' ? '' : 'Tên trạng thái không được để trống'}
            />
            <TextField
              id="standard-name"
              label="Mã"
              className={classes.textField}
              disabled={this.state.isUpdateSuccess}
              value={this.state.dialogData.type}
              onChange={event => {
                const { dialogData } = this.state;
                const newData = dialogData;
                newData.type = event.target.value;
                this.setState({ dialogData: newData });
              }}
              required
              margin="normal"
              name="name"
              error={this.state.dialogData.type === '' ? 'Mã trạng thái không được để trống' : ""
                // : this.state.dialogData.type === '1' ||
                // this.state.dialogData.type === '2' ||
                // this.state.dialogData.type === '3' ||
                // this.state.dialogData.type === '4' ? 'Mã trạng thái không được trùng mã code' : ''
              }
              helperText={this.state.dialogData.type === '' ? 'Mã trạng thái không được để trống' : ""
                // : this.state.dialogData.type === '1' ||
                // this.state.dialogData.type === '2' ||
                // this.state.dialogData.type === '3' ||
                // this.state.dialogData.type === '4' ? 'Mã trạng thái không được trùng mã code' : ''
              }
            />
            <div style={{ marginTop: 20 }}>
              <span style={{ fontSize: 14, marginTop: 10 }}>Màu sắc: </span>
              <ColorPicker
                name="color"
                defaultValue={this.state.dialogData.color}
                className={classes.textField}
                value={this.state.dialogData.color}
                onChange={color => this.onDrag(color)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={async () => {
                const checked = await this.handleCheckValidate(this.state.dialogData, this.props.data)
                if (checked) {

                  if (this.state.isEditting) {
                    this.props.callBack('update-status', this.state.dialogData, this.props.data);
                  } else {
                    this.props.callBack('add-status', this.state.dialogData, this.props.data);
                    // console.log(this.state.dialogData,'this.state.dialogData');
                    // console.log(this.props.data,'this.state.dialogData');
                  }
                  this.setState({
                    openAdd: false,
                    openFinal: false,
                    isEditting: false,
                    isUpdateSuccess: false,
                  });
                }
              }}
              variant="outlined"
              color="primary"
            >
              {this.state.isEditting ? 'LƯU' : 'LƯU'}
            </Button>
            <Button onClick={this.handleClose} variant="outlined" color="secondary" autoFocus>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

BusinessStatus.propTypes = {
  classes: PropTypes.object,
  items: PropTypes.array,
};

export default withStyles(styles)(BusinessStatus);
