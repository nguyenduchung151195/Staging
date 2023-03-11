/* eslint-disable no-alert */
/**
 *
 * AddNewCrmCollection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import classNames from 'classnames';
import {
  Paper,
  withStyles,
  Typography,
  Button,
  Grid as GridUI,
  Checkbox,
  Fab,
  Drawer,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Settings, Edit, Delete, ViewList, CheckBox, TableChart, CloudDownload, DeleteForever, Timeline, Add, Close } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import { injectIntl } from 'react-intl';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { Helmet } from 'react-helmet';
import { SortingState, IntegratedSorting, IntegratedFiltering } from '@devexpress/dx-react-grid';
import { Grid, DragDropProvider, Table, TableHeaderRow, TableColumnReordering } from '@devexpress/dx-react-grid-material-ui';

import PositionedSnackbar from 'components/PositionedSnackbar';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import styles from './styles';

import makeSelectAddNewCrmCollection from './selectors';
import { changeSnackbar } from '../Dashboard/actions';
import saga from './saga';
import { getAllCollection, postAddNewCollection, defaultAction, putUpdateCollection, deleteCollection } from './actions';
import CrmCollectionDetail from '../../components/CrmCollectionDetail';

let allId = [];
import messages from './messages';
/* eslint-disable react/prefer-stateless-function */
export class AddNewCrmCollection extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      isEditting: false,
      openDetail: false,
      anchorEl: false,
      columns: [
        { name: 'name', title: 'Tên' },
        { name: 'code', title: 'Mã' },
        { name: 'status', title: 'Trạng thái' },
        { name: 'plugins', title: 'Plugins' },
        { name: 'action', title: 'Thao tác', width: 100 },
      ],
      tableColumnExtensions: [{ columnName: 'codePro', width: 100 }],
      rows: [],
      columnOrder: ['name', 'code', 'status', 'plugins', 'action'],
      selected: [],
      selectAll: false,
      openSnackbar: false,
      message: { content: '', type: null },
      dialogData: undefined,
      showLoading: false,
    };

    this.changeColumnOrder = this.changeColumnOrder.bind(this);
  }

  componentDidMount() {
    this.props.getCollection();
  }

  componentWillUpdate(props) {
    const { addNewCrmCollection } = props;
    const { allCRMCollection, callAPIStatus, notiMessage } = addNewCrmCollection;
    this.state.rows = allCRMCollection || [];

    if (callAPIStatus === 1) {
      this.props.enqueueSnackbar(notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
      this.state.openDetail = false;
      this.state.showLoading = false;
      // this.setState({ openDetail: false });
    }
    if (callAPIStatus === 0) {
      this.props.enqueueSnackbar(notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
      this.state.openDetail = true;
      this.state.showLoading = false;
    }
    // if (callAPIStatus === -1) {

    this.props.defaultReset();
    // }
  }

  render() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { rows, columns, tableColumnExtensions, columnOrder, openSnackbar, message, anchorEl } = this.state;
    const { classes, intl } = this.props;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    console.log('jijijiji', this.props);
    allId = [];
    const newsRows = rows.slice().map(row => {
      const statusList = [
        <p style={{ color: 'green', fontWeight: 'bold' }}>Hoạt động</p>,
        <p style={{ color: 'orange', fontWeight: 'bold' }}>Khóa</p>,
      ];
      const status = statusList[row.status - 1];
      const action = (
        <div>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              this.setState({ dialogData: Object.assign({}, row), openDetail: true, isEditting: true });
            }}
          >
            <Edit />
          </Fab>
          <Fab
            className="mx-2"
            size="small"
            color="secondary"
            onClick={() => {
              // eslint-disable-next-line no-restricted-globals
              const r = confirm('Bạn có muốn xóa module này?');
              if (r) {
                this.props.deleteCollection(row.code);
              }
              // console.log(row);
            }}
          >
            <Delete />
          </Fab>
        </div>
      );
      /* eslint-disable no-underscore-dangle, indent */

      const name = (
        <Link to={`/crm/module/${row.code}`}>
          <Button color="primary" style={{ textTransform: 'none' }}>
            {row.name}
          </Button>
        </Link>
      );
      // const plugins = row.plugins.join();
      const plugins = row.plugins.map(e => e.name).join(', ');
      allId.push(row._id);
      return { ...row, action, status, name, plugins };
    });

    const TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        // eslint-disable-next-line no-alert
        // onClick={() => this.handleClickRow(row.id)}
        style={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#81DAF5',
          },
        }}
      />
    );
    return (
      <div>
        <AppBar className={classes.HearderappBarAddNewCRM}>
          <Toolbar>
            <IconButton
              // className={id !== 'add' ? '' : ''}
              className={classes.BTNADDNEWCRM}
              color="inherit"
              variant="contained"
              onClick={() => {
                this.props.history.goBack();
              }}
              aria-label="Close"
            >
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {addStock === 'add'
                ? `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới' })}`
                : `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              // onClick={() => {
              //   this.submitBtn.current.click();
              // }}
            >
              {intl && intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
          </Toolbar>
        </AppBar>
        {/* <Paper className={classes.breadcrumbs}>
          <Helmet>
            <title>Thêm mới trường CRM</title>
            <meta name="description" content="Description of AddUserPage" />
          </Helmet>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Typography color="textPrimary">CRM</Typography>
          </Breadcrumbs>
        </Paper> */}
        <Paper className={classes.breadcrumbs}>
          <GridUI container>
            <GridUI item md={10}>
              {this.state.selected.length !== 0 ? (
                <Fab color="secondary" style={{ marginLeft: 29 }} className={classes.button} size="small">
                  <Delete onClick={() => this.handleDeleteItem()} />
                </Fab>
              ) : (
                <div style={{ width: 40, height: 40, float: 'left', marginLeft: 29 }} className={classes.button} />
              )}
              <TextField className={classes.search} label="Tìm kiếm" margin="dense" />
            </GridUI>
            <GridUI item md={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Fab
                color="primary"
                className={classNames(classes.button, classes.success)}
                size="small"
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={() => {
                  this.setState({ dialogData: { code: '', collectionSchema: {}, name: '', plugins: [] }, openDetail: true, isEditting: false });
                }}
              >
                <Add />
              </Fab>
              &nbsp;
              <Fab
                color="primary"
                className={classNames(classes.button, classes.success)}
                size="small"
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <ViewList />
              </Fab>
              <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                <MenuItem className={classes.menuItem}>
                  <ListItemIcon className={classes.icon} onClick={this.handleClose}>
                    <CheckBox />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Kiểm tra hàng tồn kho" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <TableChart />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Khởi tạo tệp Excel" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <CloudDownload />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Xuất tệp Excel" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <DeleteForever />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Xóa mặt hàng cũ" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Lịch sử chuyển kho" />
                </MenuItem>
              </Menu>
              <Fab className={classes.button} color="primary" onClick={() => this.handleDisplay(true)} size="small">
                <Settings />
              </Fab>
            </GridUI>
          </GridUI>

          <Grid rows={newsRows} columns={columns} style={{ width: '100%' }}>
            <DragDropProvider />
            <SortingState defaultSorting={[{ columnName: 'title', direction: 'asc' }]} />

            <IntegratedFiltering />
            <IntegratedSorting />
            <Table columnExtensions={tableColumnExtensions} rowComponent={TableRow} />
            <TableColumnReordering order={columnOrder} onOrderChange={this.changeColumnOrder} />
            <TableHeaderRow showSortingControls />
          </Grid>
        </Paper>

        {openSnackbar ? <PositionedSnackbar message={message} onClose={this.onCloseSnackbar} /> : null}
        <Drawer anchor="right" open={this.state.openDetail} onClose={this.toggleDrawer} className={classes.detailProduct}>
          <div tabIndex={0} role="button" className={classes.detailProduct}>
            <CrmCollectionDetail
              listModule={rows}
              showLoading={this.state.showLoading}
              isEditting={this.state.isEditting}
              data={this.state.dialogData}
              onClose={this.toggleDrawer}
              callBack={this.callBack}
              onChangeSnackbar={this.props.onChangeSnackbar}
            />
          </div>
        </Drawer>
      </div>
    );
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawer = () => {
    const { openDetail } = this.state;
    this.setState({
      openDetail: !openDetail,
    });
  };

  addCheckbox = id => <Checkbox checked={this.state.selected.includes(id)} color="primary" value={id} onClick={() => this.handleSelect(id)} />;

  addCheckboxAll = () => <Checkbox checked={this.state.selectAll} onClick={() => this.handleSelectAll()} />;

  changeColumnOrder(newOrder) {
    this.setState({ columnOrder: newOrder });
  }

  handleSelect(id) {
    const { selected } = this.state;
    const index = this.state.selected.findIndex(i => i === id);
    if (index === -1) selected.push(id);
    else selected.splice(index, 1);
    this.setState({ selected });
  }

  handleSelectAll() {
    const selectAll = !this.state.selectAll;
    if (this.state.selectAll) {
      this.setState({ selected: [], selectAll });
    } else {
      this.setState({ selected: allId, selectAll });
    }
  }

  handleChange(e) {
    const { columns } = this.state;
    const currentColumn = columns.find(column => column.name === e.target.name);
    currentColumn.title = e.target.value;
    this.setState({ columns });
  }

  onCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  callSnackbar = () => {
    this.setState({ openSnackbar: true });
  };

  handleDeleteItem() {
    if (this.state.selected.length !== 0) {
      const { rows, selected } = this.state;
      const newRows = rows.filter(row => !selected.includes(row.id));
      this.setState({ rows: newRows, selected: [], message: { content: 'Deleted succesfully', type: 'success' } });
      this.callSnackbar();
    }
  }

  callBack = (cmd, data, param) => {
    switch (cmd) {
      case 'add-collection':
        // console.log(data);
        this.props.postAddCollection(data);
        this.setState({ showLoading: true });
        break;
      case 'update-collection':
        // console.log(this.state.rows[this.state.rows.findIndex(d => d.code === data.code)]);
        this.props.updateCollection(data, param);
        this.setState({ showLoading: true });

        break;
      default:
        break;
    }
  };
}

AddNewCrmCollection.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addNewCrmCollection: makeSelectAddNewCrmCollection(),
});

function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
    getCollection: () => {
      dispatch(getAllCollection());
    },
    postAddCollection: body => {
      dispatch(postAddNewCollection(body));
    },
    deleteCollection: body => {
      dispatch(deleteCollection(body));
    },
    updateCollection: (body, oldCollection) => {
      dispatch(putUpdateCollection(body, oldCollection));
    },
    defaultReset: () => {
      dispatch(defaultAction());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addNewCrmCollection', reducer });
const withSaga = injectSaga({ key: 'addNewCrmCollection', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddNewCrmCollection);
