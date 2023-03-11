/**
 *
 * TemplatePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { templateColumns, clientId } from 'variable';
import { NavLink } from 'react-router-dom';
import { Description } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTemplatePage from './selectors';
import reducer from './reducer';
import { Paper } from '../../components/LifetekUi';
import saga from './saga';
import { getTemplates, deleteTemplates, mergeData } from './actions';
import ListAsync from '../../components/List';
import { API_TEMPLATE_LIST, API_TEMPLATE } from '../../config/urlConfig';
import '../../components/List/CustomCSS.css';
/* eslint-disable react/prefer-stateless-function */
export class TemplatePage extends React.Component {
  componentDidMount() {
    this.props.getTemplates();
  }
  customFunction(data) {
    const newData = data.map(it =>
    ({
      ...it,
      createdAt: moment(it['createdAt']).format('DD/MM/YYYY'),
    }),
    );
    return newData;
  }
  render() {
    return (
      <div>
        <Paper>
          <ListAsync
            filterEdit={true}
            // columns={templateColumns}
            code="DynamicForm"
            parentCode="setting"
            apiUrl={API_TEMPLATE_LIST}
            deleteUrl={API_TEMPLATE}
            height="700px"
            // client
            // filter={{ $or: [{ clientId }, { clientId: 'ALL' }] }}
            filter={{ clientId: { $in: [clientId, 'ALL'] } }}


            importExport="DynamicForm"
            disableImport
            disableExport
            // customFunction={this.customFunction}
            settingBar={[
              <Tooltip title="Loại biểu mẫu">
                <NavLink to="/setting/template_type" className="CustomIconListTask">
                  {' '}
                  <Description />
                </NavLink>
              </Tooltip>,
            ]}
          />
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  templatePage: makeSelectTemplatePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTemplates: () => dispatch(getTemplates()),
    deleteTemplates: templates => dispatch(deleteTemplates(templates)),
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'templatePage', reducer });
const withSaga = injectSaga({ key: 'templatePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TemplatePage);
