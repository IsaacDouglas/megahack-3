import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, UrlField, NumberInput } from 'react-admin';
import { required } from 'react-admin';


export const  RecycleList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Pontos de reciclagem" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.description}
                    tertiaryText={record => ""}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" label="Nome"/>
                    <TextField source="description" label="Descrição"/>
                    <UrlField source="image" label="Imagem"/>
                    <TextField source="latitude" label="Latitude"/>
                    <TextField source="longitude" label="Longitude"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const Title = ({ record }) => {
    return <span>Nome: {record ? `"${record.name}"` : ''}</span>;
};

export const RecycleEdit = props => (
    <Edit title={<Title />} {...props}>
        <SimpleForm>
            <TextInput source="name" label="Nome" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <TextInput source="image" label="Imagem" />
            <NumberInput source="latitude" label="Latitude" />
            <NumberInput source="longitude" label="Longitude" />
        </SimpleForm>
    </Edit>
);

export const RecycleCreate = props => (
    <Create title= "Novo ponto de reciclagem" {...props}>
        <SimpleForm>
            <TextInput source="name" label="Nome" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <TextInput source="image" label="Imagem" />
            <NumberInput source="latitude" label="Latitude" />
            <NumberInput source="longitude" label="Longitude" />
        </SimpleForm>
    </Create>
);