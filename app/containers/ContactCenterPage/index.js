/**
 *
 * ContactCenterPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Grid,
  Paper,
  withStyles,
  Menu,
  MenuItem,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@material-ui/core';
import { Message, Phone, ViewModule, QuestionAnswer, ChromeReaderMode, Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectContactCenterPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
// import messages from './messages';
import facebookIcon from '../../assets/img/icons/facebook.svg';
import zaloIcon from '../../assets/img/icons/zalo.svg';
import { getContactCenterAction } from './actions';
// import { TableContainer } from '../TableContainer';

/* eslint-disable react/prefer-stateless-function */
export class ContactCenterPage extends React.Component {
  state = {
    menuForm: null,
    open: false,
  };

  componentDidMount() {
    this.props.onGetContactCenter();
  }

  handleClick = event => {
    this.setState({ menuForm: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ menuForm: null });
  };

  handleCloseDialog = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { menuForm } = this.state;
    const { classes, contactCenterPage } = this.props;
    const contactCenters = contactCenterPage.contactCenters || [];
    return (
      <div className={classes.root}>
        {/* <TableContainer></TableContainer> */}
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <Paper className={classes.paper} onClick={this.handleCloseDialog}>
              <Message className={classes.icon} style={{ color: 'green' }} />
              <span className={classes.textBox}>Thư</span>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper} onClick={this.handleCloseDialog}>
              <Phone className={classes.icon} style={{ color: '#2196f3' }} />
              <span className={classes.textBox}>Telephone</span>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper} onClick={this.handleCloseDialog}>
              <QuestionAnswer className={classes.icon} style={{ color: '#2196f3' }} />
              <span className={classes.textBox}>Trò chuyện trực tiếp</span>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper} aria-owns={menuForm ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleClick}>
              <ChromeReaderMode className={classes.icon} style={{ color: '#673ab7' }} />
              <span className={classes.textBox}>Biểu mẫu</span>
            </Paper>
            <Menu id="simple-menu" anchorEl={menuForm} open={Boolean(menuForm)} onClose={this.handleClose}>
              <MenuItem onClick={this.handleClose} style={{ borderBottom: '1px solid grey' }}>
                <Link to="/ContactCenter/add">
                  <Add /> Thêm mới biểu mẫu mới
                </Link>
              </MenuItem>
              {contactCenters.map(item => (
                <Link to={`/ContactCenter/${item._id}`}>
                  <MenuItem key={item._id} onClick={this.handleClose}>
                    {item.name}
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Grid>
          <Grid item xs={3}>
            <Paper onClick={this.handleCloseDialog} className={classes.paper}>
              <ViewModule className={classes.icon} style={{ color: '#2196f3' }} />
              <span className={classes.textBox}>Skype,Slack...</span>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper onClick={this.handleCloseDialog} className={classes.paper}>
              <img src={facebookIcon} alt="facebook" style={{ height: 45 }} />
              <span className={classes.textBox}>Facebook</span>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper onClick={this.handleCloseDialog} className={classes.paper}>
              <img src={zaloIcon} alt="zalo" style={{ height: 45 }} />
              <span className={classes.textBox}>Zalo</span>
            </Paper>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.open}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Vui lòng liên hệ nhà phát triển để được mở chức năng này.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ContactCenterPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contactCenterPage: makeSelectContactCenterPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetContactCenter: () => {
      dispatch(getContactCenterAction());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'contactCenterPage', reducer });
const withSaga = injectSaga({ key: 'contactCenterPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(ContactCenterPage);
