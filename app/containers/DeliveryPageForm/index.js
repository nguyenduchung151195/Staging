import React, { useEffect } from 'react';
import saga from './saga';
import { getDelivery, getDeliverySuccess, getDeliveryFailed } from './action';
import { compose } from 'redux';
import { connect } from 'react-redux';
import reducer from './reducer';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { useDispatch } from 'react-redux'
import { API_DELIVERY } from '../../config/urlConfig';
import axios from 'axios';
import CustomAppBar from 'components/CustomAppBar';

function DeliveryPageForm(props) {
        useEffect(() => {
                const token = localStorage.getItem('token');
                axios
                        .get(`${API_DELIVERY}/${props.match.params.id}`, {
                                headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                },
                        })
                        .then((data) => {
                                console.log(11115, data);
                        })

        }, [])
        const hanhdleClick = () => {
                props && props.history && props.history.goBack();
        };
        return (
                <div>
                        <CustomAppBar
                                title={
                                        'Chi tiết giao nhận'
                                }
                                onGoBack={hanhdleClick}
                                // onSubmit={this.onSubmit}
                                disableAdd={true}
                        // onScan={this.handleScan}
                        />
                        Chưa có thiết kế
                </div>
        );
}
// const mapStateToProps = createStructuredSelector({
//         deliveryPage: makeSelectDeliveryPage(),
//         profile: makeSelectEditProfilePage(),
// });

function mapDispatchToProps(dispatch) {
        return {
                dispatch,
                onGetDelivery: id => {
                        dispatch(getDelivery(id));
                },
        };
}

const withConnect = connect(
        // mapStateToProps,
        null,
        mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'deliveryPage', reducer });
const withSaga = injectSaga({ key: 'deliveryPage', saga });

export default compose(withConnect, withReducer, withSaga)(DeliveryPageForm);