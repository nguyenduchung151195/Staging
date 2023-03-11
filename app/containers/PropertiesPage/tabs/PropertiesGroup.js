/**
 *
 * ListOfProperties
 *
 */

import React from 'react';
// import {
//   Grid,
//   DragDropProvider,
//   Table,
//   TableHeaderRow,
//   TableColumnReordering,
//   TableColumnResizing,
//   TableFixedColumns,
// } from '@devexpress/dx-react-grid-material-ui';
// import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
// import { compose } from 'redux';
// import styled from 'styled-components';
// import injectSaga from 'utils/injectSaga';
// import injectReducer from 'utils/injectReducer';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableColumnResizing,
  TableFixedColumns,
  PagingPanel,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import { clientId } from 'variable';
import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import {
  Typography,
  Fab,
  Paper,
  TablePagination,
  Button,
  TextField,
  // Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import GridUI from '@material-ui/core/Grid';
import { Edit, Delete } from '@material-ui/icons';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import makeSelectPropertiesPage from '../../containers/PropertiesPage/selectors';
// import reducer from '../../containers/PropertiesPage/reducer';
// import saga from '../../containers/PropertiesPage/saga';
// import { SortingState, IntegratedSorting, IntegratedFiltering } from '@devexpress/dx-react-grid';
// import styled from 'styled-components';
// import { resetNoti, deletePropertieAct } from '../../containers/PropertiesPage/actions';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
const columns = [
  // { name: 'code', title: 'Mã' },
  { name: 'name', title: 'Tên' },
  { name: 'order', title: 'Thứ tự' },
  { name: 'describe', title: 'Mô tả' },
  { name: 'actions', title: 'Thao tác' },
];
const CustomGroup = props => (
  <div>
    {console.log(props,'props')}
    {/* {props.rowData.group.map(employee => (
      <div>{employee.name}</div>
    ))} */}
  </div>
);
class PropertiesGroup extends React.Component {
  state = {
    rowsPerPage: 20, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    onDelete: false,
    // id: '',
    content: '',
    currentDelete: null,
    search: '',

    pageSizes: [10, 25, 50],
    pageSize: 10,
    currentPage: 0
  };

  componentDidUpdate() {
    const { successDelete } = this.props;
    if (successDelete) {
      this.props.changeCountAuto(1);
      this.handleClose();
    }
  }

  render() {
    const { classes, propertiesGroup } = this.props;
    // console.log(this.props.propertiesList);
    const {  pageSizes, pageSize, currentPage} = this.state;
    // eslint-disable-next-line array-callback-return
    const newRows = propertiesGroup.map(item => {
      const newItem = Object.assign({}, item);
      // newItem.group = <CustomGroup rowData={item} />;
      
      return {
        ...newItem,
        // activity: (
        //   <Checkbox
        //     checked={item.approveType}
        //     color="primary"
        //     inputProps={{
        //       'aria-label': 'secondary checkbox',
        //     }}
        //   />
        // ),
        actions: (
          <div>
            <Fab size="small" title="Chỉnh sửa" style={{ marginLeft: 10 }} color="primary" onClick={() => this.handleEdit(item.id)}>
               {' '}
               <Edit color="default" />
             </Fab>
             &nbsp;
             <Fab
            size="small"
            title="Xóa mục đã chọn"
            style={{ marginLeft: 10, color: '#fff' }}
            color="secondary"
            onClick={() => this.handleClickOpen(item)}
          >
            <Delete />
          </Fab>
          </div>
        ),
      };
    });
    // const { rowsPerPage, page } = this.state;
    // /* eslint-disable */
    // const temp = propertiesGroup.filter(i => {
    //   // console.log(i)
    //   if (this.state.search === '') return true;
    //   if (i.name.indexOf(this.state.search) > -1 || i.describe.indexOf(this.state.search) > -1) return true;
    // });
    // /* eslint-enable */
    // this.state.content = temp.slice(rowsPerPage * page, rowsPerPage * page + rowsPerPage).map(item => (
    //   <TableRow key={item.id}>
    //     {/* <TableCell>{item.code}</TableCell> */}
    //     <TableCell>{item.name}</TableCell>
    //     <TableCell>{item.order}</TableCell>
    //     <TableCell>{item.describe}</TableCell>
    //     <TableCell>
    //       <Fab size="small" title="Chỉnh sửa" style={{ marginLeft: 10 }} color="primary" onClick={() => this.handleEdit(item.id)}>
    //         {' '}
    //         <Edit color="default" />
    //       </Fab>
    //       &nbsp;
    //       <Fab
    //         size="small"
    //         title="Xóa mục đã chọn"
    //         style={{ marginLeft: 10, color: '#fff' }}
    //         color="secondary"
    //         onClick={() => this.handleClickOpen(item)}
    //       >
    //         <Delete />
    //       </Fab>
    //     </TableCell>
    //   </TableRow>
    // ));
    // console.log(this.state.content)
    return (
      <div style={{ width: '100%' }}>
        <Typography variant="h6">Danh sách nhóm thuộc tính</Typography>
        <GridUI item md={12} container style={{ height: 40, marginBottom: 10 }}>
          <GridUI item md={3} container justify="flex-start">
            <TextField
              className={classes.search}
              label="Tìm kiếm"
              margin="dense"
              variant="outlined"
              value={this.state.search}
              name="search"
              onChange={this.handleChange}
            />
          </GridUI>
          <GridUI item md={8} container justify="flex-end">
            <Button component={Link} to="/setting/properties/propertiesGroup/0" style={{ height: 40 }} variant="outlined" color="primary">
              Thêm mới
            </Button>
          </GridUI>
        </GridUI>
        <Paper>
          <Grid rows={newRows} columns={columns} filter={{ $or: [{ clientId }, { clientId: 'ALL' }] }}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={page =>this.setState({currentPage: page})}
            pageSize={pageSize}
            onPageSizeChange={size =>this.setState({pageSize: size})}
          />
            {/* <PagingState defaultCurrentPage={0} pageSize={10} /> */}
            <IntegratedPaging />
            <Table />
            <TableHeaderRow />
            <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={pageSizes} />
            </Grid>
        </Paper>
        {/* <Table>
          <TableHead>
            <TableRow> */}
              {/* <TableCell>Mã</TableCell> */}
              {/* <TableCell>Tên</TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.state.content ? this.state.content : ''}</TableBody>
        </Table> */}
        {/* <Grid rows={newRows} columns={newColumns} style={{ width: '100%' }}>
          <SortingState defaultSorting={[{ columnName: 'title', direction: 'asc' }]} />
          <DragDropProvider />
          <IntegratedFiltering />
          <IntegratedSorting />
          <Table />
          {columnOrder.length !== 0 ? <TableColumnReordering defaultOrder={columnOrder} /> : null}
          {columnOrder.length !== 0 ? <TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths} /> : null}

          <TableHeaderRow showSortingControls />
          <SortingState defaultSorting={[{ columnName: 'name', direction: 'asc' }]} />
          <SearchState defaultValue="" />
          <TableFixedColumns rightColumns={this.state.rightColumns} />
        </Grid> */}
        {/* <TablePagination
          rowsPerPageOptions={[15, 30, 50]}
          component="div"
          count={propertiesGroup.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Trang trước',
          }}
          nextIconButtonProps={{
            'aria-label': 'Trang tiếp theo',
          }}
          labelRowsPerPage="Hiển thị: "
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        /> */}
        {/* <FormattedMessage {...messages.header} /> */}
        <Dialog
          open={this.state.onDelete}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={() => this.handleDeletes()}>
              XÓA
            </Button>
            <Button variant="outlined" onClick={this.handleClose} color="secondary" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  // Thay đổi số dòng trên một trang
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleEdit = id => {
    if (id !== 0) this.props.history.push(`/setting/properties/propertiesGroup/${id}`);
  };

  handleDeletes = () => {
    const { currentDelete } = this.state;
    // console.log(currentDelete);
    this.props.onDeletePropertiesGroup(currentDelete);
  };

  handleClickOpen = item => {
    this.setState({ onDelete: true, currentDelete: item });
  };

  handleClose = () => {
    this.setState({ onDelete: false });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
}

PropertiesGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default PropertiesGroup;
