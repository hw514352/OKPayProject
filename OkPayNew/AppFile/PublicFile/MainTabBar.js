import React, { Component } from 'react';
import { AppRegistry, StyleSheet, TouchableOpacity, DeviceEventEmitter, Image, Text, View, SafeAreaView, Button, StatusBar, Platform, NativeEventEmitter, NativeModules } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, StackViewTransitionConfigs } from 'react-navigation';

import LoginPage from '../Login/LoginPage';
import ForgetPasswordPage from '../Login/ForgetPasswordPage';

const CustomerNavigator = createStackNavigator({
    LoginPage: { screen: LoginPage },
    ForgetPasswordPage: { screen: ForgetPasswordPage },
})

export const TabBarRouter = createAppContainer(CustomerNavigator);