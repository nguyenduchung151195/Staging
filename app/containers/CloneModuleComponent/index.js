/**
 *
 * CloneModuleComponent
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import Button from 'components/CustomButtons/Button';

import { Grid, IconButton } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import Progressbar from 'react-progressbar';

import { fetchAllDocsAction, addDocAction, resetNotis, updateDocsAction, deleteDocsAction, getPluginsAction } from './actions';
import makeSelectCloneModuleComponent from './selectors';
import HOCTable from '../HocTable';
import Kanban from '../KanbanPlugin';
import CalendarContainer from '../CalendarContainer';
import LoadingIndicator from '../../components/LoadingIndicator';
import HOCCollectionDialog from '../../components/HocCollectionDialog';
import reducer from './reducer';
import saga from './saga';
import { API_DOCS } from '../../config/urlConfig';
import Automation from '../PluginAutomation/Loadable';

/* eslint-disable react/prefer-stateless-function */

// const CustomRelation = props => {
//   let ref = '';
//   ref = props.columnConfig.type.replace('Relation|', '');
//   ref = ref.replace(/'/g, '"');
//   const objectRef = JSON.parse(ref);
//   console.log('thang',this.props);
//   return <p>{props.item[objectRef.ref] ? props.item[objectRef.ref][objectRef.select] : 'Loading...'}</p>;
// };
const CustomFile = props => (
  <div>
    {props.item.others[props.columnConfig.name.replace('others.', '')] ? (
      <IconButton
        onClick={() => {
          window.open(props.item.others[props.columnConfig.name.replace('others.', '')]);
        }}
      >
        <CloudDownload />
      </IconButton>
    ) : (
      ''
    )}
  </div>
);
// const CustomBoolean = props => <p>{props.item[props.columnConfig.name] !== undefined ? props.item[props.columnConfig.name].toString() : ''}</p>;
const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];

  propsFromTable.forEach(item => {
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
  const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Không xác định</span>
      )}
    </div>
  );
};
export class CloneModuleComponent extends React.Component {
  state = {
    docs: [],
    plugins: [],
    tab: 'PL_VIEW_LIST',
    isLoading: true,
    openCollectionDialog: false,
    isEditting: false,
    date: new Date(),
    pageDetail: {
      currentPage: 0,
      pageSize: 10,
      totalCount: 0,
    },
    editData: {},
    viewConfig: {},
  };

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    // this.props.onGetDocs(params.collectionCode);
    this.props.onGetDocs({
      query: {
        skip: this.state.pageDetail.currentPage * this.state.pageDetail.pageSize,
        limit: this.state.pageDetail.pageSize,
      },
      collectionCode: this.props.match.params.collectionCode,
    });
    this.props.onGetPlugins(params.collectionCode);
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfigLocalStorage.find(d => d.code === this.props.match.params.collectionCode);
    const { columns, others } = currentViewConfig.listDisplay.type.fields.type;

    const listRelationRef = [];
    // let ref = '';
    columns.forEach(element => {
      if (element.type.includes('Relation')) {
        let ref = '';
        ref = element.type.replace('Relation|', '');
        ref = ref.replace(/'/g, '"');
        const objectRef = JSON.parse(ref);
        // console.log(objectRef);
        const indexOfRef = listRelationRef.findIndex(d => d.ref === objectRef.ref);

        if (indexOfRef === -1) {
          listRelationRef.push({ ref: objectRef.ref, arrSelect: [objectRef.select] });
        } else {
          // console.log(listRelationRef[indexOfRef]);
          listRelationRef[indexOfRef].arrSelect.push(objectRef.select);
        }
      }
    });
    let currentViewConfigColumns = [];
    if (others) {
      currentViewConfigColumns = [...columns, ...others];
    } else {
      currentViewConfigColumns = columns;
    }
    currentViewConfigColumns.sort((a, b) => a.order - b.order);
    this.setState({ viewConfig: currentViewConfigColumns });
  }

  componentWillUpdate(props) {
    const { cloneModuleComponent } = props;
    // if (cloneModuleComponent.docs) {
    //   this.state.docs = cloneModuleComponent.docs.data;
    //   this.state.isLoading = cloneModuleComponent.loading;
    // }
    if (cloneModuleComponent.plugins !== this.props.cloneModuleComponent.plugins) {
      this.state.plugins = cloneModuleComponent.plugins || [];
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.collectionCode !== prevProps.match.params.collectionCode) {
      this.props.onGetDocs({
        query: {
          skip: this.state.pageDetail.currentPage * this.state.pageDetail.pageSize,
          limit: this.state.pageDetail.pageSize,
        },
        collectionCode: this.props.match.params.collectionCode,
      });
      this.state.pageDetail.currentPage = 0;
      this.state.pageDetail.pageSize = 5;
      this.props.onGetPlugins(this.props.match.params.collectionCode);
      const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = viewConfigLocalStorage.find(d => d.code === this.props.match.params.collectionCode);
      const { columns } = currentViewConfig.listDisplay.type.fields.type;
      const listRelationRef = [];
      columns.forEach(element => {
        if (element.type.includes('Relation')) {
          let ref = '';
          ref = element.type.replace('Relation|', '');
          ref = ref.replace(/'/g, '"');
          const objectRef = JSON.parse(ref);

          const indexOfRef = listRelationRef.findIndex(d => d.ref === objectRef.ref);

          if (indexOfRef === -1) {
            listRelationRef.push({ ref: objectRef.ref, arrSelect: [objectRef.select] });
          } else {
            listRelationRef[indexOfRef].arrSelect.push(objectRef.select);
          }
        }
      });
    }
  }

  componentWillReceiveProps(props) {
    const { cloneModuleComponent } = props;
    if (cloneModuleComponent.docs) {
      // this.setState({
      this.state.pageDetail.totalCount = cloneModuleComponent.docs.count;
      this.state.pageDetail.currentPage = Number(cloneModuleComponent.docs.skip);
      this.state.pageDetail.pageSize = cloneModuleComponent.docs.limit;
      this.state.docs = cloneModuleComponent.docs.data;
      this.state.plugins = cloneModuleComponent.plugins;
      this.state.isLoading = cloneModuleComponent.loading;
      // });
    } else {
      // this.setState({
      this.state.docs = cloneModuleComponent.docs;
      this.state.isLoading = cloneModuleComponent.loading;
      // });
    }
    if (cloneModuleComponent.callAPIStatus === 1) {
      this.props.enqueueSnackbar(cloneModuleComponent.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    }
    if (cloneModuleComponent.callAPIStatus === 0) {
      this.props.enqueueSnackbar(cloneModuleComponent.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }

    this.props.onResetNotis();
  }

  render() {
    const Bt = props => (
      <Button onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </Button>
    );
    const pathname = this.props.location.pathname.replace('/module', '');
    const { docs, plugins, tab, isLoading } = this.state;
    let fromKanbanStatusId = 'ST01';
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    let kanbanStatuses = [];
    if (plugins.length !== 0) {
      const x = plugins.findIndex(d => d.code === 'PL_VIEW_KANBAN');
      if (x !== -1) {
        fromKanbanStatusId = plugins[x].data.kanbanConfig.fromId;
        // console.log(fromKanbanStatusId)
        listCrmStatus.forEach(element => {
          if (String(element.code) === String(fromKanbanStatusId)) {
            kanbanStatuses = element.data;
          }
        });
      }
      // console.log(kanbanStatuses);
    }
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfigLocalStorage.find(d => d.code === this.props.match.params.collectionCode);
    const { others } = currentViewConfig.listDisplay.type.fields.type; // columns
    // const listRelationRef = [];
    const listRelationColumn = [];
    const listBoolean = [];
    const listDownload = [];
    // columns.forEach(element => {
    //   if (element.type.includes('Relation')) {
    //     let ref = '';
    //     ref = element.type.replace('Relation|', '');
    //     ref = ref.replace(/'/g, '"');
    //     const objectRef = JSON.parse(ref);
    //     listRelationRef.push({ ref: objectRef.ref, select: objectRef.select });
    //     // const indexOfRef = listRelationRef.findIndex(d => d.ref === objectRef.ref);
    //     listRelationColumn.push({
    //       columnName: element.name,
    //       CustomComponent: CustomRelation,
    //     });
    //   }
    //   if (element.type === 'Boolean') {
    //     listBoolean.push({
    //       columnName: element.name,
    //       CustomComponent: CustomBoolean,
    //     });
    //   }
    // });
    others.forEach(element => {
      if (element.type === 'File') {
        listDownload.push({
          columnName: element.name,
          CustomComponent: CustomFile,
        });
      }
    });
    // const hasKanban = this.state.plugins.findIndex(d => d.code === 'PL_VIEW_KANBAN') !== -1;
    // console.log(plugins);
    return (
      <div>
        {isLoading ? <LoadingIndicator /> : null}
        {/* {console.log(this.child)} */}
        <Grid container>
          <Grid sm="12" item alignItems="flex-end">
            {plugins.map(item => (
              <Bt key={item.id} tab={item.code}>
                {item.name}
              </Bt>
            ))}
          </Grid>
          <Grid item sm="12">
            {/* {tab === 'PL_VIEW_LIST' && <TableCloneModule />} */}
            {tab === 'PL_VIEW_LIST' && (
              <HOCTable
                enablePaging={false}
                // onRef={ref => (this.child = ref)}
                handleEditClick={this.handleEditClick}
                // handleAddClick={this.handleAddClick}
                useConfirm
                kanbanStatuses={kanbanStatuses}
                handleDeleteClick={this.handleDeleteClick}
                callBack={this.callBack}
                customColumns={[
                  ...listDownload,
                  ...[
                    {
                      columnName: 'kanbanStatus',
                      CustomComponent: CustomKanbanStatus,
                    },
                  ],
                  ...listRelationColumn,
                  ...listBoolean,
                ]}
                collectionCode={this.props.match.params.collectionCode}
                path={pathname}
                data={docs}
                enableEdit
                enableAddFieldTable={false}
                // enableDelete={false}
                pageDetail={this.state.pageDetail} // phân trang
                onGetAPI={this.props.onGetDocs}
                enableServerPaging
                isClone
                history={this.props.history}
                enableApproved
              />
            )}
            {tab === 'PL_VIEW_KANBAN' && (
              <Kanban
                callBack={this.callBack}
                path={`${API_DOCS}/${this.props.match.params.collectionCode}`}
                pathCrm={`/crm/${this.props.match.params.collectionCode}`}
                code={fromKanbanStatusId || ''}
                titleField="name"
                isCloneModule
              />
            )}
            {tab === 'PL_SERVICES_AUTOMATION' && (
              <Automation
                code={fromKanbanStatusId} // code của danh sách trạng thái kanban
                path={`/crm/${this.props.match.params.collectionCode}`} // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
              />
            )}
            {tab === 'PL_WIDGET_CALENDAR' && (
              <CalendarContainer
                column={{
                  Id: '_id',
                  Subject: 'name',
                  Location: '',
                  StartTime: 'createdAt',
                  EndTime: 'createdAt',
                  CategoryColor: '#357cd2',
                }}
                isCloneModule
                url={`${API_DOCS}/${this.props.match.params.collectionCode}`}
                code={fromKanbanStatusId || ''}
                handleAdd={this.handleAddClickCalendar}
                handleEdit={this.handleClickEditCalendar}
              />
            )}
          </Grid>
        </Grid>
        {this.state.openCollectionDialog ? (
          <HOCCollectionDialog
            callBack={this.callBack}
            handleClose={() => {
              this.setState({ openCollectionDialog: false });
            }}
            dialogTitle=""
            editData={this.state.editData}
            isEditting={this.state.isEditting}
            viewConfig={this.state.viewConfig}
            open={this.state.openCollectionDialog}
            history={this.props.history}
            isCalendar
            date={this.state.date}
            arrKanban={kanbanStatuses || []}
          />
        ) : (
          ''
        )}
      </div>
    );
  }

  handleAddClickCalendar = date => {
    this.setState({ openCollectionDialog: true, isEditting: false, date });
  };

  handleClickEditCalendar = data => {
    this.setState({ openCollectionDialog: true, isEditting: true, editData: data });
  };

  handleTab(tab) {
    // console.log(tab)
    if (tab === 'PL_VIEW_LIST') {
      const query = {
        skip: this.state.pageDetail.currentPage * this.state.pageDetail.pageSize,
        limit: this.state.pageDetail.pageSize,
      };
      const collectionCode = this.props.match.params.collectionCode;
      this.props.onGetDocs({ query, collectionCode });
    }
    this.setState({ tab });
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'create-new':
        this.props.onAddDoc(
          {
            collectionCode: this.props.match.params.collectionCode,
            query: { skip: this.state.pageDetail.currentPage, limit: this.state.pageDetail.pageSize },
          },
          data,
        );
        this.setState({ openCollectionDialog: false });
        break;
      case 'update': {
        const convertData = Object.assign({}, data);
        // this.props.onUpdateDoc(this.props.match.params.collectionCode, convertData);
        this.props.onUpdateDoc(
          {
            collectionCode: this.props.match.params.collectionCode,
            query: { skip: this.state.pageDetail.currentPage, limit: this.state.pageDetail.pageSize },
          },
          convertData,
        );
        this.setState({ openCollectionDialog: false });
        break;
      }
      case 'kanban-dragndrop':
        this.props.onUpdateDoc(this.props.match.params.collectionCode, { kanbanStatus: data.kanbanStatus, _id: data._id });
        break;

      default:
        break;
    }
  };

  handleDeleteClick = selections => {
    const { docs } = this.state;
    const deleteIds = [];
    selections.forEach(element => {
      deleteIds.push(docs[element]._id);
    });
    this.props.onDeleteDocs(this.props.match.params.collectionCode, deleteIds);
  };
}

CloneModuleComponent.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  cloneModuleComponent: makeSelectCloneModuleComponent(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDocs: param => {
      dispatch(fetchAllDocsAction(param));
    },
    // onGetRelationDocs: listRelationRef => {
    //   dispatch(fetchAllRelationDocsAction(listRelationRef));
    // },
    onGetPlugins: collectionCode => {
      dispatch(getPluginsAction(collectionCode));
    },
    onAddDoc: (collectionCode, newDoc) => {
      dispatch(addDocAction(collectionCode, newDoc));
    },
    onUpdateDoc: (collectionCode, newDoc) => {
      dispatch(updateDocsAction(collectionCode, newDoc));
    },
    onDeleteDocs: (collectionCode, deleteIds) => {
      dispatch(deleteDocsAction(collectionCode, deleteIds));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'cloneModuleComponent', reducer });
const withSaga = injectSaga({ key: 'cloneModuleComponent', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(CloneModuleComponent);
