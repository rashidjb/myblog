import React, { Component } from 'react';
import {List, ListItem} from 'native-base';
import { Image } from 'react-native';
import {
    Spinner, Container, Header, Content, Card,
    CardItem, Thumbnail, Text, Button, Icon,
    Left, Body, Right
    } from 'native-base';
import { ListView} from 'react-native';
import { observer } from "mobx-react";

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
        }
    }
    componentWillMount(){
        auth.firstLoad();
        if(!store.dataFetched || store.newPost){
            this.fetchData();
            store.newPost = false;
        }
        //this.fetchData();
        store.pageTitle = "Posts";
    }
    fetchData(){
        console.log('Fetching Data');
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
            // console.log(response);

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(response.results),
                nextUrl: response.next,
                previousUrl: response.previous,
            });
            // console.log("dataSource in state:");
            // console.log(this.state.dataSource);
            store.dataSource = this.state.dataSource;
            // console.log("dataSource in store:");
            // console.log(store.dataSource);
            store.dataFetched = true;
            //console.log(store.dataFetched);
        }).catch((error) => console.log(error)).done();
    }
    renderItem(object){
        //console.log(object);
        return(
            <Card>
                <CardItem>
                    <Body>
                        <Text>{object.title}</Text>
                        <Text note>{object.publish}</Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }
    nextPage(){
        store.dataFetched = false;
        this.setState({
            url: this.state.nextUrl,
        }, () =>{
            console.log(this.state.url);
            this.fetchData();
        });
    }
    previousPage(){
        store.dataFetched = false;
        this.setState({
            url: this.state.previousUrl,
        }, () =>{
            console.log(this.state.url);
            this.fetchData();
        });
    }
    render() {
        if (store.dataFetched){
            return (
                <Container>
                <List>
                    <ListView
                    dataSource={store.dataSource}
                    renderRow={this.renderItem} />
                </List>
                <Button style={{marginTop: 20}} primary onPress={this.nextPage.bind(this)}><Text>Next Page</Text></Button>
                <Button style={{marginTop: 20}} primary onPress={this.previousPage.bind(this)}><Text>Previous Page</Text></Button>
                </Container>
            );
        }else{
            return(
                <Container>
                     <Spinner color='green' />
                     <Text>Fetching Data</Text>
                </Container>
            )
        }

    }
})
