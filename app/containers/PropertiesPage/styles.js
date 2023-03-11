const styles = theme => ({
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  search: {
    marginTop: 0,
    marginBottom: 10,
  },
  paper: {
    padding: 20,
  },
  tabRoot: {
    marginLeft: 0,
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
  // margin: {
  //   margin: theme.spacing.unit * 2,
  // },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    paddingLeft: 0,
  },
});

export default styles;
