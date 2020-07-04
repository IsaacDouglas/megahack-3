import React from 'react';
import { subscribe } from 'mqtt-react';
import CardHeader from '@material-ui/core/CardHeader';

function parseJSON(props) {
  if ( props.data[0] ) {
      let qr = JSON.parse(props.data[0]).latas
      return qr ? qr : undefined
  } else {
      return undefined
  }
}

const Message = (props) => (
    <CardHeader title={ parseJSON(props) !== undefined ? `Quantidade de latas: ${parseJSON(props)}` : null } />
);

export default subscribe({
  topic: 'megahack3/info'
})(Message)