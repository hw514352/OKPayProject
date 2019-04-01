import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Images from './Images';
import GlobalParameters from './GlobalParameters';

export default class CustomTabBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // unreadNum: 0, // 未读消息数量
            // newFriendNum: 0, // 未处理好友申请
            // totalRedNum: 0 // 合计红点数量
        }
    }
    componentDidMount() {
        // // 获取未读消息数量
        // if (Platform.OS === 'android') {
        //     NativeModules.IMModule.getUnreadMessageCount();
        //     // 新好友申请
        //     DeviceEventEmitter.addListener('FriendsApplyNumberChange', (data) => {
        //         this.setState({
        //             newFriendNum: data.applyNum
        //         });
        //         this.setState({
        //             totalRedNum: (parseInt(this.state.unreadNum) + parseInt(this.state.newFriendNum))
        //         })
        //     });
        // } else {
        //     //主动获取未读信息数
        //     MyBridgeModule.getUnreadMessageCountWithCallback((unreadNum) => {
        //         this.setState({
        //             unreadNum: unreadNum,
        //             totalRedNum: unreadNum + this.state.newFriendNum
        //         })
        //     })
        //     //主动获取好友申请数
        //     MyBridgeModule.getFriendsApplyCountWithCallback((applyNum) => {
        //         this.setState({
        //             newFriendNum: applyNum,
        //             totalRedNum: applyNum + this.state.unreadNum
        //         })
        //     })
        //     //好友申请数监听
        //     this.friendsApplyEmitter = calendarManagerEmitter.addListener('FriendsApplyNumberChange', (notification) => {
        //         this.setState({
        //             newFriendNum: notification.applyNum,
        //             totalRedNum: notification.applyNum + this.state.unreadNum
        //         })
        //     });
        // }

        // //未读信息数监听
        // this.subscription = calendarManagerEmitter.addListener('UnreadNumberChange', (notification) => {
        //     this.setState({
        //         unreadNum: notification.unreadNum ? notification.unreadNum : 0
        //     })
        //     this.setState({
        //         totalRedNum: (parseInt(this.state.unreadNum) + parseInt(this.state.newFriendNum))
        //     })
        // }
        // );
    }

    componentWillUnMount() {
        // this.subscription.remove();
    }

    render() {
        let routeName = this.props.navigation.state.routeName;
        let index = this.props.navigation.state.index;
        return (
            <View style={{ width: OKScreen.width, height: OKScreen.tabBarHeight, borderTopWidth: 1, borderTopColor: OKColor.lineColor,
                flexDirection: 'row', backgroundColor: 'white' }}>
                <TouchableOpacity style={styles.tabBnStyle} activeOpacity={1}
                    onPress={() => {
                        this.props.navigation.navigate("HomePage")
                    }} >
                    <Image style={styles.tabImg} source={index == 0 ? Images.tab_icon_game_pressed : Images.tab_icon_game_default} />
                    <Text style={styles.tabText}>娱乐</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabBnStyle} activeOpacity={1}
                    onPress={() => {
                        this.props.navigation.navigate("ChatTabBarPage")
                    }} >
                    <Image style={styles.tabImg} source={index == 1 ? Images.tab_icon_chat_pressed : Images.tab_icon_chat_default} />
                    <Text style={styles.tabText}>消息</Text>
                </TouchableOpacity>
                
                <View style={styles.tabBnStyle}>
                    <TouchableOpacity style={{ position: 'absolute', width: '100%', height: 68, bottom: 0, left: 0, alignItems: 'center' }} activeOpacity={1}
                        onPress={() => {
                            this.props.navigation.navigate("OkpayMainPage")
                        }} >
                        <Image style={{ height: 57, width: 55, resizeMode: 'contain' }} source={index == 2 ? Images.tabOk : Images.tabokN} />
                        <Text style={[styles.tabText, { height: 12, marginTop: -3} ]}>okpay</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.tabBnStyle} activeOpacity={1}
                    onPress={() => {
                        this.props.navigation.navigate("ShopMainPage")
                    }} >
                    <Image style={styles.tabImg} source={index == 3 ? Images.tab_icon_store_pressed : Images.tab_icon_store_default} />
                    <Text style={styles.tabText}>商城</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabBnStyle} activeOpacity={1}
                    onPress={() => {
                        this.props.navigation.navigate("MinePage")
                    }} >
                    <Image style={styles.tabImg} source={index == 4 ? Images.tab_icon_mine_pressed : Images.tab_icon_mine_default} />
                    <Text style={styles.tabText}>我的</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabBnStyle: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 7
    },
    tabImg: {
        width: 21,
        height: 21,
        resizeMode: 'contain'
    },
    tabText: {
        fontSize: 12,
        marginTop: 6,
        color: '#424242',
        bottom: 2
    }
});