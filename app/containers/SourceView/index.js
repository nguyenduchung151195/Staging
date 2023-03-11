import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Tree from 'react-d3-tree';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSourcePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTradingAct, getPOAct } from './actions';
import request from '../../utils/request';
import { APP_URL, API_COMMON } from '../../config/urlConfig';
import { Dialog } from '../../components/LifetekUi'
import ViewContent from '../../components/ViewContent/Loadable'
// import messages from './messages';
function getTree(data, mainData) {
  data.forEach((item) => {
    const child = mainData.filter((element) => {
      // console.log(item._id == element.parent);
      if (element.parentId) {
        if (item._id === element.parentId) {
          return true;
        }
      }
      return false;
    });
    getTree(child, mainData);
    // eslint-disable-next-line no-param-reassign
    item.children = child;
  });
  // eslint-disable-next-line no-param-reassign
  data = data.filter((item) => !item.parentId);
  return data;
}
function SourceView(props) {
  const { model, objectId, module, idItem } = props;
  // console.log(props)
  // console.log(model, objectId ,'model, objectId ')
  const [treeData, setTreeData] = useState([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [editDialog, setEditDialog] = useState(false);
  function handleCloseEdit(){
    setEditDialog(false)
  }
  function handleOpenEdit(){
    setEditDialog(true)
  }

  useEffect(() => {
    if (model && objectId) {
      request(`${APP_URL}/api/source-log?model=${model}&objectId=${objectId}`, { method: 'GET' }).then(data => {
        data = data.map(item => ({ ...item, name: item.objectName }));
        setTreeData(getTree(data, data));
      }).catch(console.log);
    }
  }, [model, objectId]);
  return (
    <>
    <Dialog title="Nguồn gốc công việc" open={props.open} onClose={props.onClose}>
      <div id="treeWrapper" style={{ width: '100%', height: '45em' }} >
        {treeData && treeData.length > 0 ? (
          <Tree onClick={handleOpenEdit} data={treeData} translate={{ x: 15, y: 250 }} scaleExtent={{ min: 0.5, max: 2 }} />
        ) : null}
      </div>
    </Dialog>
    <Dialog
    title="Xem chi tiết"
    // onSave={this.handleSaveData}
    onClose={handleCloseEdit}
    open={editDialog}
    dialogAction={false}
  >
    {treeData && treeData.length > 0 ? (
          <ViewContent  code={module} idItem={treeData[0].objectId} dataInfo={dataInfo} objectId={objectId}/>
        ) : null}
  </Dialog>
  </>

  );
}

SourceView.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sourceView: makeSelectSourcePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetTrading: data => {
      dispatch(getTradingAct(data));
    },
    onGetPO: data => {
      dispatch(getPOAct(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sourceView', reducer });
const withSaga = injectSaga({ key: 'sourceView', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SourceView);
