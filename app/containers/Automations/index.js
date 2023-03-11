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
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTemplatePage from './selectors';
import reducer from './reducer';
import { Paper } from '../../components/LifetekUi';
import saga from './saga';
import { getTemplates, deleteTemplates, mergeData } from './actions';
import ListAsync from '../../components/List';
import { API_NEWS_FEED } from '../../config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
export class TemplatePage extends React.Component {
  componentDidMount() {
    this.props.getTemplates();
  }

  render() {
    return (
      <div>
        <Paper>
          <ListAsync
            height="700px"
            // columns={templateColumns}
            code="NewsFeed"
            parentCode="setting"
            apiUrl={API_NEWS_FEED}
            importExport="dynamicForms"
            disableImport
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

const withReducer = injectReducer({ key: 'automations', reducer });
const withSaga = injectSaga({ key: 'automations', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TemplatePage);
