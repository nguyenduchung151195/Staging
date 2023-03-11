import React from 'react';
import List from '../../components/List';
import { API_FIELD } from '../../config/urlConfig';
import { fieldColumns } from '../../variable';
import { Typography, Paper } from '../../components/LifetekUi';
import { Background } from 'devextreme-react/vector-map';

function ListField() {

    return <Paper className="py-3">
        <List
            columns={fieldColumns}
            apiUrl={API_FIELD}
            // client
            code="Field"
            disableViewConfig
            disableImport
            height="739px"
            optionSearch={[{ name: "name", title: "Tên" }, { name: "fields.name", title: "Các trường" }, { name: "code", title: "Module" }]}
        />
    </Paper>;
}
export default ListField;
