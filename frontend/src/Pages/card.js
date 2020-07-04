import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, DateInput, DateField, ReferenceField, ReferenceInput, SelectInput } from 'react-admin';
import { required } from 'react-admin';

const DateFieldNew = props => {
    const date = props.record[props.source]
    var parts = date.split('-');
    var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
    return <DateField {...props} record={ {[props.source]: mydate} } />
}

export const CardList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Cartões" 
        {...props} >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.nome_titular}
                    secondaryText={record => record.card_number}
                    tertiaryText={record => `id: ${record.id}`}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <ReferenceField source="user_id" reference="user" label="Usuário">
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="nome_titular" label="Títular"/>
                    <TextField source="card_number" label="Número"/>
                    <TextField source="cvv" label="CVV"/>
                    <DateFieldNew source="validade" label="Validade"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const Title = ({ record }) => {
    return <span>Título: {record ? `"${record.title}"` : ''}</span>;
};

export const CardEdit = props => (
    <Edit title={<Title />} {...props}>
        <SimpleForm>
            <ReferenceInput source="user_id" reference="user" label="Usuário" validate={required()}>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="nome_titular" label="Títular" validate={required()}/>
            <TextInput source="card_number" label="Número" validate={required()}/>
            <TextInput source="cvv" label="CVV" validate={required()}/>
            <DateInput source="validade" label="Validade" validate={required()}/>
        </SimpleForm>
    </Edit>
);

export const CardCreate = props => (
    <Create title= "Novo cartão" {...props}>
        <SimpleForm>
            <ReferenceInput source="user_id" reference="user" label="Usuário" validate={required()}>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="nome_titular" label="Títular" validate={required()}/>
            <TextInput source="card_number" label="Número" validate={required()}/>
            <TextInput source="cvv" label="CVV" validate={required()}/>
            <DateInput source="validade" label="Validade" validate={required()}/>
        </SimpleForm>
    </Create>
);