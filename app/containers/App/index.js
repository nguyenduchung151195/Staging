/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
// import indexRouters from 'routes';
import Pages from 'containers/Pages';

import Dashboard from '../Dashboard';
import 'assets/scss/material-dashboard-pro-react.css';
// const action = key => (
//   <Fragment>
//     <Button
//       onClick={() => {
//         alert(`I belong to snackbar with key ${key}`);
//       }}
//     >
//       {'Alert'}
//     </Button>
//     <Button
//       onClick={() => {
//         props.closeSnackbar(key);
//       }}
//     >
//       {'Dismiss'}
//     </Button>
//   </Fragment>
// );
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
    };
  }

  handleAuthencation(user) {
    if (user === true) {
      // this.setState({
      //   auth: false,
      // });
    }
  }

  isLogin = () => this.state.auth;

  componentWillMount() {
    if (localStorage.getItem('token'))
      this.setState({
        auth: true,
      });
    // this.props.onGetViewConfig();
  }

  // componentWillReceiveProps(props) {
  //   console.log(props)
  //   if (this.props !== props) {
  //     if (localStorage.getItem('token')) this.state.auth = true;
  //     else this.state.auth = false;
  //   }
  // }
  componentWillUpdate() {
    if (localStorage.getItem('token') !== null) this.state.auth = true;
    else this.state.auth = false;
  }

  render() {
    const { auth } = this.state;

    return (
      <SnackbarProvider maxSnack={3}>
        <Switch>
          {auth ? (
            <Route path="/" render={props => <Dashboard {...props} />} />
          ) : (
            <Route path="/" render={props => <Pages {...props} authentication={user => this.handleAuthencation(user)} />} />
          )}
        </Switch>
      </SnackbarProvider>
    );
  }
}
// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//     onGetViewConfig: () => {
//       dispatch(fetchAllViewConfigsAction());
//     },
//   };
// }
// const withConnect = connect(
//   null,
//   mapDispatchToProps,
// );
// // const withReducer = injectReducer({ key: 'appReducer', reducer });
// const withSaga = injectSaga({ key: 'appReducer', saga });
// export default compose(
//   // withReducer,
//   withSaga,
//   withConnect,
// )(App);
