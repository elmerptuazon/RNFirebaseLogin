/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import firebase from 'firebase';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

  const config = {
    apiKey: "AIzaSyBrGJiUeCKfcn-tl3-_uIXX7cEoYiDJlyw",
    authDomain: "awesomeproject-63878.firebaseapp.com",
    databaseURL: "https://awesomeproject-63878.firebaseio.com",
    projectId: "awesomeproject-63878",
    storageBucket: "awesomeproject-63878.appspot.com",
  };
  firebase.initializeApp(config);

type Props = {};

export default class App extends Component<Props> {
    render() {
        return <AppContainer />
    }
}

class MainApp extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }
    }

    handleSignup = (email, password) => {
        try{
            firebase.auth().createUserWithEmailAndPassword(email, password)
        }
        catch(err) {
            console.log(err.toString())
        }
    }

    handleLogin = (email, password) => {
        try{
            firebase.auth().signInWithEmailAndPassword(email, password).then(() => this.props.navigation.navigate('Profile'))
        }
        catch(err) {
            console.log(err.toString())
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, textAlign: 'center', color: 'black'}}>RNFirebase Login</Text>
        <View style={styles.inputboxStyle}>
            <Text>Username</Text>
            <TextInput keyboardType={"email-address"} onChangeText={(username) => this.setState({username})} />
        </View>
        <View style={styles.inputboxStyle}>
            <Text>Password</Text>
            <TextInput secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
        </View>
        <View style={styles.inputboxStyle}>
            <Button title={"Login"} onPress={() => this.handleLogin(this.state.username, this.state.password)} />
            <Button title={"Sign Up"} onPress={() => this.handleSignup(this.state.username, this.state.password)} />
        </View>
      </View>
    );
  }
}

class Profile extends Component<Props> {

    constructor() {
        super()
        this.state = {
            username: ""
        }
    }

    handleLogout = () => {
        this.props.navigation.navigate('MainApp')
    }

    componentDidMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            console.log(user)
            this.setState({
                username: user.email
            })
        });
    }

    componentWillUnmount() {
        this.authSubscription()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{margin: 20, width: 100, height: 50}}>
                    <Button title={"Logout"} onPress={() => this.handleLogout()}/>
                </View>
                <View style={styles.inputboxStyle}>
                    <Text style={{fontSize: 20, textAlign: 'center', color: 'black'}}>Email Logged In: {this.state.username}</Text>
                </View>
            </View>
        )
    }
}

const RootStack = createSwitchNavigator(
    {
        'MainApp': MainApp,
        'Profile': Profile
    },
    {
        initialRouteName: 'MainApp'
    }
);

const AppContainer = createAppContainer(RootStack)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  inputboxStyle: {
    margin: 20,
    height: 50,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
