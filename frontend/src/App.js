import React from 'react';

import { Admin, Resource } from 'react-admin';
import { UserList, UserEdit, UserCreate } from './Pages/user';
import { GoalList, GoalEdit, GoalCreate } from './Pages/goal';
import { AddressList, AddressEdit, AddressCreate } from './Pages/address';
import { CategoryList, CategoryEdit, CategoryCreate } from './Pages/category';
import { ProductList, ProductEdit, ProductCreate } from './Pages/product';
import { AdvertisementList, AdvertisementEdit, AdvertisementCreate } from './Pages/advertisement';
import { QRCodeList, QRCodeEdit, QRCodeCreate } from './Pages/qrcode';
import { RestaurantList, RestaurantEdit, RestaurantCreate } from './Pages/restaurant';
import { RecipeList, RecipeEdit, RecipeCreate } from './Pages/recipe';
import { EventList, EventEdit, EventCreate } from './Pages/event';

import authProvider from './Provider/authProvider';
import dataProvider from './Provider/dataProvider';

import UserIcon from '@material-ui/icons/Group';
import AddressIcon from '@material-ui/icons/Map';
import CategoryIcon from '@material-ui/icons/Category';
import ProductIcon from '@material-ui/icons/LocalBar';
import GoalIcon from '@material-ui/icons/Star';
import QRCodeIcon from '@material-ui/icons/Code';
import AdvertisementIcon from '@material-ui/icons/ViewStream';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import RecipeIcon from '@material-ui/icons/Receipt';
import EventIcon from '@material-ui/icons/Event';

import ptBrMessages from './language-pt-br';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const i18nProvider = polyglotI18nProvider(() => ptBrMessages);

const App = () => (
    <Admin 
        authProvider={authProvider} 
        dataProvider={dataProvider} 
        i18nProvider={i18nProvider}
    >
    <Resource 
        icon={UserIcon} 
        options={{ label: 'Usuários' }} 
        name="user" 
        list={UserList} 
        edit={UserEdit} 
        create={UserCreate} 
    />
    <Resource 
        icon={GoalIcon} 
        options={{ label: 'Metas' }} 
        name="goal" 
        list={GoalList} 
        edit={GoalEdit} 
        create={GoalCreate} 
    />
    <Resource 
        icon={AddressIcon} 
        options={{ label: 'Endereços' }} 
        name="address" 
        list={AddressList} 
        edit={AddressEdit} 
        create={AddressCreate} 
    />
    <Resource 
        icon={CategoryIcon} 
        options={{ label: 'Categorias' }} 
        name="category" 
        list={CategoryList} 
        edit={CategoryEdit} 
        create={CategoryCreate} 
    />
    <Resource 
        icon={ProductIcon} 
        options={{ label: 'Produtos' }} 
        name="product" 
        list={ProductList} 
        edit={ProductEdit} 
        create={ProductCreate} 
    />
    <Resource 
        icon={AdvertisementIcon} 
        options={{ label: 'Anúncios' }} 
        name="advertisement" 
        list={AdvertisementList} 
        edit={AdvertisementEdit} 
        create={AdvertisementCreate} 
    />
    <Resource 
        icon={QRCodeIcon} 
        options={{ label: 'QRCode' }} 
        name="qrcode"
        list={QRCodeList} 
        edit={QRCodeEdit} 
        create={QRCodeCreate} 
    />
    <Resource 
        icon={RestaurantIcon} 
        options={{ label: 'Restaurantes' }} 
        name="restaurant"
        list={RestaurantList} 
        edit={RestaurantEdit} 
        create={RestaurantCreate} 
    />
    <Resource 
        icon={RecipeIcon} 
        options={{ label: 'Receitas' }} 
        name="recipe"
        list={RecipeList} 
        edit={RecipeEdit} 
        create={RecipeCreate} 
    />
    <Resource 
        icon={EventIcon} 
        options={{ label: 'Eventos' }} 
        name="event"
        list={EventList} 
        edit={EventEdit} 
        create={EventCreate} 
    />
    </Admin>
);

export default App;