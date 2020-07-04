import React from 'react';
import Card from '@material-ui/core/Card';
import Latas from './LatasComponent';
import QRCodeComponent from './QRCodeComponent';

export default () => (
    <div>
        <br/>
        <Card>
            <Latas/>
            <QRCodeComponent/>
        </Card>
    </div>
);