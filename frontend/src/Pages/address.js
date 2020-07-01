import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, ReferenceField, ReferenceInput, SelectInput } from 'react-admin';
import { required } from 'react-admin';


export const AddressList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Endereços" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.street}
                    secondaryText={record => record.CEP}
                    tertiaryText={record => `N: ${record.number}`}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <ReferenceField source="user_id" reference="user" label="Usuário">
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="CEP" label="CEP"/>
                    <TextField source="street" label="Rua"/>
                    <TextField source="number" label="Número"/>
                    <TextField source="complement" label="Complemento"/>
                    <TextField source="reference" label="Referência"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const AddressTitle = ({ record }) => {
    return <span>Nome: {record ? `"${record.street}"` : ''}</span>;
};

export const AddressEdit = props => (
    <Edit title={<AddressTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="user_id" reference="user" label="Usuário" validate={required()}>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="CEP" label="CEP" validate={required()}/>
            <TextInput source="street" label="Rua" validate={required()}/>
            <TextInput source="number" label="Número" validate={required()}/>
            <TextInput source="complement" label="Complemento"/>
            <TextInput source="reference" label="Referência"/>
        </SimpleForm>
    </Edit>
);

export const AddressCreate = props => (
    <Create title= "Novo endereço" {...props}>
        <SimpleForm>
            <ReferenceInput source="user_id" reference="user" label="Usuário" validate={required()}>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="CEP" label="CEP" validate={required()}/>
            <TextInput source="street" label="Rua" validate={required()}/>
            <TextInput source="number" label="Número" validate={required()}/>
            <TextInput source="complement" label="Complemento"/>
            <TextInput source="reference" label="Referência"/>
        </SimpleForm>
    </Create>
);