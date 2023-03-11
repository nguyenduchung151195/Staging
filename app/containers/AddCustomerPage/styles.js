const styles = theme => ({
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  paper: {
    padding: 20,
    marginBottom: 20,
  },
  paperTitle: {
    fontWeight: 550,
    fontSize: '18px',
    // verticalAlign: 'middle',
    // marginLeft: 10,
  },
  spanTitle: {
    color: '#A4A4A4',
    fontStyle: 'italic',
    fontWeight: 500,
  },
  textField: {
    // width: '95%',
    // margin: '0 10px',
    marginTop: 10,
    marginBottom: 10,
  },
  addField: {
    width: '95%',
    // margin: '0 10px',
    marginTop: 10,
    marginBottom: 10,
  },
  avatar: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  button: {
    marginLeft: 16,
    // textAlign: 'center',
    marginTop: 10,
  },
  tabRoot: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
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
  tabSelected: {},
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  creatable: {
    width: '95%',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  HearderappBarCustomer: {
    zIndex: '99 !important',
    width : '100% !important,'
  },
  BTNCustomer: {
  // marginLeft: '15% !important',
  },
});

export default styles;
