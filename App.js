import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spinner, Container, Content, Header } from 'native-base';
import {observer} from 'mobx-react';

import store from './Store';
import MyHeader from './Components/MyHeader';
import MyContent from './Components/MyContent';

export default observer( class App extends React.Component {
    render() {
        return (
            <Container style={{flex:1, justifyContent: 'space-around'}}>
                <MyHeader style={{flex:1}} store={store} />
                <MyContent style={{flex:3}} store={store} />
            </Container>
    );
  }
})
