import React from 'react';
import { View, Picker } from 'react-native';
import {    Container, Header, Title, Content, Footer, FooterTab, Button, Left,
            Right, Body, Icon, Text, Thumbnail} from 'native-base';
import { observer } from "mobx-react";
import {Router, Link, NativeRouter} from 'react-router-native';

import white from "../Static/Images/white.jpg"

export default observer(class MyHeader extends React.Component {
    returnThumbnail(){
        if(this.props.store.authenticated){
            return(
                    <Thumbnail source={white}/>
            )
        }
    }
    render() {
        return (
            <Header style={styles.header}>
                <Left>
                    {this.returnThumbnail()}
                </Left>
                <Body>
                    <Title style = {styles.title}>{this.props.store.pageTitle}</Title>
                </Body>
                <Right />
            </Header>
        );
    }
})

const styles = {
    header:{
        //height: 100,
        paddingTop: 65,
        paddingBottom: 40,
        backgroundColor: 'grey',
        marginTop: 0,
    },
    title:{
        color: 'white',
        textAlign: 'center',
    }
}
