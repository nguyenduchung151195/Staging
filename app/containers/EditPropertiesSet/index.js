/**
 *
 * EditPropertiesSet
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import {
  Paper,
  TextField,
  Grid,
  Button,
  Typography,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Checkbox,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import { Edit, Menu, Close } from '@material-ui/icons';
import { DragDropContext } from 'react-beautiful-dnd';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Column from '../../components/ColumnProperty';
import makeSelectEditPropertiesSet from './selectors';
import CustomAppBar from 'components/CustomAppBar';

import reducer from './reducer';
import saga from './saga';
import { fetchPropertiesGroupAct, fetchPropertiesAct, getPropertiesSetAct, editPropertiesSetAct, resetNoti } from './actions';
import messages from './messages';
import { injectIntl } from 'react-intl';
import './style.css';
const Container = styled.div`
  display: contents;
`;
/* eslint-disable react/prefer-stateless-function */
export class EditPropertiesSet extends React.Component {
  state = {
    id: 0,
    name: '',
    code: '',
    description: '',
    search: '',
    targetUseProperties: {
      customer: false,
      Product: false,
      Package: false,
      Supplier: false,
      Employees: false,
      Machines: false,
      KCS: false,
    },

    tasks: [
      {
        id: '0',
        content: '',
        subItems: [],
      },
    ],
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: [],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: ['0'],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2'],
    item: [],

    errorName: false,
    errorCode: false,
    currentSet: null,
  };

  componentWillMount() {
    const { match } = this.props;
    this.props.onGetPropertiesSet(match.params.id);
    this.props.onGetProperties();
    this.props.onGetPropertiesGroup();
  }

  // componentDidMount() {
  //   const { addPropertiesSet } = this.props;
  //   console.log(addPropertiesSet);
  // }

  componentDidUpdate() {
    const { editPropertiesSet } = this.props;
    if (editPropertiesSet.successEdit) {
      this.props.enqueueSnackbar('Thao tác thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.history.value = 0;
      this.props.history.push('/setting/properties');
      this.props.onResetNoti();
    }
    if (editPropertiesSet.error) {
      this.props.enqueueSnackbar('Thao tác thất bại!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.onResetNoti();
    }
  }

  componentWillReceiveProps(props) {
    // console.log(this.state.tasks);
    if (props !== this.props) {
      const { editPropertiesSet } = props;
      if (editPropertiesSet.currentSet) {
        const { currentSet } = editPropertiesSet;
        this.setState({
          code: currentSet.code,
          name: currentSet.name,
          description: currentSet.describe,
          targetUseProperties: currentSet.objects,
          currentSet,
        });

        this.state.tasks = [
          {
            id: '0',
            content: '',
            subItems: [],
          },
        ];
        this.state.columns['column-1'].taskIds = [];
        if (
          editPropertiesSet.propertiesList &&
          // this.state.tasks[0].subItems.length === 0 &&
          this.state.columns['column-1'].taskIds.length === 0 &&
          this.state.tasks.length === 1 &&
          editPropertiesSet.propertiesGroup
        ) {
          const listPropsinUse = [];
          const groupInUse = [];
          const listProps = [];
          currentSet.attributeGroups.forEach(group => {
            const attr = [];
            group.attributes.forEach(item => {
              attr.push({
                id: item.attributeId,
                content: `($${item.code}) ${item.name}`,
                name: item.name,
                code: item.code,
              });
              listPropsinUse.push(item.attributeId);
            });
            groupInUse.push({
              id: group.attributeGroupId,
              content: `${group.name}`,
              subItems: attr,
            });
          });
          editPropertiesSet.propertiesList.forEach(item => {
            listProps.push({
              id: item.id,
              content: `($${item.code}) ${item.name}`,
              name: item.name,
              code: item.code,
            });
          });
          listPropsinUse.forEach(item => {
            listProps.forEach((prop, index) => {
              if (item === prop.id) {
                listProps.splice(index, 1);
              }
            });
          });
          this.state.tasks['0'].subItems = listProps;
          if (editPropertiesSet.propertiesGroup) {
            const group = [];
            const groupRaw = [];
            editPropertiesSet.propertiesGroup.forEach(item => {
              group.push({
                id: item.id,
                content: `${item.name}`,
                subItems: [],
              });
            });
            groupInUse.forEach(item => {
              group.forEach((prop, index) => {
                if (item.id === prop.id) {
                  group.splice(index, 1);
                }
              });
            });

            groupRaw.push(this.state.tasks[0]);
            group.forEach(item => {
              groupInUse.push(item);
            });
            groupInUse.unshift(this.state.tasks[0]);
            this.state.tasks = groupInUse;
            // console.log(this.state.tasks);
            this.state.tasks.forEach(n => {
              if (n.id !== '0') {
                this.state.columns['column-1'].taskIds.push(n.id);
              }
            });
          }
          this.state.item = this.state.tasks[0].subItems;
        }
      }
    }
  }

  render() {
    const { intl } = this.props;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    /* eslint-disable */
    this.state.tasks[0].subItems = this.state.item.filter(i => {
      // console.log(i)
      if (this.state.search === '') return true;
      if (i.content.toLocaleLowerCase().indexOf(this.state.search.toLocaleLowerCase()) > -1) return true;
    });
    // console.log('item', this.state.item)
    /* eslint-enable */
    return (
      <div>
        <CustomAppBar
          title={
            addStock === 'propertiesSet'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới bộ thuộc tính' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật bộ thuộc tính' })}`
          }
          onGoBack={this.goBack}
          onSubmit={this.onEdit}
        />
        <Helmet>
          <title>EditPropertiesSet</title>
          <meta name="description" content="Description of EditPropertiesSet" />
        </Helmet>
        {/* <Paper style={{ padding: 20, marginBottom: '20px' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/properties">
              Thuộc tính
            </Link>
            {this.state.id === 0 ? (
              <Typography color="textPrimary">Thêm mới bộ thuộc tính</Typography>
            ) : (
                <Typography color="textPrimary">Sửa nhóm thuộc tính</Typography>
              )}
          </Breadcrumbs>
        </Paper> */}
        <Paper style={{ padding: 20 }}>
          <Grid item container md={12} spacing={32}>
            <Grid item md={6}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin cơ bản bộ thuộc tính{' '}
                <span
                  style={{
                    color: '#A4A4A4',
                    fontStyle: 'italic',
                    fontWeight: 500,
                  }}
                >
                  Các trường có dấu * là cần nhập
                </span>
              </Typography>
              <FormControl style={{ width: '100%', margin: '10px auto' }}>
                <TextField
                  label="Tên bộ thuộc tính *"
                  value={this.state.name}
                  name="name"
                  onChange={this.handleChange}
                  // style={{ width: '100%', margin: '10px auto' }}
                />
                {this.state.errorName ? (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Không được để trống tên
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <FormControl style={{ width: '100%', margin: '10px auto' }}>
                <TextField
                  label="Mã bộ thuộc tính *"
                  value={this.state.code}
                  name="code"
                  // disabled={this.state.currentSet !== null}
                  onChange={this.handleChange}
                  // style={{ width: '100%', margin: '10px auto' }}
                />
                {this.state.errorCode ? (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Không được để trống mã
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <TextField
                label="Mô tả"
                value={this.state.description}
                name="description"
                onChange={this.handleChange}
                style={{ width: '100%', margin: '10px auto' }}
                multiline
                rows={4}
              />
              {/* <Button onClick={this.goBack} variant="contained" color="primary" style={{ marginTop: 20 }}>
                Quay lại
              </Button> */}
              &nbsp;
              {/* <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={this.onEdit}>
                Lưu
              </Button> */}
            </Grid>
            <Grid item md={6}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                Đối tượng sử dụng bộ thuộc tính
              </Typography>
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.customer}
                    onChange={this.handleChangeCheckbox('customer')}
                    value="customer"
                    color="primary"
                  />
                }
                label="Khách hàng"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Product}
                    onChange={this.handleChangeCheckbox('Product')}
                    value="Product"
                    color="primary"
                  />
                }
                label="Sản phẩm"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Package}
                    onChange={this.handleChangeCheckbox('Package')}
                    value="Package"
                    color="primary"
                  />
                }
                label="Gói sản phẩm"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Supplier}
                    onChange={this.handleChangeCheckbox('Supplier')}
                    value="Supplier"
                    color="primary"
                  />
                }
                label="Nhà cung cấp"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Employees}
                    onChange={this.handleChangeCheckbox('Employees')}
                    value="Employees"
                    color="primary"
                  />
                }
                label="Nhân viên"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.targetUseProperties.Machines}
                    onChange={this.handleChangeCheckbox('Machines')}
                    value="Machines"
                    color="primary"
                  />
                }
                label="Máy móc"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox checked={this.state.targetUseProperties.KCS} onChange={this.handleChangeCheckbox('KCS')} value="KCS" color="primary" />
                }
                label="KCS"
              />
            </Grid>
          </Grid>
          <Grid item md={12} container direction="column">
            <Typography
              component="p"
              style={{
                fontWeight: 550,
                fontSize: '18px',
                marginTop: 50,
                display: 'block',
              }}
            >
              Ghép nhóm thuộc tính
            </Typography>
            <Typography
              component="p"
              style={{
                fontSize: '13px',
                fontStyle: 'italic',
                display: 'block',
              }}
            >
              Kéo thả từng thuộc tính vào nhóm thuộc tính
            </Typography>
            <Grid item md={12} container spacing={24}>
              <Grid item md={6}>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                    marginLeft: 10,
                    marginTop: 20,
                  }}
                >
                  <Menu style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin Bộ thuộc tính
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                    marginLeft: 10,
                    display: 'inline-block',
                    marginTop: 20,
                  }}
                >
                  <Menu style={{ fontSize: '20px', marginBottom: '5px' }} /> Tất cả thuộc tính
                </Typography>
                <TextField
                  label="Tìm kiếm"
                  value={this.state.search}
                  variant="outlined"
                  style={{ marginLeft: 20 }}
                  name="search"
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
            {this.state.columns['column-1'].taskIds.length > 0 ? (
              <Grid item md={12} container>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Container item md={12}>
                    {this.state.columnOrder.map(columnId => {
                      const column = this.state.columns[columnId];
                      const tasks = [];

                      column.taskIds.forEach(item => {
                        this.state.tasks.forEach(task => {
                          if (task.id === item) {
                            tasks.push(task);
                          }
                        });
                      });

                      return <Column style={{ widh: '400px' }} key={column.id} column={column} tasks={tasks} />;
                    })}
                  </Container>
                </DragDropContext>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </Paper>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  goBack = () => {
    this.props.history.value = 0;
    this.props.history.push('/setting/properties');
  };

  onEdit = () => {
    const attributeGroups = [];
    const { tasks, name, code, description, targetUseProperties, currentSet } = this.state;
    tasks.forEach(item => {
      if (item.id !== '0' && item.subItems.length > 0) {
        const attributes = [];
        item.subItems.forEach(subItem => {
          attributes.push({
            name: subItem.name,
            attributeId: subItem.id,
          });
        });
        attributeGroups.push({
          name: item.content,
          attributeGroupId: item.id,
          attributes,
        });
      }
    });
    const body = {
      attributeGroups,
      name,
      code: code.trim(),
      describe: description,
      objects: targetUseProperties,
    };
    if (name === '' || code === '') {
      if (name === '') {
        this.setState({ errorName: true });
      }
      if (code === '') {
        this.setState({ errorCode: true });
      }
    } else {
      this.props.onEdit({ body, id: currentSet.id });
    }
    // this.state.tasks.forEach
  };

  handleChange = e => {
    if (e.target.name === 'name' || e.target.name === 'code') {
      if (e.target.name === 'name') {
        this.setState({ errorName: false });
      }
      if (e.target.name === 'code') {
        this.setState({ errorCode: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeCheckbox = name => event => {
    const { targetUseProperties } = this.state;
    const target = targetUseProperties;
    /* eslint-enable */
    target[name] = event.target.checked;
    this.setState({ targetUseProperties: target });
  };

  onDragEnd = result => {
    const { destination, source, type, draggableId } = result;
    const { tasks } = this.state;
    /* eslint-disable */
    if (type === 'droppableSubItem') {
      if (!result.destination) {
        return;
      }
      // const sourceIndex = result.source.index;
      // const destIndex = result.destination.index;
      const indexFrom = this.state.tasks[0].subItems.findIndex(item => {
        if (result.draggableId === item.id) return true;
      });
      if (indexFrom >= 0) {
        const indexTo = this.state.tasks.findIndex(item => {
          if (destination.droppableId === item.id) return true;
        });
        const currentItem = this.state.tasks[0].subItems[indexFrom];
        tasks[0].subItems.splice(indexFrom, 1);
        // tasks[indexTo].subItems.push(currentItem);
        tasks[indexTo].subItems.splice(destination.index, 0, currentItem);
      }
      if (indexFrom < 0) {
        const indexFr = this.state.tasks.findIndex(item => {
          if (destination.droppableId == item.id) return true;
        });
        if (indexFr < 0) {
          const indexFrom = this.state.tasks.findIndex(item => {
            if (source.droppableId === item.id) return true;
          });
          const currentItem = this.state.tasks[indexFrom].subItems.find(n => {
            if (n.id === draggableId) return true;
          });
          tasks[indexFrom].subItems.splice(source.index, 1);
          tasks[0].subItems.push(currentItem);
          tasks[0].subItems.splice(destination.index, 0, currentItem);
        } else {
          const indexFrom = this.state.tasks.findIndex(item => {
            if (source.droppableId === item.id) return true;
          });
          const currentItem = this.state.tasks[indexFrom].subItems.find(n => {
            if (n.id === draggableId) return true;
          });
          tasks[indexFrom].subItems.splice(source.index, 1);
          // tasks[indexFr].subItems.push(currentItem);
          tasks[indexFr].subItems.splice(destination.index, 0, currentItem);
        }
      }
      this.setState({ item: tasks[0].subItems });
      // tasks[0].subItems.splice(parseInt(index.id, 10), 1);
    }
    /* eslint-enable */
  };
}

EditPropertiesSet.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editPropertiesSet: makeSelectEditPropertiesSet(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetPropertiesGroup: () => {
      dispatch(fetchPropertiesGroupAct());
    },
    onGetProperties: () => {
      dispatch(fetchPropertiesAct());
    },
    onGetPropertiesSet: id => {
      dispatch(getPropertiesSetAct(id));
    },
    onEdit: body => {
      dispatch(editPropertiesSetAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'editPropertiesSet', reducer });
const withSaga = injectSaga({ key: 'editPropertiesSet', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(EditPropertiesSet);
