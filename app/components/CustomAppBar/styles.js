const styles = theme => ({
  AppBarMinimizeActive: {
    width: 'calc(100vw - 80px) !important',
    zIndex: '1030 !important',
  },
  AppBarMinimizeActiveProject: {
    width: 'calc(100% - 80px) !important',
    zIndex: '1030 !important',
  },
  AppBarMinimizeInActive: {
    width: 'calc(100vw - 260px) !important',
    zIndex: '1030 !important',
  },
  AppBarMinimizeInActiveProject: {
    width: 'calc(100% - 250px) !important',
    zIndex: '1030 !important',
  },
  AppBarMinimizeActiveProjectTask: {
    width: 'calc(100% - 0px) !important',
    zIndex: '1030 !important',
  },
  AppBarMinimizeInActiveProject1: {
    width: 'calc(100% - 0px) !important',
    zIndex: '1030 !important',
  },
  ToolBarMinimizeActive: {
    marginLeft: 80,
  },
  ToolBarMinimizeInActive: {
    marginLeft: 5,
  },
});

export default styles;
