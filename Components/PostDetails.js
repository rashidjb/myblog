import React, { Component } from 'react';
import {List, ListItem} from 'native-base';
import { Image } from 'react-native';
import {
    Spinner, Container, Header, Content, Card,
    CardItem, Thumbnail, Text, Button, Icon,
    Left, Body, Right
    } from 'native-base';
import { ListView, View} from 'react-native';
import { observer } from "mobx-react";
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';

import store from '../Store';
import auth from './auth';

export default observer(class PostDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            url: store.posts.detailsURL,
            post: {},
            author: '',
            slug: "",
            fetchOK:false,
            deleteOK:false,
        }
    }
    componentWillMount(){
        auth.firstLoad();
        this.fetchData();
        store.pageTitle = "Post Details";
    }

    fetchData(){
        console.log('Fetching Details');
        //console.log(this.state.url);
        fetch(this.state.url, {
            method: 'GET',
            headers:{
                "Accept": 'application/json',
                "Content-Type":"application/json",
                "Authorization": "JWT "+store.token,
            },
        })
        .then((response) => response.json())
        .then((response) => {
            // console.log("Aquired data:");
            console.log(response);
            this.setState({
                post: response,
                author: response.author.username,
                slug: response.slug,
                fetchOK: true,
            });
            // console.log("dataSource in state:");
            // console.log(this.state.dataSource);
            // console.log("dataSource in store:");
            // console.log(store.posts.dataSource);
            //console.log('totalPages: ', this.state.totalPages)
            //console.log(store.posts.dataFetched);
            store.slug = this.state.slug;
            store.postDetails = this.state.post;
        }).catch((error) => console.log(error)).done();
    }

    renderComments(object){
        //console.log(object);
        return(
            <Card>
                <CardItem>
                    <Body>
                        <Text>{object.title}</Text>
                        <Text>{object.content}</Text>
                        <Text>{object.publish}</Text>
                        <Text note>{object.publish}</Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }

    onPress = () => {
        this.deletePost();
    }
    deletePost = () => {
        console.log('deleting Post');
        console.log('slug', this.state.slug);
        fetch("http://139.59.119.40/api/delete/"+this.state.slug, {
            method: 'DELETE',
            headers:{
                "Accept": 'application/json',
                "Content-Type":"application/json",
                "Authorization": "JWT "+store.token,
            },
        })
        .then((response) => {
            // console.log("Aquired data:");
            console.log("Delete post response:",response);
            store.posts.dataFetched = false;
            this.setState({
            deleteOK:response.ok,
            });
            console.log('reset posts');
        })
        .catch((error) => console.log(error)).done();
    }
    render() {
        var post = this.state.post;
        var author = this.state.author;
        var isAuthor = author === store.username;
        if (this.state.fetchOK && !this.state.deleteOK){
            return (
                <Container>
                    <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text>{post.title}</Text>
                                <Text>{post.content}</Text>
                                <Text>{post.publish}</Text>
                                <Text>{author}</Text>
                                <Text>{this.state.slug}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button primary disabled={!isAuthor} bordered onPress={() => console.log('edit')} >
                                    <Link exact to='/Update'>
                                        <Icon active name="ios-create-outline" style={!isAuthor? {color: 'gray'}:{color: 'blue'}}/>
                                    </Link>
                                </Button>
                            </Left>
                            <Body>
                                <Text>{post.publish}</Text>
                            </Body>
                            <Right>
                                <Button danger disabled={!isAuthor} bordered onPress={() => {this.onPress();}}>
                                    <Icon active name="trash" style={!isAuthor? {color: 'gray'}:{color: 'red'}}/>
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                    </Content>
                </Container>
            );
        }else if(this.state.deleteOK){
            return(
                <Container>
                    <Redirect exact to="/Posts"/>
                </Container>
            )
        }else{
            return(
                <Container style={{flexDirection: 'row', justifyContent: 'center'}} >
                    <View style={{flexDirection: 'column'}}>
                        <Spinner color='green' />
                        <Text>Fetching Details</Text>
                    </View>
                </Container>
            )
        }

    }
})
