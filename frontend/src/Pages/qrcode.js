import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, BooleanField, NumberInput, BooleanInput } from 'react-admin';
import { required } from 'react-admin';


export const QRCodeList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="QRCodes" 
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
                    <TextField source="poits" label="Pontos"/>
                    <BooleanField source="valid" label="Válido"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const QRCodeTitle = ({ record }) => {
    return <span>Título: {record ? `"${record.title}"` : ''}</span>;
};

export const QRCodeEdit = props => (
    <Edit title={<QRCodeTitle />} {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <NumberInput source="poits" label="Pontos" validate={required()}/>
            <BooleanInput source="valid" label="Válido" validate={required()}/>
        </SimpleForm>
    </Edit>
);

export const QRCodeCreate = props => (
    <Create title= "Novo QRCode" {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <NumberInput source="poits" label="Pontos" validate={required()}/>
            <BooleanInput source="valid" label="Válido" validate={required()}/>
        </SimpleForm>
    </Create>
);