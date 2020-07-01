import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, EmailField, BooleanField, BooleanInput, PasswordInput } from 'react-admin';
import { required, email } from 'react-admin';

const validateEmail = [required(), email()];

export const UserList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Usuários" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.email}
                    tertiaryText={record => `Admin: ${record.points}`}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" label="Nome"/>
                    <EmailField source="email" label="Email"/>
                    <BooleanField source="admin" label="Admin"/>
                    <TextField source="points" label="Pontos"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const UserTitle = ({ record }) => {
    return <span>Nome: {record ? `"${record.name}"` : ''}</span>;
};

export const UserEdit = props => (
    <Edit title={<UserTitle />} {...props}>
        <SimpleForm>
            <TextInput source="name" label="Nome" validate={required()}/>
            <TextInput source="email" label="Email" validate={validateEmail}/>
            <PasswordInput source="password" validate={required()}/>
            <BooleanInput source="admin" label="Admin" validate={required()}/>
        </SimpleForm>
    </Edit>
);

export const UserCreate = props => (
    <Create title= "Novo usuário" {...props}>
        <SimpleForm>
            <TextInput source="name" label="Nome" validate={required()}/>
            <TextInput source="email" label="Email" validate={validateEmail}/>
            <PasswordInput source="password" validate={required()}/>
            <BooleanInput source="admin" label="Admin" validate={required()}/>
        </SimpleForm>
    </Create>
);