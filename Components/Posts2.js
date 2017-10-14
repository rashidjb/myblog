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

export default observer(class Posts extends Component {
    constructor(props){
        super(props);
        this.state = {
            url: "http://139.59.119.40/api/list/?format=json",
            dataSource: new ListView.DataSource({
                rowHasChanged:(row1, row2) => row1 != row2,
            }),
            nextUrl: '',
            previousUrl: '',
            pageNumber: 1,
            totalPages: 0,
            count: 0,
            limit: 0,
        }
    }
    componentWillMount(){
        auth.firstLoad();
        if(!store.posts.dataFetched || store.newPost){
            this.fetchData();
            store.newPost = false;
        }
        //this.fetchData();
        store.pageTitle = "Posts";
        this.state.nextUrl = store.posts.nextUrl;
        this.state.previousUrl = store.posts.previousUrl;
        this.state.totalPages = store.posts.totalPages;
    }
    componentWillUnmount(){
        store.posts.nextUrl = this.state.nextUrl;
        store.posts.previousUrl = this.state.previousUrl;
        store.posts.totalPages = this.state.totalPages;
    }

    fetchData(){
        //console.log('Fetching Data');
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
            //console.log(response);
            if (store.posts.initialFetch){
                var limit = response.next.indexOf('limit');
                limit = response.next[limit+6]
                //console.log('position:', limit);
                console.log('count:', response.count);
                var pageCount = response.count/limit
                pageCount = Math.ceil(pageCount);
                this.setState({
                    totalPages: pageCount,
                });
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(response.results),
                nextUrl: response.next,
                previousUrl: response.previous,
            });
            // console.log("dataSource in state:");
            // console.log(this.state.dataSource);
            store.posts.dataSource = this.state.dataSource;
            // console.log("dataSource in store:");
            // console.log(store.posts.dataSource);
            //console.log('totalPages: ', this.state.totalPages)
            store.posts.dataFetched = true;
            //console.log(store.posts.dataFetched);
            store.posts.initialFetch = false;
        }).catch((error) => console.log(error)).done();
    }
    handlePress(url){
        console.log('url: ');
        console.log(url);
        store.posts.detailsURL = url;
    }

    renderItem(object){
        //console.log(object);
        return(
            <Card style={{marginBottom: 20}}>
                <CardItem>
                    <Body>
                        <Text>{object.title}</Text>
                        <Text note>{object.publish}</Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent>
                            <Icon active name="thumbs-up" />
                            <Text>12 Likes</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Button transparent>
                            <Icon active name="chatbubbles" />
                            <Text>4 Comments</Text>
                        </Button>
                    </Body>
                    <Right>
                        <Text>11h ago</Text>
                    </Right>
                </CardItem>
            </Card>
        )
    }

    nextPage(){
        store.posts.dataFetched = false;
        currentPage = this.state.pageNumber;
        this.setState({
            url: this.state.nextUrl,
            pageNumber: currentPage+=1
        }, () =>{
            //console.log(this.state.url);
            this.fetchData();
        });
    }

    previousPage(){
        store.posts.dataFetched = false;
        currentPage = this.state.pageNumber;
        this.setState({
            url: this.state.previousUrl,
            pageNumber: currentPage-=1
        }, () =>{
            //console.log(this.state.url);
            this.fetchData();
        });
    }

    render() {
        if (store.posts.dataFetched){
            var finalPage = (this.state.pageNumber === this.state.totalPages);
            //console.log('finalPage:', finalPage);
            var firstPage = (this.state.pageNumber === 1);
            //console.log('firstPage:', firstPage);
            return (
                <Container>
                    <List>
                        <ListView
                        dataSource={store.posts.dataSource}
                        renderRow={this.renderItem.bind(this)} />
                    </List>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button iconLeft
                                style={{marginTop: 20}}
                                primary
                                onPress={this.previousPage.bind(this)}
                                disabled={firstPage}>
                            <Icon name='arrow-back' style={{color: 'white',}} />
                            <Text style={{color: 'white',}}>Back</Text>
                        </Button>

                        <Text style={{marginTop: 35}}>{this.state.pageNumber} of {this.state.totalPages}</Text>

                        <Button iconRight
                                style={{marginTop: 20}}
                                onPress={this.nextPage.bind(this)}
                                primary
                                disabled={finalPage}
                                >
                            <Text style={{color: 'white'}}>Next</Text>
                            <Icon name='arrow-forward' style={{color: 'white',}} />
                        </Button>
                    </View>
                </Container>
            );
        }else{
            return(
                <Container style={{flexDirection: 'row', justifyContent: 'center'}} >
                    <View style={{flexDirection: 'column'}}>
                        <Spinner color='green' />
                        <Text>Fetching Data</Text>
                    </View>
                </Container>
            )
        }

    }
})
