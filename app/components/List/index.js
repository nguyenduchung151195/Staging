/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/**
 *
 * ListPage
 *
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Fab as Fa,
  TablePagination,
  InputAdornment,
  TextField as TextFieldUI,
  Menu,
  MenuItem,
  Checkbox,
  Typography,
  Button,
  Tooltip,
  OutlinedInput,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import XLSX from 'xlsx';
import {
  Visibility,
  Delete,
  ImportExport,
  Add,
  Edit,
  FilterList,
  Dehaze,
  Archive,
  Share,
  CloudUpload,
  CloudDownload,
  TrendingUpRounded,
} from '@material-ui/icons';
import {
  SortingState,
  IntegratedSorting,
  IntegratedFiltering,
  IntegratedSelection,
  SelectionState,
  TreeDataState,
  CustomTreeData,
  DataTypeProvider,
  DataTypeProviderProps,
  PagingState,
  IntegratedPaging,
  CustomPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableFixedColumns,
  TableSelection,
  TableTreeColumn,
  TableColumnResizing,
  PagingPanel,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import {
  API_VIEW_CONFIG,
  API_APPROVE_GROUPS,
  API_APPROVE,
  API_COMMON_APPROVE_FINISH,
  API_USERS,
  API_CUSTOMERS,
  API_MAIL,
  API_FIELD,
  API_ORIGANIZATION,
  API_SMS1,
  API_TAG_STOCK,
  API_SUPPLIERS,
  API_UPDATE_ALL_SYSTEM,
  API_ROLE_APP,
} from '../../config/urlConfig';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import { Link } from 'react-router-dom';
import DialogAsync from 'components/Modal/DialogAsync';
import AddProjects from 'containers/AddProjects';
import { TextField, Dialog as DialogUI, SwipeableDrawer, AsyncAutocomplete, Loading, AssignTask } from 'components/LifetekUi';
import Snackbar from 'components/Snackbar';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { clearWidthSpace } from '../../utils/common';
import _ from 'lodash';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../../containers/Dashboard/selectors';

// import dot from 'dot-object';
import { convertDot, serialize, convertOb, printTemplte, printTemplteExcel, fetchData, getDataBeforeSend, convertDotOther } from '../../helper';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import { SAVE_VIEWCONFIG_ON_RESIZE_DELAY } from '../../utils/constants';
// import { STATE } from '../../config/const';
import { clientId } from '../../variable';
import { tableToExcel, tableToPDF } from '../../helper';
import CustomInputField from '../Input/CustomInputField';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import EmailDialog from './EmailDialog';
import SMSDialog from './SMSDialog';
import CallDialog from './CallDialog';
import request from '../../utils/request';

import './CustomCSS.css';
import { API_CHANGE_PASSWORD_PERSON, APP_URL, API_ROLEAPP_CHANGE_PASSWORD_PERSON } from '../../config/urlConfig';
import { CommonSeriesSettingsHoverStyle } from 'devextreme-react/range-selector';

const Process = ({ title, value, color }) => (
  <Tooltip title={title}>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 10, width: '100%', borderRadius: 2 }}>
      <div style={{ width: `${value}%`, background: `${color}`, height: '100%' }} />
      <div style={{ width: `${100 - value}%`, height: '100%', background: '#9e9e9e75' }} />
    </div>
  </Tooltip>
);

function getChildRows(row, rootRows) {
  const childRows = rootRows.filter(r => r.parentId === (row ? row._id : null));
  return childRows.length ? childRows : null;
}

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};
function DragColumn({ draggingEnabled, sortingEnabled, ...rest }) {
  if (rest.column.name === 'edit') return <TableHeaderRow.Cell {...rest} sortingEnabled={false} draggingEnabled={false} />;
  return <TableHeaderRow.Cell sortingEnabled draggingEnabled={draggingEnabled} {...rest} />;
}

const ExportTable = React.memo(
  ({
    filters,
    filter,
    filter1,
    filter2,
    open,
    onClose,
    listKanbanStatus,
    apiUrl,
    moduleCode,
    customData,
    kanban,
    viewConfigUpdateTime,
    customDataExport,
    openExportStatus,
  }) => {
    const url = apiUrl;
    const [dataPageExcell, setDataPageExcell] = useState({
      data: [],
      totalPage: 1,
      pageNumber: 1,
      numberOrderFirstPage: 1,
    });
    const [viewConfigData, setViewConfigData] = useState([]);

    const { data, totalPage, pageNumber, numberOrderFirstPage } = dataPageExcell;
    //  const { category, startDate, department, endDate, employee } = customDatas || {}

    useEffect(
      () => {
        if (moduleCode) {
          // fetchData(API_ORIGANIZATION, 'GET', null).then(departmentsData => {
          //   const mapItem = array => {
          //     array.forEach(item => {
          //       if (item && item._id) result.push({ id: item._id, name: item.name });
          //       if (item.child) mapItem(item.child);
          //     });
          //   };

          //   let result = [];
          //   mapItem(departmentsData);
          //   //  setDepartments(result)
          // });
          const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
          const list = viewConfig && viewConfig.find(item => item.code === moduleCode);
          const data = (list && list.listDisplay && list.listDisplay.type.fields.type.columns) || [];
          const others = (list && list.listDisplay && list.listDisplay.type.fields.type.others) || [];
          const exportColumns = data && data.concat(others).filter(c => c.exportTable);
          setViewConfigData(exportColumns);
        }
      },
      [viewConfigUpdateTime],
    );

    //  useEffect(() => {
    //    setCustomDatas(customData)
    //  }, [customData])

    useEffect(
      () => {
        if (url && open) {
          getDataFirstTime();
        }
      },
      [filters, open],
    );
    const convertValue = value => {
      let newValue = value;
      if (openExportStatus !== 'PDF') {
        if (typeof value === 'number' && value && value.toString().charAt(0) === '0') {
          newValue = `'${newValue}`;
        } else if (typeof value === 'string') {
          let valueClone = parseInt(value);
          if (!isNaN(valueClone)) {
            // console.log(newValue, 'openExportStatus')
            if (newValue && (newValue.charAt(0) === '0' || newValue.charAt(0) === '+')) newValue = `'${newValue}`;
          }
        }
      }

      return newValue;
    };
    const getDataFirstTime = async () => {
      try {
        const filterLinK = filters.slice(9, filters.length);
        const query = serialize({ filters, filter, filter1, filter2 });
        let arr = [];
        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');
        // console.log(filterLinK,'selectors')
        // let apiUrl
        // if(filters.length === 52 || filters.length === 32 || filters.length === 58 || filters.length === 199 || filters.length === 50 || filters.length === 105){
        //   apiUrl = `${url}?selector=${selectors}`;
        // }else{
        //   apiUrl = `${url}?selector=${selectors}&${filters}`;
        // }
        const apiUrl = `${url}?selector=${selectors}&${filterLinK}`;
        const res = await fetchData(apiUrl);
        const numberRecordLimitBackEnd = res.limit;
        if (!res.data) throw res;
        let dataExport = res.data;
        if (customDataExport && typeof customDataExport === 'function') {
          dataExport = customDataExport(dataExport);
        }
        if (res.count > numberRecordLimitBackEnd) {
          const numberTotalPageLimitBackEnd = Math.ceil(res.count / numberRecordLimitBackEnd);
          for (let i = 0; i < numberTotalPageLimitBackEnd; i++) {
            await getDataPagination(numberRecordLimitBackEnd * i, numberRecordLimitBackEnd, numberTotalPageLimitBackEnd, i + 1);
          }
        } else {
          setDataPageExcell({ ...dataPageExcell, data: dataExport, totalPage: 1, pageNumber: 1, numberOrderFirstPage: 1 });
          onClose({ lastPage: true });
        }
      } catch (err) {
        onClose({ res: err, error: true, lastPage: true });
      }
    };

    const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
      const lastPage = totalPage === pageNumber;
      try {
        // let newFilter = { filter: { ...filters, ...filter }, skip: skip, limit: limit };
        let { limit, ...rest } = filter;
        let newFilter = { ...rest, limit };
        let arr = [];

        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');
        // const query = serialize(newFilter);
        const apiUrl = `${url}?${selectors}&${newFilter}`;
        const res = await fetchData(apiUrl);
        if (!res.data) throw res;
        let dataExport = res.data;
        if (customDataExport && typeof customDataExport === 'function') {
          dataExport = customDataExport(dataExport);
        }
        setDataPageExcell({ ...dataPageExcell, data: dataExport, totalPage: totalPage, pageNumber: pageNumber, numberOrderFirstPage: skip + 1 });
        onClose({ totalPage, pageNumber, lastPage });
      } catch (err) {
        onClose({ error: true, lastPage });
      }
    };
    let dataKey = [];
    data.map(item => {
      dataKey.push(Object.keys(item));
    });

    return (
      <React.Fragment>
        {open ? <Loading /> : null}
        <div id={moduleCode + kanban} style={{ display: 'none' }}>
          {/* <table> */}
          <tbody>
            <tr>
              <td>Ngày xuất báo cáo: </td>
              <td>{moment().format('DD/MM/YYYY')}</td>
            </tr>

            <tr />
          </tbody>
          {/* </table> */}
          {/* check22 */}
          <table style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th style={{ width: 50 }}>STT</th>
                {viewConfigData.map(cols => (
                  <th style={{ width: cols.width }}>{cols.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                return (
                  <tr>
                    <td style={{ width: 50, textAlign: 'center' }}>{index + 1}</td>
                    {viewConfigData.map(cols => (
                      <td
                        style={{
                          width: cols.width,
                          textAlign: cols.type === 'Date' || cols.type === 'Number' ? 'center' : null,
                          paddingTop: cols.type === 'Number' ? '10px' : null,
                          paddingRight: cols.type === 'Number' ? 0 : null,
                        }}
                      >
                        {typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? convertValue(row[cols.name]) : ''}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td style={{ textAlign: 'center', background: '#959a95' }}>Trang số </td>
                <td style={{ textAlign: 'center', background: '#959a95' }}>{pageNumber}</td>
              </tr>
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td style={{ textAlign: 'center', background: '#959a95' }}>Tổng số trang</td>
                <td style={{ textAlign: 'center', background: '#959a95' }}>{totalPage}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </React.Fragment>
    );
  },
);

class ListPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timeout = 0;

    this.state = {
      reload2: this.props.reload2,
      html: [],
      htmlTotal: 0,
      reload: 0,
      exportAnchor: null,
      openExport: null,
      openExportStatus: null,
      columns: [],
      show: true,
      columnOrder: [],
      rows: [],
      selected: [],
      dialogStatus: false,
      shareDialog: false,
      activePage: 0,
      perPage: this.props.perPage,
      search: '',
      searchClient: '',
      deleteDialog: false,
      loading: true,
      open: false,
      totalRows: [],
      anchorEl: null,
      variant: 'success',
      message: '',
      sorting: [{ columnName: 'updatedAt', direction: 'desc' }],
      // filters: ['name'],
      filters: [],
      count: 0,
      anchorElAction: false,
      importExport: this.props.importExport
        ? `/import?type=${this.props.importExport}`
        : this.props.code && !this.props.parentCode && this.props.exchangingAgreement
          ? `/import?type=${this.props.code}&&exchangingAgreement=${this.props.exchangingAgreement}`
          // : this.props.code && !this.props.parentCode
          //   ? `/import?type=${this.props.code}`
          : this.props.code && !this.props.parentCode && this.props.documentaryId
            ? `/import?type=${this.props.code}&&documentaryId=${this.props.documentaryId}`
            : this.props.code && !this.props.parentCode
              ? `/import?type=${this.props.code}`
              : null,
      id: null,
      isChecked: false,
      isCheckedNo: false,
      itemCurrent: { originItem: '' },
      openDialogApprove: false,
      kanbanList: [],
      columnExtensions: this.props.columnExtensions,
      rightColumns: this.props.rightColumns,
      // peopleCanView: [],
      employessCustomer: [],
      hasPermissionViewConfig: false,
      innerFilter: {},
      queryFilter: null,
      firstLoad: true,
      filterAdvance: {},
      valueFilter: 0,
      dayOfBirth: 0,
      monthOfBirth: 0,
      yearOfBirth: 0,
      fileColumns: [],
      limit: 10,
      currentPage: 0,
      brand: 0,
      supplier: 0,
      catalogContract: 0,
      groupProduct: 0,
      filterType: [],
      suppliersList: [],
      categoryList: [],
      listContractTypes: [],
      reloadPage: new Date() * 1,
    };
  }

  componentDidMount() {
    let kanbanList = [];
    localStorage.removeItem('configImport');
    localStorage.removeItem('typeTab');
    if (this.props.configImport) {
      localStorage.setItem('configImport', JSON.stringify(this.props.configImport));
    }
    else {
      localStorage.removeItem('configImport')
    }
    if (this.props.typeTab) {
      localStorage.setItem('typeTab', JSON.stringify(this.props.typeTab));
    }
    else {
      localStorage.removeItem('typeTab')
    }
    const x = this.props.kanban
      ? JSON.parse(localStorage.getItem([this.props.status])) &&
      JSON.parse(localStorage.getItem([this.props.status])).find(item => item.code === this.props.kanban)
      : null;
    const y = this.props.kanbanSecondary
      ? JSON.parse(localStorage.getItem([this.props.status])) &&
      JSON.parse(localStorage.getItem([this.props.status])).find(item => item.code === this.props.kanbanSecondary)
      : null;

    if (x) {
      kanbanList = x.data;
    }

    if (!!y) {
      kanbanList = [...kanbanList, ...y.data];
    }

    // console.log(x, "kanbanList", y)
    if (this.props.code && !this.props.columns) {
      try {
        const { dashboardPage } = this.props;
        let currentRole;
        if (dashboardPage.role.roles) {
          currentRole = dashboardPage.role.roles.find(
            item => item.codeModleFunction === this.props.code || item.codeModleFunction === this.props.parentCode,
          );
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
      } catch (error) {
        // ignore error
      }
      const code = this.props.code;
      const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
      
      if (view) {
        const columns = view.listDisplay.type.fields.type.columns;
        const fileColumns = view.listDisplay.type.fields.type.fileColumns;
        const others = view.listDisplay.type.fields.type.others.map(item => ({ ...item, tp: 1 }));
        const newCls = [...columns, ...others, { name: 'edit', checked: !this.props.disableEdit, title: 'HÀNH ĐỘNG' }];
        const columnOrder = newCls
          .sort((a, b) => a.order - b.order)
          .map(item => item.name)
          .concat(['edit']);
          
        this.setState({ columns: newCls, columnOrder, fileColumns, loading: true, kanbanList, filterField: view.filterField }, () => {
          if (this.props.client) {
            this.getData({ loading: false });
          } else {
            this.loadData();
          }
        });
        // this.getData({ loading: false });
      } else {
        alert('Mã code bị lỗi');
      }
    } else {
      this.setState(
        {
          columns: this.props.columns.concat({ name: 'edit', checked: !this.props.disableEdit, title: 'HÀNH ĐỘNG' }),
          loading: true,
          kanbanList,
        },
        () => {
          if (this.props.client) {
            this.getData({ loading: false });
          } else {
            this.loadData();
          }
        },
      );
    }
  }

  changeMutil(value) {
    this.setState({ employessCustomer: value });
  }

  getItemConfig = item => {
    let itemConfig = {};
    if (item.filterConfig && item.filterConfig[this.props.filter[this.state.filterField]]) {
      itemConfig = item.filterConfig[this.props.filter[this.state.filterField]];
    }
    // console.log(itemConfig, "itemConfig")
    // console.log(item, "item", "item.filterConfig ", item.filterConfig, this.props.filter[this.state.filterField])

    const newItem = { ...item, ...itemConfig };
    return newItem;
  };

  componentDidUpdate(preProps, preState) {
    // if (this.props.filter && preProps.filter &&
    //   this.props.filter.year !== preProps.filter.year &&
    //   this.props.filter.organizationUnitId !== preProps.filter.organizationUnitId
    // ) {

    let reload = this.props.reload !== preProps.reload;

    if (
      this.props.dashboardPage &&
      this.props.dashboardPage.docUpdated &&
      this.props.dashboardPage.docUpdated.data &&
      preProps.dashboardPage.docUpdated &&
      this.props.dashboardPage.docUpdated.moduleCode === this.props.code &&
      preProps.dashboardPage.docUpdated.data !== this.props.dashboardPage.docUpdated.data
    ) {
      reload = true;
    }
    if (this.lastQuery !== 'undefined' || this.props.client) {
      this.loadData(reload);
    }

    let checker = false;
    if (this.state.filterField) {
      if (
        (!preProps.filter || typeof preProps.filter[this.state.filterField] === 'undefined') &&
        this.props.filter &&
        typeof this.props.filter[this.state.filterField] !== 'undefined'
      ) {
        checker = true;
      } else if (
        this.props.filter &&
        typeof this.props.filter[this.state.filterField] !== 'undefined' &&
        (this.props.filter[this.state.filterField] !== preProps.filter[this.state.filterField] || this.state.firstLoad)
      ) {
        checker = true;
      }
      if (checker) {
        const code = this.props.code;
        const view =
          JSON.parse(localStorage.getItem('viewConfig')) && JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
        // console.log(view, "view")
        if (view) {
          const columns = view.listDisplay.type.fields.type.columns.map(this.getItemConfig);
          const others = view.listDisplay.type.fields.type.others.map(item => ({ ...item, tp: 1 })).map(this.getItemConfig);
          const newCls = [...columns, ...others, { name: 'edit', checked: !this.props.disableEdit, title: 'HÀNH ĐỘNG' }];
          const columnOrder = newCls
            .sort((a, b) => a.order - b.order)
            .map(item => item.name)
            .concat(['edit']);
          this.setState({ columns: newCls, columnOrder, firstLoad: false });
        }
      }
    }
    const { html, htmlTotal, openImport, search, filters } = this.state;
    if ((html && html.length > 0) & (htmlTotal !== 0)) {
      if (html.length === htmlTotal) {
        for (let index = 0; index < htmlTotal; index++) {
          const win = window.open();
          if (win) {
            win.document.write(html[index].content);
            win.document.close();
            win.print();
          } else {
            return;
          }
        }
        this.setState({ html: [] });
        this.setState({ htmlTotal: 0 });
      }
    }

    if (preState.openImport && !openImport) {
      this.setState({ reload: reload + 1 });
    }
    // }
  }
  handleCloseExportTable = payload => {
    // console.log(`${this.props.code}${this.props.kanban}`, payload, "payload")

    const { openExport } = this.state;
    if (payload && payload.lastPage) this.setState({ openExport: null });
    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
        //  this.props.onChangeSnackbar({ status: true, message, variant: 'error' });
      }
      // else this.props.onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
      return;
    }

    switch (openExport) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF(`${this.props.code}${this.props.kanban}`, this.props.code);
        this.setState({ html: [...this.state.html, { content, pageNumber }], htmlTotal: totalPage });
        break;
      default:
        tableToExcel(`${this.props.code}${this.props.kanban}`, 'W3C Example Table', this.props.code);
    }
  };

  loadData = (reload = false) => {
    if (this.props.reload2) this.getData();
    if (reload) {
      this.getData();
      return;
    }
    if (this.props.client) return;
    const queryString = this.queryString();
    if (queryString === this.lastQuery) {
      this.setState({ loading: false });
      return;
    }
    this.getData();
    this.lastQuery = queryString;
  };
  formatCash = str => {
    return str
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + '.') + prev;
      });
  };
  getData = dt => {
    if (this.props.noData) {
      return this.setState({ count: 0, rows: [] });
    }
    // eslint-disable-next-line no-unused-vars
    const {
      newPaging,
      mapFunction,
      customFunction,
      apiUrl,
      disableDot,
      disableEdit,
      client,
      filter,
      filterEdit,
      filterCan,
      typeContract,
      taskId,
      noQuery,
      isUserPage = false,
      defaultValue,
      filterQuery,
      wantCashFormat = false,
      filterH,
    } = this.props;
    const { kanbanList, limit, currentPage } = this.state;
    if (!apiUrl) {
      this.setState(dt);
      return;
    }
    let query = this.queryString();
    let queryClient = serialize({ filter });
    let queryClientCan = serialize({ filterCan });

    // if(this.props.typeContract){
    //   queryClient = serialize({ typeContract,taskId })
    // }else{
    //   queryClient = serialize({ filter });
    // }
    // console.log(queryClient,client,'queryClient')
    let URL = noQuery
      ? `${apiUrl}`
      : filterQuery
        ? `${apiUrl}&${query}`
        : filterCan
          ? `${apiUrl}?${queryClientCan}`
          : client
            ? `${apiUrl}?${queryClient}`
            : `${apiUrl}?${query}`;
    fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(async data => {
        let newList;
        if (data.data) newList = data.data;
        else newList = data;
        if (wantCashFormat === true) {
          try {
            newList = newList.map(item => {
              return { ...item, totalContractValue: this.formatCash(`${item.totalContractValue}`), debt: this.formatCash(`${item.debt}`) };
            });
          } catch (e) {
            console.log(e);
          }
        }
        if (!disableDot)
          newList = newList.map(item => {
            if (item.gender === '0') {
              item.gender = 'Nam';
            } else if (item.gender === '1') {
              item.gender = 'Nữ';
            }
            const { others, ...restItem } = item;
            const newItem = {
              ...restItem,
              others: {
                ...convertDotOther(others),
              },
            };
            return convertDot({ ob: newItem, newOb: { originItem: item }, convertArr: true });
          });

        let kanbanStatus = [];
        let max = 1;

        if (this.props.kanban) {
          kanbanStatus = convertOb(kanbanList, this.props.kanbanKey);
          kanbanList.forEach(element => {
            if (element && element.code > max) max = element && element.code;
          });
        }
        newList = newList.map(it => {
          let result;
          let kbStatus = 'gg';
          if (this.props.kanban) {
            kanbanStatus = convertOb(kanbanList, this.props.kanbanKey);
            let max = 1;
            kanbanList.forEach(element => {
              if (element && element.code > max) max = element && element.code;
            });
            let value = 0;
            let color = 'red';
            let title = 'Không xác định';
            if (kanbanStatus[it.kanbanStatus]) {
              value = ((100 * kanbanStatus[it.kanbanStatus].code) / max).toFixed();
              color = kanbanStatus[it.kanbanStatus].color;
              title = kanbanStatus[it.kanbanStatus].name;
            }
            kbStatus = <Process title={title} value={value} color={color} />;
          }

          switch (it.state) {
            case '0':
              result = <p style={{ color: '#d6810b', fontWeight: 'bold' }}>Đang yêu cầu phê duyệt</p>;
              break;
            case '1':
              result = (
                <Tooltip title="Click vào để hoàn thành">
                  <Button variant="outlined" color="primary" onClick={() => this.handleApproveTable(it._id)}>
                    Đã phê duyệt
                  </Button>
                </Tooltip>
              );
              break;
            case '2':
              result = <p style={{ color: '#d60b0b', fontWeight: 'bold' }}>Không phê duyệt</p>;
              break;
            case '3':
              result = <p style={{ color: '#340bd6', fontWeight: 'bold' }}>Không yêu cầu phê duyệt</p>;
              break;
            case '4':
              result = <p style={{ color: 'rgb(16, 109, 10)', fontWeight: 'bold' }}>Hoàn thành</p>;
              break;
            default:
              result = <p>Không xác định</p>;
              break;
          }

          return {
            ...it,
            edit: this.addEdit(it._id, it),
            state: result,
            kanbanStatus: kbStatus,
          };
        });
        if (isUserPage === false) {
          if (mapFunction) newList = newList.map(mapFunction);
        } else {
          if (mapFunction) newList = await Promise.all(newList.map(mapFunction));
        }

        // let key = 'name';
        // let index = 0
        // let name = it[index];
        // if (this.props.hightLight) {
        //   (name = <span style={{cursor: 'pointer', color: '#2196f3'}}>{it[index]}</span>)
        // }
        // console.log(newList,'mappppppppppp')
        // if (this.props.hightLight) {
        //   (newList[0].map(item => <span style={{cursor: 'pointer', color: '#2196f3'}}>{item.key}</span>))
        //  }
        if (customFunction) newList = customFunction(newList, this.state.currentPage);
        const count = client ? newList.length : data.count;
        if (client) {
          const { perPage, activePage, searchClient } = this.state;
          this.setState({ count, totalRows: newList, loading: false, rows: newList, ...dt }, () =>
            this.client({ perPage, activePage, searchClient }),
          );
        } else {
          const newState = {
            ...dt,
            rows: newList,
            loading: false,
            count,
          };
          this.setState(newState);
        }
      })
      .catch(err => {
        console.log('List page mapping error', err);
        this.setState({ loading: false });
      });
  };

  handleApproveTable = id => {
    this.setState({ openDialogApprove: true, id });
  };

  queryString = () => {
    const { typeContract, taskId, isReport = false, noFilter, filterH } = this.props;
    const { sorting, perPage, activePage, search, filters, innerFilter, monthOfBirth, yearOfBirth, limit, currentPage } = this.state;
    if (noFilter) {
      let query;
      const skip = limit * currentPage;
      query = { limit: limit, skip };
      const queryString = serialize(query);
      this.setState({ queryFilter: queryString });
      return queryString;
    } else {
      let filter;
      if (this.props.typeContract) {
        filter = '';
      } else {
        filter = { ...this.props.filter, ...innerFilter };
      }
      // if(monthOfBirth && yearOfBirth){
      //   filter = {$expr: { $eq: {[{ $month: "$dob" }, monthOfBirth]} }}
      // }
      // if(yearOfBirth){
      //   filter = {$expr: { $eq: [{ $year: "$dob" }, yearOfBirth] } }
      // }
      const rex = `${search}`;
      if (search) {
        // if (filters && Array.isArray(filters) && filters.length) {
        //   if (filter.$or)
        //     filter.$or = [...filter.$or, filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } }))]
        //   else filter.$or = filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } }))
        // }
        filter.$or = filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } }));
      }
      const skip = limit * currentPage;
      const columnSorting = sorting[0].direction === 'asc' ? sorting[0].columnName : `-${sorting[0].columnName}`;
      let query;
      if (this.props.typeContract) {
        query = { limit: limit, skip, typeContract, taskId };
      } else {
        query = { limit: limit, skip, sort: columnSorting, limitStatus: this.props.limitStatus };
      }
      query.filter = filter;
      // console.log(88888, query);
      if (this.props.filterType) {
        const { $or, filter: oldFilter, ...rest } = filter;
        if (oldFilter !== undefined) {
          query = { ...query, ...rest, filter: { ...oldFilter, $or: { ...$or } } };
        }
        this.setState({ queryFilter: query });
      }
      let queryString = serialize(query);
      if (filterH) {
        query = { limit: limit, skip, sort: columnSorting, limitStatus: this.props.limitStatus, ...filter }
        queryString = serialize(query)
      }
      this.setState({ queryFilter: queryString });
      return queryString;
    }
  };

  deleteItem = () => {
    const deleteUrl = this.props.deleteUrl ? this.props.deleteUrl : this.props.apiUrl;
    const deleteOption = this.props.deleteOption;

    const URL = deleteUrl;
    const { selected } = this.state;
    const list = this.state.rows.filter((item, index) => selected.includes(index)).map(i => i._id);

    fetch(URL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [deleteOption]: list }),
    })
      .then(respon => {
        // eslint-disable-next-line eqeqeq
        if (respon.status == 200) this.getData({ open: true, variant: 'success', message: 'Xóa thành công' });
        else this.setState({ loading: false, open: true, variant: 'error', message: 'Xóa không thành công' });
      })

      .catch(() => this.setState({ loading: false, open: true, variant: 'error', message: 'Không có phản hồi, kiểm tra lại kết nối' }));
  };

  changeColumnOrder = newOrder => {
    const columns = this.state.columns;
    const newColumns = columns.map(item => ({ ...item, order: newOrder.indexOf(item.name) }));
    this.setState({ columnOrder: newOrder });
    this.saveConfig(newColumns);
    // this.saveConfigAll(newColumns)
  };

  saveConfig = (columns, fileColumns) => {
    const code = this.props.code;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    let data = viewConfig && viewConfig.find(item => item.code === code);
    const index = viewConfig && viewConfig.findIndex(item => item.code === code);
    const newColumns = columns && columns.filter(item => item.tp !== 1 && item.name !== 'edit');

    const newOthers = columns.filter(item => item.tp === 1);
    data ? (data.filterField = this.state.filterField) : null;
    data ? (data.listDisplay.type.fields.type.columns = newColumns) : null;
    data ? (data.listDisplay.type.fields.type.others = newOthers) : null;
    data ? (data.listDisplay.type.fields.type.fileColumns = fileColumns) : null;
    let URL = '';
    if (data && data._id) {
      URL = data ? `${API_VIEW_CONFIG}/${data._id}` : null;
      this.setState({ IDD: data._id });
    } else if (data) {
      data._id = this.state.IDD;
      URL = data ? `${API_VIEW_CONFIG}/${data._id}` : null;
    }
    if (URL !== '')
      fetch(URL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(() => {
          viewConfig[index].listDisplay.type.fields.type.columns = newColumns;
          viewConfig[index].filterField = this.state.filterField;
          viewConfig[index].listDisplay.type.fields.type.fileColumns = fileColumns;
          localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
          this.setState({ viewConfigUpdateTime: new Date() * 1 });
        })
        .catch(() => this.setState({ open: true, variant: 'error', message: 'Cập nhật thất bại' }));
  };

  handleDeleteItem = () => {
    const { selected } = this.state;
    this.setState({ deleteDialog: false, selected: [] });
    if (typeof this.props.onDelete === 'function') {
      const list = this.state.rows.filter((item, index) => selected.includes(index)).map(i => i._id);
      this.props.onDelete(list);
    } else if (selected.length !== 0) {
      this.deleteItem();
    }
  };

  saveSetting = (columns, status, filterField, forth, fileColumns) => {
    if (status) {
      this.setState({ dialogStatus: false, columns, filterField }, () => {
        this.saveConfig(columns, fileColumns);
      });
    } else {
      const columnOrder = [...columns].sort((a, b) => a.order - b.order);
      this.setState({ columns, dialogStatus: false, columnOrder });
    }
  };

  saveConfigAll = (columns, fileColumns) => {
    const code = this.props.code;
    // debugger;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    let data = viewConfig && viewConfig.find(item => item.code === code);
    const index = viewConfig && viewConfig.findIndex(item => item.code === code);
    const newColumns = columns && columns.filter(item => item.tp !== 1 && item.name !== 'edit');

    const newOthers = columns && columns.filter(item => item.tp === 1);
    if (data) {
      data.listDisplay.type.fields.type.columns = newColumns;
      data.listDisplay.type.fields.type.others = newOthers;
      data.listDisplay.type.fields.type.fileColumns = fileColumns;
      if (data._id) {
        this.setState({ IDD: data._id });
        delete data._id;
      }
    }
    const URL = `${API_UPDATE_ALL_SYSTEM}`;
    fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(res => {
        viewConfig[index].listDisplay.type.fields.type.columns = newColumns;
        viewConfig[index].listDisplay.type.fields.type.fileColumns = fileColumns;
        localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
        if (res.status === 0) this.setState({ open: true, variant: 'error', message: res.message, viewConfigUpdateTime: new Date() * 1 });
        else this.setState({ open: true, variant: 'success', message: res.message, viewConfigUpdateTime: new Date() * 1 });
      })
      .catch(() => this.setState({ open: true, variant: 'error', message: 'Cập nhật thất bại' }));
  };
  saveSettingAll = (columns, status, third, forth, fileColumns) => {
    if (status) {
      this.setState({ dialogStatus: false, columns });
      this.saveConfigAll(columns, fileColumns);
    } else {
      const columnOrder = [...columns].sort((a, b) => a.order - b.order);
      this.setState({ columns, dialogStatus: false, columnOrder });
    }
  };
  handleSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const search = e.target.value;
    this.setState({ reloadPage: new Date() * 1 });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ search: search.toLowerCase() });
    }, 500);
  };

  getUrl() {
    const res = window.location.pathname.split('/');
    const path = this.props.path ? this.props.path : res[res.length - 1];
    return path;
  }

  addEdit = (id, item) => {
    // const roleCodeRender = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
    // const roleModuleRender = roleCode && roleCode.methods ? roleCode.methods : [];
    if (this.props.code && !this.props.parentCode) {
      let codeModule;
      if (this.props.codeModule) {
        codeModule = this.props.codeModule;
      } else if (this.props.codeRole) {
        codeModule = this.props.codeRole;
      } else {
        codeModule = this.props.code;
      }
      const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === codeModule);
      const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
      // console.log(roleModule, 'roleModule');
      return (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {typeof this.props.onEdit === 'function' ? (
            <span
              onClick={() => {
                this.props.onEdit(item);
              }}
              className="CustomIconListTask"
            >
              <Tooltip title="Cập nhật">
                <Edit />
              </Tooltip>
            </span>
          ) : (
            <Link to={`${this.props.customUrl ? this.props.customUrl(item) : this.getUrl()}/${id}`}>
              <span className="CustomIconListTask">
                <Tooltip title="Cập nhật">
                  <Edit />
                </Tooltip>
              </span>
            </Link>
          )}

          {/* <Fab onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })}>
            <Tooltip title="Khác">
              <Dehaze />
            </Tooltip>
          </Fab> */}
          {this.props.disableMenuAction ? null : (
            <span onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })} className="CustomIconListTask">
              <Tooltip title="Khác">
                <Dehaze />
              </Tooltip>
            </span>
          )}
        </div>
      ) : null;
    } else {
      let codeModule;
      if (this.props.codeModule) {
        codeModule = this.props.codeModule;
      } else if (this.props.codeRole) {
        codeModule = this.props.codeRole;
      } else {
        codeModule = this.props.code;
      }

      const roleCode =
        this.props.dashboardPage &&
        this.props.dashboardPage.role &&
        this.props.dashboardPage.role.roles &&
        this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === codeModule);
      const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
      return (
        //  {
        (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {typeof this.props.onEdit === 'function' ? (
              <span
                onClick={() => {
                  this.props.onEdit(item);
                }}
                className="CustomIconListTask"
              >
                <Tooltip title="Cập nhật">
                  <Edit />
                </Tooltip>
              </span>
            ) : (
              <Link to={`${this.getUrl()}/${id}`}>
                <span className="CustomIconListTask">
                  <Tooltip title="Cập nhật">
                    <Edit />
                  </Tooltip>
                </span>{' '}
              </Link>
            )}
            {this.props.disableMenuAction ? null : (
              <span onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })} className="CustomIconListTask">
                <Tooltip title="Hoạt động">
                  <Dehaze />
                </Tooltip>
              </span>
            )}
            {/* <Fab onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })}>
          <Dehaze />
        </Fab> */}
          </div>
        ) : null
        // }
      );
    }
  };

  closeFilter = () => {
    this.setState({ anchorEl: null });
  };

  changeSorting = sorting => {
    if (this.props.client) {
      this.setState({
        sorting,
      });
      return;
    }
    this.setState({
      loading: true,
      sorting,
    });
  };

  selectField = name => () => {
    const { filters } = this.state;
    const index = filters.indexOf(name);
    if (index === -1) {
      const newFilter = filters.concat(name);
      this.setState({ filters: newFilter });
    } else {
      const newFilter = filters.filter((it, id) => id !== index);
      this.setState({ filters: newFilter });
    }
  };

  addApproveTable = () => {
    const data = {
      model: this.props.code,
      id: this.state.id,
    };
    fetch(API_COMMON_APPROVE_FINISH, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      this.setState({ open: true, variant: 'success', message: 'Thay đổi trạng thái thành công', openDialogApprove: false });
      this.getData();
    });
  };

  closeAnchorElAction = () => {
    this.setState({ anchorElAction: false });
  };

  closeDialogStatus = () => {
    this.setState({ dialogStatus: false });
  };

  exportExcel = async dt => {
    const { apiUrl, filter } = this.props;
    if (!apiUrl) {
      this.setState(dt);
      return;
    }
    const queryClient = serialize({ filter });
    const URL = `${apiUrl}?${queryClient}`;

    const data = await fetchData(URL);
    /* convert state to workbook */

    // check từng key trong objject

    const ws = XLSX.utils.json_to_sheet(data.data ? data.data : data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, `${this.props.code}_ImportTemplate.xlsx`);
  };

  shareItem = () => {
    const { selected, rows, employessCustomer } = this.state;
    const customerIds = rows.filter((i, id) => selected.includes(id)).map(i => i._id);
    const employeeIds = employessCustomer.map(i => i._id);
    fetch(`${API_CUSTOMERS}/updateViewable`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeIds, customerIds }),
    })
      .then(() => {
        // eslint-disable-next-line eqeqeq
        this.setState({ open: true, variant: 'success', message: 'Chia sẻ thành công', shareDialog: false });
        this.getData();
      })
      .catch(() => this.setState({ open: true, variant: 'error', message: 'Chia sẻ thất bại' }));
  };

  handleShare = () => {
    this.setState({ shareDialog: false, selected: [] });
    if (this.state.selected.length !== 0) {
      this.shareItem();
    }
  };

  handleChange = name => event => {
    // console.log('check>>>>filterChange', name, 'hahaha>>>>', event);
    if (this.state.filter.expirationDay) {
      delete this.state.filter.filter.expirationDay;
    }
    if (event.target.value) {
      this.state.filter.filter[name] = event.target.value;
      // const { filter } = this.state;
    } else {
      delete this.state.filter.filter[name];
      // const { filter } = this.state;
    }
    this.state.filter.skip = 0;
    this.state.filter.limit = 10;
    const query = serialize(this.state.filter);
    this.props.onGetContracts(query);
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.props.mergeDataContract({ reload: false });
    this.setState({ [name]: event.target.value, value: 0, pageDetail }, () => this.props.mergeDataContract({ reload: true }));
  };

  onChangeCheck = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  checkShow = show => {
    this.setState({ show });
  };

  onFilterSearch = () => {
    const currentInnerFilter = this.state.innerFilter;
    const currFilterAdvance = this.state.filterAdvance;
    const { columns } = this.state;
    const newInnerFilter = { ...currentInnerFilter };
    this.setState({ reloadPage: new Date() * 1 });
    
    Object.keys(currFilterAdvance).forEach(key => {
      if ((!currFilterAdvance[key] && !currFilterAdvance[key] !== 0) || (Array.isArray(currFilterAdvance[key]) && !currFilterAdvance[key].length)) {
        const col = columns.find(c => c.name === key);
        delete newInnerFilter[key];
        delete newInnerFilter[`${key}.employeeId`];
        delete newInnerFilter[`${key}.customerId`];
        delete newInnerFilter[`${key}.value`];
        delete newInnerFilter[col.filterKey || key];
      } else {
        const col = columns.find(c => c.name === key);
        
        if (col.dateFilterType) {
          newInnerFilter[key] = {
            $gte: moment()
              .set(col.dateFilterType, currFilterAdvance[key])
              .startOf(col.dateFilterType)
              .format(),
            $lt: moment()
              .set(col.dateFilterType, currFilterAdvance[key])
              .endOf(col.dateFilterType)
              .format(),
          };
          return;
        }
        if (col.name === 'unit.name') {
          newInnerFilter[`filter[${col.name}]`] = currFilterAdvance[key].name;
        }
        if (col.type) {
          const [firstEle, model, thirdEle] = col.type.split('|');

          const isMulti = thirdEle === 'Array' ? true : false;
          if (col.name === 'responsibilityPerson') {
            if (isMulti) {
              newInnerFilter[`${key}.employeeId`] = { $in: currFilterAdvance[key].map(i => i._id) };
            } else {
              newInnerFilter[`${key}.employeeId`] = currFilterAdvance[key]._id;
            }
            return;
          }
          if (col.name === 'supervisor') {
            if (isMulti) {
              newInnerFilter[`${key}.employeeId`] = { $in: currFilterAdvance[key].map(i => i._id) };
            } else {
              newInnerFilter[`${key}.employeeId`] = currFilterAdvance[key]._id;
            }
            return;
          } else if (firstEle === 'ObjectId' && model) {
            if (isMulti) {
              newInnerFilter[col.filterKey || key] = { $in: currFilterAdvance[key].map(i => i._id) };
            } else {
              newInnerFilter[col.filterKey || key] = currFilterAdvance[key]._id;
            }
            return;
          } else if (firstEle === 'Source') {
            if (key === 'kanbanStatus') {
              newInnerFilter[`${key}`] = currFilterAdvance[key][col.type.split('|').pop()];
              return;
            }
            if (col.type === 'Source|CrmSource,S06|String||title') {
              newInnerFilter[`${key}`] = currFilterAdvance[key][col.type.split('|').pop()];
              return;
            }
            if (col.name === 'position') {
              newInnerFilter[`${key}.value`] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].value;
            } else if (col.name === 'vacancy.roleName') {
              newInnerFilter[`${key}`] = currFilterAdvance[key].name ? currFilterAdvance[key].name : currFilterAdvance[key].code;
            }
            if (col.name === 'paidList') {
             
              newInnerFilter[`${key}.payMethod`] = currFilterAdvance[key].title ? currFilterAdvance[key].title : currFilterAdvance[key].value;
            }
             else {
             
              newInnerFilter[col.filterKey || key] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].value;
            }
            return;
          }
        }
        if (col.type === 'Date' && col.dateRange === 'start') {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .toString(),
          };
        } else if (col.type === 'Date' && col.dateRange === 'end') {
          newInnerFilter[key] = {
            $lt: moment(currFilterAdvance[key]._d)
              .endOf('day')
              .toString(),
          };
        } else if (col.type === 'Date' && col.filterType) {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key][0])
              .startOf('day')
              .format(),
            $lte: moment(currFilterAdvance[key][1])
              .endOf('day')
              .format(),
          };
        } else if (col.type === 'Date' || col.type === 'date') {
          // if (col.type === 'date') {
          //   newInnerFilter[key] = {
          //     $gte: moment(currFilterAdvance[key]._d)
          //       .startOf('day')
          //       .format(),
          //     $lte: moment(currFilterAdvance[key]._d)
          //       .endOf('day')
          //       .format(),
          //   };
          // } else {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[`${key}`]._d)
              .startOf('day')
              .toString(),
            $lte: moment(currFilterAdvance[`${key}`]._d)
              .endOf('day')
              .toString(),
          };
          // }
        } else if (col.dateRange === 'start') {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .toString(),
          };
        } else if (col.type === 'Datetime') {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .format(),
            $lt: moment(currFilterAdvance[key]._d)
              .endOf('day')
              .format(),
          };
        } else if (col.type === 'Boolean') {
          newInnerFilter[key] = this.state.isCheckedNo;
        } else if (col.type === 'Number') {
          newInnerFilter[key] = currFilterAdvance[key];
        } else {
          newInnerFilter[key] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].value;
        }
      }
    });
    this.setState({ innerFilter: newInnerFilter, dialogAllFilter: false }, () => {
      // this.getData();
    });
  };

  getLimit = value => {
    this.setState({ limit: value }, () => {
      this.loadData(true);
    });
  };
  getPage = value => {
    this.setState({ currentPage: value }, () => {
      this.loadData(true);
    });
  };
  handleChangeInputFollowType = e => {
    // this.setState({ [e.target.name]: e.target.value }, () => {
    //   this.filterProductFollowCategoriesAndBrand();
    // });
    const {
      target: { name, value },
    } = e;

    const { filter } = this.state;
    let newFilter = { ...filter };
    if (name === 'brand' && value !== 0) newFilter['tags'] = value;
    else if (name === 'brand' && value === 0) delete newFilter['tags'];
    if (name === 'groupProduct' && value !== 0) newFilter['catalog.catalogId'] = value.id;
    else if (name === 'groupProduct' && value === 0) delete newFilter['catalog.catalogId'];
    if (name === 'supplier' && value !== 0) newFilter['supplier.supplierId'] = value._id;
    else if (name === 'supplier' && value === 0) delete newFilter['supplier.supplierId'];
    if (name === 'catalogContract' && value !== 0) newFilter['catalogContract.catalogContractId'] = value._id;
    else if (name === 'catalogContract' && value === 0) delete newFilter['catalogContract.catalogContractId'];

    this.setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
      filter: newFilter,
    }));
  };
  render() {
    const {
      dialogStatus,
      activePage,
      perPage,
      deleteDialog,
      loading,
      open,
      variant,
      message,
      importExport,
      columns,
      selected,
      columnOrder,
      rows,
      count,
      sorting,
      searchClient,
      anchorEl,
      filters,
      anchorElAction,
      openDialogApprove,
      columnExtensions,
      rightColumns,
      shareDialog,
      filterField,
      exportAnchor,
      show,
      fileColumns,
    } = this.state;
    const {
      newPaging,
      pointerCursor,
      onRowClick,
      client,
      disableAdd,
      settingBar,
      settingSearch,
      listContractTypes,
      tree,
      code,
      disableSelect,
      disableSearch,
      addFunction,
      exportExcel,
      advanceFilter,
      customActions,
      extraColumns,
      miniActive,
      excludeDatetype,
      disableTodo,
      disableCreateTodo,
      disableSMS,
      disableSeenMail,
      disableRequest,
      disableExport,
      tabEx,
      disableChangePassword,
      filterEdit,
      md,
      intl,
      height,
      kanban,
    } = this.props;
    localStorage.setItem('dafault', JSON.stringify(this.props.defaultValue));
    const path = this.getUrl();
    let codeModule;
    if (this.props.codeModule) {
      codeModule = this.props.codeModule;
    } else if (this.props.codeRole) {
      codeModule = this.props.codeRole;
    } else {
      codeModule = this.props.code;
    }

    const roleCode = this.props.dashboardPage.role.roles && this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === codeModule);

    const roleModule = roleCode ? roleCode.methods : [];
    const months = [
      {
        value: '1',
        label: 'Tháng 1 ',
      },
      {
        value: '2',
        label: 'Tháng 2',
      },
      {
        value: '3',
        label: 'Tháng 3',
      },
      {
        value: '4',
        label: 'Tháng 4',
      },
      {
        value: '5',
        label: 'Tháng 5',
      },
      {
        value: '6',
        label: 'Tháng 6',
      },
      {
        value: '7',
        label: 'Tháng 7',
      },
      {
        value: '8',
        label: 'Tháng 8',
      },
      {
        value: '9',
        label: 'Tháng 9',
      },
      {
        value: '10',
        label: 'Tháng 10',
      },
      {
        value: '11',
        label: 'Tháng 11',
      },
      {
        value: '12',
        label: 'Tháng 12',
      },
    ];

    let days = [];
    for (let i = 31; i >= 1; i--) {
      days.unshift(i);
    }

    let years = [];
    const currentYear = moment().format('YYYY');
    for (let i = 1921; i <= currentYear; i++) {
      years.unshift(i);
    }
    return (
      <GridContainer>
        <MenuFilter
          selectField={this.selectField}
          columns={columns}
          closeFilter={this.closeFilter}
          anchorEl={anchorEl}
          filters={filters}
          code={this.props.code}
          optionSearch={this.props.optionSearch}
        />
        <MenuAction
          handleClose={this.closeAnchorElAction}
          anchorEl={anchorElAction}
          code={this.props.code}
          exportExcel={exportExcel}
          roleModule={roleModule}
          id={this.state.id}
          ID={this.props.profile && this.props.profile._id}
          itemCurrent={this.state.itemCurrent}
          addChildTask={this.props.addChildTask}
          extraMenu={this.props.extraMenu}
          getData={this.getData}
          miniActive={miniActive}
          dashboardPage={this.props.dashboardPage}
          disableTodo={disableTodo}
          disableCreateTodo={disableCreateTodo}
          disableSMS={disableSMS}
          disableSeenMail={disableSeenMail}
          disableRequest={disableRequest}
          disableExport={disableExport}
          tabEx={tabEx}
          disableChangePassword={disableChangePassword}
        />

        {this.props.reports ? (
          <GridItem item xs={2}>
            <TextFieldUI
              variant="outlined"
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment style={{ cursor: 'pointer' }} position="end">
              //       <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
              //     </InputAdornment>
              //   ),
              // }}
              placeholder="Tìm kiếm ..."
              ref={input => (this.search = input)}
              onChange={this.handleSearch}
            />
          </GridItem>
        ) : null}
        <GridItem md={9} sm={9}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {disableSearch ? null : client ? (
              <GridItem md={12} sm={12}>
                <TextField style={{ marginLeft: 13 }} placeholder="Tìm kiếm ..." value={searchClient} onChange={this.changeSearch} />
              </GridItem>
            ) : (
              <GridItem md={12} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                {this.props.notChangeSearch ? (
                  <TextFieldUI
                    variant="outlined"
                    // InputProps={{
                    //   endAdornment: (
                    //     <InputAdornment style={{ cursor: 'pointer' }} position="end">
                    //       <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
                    //     </InputAdornment>
                    //   ),
                    // }}
                    placeholder="Tìm kiếm ..."
                    ref={input => (this.search = input)}
                    onChange={this.handleSearch}
                  />
                ) : (
                  <TextFieldUI
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment style={{ cursor: 'pointer' }} position="end">
                          <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Tìm kiếm ..."
                    ref={input => (this.search = input)}
                    onChange={this.handleSearch}
                    inputProps={{
                      style: {
                        padding: '15px 0px 15px 0px',
                        margin: '0 15px',
                      },
                    }}
                    style={{
                      marginLeft: 13,
                      width: this.props.defaultWidth ? this.props.defaultWidth : this.props.filterWidth ? this.props.filterWidth : '230px',
                      marginRight: 6,
                    }}
                  />
                )}

                {this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth > 685 ? (
                  <>
                    {show === true && (
                      <GridItem md={this.props.md ? this.props.md : 5} sm={4} style={{ paddingLeft: 20 }}>
                        <DepartmentAndEmployee
                          onChangeShow={this.checkShow}
                          onChange={result => {
                            let employeeId = '';
                            let organizationUnitId = '';
                            const { innerFilter } = this.state;
                            const newFilter = {};
                            if (result) {
                              if (result.department) {
                                newFilter[this.props.organizationUnitFilterKey || 'organizationUnitId'] = result.department;
                              }
                              if (result.employee) {
                                newFilter[this.props.employeeFilterKey || 'employeeId'] = result.employee._id;
                              }
                            }
                            this.setState({ innerFilter: newFilter }, () => {
                              this.loadData();
                            });
                          }}
                          disableEmployee={this.props.disableEmployee}
                          isHrm={this.props.isHrm}
                          profile={this.props.profile}
                          moduleCode={this.props.code}
                        />
                      </GridItem>
                    )}
                  </>
                ) : null}
                {columns.filter(c => c.enabaleSearch && c.isInSearchbar && c.type !== 'String').map(
                  c =>
                    !c.dateRange ? (
                      <GridItem item xs={2}>
                        <CustomInputField
                          dateFilterType={c.dateFilterType}
                          filterType={c.filterType ? c.filterType : null}
                          options={c.menuItem ? c.menuItem : ''}
                          configType={c.configType ? c.configType : ''}
                          configCode={c.configCode ? c.configCode : ''}
                          type={c.type}
                          name={c.name}
                          label={c.title}
                          isChecked={this.state.isChecked}
                          isCheckedNo={this.state.isCheckedNo}
                          value={this.state.filterAdvance[c.name]}
                          onChange={(newVal, e) => {
                            const { filterAdvance } = this.state;
                           
                            let newFilterAdvance;
                            if (e === 'true' || e === 'false') {
                              newFilterAdvance = { ...filterAdvance, [c.name]: e };
                              this.setState({ isCheckedNo: e });
                            } else {
                              newFilterAdvance = {
                                ...filterAdvance,
                                [c.name]:
                                  c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number' || c.type === 'date'
                                    ? newVal.target.value
                                    : c.type === 'Date' && (c.filterType || c.dateFilterType)
                                      ? newVal.target.value
                                      : newVal,
                              };
                            }
                            this.setState({ filterAdvance: newFilterAdvance }, () => {
                              this.onFilterSearch();
                            });
                          }}
                        />
                      </GridItem>
                    ) : null,
                )}
                {(this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth <= 1285) ||
                  columns.filter(c => c.enabaleSearch && !c.isInSearchbar && c.type !== 'String').length ||
                  settingSearch ||
                  listContractTypes ? (
                  <Fab
                    onClick={() => this.setState({ dialogAllFilter: true })}
                    color="primary"
                    style={{ width: 40, height: 40, minWidth: 40, marginLeft: 5 }}
                  >
                    <Tooltip title="Xem thêm filter">
                      <FilterList />
                    </Tooltip>
                  </Fab>
                ) : null}
                <DialogUI
                  title="Bộ lọc nâng cao"
                  onClose={() => this.setState({ dialogAllFilter: false })}
                  onSave={() => {
                    this.onFilterSearch();
                  }}
                  saveText="Lưu"
                  open={this.state.dialogAllFilter}
                >
                  <div style={{ height: 500 }}>
                    {listContractTypes ? (
                      <FormControl fullWidth>
                        <TextField
                          select
                          label="Loại hợp đồng"
                          name="catalogContract"
                          value={this.state.catalogContract}
                          onChange={this.handleChangeInputFollowType}
                          margin="normal"
                        >
                          <MenuItem selected value={0}>
                            Loại hợp đồng
                          </MenuItem>
                          {this.props.listContractTypes.map(item => (
                            <MenuItem value={item.title}>{item.title}</MenuItem>
                          ))}
                        </TextField>
                      </FormControl>
                    ) : null}
                    {/* {settingSearch ? (
                      <div>
                        <TextField
                          select
                          label="Thương hiệu"
                          name="brand"
                          variant="outlined"
                          value={this.state.brand}
                          onChange={this.handleChangeInputFollowType}
                          style={{
                            width: '30%',
                            marginTop: 20,
                            textAlign: 'left',
                          }}
                          margin="normal"
                        >
                          <MenuItem value={0}>-- Tất cả --</MenuItem>
                          {this.props.filterType.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item.name}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                        <TextField
                          select
                          label="Nhà cung cấp"
                          name="supplier"
                          variant="outlined"
                          value={this.state.supplier}
                          onChange={this.handleChangeInputFollowType}
                          style={{
                            width: '30%',
                            marginLeft: '5%',
                            marginTop: 20,
                            textAlign: 'left',
                          }}
                          margin="normal"
                        >
                          <MenuItem value={0}>-- Tất cả --</MenuItem>
                          {this.props.suppliersList.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                        <TextField
                          select
                          label="Nhóm sản phẩm"
                          name="groupProduct"
                          variant="outlined"
                          value={this.state.groupProduct}
                          onChange={this.handleChangeInputFollowType}
                          style={{
                            width: '30%',
                            marginLeft: '5%',
                            marginTop: 20,
                            textAlign: 'left',
                          }}
                          margin="normal"
                        >
                          <MenuItem value={0}>-- Tất cả --</MenuItem>
                          {this.props.categoryList.map(item => (
                            <MenuItem
                              key={item.id}
                              value={item}
                              style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}
                            >
                              {item.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    ) : null} */}
                    {this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth <= 1285 ? (
                      <GridItem md={12} sm={12}>
                        <DepartmentAndEmployee
                          onChange={result => {
                            let employeeId = '';
                            let organizationUnitId = '';
                            const { innerFilter } = this.state;
                            const newFilter = {};
                            if (result) {
                              if (result.department) {
                                newFilter[this.props.organizationUnitFilterKey || 'organizationUnitId'] = result.department;
                              }
                              if (result.employee) {
                                newFilter[this.props.employeeFilterKey || 'employeeId'] = result.employee._id;
                              }
                            }
                            this.setState({ innerFilter: newFilter }, () => {
                              this.loadData();
                            });
                          }}
                          isHrm={this.props.isHrm}
                          profile={this.props.profile}
                          moduleCode={this.props.code}
                        />
                      </GridItem>
                    ) : null}
                    <GridItem container>
                      {columns.find(c => c.name === 'birthDay') ? (
                        <>
                          <GridItem item xs={4}>
                            <TextField
                              value={this.state.dayOfBirth}
                              fullWidth
                              label="Ngày sinh"
                              select
                              onChange={e => {
                                this.setState({ dayOfBirth: e.target.value });
                                const { innerFilter } = this.state;
                                const newFilterAdvance = { ...innerFilter, $expr: { $eq: [{ $dayOfMonth: '$birthDay' }, e.target.value] } };
                                this.setState({ innerFilter: newFilterAdvance });
                                // this.setState({
                                //   innerFilter: {

                                //   },
                                // });
                              }}
                            >
                              {days.map(i => (
                                <MenuItem key={i} value={i}>
                                  {`${i}`}
                                </MenuItem>
                              ))}
                            </TextField>
                          </GridItem>
                          <GridItem item xs={4}>
                            <TextField
                              value={this.state.monthOfBirth}
                              fullWidth
                              label="Tháng sinh"
                              select
                              onChange={e => {
                                this.setState({ monthOfBirth: e.target.value });
                                // this.setState({
                                //   innerFilter: {
                                //     ...$expr,
                                //     $expr: { $eq: [{ $month: "$dob" }, e.target.value] }
                                //   },
                                // });
                                const { innerFilter } = this.state;
                                const newFilterAdvance = { ...innerFilter, $expr: { $eq: [{ $month: '$birthDay' }, e.target.value] } };
                                this.setState({ innerFilter: newFilterAdvance });
                              }}
                            >
                              {months.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </GridItem>
                          <GridItem item xs={4}>
                            <TextField
                              value={this.state.yearOfBirth}
                              fullWidth
                              label="Năm sinh"
                              select
                              onChange={e => {
                                this.setState({ yearOfBirth: e.target.value });
                                // const { innerFilter } = this.state;
                                // this.setState({
                                //   innerFilter: {
                                //     ...$expr,
                                //     $expr: { $eq: [{ $year: "$dob" }, e.target.value] }
                                //   },
                                // });
                                const { innerFilter } = this.state;
                                const newFilterAdvance = { ...innerFilter, $expr: { $eq: [{ $year: '$birthDay' }, e.target.value] } };
                                this.setState({ innerFilter: newFilterAdvance });
                              }}
                            >
                              {years.map(i => (
                                <MenuItem key={i} value={i}>
                                  {`Năm ${i}`}
                                </MenuItem>
                              ))}
                            </TextField>
                          </GridItem>
                        </>
                      ) : null}
                    </GridItem>
                    <GridItem container>
                      {columns.find(
                        c =>
                          (c.dateRange === 'start' && c.enabaleSearch === true && !c.isInSearchbar) ||
                          (c.dateRange === 'end' && c.enabaleSearch === true),
                      ) ? (
                        <>
                          <GridItem item xs={2}>
                            <TextField
                              value={this.state.valueFilter}
                              fullWidth
                              label="Lọc theo"
                              select
                              onChange={e => {
                                this.setState({ valueFilter: e.target.value });
                                if (e.target.value === 1) {
                                  this.setState({
                                    innerFilter: {
                                      startDate: {
                                        $gte: moment()
                                          .startOf('week')
                                          .startOf('day')
                                          .toString(),
                                      },
                                      endDate: {
                                        $lte: moment()
                                          .endOf('week')
                                          .endOf('day')
                                          .toString(),
                                      },
                                    },
                                  });
                                } else if (e.target.value === 2) {
                                  this.setState({
                                    innerFilter: {
                                      startDate: {
                                        $gte: moment()
                                          .startOf('month')
                                          .startOf('day')
                                          .toString(),
                                      },
                                      endDate: {
                                        $lte: moment()
                                          .endOf('month')
                                          .endOf('day')
                                          .toString(),
                                      },
                                    },
                                  });
                                } else if (e.target.value === 3) {
                                  this.setState({
                                    innerFilter: {
                                      startDate: {
                                        $gte: moment()
                                          .startOf('quarter')
                                          .startOf('day')
                                          .toString(),
                                      },
                                      endDate: {
                                        $lte: moment()
                                          .endOf('quarter')
                                          .endOf('day')
                                          .toString(),
                                      },
                                    },
                                  });
                                } else {
                                  this.setState({
                                    innerFilter: {},
                                  });
                                }
                              }}
                            >
                              <MenuItem value={0}>--CHỌN--</MenuItem>
                              <MenuItem value={1}>Tuần</MenuItem>
                              <MenuItem value={2}>Tháng</MenuItem>
                              <MenuItem value={3}>Quý</MenuItem>
                            </TextField>
                          </GridItem>
                          <GridItem item xs={4}>
                            {columns.find(c => c.dateRange === 'start' && c.enabaleSearch === true) ? (
                              <CustomInputField
                                type={columns.find(c => c.dateRange === 'start').type}
                                label={columns.find(c => c.dateRange === 'start').title}
                                value={this.state.filterAdvance[columns.find(c => c.dateRange === 'start').name]}
                                onChange={newVal => {
                                  const { filterAdvance } = this.state;
                                  const newFilterAdvance = { ...filterAdvance, [columns.find(c => c.dateRange === 'start').name]: newVal };
                                  this.setState({ filterAdvance: newFilterAdvance });
                                }}
                              />
                            ) : null}
                          </GridItem>
                          <GridItem item xs={6}>
                            {columns.find(c => c.dateRange === 'end' && c.enabaleSearch === true) ? (
                              <CustomInputField
                                type={columns.find(c => c.dateRange === 'end').type}
                                label={columns.find(c => c.dateRange === 'end').title}
                                value={this.state.filterAdvance[columns.find(c => c.dateRange === 'end').name]}
                                onChange={newVal => {
                                  const { filterAdvance } = this.state;
                                  const newFilterAdvance = { ...filterAdvance, [columns.find(c => c.dateRange === 'end').name]: newVal };
                                  this.setState({ filterAdvance: newFilterAdvance });
                                }}
                              />
                            ) : null}
                          </GridItem>
                        </>
                      ) : null}

                      {columns.filter(c => c.enabaleSearch && !c.isInSearchbar && c.type !== 'String').map(
                        c =>
                          !c.dateRange ? (
                            <GridItem item xs={6}>
                              {/* {console.log('type', c.type)} */}
                              <CustomInputField
                                dateFilterType={c.dateFilterType}
                                filterType={c.filterType ? c.filterType : null}
                                options={c.menuItem ? c.menuItem : ''}
                                configType={c.configType ? c.configType : ''}
                                configCode={c.configCode ? c.configCode : ''}
                                type={c.type}
                                name={c.name}
                                label={c.title}
                                isChecked={this.state.isChecked}
                                isCheckedNo={this.state.isCheckedNo}
                                value={this.state.filterAdvance[c.name]}
                                onChange={(newVal, e) => {
                                  const { filterAdvance } = this.state;

                                  let newFilterAdvance;
                                  if (e === 'true' || e === 'false') {
                                    newFilterAdvance = { ...filterAdvance, [c.name]: e };
                                    this.setState({ isCheckedNo: e });
                                  } else {
                                    newFilterAdvance = {
                                      ...filterAdvance,
                                      [c.name]:
                                        c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number' || c.type === 'date'
                                          ? newVal.target.value
                                          : c.type === 'Date' && c.filterType
                                            ? newVal.target.value
                                            : newVal,
                                    };
                                  }
                                  // if (c.name === 'month' && Number(newVal) < 13 && Number(newVal) > 0 || c.name !== 'month')
                                  if (newFilterAdvance.month < 13 && c.name === 'month') {
                                    this.setState({ filterAdvance: newFilterAdvance });
                                  }
                                  if (c.name !== 'month') {
                                    this.setState({ filterAdvance: newFilterAdvance });
                                  }
                                }}
                              />
                            </GridItem>
                          ) : null,
                      )}
                    </GridItem>
                  </div>
                </DialogUI>
              </GridItem>
            )}
          </div>
        </GridItem>
        {this.props.showStartEnd ? (
          <GridItem md={3} sm={3}>
            <GridItem item xs={6} style={{ position: 'relative', marginBottom: 5 }}>
              <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={this.props.valueStartDate}
                  variant="outlined"
                  label="Từ ngày"
                  margin="dense"
                  required
                  fullWidth
                  name="startDate"
                  onChange={e => this.props.onChangeDate(e, true, true)}
                />
              </MuiPickersUtilsProvider>
              {this.props.errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{this.props.errorTextStartDate}</p>
              ) : null}
            </GridItem>
            <GridItem item xs={6} style={{ position: 'relative', marginBottom: 5 }}>
              <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                <DatePicker
                  inputVariant="outlined"
                  fullWidth
                  format="DD/MM/YYYY"
                  value={this.props.valueEndDate}
                  variant="outlined"
                  label="Đến ngày"
                  margin="dense"
                  required
                  name="endDate"
                  onChange={e => this.props.onChangeDate(e, true, false)}
                />
              </MuiPickersUtilsProvider>
              {this.props.errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{this.props.errorTextEndDate}</p>
              ) : null}
            </GridItem>
          </GridItem>
        ) : null}

        {advanceFilter ? (
          <GridItem md={12} sm={12}>
            {advanceFilter}
          </GridItem>
        ) : null}
        {/* <GridItem md={8} sm={8}>
           {advanceFilter ? advanceFilter : null}
         </GridItem> */}
        {/* {customActions ? (
           <GridItem md={4} sm={4} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
             {customActions.map(item => item)}
           </GridItem>
         ) : null} */}
        {/* {
          console.log(this.state.selected, 'this.state.selected', roleModule)
        } */}
        <GridItem md={3} sm={3} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
          {!advanceFilter ? (
            <GridItem style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
              {this.state.selected.length !== 0 ? (
                // this.props.code && !this.props.parentCode ? (
                (roleModule.find(elm => elm.name === 'DELETE') || { allow: false }).allow ? (
                  <Fab color="secondary">
                    <Tooltip title="Xóa dữ liệu">
                      <Delete onClick={this.openDialog('deleteDialog')} />
                    </Tooltip>
                  </Fab>
                ) : null
              ) : //   : (
                //     <Fab color="secondary">
                //       <Delete onClick={this.openDialog('deleteDialog')} />
                //     </Fab>
                //   )
                // )
                null}
              {this.state.selected.length !== 0 ? (
                this.props.share ? (
                  <Fab color="primary">
                    <Share onClick={this.openDialog('shareDialog')} />
                  </Fab>
                ) : null
              ) : null}
              {this.state.selected.length !== 0
                ? this.props.changeEmployee
                  ? this.props.changeEmployee.map(item => <span className="CustomIconListTask">{item}</span>)
                  : null
                : null}
              {/* {code ? (
             <Fab onClick={this.openDialog('shareDialog')}>
               <DeleteSweep />
             </Fab>
           ) : null} */}
              {!disableAdd ? (
                // this.props.code && !this.props.parentCode ? (
                (roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow ? (
                  addFunction ? (
                    <span className="CustomIconListTask" onClick={addFunction}>
                      <Tooltip title="Thêm mới ">
                        <Add />
                      </Tooltip>
                    </span>
                  ) : (
                    <Link to={`${path}/add`}>
                      <span className="CustomIconListTask">
                        <Tooltip title="Thêm mới">
                          <Add />
                        </Tooltip>
                      </span>
                    </Link>
                  )
                ) : null
              ) : //    : (
                //     <Fab>
                //       <Link to={`${path}/add`}>
                //         <Tooltip title="Thêm mới">
                //           <Add style={{ color: 'white' }} />
                //         </Tooltip>
                //       </Link>
                //     </Fab>
                //   )
                // )
                null}
              {(roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow
                ? this.props.code && !this.props.parentCode
                  ? settingBar
                    ? settingBar.map(item => <span className="CustomIconListTask">{item}</span>)
                    : null
                  : settingBar
                    ? settingBar.map(item => <span className="CustomIconListTask">{item}</span>)
                    : null
                : null}
              {this.props.forceShowSettingBar && settingBar ? settingBar.map(item => <span className="CustomIconListTask">{item}</span>) : null}
              {exportExcel ? (
                (roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow ? (
                  <span className="CustomIconListTask" onClick={e => this.setState({ exportAnchor: e.currentTarget })}>
                    <Tooltip title="Xuất dữ liệu">
                      <Archive />
                    </Tooltip>
                  </span>
                ) : null
              ) : null}
              {importExport ? (
                (roleModule.find(elm => elm.name === 'IMPORT') || { allow: false }).allow ? (
                  this.props.disableImport ? null : (
                    <Link to={importExport}>
                      <span className="CustomIconListTask">
                        <Tooltip title="Tải lên">
                          <ImportExport />
                        </Tooltip>
                      </span>
                    </Link>
                  )
                ) : null
              ) : null}
              {code && (roleModule.find(elm => elm.name === 'VIEWCONFIG') || { allow: false }).allow ? (
                this.props.disableViewConfig ? null : (
                  <span onClick={this.openDialog('dialogStatus')} className="CustomIconListTask">
                    <Tooltip title="Cấu hình bảng">
                      <Visibility />
                    </Tooltip>
                  </span>
                )
              ) : null}
            </GridItem>
          ) : null}
        </GridItem>
        <GridList
          height={height}
          disablePaging={this.props.disablePaging}
          newPaging={this.props.newPaging}
          columnExtensions={columnExtensions}
          rightColumns={rightColumns}
          count={count}
          loading={loading}
          pointerCursor={pointerCursor}
          onRowClick={onRowClick}
          changeSorting={this.changeSorting}
          changeColumnOrder={this.changeColumnOrder}
          selected={selected}
          rows={rows}
          tree={tree}
          loadData={this.loadData}
          code={code}
          columns={columns}
          filterEdit={filterEdit}
          columnOrder={columnOrder}
          getLimit={v => this.getLimit(v)}
          getPage={v => this.getPage(v)}
          sorting={sorting}
          disableSelect={disableSelect}
          customChildRows={this.props.customChildRows}
          changeSelect={this.changeSelect}
          onSaveConfig={this.saveConfig}
          filterField={filterField}
          extraColumns={extraColumns}
          selectMultiple={this.props.selectMultiple}
          excludeDatetype={excludeDatetype}
          reloadPage={this.state.reloadPage}
        />

        <ExportTable
          exportType={this.state.openExport}
          openExportStatus={this.state.openExportStatus}
          filters={this.state.queryFilter}
          filter={this.state.innerFilter}
          filter1={this.state.search}
          filter2={this.state.filterAdvance}
          // filters={this.props.filter}
          apiUrl={
            this.props.notChangeApi
              ? this.props.apiUrl
              : this.props.apiExport
                ? `${this.props.apiExport}/export`
                : this.props.noExportInExport
                  ? `${this.props.apiUrl}`
                  : `${this.props.apiUrl}/export`
          }
          onClose={this.handleCloseExportTable}
          open={Boolean(this.state.openExport)}
          listKanbanStatus={this.state.kanbanList}
          moduleCode={this.props.code}
          kanban={this.props.kanban}
          viewConfigUpdateTime={this.state.viewConfigUpdateTime}
          customDataExport={this.props.customDataExport}
        // pageSize={}
        // filter={this.props.filter ? this.props.filter : null}
        // customData={() => {
        //    const { filter } = this.props.filter ? this.props.filter : null;
        //    let { type } = filter;
        //    return { type };
        //  }}
        />
        {newPaging && (
          <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              colSpan={3}
              count={count}
              rowsPerPage={perPage}
              labelDisplayedRows={({ }) =>
                count === 0
                  ? `0 - 0 của 0`
                  : perPage * activePage + perPage < count
                    ? `${activePage * perPage + 1} - ${perPage * activePage + perPage} của ${count} `
                    : `${activePage * perPage + 1} - ${perPage * activePage + perPage - (perPage * activePage + perPage - count)} của ${count} `
              }
              page={activePage}
              onChangePage={this.handleChangePage}
              handlePage={this.handlePage}
              labelRowsPerPage={'Số dòng hiển thị:'}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            // ActionsComponent={TablePaginationActionsWrapped}
            />
          </GridItem>
        )}
        {/* <TableFixedColumns rightColumns={rightColumns} /> */}
        {/* <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={this.state.pageSizes} /> */}
        {
          dialogStatus && <DialogAsync
            {...this.props}
            saveSetting={this.saveSetting}
            saveSettingAll={this.saveSettingAll}
            code={code}
            columns={columns}
            fileColumns={fileColumns}
            open={dialogStatus}
            filterField={filterField}
            onClose={this.closeDialogStatus}
          />
        }

        <DialogUI
          maxWidth="sm"
          title="Bạn có chắc chắn muốn xóa không?"
          onSave={this.handleDeleteItem}
          onClose={this.closeDialog('deleteDialog')}
          open={deleteDialog}
          saveText="Đồng ý"
        />
        <Menu
          keepMounted
          open={Boolean(exportAnchor)}
          onClose={() => this.setState({ exportAnchor: null, openExportStatus: null })}
          anchorEl={exportAnchor}
        >
          <MenuItem onClick={() => this.setState({ openExport: 'Excel', openExportStatus: 'Excel', exportAnchor: null })}>Xuất Excel</MenuItem>
          <MenuItem onClick={() => this.setState({ openExport: 'PDF', openExportStatus: 'PDF', exportAnchor: null })}>Xuất PDF</MenuItem>
        </Menu>
        <DialogUI
          maxWidth="sm"
          title="Bạn có muốn hoàn thành?"
          onSave={this.addApproveTable}
          onClose={() => this.setState({ openDialogApprove: false })}
          open={openDialogApprove}
          saveText="Hoàn thành"
        />

        <DialogUI maxWidth="sm" onClose={this.closeDialog('shareDialog')} open={shareDialog} onSave={this.handleShare}>
          <div style={{ height: 180 }}>
            <Typography variant="h6" align="center">
              Chia sẻ khách hàng
            </Typography>
            <AsyncAutocomplete
              onChange={value => this.changeMutil(value)}
              value={this.state.employessCustomer}
              label="viewableEmployees"
              isMulti
              url={API_USERS}
            />
          </div>
        </DialogUI>
        <Snackbar open={open} variant={variant} message={message} onClose={this.closeDialog('open')} />
      </GridContainer>
    );
  }

  // Xử lý phân trang
  handleChangePage = (event, activePage) => {
    if (this.props.client) {
      const { perPage, searchClient } = this.state;
      this.client({ activePage, perPage, searchClient });
      return;
    }
    this.setState({ activePage, loading: true });
  };

  handleChangeRowsPerPage = event => {
    if (this.props.client) {
      const { searchClient } = this.state;
      this.client({ activePage: 0, perPage: event.target.value, searchClient });
      return;
    }
    this.setState({ activePage: 0, perPage: event.target.value });
  };

  handlePage = page => {
    if (this.props.client) {
      const { perPage, searchClient } = this.state;
      this.client({ activePage: page, perPage, searchClient });
      return;
    }
    this.setState({ activePage: page, selected: [] });
  };

  client = ({ activePage, perPage, searchClient }) => {
    const { totalRows } = this.state;
    const rowsCount = totalRows.filter(item =>
      Object.keys(item).some(
        key =>
          item[key]
            ? item[key]
              .toString()
              .toLowerCase()
              .indexOf(searchClient.toLowerCase()) !== -1
            : false,
      ),
    );
    const rows = rowsCount.slice(perPage * activePage, perPage * (activePage + 1));
    this.setState({ rows, searchClient, activePage, perPage, count: rowsCount.length, loading: false });
  };

  changeSelect = selected => {
    let newSelected = selected;
    if (!this.props.selectMultiple && selected.length === 2) {
      newSelected = [selected[1]];
    }
    this.setState({ selected: newSelected });
    if (this.props.onSelectCustomers) {
      const newSelectedRows = this.state.rows.filter((row, index) => selected && selected.includes(index));
      this.props.onSelectCustomers(newSelectedRows);
    }
    if (this.props.onSelectInsurance) {
      const newSelectedRows = this.state.rows.filter((row, index) => selected && selected.includes(index));
      this.props.onSelectInsurance(newSelectedRows);
    }
  };

  closeDialog = dialog => () => {
    this.setState({ [dialog]: false });
  };

  openDialog = dialog => () => {
    this.setState({ [dialog]: true });
  };

  changeSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const { activePage, perPage } = this.state;
    this.client({ activePage, perPage, searchClient: e.target.value });
  };
}

const GridList = React.memo(
  ({
    apiUrl,
    count,
    changeSorting,
    rows,
    columns,
    tree,
    disableSelect,
    changeColumnOrder,
    rightColumns,
    code,
    getLimit,
    getPage,
    selected,
    loading,
    columnExtensions,
    columnOrder,
    changeSelect,
    onSaveConfig,
    extraColumns,
    filterField,
    customChildRows,
    excludeDatetype,
    loadData,
    selectMultiple,
    disablePaging,
    newPaging,
    pointerCursor,
    onRowClick,
    filterEdit,
    height,
    reloadPage,
    dateFormatCollumns = [],
  }) => {
    const [newCls, setNewCls] = React.useState(columns);
    const [defaultColumnWidths, setDefaultColumnWidths] = React.useState([]);
    const dateFormat = localStorage.getItem('dateFomat') || 'DD/MM/YYYY';
    useEffect(
      () => {
        if (filterEdit == true) {
          let newColumns = columns.filter(i => i.checked);
          if (extraColumns) newColumns = newColumns.concat(extraColumns);
          setNewCls(newColumns);

          setDefaultColumnWidths(
            newColumns.map(item => {
              if (item.name === 'state') {
                item.width = 600;
              }
              if (item.name === 'updateBy' && item.title === 'NGƯỜI CẬP NHẬT') {
                item.width = 900;
              }
              if (item.name === 'createdAt' && item.title === 'NGÀY TẠO') {
                item.width = 650;
              }
              return {
                columnName: item.name,
                width: item.width || 120,
              };
            }),
          );
        } else {
          let newColumns = columns.filter(i => i.checked);
          if (extraColumns) newColumns = newColumns.concat(extraColumns);
          setNewCls(newColumns);
          setDefaultColumnWidths(
            newColumns.map(item => {
              return {
                columnName: item.name,
                width: item.width || 120,
              };
            }),
          );
        }
      },
      [columns],
    );

    const handleResizeWidth = _.debounce(newColumnsData => {
      if (typeof onSaveConfig === 'function') {
        const newColumns = columns.map(c => {
          const foundColumnData = newColumnsData && newColumnsData.find(cData => cData.columnName === c.name);
          if (foundColumnData) {
            c.width = foundColumnData.width;
          }
          return c;
        });
        onSaveConfig(newColumns);
      }
    }, SAVE_VIEWCONFIG_ON_RESIZE_DELAY);

    // const [newRows, setNewRows] = useState(rows);
    const [pageSize, setPageSize] = useState(10);
    const [pageSizes] = useState([10, 25, 50]);
    const [currentPage, setCurrentPage] = useState(0);
    const [firstLoad, setFirstLoad] = useState(true);
    const DateFormatter = ({ value }) => (moment(value).isValid() ? moment(value).format('DD/MM/YYYY') : '');

    const handleSetPageSize = value => {
      setPageSize(value);
      getLimit && getLimit(value);
    };
    useEffect(
      () => {
        handleGetCurrentPage(0);
      },
      [reloadPage],
    );
    const handleGetCurrentPage = value => {
      setCurrentPage(value);
      getPage && getPage(value);
    };
    useEffect(
      () => {
        if (loadData) {
          if (firstLoad) {
            setFirstLoad(false);
          } else {
            loadData(true);
          }
        }
      },
      [currentPage],
    );
    const DateData = () => {
      const listDateData = [];
      let excludeDatetypeA = {};
      excludeDatetypeA = excludeDatetype;
      newCls.map(item => {
        if (item.displayType === 'Date' && (!excludeDatetypeA || item.name !== excludeDatetypeA)) {
          listDateData.push(item);
        }
      });
      return listDateData;
    };
    const DateTypeProvider = props => {
      return <DataTypeProvider for={DateData().map(({ name }) => name)} formatterComponent={DateFormatter} {...props} />;
    };

    const DatetimeFormatter = ({ value }) => (moment(value).isValid() ? moment(value).format('DD/MM/YYYY') : '');

    const DatetimeData = () => {
      const listDateData = [];
      let excludeDatetypeA = {};
      excludeDatetypeA = excludeDatetype;
      newCls.map(item => {
        if (item.displayType === 'Datetime' && (!excludeDatetypeA || item.name !== excludeDatetypeA)) {
          listDateData.push(item);
        }
      });
      return listDateData;
    };
    const DatetimeTypeProvider = props => (
      <DataTypeProvider for={DatetimeData().map(({ name }) => name)} formatterComponent={DatetimeFormatter} {...props} />
    );
    const TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        onClick={() => onRowClick && onRowClick(row)}
        style={{
          cursor: pointerCursor,
          backgroundColor: row && row.seen === -1 ? 'lightgrey' : '',
        }}
      />
    );
    const NewDateTypeProvider = props => {
      const DateFormatter = ({ value }) => {
        try {
          if (moment(value).isValid()) {
            return moment(value).format('DD/MM/YYYY');
          }
          if (moment(value, 'YYYY-MM-DD').isValid()) {
            return moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
          }
          return value;
        } catch { }
        return value;
      };

      return <DataTypeProvider formatterComponent={DateFormatter} {...props} />;
    };

    return (
      <GridItem md={12} className="CustomlistTable">
        <Grid rows={rows} columns={newCls}>
          {tree ? <TreeDataState /> : null}
          {tree ? (
            <CustomTreeData getChildRows={(row, rootRows) => (!customChildRows ? getChildRows(row, rootRows) : customChildRows(row, rootRows))} />
          ) : null}
          <DragDropProvider />
          {disablePaging ? null : (
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={value => handleGetCurrentPage(value)}
              pageSize={pageSize}
              onPageSizeChange={value => handleSetPageSize(value)}
            />
          )}
          {disablePaging ? null : <CustomPaging totalCount={count} />}
          <SortingState defaultSorting={[{ columnName: 'order', direction: 'asc' }]} onSortingChange={changeSorting} />
          {disableSelect ? null : <SelectionState onSelectionChange={changeSelect} selection={selected} />}
          <IntegratedFiltering />
          <IntegratedSorting key="integrated-sorting" />
          {disableSelect ? null : <IntegratedSelection />}
          {/* check lại menu action khi dùng rowComponent={TableRow}*/}
          {/* <VirtualTable  rowComponent={TableRow} columnExtensions={columnExtensions} messages={{ noData: 'Không có dữ liệu' }} /> */}
          {/* <Table columnExtensions={columnExtensions} messages={{ noData: 'Không có dữ liệu' }} /> */}
          <VirtualTable height={height ? height : 'auto'} columnExtensions={columnExtensions} messages={{ noData: 'Không có dữ liệu' }} />

          <TableColumnResizing
            columnWidths={defaultColumnWidths}
            onColumnWidthsChange={value => {
              setDefaultColumnWidths(value);
              handleResizeWidth(value);
            }}
          />
          {tree ? null : disableSelect ? null : <TableSelection showSelectAll={selectMultiple} />}
          {code ? <TableColumnReordering order={columnOrder} onOrderChange={changeColumnOrder} /> : null}
          <TableHeaderRow cellComponent={DragColumn} showSortingControls />
          <DateTypeProvider />
          <DatetimeTypeProvider />
          {tree ? <TableTreeColumn for="name" showSelectionControls={!(tree && disableSelect)} showSelectAll={!(tree && disableSelect)} /> : null}

          <TableFixedColumns rightColumns={rightColumns} />
          {disablePaging ? null : newPaging ? null : <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={pageSizes} />}
        </Grid>
        {loading && <Loading />}
      </GridItem>
    );
  },
);

const MenuFilter = React.memo(({ anchorEl, closeFilter, columns, selectField, filters, code, optionSearch = [] }) => {
  if (code) {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const list = viewConfig && viewConfig.find(item => item.code === code);
    const data = list && list.listDisplay && list.listDisplay.type.fields.type.columns;
    const others = list && list.listDisplay && list.listDisplay.type.fields.type.others;
    let dataSearch = (data && data.filter(item => item.enabaleSearch === true && item.type === 'String')) || [];
    if (optionSearch) {
      dataSearch = [...dataSearch, ...optionSearch];
    }
    return (
      <Menu keepMounted open={Boolean(anchorEl)} onClose={closeFilter} anchorEl={anchorEl}>
        <MenuItem>
          <Typography variant="h6">Chọn trường tìm kiếm</Typography>
        </MenuItem>
        {dataSearch &&
          dataSearch.map(i => (
            <MenuItem key={i.name} value={i.name}>
              <Checkbox color="primary" checked={filters.includes(i.name)} onClick={selectField(i.name)} /> {i.title}
            </MenuItem>
          ))}
      </Menu>
    );
  }
  return null;
});

const MenuAction = React.memo(
  ({
    code,
    id,
    itemCurrent,
    handleClose,
    anchorEl,
    addChildTask,
    extraMenu,
    getData,
    miniActive,
    dashboardPage,
    exportExcel,
    roleModule,
    disableTodo,
    disableSeenMail,
    disableCreateTodo,
    disableRequest,
    disableSMS,
    disableExport,
    disableChangePassword,
    filterEdit,
    tabEx,
    ID,
  }) => {
    const [openDialog, setopenDialog] = useState(false);
    const [dialogAssign, setDialogAssign] = useState(false);
    const [openDialogTask, setopenDialogTask] = useState(false);
    const [mail, setMail] = useState({ to: [], subject: '', text: '' });
    const [dialogEmail, setDialogEmail] = useState(false);
    const [call, setCall] = useState({});
    const [callDialog, setCallDialog] = useState();
    const [SMS, setSMS] = useState({ subject: '', text: '' });
    const [dialogSMS, setDialogSMS] = useState(false);
    const [state, setState] = useState({
      templatess: [],
      template: '',
      typeFile: 'PDF',
      sales: [],
      files: [],
      loading: true,
      templatesItem: '',
      field: null,
      fields: [],
      approvedObj: {
        name: '',
        subCode: code,
        form: '',
        group: null,
        description: '',
      },
      dynamicForms: [],
      data: '',
      openChangePassword: false,
      id: id,
      password: null,
      rePassword: null,
    });
    const [errormessgage, setErrormessage] = useState({});
    const [permissionChangePass, setpermissionChangePass] = useState(false);
    const [itemSelected, settemSelected] = useState();

    const [snackbar, setSnackbar] = useState({
      open: false,
      variant: 'success',
      message: '',
    });

    function assignWork() {
      setDialogAssign(true);
      handleClose();
    }

    const [openApproved, setopenApproved] = useState(false);
    // Xuất biểu mẫu
    function handleDialogTemplate(open = true) {
      if (open === true) setopenDialog({ openDialog: open });
      const { allTemplates } = dashboardPage;
      if (code) {
        const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : null;
        setState(state => ({ ...state, templatess: templatesItem }));
      }
      handleClose();
    }

    function closeDialogTemplate() {
      setopenDialog(false);
    }

    function handleTemplate() {
      // console.log(6668888, id, code);
      tabEx === 'process'
        ? state.typeFile === 'PDF'
          ? printTemplte(state.template, id, code, false, null, tabEx)
          : printTemplteExcel(state.template, id, code)
        : tabEx === 'processType'
          ? state.typeFile === 'PDF'
            ? printTemplte(state.template, id, code, false, null, tabEx)
            : printTemplteExcel(state.template, id, code)
          : tabEx === 'review'
            ? state.typeFile === 'PDF'
              ? printTemplte(state.template, id, code, false, null, tabEx)
              : printTemplteExcel(state.template, id, code)
            : state.typeFile === 'PDF'
              ? printTemplte(state.template, id, code)
              : printTemplteExcel(state.template, id, code);
      // if (state.typeFile === 'PDF') {
      //   printTemplte(state.template, id, code);
      // } else {
      //   printTemplteExcel(state.template, id, code);
      // }
    }
    // Tạo công việc

    function handleTask() {
      setopenDialogTask(true);
      handleClose();
    }

    // Phê duyệt

    function handleApprove() {
      setopenApproved(true);
      const { allTemplates } = dashboardPage;
      Promise.all([fetchData(API_FIELD)]).then(result => {
        if (code) {
          const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : [];
          // const fields = result[0].filter(i => i.code === code);
          let fields = [];
          if (result[0] && result[0].data) {
            fields = (result[0] && result[0].data.filter(i => i.code === code)) || [];
          } else {
            fields = result[0].filter(i => i.code === code) || [];
          }
          setState(state => ({ ...state, templatess: templatesItem, fields: fields }));
        }
      });
      handleClose();
    }

    function handleAddApprovedGroup(value) {
      setState({ ...state, approvedObj: { ...state.approvedObj, group: value } });
    }

    function handleChangeApproved(e, name) {
      const { approvedObj } = state;
      e.target.value = clearWidthSpace(e.target.value).trimStart();
      approvedObj[name] = e.target.value;
      setState(state => ({ ...state, approvedObj }));
    }

    function addApprove() {
      const { approvedObj, templatess } = state;
      const exsist = templatess && templatess.find(i => String(i._id) === String(approvedObj.form));
      let content = '';
      let dynamicForm = '';
      if (exsist) {
        content = exsist.content;
        dynamicForm = exsist._id;
      }
      if (approvedObj.name === '') {
        setSnackbar({
          open: true,
          message: 'Bạn phải nhập tên phê duyệt',
          variant: 'error',
        });
      }
      if (approvedObj.group === null) {
        setSnackbar({
          open: true,
          message: 'Bạn phải nhập nhóm phê duyệt',
          variant: 'error',
        });
      }
      if (approvedObj.description === null) {
        setSnackbar({
          open: false,
          message: 'Bạn phải nhập ghi chú',
          variant: 'error',
        });
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
        description: approvedObj.description,
        collectionCode: code,
        content,
        dataInfo: itemCurrent.originItem,
        dynamicForm,
        convertMapping: '5d832729c252b2577006c5ab',
        approveGroup: approvedObj.group._id,
        groupInfo,
        clientId,
        field: state.field,
      };
      if (approvedObj.name !== '') {
        onCreateApprove(body);
      }
      setState(state => ({ ...state, openApproved: false, approvedObj: { name: '', subCode: '', form: '', group: null, description: '' } }));
    }

    function onCreateApprove(body) {
      fetch(API_APPROVE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then(() => {
          setSnackbar({ open: true, message: 'Thêm phê duyệt thành công', variant: 'success' });
          setopenApproved(false);
          getData();
        })
        .catch(() => {
          setSnackbar({ open: false, message: 'Thêm phê duyệt thất bại', variant: 'error' });
        });
    }
    function closeDialogTask() {
      setopenDialogTask(false);
    }

    async function handleEmailDialog() {
      if (code === 'SalesQuotation') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent['customer.customerId']}`);
        setMail({ ...mail, to: [customer] });
      }
      if (code === 'Customer') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
        setMail({ ...mail, to: [customer] });
      }

      handleDialogTemplate(false);
      setDialogEmail(!dialogEmail);
      handleClose();
    }

    function handleCall() {
      // console.log('itemCurrent',itemCurrent.phoneNumber)
      setCall(itemCurrent);
      setCallDialog(true);
    }

    async function handleSMSDialog() {
      // if (code === 'Customer') {
      //   const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
      //   setSMS({ ...SMS, to: customer.phoneNumber });
      // }

      if (code === 'BusinessOpportunities') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent['customer.customerId']}`);
        setSMS({ ...SMS, to: customer.phoneNumber });
      }
      // if (code === 'BusinessOpportunities' && itemCurrent.originItem && itemCurrent.originItem.customerId) {
      //   const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent.originItem.customerId._id}`);
      //   setSMS({ ...SMS, to: customer.phoneNumber });
      // }
      handleDialogTemplate(false);
      setDialogSMS(!dialogSMS);
      handleClose();
    }

    function closeAssignTask() {
      setDialogAssign(false);
    }

    function callbackAssign(snack, close = true) {
      setSnackbar(snack);
      if (close) setDialogAssign(false);
    }

    async function sendMail(props) {
      if (!(mail.text || props.content) || !mail.subject || !state.template || !mail.to || !mail.to.length) {
        return;
      }
      try {
        const data = { ...mail };

        const content = props;
        if (content) {
          data.content = content;
        }

        data.to = _.uniq(mail.to.map(i => i.email).filter(i => Boolean(i))).join();
        if (!data.to) {
          alert('Danh sách Khách hàng chọn không có email');
          return;
        }

        const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const formatData = {
          title: data.subject,
          template: state.template,
          viewConfig, // .find(item => item.code === code),
          html: data.content,
          listCustomer: mail.to,
          code,
        };

        await fetchData(API_MAIL, 'POST', formatData);
        setDialogEmail(false);
        alert('Gửi mail thành công');
      } catch (error) {
        console.log(error);
      }
    }

    async function sendSMS(obj) {
      // if (!SMS.text || !state.template || !SMS.to || !SMS.to.length) {

      //   return;
      // }
      if (!state.template || !SMS.to || !SMS.to.length) {
        alert('Chưa điền đầy đủ dữ liệu.');
        return;
      }
      try {
        const data = { ...SMS };

        // data.to = _.uniq(SMS.to.map(i => i.phoneNumber).filter(i => Boolean(i))).join();
        if (!data.to) {
          alert('Danh sách Khách hàng chọn không có SMS');
          return;
        }
        // const formData = new FormData();

        // for (let index = 0; index < state.files.length; index++) {
        //   formData.append('files', state.files[index]);
        // }

        // formData.append('file', state.files);
        // const x = await fetch(`${API_SMS}/upload`, {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        //   body: formData,
        // });

        // const filesSend = await x.json();
        // data.html = await getDataBeforeSend({ templateId: state.template, dataId: id, moduleCode: code });

        // data.filesSend = filesSend;

        const formatData = {
          // template: state.template,
          html: obj.content,
          listCustomer: SMS.to,
          // code,
        };
        await fetchData(API_SMS1, 'POST', formatData);
        setDialogSMS(false);
        alert('Gửi SMS thành công');
      } catch (error) {
        alert('Gửi không thành công');
      }
    }

    function onSelectFile(e) {
      let listFile = [];
      const array = e.target.files;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        listFile.push(element);
      }
      listFile = _.uniqBy(state.files.concat(listFile), 'name');
      setState({ ...state, files: listFile });
    }

    function deleteFile(v) {
      const listFile = state.files.filter((i, b) => b !== v);
      setState({ ...state, files: listFile });
    }

    function changePassword(id) {
      let ress = null;
      if (Object.keys(errormessgage).length > 0) setSnackbar({ open: true, message: 'Vui lòng nhập đủ thông tin', variant: 'error' });
      else
        fetch(API_ROLEAPP_CHANGE_PASSWORD_PERSON, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: id,
            password: state.password,
          }),
        })
          .then(response => {
            ress = response;
            if (response.status === 401) {
              setState({ ...state, openChangePassword: false });
              setSnackbar({ open: true, message: 'Token hết hạn vui lòng đăng nhập lại', variant: 'error' });
              return response.json();
            } else if (response.status === 200) {
              setState({ ...state, openChangePassword: false, password: null, rePassword: null });
              setSnackbar({ open: true, message: 'Thay đổi mật khẩu thành công', variant: 'success' });
              return response.json();
            } else if (response.status === 400) {
              return response.json();
            } else {
              setSnackbar({ open: true, message: 'Thay đổi mật khẩu thất bại', variant: 'error' });
              return response.json();
            }
          })
          .then(data => {
            if (ress.status === 400) {
              setSnackbar({ open: true, message: data.message, variant: 'error' });
            }
          })
          .catch(() => {
            setSnackbar({ open: true, message: 'Thay đổi mật khẩu thất bại', variant: 'error' });
          });
    }
    const changePasswordUser = e => {
      setState({ ...state, [e.target.name]: e.target.value });
    };
    useEffect(
      () => {
        let mess = errormessgage;

        if (state.password === null) mess = { ...mess, password: 'Mật khẩu không được để trống', errorpass: true };
        else if (state.password.length < 8) mess = { ...mess, password: 'Mật khẩu tối thiểu 8 ký tự!', errorpass: true };
        else if (state.password.length > 100) mess = { ...mess, password: 'Mật khẩu tối đa 100 ký tự!', errorpass: true };
        else {
          delete mess.password;
          delete mess.errorpass;
        }
        if (state.rePassword === null) mess = { ...mess, rePassword: 'Mật khẩu không được để trống', errorrepass: true };
        else if (state.rePassword.length < 8) mess = { ...mess, rePassword: 'Mật khẩu tối thiểu 8 ký tự!', errorrepass: true };
        else if (state.rePassword.length > 100) mess = { ...mess, rePassword: 'Mật khẩu tối đa 100 ký tự!', errorrepass: true };
        else {
          delete mess.rePassword, delete mess.errorrepass;
        }
        if (
          state.password !== null &&
          state.rePassword !== null &&
          state.password !== state.rePassword &&
          state.rePassword.length >= 8 &&
          state.password.length >= 8 &&
          state.rePassword.length <= 100 &&
          state.password.length <= 100
        )
          mess = { ...mess, rePassword: 'Mật khẩu không khớp với mật khẩu mới vui lòng nhập lại!', errorrepass: true };
        else if (
          state.password !== null &&
          state.rePassword !== null &&
          state.password === state.rePassword &&
          state.rePassword.length >= 8 &&
          state.password.length >= 8 &&
          state.rePassword.length <= 100 &&
          state.password.length <= 100
        ) {
          delete mess.rePassword, delete mess.errorrepass;
        }
        setErrormessage({ ...mess });
      },
      [state.password, state.rePassword],
    );
    const getPermissionChangePass = async id => {
      const data = await fetchData(`${API_ROLE_APP}/Employee/${id}`);
      if (data && data.roles[1] && data.roles[1].data) {
        data.roles[1].data.map(el => {
          if (el.name === 'password') setpermissionChangePass(el.data && el.data.changePassWord);
        });
      }
    };
    useEffect(() => {
      getPermissionChangePass(ID);
    }, []);
    return (
      <div>
        <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl}>
          {disableTodo || (disableTodo === undefined && <MenuItem onClick={assignWork}>Giao việc</MenuItem>)}
          {disableCreateTodo || (disableCreateTodo === undefined && <MenuItem onClick={handleTask}>Tạo công việc</MenuItem>)}
          {disableSeenMail || (disableSeenMail === undefined && <MenuItem onClick={handleEmailDialog}>Gửi mail</MenuItem>)}

          {_.get(itemCurrent, 'phoneNumber', '').trim() ? <MenuItem onClick={handleCall}>Gọi điện</MenuItem> : null}
          {disableSMS || (disableSMS === undefined && <MenuItem onClick={handleSMSDialog}>SMS</MenuItem>)}
          {disableRequest || (disableRequest === undefined && <MenuItem onClick={handleApprove}>Yêu cầu phê duyệt</MenuItem>)}
          {disableExport || (disableExport === undefined && <MenuItem onClick={() => handleDialogTemplate(true)}>Xuất biểu mẫu</MenuItem>)}
          {!disableChangePassword ||
            (!disableChangePassword !== undefined &&
              (permissionChangePass === true && (
                <MenuItem
                  onClick={() => {
                    setState({ ...state, openChangePassword: true, id: id });
                    handleClose();
                  }}
                >
                  Đặt lại mật khẩu
                </MenuItem>
              )))}
          {extraMenu && extraMenu(id)}
        </Menu>

        <Dialog
          open={state.openChangePassword}
          onClose={() => setState({ ...state, openChangePassword: false, pass: null, rePassword: null })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Đặt lại mật khẩu</DialogTitle>
          <DialogContent>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              variant="outlined"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới..."
              style={{ marginTop: 10 }}
              value={state.password}
              name="password"
              type="password"
              onChange={e => changePasswordUser(e)}
              required={true}
              error={errormessgage.errorpass}
              helperText={errormessgage.password}
            />
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              variant="outlined"
              label="Nhập lại mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới..."
              style={{ marginTop: 10 }}
              value={state.rePassword}
              name="rePassword"
              type="password"
              onChange={e => changePasswordUser(e)}
              required={true}
              error={errormessgage.errorrepass}
              helperText={errormessgage.rePassword}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={() => changePassword(id)}>
              LƯU
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              autoFocus
              onClick={() => setState({ ...state, openChangePassword: false, id: null, password: null, rePassword: null })}
            >
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
        <EmailDialog
          dialogEmail={dialogEmail}
          setDialogEmail={setDialogEmail}
          sendMail={sendMail}
          mail={mail}
          setMail={setMail}
          state={state}
          setState={setState}
          deleteFile={deleteFile}
        />

        <CallDialog
          open={callDialog}
          call={call}
          onClose={() => {
            setCallDialog(false);
          }}
        />

        <input style={{ display: 'none' }} id="contained-button-file" multiple onChange={onSelectFile} type="file" />
        <SMSDialog dialogSMS={dialogSMS} setDialogSMS={setDialogSMS} sendSMS={sendSMS} SMS={SMS} state={state} setState={setState} setSMS={setSMS} />

        <DialogUI dialogAction={false} onClose={closeAssignTask} open={dialogAssign}>
          <AssignTask id={id} callbackAssign={callbackAssign} code={code} itemCurrent={itemCurrent} />
        </DialogUI>
        {/* Dialog form */}
        <DialogUI onSave={handleTemplate} open={openDialog} onClose={closeDialogTemplate} saveText="In biểu mẫu">
          <TextField
            value={state.template}
            fullWidth
            select
            onChange={e => {
              setState({ ...state, template: e.target.value });
            }}
            label="Biểu mẫu"
          >
            {state.templatess.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
          {state.template ? (
            <>
              <TextField
                value={state.typeFile}
                fullWidth
                select
                onChange={e => setState({ ...state, typeFile: e.target.value })}
                label="Định dạng file"
              >
                <MenuItem value="PDF">PDF</MenuItem>
                <MenuItem value="XLSX">EXCEL</MenuItem>
              </TextField>
            </>
          ) : null}
          {/* <CloudDownload /> */}
        </DialogUI>
        <SwipeableDrawer
          anchor="right"
          onClose={closeDialogTask}
          open={openDialogTask}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <AddProjects
            id="add"
            data={{
              source: code,
              sourceData: {
                model: code,
                objectId: itemCurrent.originItem._id,
                objectName: itemCurrent.originItem.name,
              },
              taskType: 1,
              customer: itemCurrent.originItem ? itemCurrent.originItem.customer : null,
              join: itemCurrent.originItem.join ? itemCurrent.originItem.join : [],
              inCharge: itemCurrent.originItem.inCharge ? itemCurrent.originItem.inCharge : [],
              approved: itemCurrent.originItem.approved ? itemCurrent.originItem.approved : [],
              support: itemCurrent.originItem.support ? itemCurrent.originItem.support : [],
              viewable: itemCurrent.originItem.viewable ? itemCurrent.originItem.viewable : [],
              isProject: false,
              parentId: addChildTask ? id : null,
              minDate: addChildTask ? itemCurrent.originItem.startDate : null,
              maxDate: addChildTask ? itemCurrent.originItem.endDate : null,
              startDate: addChildTask ? itemCurrent.originItem.startDate : null,
            }}
            callback={() => {
              closeDialogTask(false);
              getData();
            }}
          />
        </SwipeableDrawer>
        <DialogUI
          title="Tạo phê duyệt"
          onSave={addApprove}
          maxWidth="md"
          fullWidth
          open={openApproved}
          onClose={() => {
            setopenApproved(false);
          }}
          aria-labelledby="form-dialog-title1"
        >
          <TextField
            label="Tên phê duyệt"
            error={state.approvedObj.name ? '' : 'Không được để trống tên phê duyệt'}
            helperText={state.approvedObj.name ? '' : 'Không được để trống tên phê duyệt'}
            name="name"
            onChange={e => handleChangeApproved(e, 'name')}
            value={state.approvedObj.name}
          />

          <AsyncAutocomplete
            placeholder="Tìm kiếm nhóm phê duyệt ..."
            url={API_APPROVE_GROUPS}
            filter={{ clientId: clientId, approveType: 1 }}
            value={state.approvedObj.group}
            onChange={handleAddApprovedGroup}
            label=" Nhóm phê duyệt"
            error={state.approvedObj.group ? '' : 'Không được để trống nhóm phê duyệt'}
            helperText={state.approvedObj.group ? '' : 'Không được để trống nhóm phê duyệt'}
          />

          <TextField label="Tên quy trình" name="name" onChange={e => handleChangeApproved(e, 'subCode')} value={state.approvedObj.subCode} />
          <TextField
            label="Field name"
            InputLabelProps={{ shrink: true }}
            select
            onChange={e => setState({ ...state, field: e.target.value })}
            value={state.field}
          >
            {state.fields.map(i => (
              <MenuItem value={i._id}>{i.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Chọn biểu mẫu phê duyệt"
            name="name"
            onChange={e => handleChangeApproved(e, 'form')}
            value={state.approvedObj.form}
            style={{ width: '100%' }}
            select
          >
            {state.templatess.map(form => (
              <MenuItem key={form._id} value={form._id}>
                {form.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ghi chú"
            name="description"
            onChange={e => handleChangeApproved(e, 'description')}
            value={state.approvedObj.description}
          // error={this.props.addSalesQuotation.rate === ''}
          // helperText={this.props.addSalesQuotation.rate === '' ? 'tỷ giá ngoại lệ không được bỏ trống' : null}
          />
        </DialogUI>
        <Snackbar
          open={snackbar.open}
          variant={snackbar.variant}
          message={snackbar.message}
          onClose={() =>
            setSnackbar({
              open: false,
              message: '',
              variant: '',
            })
          }
        />
        {/* <div style={{ width: '100vw' }} id="divToPrint" /> */}
      </div>
    );
  },
);

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ListPage);

ListPage.defaultProps = {
  deleteOption: 'ids',

  filter: { status: 1 },
  treeName: 'name',
  columnExtensions: [{ columnName: 'edit', width: 150 }],
  rightColumns: ['edit'],
  reload: false,
  perPage: 10,
  status: 'crmStatus',
  disableEdit: false,
  extraMenu: null,
  selectMultiple: true,
  kanbanKey: 'type',
};
