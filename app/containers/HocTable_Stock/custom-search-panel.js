/* eslint-disable react/prefer-stateless-function */
import * as React from 'react';
// import { getMessagesFormatter } from '@devexpress/dx-core';
import { Template, TemplatePlaceholder, Plugin, TemplateConnector } from '@devexpress/dx-react-core';
import { TextField } from '@material-ui/core';
const pluginDependencies = [{ name: 'Toolbar' }, { name: 'SearchState' }];

export class CustomSearchPanel extends React.PureComponent {
  render() {
    // const { inputComponent: Input, messages } = this.props;
    // const getMessage = getMessagesFormatter({
    //   ...defaultMessages,
    //   ...messages,
    // });

    return (
      <Plugin name="SearchPanel" dependencies={pluginDependencies}>
        <Template name="toolbarContent">
          <TemplateConnector>
            {({ searchValue }, { changeSearchValue }) => (
              <TextField
                margin="dense"
                placeholder="Tìm kiếm..."
                variant="outlined"
                value={searchValue}
                onChange={event => {
                  changeSearchValue(event.target.value);
                }}
              />
            )}
          </TemplateConnector>
          <TemplatePlaceholder />
        </Template>
      </Plugin>
    );
  }
}
