import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, UrlField } from 'react-admin';
import { required } from 'react-admin';


export const RecipeList = ({permissions, ...props}) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
    
    return (
        <List
        title="Receitas" 
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
                    <TextField source="ingredients" label="Ingredientes"/>
                    <TextField source="preparation_mode" label="Modo de preparo"/>
                    <TextField source="description" label="Descrição"/>
                    <UrlField source="image" label="Imagem"/>
                    <EditButton/>
                </Datagrid>
            )}
        </List>
    );
}

const Title = ({ record }) => {
    return <span>Título: {record ? `"${record.title}"` : ''}</span>;
};

export const RecipeEdit = props => (
    <Edit title={<Title />} {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="subtitle" label="Subtítulo" validate={required()}/>
            <TextInput source="ingredients" label="Ingredientes" validate={required()}/>
            <TextInput source="preparation_mode" label="Modo de preparo" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <TextInput source="image" label="Imagem" />
        </SimpleForm>
    </Edit>
);

export const RecipeCreate = props => (
    <Create title= "Nova receita" {...props}>
        <SimpleForm>
            <TextInput source="title" label="Título" validate={required()}/>
            <TextInput source="subtitle" label="Subtítulo" validate={required()}/>
            <TextInput source="ingredients" label="Ingredientes" validate={required()}/>
            <TextInput source="preparation_mode" label="Modo de preparo" validate={required()}/>
            <TextInput source="description" label="Descrição" validate={required()}/>
            <TextInput source="image" label="Imagem" />
        </SimpleForm>
    </Create>
);