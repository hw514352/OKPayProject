import React, { Component } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, View, ScrollView, Image, Alert, Clipboard, Modal, StatusBar, DeviceEventEmitter, TouchableWithoutFeedback, NativeModules } from 'react-native';
import GlobalParameters from '../../PublicFile/GlobalParameters';

import AppStore from '../../MobxStore/AppStore';
import Images from '../../PublicFile/Images';
import MineStore from '../../MobxStore/MineStore';
import Toast from 'react-native-zzy-toast';
import ImagePicker from 'react-native-image-picker';
import { observer } from 'mobx-react/native';
import { observe } from 'mobx';

@observer
export default class UserInfoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "个人信息",
    })
    // 图片选择
    changeHeader() {
        const options = {
            title: '修改图像',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '从相册上传',
            allowsEditing: true, // 当用户选择过照片之后是否允许再次编辑图片
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.75,
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                setTimeout(() => {
                    MineStore.requestUploadImage("headPortraitUrl", Platform.OS === 'ios' ? response.uri : response.path)
                }, 200)
            }
        });
    }
    // 修改昵称
    gotoChangeNicknamePage() {
        const { navigate } = this.props.navigation;
        navigate("ChangeNicknamePage")
    }
    // 修改签名
    gotoChangeSignaturePage() {
        const { navigate } = this.props.navigation;
        navigate("ChangeSignaturePage")
    }
    // 我的二维码
    gotoMyQRCodePage() {
        const { navigate } = this.props.navigation;
        navigate("MyQRCode")
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    ref="statusBarView"
                    barStyle="dark-content"
                />
                <ScrollView>
                    <View style={{ flex: 1, marginTop:10, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity style={[styles.itemStyle, { height: 80 }]} onPress={() => { this.changeHeader() }}>
                            <Text style={{ fontSize: 15, color: 'black' }}>头像</Text>
                            <View style={{ flexDirection: 'row', alignItems:'center' }}>
                                <Image style={{ width: 60, height: 60, borderRadius: 3, backgroundColor:'#e5e5e5' }} source={{ uri: AppStore.userData.headPortraitUrl }} />
                                <Image style={{ width: 9, height: 17, marginHorizontal:15 }} source={Images.wallet_next_btn} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.itemStyle} onPress={() => { this.gotoChangeNicknamePage() }}>
                            <Text style={{ fontSize: 15, color: 'black' }}>昵称</Text>
                            <Image style={{ width: 9, height: 17, marginRight:15 }} source={Images.wallet_next_btn} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.itemStyle} onPress={() => {  }}>
                            <Text style={{ fontSize: 15, color: 'black' }}>手机号</Text>
                            <Text style={{ fontSize: 17, color: '#6F6C86', marginRight: 15}}>{AppStore.userData.mobilePhone}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.itemStyle} onPress={() => { this.gotoChangeSignaturePage() }}>
                            <Text style={{ fontSize: 15, color: 'black' }}>个人签名</Text>
                            <Image style={{ width: 9, height: 17, marginRight: 15 }} source={Images.wallet_next_btn} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.itemStyle} onPress={() => { this.gotoMyQRCodePage() }}>
                            <Text style={{ fontSize: 15, color: 'black' }}>我的二维码</Text>
                            <Image style={{ width: 9, height: 17, marginRight: 15 }} source={Images.wallet_next_btn} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F3F8'
    },
    itemStyle:{
        width: OKScreen.width - 15,
        height: 45,
        marginLeft: 15,
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
