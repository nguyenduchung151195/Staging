const styles = theme => ({
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  search: {
    marginLeft: 10,
    top: -5,
    marginTop: 0,
    marginBottom: 0,
  },
  paper: {
    padding: 20,
  },
  paperTitle: {
    fontSize: 18,
  },
  button: {
    marginLeft: 10,
  },
  tableContainer: {
    padding: 20,
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
  pieWidth: {
    width: '80%',
    height: '80%',
  },
  swip: {
    overFlowX: 'none !important',
  },
});

export default styles;
