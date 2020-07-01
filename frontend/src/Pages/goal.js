import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, NumberInput } from 'react-admin';
import { required } from 'react-admin';

export const GoalList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Metas" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => record.description}
                    tertiaryText={record => `id: ${record.id}`}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="title" label="Título"/>
                    <TextField source="description" label="Descrição"/>
                    <TextField source="minimum_points" label="Mínimo de pontos"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const GoalTitle = ({ record }) => {
    return <span>Nome: {record ? `"${record.title}"` : ''}</span>;
};

export const GoalEdit = props => (
    <Edit title={<GoalTitle />} {...props}>
        <SimpleForm >
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <NumberInput source="minimum_points" label="Mínimo de pontos" />
        </SimpleForm>
    </Edit>
);

export const GoalCreate = props => (
    <Create title= "Nova meta" {...props}>
        <SimpleForm>
        <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <NumberInput source="minimum_points" label="Mínimo de pontos" validate={required()}/>
        </SimpleForm>
    </Create>
);