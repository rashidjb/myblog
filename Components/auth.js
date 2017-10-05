import {observer} from 'mobx-react';
import store from '../Store';
import {AsyncStorage} from 'react-native';

const auth = observer(new class auth {
    login(username,password){
        this.getToken(username,password);
    }

    logout(){
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('username');
        store.authenticated = false;
        store.token = "";
        store.username = "";
    }
    firstLoad() {
        if (this.loggedIn()) {
            AsyncStorage.getItem('token').then((x) => store.token = x)
            store.authenticated = true;
            AsyncStorage.getItem('username').then((x) => store.token = x)
        }
    }
    loggedIn(){
        AsyncStorage.getItem('token',
            (err, result) => {
                if(!err && result != null){
                    return true;
                }else{
                    return false;
                }
            }
        )
    }


    signup(username,password){
        fetch('http://139.59.119.40/api/register/',
            {
                method: 'POST',
                headers:{
                    "Accept": 'application/json',
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                })
            }
        )
        .then(
            function(res){
                console.log(username, password)
                this.getToken(username,password)
            }.bind(this)
        ).catch((error) => console.log(error)).done();
    }

    getToken(username,password){
        fetch('http://139.59.119.40/api/login/', {
            method: 'POST',
            headers:{
                "Accept": 'application/json',
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        .then((res) => res.json())
        .then((res) => {
            store.token = res.token;
            store.username = res.username;
            AsyncStorage.setItem('token', res.token);
            AsyncStorage.setItem('username', res.username);
            //console.log(res.username);
            //console.log(store.token);
            store.authenticated = true;
        }).catch((error) => console.log(error)).done();
    }
})
export default auth;
