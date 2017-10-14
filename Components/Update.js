import React from 'react';
import { View, Picker } from 'react-native';
import { Container, Text, Header, Content, Form, Item, Input, Button, Label, CheckBox, ListItem, Body} from 'native-base';
import { observer } from "mobx-react";
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';

import auth from "./auth";
import store from "../Store"

export default observer(class NewPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            url: "http://139.59.119.40/api/update/"+this.props.store.slug,
            post: {
                "title": "",
                "content": "",
                "draft": false,
                "publish": ""
            },
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
        var status = this.state.post.draft;
        this.setState({
            draft: !status,
        })
    }

    getData(){
        console.log('Fetching Post to update');
        //console.log(this.state.url);
        console.log("token", this.props.store.token);
        console.log("title", this.props.store.pageTitle);
        console.log(headers:{
            // "Accept": 'application/json',
            // "Content-Type":"application/json",
            "Authorization": "JWT ", this.props.store.token,
        });
        fetch(this.state.url, {
            method: 'GET',
            headers:{
                // "Accept": 'application/json',
                // "Content-Type":"application/json",
                "Authorization": "JWT "+this.props.store.token,
            },
        })
        .then((response) => response.json())
        .then((response) => {
            // console.log("Aquired data:");
            console.log(response);
            this.setState({
                post: response,
                fetchOK: true,
                year: response.publish.slice(0,4),
                month: response.publish.slice(5,7),
                day: response.publish.slice(8,),
            });
        }).catch((error) => console.log(error)).done();
    }
    componentWillMount(){
        auth.firstLoad();
        this.props.store.pageTitle = "Update Post"
        this.getData();
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
            console.log(this.state.requestOK);
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
                                    defaultValue =  {this.state.post.title}
                                    onChangeText={(title) =>
                                        this.setState({"title": title},
                                    )}
                            />
                        </Item>

                        <Item floatingLabel style = {styles.textInput}>
                            <Label>Content:</Label>
                            <Input rounded
                                    defaultValue =  {this.state.post.content}
                                    autoCapitalize = 'none'
                                    onChangeText={(content) =>
                                        this.setState({"content": content},
                                    )}
                            />
                        </Item>
                        <ListItem style={{backgroundColor: 'gainsboro'}}>
                            <CheckBox
                                checked={this.state.post.draft}
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
                                        defaultValue =  {this.state.year}
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
                                        defaultValue =  {this.state.month}
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
                                        defaultValue =  {this.state.day}
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
