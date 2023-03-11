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
    width: 700,
  },
  search: {
    marginLeft: 10,
    top: -5,
    marginTop: 0,
    marginBottom: 0,
  },
  // success: {
  //   backgroundColor: 'green',
  //   color: 'white',
  //   '&:hover': {
  //     color: 'white',
  //     backgroundColor: '',
  //   },
  // },
  image: {
    // '&:hover': {
    transform: 'scale(7)',
    zIndex: 100,
    position: 'absolute',
    border: '1px gray solid',
    borderRadius: 5,
    marginLeft: 40,
    left: 750,
    top: 200,
    height: 100,
    width: 100,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundColor: 'white',
    // }
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    paddingLeft: 0,
  },
  paperFullScreen: { marginLeft: 260 },
  appBar: {
    left: 260,
    display: 'block',
    width: 'calc(100% - 260px)',
  },
  flex: {
    flex: 1,
  },
});
export default styles;
