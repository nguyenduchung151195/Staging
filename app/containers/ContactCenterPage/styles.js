const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'transform .2s linear',
    position: 'relative',
    paddingBottom: '20%',
  },
  icon: {
    fontSize: 45,
  },
  textBox: {
    fontSize: 17,
  },
});
export default styles;
