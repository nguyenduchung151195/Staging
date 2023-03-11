import React from 'react';
import { BrowserRouter as Route } from 'react-router-dom';
import ContractsPage from '../ContractPage/index';
// eslint-disable-next-line react/prefer-stateless-function
export class Routes extends React.Component {
  render() {
    return (
      <div>
        <Route exact path="/contracts" component={ContractsPage} />
        {/* <Route exact path="/home" component={Homepage} />
      <Route exact path="/about" component={AboutPage} />
      <Route exact path="/admin" component={Backend} />
      <Route exact path="/admin/home" component={Dashboard} />
      <Route exact path="/users" component={UserPage} /> */}
      </div>
    );
  }
}
export default Routes;
