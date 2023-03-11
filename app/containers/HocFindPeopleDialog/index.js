/**
 *
 * HocFindPeopleDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  Avatar,
  TextField as TextFieldUI,
} from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';

import makeSelectHocFindPeopleDialog from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getAllPeopleAction } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class HocFindPeopleDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { people: [], selectedPeople: {}, originPeople: [], searchStr: '' };
  }

  componentDidMount() {
    this.setState({ people: [] });
    const filter = {
      skip: 0,
      limit: 10,
    };
    this.props.onGetPeople({ type: this.props.peopleType, filter });
  }

  componentWillUpdate(props) {
    const { hocFindPeopleDialog } = props;
    // console.log(hocFindPeopleDialog.people);
    if (hocFindPeopleDialog.people !== undefined) {
      this.state.people = hocFindPeopleDialog.people;
      this.state.originPeople = hocFindPeopleDialog.people;
    }
  }

  // shouldComponentUpdate(props) {

  //   return true;
  // }

  getDialogTitle = peopleType => {
    let title = '';
    switch (peopleType) {
      case 'customer':
        title = 'Khách hàng';
        break;
      case 'responsibilityPerson':
        title = 'Người chịu trách nhiệm';
        break;
      case 'supervisor':
        title = 'Người giám sát';
        break;
      default:
        break;
    }
    return title;
  };

  onRequestSearch = searchStr => {
    // const { originPeople } = this.state;
    // if (searchStr === '') {
    //   this.setState({ people: originPeople });
    // } else {
    //   const searchResults = [];
    //   originPeople.forEach(element => {
    //     if (element.name.toLowerCase().includes(searchStr.toLowerCase())) {
    //       searchResults.push(element);
    //     }
    //   });
    //   this.setState({ people: [] }, () => {
    //     this.setState({ people: searchResults });
    //   });
    // }
    if (searchStr) {
      const filter = {
        filter: {
          $or: [
            {
              name: {
                $regex: searchStr,
              },
            },
            {
              email: {
                $regex: searchStr,
              },
            },
            {
              phoneNumber: {
                $regex: searchStr,
              },
            },
          ],
        },
        skip: 0,
        limit: 10,
      };
      this.props.onGetPeople({ type: this.props.peopleType, filter });
    } else {
      const filter = {
        skip: 0,
        limit: 10,
      };
      this.props.onGetPeople({ type: this.props.peopleType, filter });
    }
  };

  // handleOnScoll = e => {
  //   console.log(e);
  // };

  render() {
    const { people } = this.state;
    return (
      <div>
        <Dialog
          onClose={() => {
            this.props.callBack('close-find-people-dialog');
          }}
          open={this.props.isOpeningFindPeopleDialog}
          aria-labelledby="form-dialog-title"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="form-dialog-title">{this.getDialogTitle(this.props.peopleType)}</DialogTitle>
          <DialogContent>
            {/* <SearchBar
              onCancelSearch={() => {
                const { originPeople } = this.state;
                this.setState({ people: originPeople, searchStr: '' });
              }}
              onChange={newValue => {
                this.onRequestSearch(newValue);
                this.setState({ searchStr: newValue });
              }}
              // onChange={newValue => {
              //   this.setState({ searchStr: newValue });
              // }}
              style={{
                margin: '0 auto',
              }}
              onRequestSearch={() => {
                this.onRequestSearch(this.state.searchStr);
              }}
              value={this.state.searchStr}
            /> */}
            {this.props.peopleType === 'customer' ? (
              <div
                className="text-right my-2"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <TextFieldUI
                    id="outlined-multiline-flexible"
                    label="Tìm kiếm"
                    multiline
                    onChange={e => {
                      this.setState({ searchStr: e.target.value });
                    }}
                  />

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.onRequestSearch.bind(this, this.state.searchStr)}
                    style={{
                      marginTop: '0.7rem',
                      marginLeft: '1rem',
                    }}
                  >
                    Tìm kiếm
                  </Button>
                </div>

                <div>
                  {/* <Link to="/crm/customers/add"> */}
                  <Button
                    color="primary"
                    variant="outlined"
                    style={{
                      marginTop: '0.7rem',
                      marginLeft: '1rem',
                    }}
                    onClick={this.props.handleOpenAddCustomer}
                  >
                    Thêm khách hàng
                  </Button>
                  {/* </Link> */}
                </div>
              </div>
            ) : null}

            <List>
              <Grid container>
                {people.map(option => (
                  <Grid key={option.name} item sm={4}>
                    <ListItem
                      button
                      onClick={() => {
                        this.setState({ selectedPeople: option });
                      }}
                      onDoubleClick={() => {
                        this.props.callBack('select-people', this.state.selectedPeople, this.props.peopleType);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={`${option.avatar}?allowDefault=true`} alt="Remy Sharp">
                          <i className="far fa-user" />
                        </Avatar>
                      </ListItemAvatar>
                      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: 10 }}>
                        <ListItemText primary={option.name} />
                        <span>{option.email}</span>
                        <span>{option.phoneNumber}</span>
                      </div>
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="primary"
              className="border-primary text-primary"
              onClick={() => {
                this.props.callBack('select-people', this.state.selectedPeople, this.props.peopleType);
              }}
            >
              LƯU
            </Button>
            <Button
              variant="outlined"
              className="border-danger text-danger"
              color="secondary"
              onClick={() => {
                this.props.callBack('close-find-people-dialog', null);
              }}
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

HocFindPeopleDialog.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  hocFindPeopleDialog: makeSelectHocFindPeopleDialog(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetPeople: peopleType => {
      dispatch(getAllPeopleAction(peopleType));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'hocFindPeopleDialog', reducer });
const withSaga = injectSaga({ key: 'hocFindPeopleDialog', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HocFindPeopleDialog);
