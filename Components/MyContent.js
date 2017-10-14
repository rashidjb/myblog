import React from 'react';
import { View, Picker, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text  } from 'native-base';
import { observer } from "mobx-react";
import {NativeRouter, Route, Link, Redirect} from 'react-router-native';

import store from '../Store';
import Login from './Login';
import Posts from './Posts';
import PostDetails from './PostDetails';
import NewPost from './NewPost';
import SignOut from './SignOut';
import Update from './Update';

export default observer(class MyContent extends React.Component {


    isAuthenticated(){
        if (this.props.store.authenticated){
        //if (true){
            return(
                <Footer>
                    <FooterTab>
                        <Button>
                            <Link exact to='/SignOut'>
                                <View>
                                    <Icon name="person" />
                                </View>
                            </Link>
                        </Button>
                        <Button>
                            <Link exact to='/Posts'>
                                <View>
                                    <Icon name="apps" />
                                </View>
                            </Link>
                        </Button>
                        <Button>
                            <Link exact to='/NewPost'>
                                <View>
                                    <Icon name="camera" />
                                </View>
                            </Link>
                        </Button>
                    </FooterTab>
                </Footer>
            )
        }
    }
  render() {
    return (
            <NativeRouter>
                <Container style={{backgroundColor: 'gainsboro'}}>
                    <Content padder>
                        <Route exact path="/" render={()=><Login store={this.props.store}/>} />
                        <Route exact path="/SignOut" render={()=><SignOut store={this.props.store}/>} />
                        <Route exact path="/Posts" render={()=><Posts store={this.props.store}/>} />
                        <Route exact path="/NewPost" render={()=><NewPost store={this.props.store}/>} />
                        <Route exact path="/PostDetails" render={()=><PostDetails store={this.props.store}/>} />
                        <Route exact path="/Update" render={()=><Update store={this.props.store}/>} />
                    </Content>
                    {this.isAuthenticated()}
                </Container>
            </NativeRouter>
    );
  }
})
//
// <Route exact path="/" render={() => (
//     this.props.store.authenticated ? (
//     <Redirect exact to="/Posts"/>
//     ) : (
//     <Login store={store}/>
//     )
//     )}/>
