/**
 *
 * RecruitmentWave
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
import makeSelectRecruitmentWave from './selectors';
import { API_HRM_RECRUITMEN } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddRecruitment from './components/AddRecruitment';
import { createRecruitment, updateRecruitment, deleteRecruitment } from './actions';

/* eslint-disable react/prefer-stateless-function */
function RecruitmentWave(props) {
  const { recruitmentWave, onCreateRecruitment, onUpdateRecruitment } = props;
  const { hrmEmployeeId, createRecruitmentSuccess, updateRecruitmentSuccess, deleteRecruitmentSuccess } = recruitmentWave;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecruitment, setSelectedRecruitment] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(
    () => {
      if (createRecruitmentSuccess === true) {
        setReload(true);
        handleCloseRecruitmentDialog();
      }
      if (createRecruitmentSuccess === false) {
      }
    },
    [createRecruitmentSuccess],
  );

  const handleSave = useCallback(data => {
    const { hrmEmployeeId, ...restData } = data;
    if (!hrmEmployeeId) {
      onCreateRecruitment(data);
    } else {
      onUpdateRecruitment(hrmEmployeeId, restData);
    }
  }, []);

  const handleOpenRecruitmentDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseRecruitmentDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenRecruitmentDialog}>
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
        <ListPage
          code="RecruitmentDevelopments"
          parentCode="hrm"
          onEdit={row => {
            setSelectedRecruitment(row);
            setOpenDialog(true);
          }}
          reload={reload}
          apiUrl={API_HRM_RECRUITMEN}
          settingBar={[addItem()]}
          disableAdd
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseRecruitmentDialog} open={openDialog} width={window.innerWidth - 260}>
        <div
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddRecruitment
            hrmEmployeeId={hrmEmployeeId}
            code="RecruitmentDevelopments"
            recruitment={selectedRecruitment}
            onSave={handleSave}
            onClose={handleCloseRecruitmentDialog}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

RecruitmentWave.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruitmentWave: makeSelectRecruitmentWave(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateRecruitment: data => dispatch(createRecruitment(data)),
    onUpdateRecruitment: (hrmEmployeeId, data) => dispatch(updateRecruitment(hrmEmployeeId, data)),
    onDeleteRecruitment: hrmEmployeeId => dispatch(deleteRecruitment(hrmEmployeeId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recruitmentWave', reducer });
const withSaga = injectSaga({ key: 'recruitmentWave', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(RecruitmentWave);
