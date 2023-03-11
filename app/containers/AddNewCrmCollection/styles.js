const styles = theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  button: {
    marginLeft: 10,
  },
  input: {
    display: 'none',
  },
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  menuButton: { marginBottom: 10, marginRight: 10 },
  detailProduct: {
    width: 1661 ,
  },
  search: {
    marginLeft: 10,
    top: -5,
    marginTop: 0,
    marginBottom: 0,
  },
  HearderappBarAddNewCRM: {
    zIndex: '1002 !important',
    width: '100% !important',
  },
  BTNADDNEWCRM: {
    marginLeft: '266px !important',
  }
  // success: {
  //   backgroundColor: 'green',
  //   color: 'white',
  //   '&:hover': {
  //     color: 'white',
  //     backgroundColor: '',
  //   },
  // },
});
export default styles;
