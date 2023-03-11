const styles = theme => ({
  root: {
    width: '95%',
    margin: '0 auto',
    marginTop: 20,
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    width: '100%',
  },
  demo: {
    background: 'red',
  },
  inputStyle: {
    border: '1px solid gray',
    borderRadius: '3px',
    padding: '9px 0px 8px 14px',
    '& div': {
      position: 'static',
    },
    '& div::after': {
      content: '',
      border: 'none',
    },
    '& div::before': {
      content: '',
      border: 'none',
    },
  },
});

export default styles;
