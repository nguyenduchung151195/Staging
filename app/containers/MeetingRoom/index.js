/**
 *
 * MeetingRoom
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListPage from 'components/List';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { FormControl, Checkbox, Tabs, Tab } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Dialog, Paper, TextField, Typography, SwipeableDrawer } from '../../components/LifetekUi';
import { API_MEETING } from '../../config/urlConfig';
import makeSelectMeetingRoom from './selectors';
import reducer from './reducer';
import { mergeData, postData, getCurrent, putData, getData } from './actions';
import saga from './saga';
import AddMeetingSchedule from '../AddMeetingSchedule/Loadable';
import { meetingRoomColumns } from '../../variable';
import CalendarComponent from '../../components/Calendar';
/* eslint-disable react/prefer-stateless-function */
export class MeetingRoom extends React.Component {
  componentDidMount() {
    this.props.getData();
  }

  mapFunctionCalendar = item => {
    // console.log(item && item.originItem && item.originItem.utilities, 'item.originItem');
    let utilities = (item && item.originItem && item.originItem.utilities) || [];
    utilities = utilities.join(' - ');
    // let utilitiesName =[]
    // utilities.map((el)=>{
    //   utilitiesName.push(<p>{el}</p>)
    // })

    return {
      ...item,
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.handleChangeRoom(item._id)}>
          {item.name}
        </button>
      ),
      utilities: utilities,
    };
  };
  handleChangeRoom = id => {
    this.props.mergeData({ openDrawer: true, id });
    this.props.getCurrent(id);
  };

  addItemRoom = () => (
    <Add
      // style={{ color: '#2196f3 ' }}
      onClick={() =>
        this.props.mergeData({
          openDrawer: true,
          name: '',
          code: '',
          address: '',
          acreage: 0,
          utilities: [],
        })
      }
    >
      Open Menu
    </Add>
  );

  handleChange = (e, item) => {
    const { meetingRoom } = this.props;
    const newPlan = [...meetingRoom.utilities];
    let newUtilities = [];
    const check = meetingRoom.utilities.map(i => i).includes(item);
    if (check) newUtilities = newPlan.filter(i => i !== item);
    else newUtilities = newPlan.concat(item);
    this.props.mergeData({ utilities: newUtilities });
  };

  render() {
    const { meetingRoom } = this.props;
    const newMeeting = meetingRoom.meetings.filter(elm => (elm.roomMetting ? elm.roomMetting._id === meetingRoom.id : ''));

    return (
      <div>
        <Paper style={{ position: 'relative' }}>
          <ListPage
            reload={meetingRoom.reload}
            settingBar={[this.addItemRoom()]}
            disableAdd
            // disableEdit
            onEdit={item => {
              this.handleChangeRoom(item._id);
            }}
            // parentCode="Calendar"
            // columns={meetingRoomColumns}
            apiUrl={`${API_MEETING}/room`}
            mapFunction={this.mapFunctionCalendar}
            code="MettingRoom"
          />
        </Paper>

        <Dialog
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawer: false, id: 'add' })}
          open={meetingRoom.openDrawer}
          // title=" Thông tin nhóm đánh giá"
          onSave={this.onSaveRoom}
        >
          <div>
            <Typography align="center" variant="h6">
              Quản lý phòng họp
            </Typography>
            {meetingRoom.id !== 'add' ? (
              <Tabs value={meetingRoom.tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
                <Tab value={0} label="Thông tin chi tiết" />
                <Tab value={1} label="Lịch phòng họp" />
              </Tabs>
            ) : null}
            {meetingRoom.tab === 0 ? (
              <div style={{ marginTop: 20 }}>
                <TextField
                  value={meetingRoom.code}
                  fullWidth
                  onChange={e => this.props.mergeData({ code: e.target.value })}
                  label="Mã phòng họp"
                  InputLabelProps={{ shrink: true }}
                  error={meetingRoom.code === ''}
                  helperText={meetingRoom.code === '' ? 'Không được bỏ trống' : null}
                />
                <TextField
                  value={meetingRoom.name}
                  fullWidth
                  onChange={e => this.props.mergeData({ name: e.target.value })}
                  label="Tên phòng họp"
                  InputLabelProps={{ shrink: true }}
                  error={meetingRoom.name === ''}
                  helperText={meetingRoom.name === '' ? 'Không được bỏ trống' : null}
                />
                <TextField
                  value={meetingRoom.address}
                  fullWidth
                  onChange={e => this.props.mergeData({ address: e.target.value })}
                  label="Địa chỉ"
                  InputLabelProps={{ shrink: true }}
                  error={meetingRoom.address === ''}
                  helperText={meetingRoom.address === '' ? 'Không được bỏ trống' : null}
                />

                <TextField
                  value={meetingRoom.acreage}
                  fullWidth
                  onChange={e => this.props.mergeData({ acreage: e.target.value })}
                  label="Diện tích"
                  InputLabelProps={{ shrink: true }}
                  type="number"
                />

                <FormControl component="fieldset">
                  <Typography variant="subtitle2"> Tiện ích</Typography>
                  {meetingRoom.utilitiesArr.map(item => (
                    <div style={{ display: 'flex' }}>
                      <Checkbox
                        onChange={e => this.handleChange(e, item)}
                        checked={meetingRoom.utilities.map(i => i).includes(item)}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                      <Typography>{item}</Typography>{' '}
                    </div>
                  ))}
                </FormControl>
              </div>
            ) : null}
            {meetingRoom.tab === 1 ? (
              <div>
                {' '}
                <CalendarComponent meetings={newMeeting} handleEdit={this.handleEditMeeting} handleAdd />{' '}
              </div>
            ) : null}
          </div>
        </Dialog>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawerMeeting: false, id: 'idCalendar' })}
          open={meetingRoom.openDrawerMeeting}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            <AddMeetingSchedule id={meetingRoom.idCalendar} callback={this.callbackMeeting} />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  onSaveRoom = () => {
    const { meetingRoom } = this.props;
    if (meetingRoom.name === '' || meetingRoom.address === '' || meetingRoom.code === '') return;
    const data = {
      code: meetingRoom.code,
      address: meetingRoom.address,
      acreage: meetingRoom.acreage,
      utilities: meetingRoom.utilities,
      name: meetingRoom.name,
    };
    if (meetingRoom.id === 'add') this.props.postData(data);
    else this.props.putData(meetingRoom.id, data);
    this.props.mergeData({ openDrawer: false, reload: meetingRoom.reload + 1, id: 'add' });
  };

  handleEditMeeting = arg => {
    this.props.mergeData({ openDrawerMeeting: true, idCalendar: arg._id });
  };

  callbackMeeting = () => {
    const { meetingRoom } = this.props;
    this.props.mergeData({ openDrawerMeeting: false, reload: meetingRoom.reload + 1 });
  };
}

MeetingRoom.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  meetingRoom: makeSelectMeetingRoom(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: data => dispatch(postData(data)),
    getCurrent: id => dispatch(getCurrent(id)),
    putData: (id, data) => dispatch(putData(id, data)),
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'meetingRoom', reducer });
const withSaga = injectSaga({ key: 'meetingRoom', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MeetingRoom);
