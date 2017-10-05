import React from 'react';
import { View, Picker } from 'react-native';
import { Container, Text, Header, Content, Form, Item, Input, Button, Label} from 'native-base';
import { observer } from "mobx-react";
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';

import auth from "./auth";

export default observer(class Login extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        "username": '',
        "password": '',
    };
  }
    handleSubmit(e){
        // console.log(this.state.username);
        // console.log(this.state.password);
        auth.login(this.state.username, this.state.password);
    }
    componentWillMount(){
        auth.firstLoad();
        this.props.store.pageTitle = "Login"
    }
    render() {
        if (!this.props.store.authenticated) {
        return (
            <Container style={{justifyContent: 'center'}}>
                <Text> Login:</Text>
                <Form>
                    <Item floatingLabel>
                        <Label>Username:</Label>
                        <Input rounded
                                autoCapitalize = 'none'
                                onChangeText={(username) =>
                                    this.setState({"username": username},
                                )}
                        />
                    </Item>
                    <Item floatingLabel>
                        <Label>Password:</Label>
                        <Input  rounded
                                secureTextEntry={true}
                                onChangeText={(password) =>
                                    this.setState({"password": password},
                                )}
                        />
                    </Item>
                    <Button style={{marginTop: 20}} block primary onPress={this.handleSubmit.bind(this)}><Text>Submit</Text></Button>
                </Form>
            </Container>
        );}
        else {
            return (
                <Container>
                    <Redirect exact to="/Posts"/>
                </Container>
            )
        }
    }
})
