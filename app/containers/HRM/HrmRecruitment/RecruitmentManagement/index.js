/**
 *
 * RecruitmentManagement
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Add } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, SwipeableDrawer } from '../../../../../../components/LifetekUi';
import makeSelectRecruitmentManagement from './selectors';
import { API_HRM_RECRUITMENT } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddRecruitment from './components/AddRecruitment';
import { createRecruitmen, updateRecruitmen, deleteRecruitmen } from './actions';

/* eslint-disable react/prefer-stateless-function */
function RecruitmentManagement(props) {
  const { recruitmentManagement, onCreateRecruitmen, onUpdateRecruitmen } = props;
  const { hrmEmployeeId, createRecruitmenSuccess, updateRecruitmenSuccess, deleteRecruitmenSuccess } = recruitmentManagement;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecruitmen, setSelectedRecruitmen] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (createRecruitmenSuccess === true) {
      setReload(true);
      handleCloseRecruitmenDialog();
    }
    if (createRecruitmenSuccess === false) {

    }
  }, [createRecruitmenSuccess]);

  const handleSave = useCallback(
    (data) => {
      const { hrmEmployeeId, ...restData } = data;
      if (!hrmEmployeeId) {
        onCreateRecruitmen(data);
      } else {
        onUpdateRecruitmen(hrmEmployeeId, restData);
      }
    },
    [],
  );
  
  const handleOpenRecruitmenDialog = () => {
    setOpenDialog(true);
  }

  const handleCloseRecruitmenDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenRecruitmenDialog}>
      Open Menu
    </Add>
  );

  return (
    <div>
      <Typography
        component="p"
        style={{
          fontWeight: 550,
          fontSize: '18px',
          marginLeft: 40,
          marginTop: 40,
        }}
      >
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình diễn biến lương
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography>
      <Paper>
        <ListPage code="RecruitmenDevelopments" parentCode="hrm" onEdit={row => {
          setSelectedRecruitmen(row);
          setOpenDialog(true);
        }} reload={reload} apiUrl={API_HRM_RECRUITMENT} settingBar={[addItem()]} disableAdd />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseRecruitmenDialog} open={openDialog} width={window.innerWidth - 260}>
      <div 
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddRecruitmen hrmEmployeeId={hrmEmployeeId} code="RecruitmenDevelopments" recruitment={selectedRecruitmen} onSave={handleSave} onClose={handleCloseRecruitmenDialog} />
        </div>
      </SwipeableDrawer>
    </div>
  );

}

RecruitmentManagement.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruitmentManagement: makeSelectRecruitmentManagement(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateRecruitmen: data => dispatch(createRecruitmen(data)),
    onUpdateRecruitmen: (hrmEmployeeId, data) => dispatch(updateRecruitmen(hrmEmployeeId, data)),
    onDeleteRecruitmen: hrmEmployeeId => dispatch(deleteRecruitmen(hrmEmployeeId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recruitmentManagement', reducer });
const withSaga = injectSaga({ key: 'recruitmentManagement', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(RecruitmentManagement);
