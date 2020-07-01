import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput, DateField } from 'react-admin';
import { required } from 'react-admin';

const DateFieldNew = props => {
    const date = props.record[props.source]
    var parts = date.split('-');
    var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
    return <DateField {...props} record={ {[props.source]: mydate} } />
}


export const EventList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Eventos" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => record.subtitle}
                    tertiaryText={record => ""}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="title" label="Título"/>
                    <TextField source="subtitle" label="Subtítulo"/>
                    <TextField source="description" label="Descrição"/>
                    <DateFieldNew source="date" label="Data"/>
                    <TextField source="latitude" label="Latitude"/>
                    <TextField source="longitude" label="Longitude"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const Title = ({ record }) => {
    return <span>Título: {record ? `"${record.title}"` : ''}</span>;
};

export const EventEdit = props => (
    <Edit title={<Title />} {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="subtitle" label="Subtítulo" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <DateInput source="date" validate={required()}/>
            <NumberInput source="latitude" label="Latitude" />
            <NumberInput source="longitude" label="Longitude" />
        </SimpleForm>
    </Edit>
);

export const EventCreate = props => (
    <Create title= "Novo evento" {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="subtitle" label="Subtítulo" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <DateInput source="date" validate={required()}/>
            <NumberInput source="latitude" label="Latitude" />
            <NumberInput source="longitude" label="Longitude" />
        </SimpleForm>
    </Create>
);