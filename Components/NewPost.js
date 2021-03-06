import React from 'react';
import { View, Picker } from 'react-native';
import { Container, Text, Header, Content, Form, Item, Input, Button, Label, CheckBox, ListItem, Body} from 'native-base';
import { observer } from "mobx-react";
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';

import auth from "./auth";

export default observer(class NewPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            url: "http://139.59.119.40/api/create/",
            title: '',
            content: '',
            draft: false,
            publish: '',
            year: '',
            month: '',
            day: '',
            requestOK: false,
        };
    }

    handleSubmit(e){
        this.sendData();
        this.props.store.posts.dataFetched = false;
    }

    invertDraft(){
        var status = this.state.draft;
        this.setState({
            draft: !status,
        })
    }
    componentWillMount(){
        auth.firstLoad();
        this.props.store.pageTitle = "Add a Post"
    }

    sendData(){
        console.log('Sending Data');
        fetch(this.state.url, {
            method: 'POST',
            headers:{
                "Accept": 'application/json',
                "Content-Type":"application/json",
                "Authorization": "JWT "+this.props.store.token,
            },
            body:JSON.stringify({
                "title": this.state.title,
                "content": this.state.content,
                "publish": this.state.year+"-"+this.state.month+"-"+this.state.day,
            })
        }).then((response) => {
            console.log("Aquired data:");
            console.log(response);
            this.setState({
                requestOK: response.ok,
            });
            //console.log(this.state.requestOK);
        })
        .catch((error) => console.log(error)).done();
    }

    render() {
        if(!this.state.requestOK){
            return (
                <Container style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Form>
                        <Item floatingLabel style = {styles.textInput}>
                            <Label>Title:</Label>
                            <Input rounded
                                    autoCapitalize = 'none'
                                    onChangeText={(title) =>
                                        this.setState({"title": title},
                                    )}
                            />
                        </Item>

                        <Item floatingLabel style = {styles.textInput}>
                            <Label>Content:</Label>
                            <Input rounded
                                    autoCapitalize = 'none'
                                    onChangeText={(content) =>
                                        this.setState({"content": content},
                                    )}
                            />
                        </Item>
                        <ListItem style={{backgroundColor: 'gainsboro'}}>
                            <CheckBox
                                checked={this.state.draft}
                                color='black'
                                onPress={this.invertDraft.bind(this)}
                            />
                            <Body>
                                <Text>Draft</Text>
                            </Body>
                        </ListItem>
                        <Label style={{marginTop: 20}}>Publish Date:</Label>

                        <View style={{flexDirection: 'row',
                                    justifyContent: 'center',}}>

                            <Item floatingLabel
                                    style = {styles.input}>
                                <Label>YYYY</Label>
                                <Input rounded
                                        autoCapitalize = 'none'
                                        keyboardType = 'number-pad'
                                        maxLength = {4}
                                        style = {styles.input}
                                        onChangeText={(year) =>
                                            this.setState({"year": year},
                                        )}
                                />
                            </Item>

                            <Item   floatingLabel
                                    style = {styles.input}>
                                <Label>MM</Label>
                                <Input rounded
                                        autoCapitalize = 'none'
                                        keyboardType = 'number-pad'
                                        maxLength = {2}
                                        onChangeText={(month) =>
                                            this.setState({"month": month},
                                        )}
                                />
                            </Item>

                            <Item floatingLabel
                                    style = {styles.input}>
                                <Label>DD</Label>
                                <Input rounded
                                        autoCapitalize = 'none'
                                        keyboardType = 'number-pad'
                                        maxLength = {2}
                                        onChangeText={(day) =>
                                            this.setState({"day": day},
                                        )}
                                />
                            </Item>
                        </View>
                        <Button style={{marginTop: 20}} block primary onPress={this.handleSubmit.bind(this)}>
                            <Text>Submit</Text>
                        </Button>
                    </Form>
                </Container>
            );
        }else{
            return (
                <Container>
                    <Redirect exact to="/Posts"/>
                </Container>
            )
        }
    }
})

const styles = {
    input:{
        borderColor: 'black',
        flex: 1,
        //width: 100,
    },
    textInput:{
        borderColor: 'black',
    }
};
