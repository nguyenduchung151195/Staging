/**
 *
 * TemplateTypePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { templateTypeColumns, clientId } from 'variable';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { Note } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTemplateTypePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTemplateTypes, deleteTemplateTypes } from './actions';
import ListAsync from '../../components/List';
import { API_TEMPLATE } from '../../config/urlConfig';
import '../../components/List/CustomCSS.css';

/* eslint-disable react/prefer-stateless-function */
export class TemplateTypePage extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Loại biểu mẫu</title>
          <meta name="description" content="Description of TemplateTypePage" />
        </Helmet>
        <ListAsync
          disableImport
          code="TemplateType"
          apiUrl={`${API_TEMPLATE}/category`}
          // filter={{ $or: [{ clientId }, { clientId: 'ALL' }] }}
          filter={{ clientId: { $in: [clientId, 'ALL'] } }}
          settingBar={[
            <Tooltip title="Danh sách biểu mẫu">
              <NavLink to="/setting/DynamicForm" className="CustomIconListTask">
                {' '}
                <Note />
              </NavLink>
            </Tooltip>,
          ]}
        />
      </div>
    );
  }
}

// TemplateTypePage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  templateTypePage: makeSelectTemplateTypePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTemplateTypes: () => dispatch(getTemplateTypes()),
    deleteTemplateTypes: templates => dispatch(deleteTemplateTypes(templates)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'templateTypePage', reducer });
const withSaga = injectSaga({ key: 'templateTypePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TemplateTypePage);
