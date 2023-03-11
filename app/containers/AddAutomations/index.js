/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
// import content from './content';
import CustomInputField from 'components/Input/CustomInputField';
import { Grid, List, ListItem, MenuItem, Button, withStyles, Typography, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Dialog, TextField, Paper, FileUpload } from 'components/LifetekUi';
import { Edit, Close } from '@material-ui/icons';
// import CKEditor from '@ckeditor/ckeditor5-react';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import ReactBpmn from 'react-bpmn';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { extraFields, clientId } from '../../variable';
import messages from './messages';

import makeSelectAddTemplatePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Bpmn } from '@arkondata/react-bpmn-modeler/lib/components';
import CustomAppBar from 'components/CustomAppBar';

import { injectIntl } from 'react-intl';
import './style.css';
import { handleChangeTitle, getTemplate, handleChange, postTemplate, putTemplate, mergeData, getAllTemplate } from './actions';
const newsTypes = [{ title: 'Tin tức', value: 'tin-tuc' }, { title: 'Topic', value: 'topic' }, { title: 'Album', value: 'album' }];
const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};

/* eslint-disable react/prefer-stateless-function */
export function AddTemplatePage(props) {
  const modelerRef = useRef();
  const bpmnModelerRef = useRef(
    <Bpmn
      modelerRef={modelerRef}
      bpmnStringFile={''}
      modelerInnerHeight={window.innerHeight}
      onElementChange={xml => alert(xml)}
      onTaskTarget={event => alert(JSON.stringify(event.detail))}
      onTaskLabelTarget={event => {
        // Set an element programmatically
        const modeling = modelerRef.current.get('modeling');
        const elementRegistry = modelerRef.current.get('elementRegistry');
        const element = elementRegistry.get(event.detail.id);
        modeling.updateProperties(element, { name: 'Example task label' });
      }}
      onError={error => alert(error)}
    />,
  );
  const saveTemplate = () => {
    console.log('hghghg');
  };
  const id = props.match.params.id;

  return (
    <>
      {/* <AppBar className="HeaderAppBarAutomation">
        <Toolbar>
          <IconButton className="BTNAutomation" color="inherit" variant="contained" onClick={() => props.history.goBack()} aria-label="Close">
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
            {id === 'add'
              ? `${props.intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới Wrokflow' })}`
              : `${props.intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Wrokflow' })}`}
          </Typography>
          <Button variant="outlined" color="inherit">
            onClick={thissaveTemplate}
            {props.intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar>
      </AppBar> */}
      <CustomAppBar
        title={
          id === 'add'
            ? `${props.intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới Wrokflow' })}`
            : `${props.intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Wrokflow' })}`
        }
        onGoBack={() => props.history.goBack()}
        onSubmit={() => saveTemplate()}
      />
      {bpmnModelerRef.current}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleChangeTitle: e => dispatch(handleChangeTitle(e.target.value)),
    getTemplate: (id, getTem) => dispatch(getTemplate(id, getTem)),
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    postTemplate: data => dispatch(postTemplate(data)),
    putTemplate: (id, data) => dispatch(putTemplate(id, data)),
    mergeData: data => dispatch(mergeData(data)),
    getAllTemplate: () => dispatch(getAllTemplate()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addAutomations', reducer });
const withSaga = injectSaga({ key: 'addAutomations', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddTemplatePage);
