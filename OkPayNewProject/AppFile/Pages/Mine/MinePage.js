import React, { Component } from 'react';
import { Alert, Linking, Image, TouchableOpacity, StyleSheet, Text, View, Platform, DeviceEventEmitter, FlatList } from 'react-native';
import GlobalParameters from '../../PublicFile/GlobalParameters';

import Images from '../../PublicFile/Images';
import { observer } from 'mobx-react/native';
import { observe } from 'mobx';

import AppStore from '../../MobxStore/AppStore';
import MineStore from '../../MobxStore/MineStore';
import OkpayStore from '../../MobxStore/OkpayStore';
import ShopStore from '../../MobxStore/ShopStore';

import Toast from 'react-native-zzy-toast';
import ServiceUrl from '../../PublicFile/ServiceUrl';

@observer
export default class MinePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickNameStr: AppStore.userData.nickName,
            isEditNick: false,
            version: 'V: H:',
            walletNote: 0,
            walletAddress: '',
            walletNoteName: '区块链钱包',
        };
        this.olbValue = ''
    }
    componentDidMount() {
        MineStore.getUserInfo();
        OkpayStore.GetETCWalletData();

        observe(OkpayStore, 'ETCWalletListData', (change) => {
            //  判断请求数据
            if (OkpayStore.ETCWalletListData.slice().length > 0) {
                AppStore.setIsWallet(true)
                //请求首页面接口
                OkpayStore.GetETHWalletPageData(OkpayStore.ETCWalletListData[0].id)
            } else {
                this.setState({
                    walletNote: "创建/导入钱包",
                    walletAddress: '',
                    walletNoteName: '区块链钱包',
                })
                AppStore.setIsWallet(false)
            }
        });
        observe(OkpayStore, 'ETHWalletPageDetail', (change) => {
            if (OkpayStore.ETHWalletPageDetail != null) {
                //刷新ui
                this.setState({
                    walletNote: OkpayStore.ETHWalletPageDetail.note ? OkpayStore.ETHWalletPageDetail.balance : '创建/导入钱包',
                    walletAddress: OkpayStore.ETHWalletPageDetail.walletName,
                    walletNoteName: OkpayStore.ETHWalletPageDetail.note ? OkpayStore.ETHWalletPageDetail.note : '区块链钱包',

                })
            }
        });
        observe(MineStore, 'isUpdateMember', (change) => {
            if (MineStore.isUpdateMember) {
                MineStore.setisUpdateMember(false)
                Toast.show('修改成功')
                MineStore.getUserInfo();
            }
        });
        observe(MineStore, 'isUserRefresh', (change) => {
            if (MineStore.isUserRefresh) {
                MineStore.setisUserRefresh(false)
                this.setState({ nickNameStr: AppStore.userData.nickName });
            }
        });
        //消息监听
        this.deEmitter = DeviceEventEmitter.addListener('refleshWalletList', (a) => {
            OkpayStore.GetETCWalletData();
        });

        ShopStore.requestShopInfo()
        this.updateInfoEmitter = DeviceEventEmitter.addListener('updateShopInfo', (data) => {
            ShopStore.requestShopInfo()
        });
    }

    componentWillUnmount() {
        this.deEmitter.remove();
        this.updateInfoEmitter.remove();
    }

    // 点击 邀请码
    InviteCodeClick() {
        const { navigate } = this.props.navigation;
        navigate("MyOrder")
    }

    // 点击 邀请好友
    InviteFriend() {
        const { navigate } = this.props.navigation;
        navigate("AboutWe")
    }

    // 点击 签到领收益
    SignInClick() {
        const { navigate } = this.props.navigation;
        navigate("AddFeedback")
    }

    // 点击 数据中心
    DataCenterClick() {
        const { navigate } = this.props.navigation;
        navigate("DataCenterPage")
    }

    // 联系客服
    ChangeDealPwdClick() {
        let phone = AppStore.configsData.service_telephone ? AppStore.configsData.service_telephone.value : ''
        Alert.alert(null,
            '客服热线：' + phone,
            [
                {
                    text: '取消',
                    style: 'cancel'
                },
                {
                    text: '拨打',
                    onPress: () => Linking.openURL('tel:' + phone)
                },
            ],
            {
                cancelable: true,
                onDismiss: () => {
                    // empty
                }
            });
    }
    //我的二维码
    toMyQRView() {
        const { navigate } = this.props.navigation;
        navigate("MyQRCode")
    }

    toWallet() {
        const { navigate } = this.props.navigation;
        navigate("WalletMainPage")
    }
    // 点击 关于我们
    AboutWeClick() {
        const { navigate } = this.props.navigation;
        navigate("AboutWe")
    }
    //我的页面操作
    mineMenuAction = (index) => {
        //0个人资料 1开店申请 2邀请好友 3意见反馈 4系统设置
        const { navigate, push } = this.props.navigation;
        if (index == 0) {
            navigate("UserInfoPage");
        } else if (index == 1) {
            if (ShopStore.shopInfo != null) {
                // 0-待审核，1-审核通过待付款，2-正常店铺，3-审核不通过，4-已冻结
                let status = ShopStore.shopInfo.status
                if (status == 1) {
                    // cashState = 0 未申请退押金  cashState = 1 已申请退押金
                    if (ShopStore.shopInfo.cashState == 1) {
                        navigate('DepositProgress')
                    } else {
                        navigate('ApplyOpenShopSuccess', { type: 2 })
                    }
                } else if (status == 3) {
                    navigate('ApplyOpenShopSuccess', { type: 3 })
                } else if (status == 0) {
                    navigate('OpenShopApplyTwoPage')
                } else if (status == 2) {
                    Toast.show('店铺已冻结，请联系客服!')
                }
            } else {
                navigate('OpenShopApplyOnePage')
            }
        } else if (index == 2) {
            push('BaseWebView', {
                title: '邀请好友',
                url: ServiceUrl.invite_h5 + '?token=' + AppStore.userToken + '&id=' + AppStore.userData.id,
            })
        } else if (index == 3) {
            navigate("AddFeedback");
        } else if (index == 4) {
            navigate("SystemSetting");
        }
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1, backgroundColor: '#EDEDED' }}
                contentContainerStyle={{ paddingHorizontal: 10, width: OKScreen.width, 
                    borderRadius: 13, overflow: 'hidden'}}
                data={
                    [{ title: '个人资料', image: Images.my_person_icon },
                    { title: '开店申请', image: Images.open_shop_apply },
                    { title: '邀请好友', image: Images.my_invitefriends_icon },
                    { title: '意见反馈', image: Images.my_suggestion_icon },
                    { title: '系统设置', image: Images.my_settings_icon }]
                }
                showsVerticalScrollIndicator={false}
                renderItem={this._renderItem}
                ListHeaderComponent={this._ListHeaderComponent}
                ListFooterComponent={this._ListFooterComponent}
                refreshing={false}
                onRefresh={() => {
                    MineStore.getUserInfo();
                }}
                keyExtractor={(item, index) => item.title}
                getItemLayout={(data, index) => ({ length: 57, offset: 57 * index, index })}
            />
        );
    }
    _ListHeaderComponent = () => {
        let headerurl = AppStore.userData.headPortraitUrl ? AppStore.userData.headPortraitUrl : ServiceUrl.defaultAvatar;
        let tempMemberType = ''
        switch (AppStore.userData.memberType) {
            case 0:
                tempMemberType = Images.tourist_level_bg;
                break;
            case 1:
                tempMemberType = Images.general_level_bg;
                break;
            case 2:
                tempMemberType = Images.vip_level_bg;
                break
            default:
        }
        return (
            <View style={{ height: OKScreen.statusBarHeight + 80 + 170 + 40}}>
                <View style={{ height: OKScreen.statusBarHeight + 80, flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'flex-end', paddingBottom: 3, marginLeft: 21 }}>
                        <Text style={{ height: 28, fontSize: 20, fontWeight: 'bold', color: '#C17D0D' }}>{AppStore.userData.nickName}</Text>
                        <Text style={{ height: 19, fontWeight: 'bold', color: '#9B9B9B', fontSize: 13 }}>{AppStore.userData.mobilePhone}</Text>
                    </View>
                </View>

                {/* 钱包 */}
                <TouchableOpacity style={{ height: 170 + 40, alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 13, borderTopRightRadius: 13 }}
                    activeOpacity={1}
                    onPress={() => {
                        this.toWallet()
                    }}>
                    <Image style={{ resizeMode: 'stretch', width: '100%', height: 170, position: 'absolute' }} source={Images.my_top_bg} />
                    <View style={{ alignSelf: 'flex-start', height: 26, marginTop: 25, justifyContent: 'center', backgroundColor: '#DBAA58', borderRadius: 13, marginLeft: 12 }}>
                        <Text style={{ maxWidth: OKScreen.width * 0.6, fontSize: 15, color: 'white', fontWeight: 'bold', marginHorizontal: 12 }}>
                            {this.state.walletNoteName}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 13, marginRight: 4 }}>
                        <Text style={{ height: 42, fontSize: 30, color: 'white', fontWeight: 'bold' }}>{this.state.walletNote}</Text>
                        <Text style={{ height: 25, fontSize: 18, color: 'white', fontWeight: 'bold', alignSelf: 'flex-end', marginBottom: 4 }}>{OkpayStore.ETHWalletPageDetail != null ? "ETH" : ""}</Text>
                    </View>
                    <Text style={{ height: 21, fontSize: 15, fontWeight: 'bold', color: 'white', marginHorizontal: 12, marginTop: 5 }} numberOfLines={2}>
                        {this.state.walletAddress}
                    </Text>
                </TouchableOpacity>

                {/* 头像 */}
                <View style={{ position: 'absolute', right: 27, top: OKScreen.statusBarHeight + 33, alignItems: 'center' }}>
                    <Image style={{ width: 64, height: 64, borderRadius: 5, borderColor: '#DCB46B', borderWidth: 3 }} source={{ uri: headerurl }} />
                    <View style={{ width: 73, height: 23, paddingBottom: 2, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ position: 'absolute', width: 73, height: 23 }} source={tempMemberType} resizeMode="contain" />
                    </View>
                </View>
            </View>
        )
    }
    _ListFooterComponent = () => {
        return (
            <View style={{ height: 60, backgroundColor: 'white', borderBottomLeftRadius: 13, borderBottomRightRadius: 13 }} />
        )
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity style={{
                height: 57, borderBottomWidth: 1, borderBottomColor: '#EFEFEF', flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 10
            }}
                activeOpacity={1}
                onPress={() => {
                    this.mineMenuAction(index);
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Image style={{ width: 30, height: 30 }} source={item.image} />
                    <Text style={{ marginLeft: 14, fontSize: 15, fontWeight: 'bold', color: 'black', alignSelf: 'center' }}>{item.title}</Text>
                </View>
                
                {index == 2 ? 
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, color: '#6F6C86', fontWeight: 'bold', marginRight: 10 }}>
                            我的邀请码{AppStore.userData.inviteCode ? AppStore.userData.inviteCode : ''}
                        </Text>
                        <Image style={styles.cellArrowImage} source={Images.my_next_btn} />
                    </View>
                    : 
                    <Image style={styles.cellArrowImage} source={Images.my_next_btn} />
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    cellItem: {
        width: OKScreen.width - 34,
        height: 57,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        flexDirection: 'row',
        marginHorizontal: 17,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cellArrowImage: {
        width: 10,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    }
});