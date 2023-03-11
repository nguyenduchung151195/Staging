const styles = theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  paper: {
    padding: `${theme.spacing.unit * 2.5}px`,
    height: '100%',
  },

  borderTable: {
    border: '1px solid rgba(224, 224, 224, 1)',
    textAlign: 'center',
    fontSize: '0.8rem',
  },
  tableThongBao: {
    witdth: '100%',
    textAlign: 'center',
    color: 'darkred',
    // cu
  },
  table: {
    padding: '15px',
    border: '1px solid rgba(224, 224, 224, 1)',
  },
  textField: {
    margin: 0,
    marginBottom: '20px',
  },
  textNV: {
    border: '1px solid rgba(224, 224, 224, 1)',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
    height: '44px',
    padding: '1px 10px',
  },
  btnAdd: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: '10%',
    boxShadow: 'none',
  },
  bigAvatar: {
    width: 100,
    height: 100,
  },
  expandIcon: {
    margin: 0,
  },
  expandDetail: {
    paddingTop: '10px',
  },
  productDetail: {
    display: 'flex',
    flexDirection: 'column',
  },
  HearderappBarAddSale: {
    width: '100% !important',
    zIndex: '5 !important',
  },
  BTNSALE: {
    // marginLeft: '18% !important',
  },
  HearderappBarAddSale2: {
    width: '86.5% !important',
    zIndex: '9999 !important',
  },
  HearderappBarAddSaleEdit: {
    width: '86.5% !important',

  }
  // complete: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5px' },
});
export default styles;
