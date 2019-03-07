/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Alert, Button, Platform, StyleSheet, Text, TextInput, View, Switch, ScrollView, FlatList} from 'react-native';
import firebase from 'firebase';
import { createSwitchNavigator, createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import Modal from "react-native-modal";


const RNF_GLOBALS = {
    isDark: false
}

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
            <TextInput style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black'}} keyboardType={"email-address"} onChangeText={(username) => this.setState({username})} />
        </View>
        <View style={styles.inputboxStyle}>
            <Text>Password</Text>
            <TextInput style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black'}} secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
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

class profileMessage extends Component<Props> {

    constructor(props) {
        super(props)

        this.state = {
            username: "",
            userMessage: "",
            userMessageArr: [],
            idToken: ""
        }

        this.addItem = this.addItem.bind(this);
    }

    componentDidMount() {
        firebase.database().ref().child("messages").once("value", snapshot => {
            const data = snapshot.val()
            if(snapshot.val()) {
                const initMessages = [];
                Object.keys(data).forEach(message => {
                initMessages.push(data[message])
                });
            this.setState({userMessageArr: initMessages})
            }
        });

        firebase.database().ref().child('messages').on("child_added", snapshot => {
            const data = snapshot.val();
            if(data) {
                this.setState(prevState => ({
                    userMessageArr: [data, ...prevState.userMessageArr]
                }))
            }
        })

        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            firebase.auth().currentUser.getToken().then(token => this.setState({idToken: token}))
            this.setState({
                username: user.email
            });
        });
    }

    componentWillUnmount() {
        this.authSubscription()
    }

      addItem () {
        if (!this.state.userMessage) return;

        const newMessage = firebase.database().ref().child("messages").push();
        newMessage.set(this.state.userMessage, () => this.setState({userMessage: ''}))
      }

    render() {

        const addDate = new Date().toString();

        return (
            <View style={styles.container}>
                <ScrollView>
                    <FlatList data={this.state.userMessageArr}
                    renderItem={({item}) =>
                        <View style={{flex: 1}}>
                            <Text style={styles.listItem}>{item}</Text>
                            <Text>FROM: {this.state.username}</Text>
                            <Text>{this.state.idToken}</Text>
                            <Text>{addDate}</Text>
                        </View>
                    } />
                </ScrollView>
                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10}}>
                    <TextInput style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black'}} value={this.state.userMessage} onChangeText={(val) => {this.setState({userMessage: val})}}/>
                    <Button title='Send' onPress={this.addItem}/>
                </View>
            </View>
        );
    }
}

class profileFriendList extends Component<Props> {

    constructor() {
        super()

        this.state = {
            friendArr: [],
            isModalOpen: false,
            friend: ""
        }

        this._handleAddFriend = this._handleAddFriend.bind(this)
        this._handleAddFriendList = this._handleAddFriendList.bind(this)
    }

    _handleAddFriend = () => {
        this.setState({isModalOpen: !this.state.isModalOpen})
    }

    _handleAddFriendList = (friend) => {
        const createFriendList = [];
        createFriendList.push(friend)

        this.setState({
            friendArr: createFriendList
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <AwesomeButtonCartman type="secondary" onPress={this._handleAddFriend}>Add Friend</AwesomeButtonCartman>
                <View style={styles.inputboxStyle}>
                    <ScrollView>
                        <Modal isVisible={this.state.isModalOpen} backdropColor={'white'} onBackdropPress={() => {this.setState({isModalOpen: false})}}>
                            <View style={styles.container}>
                                <Text style={{fontSize: 20}}>Add Friend</Text>
                                <TextInput style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black'}} keyboardType={"email-address"} onChangeText={(friend) => this.setState({friend})} />
                                <Button title={"Add"} onPress={() => this._handleAddFriendList(this.state.friend)} />
                            </View>
                        </Modal>
                    </ScrollView>
                </View>
                    <Text style={{fontSize: 20}}>Friend List</Text>
                    <FlatList data={this.state.friendArr}
                    renderItem={({item}) =>
                        <View style={{flex: 1}}>
                            <Text style={styles.listItem}>{item}</Text>
                        </View>
                    } />
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
            isDarkTheme: RNF_GLOBALS.isDark
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

        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
        });
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
  messages: {
    marginBottom: 20,
    width: 100 + "%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'black'
  },
  listItem: {
    fontSize: 20,
    padding: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
