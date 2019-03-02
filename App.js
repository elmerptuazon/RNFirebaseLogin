/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, TextInput, View, Switch, ScrollView} from 'react-native';
import firebase from 'firebase';
import { createSwitchNavigator, createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

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
            username: "qwerty@qwerty.com",
            password: "qwerty"
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
        </View>
        <View style={styles.inputboxStyle}>
            <Button title={"Signup"} onPress={() => this.handleSignup(this.state.username, this.state.password)} />
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

class profileMessage extends Component<Props> {
    render() {
        return (
            <View>
                <Text>Message</Text>
            </View>
        );
    }
}

class profileFriendList extends Component<Props> {
    render() {
        return (
            <View>
                <Text>Friend</Text>
            </View>
        );
    }
}

class profileSettings extends Component<Props> {

    constructor() {
        super()
        this.state = {
            username: "",
            switchbutton: false,
            isDarkTheme: false
        }
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

    handleDarkTheme = (val) => {
        this.setState({isDarkTheme: val})
    }

    handleLinkFb = (val) => {
        this.setState({switchbutton: val})
    }

    handleLogout = () => {
        this.props.navigation.navigate('MainApp')
    }

    render() {
        return (
            <View style={this.state.isDarkTheme ? styles.containerBlackTheme : styles.container}>
                <ScrollView>
                <View style={styles.inputboxStyle}>
                    <Text style={this.state.isDarkTheme ? {fontSize: 20, textAlign: 'center', color: 'white'} : {fontSize: 20, textAlign: 'center', color: 'black'}}>Email Logged In: {this.state.username}</Text>
                </View>
                <View style={{flex: 1, width: 'auto', padding:20, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Text style={this.state.isDarkTheme ? {color: 'white'} : {color: 'black'}}>Dark Theme</Text>
                    <Switch onValueChange={this.handleDarkTheme} value={this.state.isDarkTheme} />
                </View>
                <View style={{flex:1,width: 'auto', padding:20, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Text style={this.state.isDarkTheme ? {color: 'white'} : {color: 'black'}}>Link to Facebook</Text>
                    <Switch onValueChange={this.handleLinkFb} value={this.state.switchbutton} />
                </View>
                <View style={{width: 200, padding:20, flexDirection: 'row'}}>
                    <Button title={"Logout"} onPress={() => this.handleLogout()}/>
                </View>
                </ScrollView>
            </View>
        );
    }
}

const profileTopNavigator = createMaterialTopTabNavigator({
    'messages': profileMessage,
    'friends': profileFriendList,
    'settings': profileSettings
})

const RootStack = createSwitchNavigator(
    {
        'MainApp': MainApp,
        'Profile': profileTopNavigator
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
  containerBlackTheme: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: 'black'
    },
  inputboxStyle: {
    margin: 20,
    height: 40,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
