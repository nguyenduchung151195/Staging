// /**
//  *
//  * App.js
//  *
//  * This component is the skeleton around the actual pages, and should only
//  * contain code that should be seen on all pages. (e.g. navigation bar)
//  *
//  */

// import React from 'react';
// import { Switch, Route } from 'react-router-dom';

// // import HomePage from 'containers/HomePage/Loadable';
// // import UserPage from 'containers/UserPage';
// // import Table from 'containers/Table';
// import NotFoundPage from 'containers/NotFoundPage/Loadable';
// // import LoginPage from 'containers/LoginPage';
// import ListOfDepartmentPage from '../ListOfDepartmentPage';
// // import PublicRoute from '../../components/PublicRoute';
// import PrivateRoute from '../../components/PrivateRoute';
// import MainLayout from '../../components/MainLayout';
// import GlobalStyle from '../../global-styles';
// import AddUserPage from '../AddUserPage/Loadable';
// // import EmptyLayout from '../../components/EmptyLayout';
// import UsersPage from '../UsersPage';
// import RoleGroupPage from '../RoleGroupPage';
// import SystemConfigPage from '../SystemConfigPage';
// import CrmConfigPage from '../CrmConfigPage';
// import BusinessOpportunities from '../BusinessOpportunitiesPage';
// export default function App() {
//   return (
//     <div>
//       <Switch>
//         {/* <PublicRoute path="/login" layout={EmptyLayout} component={LoginPage} /> */}
//         {/* CRM router */}
//         <PrivateRoute exact path="/crm" layout={MainLayout} component={BusinessOpportunities} />
//         <PrivateRoute path="/crm/ConfigCRM" layout={MainLayout} component={CrmConfigPage} />

//         {/* Setting router */}
//         <PrivateRoute exact path="/setting" layout={MainLayout} component={SystemConfigPage} />
//         <PrivateRoute path="/setting/Employee/add" layout={MainLayout} component={AddUserPage} />
//         <PrivateRoute path="/setting/Employee" layout={MainLayout} component={UsersPage} />
//         <PrivateRoute path="/setting/department" layout={MainLayout} component={ListOfDepartmentPage} />
//         <PrivateRoute path="/setting/roleGroup" layout={MainLayout} component={RoleGroupPage} />
//         <PrivateRoute path="/setting/general" layout={MainLayout} component={SystemConfigPage} />

//         <PrivateRoute path="/" layout={MainLayout} component={UsersPage} />
//         {/* <Route path="/" component={HomePage} /> */}

//         <Route component={NotFoundPage} />
//       </Switch>
//       <GlobalStyle />
//     </div>
//   );
// }
