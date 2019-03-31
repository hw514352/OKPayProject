import React, { Component } from 'react';
import { AppRegistry, Image } from 'react-native';
import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator, StackViewTransitionConfigs } from 'react-navigation';

import LaunchPage from '../Pages/Login/LaunchPage';
import LoginPage from '../Pages/Login/LoginPage';
import ForgetPasswordPage from '../Pages/Login/ForgetPasswordPage';
import Images from './Images';
import CustomTabBar from './CustomTabBar';

import HomePage from '../Pages/Home/HomePage';
import ChatTabBarPage from '../Pages/Chat/ChatTabBarPage';
import OkpayMainPage from '../Pages/Okpay/OkpayMainPage';
import ShopMainPage from '../Pages/Shop/ShopMainPage';
import MinePage from '../Pages/Mine/MinePage';

//登录跳转页面
const LoginStackNavigator = createStackNavigator(
    {
        LoginPage: { screen: LoginPage },
        ForgetPasswordPage: { screen: ForgetPasswordPage },
    },
    {
        initialRouteName: 'LoginPage',
        mode: 'card',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'white',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
            },
            //全局默认返回按钮样式
            headerBackImage: (
                <Image source={Images.Ok_back_btn}
                    style={{ width: OKScreen.navigationHeight - OKScreen.statusBarHeight, height: OKScreen.navigationHeight - OKScreen.statusBarHeight, resizeMode: 'center' }} />
            )
        },
    }
);

const MainTabBar = createBottomTabNavigator(
    {
        HomePage: { screen: HomePage },
        ChatTabBarPage: { screen: ChatTabBarPage },
        OkpayMainPage: { screen: OkpayMainPage },
        ShopMainPage: { screen: ShopMainPage },
        MinePage: { screen: MinePage },
    },
    {
        initialRouteName: 'OkpayMainPage',
        backBehavior: 'initialRoute',
        lazy: true,
        tabBarComponent: (props, { navigation }) => {
            return (
                //自定义tabbar
                <CustomTabBar navigation={props.navigation} />
            )
        }
    }
)

//常规跳转页面
const NormalStackNavigator = createStackNavigator(
    {
        MainTabBar: { screen: MainTabBar },
    },
    {
        initialRouteName: 'MainTabBar',
        mode: 'card',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'white',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
            },
            //全局默认返回按钮样式
            headerBackImage: (
                <Image source={Images.Ok_back_btn}
                    style={{ width: OKScreen.navigationHeight - OKScreen.statusBarHeight, height: OKScreen.navigationHeight - OKScreen.statusBarHeight, resizeMode: 'center' }} />
            )
        },
    }
);

//处理modal跳转需求
const NormalModalNavigator = createStackNavigator(
    {
        NormalStackNavigator: { screen: NormalStackNavigator },
        HomePage: { screen: HomePage },
    },
    {
        initialRouteName: 'NormalStackNavigator',
        mode: 'modal',
        headerMode: 'none',//无导航
    }
)

//处理只显示一次的页面 如启动广告页
const SwitchNavigator = createSwitchNavigator(
    {
        LaunchPage: { screen: LaunchPage },
        LoginStackNavigator: { screen: LoginStackNavigator },
        NormalModalNavigator: { screen: NormalModalNavigator }
    },{
        initialRouteName: 'LaunchPage',
        resetOnBlur: true,
    }
)

export default SwitchNavigator;