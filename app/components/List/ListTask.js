import React, { useState, useEffect } from 'react';
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
} from '@material-ui/core';
import XLSX from 'xlsx';
import { Visibility, Delete, ImportExport, Add, Edit, FilterList, Dehaze, Archive, CloudUpload, CloudDownload } from '@material-ui/icons';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import {
  SortingState,
  IntegratedSorting,
  IntegratedFiltering,
  IntegratedSelection,
  SelectionState,
  TreeDataState,
  CustomTreeData,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
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
  API_CUSTOMERS,
  API_MAIL,
  API_FIELD,
  API_TASK_PROJECT,
  UPLOAD_APP_URL,
  API_UPDATE_ALL_SYSTEM,
  API_SMS1,
} from 'config/urlConfig';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import CustomInputField from '../Input/CustomInputField';
import { Link } from 'react-router-dom';
import Dialog from 'components/Modal/DialogAsync';
import AddProjects from 'containers/AddProjects';
import { TextField, Dialog as DialogUI, SwipeableDrawer, AsyncAutocomplete, Loading, AssignTask, MakeCreateTaskRequest } from 'components/LifetekUi';
import Snackbar from 'components/Snackbar';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { tableToExcel, tableToPDF } from '../../helper';
import messages from './messages';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
import SourceView from '../../containers/SourceView';
// import dot from 'dot-object';
import { convertDot, serialize, convertOb, printTemplte, fetchData, getDataBeforeSend } from '../../helper';

// import { STATE } from '../../config/const';
import { clientId } from '../../variable';
import { SAVE_VIEWCONFIG_ON_RESIZE_DELAY } from '../../utils/constants';
import { parseTask } from '../../utils/common';
import EmailDialog from './EmailDialog';
import SMSDialog from './SMSDialog';

import { FileUpload } from '../LifetekUi';
import CallDialog from './CallDialog';

const Process = ({ title, value, color }) => (
  <Tooltip title={title}>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 10, width: '100%', borderRadius: 2 }}>
      <div style={{ width: `${value}%`, background: `${color}`, height: '100%' }} />
      <div style={{ width: `${100 - value}%`, height: '100%', background: '#9e9e9e75' }} />
    </div>
  </Tooltip>
);

import './CustomCSS.css';

// function downloadFile(url, fileName) {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', url, true);
//   xhr.responseType = 'blob';
//   xhr.onload = function() {
//     const urlCreator = window.URL || window.webkitURL;
//     const imageUrl = urlCreator.createObjectURL(this.response);
//     const tag = document.createElement('a');
//     tag.href = imageUrl;
//     tag.download = fileName;
//     document.body.appendChild(tag);
//     tag.click();
//     document.body.removeChild(tag);
//   };
//   xhr.send();
// }

function getChildRows(row, rootRows) {
  const childRows = rootRows.filter(r => r.parentId === (row ? row._id : null));
  return childRows.length ? childRows : null;
}

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right', boxShadow: 'none' },
};
function DragColumn({ draggingEnabled, sortingEnabled, ...rest }) {
  if (rest.column.name === 'edit') return <TableHeaderRow.Cell {...rest} sortingEnabled={false} draggingEnabled={false} />;
  return <TableHeaderRow.Cell sortingEnabled draggingEnabled={draggingEnabled} {...rest} />;
}

const ExportTable = React.memo(
  ({ filters, filter, open, onClose, listKanbanStatus, apiUrl, moduleCode, customData, kanban, viewConfigUpdateTime }) => {
    const url = apiUrl;
    // const type = typeOf.type
    // console.log(type,type.type, 'nnnnn')
    //  const [customDatas, setCustomDatas] = useState({})
    //  const [departments, setDepartments] = useState();
    // console.log(moduleCode);
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
          const list = viewConfig.find(item => item.code === 'Task');
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

    const getDataFirstTime = async () => {
      try {
        const filterLinK = filters.slice(9, filters.length);

        const query = serialize({ filters });
        let arr = [];
        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');

        const apiUrl = `${url}?selector=${selectors}&${filterLinK}`;

        const res = await fetchData(apiUrl);
        const numberRecordLimitBackEnd = res.limit;
        if (!res.data) throw res;
        console.log(numberRecordLimitBackEnd, res.count, 4444);
        if (res.count > numberRecordLimitBackEnd) {
          const numberTotalPageLimitBackEnd = Math.ceil(res.count / numberRecordLimitBackEnd);
          for (let i = 0; i < numberTotalPageLimitBackEnd; i++) {
            await getDataPagination(numberRecordLimitBackEnd * i, numberRecordLimitBackEnd, numberTotalPageLimitBackEnd, i + 1);
          }
        } else {
          setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage: 1, pageNumber: 1, numberOrderFirstPage: 1 });
          onClose({ lastPage: true });
        }
      } catch (err) {
        console.log(err, 'hhh');
        onClose({ res: err, error: true, lastPage: true });
      }
    };

    const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
      const lastPage = totalPage === pageNumber;
      try {
        // let newFilter = { filter: { ...filters }, skip: skip, limit: limit };
        let arr = [];
        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');
        // const query = serialize(newFilter);
        const apiUrl = `${url}?${selectors}&${filters}`;
        const res = await fetchData(apiUrl);
        if (!res.data) throw res;
        setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage: totalPage, pageNumber: pageNumber, numberOrderFirstPage: skip + 1 });
        onClose({ totalPage, pageNumber, lastPage });
      } catch (err) {
        console.log(err, 'loinay');
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
          <table>
            <tbody>
              <tr>
                <td />
                <td>Ngày xuất báo cáo:</td>
                <td>{moment().format('DD/MM/YYYY')}</td>
              </tr>

              <tr />
            </tbody>
          </table>
          {/* check22 */}
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>STT</th>
                {viewConfigData.map(cols => (
                  <th style={{ width: cols.width }}>{cols.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                return (
                  <tr>
                    <td style={{ width: 80 }}>{index + 1}</td>
                    {viewConfigData.map(cols => (
                      <td
                        style={{
                          width: cols.width,
                          textAlign: cols.type === 'Date' || cols.type === 'Number' ? 'center' : null,
                          paddingTop: cols.type === 'Number' ? '10px' : null,
                          paddingRight: cols.type === 'Number' ? 0 : null,
                        }}
                      >
                        {typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? row[cols.name] : ''}
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
      columns: [],
      columnOrder: [],
      rows: [],
      // files: [],
      selected: [],
      dialogStatus: false,
      activePage: 0,
      openExport: null,
      exportAnchor: null,
      perPage: this.props.perPage,
      search: '',
      searchClient: '',
      deleteDialog: false,
      loading: true,
      open: false,
      queryFilter: null,
      totalRows: [],
      anchorEl: null,
      variant: 'success',
      message: '',
      sorting: [{ columnName: 'createdAt', direction: 'desc' }],
      filters: ['name'],
      count: 0,
      anchorElAction: false,
      importExport: this.props.importExport
        ? `/import?type=${this.props.importExport}`
        : this.props.code && !this.props.parentCode && this.props.mettingScheduleId
          ? `/import?type=${this.props.code}&&mettingScheduleId=${this.props.mettingScheduleId}`
          : this.props.code && !this.props.parentCode && this.props.workingScheduleId 
          ? `/import?type=${this.props.code}&&workingScheduleId=${this.props.workingScheduleId}`
          : this.props.code && !this.props.parentCode
            ? `/import?type=${this.props.code}`
            : null,
      id: null,
      itemCurrent: { originItem: '' },
      openDialogApprove: false,
      kanbanList: [],
      plannerList: {},
      columnExtensions: this.props.columnExtensions,
      rightColumns: this.props.rightColumns,
      departments: [],
      hasPermissionViewConfig: false,
      filterAdvance: {},
      innerFilter: {},
      valueFilter: 0,
      startDate: '',
      html: [],
      htmlTotal: 0,
      endDate: '',
      limit: 15,
    };
  }
  componentDidMount() {
    if (this.props.typeTab) {
      localStorage.setItem('typeTab', JSON.stringify(this.props.typeTab));
    }
    else {
      localStorage.removeItem('typeTab')
    }
    let kanbanList = [];
    let plannerList = [];

    try {
      kanbanList = this.props.kanban ? JSON.parse(localStorage.getItem([this.props.status])).find(item => item.code === this.props.kanban).data : [];
      plannerList =
        (JSON.parse(localStorage.getItem('taskStatus')) &&
          JSON.parse(localStorage.getItem('taskStatus')).find(item => item.code === 'PLANER').data) ||
        [];
    } catch (error) {}
    if (this.props.code) {
      try {
        const { dashboardPage } = this.props;
        let currentRole;
        if (dashboardPage.role.roles) {
          currentRole = dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
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
      const columns = view.listDisplay.type.fields.type.columns;
      const fileColumns = view.listDisplay.type.fields.type.fileColumns;
      const others = view.listDisplay.type.fields.type.others.map(item => ({ ...item, tp: 1 }));
      const newCls = [...columns, ...others, { name: 'edit', checked: !this.props.disableEdit, title: 'HÀNH ĐỘNG' }];
      const columnOrder = newCls
        .sort((a, b) => a.order - b.order)
        .map(item => item.name)
        .concat(['edit']);
      this.setState({ columns: newCls, columnOrder, fileColumns, loading: true, kanbanList, plannerList: _.keyBy(plannerList, 'type') }, () => {
        this.loadData();
      });
    } else {
      this.setState(
        {
          columns: this.props.columns.concat({ name: 'edit', checked: !this.props.disableEdit, title: 'HÀNH ĐỘNG' }),
          loading: true,
          kanbanList,
          plannerList: _.keyBy(plannerList, 'type'),
        },
        () => {
          this.loadData();
        },
      );
    }
  }

  componentDidUpdate(preProps, preState) {
    const reload = this.props.reload && this.props.reload !== preProps.reload;
    if (typeof this.lastQuery !== 'undefined') {
      this.loadData(reload);
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
  }

  debounceLoadData = _.debounce(reload => {
    this.loadData(reload);
  }, 300);

  loadData = (reload = false) => {
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
  handleCloseExportTable = payload => {
    const { openExport } = this.state;
    if (payload && payload.lastPage) this.setState({ openExport: null });
    console.log(payload, this.state, 'oooo');
    // if (payload && payload.error) {
    // if (payload.res && payload.res.message) {
    //   const { message } = payload.res;
    //   // console.log(message,'ppp')
    //   //  this.props.onChangeSnackbar({ status: true, message, variant: 'error' });
    // }
    // console.log(message,'ppp000')
    // else this.props.onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
    //   return;
    // }

    switch (openExport) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF(`${this.props.code}${this.props.kanban}`, this.props.code);
        console.log(`${this.props.code}${this.props.kanban}`, 'kkk');
        this.setState({ html: [...this.state.html, { content, pageNumber }], htmlTotal: totalPage });
        break;
      default:
        tableToExcel(`${this.props.code}${this.props.kanban}`, 'W3C Example Table', this.props.code);
    }
  };

  getData = dt => {
    // eslint-disable-next-line no-unused-vars
    const { mapFunction, customFunction, apiUrl, disableDot, disableEdit, client, filter, isReport = false } = this.props;
    const { kanbanList, plannerList } = this.state;

    if (!apiUrl) {
      this.setState(dt);
      return;
    }
    const query = this.queryString();
    const queryClient = serialize({ filter });
    const URL = client ? `${apiUrl}?${queryClient}` : `${apiUrl}?${query}`;
    fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        let newList;
        if (data.data) newList = data.data;
        else newList = data;
        if (!disableDot) newList = newList.map(item => convertDot({ ob: item, newOb: { originItem: item }, convertArr: true }));
        let kanbanStatus = [];
        let max = 1;

        if (this.props.kanban) {
          kanbanStatus = convertOb(kanbanList, 'type');

          kanbanList.forEach(element => {
            if (element.code > max) max = element.code;
          });
        }
        newList = newList.map(it => {
          let result;
          let kbStatus = 'gg';
          if (this.props.kanban) {
            kanbanStatus = convertOb(kanbanList, 'type');
            let max = 1;

            kanbanList.forEach(element => {
              if (element.code > max) max = element.code;
            });

            let value = 0;
            let color = 'red';
            let title = 'Không xác định';

            if (kanbanStatus[it.kanbanStatus * 1]) {
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
            planerStatus: plannerList[it.planerStatus] ? plannerList[it.planerStatus].name : '',
          };
        });

        if (!isReport) {
          if (mapFunction) newList = newList.map(mapFunction);
          if (customFunction) newList = customFunction(newList);
        }
        const count = client ? newList.length : data.count;
        if (client) {
          const { perPage, activePage, searchClient } = this.state;
          this.setState({ count, totalRows: newList, loading: false, ...dt }, () => this.client({ perPage, activePage, searchClient }));
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
        console.log(err);
        this.setState({ loading: false });
      });
  };

  handleApproveTable = id => {
    this.setState({ openDialogApprove: true, id });
  };
  onFilterSearch = () => {
    const currentInnerFilter = this.state.innerFilter;
    const currFilterAdvance = this.state.filterAdvance;
    const { columns } = this.state;
    const newInnerFilter = { ...currentInnerFilter };
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
            if (col.name === 'position') {
              newInnerFilter[`${key}.value`] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].value;
            } else if (col.name === 'vacancy.roleName') {
              newInnerFilter[`${key}`] = currFilterAdvance[key].name ? currFilterAdvance[key].name : currFilterAdvance[key].code;
            } else {
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
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .toString(),
            $lte: moment(currFilterAdvance[key]._d)
              .endOf('day')
              .toString(),
          };
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
    this.setState({ innerFilter: newInnerFilter, dialogAllFilter: false }, () => {});
  };
  queryString = () => {
    const { sorting, perPage, activePage, search, filters, setPage, innerFilter } = this.state;
    // if (filters.includes("inCharge")) { this.setState({ ...filters, filters: ["inChargeStr"] }) }
    const filter = { ...this.props.filter, ...innerFilter };
    const rex = `${search}`;
    if (search) {
      filter.$or = filters.map(i => ({ [i !== 'inCharge' ? i : 'inChargeStr']: { $regex: rex, $options: 'gi' } }));
    }
    const skip = perPage * activePage;
    const columnSorting = sorting[0].direction === 'asc' ? sorting[0].columnName : `-${sorting[0].columnName}`;
    let query;
    if (this.props.isReport) {
      query = { limit: perPage, skip, sort: columnSorting, ...filter };
    } else {
      query = { limit: perPage, skip, sort: columnSorting };
      if (filter) query.filter = filter;
    }

    // if (this.props.setPage) this.props.setPage()
    const queryString = serialize(query);
    this.setState({ queryFilter: queryString });
    return queryString;
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
      .then(res => res.json())
      .then(respon => {
        // eslint-disable-next-line eqeqeq
        if (respon.success) this.getData({ open: true, variant: 'success', message: 'Xóa thành công' });
        else {
          this.setState({ loading: false, open: true, variant: 'error', message: respon.err || respon.message || 'Xóa không thành công' });
        }
      })

      .catch(e => this.setState({ loading: false, open: true, variant: 'error', message: e.message || 'Không có phản hồi, kiểm tra lại kết nối' }));
  };

  changeColumnOrder = newOrder => {
    const columns = this.state.columns;
    const newColumns = columns.map(item => ({ ...item, order: newOrder.indexOf(item.name) }));
    this.setState({ columnOrder: newOrder });
    this.saveConfig(newColumns);
  };

  saveConfig = (columns, fileColumns) => {
    const code = this.props.code;
    // debugger;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    let data = viewConfig.find(item => item.code === code);
    const index = viewConfig.findIndex(item => item.code === code);
    const newColumns = columns.filter(item => item.tp !== 1 && item.name !== 'edit');

    const newOthers = columns.filter(item => item.tp === 1);
    data.listDisplay.type.fields.type.columns = newColumns;
    data.listDisplay.type.fields.type.others = newOthers;
    data.listDisplay.type.fields.type.fileColumns = fileColumns;
    let URL = '';
    if (data._id) {
      URL = data ? `${API_VIEW_CONFIG}/${data._id}` : null;
      this.setState({ IDD: data._id });
    } else {
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
          viewConfig[index].listDisplay.type.fields.type.fileColumns = fileColumns;
          localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
          this.setState({ viewConfigUpdateTime: new Date() * 1 });
        })
        .catch(() => this.setState({ open: true, variant: 'error', message: 'Cập nhật thất bại' }));
  };

  handleDeleteItem = () => {
    this.setState({ deleteDialog: false, selected: [] });
    if (this.state.selected.length !== 0) {
      this.deleteItem();
    }
  };

  saveSetting = (columns, status, third, forth, fileColumns) => {
    if (status) {
      this.setState({ dialogStatus: false, columns });
      this.saveConfig(columns, fileColumns);
    } else {
      const columnOrder = [...columns].sort((a, b) => a.order - b.order);
      this.setState({ columns, dialogStatus: false, columnOrder });
    }
  };

  saveConfigAll = (columns, fileColumns) => {
    const code = this.props.code;
    // debugger;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    let data = viewConfig.find(item => item.code === code);
    const index = viewConfig.findIndex(item => item.code === code);
    const newColumns = columns.filter(item => item.tp !== 1 && item.name !== 'edit');

    const newOthers = columns.filter(item => item.tp === 1);
    data.listDisplay.type.fields.type.columns = newColumns;
    data.listDisplay.type.fields.type.others = newOthers;
    data.listDisplay.type.fields.type.fileColumns = fileColumns;
    if (data._id) {
      this.setState({ IDD: data._id });
      delete data._id;
    }
    const URL = `${API_UPDATE_ALL_SYSTEM}`;
    const dat = fetch(URL, {
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
    const search = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ search });
    }, 500);
  };

  getUrl() {
    const res = window.location.pathname.split('/');
    const path = this.props.path ? this.props.path : res[res.length - 1];
    return path;
  }

  addEdit = (id, item) => {
    if (this.props.code) {
      const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
      const roleModule = roleCode.methods ? roleCode.methods : [];
      const derpartment = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'DERPARTMENT').data;
      const organizationUnit = this.props.dashboardPage.profile.organizationUnit
        ? this.props.dashboardPage.profile.organizationUnit.organizationUnitId
        : '';

      const derpartmentRole = organizationUnit ? derpartment.find(elm => elm.name === organizationUnit) : '';

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
            <Link to={`${this.getUrl()}/${id}`} perPage={this.props.perPage}>
              <span className="CustomIconListTask">
                <Edit propsAll={this.props} />
              </span>
            </Link>
          )}
          {/* <Link to={`${this.getUrl()}/${id}`} perPage={this.props.perPage}>
            <span className="CustomIconListTask">
              <Edit propsAll={this.props} />
            </span>
          </Link> */}
          <span className="CustomIconListTask" onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })}>
            <Dehaze />
          </span>
        </div>
      ) : null;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Link to={`${this.getUrl()}/${id}`}>
          <span className="CustomIconListTask">
            <Edit />
          </span>
        </Link>
        <span onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })} className="CustomIconListTask">
          <Dehaze />
        </span>
      </div>
    );
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
    const ws = XLSX.utils.json_to_sheet(data.data ? data.data : data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, `${this.props.code}_ImportTemplate1.xlsx`);
  };

  // getDepartment = () => {
  //   fetch(API_APPROVE_GROUPS, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   })
  //     .then(result => result.json())
  //     .then(data => {
  //       this.setState({ departments: data });
  //     });
  // };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  render() {
    const {
      dialogStatus,
      activePage,
      perPage,
      deleteDialog,
      loading = false,
      exportAnchor,
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
      departments,
      fileColumns,
    } = this.state;

    const {
      client,
      disableAdd,
      settingBar,
      tree,
      code,
      disableSelect,
      disableSearch,
      addFunction,
      exportExcel,
      intl,
      miniActive,
      disableViewConfig,
      disableImport,
      height,
    } = this.props;

    const path = this.getUrl();
    const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
    const roleModule = roleCode ? roleCode.methods : [];
    const roleDashboard = this.props.dashboardPage.roleTask.roles ? this.props.dashboardPage.roleTask.roles : [];
    const extra = roleDashboard.find(elm => elm.code === 'EXTRA') ? roleDashboard.find(elm => elm.code === 'EXTRA').data : [];

    const hideTask = extra.find(elm => elm.name === 'hide').data;
    const protectedTask = extra.find(elm => elm.name === 'protected').data;
    const publicTask = extra.find(elm => elm.name === 'public').data;
    const openTask = extra.find(elm => elm.name === 'open').data;
    const derpartment = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'DERPARTMENT').data;
    const organizationUnit = this.props.dashboardPage.profile.organizationUnit
      ? this.props.dashboardPage.profile.organizationUnit.organizationUnitId
      : '';

    const derpartmentRole = organizationUnit ? derpartment.find(elm => elm.name === organizationUnit) : '';
    const bussinesRole = this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;
    return (
      <GridContainer style={{ backgroundColor: '#ffffff' }}>
        <MenuFilter selectField={this.selectField} columns={columns} closeFilter={this.closeFilter} anchorEl={anchorEl} filters={filters} />
        <MenuAction
          handleClose={this.closeAnchorElAction}
          anchorEl={anchorElAction}
          code={this.props.code}
          id={this.state.id}
          itemCurrent={this.state.itemCurrent}
          addChildTask={this.props.addChildTask}
          extraMenu={this.props.extraMenu}
          getData={this.getData}
          departments={departments}
          bussines={bussinesRole}
          miniActive={miniActive}
          dashboardPage={this.props.dashboardPage}
        />
        <GridItem md={9} sm={9}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {disableSearch ? null : client ? (
              <TextField placeholder={intl.formatMessage(messages.seaching)} value={searchClient} onChange={this.changeSearch} />
            ) : (
              <GridItem md={12} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldUI
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment style={{ cursor: 'pointer' }} position="end">
                        <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style: {
                      padding: '13px 0px 16px 4px',
                    },
                  }}
                  style={{ marginLeft: this.props.mrf ? this.props.mrf : 56, paddingRight: 5 }}
                  placeholder={intl.formatMessage(messages.seaching)}
                  ref={input => (this.search = input)}
                  onChange={this.handleSearch}
                  // fullWidth
                />
                {Array.isArray(columns) &&
                  columns.filter(c => c.enabaleSearch && c.isInSearchbar && c.type !== 'String') &&
                  columns.filter(c => c.enabaleSearch && c.isInSearchbar && c.type !== 'String').map(
                    c =>
                      !c.dateRange ? (
                        <GridItem item xs={3} style={{ position: 'relative', marginBottom: 5 }} custom="customRight">
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
                <GridItem style={{ display: 'flex' }}>
                  {document.documentElement.clientWidth <= 1285 ? (
                    <></>
                  ) : this.props.modalRequiredFilter ? (
                    <div>{this.props.modalRequiredFilter}</div>
                  ) : null}
                  {(this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth <= 1285) ||
                  columns.filter(c => c.enabaleSearch && c.type !== 'String').length ? (
                    <div style={{ paddingTop: this.props.defaultPadding ? this.props.defaultPadding : 10, marginRight: 20 }}>
                      <Fab
                        onClick={() => this.setState({ dialogAllFilter: true })}
                        color="primary"
                        style={{ marginLeft: 15, width: 40, height: 40, minWidth: 40 }}
                      >
                        <Tooltip title="Xem thêm filter">
                          <FilterList />
                        </Tooltip>
                      </Fab>
                    </div>
                  ) : null}
                </GridItem>
                <DialogUI
                  title="Bộ lọc nâng cao"
                  onClose={() => this.setState({ dialogAllFilter: false })}
                  onSave={() => {
                    const currentInnerFilter = this.state.innerFilter;
                    const currFilterAdvance = this.state.filterAdvance;
                    const newInnerFilter = { ...currentInnerFilter };
                    Object.keys(currFilterAdvance).forEach(key => {
                      if (
                        (!currFilterAdvance[key] && !currFilterAdvance[key] !== 0) ||
                        (Array.isArray(currFilterAdvance[key]) && !currFilterAdvance[key].length)
                      ) {
                        delete newInnerFilter[key];
                      } else {
                        const col = columns.find(c => c.name === key);
                        if (col.type) {
                          const [firstEle, model, thirdEle] = col.type.split('|');

                          const isMulti = thirdEle === 'Array' ? true : false;
                          if (firstEle === 'ObjectId' && model) {
                            if (model === 'approve-group') {
                              newInnerFilter['approved.id'] = { $in: currFilterAdvance[key]._id };
                              return;
                            }
                            if (isMulti) {
                              newInnerFilter[key] = { $in: currFilterAdvance[key].map(i => i._id) };
                            } else {
                              newInnerFilter[key] = currFilterAdvance[key]._id;
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
                        } else if (col.type === 'Date') {
                          newInnerFilter[key] = {
                            $gte: moment(currFilterAdvance[key]._d)
                              .startOf('day')
                              .toString(),
                            $lt: moment(currFilterAdvance[key]._d)
                              .endOf('day')
                              .toString(),
                          };
                        } else if (col.dateRange === 'start') {
                          newInnerFilter[key] = {
                            $gte: moment(currFilterAdvance[key]._d)
                              .startOf('day')
                              .toString(),
                          };
                        } else if (col.type === 'Number') {
                          newInnerFilter[key] = currFilterAdvance[key];
                        } else {
                          newInnerFilter[key] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].code;
                        }
                      }
                    });
                    this.setState({ innerFilter: newInnerFilter, dialogAllFilter: false }, () => {
                      // this.getData();
                    });
                  }}
                  saveText="ĐỒNG Ý"
                  open={this.state.dialogAllFilter}
                >
                  <div style={{ height: 500 }}>
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
                      {columns.find(
                        c => (c.dateRange === 'start' && c.enabaleSearch === true) || (c.dateRange === 'end' && c.enabaleSearch === true),
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
                      {/* {columns.filter(c => c.enabaleSearch && c.type !== 'String').map( */}
                      {Array.isArray(columns) &&
                        columns.filter(c => c.enabaleSearch && !c.isInSearchbar && c.type !== 'String') &&
                        columns.filter(c => c.enabaleSearch && !c.isInSearchbar && c.type !== 'String').map(
                          c =>
                            !c.dateRange ? (
                              <GridItem item xs={6}>
                                <CustomInputField
                                  options={c.menuItem ? c.menuItem : ''}
                                  configType={c.configType ? c.configType : ''}
                                  configCode={c.configCode ? c.configCode : ''}
                                  type={c.type}
                                  label={c.title}
                                  value={this.state.filterAdvance[c.name]}
                                  onChange={(newVal, e) => {
                                    const { filterAdvance } = this.state;
                                    const newFilterAdvance = {
                                      ...filterAdvance,
                                      [c.name]:
                                        c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number'
                                          ? newVal.target.value
                                          : newVal,
                                    };
                                    this.setState({ filterAdvance: newFilterAdvance });
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
            {/* <Dialog
            title="thêm trường filter"
            // onSave={this.handleSaveData}
            onClose={false}
            open={editDialog}
            dialogAction={false}
          > */}
            {/* </Dialog> */}

            {/* {this.props.modalFilter ? this.props.modalFilter : null} */}
          </div>
        </GridItem>

        <GridItem md={3} sm={3} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          {this.state.selected.length !== 0 &&
          this.props.code &&
          (roleModule.find(elm => elm.name === 'DELETE') || { allow: false }).allow === true ? (
            <Fab color="secondary">
              <Delete onClick={this.openDialog('deleteDialog')} />
            </Fab>
          ) : null}
          {!disableAdd ? (
            this.props.code ? (
              (roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow === true ? (
                addFunction ? (
                  <span onClick={addFunction} className="CustomIconListTask">
                    <Tooltip title="Thêm mới">
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
            ) : (
              <span className="CustomIconListTask">
                <Link to={`${path}/add`}>
                  <Add />
                </Link>
              </span>
            )
          ) : null}
          {settingBar
            ? this.props.code
              ? (roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow === true
                ? settingBar.map(item => <span className="CustomIconListTask">{item}</span>)
                : null
              : settingBar.map(item => <span className="CustomIconListTask">{item}</span>)
            : null}
          {/* {exportExcel ? (
            this.props.code ? (
              (roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow === true ? (
                <Fab onClick={this.exportExcel}>
                  <Archive />
                </Fab>
              ) : null
            ) : (
              <Fab onClick={this.exportExcel}>
                <Archive />
              </Fab>
            )
          ) : null} */}
          {/* {exportExcel && (roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow ? (
            this.props.customExport ? (
              <Fab>{this.props.customExport}</Fab>
            ) : (
              <Fab onClick={this.props.exportExcel}>
                <Tooltip title="Xuất dữ liệu">
                  <Archive />
                </Tooltip>
              </Fab>
            )
          ) : null} */}
          {exportExcel ? (
            (roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow ? (
              <span onClick={e => this.setState({ exportAnchor: e.currentTarget })} className="CustomIconListTask">
                <Tooltip title="Xuất dữ liệu">
                  <Archive />
                </Tooltip>
              </span>
            ) : null
          ) : null}

          {importExport && !disableImport ? (
            // this.props.code && this.props.tabTask ? (
            (roleModule.find(elm => elm.name === 'IMPORT') || { allow: false }).allow ? (
              <Link to={importExport}>
                <span className="CustomIconListTask">
                  <Tooltip title="Tải lên">
                    <ImportExport />
                  </Tooltip>
                </span>
              </Link>
            ) : null
          ) : //    : (
          //     <Link to={importExport}>
          //       <Fab>
          //         <ImportExport />
          //       </Fab>
          //     </Link>
          //   )
          // )
          null}
          {code && this.state.hasPermissionViewConfig && !disableViewConfig ? (
            <span onClick={this.openDialog('dialogStatus')} className="CustomIconListTask">
              <Tooltip title="Cấu hình bảng">
                <Visibility />
              </Tooltip>
            </span>
          ) : null}
        </GridItem>
        {/* modal is here */}
        <GridList
          columnExtensions={columnExtensions}
          rightColumns={rightColumns}
          loading={loading}
          filters={this.state.queryFilter}
          changeSorting={this.changeSorting}
          changeColumnOrder={this.changeColumnOrder}
          selected={selected}
          rows={rows}
          // perPage={this.props.perPage}
          tree={tree}
          height={height}
          code={code}
          columns={columns}
          columnOrder={columnOrder}
          sorting={sorting}
          disableSelect={disableSelect}
          changeSelect={this.changeSelect}
          onSaveConfig={this.saveConfig}
        />
        <ExportTable
          exportType={this.state.openExport}
          filters={this.state.queryFilter}
          apiUrl={`${API_TASK_PROJECT}/export`}
          onClose={this.handleCloseExportTable}
          open={Boolean(this.state.openExport)}
          listKanbanStatus={this.state.kanbanList}
          moduleCode="Task"
          kanban={this.props.kanban}
          viewConfigUpdateTime={this.state.viewConfigUpdateTime}
          // filter={this.props.filter ? this.props.filter : null}
          // customData={() => {
          //    const { filter } = this.props.filter ? this.props.filter : null;
          //    let { type } = filter;
          //    return { type };
          //  }}
        />

        {/* <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
          <table>
            <tbody>
              <tr>
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100]}
                  colSpan={3}
                  count={count}
                  rowsPerPage={perPage}
                  page={activePage}
                  onChangePage={this.handleChangePage}
                  labelRowsPerPage={'Số dòng hiển thị:'}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActionsWrapped}
                />
              </tr>
            </tbody>
          </table>
        </GridItem> */}
        <Dialog
          {...this.props}
          saveSetting={this.saveSetting}
          saveSettingAll={this.saveSettingAll}
          code={code}
          columns={columns}
          fileColumns={fileColumns}
          open={dialogStatus}
          onClose={this.closeDialogStatus}
        />
        <DialogUI
          maxWidth="sm"
          title="Bạn có chắc chắn muốn xóa không?"
          onSave={this.handleDeleteItem}
          onClose={this.closeDialog('deleteDialog')}
          open={deleteDialog}
          saveText="Đồng ý"
        />
        <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => this.setState({ exportAnchor: null })} anchorEl={exportAnchor}>
          <MenuItem onClick={() => this.setState({ openExport: 'Excel' })}>Xuất Excel</MenuItem>
          <MenuItem onClick={() => this.setState({ openExport: 'PDF' })}>Xuất PDF</MenuItem>
        </Menu>
        <DialogUI
          maxWidth="sm"
          title="Bạn có muốn hoàn thành?"
          onSave={this.addApproveTable}
          onClose={() => this.setState({ openDialogApprove: false })}
          open={openDialogApprove}
          saveText="Hoàn thành"
        />
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
    this.setState({ selected });
  };

  closeDialog = dialog => () => {
    this.setState({ [dialog]: false });
  };

  openDialog = dialog => () => {
    this.setState({ [dialog]: true });
  };

  changeSearch = e => {
    const { activePage, perPage } = this.state;
    this.client({ activePage, perPage, searchClient: e.target.value });
  };
}

const GridList = React.memo(
  ({
    changeSorting,
    rows,
    columns,
    tree,
    disableSelect,
    changeColumnOrder,
    rightColumns,
    code,
    perPage = 14,
    selected,
    columnExtensions,
    loading,
    columnOrder,
    changeSelect,
    onSaveConfig,
    height,
  }) => {
    const [newCls, setNewCls] = React.useState(columns);
    const [defaultColumnWidths, setDefaultColumnWidths] = React.useState([]);
    const dateFormat = localStorage.getItem('dateFomat') || 'DD/MM/YYYY';

    useEffect(
      () => {
        const newColumns = columns.filter(i => i.checked);
        if (newColumns) {
          newColumns.map(el => (el.name === 'startDate' ? ((el.type = 'Date'), (el.dateRange = '')) : (el.type = el.type)));
          newColumns.map(el => (el.name === 'endDate' ? ((el.type = 'Date'), (el.dateRange = '')) : (el.type = el.type)));
          newColumns.map(el => (el.name === 'createdAt' ? ((el.type = 'Date'), (el.dateRange = '')) : (el.type = el.type)));
          newColumns.map(el => (el.name === 'finishDate' ? ((el.type = 'Date'), (el.dateRange = '')) : (el.type = el.type)));
        }
        setNewCls(newColumns);
        setDefaultColumnWidths(
          newColumns.map(item => ({
            columnName: item.name,
            width: item.width || 120,
          })),
        );
      },
      [columns],
    );

    const handleResizeWidth = _.debounce(newColumnsData => {
      if (typeof onSaveConfig === 'function') {
        const newColumns = columns.map(c => {
          const foundColumnData = newColumnsData.find(cData => cData.columnName === c.name);
          if (foundColumnData) {
            c.width = foundColumnData.width;
          }
          return c;
        });
        onSaveConfig(newColumns);
      }
    }, SAVE_VIEWCONFIG_ON_RESIZE_DELAY);

    const DateFormatter = ({ value }) => (moment(value).isValid() ? moment(value).format(dateFormat) : '');

    const DateData = () => {
      const listDateData = [];
      newCls.map(item => {
        if (item.type === 'Date') {
          listDateData.push(item);
        }
      });
      return listDateData;
    };
    const DateTypeProvider = props => <DataTypeProvider for={DateData().map(({ name }) => name)} formatterComponent={DateFormatter} {...props} />;

    const DatetimeFormatter = ({ value }) => (moment(value).isValid() ? moment(value).format(`hh:mm ${dateFormat}`) : '');

    const DatetimeData = () => {
      const listDateData = [];
      newCls.map(item => {
        if (item.type === 'Datetime') {
          listDateData.push(item);
        }
      });
      return listDateData;
    };
    const DatetimeTypeProvider = props => (
      <DataTypeProvider for={DatetimeData().map(({ name }) => name)} formatterComponent={DatetimeFormatter} {...props} />
    );

    return (
      <GridItem md={12} className="CustomListTask">
        <Grid
          // rows={rows.map(item => ({
          //   ...item,
          //   startDate: !!item.startDate ? item.startDate.slice(0, 10) : null,
          //   endDate: !!item.endDate ? item.endDate.slice(0, 10) : null,
          //   finishDate: !!item.finishDate ? item.finishDate.slice(0, 10) : null,
          //   startDatePlan: !!item.startDatePlan ? item.startDatePlan.slice(0, 10) : null,
          //   endDatePlan: !!item.endDatePlan ? item.endDatePlan.slice(0, 10) : null,
          // }))}
          rows={rows}
          columns={newCls}
        >
          {tree ? <TreeDataState /> : null}
          {tree ? <CustomTreeData getChildRows={getChildRows} /> : null}
          <DragDropProvider />
          <PagingState defaultCurrentPage={0} defaultPageSize={15} />
          <IntegratedPaging />
          <SortingState defaultSorting={[{ columnName: 'order', direction: 'asc' }]} onSortingChange={changeSorting} />
          {disableSelect ? null : <SelectionState onSelectionChange={changeSelect} selection={selected} />}
          <IntegratedFiltering />
          <IntegratedSorting key="integrated-sorting" />
          {disableSelect ? null : <IntegratedSelection />}
          <VirtualTable columnExtensions={columnExtensions} height={height ? height : 'auto'} />
          <TableColumnResizing
            columnWidths={defaultColumnWidths}
            onColumnWidthsChange={value => {
              setDefaultColumnWidths(value);
              handleResizeWidth(value);
            }}
          />
          {tree ? null : disableSelect ? null : <TableSelection showSelectAll />}
          {code ? <TableColumnReordering order={columnOrder} onOrderChange={changeColumnOrder} /> : null}
          <TableHeaderRow cellComponent={DragColumn} showSortingControls />
          <DateTypeProvider />
          <DatetimeTypeProvider />
          {tree ? <TableTreeColumn for="name" showSelectionControls showSelectAll /> : null}
          <TableFixedColumns rightColumns={rightColumns} />
          <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={[15, 30, 50]} />
        </Grid>
        {loading && <Loading />}
      </GridItem>
    );
  },
);

const MenuFilter = React.memo(({ anchorEl, closeFilter, columns, selectField, filters }) => (
  <Menu keepMounted open={Boolean(anchorEl)} onClose={closeFilter} anchorEl={anchorEl}>
    <MenuItem>
      <Typography variant="h6">Chọn trường tìm kiếm</Typography>
    </MenuItem>
    {columns
      .filter(
        i =>
          i.enabaleSearch === true &&
          (i.name === 'code' || i.name === 'name' || i.name === 'description' || i.name === 'source' || i.name === 'inCharge'),
      )
      .map(i => (
        <MenuItem key={i.name} value={i.name}>
          <Checkbox color="primary" checked={filters.includes(i.name)} onClick={selectField(i.name)} /> {i.title}
        </MenuItem>
      ))}
  </Menu>
));

const MenuAction = React.memo(
  ({ code, id, itemCurrent, handleClose, anchorEl, addChildTask, extraMenu, getData, bussines, miniActive, dashboardPage }) => {
    const [openDialog, setopenDialog] = useState(false);
    const [dialogAssign, setDialogAssign] = useState(false);
    const [openMakeCreateTaskRequestDialog, setOpenMakeCreateTaskRequestDialog] = useState(false);
    const [mail, setMail] = useState({ to: [], subject: '', text: '' });
    const [dialogEmail, setDialogEmail] = useState(false);
    const [SMS, setSMS] = useState({ subject: '', text: '' });
    const [dialogSMS, setDialogSMS] = useState(false);
    const [openDialogTask, setopenDialogTask] = useState(false);
    const [openDialogSourceView, setOpenDialogSourceView] = useState(false);
    const [show, setShow] = useState(false);
    const [call, setCall] = useState({});
    const [callDialog, setCallDialog] = useState();
    const [state, setState] = useState({
      templatess: [],
      template: '',
      sales: [],
      files: [],
      file: [],
      loading: true,
      templatesItem: '',
      approvedObj: {
        name: '',
        subCode: code,
        form: '',
        group: null,
      },
      dynamicForms: [],
      field: '',
      fields: [],
      data: '',
      project: null,
    });

    const [snackbar, setSnackbar] = useState({
      open: false,
      variant: 'success',
      message: '',
    });

    function assignWork() {
      setDialogAssign(true);
    }

    function makeCreateTaskRequest() {
      setOpenMakeCreateTaskRequestDialog(true);
    }

    const [openApproved, setopenApproved] = useState(false);
    // const findGroup = [];
    // if (itemCurrent.originItem.approved)
    //   // eslint-disable-next-line consistent-return
    //   itemCurrent.originItem.approved.forEach(elm => {
    //     const a = departments.find(item => item._id === (elm.id ? elm.id : elm._id));
    //     if (a) return findGroup.push(a);
    //   });

    const taskManagerRole = bussines.find(elm => elm.name === 'taskManager').data;
    const taskInCharge = bussines.find(elm => elm.name === 'inCharge').data;
    const taskSupport = bussines.find(elm => elm.name === 'support').data;
    const taskViewable = bussines.find(elm => elm.name === 'viewable').data;
    const taskJoin = bussines.find(elm => elm.name === 'join').data;
    const taskApproved = bussines.find(elm => elm.name === 'approved').data;
    const source = itemCurrent.source ? itemCurrent.source : null;
    const module = source ? source.slice(0, source.indexOf('/')) : null;

    // Xuất biểu mẫu
    function handleDialogTemplate(open = true) {
      if (open === true) setopenDialog({ openDialog: open });
      const { allTemplates } = dashboardPage;
      if (code && allTemplates) {
        const templatesItem = allTemplates.filter(elm => elm.moduleCode === code && elm.clientId === clientId);
        setState(state => ({ ...state, templatess: templatesItem }));
      }
    }
    function closeDialogTemplate() {
      setopenDialog(false);
    }

    function handleTemplate() {
      printTemplte(state.template, id, code);
    }
    // Tạo công việc

    function handleTask() {
      setopenDialogTask(true);
    }

    // Phê duyệt
    function handleApprove() {
      setopenApproved(true);
      const { allTemplates } = dashboardPage;
      const listApi = [fetchData(API_FIELD)];
      if (code === 'Task' && itemCurrent.projectId) {
        listApi.push(fetchData(`${API_TASK_PROJECT}/${itemCurrent.projectId}`));
      }
      Promise.all(listApi).then(result => {
        if (code) {
          const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : [];
          // const fields = result[0].filter(i => i.code === code);
          let fields = [];
          if (result[0] && result[0].data) {
            fields = (result[0] && result[0].data.filter(i => i.code === code)) || [];
          } else {
            fields = result[0].filter(i => i.code === code) || [];
          }
          const project = result[1];
          const { approvedObj } = state;
          if (code === 'Task' && itemCurrent.projectId) approvedObj.name = `Công việc ${itemCurrent.name} trong dự án ${result[1].name}`;
          setState(state => ({ ...state, templatess: templatesItem, fields, approvedObj, project }));
        }
      });
    }

    function handleAddApprovedGroup(value) {
      setState({ ...state, approvedObj: { ...state.approvedObj, group: value } });
    }

    function handleChangeApproved(e, name) {
      const { approvedObj } = state;
      approvedObj[name] = e.target.value;
      setState(state => ({ ...state, approvedObj }));
    }

    function handleFileChange(e) {
      const files = e.target.files[0];
      setState({ ...state, file: files });
      setShow(true);
    }

    function handleFileDelete(f) {
      const files = state.files.filter(i => i !== f);
      setState({ ...state, file: files });
      setShow(false);
    }

    async function addApprove() {
      const { approvedObj, templatess, file, project } = state;
      const exsist = templatess.find(i => String(i._id) === String(approvedObj.form));
      let content = '';
      let dynamicForm = '';
      if (exsist) {
        content = exsist.content;
        dynamicForm = exsist._id;
      }
      if (approvedObj.group === null) {
        setSnackbar({
          open: false,
          message: 'Bạn phải nhập nhóm phê duyệt',
          variant: 'error',
        });
      }
      const groupInfo = [];
      const planApprovalUsers = [];
      approvedObj.group.group.forEach(item => {
        planApprovalUsers.push(item.person);
        groupInfo.push({
          order: item.order,
          person: item.person,
          approve: 0,
          reason: '',
        });
      });
      const dataInfo = {
        ...itemCurrent.originItem,
      };
      let checkPlanApproval = false;
      if (state.field) {
        const foundFieldChanged = state.fields.find(f => f._id === state.field);
        if (foundFieldChanged && foundFieldChanged.fields.find(k => k.name === 'planApproval')) {
          checkPlanApproval = true;
        }
      }
      if (checkPlanApproval) {
        dataInfo.planApprovalUsers = planApprovalUsers;
      }

      const body = {
        name: approvedObj.name,
        subCode: approvedObj.subCode,
        collectionCode: code,
        content,
        dataInfo,
        dynamicForm,
        convertMapping: '5d832729c252b2577006c5ab',
        approveGroup: approvedObj.group._id,
        groupInfo,
        clientId,
        field: state.field,
      };

      onCreateApprove(body);

      if (file && project) {
        const form = new FormData();
        form.append('fileUpload', file);
        const head = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_03')}`,
          },
          body: form,
        };
        const { name, _id } = project;
        const url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=Task&mid=${_id}&mname=${name}&fname=root&ftype=0`;
        await fetch(url, head);
      }
      setState(state => ({ ...state, openApproved: false, approvedObj: { name: '', subCode: '', form: '', group: null }, field: '', file: null }));
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
          fetch(`${API_TASK_PROJECT}/${body.dataInfo._id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
            body: JSON.stringify(parseTask(body.dataInfo)),
          })
            .then(res => {
              console.log('res', res);
            })
            .catch(err => console.log(err));
          getData();
        })
        .catch(() => {
          setSnackbar({ open: false, message: 'Thêm phê duyệt thất bại', variant: 'error' });
        });
    }

    function closeDialogTask() {
      setopenDialogTask(false);
    }

    function closeDialogSourceView() {
      setOpenDialogSourceView(false);
    }

    function closeAssignTask() {
      setDialogAssign(false);
    }
    // console.log('fdf');

    function callbackAssign(snack, close = true) {
      setSnackbar(snack);
      if (close) setDialogAssign(false);
    }

    async function handleEmailDialog() {
      if (code === 'Task') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
        setMail({ ...mail, to: [customer] });
      }

      handleDialogTemplate(false);
      setDialogEmail(!dialogEmail);
    }

    async function handleSMSDialog() {
      if (code === 'Customer') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
        setSMS({ ...SMS, to: customer.phoneNumber });
      }

      if (code === 'BusinessOpportunities' && itemCurrent.originItem && itemCurrent.originItem.customerId) {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent.originItem.customerId._id}`);
        setSMS({ ...SMS, to: customer.phoneNumber });
      }

      handleDialogTemplate(false);
      setDialogSMS(!dialogSMS);
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
        // const formData = new FormData();

        // for (let index = 0; index < state.files.length; index++) {
        //   formData.append('files', state.files[index]);
        // }

        // // formData.append('file', state.files);
        // const x = await fetch(`${API_MAIL}/upload`, {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        //   body: formData,
        // });

        // const filesSend = await x.json();
        // data.html = await getDataBeforeSend({ templateId: state.template, dataId: id, moduleCode: code });
        // data.filesSend = filesSend;

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

    async function sendSMS() {
      if (!SMS.text || !state.template || !SMS.to || !SMS.to.length) {
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
          template: state.template,
          html: data.text,
          listCustomer: SMS.to,
          code,
        };

        await fetchData(API_SMS1, 'POST', formatData);
        setDialogSMS(false);
        alert('Gửi SMS thành công');
      } catch (error) {
        console.log(error);
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
      console.log('listFile', listFile);
      setState({ ...state, files: listFile });
    }
    function handleCall() {
      console.log(itemCurrent, 'itemCurrent');
      setCall(itemCurrent);
      setCallDialog(true);
    }
    return (
      <div>
        <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl}>
          <MenuItem
            onClick={() => {
              assignWork();
              handleClose();
            }}
          >
            Giao việc
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleTask();
              handleClose();
            }}
          >
            Tạo công việc
          </MenuItem>
          <MenuItem
            onClick={() => {
              makeCreateTaskRequest();
              handleClose();
            }}
          >
            Đề xuất CV
          </MenuItem>
          {itemCurrent && itemCurrent.sourceLogId ? (
            <MenuItem
              onClick={() => {
                setOpenDialogSourceView(true);
                handleClose();
              }}
            >
              Nguồn gốc
            </MenuItem>
          ) : null}
          <MenuItem
            onClick={() => {
              handleEmailDialog();
              handleClose();
            }}
          >
            Gửi mail
          </MenuItem>
          {/* <MenuItem onClick={() => handleClose()}>Gọi điện</MenuItem> */}
          <MenuItem onClick={() => handleCall()}>Gọi điện</MenuItem>
          <MenuItem
            onClick={() => {
              handleSMSDialog();
              handleClose();
            }}
          >
            SMS
          </MenuItem>
          {(taskManagerRole.sendApprove === true ||
            taskApproved.sendApprove === true ||
            taskInCharge.sendApprove === true ||
            taskJoin.sendApprove === true ||
            taskSupport.sendApprove === true ||
            taskViewable.sendApprove === true) &&
          (itemCurrent.originItem.state === '2' ||
            itemCurrent.originItem.state === '3' ||
            itemCurrent.originItem.state === '5' ||
            itemCurrent.originItem.planApproval !== 1) ? (
            <MenuItem
              onClick={() => {
                handleApprove();
                handleClose();
              }}
            >
              Yêu cầu phê duyệt
            </MenuItem>
          ) : null}
          <MenuItem
            onClick={() => {
              handleDialogTemplate(true);
              handleClose();
            }}
          >
            Xuất biểu mẫu
          </MenuItem>
          {extraMenu && extraMenu(id)}
        </Menu>
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
        <input style={{ display: 'none' }} id="contained-button-file" multiple onChange={onSelectFile} type="file" />

        <SMSDialog dialogSMS={dialogSMS} setDialogSMS={setDialogSMS} sendSMS={sendSMS} SMS={SMS} state={state} setState={setState} setSMS={setSMS} />

        <DialogUI dialogAction={false} onClose={closeAssignTask} open={dialogAssign}>
          <AssignTask id={id} callbackAssign={callbackAssign} code={code} itemCurrent={itemCurrent} />
        </DialogUI>
        <DialogUI dialogAction={false} onClose={() => setOpenMakeCreateTaskRequestDialog(false)} open={openMakeCreateTaskRequestDialog}>
          <MakeCreateTaskRequest
            id={id}
            itemCurrent={itemCurrent}
            callbackAssign={callbackAssign}
            code={code}
            setCloseDialog={() => setOpenMakeCreateTaskRequestDialog(false)}
          />
        </DialogUI>
        {/* formExport */}
        <DialogUI onSave={handleTemplate} open={openDialog} onClose={closeDialogTemplate} saveText="In biểu mẫu">
          <TextField value={state.template} fullWidth select onChange={e => setState({ ...state, template: e.target.value })} label="Biểu mẫu">
            {state.templatess.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
          <CloudDownload />
        </DialogUI>
        <SwipeableDrawer
          anchor="right"
          onClose={closeDialogTask}
          open={openDialogTask}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <AddProjects
            id="add"
            isCreateTask
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
        {/* <SwipeableDrawer anchor="right" onClose={closeDialogSourceView} open={openDialogSourceView}> */}
        <SourceView model="Task" objectId={id} open={openDialogSourceView} onClose={closeDialogSourceView} module={module} />
        {/* </SwipeableDrawer> */}
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
          <TextField label="Tên phê duyệt" name="name" onChange={e => handleChangeApproved(e, 'name')} value={state.approvedObj.name} />
          <AsyncAutocomplete
            placeholder="Tìm kiếm nhóm phê duyệt ..."
            url={API_APPROVE_GROUPS}
            value={state.approvedObj.group}
            filter={{ clientId, approveType: 1 }}
            onChange={handleAddApprovedGroup}
            label=" Nhóm phê duyệt"
          />
          <TextField label="Tên quy trình" name="name" onChange={e => handleChangeApproved(e, 'subCode')} value={state.approvedObj.subCode} />
          <TextField label="Field name" select onChange={e => setState({ ...state, field: e.target.value })} value={state.field}>
            {state.fields.map(i => (
              <MenuItem key={i._id} value={i._id}>
                {i.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
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
          <div>
            <label htmlFor="fileUpload">
              <CloudUpload color="primary" />
              <span style={{ marginLeft: 10 }}>{state.file && state.file.name}</span>
            </label>
            <span>{show ? <Delete onClick={handleFileDelete} /> : ''}</span>
          </div>
          {/* {console.log(77777, state)} */}
          {/* <FileUpload style={{ marginRight: '10rem' }} name='aaaaa' size="4px 20px" code="Task" /> */}
          <input onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" />
        </DialogUI>
        <CallDialog
          open={callDialog}
          call={call}
          onClose={() => {
            setCallDialog(false);
          }}
        />
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
      </div>
    );
  },
);

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  injectIntl,
  withConnect,
)(ListPage);

ListPage.defaultProps = {
  deleteOption: 'ids',
  filter: { status: 1 },
  treeName: 'name',
  columnExtensions: [{ columnName: 'edit', width: 150 }],
  rightColumns: ['edit'],
  reload: false,
  perPage: 15,
  status: 'crmStatus',
  disableEdit: false,
  extraMenu: null,
};
