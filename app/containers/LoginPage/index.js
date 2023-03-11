/**
 *
 * LoginPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import clsx from 'clsx';

import { InputAdornment, Button, withStyles, FormHelperText, CircularProgress } from '@material-ui/core';
// material-ui components

// material-ui-icons
import { Email, Lock } from '@material-ui/icons';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import LoginCard from 'components/Cards/LoginCard';
import CustomInput from 'components/CustomInput/CustomInput';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import loginPageStyle from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle';
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loginAction, resetNoti } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import Snackbar from '../../components/Snackbar';
/* eslint-disable react/prefer-stateless-function */
export class LoginPage extends React.Component {
  state = {
    username: '',
    password: '',
    usernameEmpty: false,
    passwordEmpty: false,
    loginWrong: false,
    clickLogin: false,
    loading: false,
    social : { variant: '', message: '', open: false },
  };

  handleSubmit = e => {
    e.preventDefault();
    let { username, password } = this.state;
    username = username.trim();
    password = password.trim();
    this.setState({ clickLogin: true });
    if (username === '' || password === '') {
      if (username === '') this.setState({ usernameEmpty: true });
      if (password === '') this.setState({ passwordEmpty: true });
    } else {
      this.props.onLogin({ username, password });
      this.setState({ loading: true });
    }
  };
  handleClick = () => {
    this.setState({ social: {variant: 'error', message: 'Cần nâng cấp phiên bản để thực hiện tính năng', open: true} })
  }
  onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      event.preventDefault();
      let { username, password } = this.state;
      username = username.trim();
      password = password.trim();
      this.setState({ clickLogin: true });
      if (username === '' || password === '') {
        if (username === '') this.setState({ usernameEmpty: true });
        if (password === '') this.setState({ passwordEmpty: true });
      } else this.props.onLogin({ username, password });
    }
  };

  componentWillMount() {
    const tk = localStorage.getItem('token');
    if (typeof tk === 'string') {
      this.props.authentication(true);
      this.props.history.push('/');
      // console.log(this.props);
    }
  }

  componentWillUpdate(props) {
    const { history } = props;
    if (this.props !== props) {
      if (props.loginPage.success && localStorage.getItem('token')) {
        this.props.authentication(true);
        history.push('/');
      } else if (props.loginPage.error) {
        this.state.loginWrong = true;
        this.state.clickLogin = false;
        this.state.loading = false;
      }
    }
  }

  componentDidUpdate() {
    this.props.onResetNoti();
  }

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    const buttonClassname = clsx({
      [classes.buttonSuccess]: false,
    });
    // const loading = loginPage.loading;
    return (
      <div className={classes.content}>
        {loading && <LoadingIndicator />}
        <div className={classes.container}>
        <Snackbar message={this.state.social.message}
          onClose={() => this.setState({social: { variant: 'error', message: 'Cần nâng cấp phiên bản để thực hiện tính năng', open: false }})}
          variant={this.state.social.variant} open={this.state.social.open} />
          <GridContainer justify="center">
            <ItemGrid xs={12} sm={6} md={4}>
              <form onSubmit={this.handleSubmit}>
                {/* eslint-disable */}
                <LoginCard
                  customCardClass={classes[this.state.cardAnimaton]}
                  headerColor="blue"
                  cardTitle="Đăng nhập"
                  // cardSubtitle="Or Be Classical"
                  footerAlign="center"
                  footer={
                    // <Button onClick={this.handleSubmit} style={{ marginTop: 20 }} variant="contained" color="primary" wd size="lg">
                    //   Đăng nhập
                    // </Button>
                    <div className={classes.wrapper}>
                      <Button
                        onClick={this.handleSubmit}
                        variant="outlined"
                        color="primary"
                        className={buttonClassname}
                        disabled={loading}
                      >
                        Đăng nhập
                      </Button>
                      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                  }
                  socials={['fab fa-facebook-square', 'fab fa-twitter', 'fab fa-google-plus'].map((prop, key) => (
                    <Button justicon key={key + 1} customClass={classes.customButtonClass} onClick = {this.handleClick}>
                      <i className={prop} />
                    </Button>
                  ))}
                  content={
                    <div>
                      <CustomInput
                        labelText="Tên đăng nhập"
                        id="name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          value: this.state.email,

                          name: 'username',
                          onChange: e => this.handleChange(e),
                          onKeyDown: this.onKeyDown,
                        }}
                      />
                      {this.state.usernameEmpty || (this.state.usernameEmpty && this.state.passwordEmpty) ? (
                        <FormHelperText style={{ marginTop: -5, color: 'red' }}>Vui lòng nhập tên đăng nhập!</FormHelperText>
                      ) : null}
                      <CustomInput
                        labelText="Mật khẩu"
                        id="password"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Lock className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          value: this.state.password,
                          name: 'password',
                          type: 'password',
                          onChange: e => this.handleChange(e),
                          onKeyDown: this.onKeyDown,
                        }}
                      />
                      {this.state.passwordEmpty || (this.state.usernameEmpty && this.state.passwordEmpty) ? (
                        <FormHelperText style={{ marginTop: -5, color: 'red' }}>Vui lòng nhập mật khẩu!</FormHelperText>
                      ) : null}
                      {this.state.loginWrong ? (
                        <FormHelperText style={{ textAlign: 'center', fontSize: 14, marginTop: 10, marginBottom: 10, color: 'red' }}>
                          Tên đăng nhập hoặc mật khẩu không đúng!
                        </FormHelperText>
                      ) : null}
                    </div>
                  }
                />
                {/* eslint-enable */}
              </form>
            </ItemGrid>
          </GridContainer>
        </div>
      </div>
    );
  }

  handleChange = e => {
    if (this.state.passwordEmpty || this.state.usernameEmpty || this.state.loginWrong || this.state.clickLogin) {
      if (e.target.name === 'username') {
        this.setState({ usernameEmpty: false, clickLogin: false, loginWrong: false });
      }
      if (e.target.name === 'password') {
        this.setState({ passwordEmpty: false, clickLogin: false, loginWrong: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };
}

LoginPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  loginPage: PropTypes.object.isRequired,
  onLogin: PropTypes.func,
  history: PropTypes.object.isRequired,
  authentication: PropTypes.func.isRequired,
  onResetNoti: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLogin: body => dispatch(loginAction(body)),
    onResetNoti: () => dispatch(resetNoti()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(loginPageStyle),
)(LoginPage);
