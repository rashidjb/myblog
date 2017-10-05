import React from 'react';
import { View, Picker } from 'react-native';
import { Container, Text, Header, Content, Form, Item, Input, Button, Label} from 'native-base';
import { observer } from "mobx-react";
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';

import auth from "./auth";

export default observer(class SignOut extends React.Component {
    handleSubmit(e){
        auth.logout();
    }
    componentWillMount(){
        this.props.store.pageTitle = "Sign Out"
    }
    render() {
        if (!this.props.store.authenticated) {
        return (
            <Container>
                <Text> Login:</Text>
                <Form>
                    <Item>
                        <Label>Username: </Label>
                        <Input
                            autoCapitalize = 'none'
                            onChangeText={(username) =>
                                    this.setState({"username": username},
                                )}
                        />
                    </Item>
                    <Item>
                        <Label>Password: </Label>
                        <Input  secureTextEntry={true}
                                onChangeText={(password) =>
                                    this.setState({"password": password},
                                )}
                        />
                    </Item>
                    <Button block primary onPress={this.handleSubmit.bind(this)}><Text>Submit</Text></Button>
                </Form>
            </Container>
        );}
        else {
            return (
                <Container style={{justifyContent: 'center'}}>
                    <Form>
                        <Button block danger onPress={this.handleSubmit.bind(this)}><Text>Sign Out</Text></Button>
                    </Form>
                </Container>
            )
        }
    }
})
