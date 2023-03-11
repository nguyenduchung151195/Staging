/**
 *
 * ConfigTask
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withStyles } from '@material-ui/core/styles';
import { sortableContainer } from 'react-sortable-hoc';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import { injectIntl } from 'react-intl';
import { Button, Fab, Tab, Tabs, Checkbox, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ColorPicker from 'material-ui-color-picker';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Menu, Delete, Edit, Home } from '@material-ui/icons';
import { Paper, Dialog, TextField } from '../../components/LifetekUi';
import makeSelectConfigTask from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { getConfig, mergeData, postConfig, getDefault, putConfig, deleteConfig, putConfigParent } from './actions';
import messages from './messages';
import makeSelectDashboardPage from '../Dashboard/selectors';
/* eslint-disable react/prefer-stateless-function */

const SortableContainer = sortableContainer(({ children }) => <ul style={{ width: '100%', padding: 0 }}>{children}</ul>);
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */

function ConfigItem(props) {
  const [id, setId] = React.useState(null);
  const [code, setCode] = React.useState([]);

  if (props.id !== id) {
    const configCode = [];
    props.items.forEach(element => {
      if (!configCode.includes(element.code)) configCode.push(element.code);
    });
    setCode(configCode);
    ` `;
    setId(props.id);
  }

  function renConfig(type) {
    switch (type) {
      case 'CHECK':
        return (
          <React.Fragment>
            {props.items.map(i => (
              <p>
                {i.name}
                <Checkbox onChange={() => props.onCheck(props.code, i._id)} checked={i.check} />
              </p>
            ))}
          </React.Fragment>
        );
      case 'NUMBER':
        return (
          <React.Fragment>
            {props.items.map(i => (
              <TextField fullWidth label={i.name} value={i.code} type="number" />
            ))}
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            {code.map((el, idx) => (
              <ExpansionPanel key={el} defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <p style={{ fontSize: '1.3rem', fontWeight: '400' }}>
                    {props.title} {idx + 1}{' '}
                  </p>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <SortableContainer useDragHandle>
                    <DragDropContext onDragEnd={props.onDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            {props.items.filter(o => o.code === el).map((item, index) => (
                              <Draggable key={item._id} draggableId={item._id} index={index}>
                                {(provided, snapshot) => (
                                  <React.Fragment>
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      // eslint-disable-next-line react/jsx-no-duplicate-props
                                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, item.color)}
                                    >
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                          <Menu />
                                          <span style={{ paddingLeft: 5 }}>{item.name}</span>
                                        </div>
                                        <div>
                                          {(props.roleModule.find(item => item.name === 'PUT') || { allow: false }).allow === true ? (
                                            <Fab color="primary" size="small" onClick={() => props.onEdit(item, id)}>
                                              <Edit />
                                            </Fab>
                                          ) : null}
                                          {(props.roleModule.find(item => item.name === 'DELETE') || { allow: false }).allow === true ? (
                                            <Fab color="secondary" size="small" onClick={() => props.onDelete(item._id, id)}>
                                              <Delete />
                                            </Fab>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )}
                              </Draggable>
                            ))}
                            {(props.roleModule.find(item => item.name === 'POST') || { allow: false }).allow === true ? (
                              <Button onClick={() => props.onAdd(el, id)} color="primary" variant="outlined">
                                Thêm mới
                              </Button>
                            ) : null}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </SortableContainer>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </React.Fragment>
        );
    }
  }

  return <React.Fragment>{renConfig(props.type)}</React.Fragment>;
}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 5;
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '#d3d3d300',
  padding: grid,
});
const getItemStyle = (isDragging, draggableStyle, color) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 1.75,
  margin: `0 0 ${grid}px 0`,
  borderRadius: '3px',
  color: 'white',

  // change background colour if dragging
  background: isDragging ? 'linear-gradient(to right, rgb(40, 43, 45), #607d8beb)' : color,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);

export class ConfigTask extends React.Component {
  state = {
    openAdd: false,
    tab: 0,
  };

  componentDidMount() {
    this.props.getConfig();
  }

  id2List = {
    droppable: 'items',
    droppable2: 'selected',
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(this.getList(source.droppableId), source.index, destination.index);

      let state = { items };

      if (source.droppableId === 'droppable2') {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(this.getList(source.droppableId), this.getList(destination.droppableId), source, destination);

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
      });
    }
  };

  render() {
    const { classes, intl } = this.props;
    const { configTask } = this.props;
    const { config, dialogKanban, name, type, color } = configTask;
    const { tab } = this.state;
    const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'TaskConfig');
    const roleModule = roleCode ? roleCode.methods : [];
    // console.log('roleModule', roleModule);
    return (
      <div>
        <Paper>
          <Grid container md={12}>
            {(roleModule.find(item => item.name === 'GET') || { allow: false }).allow === true ? (
              <React.Fragment>
                <Grid item md={3}>
                  <VerticalTabs
                    value={tab}
                    onChange={(event, value) => {
                      this.setState({ tab: value });
                    }}
                  >
                    {config.map((item, index) => (
                      <VerticalTab
                        style={{ textAlign: 'left', textTransform: 'none' }}
                        label={item.name}
                        onClick={() => {
                          this.setState({ tab: index, _id: item._id });
                        }}
                      />
                    ))}
                  </VerticalTabs>
                </Grid>
                {/* {console.log(roleModule, 'module')} */}
                <Grid item md={9}>
                  {config.length ? (
                    <ConfigItem
                      roleModule={roleModule}
                      id={config[tab]._id}
                      save={config[tab].name}
                      title={config[tab].name}
                      code={config[tab].code}
                      items={config[tab].data}
                      onEdit={this.editConfig}
                      onAdd={this.onAdd}
                      onCheck={this.onCheck}
                      type={config[tab].type}
                      onDelete={this.deleteConfig}
                    />
                  ) : null}
                </Grid>
              </React.Fragment>
            ) : (
              <div style={{ marginLeft: '40%' }}>
                <Typography variant="h6" component="h2" color="secondary">
                  Bạn không có quyền cho chức năng này
                </Typography>
                <Link to="/">
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
                    <Typography variant="h6" component="h2" color="primary">
                      Quay lại trang chủ
                    </Typography>
                    <Home color="primary" />
                  </div>
                </Link>
              </div>
            )}
          </Grid>
        </Paper>
        <Dialog onSave={this.onSave} onClose={() => this.props.mergeData({ dialogKanban: false })} open={dialogKanban}>
          <TextField
            fullWidth
            id="standard-name"
            label={intl.formatMessage(messages.tentrangthai || { id: 'tentrangthai', defaultMessage: 'tentrangthai' })}
            className={classes.textField}
            value={name}
            margin="normal"
            name="name"
            onChange={e => this.handleChange('name', e.target.value)}
            required
            helperText={name ? null : 'Không được bỏ trống'}
            error={!name}
          />
          <TextField
            fullWidth
            id="standard-name"
            label={intl.formatMessage(messages.code || { id: 'code', defaultMessage: 'code' })}
            className={classes.textField}
            value={type}
            onChange={e => this.handleChange('type', e.target.value)}
            required
            margin="normal"
            error={!type}
            helperText={type ? null : 'Không được bỏ trống'}
            name="type"
          />
          <div style={{ marginTop: 20 }}>
            <span style={{ fontSize: 14, marginTop: 10 }}>{intl.formatMessage(messages.mausac || { id: 'mausac', defaultMessage: 'mausac' })}</span>
            <ColorPicker value={color} name="color" defaultValue="#000" className={classes.textField} onChange={color => this.onDrag(color)} />
          </div>
        </Dialog>
      </div>
    );
  }

  editConfig = (item, id) => {
    this.props.mergeData({ color: item.color, name: item.name, code: item.code, type: item.type, configId: item._id, dialogKanban: true, _id: id });
  };

  onCheck = (code, id) => {
    const roleCode = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'TaskConfig');
    if (roleCode.methods.find(item => item.name === 'PUT').allow === true) {
      const config = this.props.configTask.config.map(
        i => (i.code === code ? { ...i, data: i.data.map(it => (it._id === id ? { ...it, check: true } : { ...it, check: false })) } : i),
      );
      const configId = config.find(i => i.code === code);

      if (configId) this.props.putConfigParent(configId);
    } else alert('Bạn không có quyền cho chức năng này');
  };

  handleChange = (name, value) => {
    this.props.mergeData({ [name]: value });
  };

  onAdd = (code, id) => {
    this.props.mergeData({ color: '#2e8fc7', name: '', code, type: '', _id: id, dialogKanban: true, configId: null });
  };

  onDrag(color) {
    this.props.mergeData({
      color,
    });
  }

  onSave = () => {
    const { configTask } = this.props;
    const { configId, _id } = configTask;

    const data = {
      _id: configId,
      name: configTask.name,
      code: configTask.code,
      color: configTask.color,
      type: configTask.type,
    };

    if (configId) {
      this.props.putConfig(data, _id, configId);
      this.props.getDefault();
      this.props.mergeData({ dialogKanban: false });
    } else {
      this.props.postConfig(data, _id);
      this.props.getDefault();
      this.props.mergeData({ dialogKanban: false });
    }
  };

  deleteConfig = (id, _id) => {
    // eslint-disable-next-line no-restricted-globals
    const r = confirm('Bạn có muốn xóa ?');
    if (r) {
      this.props.deleteConfig(_id, id);
    }
  };
}

const mapStateToProps = createStructuredSelector({
  configTask: makeSelectConfigTask(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getConfig: () => dispatch(getConfig()),
    mergeData: data => dispatch(mergeData(data)),
    postConfig: (data, id) => dispatch(postConfig(data, id)),
    putConfig: (data, id, configId) => dispatch(putConfig(data, id, configId)),
    getDefault: data => dispatch(getDefault(data)),
    deleteConfig: (id, configId) => dispatch(deleteConfig(id, configId)),
    putConfigParent: data => dispatch(putConfigParent(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'configTask', reducer });
const withSaga = injectSaga({ key: 'configTask', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ConfigTask);
