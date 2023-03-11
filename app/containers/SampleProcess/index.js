/**
 *
 * SampleProcess
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSampleProcess from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { sampleProcesskColumns } from '../../variable';
import { API_SAMPLE_PROCESS } from '../../config/urlConfig';
import { getTemplate } from './actions';
import { Typography, Paper } from '../../components/LifetekUi';
import messages from './messages';
/* eslint-disable react/prefer-stateless-function */
export class SampleProcess extends React.Component {
  componentDidMount() {
    this.props.getTemplate();
  }

  mapFunction = item => {
    // console.log(item, 'ite');
    return {
      ...item,
      updateBy: item.originItem.updateBy ? item.originItem.updateBy.name : '',
    };
  };

  render() {
    const { sampleProcess, intl } = this.props;
    const { templates } = sampleProcess;

    return (
      <div>
        <Helmet>
          <title>{intl.formatMessage(messages.quytrinhmau || { id: 'quytrinhmau', defaultMessage: 'quytrinhmau' })}</title>
          <meta name="description" content="Description of TaskPage" />
        </Helmet>
        <Paper className="py-3" style={{ height: '100%' }}>
          {/* <Typography color="primary" variant="subtitle1">
            {intl.formatMessage(messages.lotrinhmau || { id: 'lotrinhmau', defaultMessage: 'lotrinhmau' })}: {templates.count}
          </Typography> */}

          <ListPage
            height="700px"
            // settingBar={[this.addItem()]}
            // columns={sampleProcesskColumns}
            // disableConfig
            disableImport
            code="TemplateTask"
            // client
            apiUrl={API_SAMPLE_PROCESS}
            filterEdit={true}
            mapFunction={this.mapFunction}
          />
        </Paper>
      </div>
    );
  }
}

// SampleProcess.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  sampleProcess: makeSelectSampleProcess(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTemplate: () => {
      dispatch(getTemplate());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sampleProcess', reducer });
const withSaga = injectSaga({ key: 'sampleProcess', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(SampleProcess);
