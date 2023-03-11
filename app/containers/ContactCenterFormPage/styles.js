import { fade } from '@material-ui/core/styles/colorManipulator';
const styles = theme => ({
  paperFullScreen: { marginLeft: 250, backgroundColor: '#F4F6F8' },
  appBar: {
    left: 250,
    width: 'calc(100% - 250px)',
  },
  flex: {
    flex: 1,
  },
  root: {
    width: 500,
    backgroundColor: '#F4F6F8',
  },
  customStepper: {
    color: 'var(--kanban-color) !important',
  },
  text: {
    color: 'white',
  },
  textField: {
    width: '100%',
    padding: 20,
  },
  textFieldOutlet: {
    margin: 20,
    width: 400,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
    color: 'white',
  },
  topbar: {
    backgroundColor: '#2196f3',
    height: 60,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    margin: 20,
    minWidth: 100,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  iconEdit: {
    cursor: 'pointer',
    '&:hover': {
      color: '#2196f3',
    },
  },
  iconDelete: {
    cursor: 'pointer',
    '&:hover': {
      color: 'red',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
  formControl: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
});
export default styles;
