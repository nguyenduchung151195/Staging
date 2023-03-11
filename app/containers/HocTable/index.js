/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-access-state-in-setstate */
/**
 *
 * HocTable
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import injectSaga from 'utils/injectSaga';
// import injectReducer from 'utils/injectReducer';
import * as lodash from 'lodash';
import {
  SortingState,
  SelectionState,
  PagingState,
  CustomPaging,
  SearchState,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedFiltering,
  IntegratedSorting,
  // TableColumnResizing,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableFixedColumns,
  PagingPanel,
  TableSelection,
  // SearchPanel,
  Toolbar,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import {
  withStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Button,
  Fab,
  FormControlLabel,
  Checkbox,
  MenuList,
  Menu,
  Typography,
  InputAdornment,
  ListItemText,
  Tooltip,
  Popover,
  DialogContentText,
} from '@material-ui/core';
import GridMUI from '@material-ui/core/Grid';
import { Add, Edit, Delete, Visibility, ImportExport, FilterList, Search } from '@material-ui/icons';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import MenuIcon from '@material-ui/icons/Menu';
import dot from 'dot-object';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import moment from 'moment';
import AddTask from 'containers/AddProjects';
import { SAVE_VIEWCONFIG_ON_RESIZE_DELAY } from '../../utils/constants';
import CustomInputField from 'components/Input/CustomInputField';
import {
  API_APPROVE_GROUPS,
  API_USERS_SEARCH,
  // API_SEARCH_ORIGANIZATION
} from '../../config/urlConfig';
import makeSelectHocTable, { makeSelectDashboardPage } from './selectors';
import { editViewConfigAction, resetNotis, getDynamicFormAction, exportForm, createApproveAct, setApproveFinish } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
// import { CustomSearchPanel } from './custom-search-panel';
import HOCCollectionDialog from '../../components/HocCollectionDialog';
import { SwipeableDrawer, Dialog as DialogUI, AssignTask } from '../../components/LifetekUi';
import { getDescendantProp, getAlternativeSortColumn } from '../../utils/common';
import { requestApprove } from '../../utils/request';
import styles from './styles';
import { serialize, printTemplte } from '../../helper';
import { STATE } from '../../config/const';
import { clientId } from '../../variable';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InputIcon from '@material-ui/icons/Input';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';

const HeaderCell = props => {
  if (props.column.name === 'actions') {
    return <TableHeaderRow.Cell {...props} draggingEnabled={false} />;
  }
  return <TableHeaderRow.Cell {...props} />;
};

export class HocTable extends React.Component {
  constructor(props) {
    super(props);
    const columnsOrder = [];
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfigLocalStorage.find(d => d.path === this.props.path);
    const { columns, others } = currentViewConfig && currentViewConfig.listDisplay && currentViewConfig.listDisplay.type.fields.type;
    let currentViewConfigColumns = [];
    if (others) {
      currentViewConfigColumns = [...columns, ...others];
    } else {
      currentViewConfigColumns = columns;
    }
    const columnsActive = [];
    currentViewConfigColumns.sort((a, b) => a.order - b.order).forEach(element => {
      if (element.checked) {
        columnsActive.push(element);
        columnsOrder.push(element.name);
      }
    });
    this.submitBtn = React.createRef();
    this.submitBtnPrint = React.createRef();
    this.submitBtnApproved = React.createRef();
    this.state = {
      printData: {},
      anchorEl: null,
      openPrint: false,
      formPrint: '',
      openApproved: false,
      openDrawer: false,
      dynamicForms: [],
      columns: columnsActive,
      rows: [],
      defaultOrder: columnsOrder,
      selection: [],
      currentPage: 0,
      pageSize: 20,
      pageSizes: [15, 30, 50],
      open: false,
      viewConfig: currentViewConfigColumns,
      openCollectionDialog: false,
      isEditting: false,
      editData: {},
      openToAddColumn: false,
      id: 'add',
      sortValue: {},
      sortingStateColumnExtensions: [{ columnName: 'kanbanStatus', sortingEnabled: false }],
      datatypesList: [
        {
          name: 'Kiểu chữ',
          type: 'string',
        },
        {
          name: 'Kiểu số',
          type: 'number',
        },
        {
          name: 'Kiểu ngày/tháng',
          type: 'date',
        },
      ],
      currentOrtherField: {
        name: '',
        type: 'string',
      },
      approvedObj: {
        name: '',
        subCode: '',
        form: '',
        group: null,
      },
      anchorFilter: false,
      namesFilter: ['name'],
      searchText: '',
      valueFilter: [],
      employeesFilter: [],
      employeeSelect: undefined,
      organizationunitSelect: undefined,
      filter: {},
      openDialogApprove: false,
      idDocumentApprove: undefined,
      dialogAssign: false,
      hasPermissionViewConfig: false,
      columnsData: [],
    };
    this.changeSelection = selection => this.setState({ selection });
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
  }

  changeCurrentPage(currentPage, sort) {
    const { valueFilter } = this.state;
    if (this.props.enableServerPaging === true) {
      if (this.props.isClone) {
        this.props.onGetAPI({
          query: {
            skip: currentPage * this.state.pageSize,
            limit: this.state.pageSize,
            filter: {
              $or: valueFilter,
            },
            sort: getAlternativeSortColumn(sort ? sort : this.state.sortValue, this.props.extraColumnsFirst),
          },
          collectionCode: this.props.collectionCode,
        });
      } else
        this.props.onGetAPI({
          skip: currentPage * this.state.pageSize,
          limit: this.state.pageSize,
          filter: {
            $or: valueFilter,
          },
          sort: getAlternativeSortColumn(sort ? sort : this.state.sortValue, this.props.extraColumnsFirst),
        });
    }
    this.setState({
      currentPage,
      selection: [],
    });
  }

  changePageSize = value => {
    this.setState({
      // loading: true,
      pageSize: value,
      currentPage: 0,
    });
    if (this.props.enableServerPaging === true) {
      if (this.props.isClone) {
        this.props.onGetAPI({
          query: {
            skip: 0 * value,
            limit: value,
          },
          collectionCode: this.props.collectionCode,
        });
      } else
        this.props.onGetAPI({
          skip: 0 * value,
          limit: value,
        });
    }
  };

  componentDidMount() {
    this.props.onRef ? this.props.onRef(this) : null;
    this.props.onGetDynamicForm(this.props.collectionCode);
    if (this.props.enableServerPaging === true) {
      if (this.props.isClone) {
        // this.props.onGetAPI({
        //   query: {
        //     skip: this.state.currentPage * this.state.pageSize,
        //     limit: this.state.pageSize,
        //   },
        //   collectionCode: this.props.collectionCode,
        // });
      } else {
        this.props.onGetAPI({
          skip: this.state.currentPage * this.state.pageSize,
          limit: this.state.pageSize,
        });
      }
    }

    if (this.props.data !== undefined) {
      const { sortingStateColumnExtensions } = this.state;
      const newProps = Object.assign({}, this.props);
      const columnsOrder = [];
      const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = viewConfigLocalStorage.find(d => d.path === this.props.path);
      const { columns, others } = currentViewConfig.listDisplay.type.fields.type;
      let currentViewConfigColumns = [];
      if (others) {
        currentViewConfigColumns = [...columns, ...others];
      } else {
        currentViewConfigColumns = columns;
      }
      const columnsActive = [];
      currentViewConfigColumns
        .filter(item => !item.type.includes('ObjectId') || (item.type.includes('ObjectId') && item.name === 'kanbanStatus'))
        .sort((a, b) => a.order - b.order)
        .forEach(element => {
          if (element.checked) {
            columnsActive.push(element);
            columnsOrder.push(element.name);
            if (element.type !== 'String' && element.type !== 'Number' && element.type !== 'Date') {
              sortingStateColumnExtensions.push({ columnName: element.name, sortingEnabled: false });
            }
          }
        });
      if (this.props.extraColumns) {
        this.props.extraColumns.forEach(element => {
          columnsOrder.push(element.columnName);
          columnsActive.push({ name: element.columnName, title: element.columnTitle });
        });
      }
      if (this.props.extraColumnsFirst) {
        this.props.extraColumnsFirst.forEach(e => {
          columnsOrder.unshift(e.columnName);
          columnsActive.unshift({ name: e.columnName, title: e.columnTitle });
        });
      }
      if (newProps.enableEdit) {
        columnsOrder.push('actions');
      }
      let newColumns;
      if (newProps.enableEdit) {
        newColumns = [...columnsActive, { name: 'actions', title: 'Hành động' }];
      } else {
        newColumns = columnsActive;
      }
      this.setState({
        rows: newProps.data,
        sortingStateColumnExtensions,
        columns: newColumns,
        columnsData: newColumns.map(item => ({
          columnName: item.name,
          width: item.width || 120,
        })),
        defaultOrder: columnsOrder,
        viewConfig: currentViewConfigColumns,
        filterField: currentViewConfig.filterField,
        filterFieldValue: currentViewConfig.filterFieldValue,
      });
    }
  }

  componentWillMount() {
    this.state.approvedObj.subCode = this.props.dialogTitle;
  }

  componentWillReceiveProps(props) {
    if (props.data !== undefined) {
      const newProps = Object.assign({}, props);
      const columnsOrder = [];
      const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = viewConfigLocalStorage.find(d => d.path === props.path);
      const { columns, others } = currentViewConfig.listDisplay.type.fields.type;
      const { dashboardPage } = this.props;
      let currentRole;
      if (dashboardPage.role.roles) {
        currentRole = dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.collectionCode);
      }
      let functionAllow = [];
      if (currentRole) {
        functionAllow = currentRole.methods.filter(item => item.allow).map(item => item.name);
      }
      if (functionAllow.includes('VIEWCONFIG')) {
        this.state.hasPermissionViewConfig = true;
      } else {
        this.state.hasPermissionViewConfig = false;
      }
      let currentViewConfigColumns = [];
      if (others) {
        currentViewConfigColumns = [...columns, ...others];
      } else {
        currentViewConfigColumns = columns;
      }
      const columnsActive = [];
      currentViewConfigColumns
        .filter(item => !item.type.includes('ObjectId') || (item.type.includes('ObjectId') && item.name === 'kanbanStatus'))
        .sort((a, b) => a.order - b.order)
        .forEach(element => {
          if (element.checked) {
            columnsActive.push(element);
            columnsOrder.push(element.name);
          }
        });
      if (this.props.extraColumns) {
        this.props.extraColumns.forEach(element => {
          columnsOrder.push(element.columnName);
          columnsActive.push({ name: element.columnName, title: element.columnTitle });
        });
      }
      if (this.props.extraColumnsFirst) {
        this.props.extraColumnsFirst.forEach(e => {
          columnsOrder.unshift(e.columnName);
          columnsActive.unshift({ name: e.columnName, title: e.columnTitle });
        });
      }
      if (newProps.enableEdit) {
        columnsOrder.push('actions');
      }

      let newColumns;
      if (newProps.enableEdit && functionAllow.includes('PUT')) {
        newColumns = [...columnsActive, { name: 'actions', title: 'Hành động' }];
      } else {
        newColumns = columnsActive;
      }

      if (JSON.stringify(this.state.defaultOrder) !== JSON.stringify(columnsOrder)) {
        this.state.rows = newProps.data;
        this.state.columns = newColumns;
        this.state.defaultOrder = columnsOrder;
        this.state.viewConfig = currentViewConfigColumns;
      } else {
        this.state.rows = newProps.data;
        this.state.columns = newColumns;
        this.state.viewConfig = currentViewConfigColumns;
      }
      const { hocTable } = props;
      if (hocTable.dynamicForms !== undefined) {
        this.state.dynamicForms = hocTable.dynamicForms;
      }

      this.props.onResetNotis();
    }
    if (props !== this.props && props.pageDetail !== this.props.pageDetail) {
      this.state.currentPage = props.pageDetail.currentPage;
    }
    if (
      props.dashboardPage &&
      props.dashboardPage.docUpdated &&
      props.dashboardPage.docUpdated.data &&
      (!this.props.dashboardPage.docUpdated ||
        (props.dashboardPage.docUpdated.moduleCode === props.code &&
          props.dashboardPage.docUpdated.data !== this.props.dashboardPage.docUpdated.data))
    ) {
      console.log('in hoc table', props.dashboardPage.docUpdated);
    }
  }

  callBack = (command, data, extraData) => {
    switch (command) {
      case 'edit-click':
        if (this.props.handleEditClick) {
          this.props.handleEditClick(data);
        } else {
          this.setState({ openCollectionDialog: true, isEditting: true, editData: data });
        }

        break;
      case 'add-click':
        if (this.props.handleAddClick !== undefined) {
          this.props.handleAddClick();
        } else {
          this.setState({ openCollectionDialog: true, isEditting: false });
        }
        break;

      case 'delete-click': {
        if (this.props.useConfirm) {
          const r = confirm('Bạn có muốn xóa những mục đã chọn?');
          if (r) {
            this.props.handleDeleteClick(this.state.selection);
          }
        } else {
          this.props.handleDeleteClick(this.state.selection);
        }
        this.setState({ selection: [] });
        break;
      }
      case 'delete-success':
        this.setState({ selection: [] });
        break;
      case 'create-new':
        if (this.props.callBack) {
          if (extraData.length !== 0) {
            this.handleUpdateViewConfig(extraData);
          }
          this.props.callBack('create-new', data);
          this.setState({ openCollectionDialog: false });
        }
        break;
      case 'update':
        if (this.props.callBack) {
          if (extraData.length !== 0) {
            this.handleUpdateViewConfig(extraData);
          }
          this.setState({ openCollectionDialog: false });
          this.props.callBack('update', data);
        }
        break;
      case 'print':
        printTemplte(data, extraData._id, this.props.collectionCode, this.props.isClone);
        // this.props.onExportForm(this.props.collectionCode, data, extraData, this.state.viewConfig);
        break;
      case 'change-pass':
        // console.log('xxxx', data);
        this.props.changePassFunc(data);
        // this.props.onExportForm(this.props.collectionCode, data, extraData, this.state.viewConfig);
        break;
      default:
        break;
    }
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChecked = e => {
    const { viewConfig, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, checked: e.target.checked };
    if (filterField && filterFieldValue) {
      const newColumns = viewConfig.map(item => {
        if (item.name === curentColumns.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.value]) {
            item.filterConfig[filterFieldValue.value] = {};
          }
          item.filterConfig[filterFieldValue.value].checked = e.target.checked;
        }
        return item;
      });
      this.setState({ viewConfig: newColumns });
    } else {
      const newColumns = viewConfig.map(item => (item.name === curentColumns.name ? { ...item, checked: e.target.checked } : item));
      this.setState({ viewConfig: newColumns });
    }
  };

  isChecked = (name, key) => {
    const itemFound = this.state.viewConfig.find(item => item.name === name);
    if (!itemFound) return false;

    const { filterField, filterFieldValue } = this.state;
    if (filterField && filterFieldValue && itemFound.filterConfig && itemFound.filterConfig[filterFieldValue.value]) {
      return itemFound.filterConfig[filterFieldValue.value][key];
    }
    return itemFound[key];
  };

  handleCheckedRequireForm = e => {
    const { viewConfig, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, checkedRequireForm: e.target.checked };
    if (e.target.checked) {
      if (filterField && filterFieldValue) {
        const newColumns = viewConfig.map(item => {
          if (item.name === curentColumns.name) {
            if (!item.filterConfig) {
              item.filterConfig = {};
            }
            if (!item.filterConfig[filterFieldValue.value]) {
              item.filterConfig[filterFieldValue.value] = {};
            }
            item.filterConfig[filterFieldValue.value].checkedRequireForm = e.target.checked;
            item.filterConfig[filterFieldValue.value].checkedShowForm = e.target.checked;
          }
          return item;
        });
        this.setState({ viewConfig: newColumns });
      } else {
        const newColumns = viewConfig.map(
          item => (item.name === curentColumns.name ? { ...item, checkedRequireForm: e.target.checked, checkedShowForm: e.target.checked } : item),
        );
        this.setState({ viewConfig: newColumns });
      }
    } else {
      if (filterField && filterFieldValue) {
        const newColumns = viewConfig.map(item => {
          if (item.name === curentColumns.name) {
            if (!item.filterConfig) {
              item.filterConfig = {};
            }
            if (!item.filterConfig[filterFieldValue.value]) {
              item.filterConfig[filterFieldValue.value] = {};
            }
            item.filterConfig[filterFieldValue.value].checkedRequireForm = e.target.checked;
          }
          return item;
        });
        this.setState({ viewConfig: newColumns });
      } else {
        const newColumns = viewConfig.map(item => (item.name === curentColumns.name ? { ...item, checkedRequireForm: e.target.checked } : item));
        this.setState({ viewConfig: newColumns });
      }
    }
  };

  handleCheckedShowForm = e => {
    const { viewConfig, filterField, filterFieldValue } = this.state;
    const curentColumns = { name: e.target.name, checkedShowForm: e.target.checked };
    if (filterField && filterFieldValue) {
      const newColumns = viewConfig.map(item => {
        if (item.name === curentColumns.name) {
          if (!item.filterConfig) {
            item.filterConfig = {};
          }
          if (!item.filterConfig[filterFieldValue.value]) {
            item.filterConfig[filterFieldValue.value] = {};
          }
          item.filterConfig[filterFieldValue.value].checkedShowForm = e.target.checked;
        }
        return item;
      });
      this.setState({ viewConfig: newColumns });
    } else {
      const newColumns = viewConfig.map(item => (item.name === curentColumns.name ? { ...item, checkedShowForm: e.target.checked } : item));
      this.setState({ viewConfig: newColumns });
    }
  };

  resetSelection = () => {
    this.setState({ selection: [] });
  };

  handleUpdateViewConfig = newOthers => {
    const { viewConfig, filterField, filterFieldValue } = this.state;
    const columns = [];
    const others = [];

    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentIndex = viewConfigLocalStorage.indexOf(viewConfigLocalStorage.find(d => d.path === this.props.path));

    viewConfig.forEach(element => {
      if (!element.name.includes('others.')) {
        columns.push(element);
      } else {
        others.push(element);
      }
    });
    viewConfigLocalStorage[currentIndex].filterField = filterField;
    viewConfigLocalStorage[currentIndex].filterFieldValue = filterFieldValue;
    viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type.columns = columns;
    if (newOthers !== null) {
      viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type.others = [...others, ...newOthers];
    } else {
      viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type.others = others;
    }

    this.props.onEditViewConfig(viewConfigLocalStorage[currentIndex]);
    const columnsActive = [];
    viewConfig.forEach(element => {
      if (element.checked) {
        columnsActive.push(element);
      }
    });

    if (this.props.enableEdit) {
      columnsActive.push({ name: 'actions', title: 'Hành động' });
    }

    this.setState({
      columnsData: [
        ...columnsActive.map(item => ({
          columnName: item.name,
          width: item.width || 120,
        })),
        ...this.handleExtraColumns(),
      ],
      columns: columnsActive,
      open: false,
    });
  };

  handleExtraColumns = () => {
    if (!!this.props.extraColumns) {
      return this.props.extraColumns.map(item => ({
        columnName: item.columnName,
        width: 120,
      }));
    }
    return [];
  };

  handleResizeWidth = lodash.debounce(newColumnsData => {
    let { viewConfig } = this.state;
    const columns = [];
    const others = [];

    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentIndex = viewConfigLocalStorage.indexOf(viewConfigLocalStorage.find(d => d.path === this.props.path));
    if (Array.isArray(newColumnsData) && newColumnsData.length) {
      viewConfig = viewConfig.map(vc => ({
        ...vc,
        width: (newColumnsData.find(ncd => vc.name === ncd.columnName) || { width: 120 }).width,
      }));
    }
    viewConfig.forEach(element => {
      if (!element.name.includes('others.')) {
        columns.push(element);
      } else {
        others.push(element);
      }
    });
    viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type.columns = columns;
    viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type.others = others;
    this.props.onEditViewConfig(viewConfigLocalStorage[currentIndex]);
  }, SAVE_VIEWCONFIG_ON_RESIZE_DELAY);

  changeColumnOrder = newOrder => {
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentIndex = viewConfigLocalStorage.indexOf(viewConfigLocalStorage.find(d => d.path === this.props.path));
    const { viewConfig } = this.state;
    const { extraColumns } = this.props;
    viewConfig.forEach((element, index) => {
      viewConfig[index].order = newOrder.findIndex(d => d === element.name);
    });
    const fixedColumns = [];
    if (extraColumns) {
      extraColumns.forEach(element => {
        fixedColumns.push(element.columnName);
      });
    }
    if (this.props.enableEdit) {
      fixedColumns.push('actions');
    }
    const tempColumns = newOrder.slice(newOrder.length - fixedColumns.length);

    if (JSON.stringify(tempColumns) === JSON.stringify(fixedColumns)) {
      const newColumns = [];
      const newOthers = [];
      const { columns, others } = viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type;
      columns.forEach(element => {
        newColumns.push(viewConfig[viewConfig.findIndex(d => d.name === element.name)]);
      });
      if (others) {
        others.forEach(element => {
          newOthers.push(viewConfig[viewConfig.findIndex(d => d.name === element.name)]);
        });
      }
      viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type.columns = newColumns;
      viewConfigLocalStorage[currentIndex].listDisplay.type.fields.type.others = newOthers;
      this.setState({ defaultOrder: newOrder });
      this.props.onEditViewConfig(viewConfigLocalStorage[currentIndex]);
    }
  };
  getUrl() {
    const res = window.location.pathname.split('/');
    const path = this.props.path ? this.props.path : res[res.length - 1];
    return path;
  }

  render() {
    const {
      columns,
      selection,
      pageSizes,
      pageSize,
      currentPage,
      viewConfig,
      rows,
      defaultOrder,
      datatypesList,
      currentOrtherField,
      columnsData,
      id,
      filterField,
    } = this.state;

    const { dashboardPage } = this.props;
    let filterFieldConfig = {};
    if (filterField) {
      filterFieldConfig = viewConfig.find(i => i.name === filterField) || {};
    }
    let currentRole;
    if (dashboardPage.role.roles) {
      currentRole = dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.collectionCode);
    }
    let functionAllow = [];
    if (currentRole) {
      functionAllow = currentRole.methods.filter(item => item.allow).map(item => item.name);
    }
    const tableColumnExtensions = [];
    let sortedKanbanStatus = [];
    if (this.props.crmStatusCode) {
      const localStorageStatus = JSON.parse(localStorage.getItem('crmStatus'));
      const tableStatus = localStorageStatus.find(d => d.code === this.props.crmStatusCode);
      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      tableStatus.data.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push(item);
            break;
          case 2:
            laneAdd.push(item);
            break;
          case 3:
            laneSucces.push(item);
            break;
          case 4:
            laneFail.push(item);
            break;
          default:
            break;
        }
      });
      sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    }

    defaultOrder.forEach(element => {
      tableColumnExtensions.push({ columnName: element });
    });
    if (this.props.enableEdit) {
      tableColumnExtensions.push({ columnName: 'actions', width: 160, align: 'center' });
    }

    const { customColumns, extraColumns, extraColumnsFirst } = this.props;

    const newRows = Array.from(rows).map(item => {
      const newProps = Object.assign({}, this.props);
      const newItem = Object.assign({}, item);
      viewConfig.forEach(element => {
        if (element.type === 'Date') {
          if (newItem[element.name]) {
            newItem[element.name] = moment(newItem[element.name]).format('DD-MM-YYYY');
          }
        }
        if (element.type.includes('Relation|')) {
          if (newItem[element.name]) {
            const select = JSON.parse(element.type.replace('Relation|', '').replace(/'/g, '"')).select;
            if (item._refData) {
              const cuRefData = item._refData.find(refItem => refItem._id === newItem[element.name]);
              // newItem[element.name] = cuRefData?cuRefData[select]:'';

              if (cuRefData) {
                const dataRefFornewItem = cuRefData ? cuRefData[select] : '';
                if (typeof dataRefFornewItem !== 'object') {
                  if (select) {
                    newItem[element.name] = cuRefData ? getDescendantProp(cuRefData, select) : '';
                  }
                }
              }
            }
          }
        }
      });
      const data = Object.assign({}, item);

      if (newItem.others) {
        const listOthers = Object.keys(newItem.others);
        listOthers.forEach(element => {
          newItem[`others.${element}`] = newItem.others[element];
        });
      }
      // handle trạng thái phê duyệt
      const stateColumn = columns.find(column => column.name === 'state');
      if (stateColumn) {
        if (stateColumn.checked) {
          if (STATE.APPROVAL_REQUIREMENT === Number(newItem.state)) newItem.state = <span style={{ color: '#f0ad4e' }}>Đang yêu cầu phê duyệt</span>;
          if (STATE.APPROVED === Number(newItem.state))
            newItem.state = (
              <Tooltip title="Click vào để hoàn thành">
                <Button
                  onClick={() => this.handleOpenDialogApprove(newItem._id)}
                  variant="outlined"
                  color="primary"
                  style={{ textTransform: 'none' }}
                >
                  Đã phê duyệt
                </Button>
              </Tooltip>
            );
          if (STATE.REJECTED === Number(newItem.state)) newItem.state = <span style={{ color: 'red' }}>Không được phê duyệt</span>;
          if (STATE.NOT_APPROVAL_REQUIREMENT === Number(newItem.state)) newItem.state = <span>Không yêu cầu phê duyệt</span>;
          if (STATE.FINISHED === Number(newItem.state)) newItem.state = <span style={{ color: 'green' }}>Hoàn thành</span>;
        }
      }
      if (customColumns !== undefined) {
        customColumns.forEach(element => {
          const { columnName, CustomComponent, display } = element;
          const columnConfig = viewConfig[viewConfig.findIndex(d => d.name === columnName)];
          if (display !== 'none') {
            newItem[columnName] = (
              <CustomComponent
                columnConfig={columnConfig}
                kanbanProps={this.props.crmStatusCode ? sortedKanbanStatus : newProps.kanbanStatuses}
                item={data}
                customClick={msg => {
                  this.props.callBack('custom-click', data, msg);
                }}
              />
            );
          } else {
            // tableColumnExtensions.splice(tableColumnExtensions.findIndex(d => d.columnName === columnName), 1);
            // columns.splice(columns.findIndex(d => d.name === columnName), 1);
          }
        });
      }

      if (extraColumns !== undefined) {
        extraColumns.forEach(element => {
          const data = Object.assign({}, item);
          const { columnName, CustomComponent } = element;
          newItem[columnName] = (
            <CustomComponent
              kanbanProps={this.props.crmStatusCode ? sortedKanbanStatus : newProps.kanbanStatuses}
              item={data}
              customClick={msg => {
                this.props.callBack('custom-click', data, msg);
              }}
            />
          );
        });
      }
      if (extraColumnsFirst !== undefined) {
        extraColumnsFirst.forEach(e => {
          const data = Object.assign({}, item);
          const { columnName, CustomComponent } = e;
          newItem[columnName] = (
            <CustomComponent
              kanbanProps={this.props.crmStatusCode ? sortedKanbanStatus : newProps.kanbanStatuses}
              item={data}
              customClick={msg => {
                this.props.callBack('custom-click', data, msg);
              }}
            />
          );
        });
      }
      return {
        ...newItem,
        actions: functionAllow.includes('PUT') ? (
          <div>
            <Fab
              size="small"
              // color="primary"
              onClick={() => {
                this.callBack('edit-click', item);
              }}
            >
              <Edit fontSize="small" />
            </Fab>
            {this.props.enableExportForm === false || this.props.enableApproved === false ? (
              ''
            ) : (
              <span className="mx-2">
                <Fab
                  size="small"
                  // color="primary"
                  aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                  aria-haspopup="true"
                  onClick={event => {
                    this.setState({ anchorEl: event.currentTarget, printData: item });
                  }}
                >
                  <MenuIcon fontSize="small" />
                </Fab>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={() => {
                    this.setState({ anchorEl: null });
                  }}
                  on
                >
                  <MenuItem
                    onClick={() => {
                      this.setState({ anchorEl: null, dialogAssign: true });
                    }}
                  >
                    Giao việc
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      this.setState({ anchorEl: null, openDrawer: true });
                    }}
                  >
                    Tạo công việc
                  </MenuItem>
                  {this.props.enableExportForm !== false ? (
                    <MenuItem
                      onClick={() => {
                        this.setState({ anchorEl: null, openPrint: true });
                      }}
                    >
                      Xuất biểu mẫu
                    </MenuItem>
                  ) : (
                    ''
                  )}
                  {this.props.enableApproved ? (
                    <MenuItem
                      onClick={() => {
                        this.setState({ anchorEl: null, openApproved: true });
                      }}
                    >
                      Yêu cầu phê duyệt
                    </MenuItem>
                  ) : (
                    ''
                  )}
                  {/* {this.props.enableDelivery ? (
                    <MenuItem
                      onClick={() => {
                        this.setState({ anchorEl: null, openApproved: true });
                      }}
                    >
                      Tạo yêu cầu giao hàng
                    </MenuItem>
                  ) : (
                    ''
                  )} */}

                  <MenuItem>Gửi mail</MenuItem>
                  <MenuItem>Gọi điện</MenuItem>
                  <MenuItem>SMS</MenuItem>
                  {this.props.changePass ? (
                    <MenuItem
                      onClick={() => {
                        this.callBack('change-pass', Object.assign({}, this.state.printData));
                      }}
                    >
                      Đổi mật khẩu
                    </MenuItem>
                  ) : null}
                  {this.props.moreActions && this.props.moreActions.map(action => action(item))}
                </Menu>
              </span>
            )}
            {this.props.customActions
              ? this.props.customActions.map(btn => (
                  <Fab
                    className="mx-2"
                    size="small"
                    color="primary"
                    onClick={() => {
                      this.props.handleCustomAction(btn.cmd, item);
                    }}
                  >
                    <btn.IconAction fontSize="small" />
                  </Fab>
                ))
              : ''}
          </div>
        ) : null,
      };
    });

    const itemCurrent = dot.object(Object.assign({}, this.state.printData));

    const newColumnsData = [...columnsData];
    columns.forEach(c => {
      const foundColumn = newColumnsData.find(cData => cData.columnName === c.name);
      if (!foundColumn) {
        newColumnsData.push({
          columnName: c.name,
          width: c.width || 120,
        });
      }
    });
    const dynamicFormByFilter = this.state.dynamicForms.filter((item, index) => {
      if (!item.filterField) return true;
      if (item.filterFieldValue && item.filterFieldValue.value === itemCurrent[item.filterField]) {
        return true;
      }
      return false;
    });
    return (
      <div>
        <Paper style={{ position: 'relative' }} className="CustomListTable">
          <Grid rows={newRows} columns={columns}>
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            <SortingState onSortingChange={this.changeSort} columnExtensions={this.state.sortingStateColumnExtensions} />
            <SearchState defaultValue="" />
            <IntegratedFiltering />
            {this.props.enableDelete === false ? '' : <SelectionState selection={selection} onSelectionChange={this.changeSelection} />}
            {this.props.enableServerPaging === true ? <CustomPaging totalCount={this.props.pageDetail.totalCount} /> : ''}

            {this.props.enableServerPaging === true ? '' : <IntegratedPaging />}
            {this.props.enableDelete === false ? '' : <IntegratedSelection />}
            <IntegratedSorting />
            <DragDropProvider />
            <Table columnExtensions={tableColumnExtensions} />
            <TableColumnResizing
              columnWidths={newColumnsData}
              onColumnWidthsChange={value => {
                this.setState({ columnsData: value });
                this.handleResizeWidth(value);
              }}
            />
            <TableHeaderRow showSortingControls cellComponent={HeaderCell} />

            <TableColumnReordering order={defaultOrder} onOrderChange={this.changeColumnOrder} />
            {this.props.enableDelete === false ? '' : <TableSelection showSelectAll />}
            {this.props.enableEdit ? <TableFixedColumns rightColumns={['actions']} /> : ''}
            <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={pageSizes} />

            <Toolbar
              rootComponent={({ children }) => (
                <div className="p-3">
                  <div style={{ float: 'left' }}>{children}</div>
                  <div style={{ float: 'right' }}>
                    <div className="text-right align-item-center">
                      {selection.length > 0 ? <span className="mx-3">Đã chọn: {selection.length}</span> : ''}

                      {selection.length > 0 && functionAllow.includes('DELETE') ? (
                        <Fab
                          onClick={() => {
                            this.callBack('delete-click');
                          }}
                          size="small"
                          color="secondary"
                        >
                          <Delete />
                        </Fab>
                      ) : (
                        <div>
                          {this.props.disableAdd || !functionAllow.includes('POST') ? null : (
                            <Tooltip title="Thêm mới">
                              <Fab
                                className="mx-2"
                                onClick={() => {
                                  this.callBack('add-click');
                                }}
                                size="small"
                                color="primary"
                                aria-label="Add"
                              >
                                <Add />
                              </Fab>
                            </Tooltip>
                          )}
                          {this.props.newSettingBar
                            ? this.props.newSettingBar.map(
                                item =>
                                  item ? (
                                    <Fab className="mx-2" size="small" color="primary" aria-label="History">
                                      <Link to={`${this.getUrl()}/history`}>{item}</Link>
                                    </Fab>
                                  ) : null,
                              )
                            : null}
                          {this.props.disableImport || !functionAllow.includes('IMPORT') ? null : (
                            <Tooltip title="Nhập excel">
                              <Link to={`/import?type=${this.props.collectionCode}`}>
                                <Fab className="mx-2" size="small" color="primary" aria-label="Add">
                                  <ImportExport />
                                </Fab>
                              </Link>
                            </Tooltip>
                          )}

                          {!this.state.hasPermissionViewConfig ? null : (
                            <Tooltip title="Cấu hình bảng">
                              <Fab
                                onClick={() => {
                                  this.setState({
                                    open: true,
                                  });
                                }}
                                size="small"
                                color="primary"
                                aria-label="Add"
                                className="ml-2"
                              >
                                <Visibility />
                              </Fab>
                            </Tooltip>
                          )}
                        </div>
                      )}
                      <div className="clearfix" />
                    </div>
                  </div>
                  <div style={{ clear: 'both' }} />
                </div>
              )}
            />
            {this.props.disableSearch ? null : (
              <div style={{ marginLeft: 25, position: 'absolute', display: 'flex', alignItems: 'center' }}>
                <TextField
                  margin="dense"
                  placeholder="Tìm kiếm..."
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment style={{ cursor: 'pointer' }} position="end">
                        <FilterList onClick={this.handleClickOpenFilter} />
                      </InputAdornment>
                    ),
                  }}
                  onChange={e => {
                    if (this.props.disableSearchServer) {
                      const { namesFilter } = this.state;
                      this.props.handleSearchCustom(e.target.value, namesFilter);
                    } else {
                      this.handleOnChangeSearch(e);
                    }
                  }}
                />

                <div>
                  {/* <Tooltip title="Lọc tìm kiếm">
                    <Fab
                      buttonRef={node => {
                        this.anchorEl = node;
                      }}
                      color="primary"
                      style={{ marginLeft: 10 }}
                      size="small"
                      aria-owns={Boolean(this.state.anchorFilter) ? 'long-menu' : undefined}
                      aria-haspopup="true"
                      onClick={this.handleClickOpenFilter}
                    >
                      <FilterList />
                    </Fab>
                  </Tooltip> */}
                  {this.props.customToolbar ? this.props.customToolbar.map(Element => <Element />) : ''}

                  <Popover
                    open={Boolean(this.state.anchorFilter)}
                    anchorEl={this.state.anchorFilter}
                    anchorReference="anchorEl"
                    anchorPosition={{ top: 200, left: 400 }}
                    onClose={this.handleClickCloseFilter}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                      <div>
                        <Typography style={{ paddingTop: 10 }} variant="h6" align="center">
                          Chọn trường tìm kiếm
                        </Typography>
                        <MenuList style={{ overflow: 'auto' }}>
                          {this.props.collectionCode === 'ExchangingAgreement'
                            ? viewConfig
                                .filter(
                                  item =>
                                    // !item.type.includes('ObjectId') &&
                                    // !item.type.includes('Date') &&
                                    // !item.type.includes('Number') &&
                                    // !item.type.includes('Relation') &&
                                    // !item.type.includes('Boolean') &&
                                    // !item.type.includes('Object') &&
                                    // item.name !== 'state' &&
                                    // item.name !== 'kanbanStatus' &&
                                    (item.order === 0 || item.order === 1) && this.checkTypeIsValid(item),
                                )
                                .map(item => (
                                  <MenuItem key={item.name}>
                                    <Checkbox
                                      color="primary"
                                      onClick={() => this.handleClickSelectFilter(item.name)}
                                      checked={this.state.namesFilter.indexOf(item.name) > -1}
                                    />
                                    <ListItemText primary={item.title} />
                                  </MenuItem>
                                ))
                            : this.props.collectionCode === 'BusinessOpportunities'
                              ? viewConfig
                                  .filter(
                                    item =>
                                      (item.name === 'name' ||
                                        item.name === 'code' ||
                                        item.name === 'responsibilityPerson' ||
                                        item.name === 'source') &&
                                      this.checkTypeIsValid(item),
                                  )
                                  .map(item => (
                                    <MenuItem key={item.name}>
                                      <Checkbox
                                        color="primary"
                                        onClick={() => this.handleClickSelectFilter(item.name)}
                                        checked={this.state.namesFilter.indexOf(item.name) > -1}
                                      />
                                      <ListItemText primary={item.title} />
                                    </MenuItem>
                                  ))
                              : this.props.collectionCode === 'Contract' || this.props.collectionCode === 'Bill'
                                ? viewConfig
                                    .filter(item => (item.name === 'name' || item.name === 'code') && this.checkTypeIsValid(item))
                                    .map(item => (
                                      <MenuItem key={item.name}>
                                        <Checkbox
                                          color="primary"
                                          onClick={() => this.handleClickSelectFilter(item.name)}
                                          checked={this.state.namesFilter.indexOf(item.name) > -1}
                                        />
                                        <ListItemText primary={item.title} />
                                      </MenuItem>
                                    ))
                                : this.props.collectionCode === 'Employee'
                                  ? viewConfig
                                      .filter(
                                        item =>
                                          (item.name === 'code' ||
                                            item.name === 'name' ||
                                            item.name === 'username' ||
                                            item.name === 'phoneNumber' ||
                                            item.name === 'identityCardNumber') &&
                                          this.checkTypeIsValid(item),
                                      )
                                      .map(item => (
                                        <MenuItem key={item.name}>
                                          <Checkbox
                                            color="primary"
                                            onClick={() => this.handleClickSelectFilter(item.name)}
                                            checked={this.state.namesFilter.indexOf(item.name) > -1}
                                          />
                                          <ListItemText primary={item.title} />
                                        </MenuItem>
                                      ))
                                  : viewConfig
                                      .filter(
                                        item =>
                                          !item.type.includes('ObjectId') &&
                                          !item.type.includes('Date') &&
                                          !item.type.includes('Number') &&
                                          !item.type.includes('Relation') &&
                                          !item.type.includes('Boolean') &&
                                          !item.type.includes('Object') &&
                                          item.name !== 'state' &&
                                          item.name !== 'kanbanStatus' &&
                                          this.checkTypeIsValid(item),
                                      )
                                      .map(item => (
                                        <MenuItem key={item.name}>
                                          <Checkbox
                                            color="primary"
                                            onClick={() => this.handleClickSelectFilter(item.name)}
                                            checked={this.state.namesFilter.indexOf(item.name) > -1}
                                          />
                                          <ListItemText primary={item.title} />
                                        </MenuItem>
                                      ))}
                        </MenuList>
                      </div>
                      {/* <div>
                        <Typography variant="h6" align="center" style={{ paddingTop: 10 }}>
                          Lọc theo
                        </Typography>
                        <AsyncSelect
                          className={this.props.classes.controls}
                          placeholder="Tìm kiếm phòng ban ..."
                          loadOptions={(newValue, callback) => this.loadOptionsOri(newValue, callback, `${API_SEARCH_ORIGANIZATION}?`)}
                          loadingMessage={() => 'Đang tải ...'}
                          components={{ Option, SingleValue }}
                          // onBlur={() => field.onBlur({ value: field.value })}
                          isClearable
                          onChange={this.handleChangeOri}
                          defaultOptions={this.state.organizationunitSelect}
                          value={this.state.organizationunitSelect}
                          theme={theme => ({
                            ...theme,
                            spacing: {
                              ...theme.spacing,
                              controlHeight: '49px',
                            },
                          })}
                        />
                        <AsyncSelect
                          className={this.props.classes.controls}
                          placeholder="Tìm kiếm nhân viên ..."
                          loadOptions={(newValue, callback) =>
                            this.loadOptions(
                              newValue,
                              callback,
                              `${API_USERS_SEARCH}?${
                                this.state.organizationunitSelect
                                  ? serialize({
                                      filter: {
                                        'organizationUnit.organizationUnitId': this.state.organizationunitSelect._id,
                                      },
                                    })
                                  : ''
                              }&`,
                            )
                          }
                          loadingMessage={() => 'Đang tải ...'}
                          components={{ Option, SingleValue }}
                          // onBlur={() => field.onBlur({ value: field.value })}
                          isClearable
                          onChange={this.handleChangeEmployee}
                          defaultOptions={this.state.employeeSelect}
                          value={this.state.employeeSelect}
                          theme={theme => ({
                            ...theme,
                            spacing: {
                              ...theme.spacing,
                              controlHeight: '49px',
                            },
                          })}
                        />
                        <Button onClick={this.handleClickFilter} className={this.props.classes.controls} color="primary" variant="contained">
                          Lọc
                        </Button>
                      </div> */}
                    </div>
                  </Popover>
                  <div />
                </div>
              </div>
            )}
            {/* <CustomSearchPanel inputComponent={SearchPanel.Input} /> */}
          </Grid>
        </Paper>

        <Dialog maxWidth="md" fullWidth open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ flexGrow: 1 }}>Cấu hình bảng</span>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '20%', padding: '0px 2%' }}>
                <Tooltip title="Ẩn/Hiện trường thông tin trong bảng">
                  <VisibilityIcon />
                </Tooltip>
                <Tooltip title="Bắt buộc phải nhập thông tin">
                  <InputIcon />
                </Tooltip>
                <Tooltip title="Ẩn/Hiện trường thông tin trong form thêm mới">
                  <FormatIndentIncreaseIcon />
                </Tooltip>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <GridMUI container alignItems="center">
              <GridMUI item sm={6}>
                <TextField
                  id="select-filter-field"
                  select
                  onChange={this.handleChangeFilterField}
                  value={this.state.filterField}
                  label="Trường dữ liệu phân loại"
                  name="filterField"
                  style={{ width: '100%' }}
                  variant="outlined"
                  margin="normal"
                  SelectProps={{
                    MenuProps: {},
                  }}
                >
                  {viewConfig.map((item, index) => (
                    <MenuItem value={item.name} key={`${item.name}_${index}`}>
                      {item.title}
                    </MenuItem>
                  ))}
                </TextField>
              </GridMUI>

              <GridMUI item sm={5}>
                <CustomInputField
                  value={this.state.filterFieldValue}
                  type={filterFieldConfig.type}
                  label={filterFieldConfig.title}
                  configType="crmSource"
                  configCode={filterFieldConfig.code}
                  configId={filterFieldConfig.id}
                  onChange={e => this.setState({ filterFieldValue: e.target.value })}
                />
              </GridMUI>
            </GridMUI>
            {viewConfig
              .filter(item => {
                if (!item.filterConfig) {
                  return true;
                }
                if (this.state.filterField && this.state.filterFieldValue) {
                  if (item.filterConfig[this.state.filterFieldValue.value]) {
                    return true;
                  }
                }
                return false;
              })
              .map(
                (item, index) =>
                  item.type.includes('ObjectId') ? null : (
                    <GridMUI container alignItems="center">
                      <GridMUI item sm={10}>
                        <TextField
                          onChange={event => {
                            // const foundColumnIndex = this.state.viewConfig.findIndex(ele => ele.name === item.name);
                            const newViewConfig = this.state.viewConfig.map(ele => {
                              if (ele.name === item.name) {
                                ele.title = event.target.value;
                              }
                              return ele;
                            });
                            this.setState({ viewConfig: newViewConfig });
                          }}
                          // defaultValue={item.title}
                          value={item.title}
                          autoFocus
                          margin="dense"
                          id="name"
                          label={item.title}
                          variant="outlined"
                          fullWidth
                        />
                      </GridMUI>
                      <GridMUI item sm={2}>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                          <Checkbox
                            inputProps={{
                              name: [item.name],
                            }}
                            checked={this.isChecked(item.name, 'checked')}
                            onChange={this.handleChecked}
                            color="primary"
                          />
                          <Checkbox
                            inputProps={{
                              name: [item.name],
                            }}
                            onChange={this.handleCheckedRequireForm}
                            checked={item.isRequire ? true : this.isChecked(item.name, 'checkedRequireForm')}
                            color="primary"
                            disabled={item.isRequire}
                          />
                          <Checkbox
                            inputProps={{
                              name: [item.name],
                            }}
                            onChange={this.handleCheckedShowForm}
                            checked={item.isRequire || item.checkedRequireForm ? true : this.isChecked(item.name, 'checkedShowForm')}
                            color="primary"
                            disabled={item.isRequire || item.checkedRequireForm}
                          />
                        </div>
                      </GridMUI>
                    </GridMUI>
                  ),
              )}
            {this.props.enableAddFieldTable === false ? (
              ''
            ) : (
              <Button variant="outlined" onClick={this.handleAddColumn} color="primary">
                Thêm trường
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleUpdateViewConfig(null);
              }}
              color="primary"
              variant="outlined"
            >
              Lưu
            </Button>
            <Button onClick={this.handleClose} color="secondary" variant="outlined">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.openCollectionDialog ? (
          <HOCCollectionDialog
            callBack={this.callBack}
            handleClose={() => {
              this.setState({ openCollectionDialog: false });
            }}
            dialogTitle={this.props.dialogTitle}
            editData={this.state.editData}
            isEditting={this.state.isEditting}
            viewConfig={this.state.viewConfig}
            open={this.state.openCollectionDialog}
            history={this.props.history}
            date={new Date()}
            arrKanban={this.props.kanbanStatuses}
          />
        ) : (
          ''
        )}
        <Dialog
          maxWidth="md"
          fullWidth
          open={this.state.openToAddColumn}
          onClose={this.handleCloseAddColumnDialog}
          aria-labelledby="form-dialog-title1"
        >
          <DialogTitle id="form-dialog-title1">Thêm mới trường</DialogTitle>
          <DialogContent>
            <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleAddColumnSave}>
              <TextValidator
                label="Tên trường(Viết bằng tiếng anh và liền nhau)"
                name="name"
                onChange={this.handleChangeAddColumn}
                value={currentOrtherField.name}
                validators={['trim', 'required', 'matchRegexp:^[A-Za-z0-9]+$']}
                errorMessages={['Không được để khoảng trắng', 'Không được để trống', 'Kí tự nhập vào không hợp lệ']}
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
              />
              <TextField
                id="standard-select-currency"
                select
                onChange={this.handleChangeAddColumn}
                value={currentOrtherField.type}
                label="Kiểu dữ liệu"
                name="type"
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
                SelectProps={{
                  MenuProps: {},
                }}
              >
                {datatypesList.map(item => (
                  <MenuItem value={item.type} key={item.type}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.submitBtn.current.click();
              }}
              color="primary"
              variant="outlined"
            >
              Lưu
            </Button>
            <Button onClick={this.handleCloseAddColumn} variant="outlined" color="secondary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog maxWidth="md" fullWidth open={this.state.openPrint} onClose={this.handleClosePrintDialog} aria-labelledby="form-dialog-title1">
          <DialogTitle id="form-dialog-title1">Xuất biểu mẫu</DialogTitle>
          <DialogContent>
            <ValidatorForm
              style={{ width: '100%', display: 'inline' }}
              onSubmit={() => {
                this.callBack('print', this.state.formPrint, Object.assign({}, this.state.printData));
                this.setState({ openPrint: false, formPrint: '' });
              }}
            >
              <TextValidator
                label="Chọn biểu mẫu cần in"
                name="name"
                onChange={e => {
                  this.setState({ formPrint: e.target.value });
                }}
                value={this.state.formPrint}
                validators={['trim', 'required']}
                errorMessages={['Không được để trống', 'Không được để trống']}
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
                select
              >
                {dynamicFormByFilter.map(form => (
                  <MenuItem key={form._id} value={form._id}>
                    {form.title}
                  </MenuItem>
                ))}
              </TextValidator>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtnPrint} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClosePrintDialog} variant="outlined" color="primary">
              Hủy
            </Button>
            <Button
              onClick={() => {
                this.submitBtnPrint.current.click();
              }}
              color="primary"
              variant="outlined"
            >
              In biểu mẫu
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="md"
          fullWidth
          open={this.state.openApproved}
          onClose={() => {
            this.setState({ openApproved: false });
          }}
          aria-labelledby="form-dialog-title1"
        >
          <DialogTitle id="form-dialog-title1">Tạo phê duyệt</DialogTitle>
          <DialogContent>
            <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleAddApproved}>
              <TextValidator
                label="Tên phê duyệt"
                name="name"
                onChange={e => this.handleChangeApproved(e, 'name')}
                value={this.state.approvedObj.name}
                val
                idators={['trim', 'required']}
                errorMessages={['Không được để trống', 'Không được để trống']}
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
              />
              <Typography component="p" style={{ color: '#a4a4a4' }}>
                Nhóm phê duyệt
              </Typography>
              <AsyncSelect
                // cacheOptions
                // value={this.state.employee}
                className={this.props.classes.reactSelect}
                placeholder="Tìm kiếm nhóm phê duyệt ..."
                loadOptions={(newValue, callback) => this.loadOptionsAppor(newValue, callback, `${API_APPROVE_GROUPS}?`)}
                loadingMessage={() => 'Đang tải ...'}
                components={{ Option, SingleValue }}
                onChange={this.handleAddApprovedGroup}
                theme={theme => ({
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: '55px',
                  },
                })}
              />
              <TextValidator
                label="Tên quy trình"
                name="name"
                onChange={e => this.handleChangeApproved(e, 'subCode')}
                value={this.state.approvedObj.subCode}
                validators={['trim', 'required']}
                errorMessages={['Không được để trống', 'Không được để trống']}
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
              />
              <TextValidator
                label="Chọn biểu mẫu phê duyệt"
                name="name"
                onChange={e => this.handleChangeApproved(e, 'form')}
                value={this.state.approvedObj.form}
                validators={['trim', 'required']}
                errorMessages={['Không được để trống', 'Không được để trống']}
                style={{ width: '100%' }}
                variant="outlined"
                margin="normal"
                select
              >
                {this.state.dynamicForms.map(form => (
                  <MenuItem key={form._id} value={form._id}>
                    {form.title}
                  </MenuItem>
                ))}
              </TextValidator>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtnApproved} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ openApproved: false });
              }}
              color="secondary"
              variant="outlined"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                this.submitBtnApproved.current.click();
              }}
              color="primary"
              variant="outlined"
            >
              Tạo phê duyệt
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.openDialogApprove}
          onClose={this.handleOpenDialogApprove}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Bạn có muốn hoàn thành ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleOpenDialogApprove} variant="outlined" color="secondary">
              Hủy
            </Button>
            <Button onClick={this.handleSetApproveFinish} variant="outlined" color="primary" autoFocus>
              Hoàn thành
            </Button>
          </DialogActions>
        </Dialog>

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={this.state.openDrawer}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            <AddTask
              id={id}
              // data={dot.object(Object.assign({}, this.state.printData))}
              callback={() => this.setState({ openDrawer: false })}
              module="revenueAndExpenditure"
              data={{
                sourceData: {
                  model: this.props.collectionCode,
                  objectId: itemCurrent._id,
                  objectName: itemCurrent.name,
                },
                source: `${this.props.collectionCode}/${itemCurrent.code}`,
                taskType: 1,
                customer: itemCurrent.customer ? itemCurrent.customer : null,
                join: itemCurrent.join ? itemCurrent.join : [],
                inCharge: itemCurrent.inCharge ? itemCurrent.inCharge : [],
                approved: itemCurrent.approved ? itemCurrent.approved : [],
                support: itemCurrent.support ? itemCurrent.support : [],
                viewable: itemCurrent.viewable ? itemCurrent.viewable : [],
                isProject: false,
                parentId: this.props.addChildTask ? id : null,
                minDate: this.props.addChildTask ? itemCurrent.originItem.startDate : null,
                maxDate: this.props.addChildTask ? itemCurrent.originItem.endDate : null,
                startDate: this.props.addChildTask ? itemCurrent.originItem.startDate : null,
              }}
            />
          </div>
        </SwipeableDrawer>

        <DialogUI dialogAction={false} onClose={this.closeAssignTask} open={this.state.dialogAssign}>
          <AssignTask callbackAssign={this.callbackAssign} code={this.props.collectionCode} itemCurrent={itemCurrent} />
        </DialogUI>
      </div>
    );
  }

  handleAddApproved = () => {
    const { approvedObj, dynamicForms } = this.state;
    const exsist = dynamicForms.find(i => String(i._id) === String(approvedObj.form));
    let content = '';
    let dynamicForm = '';
    if (exsist) {
      content = exsist.content;
      dynamicForm = exsist._id;
    }
    if (approvedObj.group === null) {
      this.props.onChangeSnackbar({ status: true, message: 'Bạn phải nhập nhóm phê duyệt', variant: 'error' });
    }
    const groupInfo = [];
    approvedObj.group.group.forEach(item => {
      groupInfo.push({
        order: item.order,
        person: item.person,
        approve: 0,
        reason: '',
      });
    });

    const body = {
      name: approvedObj.name,
      subCode: approvedObj.subCode,
      collectionCode: this.props.collectionCode,
      content,
      dataInfo: dot.object(Object.assign({}, this.state.printData)),
      dynamicForm,
      convertMapping: '5d832729c252b2577006c5ab',
      approveGroup: approvedObj.group._id,
      groupInfo,
      clientId,
    };
    this.props.onCreaetApprove(body);
    this.setState({ openApproved: false, approvedObj: { name: '', subCode: '', form: '', group: null } });
  };

  handleChangeApproved = (e, name) => {
    const { approvedObj } = this.state;
    approvedObj[name] = e.target.value;
    this.setState({ approvedObj });
  };

  handleAddApprovedGroup = value => {
    this.state.approvedObj.group = value;
  };

  handleChangeEmployee = value => {
    this.setState({
      employeesFilter: value ? [value] : [],
      employeeSelect: value,
    });
  };

  handleChangeOri = value => {
    this.setState({ organizationunitSelect: value });
    const token = localStorage.getItem('token');
    if (value) {
      fetch(
        `${API_USERS_SEARCH}?${serialize({
          filter: {
            'organizationUnit.organizationUnitId': value._id,
          },
        })}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then(response => response.json())
        .then(myJson => {
          const { data } = myJson;
          this.setState({
            employeeSelect: null,
            employeesFilter: data,
          });
        });
    } else {
      this.setState({
        employeeSelect: null,
        employeesFilter: [],
      });
    }
  };

  handleClickFilter = () => {
    const { viewConfig, employeesFilter, filter } = this.state;
    const idsEmployee = employeesFilter ? employeesFilter.map(item => item._id) : [];
    const employeeFieldsRef = viewConfig.filter(item => item.type === 'ObjectId|Employee').map(item => item.name);
    const arrFilterEmployee = employeeFieldsRef.map(item => ({
      [item]: {
        $in: idsEmployee,
      },
    }));
    const newFilter = {
      ...filter,
      $or: arrFilterEmployee,
    };
    this.state.filter = newFilter;
    this.props.onGetAPI({
      skip: this.state.currentPage * this.state.pageSize,
      limit: this.state.pageSize,
      filter: newFilter,
    });
  };

  handleAddColumnSave = () => {
    const { currentOrtherField, viewConfig, filterFieldValue } = this.state;
    const currentColumn =
      this.state.filterField && this.state.filterFieldValue
        ? {
            checked: true,
            isFilter: false,
            isRequire: false,
            isSort: false,
            name: `others.${currentOrtherField.name}`,
            order: Number(viewConfig[viewConfig.length - 1].order) + 1,
            title: `others.${currentOrtherField.name}`,
            type: currentOrtherField.type,
            filterConfig: {
              [`${filterFieldValue.value}`]: {
                checked: true,
                checkedShowForm: true,
              },
            },
          }
        : {
            checked: true,
            isFilter: false,
            isRequire: false,
            isSort: false,
            name: `others.${currentOrtherField.name}`,
            order: Number(viewConfig[viewConfig.length - 1].order) + 1,
            title: `others.${currentOrtherField.name}`,
            type: currentOrtherField.type,
          };
    console.log('currentColumn', currentColumn);
    viewConfig.push(currentColumn);
    this.setState({ viewConfig, openToAddColumn: false });
  };

  handleChangeAddColumn = e => {
    const { currentOrtherField } = this.state;
    currentOrtherField[e.target.name] = e.target.value;
    this.setState({ currentOrtherField });
  };

  handleChangeFilterField = e => {
    this.setState({ filterField: e.target.value });
  };

  handleCloseAddColumnDialog = () => {
    this.setState({ openToAddColumn: false });
  };

  handleClosePrintDialog = () => {
    this.setState({ openPrint: false, formPrint: '' });
  };

  handleAddColumn = () => {
    this.setState({ openToAddColumn: true });
  };

  handleCloseAddColumn = () => {
    const currentOrtherField = {
      name: '',
      type: 'string',
    };
    this.setState({ openToAddColumn: false, currentOrtherField });
  };

  handleClickOpenFilter = event => {
    this.setState({ anchorFilter: event.currentTarget });
  };

  handleClickCloseFilter = () => {
    this.setState({ anchorFilter: null });
  };

  handleClickSelectFilter = name => {
    let { namesFilter } = this.state;

    const index = namesFilter.findIndex(item => item === name);
    if (index !== -1) {
      namesFilter = namesFilter.filter(item => item !== name);
    } else {
      namesFilter.push(name);
    }
    this.setState({ namesFilter, currentPage: 0 });
  };

  changeSort = e => {
    const sort = {
      [e[0].columnName]: e[0].direction,
    };
    this.setState({ sortValue: sort });
    this.changeCurrentPage(0, sort);
  };

  //
  handleOnChangeSearch = e => {
    const { namesFilter } = this.state;
    const searchText = e.target.value;
    this.state.searchText = searchText;
    this.state.currentPage = 0;
    // console.log(namesFilter);
    const valueFilter = namesFilter.map(item => ({
      [item]: {
        $regex: searchText,
        $options: 'gi',
      },
    }));
    this.state.valueFilter = valueFilter;
    if (this.props.enableServerPaging === true) {
      if (this.timeOutSearch) {
        clearTimeout(this.timeOutSearch);
      }
      this.timeOutSearch = setTimeout(() => {
        if (this.props.isClone) {
          this.props.onGetAPI({
            query: {
              skip: 0,
              limit: this.state.pageSize,
              filter: {
                $or: valueFilter,
              },
            },
            collectionCode: this.props.collectionCode,
          });
        } else
          this.props.onGetAPI({
            skip: 0,
            limit: this.state.pageSize,
            filter: {
              $or: valueFilter,
            },
          });
      }, 500);
    } else {
      if (this.timeOutSearch) {
        clearTimeout(this.timeOutSearch);
      }
      this.timeOutSearch = setTimeout(() => {
        this.props.onGetAPI({
          filter: {
            $or: valueFilter,
          },
        });
      }, 500);
    }
  };

  handleSetApproveFinish = () => {
    const { idDocumentApprove } = this.state;
    this.props.onApproveFinish({
      model: this.props.collectionCode,
      id: idDocumentApprove,
    });
    setTimeout(() => {
      this.props.onGetAPI({
        skip: this.state.currentPage * this.state.pageSize,
        limit: this.state.pageSize,
        filter: this.state.filter,
      });
    }, 200);
    this.state.openDialogApprove = false;
  };

  handleOpenDialogApprove = id => {
    const { openDialogApprove } = this.state;
    this.setState({
      openDialogApprove: !openDialogApprove,
      idDocumentApprove: id,
    });
  };

  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}${serialize({
      filter: {
        name: { $regex: newValue, $options: 'gi' },
      },
    })}`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        callback(
          data.map(item => ({
            ...item,
            value: item._id,
          })),
        );
      });
  };

  loadOptionsAppor = (newValue, callback, api) => {
    const url = `${api}${serialize({
      filter: {
        name: { $regex: newValue, $options: 'gi' },
      },
    })}`;
    return requestApprove(url, {}).then(data => {
      callback(
        data.map(item => ({
          ...item,
          value: item._id,
        })),
      );
    });
  };

  loadOptionsOri = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}${serialize({
      filter: {
        name: { $regex: newValue, $options: 'gi' },
      },
    })}`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        callback(
          myJson.map(item => ({
            ...item,
            value: item._id,
          })),
        );
      });
  };

  callbackAssign = () => {
    this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true });
    this.setState({ dialogAssign: false });
  };

  closeAssignTask = () => {
    this.setState({ dialogAssign: false });
  };

  checkTypeIsValid = item => {
    if (this.props.disableSearchField) {
      if (this.props.disableSearchField.includes(item.name)) return false;
      return true;
    }
    return true;
  };
}

const Option = props => (
  <components.Option {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 100 }}>
      {/* <Avatar src={props.data.avatar} /> */}
      <div style={{ marginTop: 10 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
      <div style={{ marginTop: 10 }}>{props.data.name}</div>
    </div>
  </components.SingleValue>
);

HocTable.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  hocTable: makeSelectHocTable(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onEditViewConfig: viewConfig => {
      dispatch(editViewConfigAction(viewConfig));
    },
    onGetDynamicForm: collectionCode => {
      dispatch(getDynamicFormAction(collectionCode));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onCreaetApprove: body => {
      dispatch(createApproveAct(body));
    },
    onApproveFinish: body => {
      dispatch(setApproveFinish(body));
    },
    onExportForm: (collectionCode, formId, data, viewConfig) => dispatch(exportForm(collectionCode, formId, data, viewConfig)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// const withReducer = injectReducer({ key: 'hocTable', reducer });
// const withSaga = injectSaga({ key: 'hocTable', saga });

export default compose(
  withStyles(styles),
  // withReducer,
  // withSaga,
  withConnect,
)(HocTable);
