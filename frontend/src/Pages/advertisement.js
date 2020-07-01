import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, UrlField } from 'react-admin';
import { required } from 'react-admin';


export const AdvertisementList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Anúncios" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => record.description}
                    tertiaryText={record => record.uuid}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="uuid" label="UUID"/>
                    <TextField source="title" label="Título"/>
                    <TextField source="description" label="Descrição"/>
                    <UrlField source="url" label="URL"/>
                    <UrlField source="image" label="Image"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const AdvertisementTitle = ({ record }) => {
    return <span>Título: {record ? `"${record.title}"` : ''}</span>;
};

export const AdvertisementEdit = props => (
    <Edit title={<AdvertisementTitle />} {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <TextInput source="url" label="URL"/>
            <TextInput source="image" label="Image"/>
        </SimpleForm>
    </Edit>
);

export const AdvertisementCreate = props => (
    <Create title= "Novo anúncio" {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <TextInput source="url" label="URL"/>
            <TextInput source="image" label="Image"/>
        </SimpleForm>
    </Create>
);