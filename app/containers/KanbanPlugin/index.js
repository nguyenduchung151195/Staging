import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Board from 'react-trello/dist';
import { withStyles } from '@material-ui/core/styles';
import { Fab, TextField, Tooltip } from '@material-ui/core';
import { Grid, Paper } from '@material-ui/core';
import { Archive, Search } from '@material-ui/icons';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
import makeSelectDashboardPage from '../../containers/Dashboard/selectors';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import dot from 'dot-object';
import CardKanban from '../../components/CardKanban';
import CustomLaneHeader from './customLaneHeader';
import makeSelectKanbanPlugin from './selectors';
import reducer from './reducer';
import saga from './saga';
import HOCCollectionDialog from '../../components/HocCollectionDialog';
import styles from './styles';
import { getItemsAct, getMoreItemsAct } from './actions';
import { clearWidthSpace, serialize } from '../../utils/common';
import request from '../../utils/request';
import { tableToExcel } from '../../helper';
const date = new Date();
export class Kanban extends React.Component {
  state = {
    kanbanStatus: { lanes: [] },
    items: [],
    month: date,
    openCollectionDialog: false,
    viewConfig: {},
    editData: {},
    canReload: true,
    paging: {},
  };
  componentDidMount() {
    const { statusType = 'crmStatus', styleKb } = this.props;
    const width = this.props.styleKb;
    let listCrmStatus = [];
    listCrmStatus = JSON.parse(localStorage.getItem(statusType));
    let sortedKanbanStatus = [];
    if (this.props.code) {
      let listStatus = [];
      const currentStatusIndex = listCrmStatus.findIndex(d => d.code === this.props.code);
      if (currentStatusIndex !== -1) {
        listStatus = listCrmStatus[currentStatusIndex].data;
      } else {
        alert('Trạng thái kanban đã bị xóa');
      }
      const newPaging = {};
      listStatus.forEach(item => {
        newPaging[item._id] = {
          skip: 0,
          limit: 20,
        };
      });
      this.setState({ paging: newPaging }, () => {
        this.callApi(this.props);
      });
      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      listStatus.forEach(item => {
        laneStart.push({
          id: item._id,
          _id: item._id,
          title: item.name,
          name: item.name,
          color: item.color,
          style: {
            backgroundColor: 'transparent',
            color: '#fff',
            laneStyle: { color: item.color },
            borderLeft: '1px dashed #3f99bf',
            borderRadius: '0',
            margin: '0 10px !important',
            height: '75vh',
            padding: '0 10px 0 0  ',
            width: `${width}`,
          },
          cards: [],
          labelStyle: { color: item.color, enableTotal: this.props.enableTotal, enableAdd: this.props.enableAdd },
        });
      });
      sortedKanbanStatus = { lanes: [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail] };
    }

    this.setState({ kanbanStatus: JSON.parse(JSON.stringify(sortedKanbanStatus)) });
    if (this.props.isCloneModule) {
      const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = viewConfigLocalStorage.find(d => d.path === this.props.pathCrm);
      const { columns, others } = currentViewConfig.listDisplay.type.fields.type;
      let currentViewConfigColumns = [];
      if (others) {
        currentViewConfigColumns = [...columns, ...others];
      } else {
        currentViewConfigColumns = columns;
      }
      currentViewConfigColumns.sort((a, b) => a.order - b.order);
      this.setState({ viewConfig: currentViewConfigColumns });
    }
  }

  componentWillReceiveProps(props) {
    if (props.path && props.path !== this.props.path) {
      this.callApi(props);
    }
    if ((props.reload && props.reload) !== this.props.reload) {
      this.callApi(props);
      this.setState({ canReload: true });
    }
    if ((props.error && props.error) !== this.props.error) {
      this.callApi(props);
      this.setState({ canReload: true });
    }
    if (props.successUpdate === true) {
      this.callApi(props);
    }

    if (props.reload === true && this.state.canReload) {
      this.callApi(props);
      this.setState({ canReload: false });
    }
    if (props.kanbanPlugin.allItems !== this.props.kanbanPlugin.allItems && props.kanbanPlugin.allItems !== undefined) {
      this.setState({ items: props.kanbanPlugin.allItems });
      const { kanbanStatus } = this.state;
      const newKanbanStatus = JSON.parse(JSON.stringify(kanbanStatus));
      newKanbanStatus.lanes.forEach((element, index) => {
        newKanbanStatus.lanes[index].cards = [];
      });
      const action = [];
      if (props.customActions && props.customActions.length > 0) {
        props.customActions.forEach(m => {
          action.push(m.action);
        });
      }
      props.kanbanPlugin.allItems.forEach(element => {
        const indexKanban = newKanbanStatus.lanes.findIndex(
          n =>
            String(n.id) === String(element.kanbanStatus),
          // String(
          //   this.props.code === 'ST250'
          //     ? element.kanbanStatusImport
          //     : this.props.code === 'ST251'
          //       ? element.kanbanStatusExport
          //       : element.kanbanStatus,
          // ),
        );
        if (indexKanban !== -1) {
          if (props.customContent && props.customContent.length > 0) {
            newKanbanStatus.lanes[indexKanban].cards.push({
              id: element._id,
              title: this.props.titleField ? element[this.props.titleField] : element.name,
              action,
              style: { color: newKanbanStatus.lanes[indexKanban].labelStyle.color },
              data: dot.dot(element),
              customContent: props.customContent,
              customActions: props.customActions || [],
            });
          } else {
            newKanbanStatus.lanes[indexKanban].cards.push({
              id: element._id,
              title: this.props.titleField ? element[this.props.titleField] : element.name,
              action,
              style: { color: newKanbanStatus.lanes[indexKanban].labelStyle.color },
              data: dot.dot(element),
              customActions: props.customActions || [],
            });
          }
        }
      });
      this.setState({ kanbanStatus: newKanbanStatus });
    }
  }
  componentDidUpdate(props, state) {
    if (this.props.filter !== props.filter || this.state.canReload) {
      this.callApi(props);
      this.state.canReload = false;
    }
  }

  onCardClick = cardId => {
    if (this.props.params) {

      if (this.props.type) {
        const { history } = this.props
        const type = this.props.type;
        history.push({
          pathname: `${this.props.params}/${cardId}`,
          state: type,
        });
      } else {
        this.props.history.push(`${this.props.params}/${cardId}`);
      }
    }
    if (this.props.isCloneModule) {
      const current = this.state.items.find(n => String(n._id) === String(cardId));
      if (current) {
        this.setState({ openCollectionDialog: true, editData: current });
      }
    }
    if (this.props.isOpenSinglePage) {
      const current = this.state.items.find(n => String(n._id) === String(cardId));
      if (current) {
        this.props.callBack('openDialog', current);
      }
    }
  };

  handleSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const search = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ search, canReload: true });
    }, 500);
  };

  handleLoadMore = (a, b) => {
    const currPaging = this.state.paging;
    const newColumnPaging = {
      ...currPaging[b],
      skip: currPaging[b].skip + currPaging[b].limit,
    };
    const newPaging = {
      ...currPaging,
      [b]: newColumnPaging,
    };
    this.setState({ paging: newPaging });
    let filter = { ...this.props.filter };
    if (this.state.search) filter.$or = this.props.filters.map(i => ({ [i]: { $regex: this.state.search, $options: 'gi' } }));
    let newFilter = { filter };
    return request(
      `${this.props.path}?${serialize({
        ...newFilter,
        filter: {
          ...newFilter.filter,
          kanbanStatus: b,
        },
        ...newColumnPaging,
      })}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
      .then(res => {
        const indexKanban = this.state.kanbanStatus.lanes.findIndex(n => String(n.id) === String(b));
        const style = { color: this.state.kanbanStatus.lanes[indexKanban].labelStyle.color };
        return res.data.map(element => {
          const action = [];

          if (this.props.customActions && this.props.customActions.length > 0) {
            this.props.customActions.forEach(m => {
              action.push(m.action);
            });
          }
          return {
            id: element._id,
            title: this.props.titleField ? element[this.props.titleField] : element.name,
            action,
            style,
            data: dot.dot(element),
            customContent: this.props.customContent,
            customActions: this.props.customActions || [],
          };
        });
      })
      .catch(e => console.log('load more error', e));
  };

  render() {
    const { kanbanStatus } = this.state;
    const params = this.props.params ? this.props.params.split('/') : null;
    const code = params ? params[0] : null;

    const { nameCallBack, error } = this.props;

    return (
      <Paper>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            padding: '30px',
            paddingTop: '10px',
            backgroundColor: 'transparent',
            whiteSpace: 'none !important',
          }}
        >
          <Grid container spacing={16} style={{ paddingLeft: 10 }}>
            {this.props.disableSearch ? null : (
              <Grid item xs={2} md={2}>
                <TextField
                  label="Tìm kiếm theo tên"
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                  ref={input => (this.search = input)}
                  onChange={this.handleSearch}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // inputProps={{
                  //   style: {
                  //     padding: '15px 32px 15px 14px',
                  //     margin: '0 15px',
                  //   },
                  // }}
                  fullWidth
                />
              </Grid>
            )}
            {!this.props.customFilter ? (
              <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="vi-VN">
                <Grid item sm={4} md={2} style={{ textAlign: 'left' }}>
                  <DatePicker
                    views={['year', 'month']}
                    variant="outlined"
                    style={{ zIndex: 0 }}
                    keyboardIcon={<i className="far fa-clock fa-xs" />}
                    label="Chọn tháng"
                    maxDate={new Date()}
                    value={this.state.month}
                    onChange={this.handleChangeMonth}
                    okLabel="Xác nhận"
                    cancelLabel="Hủy"
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            ) : (
              <Grid item md={10} sm={10}>
                {this.props.customFilter}
              </Grid>
            )}
            {/* <Grid item style={{ flex: '1 1 auto', textAlign: 'right' }}>
              <button
                onClick={() => {
                  tableToExcel('excel-table-instance', 'W3C Example Table');
                }}
              >
                <Tooltip title="Xuất dữ liệu">
                  <Fab color="primary" size="small">
                    <Archive />
                  </Fab>
                </Tooltip>
              </button>
            </Grid> */}
          </Grid>

          {kanbanStatus.lanes.length !== 0 ? (
            <Board
              style={{ backgroundColor: 'transparent', whiteSpace: 'pre-line', maxHeight: '80vh' }}
              cardStyle={{ whiteSpace: 'pre-line' }}
              tagStyle={{ backgroundColor: 'red', whiteSpace: 'pre-line' }}
              data={kanbanStatus}
              laneDraggable={false}
              // draggable // cho phép kéo thả
              cardDraggable={this.state.putRole}
              editable // cho phép chỉnh sửa
              // cardDraggable
              onLaneScroll={this.handleLoadMore}
              onLaneAdd={this.onLaneAdd} // hàm thêm mới trạng thái
              onCardDelete={this.onCardDelete} //
              handleDragEnd={(cardId, targetLaneId, sourceLaneId) => {
                if (String(targetLaneId) !== String(sourceLaneId)) {
                  const x = this.props.kanbanPlugin.allItems.find(n => String(n._id) === String(cardId));
                  const codelanes = JSON.parse(localStorage.getItem(this.props.statusType ? this.props.statusType : 'crmStatus')).find(
                    x => x.code === this.props.code,
                  ).data;
                  x.kanbanStatus = sourceLaneId;
                  switch (this.props.code) {
                    case 'ST18':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST01':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST02':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST05':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST07':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST15':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      }
                      return this.props.callBack(`kanban-dragndrop-${nameCallBack}`, x);
                      break;
                    case 'ST19':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        console.log();
                        return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      }
                      return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      break;
                    case 'ST250':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        console.log();
                        return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      }
                      return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      break;
                    case 'ST251':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        console.log();
                        return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      }
                      return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      break;
                    case 'ST03':
                      if (
                        (targetLaneId === codelanes.find(x => x.code === 3)._id && codelanes.find(x => x._id === sourceLaneId).code !== 3) ||
                        (codelanes.find(x => x._id === targetLaneId).code === 4 && codelanes.find(x => x._id === sourceLaneId).code !== 4)
                      ) {
                        x.notChangeDrag = true;
                        return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      }
                      return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                      break;
                    default:
                      return this.props.callBack(nameCallBack ? `kanban-dragndrop-${nameCallBack}` : `kanban-dragndrop`, x);
                  }
                }
              }}
              laneStyle={{ borderLeft: '1px dashed rgba(255,255,255,.55)', whiteSpace: 'none !important', with: '3rem' }}
              hideCardDeleteIcon
              components={{
                Card: pro => (
                  <CardKanban
                    {...pro}
                    customClick={this.handleClickEvent}
                    role={this.props.dashboardPage.role.roles}
                    code={code}
                    callBack={(type, cardId) => {
                      if (this.props.isOpenSinglePage) {
                        if (type === 'openDialogBos' && !this.state.putRole) return;
                        const current = this.state.items.find(n => String(n._id) === String(cardId));
                        if (current) {
                          this.props.callBack(type, current);
                        }
                      }
                    }}
                  />
                ),
                LaneHeader: pro => {
                  return (
                    <CustomLaneHeader
                      {...pro}
                      // handleAddBo={this.props.handleAddBo}
                      history={this.props.history}
                      onClick={() => this.props.callBack('quick-add')}
                      postRole={this.state.postRole}
                      count={this.props.kanbanPlugin.count}
                    />
                  );
                },
                AddCardLink: () => null,
              }}
              onCardClick={this.onCardClick}
            />
          ) : (
            ''
          )}
          {this.state.openCollectionDialog ? (
            <HOCCollectionDialog
              callBack={this.callBack}
              handleClose={() => {
                this.setState({ openCollectionDialog: false });
              }}
              dialogTitle=""
              editData={this.state.editData}
              isEditting
              viewConfig={this.state.viewConfig}
              open={this.state.openCollectionDialog}
              history={this.props.history}
              arrKanban={this.state.kanbanStatus.lanes ? this.state.kanbanStatus.lanes : []}
            />
          ) : (
            ''
          )}
        </div>
      </Paper>
    );
  }

  callApi = props => {
    if (props.path.indexOf('?') > -1) {
      const startDay = moment(this.state.month)
        .startOf('month')
        .format();
      const endDay = moment(this.state.month)
        .endOf('month')
        .format();
      const filterDay = {
        filter: {
          createdAt: {
            $gte: `${startDay}`,
            $lte: `${endDay}`,
          },
        },
      };

      let newFilter = filterDay;
      if (this.props.filter) newFilter = this.props.filter;
      this.props.onGetItems({
        filter: newFilter,
        path: props.path,
        paging: this.state.paging,
        typeof: this.props.code,
      });
    } else {
      const startDay = moment(this.state.month)
        .startOf('month')
        .format();
      const endDay = moment(this.state.month)
        .endOf('month')
        .format();
      const filterDay = {
        filter: {
          createdAt: {
            $gte: `${startDay}`,
            $lte: `${endDay}`,
          },
        },
      };
      let newFilter = filterDay;
      let filter = { ...this.props.filter };
      if (this.state.search) filter.$or = this.props.filters.map(i => ({ [i]: { $regex: this.state.search, $options: 'gi' } }));
      if (this.props.filter) newFilter = { filter };
      this.props.onGetItems({
        filter: newFilter,
        path: props.path,
        paging: this.state.paging,
        typeof: this.props.code,
      });
    }
  };

  handleClickEvent = (id, e) => {
    if (this.props.params) {
      this.props.history.push(`${this.props.params}/${id}?${e}`);
    }
  };

  handleChangeMonth = e => {
    this.setState({ month: e });
    if (this.props.path) {
      if (this.props.path.indexOf('?') > -1) {
        const startDay = moment(e)
          .startOf('month')
          .format();
        const endDay = moment(e)
          .endOf('month')
          .format();
        const filterDay = {
          filter: {
            createdAt: {
              $gte: `${startDay}`,
              $lte: `${endDay}`,
            },
          },
        };
        let newFilter = filterDay;
        if (this.props.filter) newFilter = this.props.filter;
        this.props.onGetItems({
          filter: newFilter,
          path: this.props.path,
          paging: this.state.paging,
        });
      } else {
        const startDay = moment(e)
          .startOf('month')
          .format();
        const endDay = moment(e)
          .endOf('month')
          .format();
        const filterDay = {
          filter: {
            createdAt: {
              $gte: `${startDay}`,
              $lte: `${endDay}`,
            },
          },
        };
        this.props.onGetItems({
          filter: filterDay,
          path: this.props.path,
          paging: this.state.paging,
        });
      }
    }
  };
}
Kanban.defaultProps = {
  filters: ['name'],
};

Kanban.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kanbanPlugin: makeSelectKanbanPlugin(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetItems: body => {
      dispatch(getItemsAct(body));
    },
    onLoadMore: body => {
      dispatch(getMoreItemsAct(body));
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kanbanPlugin', reducer });
const withSaga = injectSaga({ key: 'kanbanPlugin', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(Kanban);
