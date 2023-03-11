import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
function Tag(props) {
          const Amodule = JSON.parse(localStorage.getItem('Amodule'))
          const [listData, setListData] = useState([]);

          useEffect(() => {
                    // console.log(111111, props.params);
                    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
                    const currentViewConfig = viewConfigLocalStorage.find(d => d.code === Amodule);
                    const viewConfig = currentViewConfig.listDisplay.type.fields.type.columns;
                    // console.log(8888, viewConfig);
                    setListData(viewConfig)
          }, [props.params])
          return (
                    <div style={{ height: '100%', overflow: 'auto' }}>
                              <List
                                        component="nav"
                                        aria-labelledby="nested-list-subheader"
                                        subheader={
                                                  <ListSubheader component="div" id="nested-list-subheader" style={{ position: 'initial' }}>
                                                            Danh sách trường
                                                  </ListSubheader>
                                        }
                              >

                                        {listData && Array.isArray(listData) && listData.map((item) => {
                                                  return <ListItem button onClick={() => props.handleGeneralData(item)}>
                                                            <ListItemText primary={item.title} />
                                                  </ListItem>
                                        })}

                              </List>
                    </div>
          );
}

export default Tag;