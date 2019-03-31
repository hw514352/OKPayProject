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
        let tabBarInfo = [{ name: '娱乐', icon: index == 0 ? Images.Images.tab_icon_game_default : Images.tab_icon_game_pressed},
            { name: '消息', icon: index == 1 ? Images.tab_icon_chat_default : Images.tab_icon_chat_pressed },
            { name: 'okpay', icon: index == 2 ? Images.tabOk : Images.tabokN },
            { name: '商城', icon: index == 3 ? Images.tab_icon_store_default : Images.tab_icon_store_pressed },
            { name: '我的', icon: index == 4 ? Images.tab_icon_mine_default : Images.tab_icon_mine_pressed }];
        return (
            <View style={{ width: OKScreen.width, height: OKScreen.tabBarHeight, borderTopWidth: 1, borderTopColor: OKColor.lineColor, flexDirection: 'row' }}>
                {tabBarInfo.map((item,index1)=>{
                    // if (index == 2) {
                    //     return (
                    //         <TouchableOpacity onPress={() => {
                    //             this.props.navigation.navigate("PropertyPager")
                    //         }} style={{ position: 'absolute', alignItems: 'center', width: GCStyle.GCWidth * 0.2, height: 70, bottom: GCStyle.tabBArHeight - 49, left: (GCStyle.GCWidth * 0.4), backgroundColor: 'rgba(0,0,0,0)', }}>
                    //             <Image style={[styles.tabImg, { height: 57, marginTop: 3, width: 55, resizeMode: 'contain', }]} source={index == 2 ? Images.tabOk : Images.tabokN} />
                    //             <Text style={[styles.tabText, { width: GCStyle.GCWidth * 0.2, textAlign: 'center', position: 'absolute', alignSelf: 'center', color: '#424242' }]}>{GCApp.appName}</Text>
                    //         </TouchableOpacity>
                    //     )
                    // }
                    return (
                        <TouchableOpacity style={styles.tabBnStyle}
                            onPress={() => {
                                // this.props.navigation.navigate("HomePage")
                            }} >
                            <Image style={styles.tabImg} source={Images.tab_icon_store_default}/>
                            <Text style={styles.tabText}>12</Text>
                        </TouchableOpacity>
                    )
                })}
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