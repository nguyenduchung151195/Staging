/**
 *
 * ContactCenterFormPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Close, Edit, Delete, Menu, CloudDownload } from '@material-ui/icons';
import {
  withStyles,
  Dialog,
  AppBar,
  Toolbar,
  DialogTitle,
  Slide,
  Paper,
  Typography,
  IconButton,
  DialogContent,
  TextField,
  Grid,
  Button,
  InputAdornment,
  Tabs,
  Tab,
} from '@material-ui/core';

import AsyncSelect from 'react-select/async';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sortableContainer } from 'react-sortable-hoc';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import axios from 'axios';
import makeSelectContactCenterFormPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import RightContactCenter from '../../components/RightContactCenter';
import { API_USERS, APP_URL } from '../../config/urlConfig';
import DialogSettingFiled from '../../components/DialogSettingFiled';
import { addContactCenterAction, getContactCenterByIdAction, getEmployeeByIdAction, editContactCenterAction } from './actions';
function Transition(props) {
  return <Slide direction="left" {...props} />;
}
const promiseOptions = (searchString, putBack) => {
  const param = {
    limit: '10',
    skip: '0',
  };
  if (searchString !== '') {
    param.filter = {
      name: searchString,
    };
  }
  const token = localStorage.getItem('token');
  axios
    .get(`${API_USERS}?filter%5Bname%5D%5B%24regex%5D=${searchString}&filter%5Bname%5D%5B%24options%5D=gi`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const convertedData = [];
      response.data.data.map(item => convertedData.push({ ...item, ...{ label: item.name, value: item._id } }));
      putBack(convertedData);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
};
const SortableContainer = sortableContainer(({ children }) => <ul style={{ width: '100%', padding: 0 }}>{children}</ul>);
/* eslint-disable react/prefer-stateless-function */
export class ContactCenterFormPage extends React.Component {
  state = {
    fields: [],
    name: '',
    description: '',
    selectedFields: [],
    people: [],
    background: {},
    tab: 0,
    openDialog: false,
    currentFields: {},
    type: 'add', // add or edit
  };

  componentWillMount() {
    try {
      const businessOpportunitiesFields = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'BusinessOpportunities');
      const customerFields = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Customer');
      let allFields = [];
      if (businessOpportunitiesFields) {
        const formattedBusinessOpportunitiesFields = businessOpportunitiesFields.listDisplay.type.fields.type.columns.map(item => ({
          name: `BusinessOpportunities.${item.name}`,
          title: item.title,
          description: '',
          isRequire: item.isRequire,
          ref: 'BusinessOpportunities',
          selected: false,
          priority: 0,
          type: String(item.type).toLocaleLowerCase(),
        }));
        allFields = allFields.concat(formattedBusinessOpportunitiesFields);
      }

      if (customerFields) {
        const formattedCustomersFields = customerFields.listDisplay.type.fields.type.columns.map(item => ({
          name: `Customer.${item.name}`,
          title: item.title,
          description: '',
          isRequire: item.isRequire,
          ref: 'Customer',
          selected: false,
          priority: 0,
          type: String(item.type).toLocaleLowerCase(),
        }));
        allFields = allFields.concat(formattedCustomersFields);
      }
      this.state.fields = allFields;
    } catch (error) {}
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.onGetContactCenter(id);
      this.state.type = 'edit';
    } else {
      this.state.type = 'add';
    }
  }

  componentWillUpdate(props) {
    const { contactCenterFormPage } = props;
    const { type } = this.state;
    const contactCenter = contactCenterFormPage.contactCenter;
    const employees = contactCenterFormPage.employees;

    if (this.props.contactCenterFormPage.contactCenter !== contactCenter) {
      if (contactCenter && type === 'edit') {
        const { fields } = this.state;
        const peopleIds = contactCenter.people.map(item => item.employeeId);
        this.props.onGetEmployeeByIds({
          filter: {
            _id: {
              $in: peopleIds,
            },
          },
        });
        this.state.name = contactCenter.name;
        this.state.description = contactCenter.description;
        this.state.people = contactCenter.people;
        this.state.selectedFields = contactCenter.fields;
        contactCenter.fields.forEach(item => {
          const cuContactCenter = fields.find(element => element.name === item.name);
          cuContactCenter.selected = true;
        });
        this.state.fields = fields;
      }
    }

    if (type === 'edit' && this.props.contactCenterFormPage.employees !== employees) {
      this.people = employees.map(item => ({
        ...item,
        label: item.name,
        value: item._id,
      }));
    }
  }

  handleSelect = name => {
    const { fields } = this.state;
    let { selectedFields } = this.state;
    const index = fields.findIndex(item => item.name === name);
    if (index > -1) {
      if (fields[index].selected !== true) {
        fields[index].priority = selectedFields.length;
        selectedFields.push(fields[index]);
      } else {
        const selectIndex = selectedFields.findIndex(item => item.name === name);
        if (selectIndex > -1) {
          selectedFields.splice(selectIndex, 1);
        }
        selectedFields = selectedFields.map((item, index) => ({
          ...item,
          priority: index,
        }));
      }
      fields[index].selected = !fields[index].selected;
    }

    this.setState({
      selectedFields,
      fields,
    });
  };

  onDragEnd = result => {
    const { destination, source } = result;
    if (destination && source) {
      let { selectedFields } = this.state;
      selectedFields = selectedFields.map(item => {
        if (source.index < destination.index) {
          if (item.priority <= destination.index) {
            return {
              ...item,
              priority: item.priority - 1,
            };
          }
        } else if (item.priority >= destination.index) {
          return {
            ...item,
            priority: item.priority + 1,
          };
        }
        return item;
      });

      selectedFields[source.index].priority = destination.index;
      // console.log(selectedFields);
      selectedFields = selectedFields.sort((a, b) => a.priority - b.priority);
      this.setState({ selectedFields });
    }
  };

  handleChangeSelect = selectedOption => {
    this.people = selectedOption;
    if (this.people !== null) {
      this.setState({
        people: selectedOption.map(item => ({
          name: item.name,
          employeeId: item._id,
        })),
      });
    } else {
      this.setState({
        people: [],
      });
    }
  };

  handleRemove = name => {
    let { selectedFields } = this.state;
    const { fields } = this.state;
    const selectIndex = selectedFields.findIndex(item => item.name === name);
    if (selectIndex > -1) {
      selectedFields.splice(selectIndex, 1);
      selectedFields = selectedFields.map((item, index) => ({
        ...item,
        priority: index,
      }));
      const cuField = fields.find(item => item.name === name);
      cuField.selected = !cuField.selected;
      this.setState({ selectedFields, fields });
    }
  };

  handleChangeTab = (event, tab) => {
    this.setState({ tab });
  };

  handleSettingField = name => {
    const { selectedFields } = this.state;
    const currentFields = selectedFields.find(item => item.name === name);
    if (currentFields) {
      this.setState({ openDialog: true, currentFields });
    }
  };

  handleChangeSettingField = field => {
    const { selectedFields } = this.state;
    let currentFields = selectedFields.find(item => item.name === field.name);
    currentFields = field;
    if (currentFields) {
      this.setState({ openDialog: false, currentFields });
    }
  };

  handleSelectDialogSetting = () => {
    this.setState({ openDialog: false });
  };

  handleAddContactCenter = () => {
    const { selectedFields, background, people, name, description, type } = this.state;

    if (type === 'add') {
      const body = {
        fields: selectedFields,
        background,
        people,
        name,
        description,
      };
      this.props.onAddContactCenter(body);
    } else {
      const { contactCenterFormPage } = this.props;
      const contactCenter = contactCenterFormPage.contactCenter;
      if (contactCenter) {
        const body = {
          ...contactCenter,
          fields: selectedFields,
          background,
          people,
          name,
          description,
        };
        this.props.onEditContactCenter(body);
      }
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { classes, contactCenterFormPage } = this.props;
    const { name, description, fields, selectedFields, background, tab, currentFields, openDialog, type } = this.state;
    const contactCenter = contactCenterFormPage.contactCenter;
    const getListStyle = isDraggingOver => ({
      background: isDraggingOver ? 'lightblue' : '#d3d3d300',
    });
    const getItemStyle = (isDragging, draggableStyle, color) => ({
      userSelect: 'none',
      borderRadius: '3px',
      background: isDragging ? 'linear-gradient(to right, #2196f3,#2196f3)' : color,
      ...draggableStyle,
    });
    const customStyles = {
      menu: base => ({
        ...base,
        backgroundColor: 'white',
        zIndex: '2!important',
      }),
      menuList: base => ({
        ...base,
        backgroundColor: 'white',
        zIndex: '2!important',
      }),
    };
    return (
      <div className={classes.root}>
        <Dialog
          classes={{ paperFullScreen: classes.paperFullScreen }}
          fullScreen
          maxWidth="md"
          fullWidth
          open
          // onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    this.props.history.push('/crm/contactCenter');
                  }}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>

                <Typography className={classes.text} h2>
                  Thêm mới biểu mẫu
                </Typography>
                <Button variant="outlined" color="inherit" onClick={this.handleAddContactCenter} style={{ position:'absolute', right : 0,marginRight: 20}}>
                  Lưu
                </Button>
              </Toolbar>
            </AppBar>
          </DialogTitle>

          <DialogContent>
            <div style={{ marginTop: 64 }}>
              <Grid container spacing={24}>
                <Grid item xs={9}>
                  <Paper>
                    <TextField value={name} onChange={this.handleChange} name="name" className={classes.textField} placeholder="Tên biểu mẫu" />
                    <TextField
                      value={description}
                      name="description"
                      multiline
                      rowsMax="4"
                      className={classes.textField}
                      placeholder="Mô tả biểu mẫu"
                      onChange={this.handleChange}
                    />
                    <hr />
                    <SortableContainer useDragHandle>
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                              {selectedFields.sort((a, b) => a.priority > b.priority).map((item, index) => (
                                <Draggable key={item.name} draggableId={item.name} index={index}>
                                  {(provided, snapshot) => (
                                    <React.Fragment>
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, item.color)}
                                      >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Menu style={{ fontSize: 40 }} />
                                          <TextField
                                            id="outlined-number"
                                            label={item.title}
                                            value={this.state.age}
                                            type="textField"
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ width: '100%' }}
                                          />
                                          <div
                                            style={{
                                              width: 100,
                                              display: 'flex',
                                              justifyContent: 'space-evenly',
                                            }}
                                          >
                                            <Edit className={classes.iconEdit} onClick={() => this.handleSettingField(item.name)} />
                                            <Delete className={classes.iconDelete} onClick={() => this.handleRemove(item.name)} />
                                          </div>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </SortableContainer>
                  </Paper>
                  <Paper>
                    <div style={{ padding: 20 }}>
                      <span>Người tham gia</span>
                      <AsyncSelect
                        onChange={selectedOption => {
                          this.handleChangeSelect(selectedOption);
                        }}
                        placeholder="Người tham gia"
                        styles={customStyles}
                        defaultOptions
                        value={this.people}
                        isMulti
                        theme={theme => ({
                          ...theme,
                          spacing: {
                            ...theme.spacing,
                            controlHeight: '55px',
                          },
                        })}
                        loadOptions={(inputValue, callback) => {
                          promiseOptions(inputValue, callback);
                        }}
                      />
                    </div>
                    {background.file !== undefined ? (
                      <TextField
                        variant="outlined"
                        label="Ảnh nên"
                        value={background.file}
                        fullWidth
                        className={classes.textFieldOutlet}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={() => {
                                  window.open(background.file);
                                }}
                              >
                                <CloudDownload />
                              </IconButton>
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={() => {
                                  background.file = undefined;
                                  this.setState({ background });
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        label="Ảnh nên"
                        className={classes.textFieldOutlet}
                        type="file"
                        value={background.file}
                        onChange={event => {
                          const { background } = this.state;
                          background.file = event.target.value;
                          background.selectFile = event.target.files[0];
                          this.meetingFile = event.target.files[0];
                          this.setState({ background });
                        }}
                        margin="normal"
                        variant="outlined"
                      />
                    )}
                  </Paper>
                  <TextField
                    value={description}
                    name="description"
                    multiline
                    rowsMax="4"
                    className={classes.textField}
                    placeholder="Mô tả biểu mẫu"
                    onChange={this.handleChange}
                  />
                  {type === 'edit' ? (
                    <Paper style={{ marginTop: 20 }}>
                      <Tabs value={tab} onChange={this.handleChangeTab} classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}>
                        <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Mã nhúng" />
                        <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Link" />
                        <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Nút" />
                      </Tabs>
                      {tab === 0 && (
                        <TextField
                          multiline
                          rowsMax="20"
                          disabled
                          value={`<script id="cni-form" >
                        (function (w, d, u, b) {
                          w['CNIFormObject'] = b; w[b] = w[b] || function () {
                            arguments[0].ref = u;
                            (w[b].forms = w[b].forms || []).push(arguments[0])
                          };
                            if (w[b]['forms']) return;
                            var s = d.createElement('script'); s.async = 1; s.src = u + '?' + (1 * new Date());
                            var h = d.getElementsByTagName('script')[0];
                            h.parentNode.insertBefore(s, h);
                          })(window, document, '${APP_URL}/static/js/form_loader.js', 'cnivnForm');
                          cnivnForm({"id":"${
                            contactCenter ? contactCenter._id : ''
                          }","base_url":"${APP_URL}","lang":"vn","sec":"iudj6m","type":"inline"});
                    </script>`}
                          variant="outlined"
                          className={classes.textField}
                          placeholder="Mô tả biểu mẫu"
                        />
                      )}
                      {tab === 1 && (
                        <TextField
                          multiline
                          rowsMax="10"
                          disabled
                          value={`${APP_URL}/ren/form/${contactCenter ? contactCenter._id : ''}`}
                          variant="outlined"
                          className={classes.textField}
                          placeholder="Mô tả biểu mẫu"
                        />
                      )}
                      {tab === 2 && (
                        <TextField
                          multiline
                          rowsMax="20"
                          disabled
                          value={`<script id="cni-form" >
                    (function (w, d, u, b) {
                      w['CNIFormObject'] = b; w[b] = w[b] || function () {
                        arguments[0].ref = u;
                        (w[b].forms = w[b].forms || []).push(arguments[0])
                      };
                        if (w[b]['forms']) return;
                        var s = d.createElement('script'); s.async = 1; s.src = u + '?' + (1 * new Date());
                        var h = d.getElementsByTagName('script')[0];
                        h.parentNode.insertBefore(s, h);
                      })(window, document, '${APP_URL}/static/js/form_loader.js', 'cnivnForm');
                      cnivnForm({"id":"${
                        contactCenter ? contactCenter._id : ''
                      }","base_url":"${APP_URL}","lang":"vn","sec":"iudj6m","type":"button"});
                </script>`}
                          variant="outlined"
                          className={classes.textField}
                          placeholder="Mô tả biểu mẫu"
                        />
                      )}
                    </Paper>
                  ) : null}
                  {openDialog ? (
                    <DialogSettingFiled
                      handleChangeSettingField={this.handleChangeSettingField}
                      handleSelectDialogSetting={this.handleSelectDialogSetting}
                      {...this.props}
                      currentFields={currentFields}
                      openDialog={openDialog}
                    />
                  ) : null}
                </Grid>
                <Grid item xs={3}>
                  <RightContactCenter handleSelect={this.handleSelect} fields={fields} />
                  {/* <Button onClick={this.handleAddContactCenter} className={classes.button} variant="outlined" color="primary">
                    Lưu
                  </Button> */}
                  {/* <Button
                    onClick={() => this.props.history.push('/crm/ContactCenter')}
                    className={classes.button}
                    variant="outlined"
                    color="secondary"
                  >
                    Hủy
                  </Button> */}
                </Grid>
              </Grid>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

ContactCenterFormPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contactCenterFormPage: makeSelectContactCenterFormPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
    onAddContactCenter: body => {
      dispatch(addContactCenterAction(body));
    },
    onEditContactCenter: body => {
      dispatch(editContactCenterAction(body));
    },
    onGetContactCenter: id => {
      dispatch(getContactCenterByIdAction(id));
    },
    onGetEmployeeByIds: query => {
      dispatch(getEmployeeByIdAction(query));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'contactCenterFormPage', reducer });
const withSaga = injectSaga({ key: 'contactCenterFormPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ContactCenterFormPage);
