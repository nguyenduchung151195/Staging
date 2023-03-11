import React, { useEffect, memo, useState, useCallback } from 'react';
import CustomInputField from '../CustomInputField';
import { Grid } from '../../LifetekUi';
import { Card, MenuItem, Fab as Fa, Tooltip, Button, IconButton, DialogTitle } from '@material-ui/core';
import { removeVietnameseTones } from 'utils/common';
import _ from 'lodash';
import CustomButton from 'components/Button/CustomButton';
import { FilterList, Search } from '@material-ui/icons';

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};
function CustomGroupInputField(props) {
  const { code, value, onChange, columnPerRow = 2, source, allModule, noGrid } = props;
  const [listViewConfig, setListViewConfig] = useState([]);
  const [localState, setLocalState] = useState({});

  useEffect(
    () => {
      setLocalState({ ...(value || {}) });
    },
    [value],
  );

  useEffect(() => {
    if (allModule) {
      const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns) || [];
      let others = [];
      currentViewConfig.forEach(item => {
        const other = item.listDisplay.type.fields.type.fileColumns
        others = others.concat(other);
        others = _.uniqBy(others, 'name');
      })
      const filteredOthers = others.filter(item => item.checkedShowForm);
      setListViewConfig(filteredOthers);
    }
    else if (code) {
      const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = listViewConfig.find(item => item.code === code) || {};
      const { listDisplay = {} } = currentViewConfig;
      const { type = {} } = listDisplay;
      const { fields = {} } = type;
      const { type: childType = {} } = fields;
      const others = childType[source || 'others'] || [];
      const filteredOthers = others.filter(item => item.checkedShowForm);
      setListViewConfig(filteredOthers);
    }
  }, [source]);

  const handleChange = useCallback(
    e => {
      const newLocalState = {
        ...localState,
        [e.target.name]: e.target.value,
      };
      console.log(e)
      if (source === 'fileColumns') {
        const found = listViewConfig.find(c => {
          const name = c.name.replace('others.', '');
          if (name === e.target.name) {
            return true;
          }
          return false;
        });
        if (found && found.type === 'text') {
          newLocalState[`${e.target.name}_en`] = removeVietnameseTones(e.target.value);
        }
      }
      setLocalState(newLocalState);
      if (onChange) {
        onChange(newLocalState);
      }
    },
    [localState],
  );

  return (
    <>
      {
        noGrid ? (
          <>
            {listViewConfig.map(item => (
              <Grid item xs={12 / columnPerRow}>
                <CustomInputField
                  value={localState[item.name.replace('others.', '')]}
                  name={item.name.replace('others.', '')}
                  type={item.type}
                  label={item.title}

                  configType="crmSource"
                  configCode={item.code}
                  configId={item.id}
                  onChange={handleChange}
                />
              </Grid>
            ))}
            {/* </Grid> */}
            {
              props.othersLength < 6 ? (
                <Grid item xs={2}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ marginLeft: 5, marginTop: 8, height: 50 }}>
                      {/* <Fab onClick={props.onChangeSearch} color="primary" style={{ width: 40, height: 40, minWidth: 40, marginTop: 15, marginLeft: 5 }}>
                  <Tooltip title="Tìm kiếm">
                    <Search />
                  </Tooltip>
                </Fab> */}
                      <Button variant="outlined" color="primary" onClick={props.onChangeSearch} style={{ height: 47, width: 100 }}>
                        Tìm kiếm
                      </Button>
                    </div>
                    <div style={{ marginLeft: 5, marginTop: 8, height: 50 }}>
                      {/* <Fab
                  onClick={props.handleReload}
                  color="primary"
                  style={{ width: 40, height: 40, minWidth: 40, marginTop: 15 }}
                >
                  X
                </Fab> */}
                      <Button variant="outlined" color="secondary" onClick={props.handleReload} style={{ height: 47, width: 150 }}>
                        Xóa tìm kiếm
                      </Button>
                    </div>
                  </div>
                </Grid>
              ) : null
            }
          </>
        ) :
          <Grid spacing={8} container>
            {/* <Grid item x2={8}> */}
            {listViewConfig.map(item => (
              <Grid item xs={12 / columnPerRow}>
                <CustomInputField
                  value={localState[item.name.replace('others.', '')]}
                  name={item.name.replace('others.', '')}
                  type={item.type}
                  label={item.title}
                  configType="crmSource"
                  configCode={item.code}
                  configId={item.id}
                  onChange={handleChange}
                />
              </Grid>
            ))}
            {/* </Grid> */}
            {
              props.othersLength < 6 ? (
                <Grid item xs={2}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ marginLeft: 5, marginTop: 8, height: 50 }}>
                      {/* <Fab onClick={props.onChangeSearch} color="primary" style={{ width: 40, height: 40, minWidth: 40, marginTop: 15, marginLeft: 5 }}>
                  <Tooltip title="Tìm kiếm">
                    <Search />
                  </Tooltip>
                </Fab> */}
                      <Button variant="outlined" color="primary" onClick={props.onChangeSearch} style={{ height: 47, width: 100 }}>
                        Tìm kiếm
                      </Button>
                    </div>
                    <div style={{ marginLeft: 5, marginTop: 8, height: 50 }}>
                      {/* <Fab
                  onClick={props.handleReload}
                  color="primary"
                  style={{ width: 40, height: 40, minWidth: 40, marginTop: 15 }}
                >
                  X
                </Fab> */}
                      <Button variant="outlined" color="secondary" onClick={props.handleReload} style={{ height: 47, width: 150 }}>
                        Xóa tìm kiếm
                      </Button>
                    </div>
                  </div>
                </Grid>
              ) : null
            }
          </Grid>
      }

    </>
  );
}

export default memo(CustomGroupInputField);
