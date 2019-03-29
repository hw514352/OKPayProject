import React, { Component } from 'react';
import { StatusBar, Platform, TextInput, StyleSheet, Text, View, ScrollView } from 'react-native';
// import GCStyle from '../../configs/GCStyle'

// import { observer } from 'mobx-react/native';
// import { observe } from 'mobx';
// import Toast from 'react-native-zzy-toast';
import SmsCodeButton from '../CustomComponents/SmsCodeButton';
import LoginStore from '../MobxStore/LoginStore';

// @observer
export default class ForgetPasswordPage extends Component {
    constructor(props) {
        super(props);
        SystemSettingthis = this;
        this.state = {
            barStyle: 'dark-content',
            inputPhone: '',
            smsCode: '',
            newPassward: '',
            newPasswardAgain: '',
            isPhoneFocus: false,
            promptErrorText: '' // 错误提示
        };
    }

    componentDidMount() {
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: "修改登录密码",
        // headerLeft: GCStyle.leftBackBn(() => {
        //     navigation.goBack()
        //     SystemSettingthis.setState({
        //         barStyle: "dark-content"
        //     })
        // }),
    })

    render() {
        return (
            <View style={styles.container}>
                <StatusBar ref="statusBarView" barStyle={this.state.backTopGround} />
                <ScrollView>
                    <View style={{ flex: 1, marginTop: 15, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {this.props.navigation.state.params.isHideInputPhone ? null :
                            <TextInput
                                clearButtonMode={'while-editing'}
                                maxLength={11}
                                underlineColorAndroid={'transparent'}
                                onFocus={() => {
                                    this.setState({ isPhoneFocus: true, promptErrorText: '' })
                                }}
                                onBlur={() => {
                                    this.setState({ isPhoneFocus: false })
                                }}
                                onChangeText={(inputPhone) => {
                                    this.setState({ inputPhone });
                                }}
                                value={this.state.inputPhone}
                                underlineColorAndroid="transparent"
                                keyboardType={Platform.OS === 'ios' ? "number-pad" : "numeric"}
                                style={styles.textInput}
                                placeholder="手机号" placeholderTextColor="#B1B2B8" />
                        }

                        <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                            <TextInput
                                clearButtonMode={'while-editing'}
                                maxLength={6}
                                underlineColorAndroid={'transparent'}
                                onFocus={() => {
                                    this.setState({ isPhoneFocus: true, promptErrorText: '' })
                                }}
                                onBlur={() => {
                                    this.setState({ isPhoneFocus: false })
                                }}

                                onChangeText={(smsCode) => {
                                    this.setState({ smsCode });
                                }} value={this.state.smsCode}
                                underlineColorAndroid="transparent"
                                keyboardType={Platform.OS === 'ios' ? "number-pad" : "numeric"}
                                style={[styles.textInput, { marginLeft: 0 }]}
                                placeholder="输验证码" placeholderTextColor="#B1B2B8" />

                            <View style={{ marginRight: 15, marginLeft: 10 }}>
                                <SmsCodeButton countdownTxt='s' normalTxt='验证码' ref='smsCodeBn'
                                    // phone={this.props.navigation.state.params.isHideInputPhone ? AppStore.userData.mobilePhone : this.state.inputPhone}
                                    senderMessage={() => this.senderMessage()}
                                    codeButtonStyle={{ height: 30, width: 80, backgroundColor: OKColor.buttonBackgroundColorColor, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}
                                    codeButtonTextStyle={{ fontSize: 15, color: 'white' }} />
                            </View>

                        </View>
                        <TextInput
                            clearButtonMode={'while-editing'}
                            maxLength={20}
                            underlineColorAndroid={'transparent'}
                            onFocus={() => {
                                this.setState({ isPhoneFocus: true, promptErrorText: '' })
                            }}
                            onBlur={() => {
                                this.setState({ isPhoneFocus: false })
                            }}
                            onChangeText={(newPassward) => {
                                this.setState({ newPassward });
                            }}
                            value={this.state.newPassward}
                            underlineColorAndroid="transparent"
                            keyboardType={Platform.OS === 'ios' ? "email-address" : "numeric"}
                            secureTextEntry={true}
                            style={styles.textInput}
                            placeholder="新密码" placeholderTextColor="#B1B2B8" />

                        <TextInput
                            clearButtonMode={'while-editing'}
                            maxLength={20}
                            underlineColorAndroid={'transparent'}
                            onFocus={() => {
                                this.setState({ isPhoneFocus: true, promptErrorText: '' })
                            }}
                            onBlur={() => {
                                this.setState({ isPhoneFocus: false })
                            }}
                            onChangeText={(newPasswardAgain) => {
                                this.setState({ newPasswardAgain });
                            }}
                            value={this.state.newPasswardAgain}
                            underlineColorAndroid="transparent"
                            keyboardType={Platform.OS === 'ios' ? "email-address" : "numeric"}
                            secureTextEntry={true}
                            style={styles.textInput}
                            placeholder="确认密码"
                            placeholderTextColor="#B1B2B8" />

                    </View>

                    {this.state.promptErrorText ?
                        <Text style={{ color: '#FF3355', marginLeft: 18, marginTop: 12, marginBottom: -3 }}>{this.state.promptErrorText}</Text>
                        : null}

                    <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                        {/* {GCStyle.GRBn('完成', OKColor.buttonBackgroundColorColor, 0, this.modifyLoginPassword.bind(this), GCStyle.GCWidth - 50)} */}
                    </View>


                </ScrollView>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F3F8',
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        fontSize: 15,
        color: 'black',
        height: 45,
        width: OKScreen.width - 15,
        marginLeft: 15,
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: 1
    },
});