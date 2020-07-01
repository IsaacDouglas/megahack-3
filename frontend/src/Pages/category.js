import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';
import { required } from 'react-admin';


export const CategoryList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Categorias" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => record.subtitle}
                    tertiaryText={record => `id: ${record.id}`}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="title" label="Título"/>
                    <TextField source="subtitle" label="Subtítulo"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const CategoryTitle = ({ record }) => {
    return <span>Título: {record ? `"${record.title}"` : ''}</span>;
};

export const CategoryEdit = props => (
    <Edit title={<CategoryTitle />} {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()} />
            <TextInput source="subtitle" label="Subtítulo" />
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = props => (
    <Create title= "Nova categoria" {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()} />
            <TextInput source="subtitle" label="Subtítulo" />
        </SimpleForm>
    </Create>
);