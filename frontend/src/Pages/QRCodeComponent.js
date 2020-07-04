import React from 'react';
import { subscribe } from 'mqtt-react';
import QRCode from 'qrcode.react';

function parseJSON(props) {
    if ( props.data[0] ) {
        let qr = JSON.parse(props.data[0]).qrcode
        return qr ? qr : undefined
    } else {
        return undefined
    }
}

const Message = (props) => (
    <div>
        { parseJSON(props) !== undefined ? 
        <QRCode 
            value={parseJSON(props)} 
            includeMargin={true} 
            level="H" 
            size={300}
        /> : null }
    </div>
);

export default subscribe({
  topic: 'megahack3/info'
})(Message)