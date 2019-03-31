import React, { Component } from 'react';
import { Platform, YellowBox, TouchableOpacity, TextInput, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import GlobalParameters from '../../PublicFile/GlobalParameters';
import SmsCodeButton from '../../CustomComponents/SmsCodeButton';
import Toast from 'react-native-zzy-toast';
import LoginStore from '../../MobxStore/LoginStore';
import PublicMethods from '../../PublicFile/PublicMethods';
import OKStorage from '../../PublicFile/OKStorage';
import { observer } from 'mobx-react/native';
import { observe } from 'mobx';

@observer
export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chooseIndex: 0,// 选择登录还是注册
      loginPhone: '',
      loginSmsCode: '',// 登录密码或登录验证码
      registerPhone: '',
      registerSmsCode: '', 
      invitationCode: '',
      nickname: '',
      isPasswordLogin: true //是否密码登录模式
    };
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    header: null
  })

  componentDidMount() {
    // SplashScreen.hide();
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

    // 检索最后一次登录的号码
    OKStorage.read(LastLoginPhone).then((ret) => {
      if (ret) {
        this.setState({ loginPhone: ret })
      }
    }).catch(() => { });

    // 登录监听
    observe(LoginStore, 'isSuccesslogin', (change) => {
      if (LoginStore.isSuccesslogin) {
        LoginStore.isSuccesslogin = false;
        //登录成功进入主页
        Toast.show('登录成功进入主页');
        this.props.navigation.navigate('NormalModalNavigator');
      }
    });
  }

  changeLoginAndRegister(index) {
    if (this.state.chooseIndex != index) {
      this.refs.scrollView.scrollTo({ x: OKScreen.width * index, y: 0, animated: Platform.OS === 'ios' });
      this.setState({ chooseIndex: index });
    }
  }
  render() {
    return (
      <ScrollView style={{ flex: 1 }} 
        contentContainerStyle={{ alignItems: 'center', backgroundColor: 'white', flex: 1 }} 
        keyboardShouldPersistTaps='always' 
        keyboardDismissMode='on-drag' >

        <View style={{ marginTop: 100, height: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: this.state.chooseIndex == 0 ? OKColor.buttonBackgroundColorColor : '#D7D7D7', fontSize: 25, marginRight: 76 }}
            onPress={() => {
              this.changeLoginAndRegister(0)
            }}>登录</Text>
          <Text style={{ color: this.state.chooseIndex == 1 ? OKColor.buttonBackgroundColorColor : '#D7D7D7', fontSize: 25 }}
            onPress={() => {
              this.changeLoginAndRegister(1)
            }}>注册</Text>
        </View>
        <ScrollView ref='scrollView' style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: OKScreen.width * 2 }}
          horizontal={true}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
          pagingEnabled={true}
          scrollEnabled={false}
        >
          {this.loginComponent()}
          {this.registerComponent()}
        </ScrollView>

        <TouchableOpacity style={{ height: 40, alignItems: 'center'}} onPress={() => {
          this.props.navigation.push("AccountAppeal");
        }} >
          <Text style={{ fontSize: 16, color: "#7C7B8E" }}>账号申诉</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // 登录组件
  loginComponent() {
    return (
      <View style={{ width: OKScreen.width, paddingHorizontal: 30 }}>
        <View style={[styles.item, { marginTop: 40 }]}>
          <TextInput
            clearButtonMode={'while-editing'}
            maxLength={11}
            onChangeText={(loginPhone) => { this.setState({ loginPhone }) }}
            value={this.state.loginPhone}
            underlineColorAndroid="transparent"
            keyboardType={"numeric"}
            style={[styles.textInput]}
            placeholder="请填写手机号"
            placeholderTextColor="#aaa" />
        </View>

        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={[styles.item, { flex: 1 }]}>
            <TextInput
              onChangeText={(loginSmsCode) => { this.setState({ loginSmsCode }) }}
              value={this.state.loginSmsCode}
              clearButtonMode={'while-editing'}
              secureTextEntry={this.state.isPasswordLogin}
              keyboardType={this.state.isPasswordLogin ? Platform.OS === 'ios' ? "email-address" : "default" : Platform.OS === 'ios' ? "number-pad" : "numeric"}
              maxLength={this.state.isPasswordLogin ? 20 : 6}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              placeholder={this.state.isPasswordLogin ? "请填写密码" : "请输入验证码"}
              placeholderTextColor="#aaa" />
          </View>

          {this.state.isPasswordLogin ? null :
            <SmsCodeButton ref='loginSmsCodeBn'
              phone={this.state.loginPhone}
              countdownTxt='s'
              codeButtonStyle={{ marginLeft: 20, backgroundColor: OKColor.buttonBackgroundColorColor, height: 45, width: 103, borderRadius: 3, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
              codeButtonTextStyle={{ fontSize: 15, color: 'white' }}
              senderMessage={() => {
                this.loginStore.valiCode(this.state.loginPhone)
              }} />
          }
        </View>

        {/* 快捷登录 密码登录 忘记密码*/}
        <View style={{ marginTop: 20, justifyContent: this.state.isPasswordLogin ? 'space-between' : 'flex-start', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => {
            this.setState({
              isPasswordLogin: !this.state.isPasswordLogin,
              loginSmsCode: ''
            })
          }} >
            <Text style={{ fontSize: 16, color: "#7C7B8E" }}>{this.state.isPasswordLogin ? "快捷登录" : "密码登录"}</Text>
          </TouchableOpacity>

          {this.state.isPasswordLogin ?
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("ForgetPasswordPage", { isHideInputPhone: true })
            }}>
              <Text style={{ fontSize: 16, color: "#7C7B8E" }}>忘记密码</Text>
            </TouchableOpacity>
            : null
          }
        </View>

        <TouchableOpacity style={{ marginTop: 60, height: 45, width: OKScreen.width - 60, backgroundColor: OKColor.buttonBackgroundColorColor, justifyContent: 'center', alignItems: 'center', borderRadius: 3, overflow: 'hidden' }}
          onPress={() => { this.liginAction() }}>
          <Text style={{ fontSize: 15, color: "#F9F9F9" }}>登录</Text>
        </TouchableOpacity>
      </View>
    )
  }
  // 注册组件
  registerComponent() {
    return (
      <View style={{ width: OKScreen.width, paddingHorizontal: 30 }}>
        <View style={[styles.item, { marginTop: 40 }]}>
          <TextInput clearButtonMode='while-editing'
            maxLength={11}
            underlineColorAndroid={'transparent'}
            onChangeText={(registerPhone) => {
              this.setState({ registerPhone });
            }}
            value={this.state.registerPhone}
            underlineColorAndroid="transparent"
            keyboardType={"phone-pad"}
            style={[styles.textInput]}
            placeholder="请填写手机号"
            placeholderTextColor="#aaa" />
        </View>

        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={[styles.item, { flex: 1, marginRight: 20 }]}>
            <TextInput
              clearButtonMode='while-editing'
              onChangeText={(registerSmsCode) => {
                this.setState({ registerSmsCode });
              }}
              value={this.state.registerSmsCode}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              placeholder="请输入验证码"
              placeholderTextColor="#aaa"
              maxLength={6}
              keyboardType={Platform.OS === 'ios' ? "number-pad" : "numeric"} />
          </View>
          <SmsCodeButton ref='registerSmsCodeBn'
            phone={this.state.registerPhone}
            countdownTxt='s'
            codeButtonStyle={{ backgroundColor: OKColor.buttonBackgroundColorColor, height: 45, width: 103, borderRadius: 3, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
            codeButtonTextStyle={{ fontSize: 15, color: 'white' }}
            senderMessage={() => {
              this.loginStore.valiCodeRegi(this.state.registerPhone, "Reg")
            }} />
        </View>

        <View style={[styles.item, { marginTop: 20 }]}>
          <TextInput clearButtonMode='while-editing'
            onChangeText={(invitationCode) => {
              this.setState({ invitationCode });
            }}
            clearButtonMode={'while-editing'}
            underlineColorAndroid={'transparent'}
            value={this.state.invitationCode}
            underlineColorAndroid="transparent"
            style={styles.textInput}
            placeholder="请输入邀请码(必填)"
            placeholderTextColor="#aaa" />
        </View>
        <View style={[styles.item, { marginTop: 20 }]}>
          <TextInput clearButtonMode='while-editing'
            onChangeText={(nickname) => {
              this.setState({ nickname });
              if (GCMethods.isNoEmoji(nickname)) {
              } else {
                Toast.show('昵称不能输入表情符')
              }
            }}
            clearButtonMode={'while-editing'}
            underlineColorAndroid={'transparent'}
            value={this.state.nickname}
            underlineColorAndroid="transparent"
            style={styles.textInput}
            placeholder="请输入昵称"
            placeholderTextColor="#aaa" />
        </View>

        <TouchableOpacity style={{ marginTop: 60, height: 45, width: OKScreen.width - 60, backgroundColor: OKColor.buttonBackgroundColorColor, justifyContent: 'center', alignItems: 'center', borderRadius: 3, overflow: 'hidden' }}
          onPress={() => { this.registeredAction() }}>
          <Text style={{ fontSize: 15, color: "#F9F9F9" }}>下一步</Text>
        </TouchableOpacity>
      </View>
    )
  }

  senderMessage() {
    // this.loginStore.valiCode(this.state.phone)
  }
  liginAction() {
    if (this.state.loginPhone.length == 0) {
      Toast.show('请输入手机号码');
      return;
    }
    if (this.state.loginPhone.length < 11) {
      Toast.show('请输入正确的手机号码');
      return;
    }
    if (this.state.loginSmsCode.length == 0) {
      Toast.show(this.state.isPasswordLogin ? '请输入密码' : '请输入验证码');
      return;
    }
    if (this.state.loginSmsCode.length < 6) {
      Toast.show(this.state.isPasswordLogin ? '请输入正确的密码' : '请输入正确的验证码');
      return;
    }

    if (PublicMethods.isPoneAvailable(this.state.loginPhone)) {
      OKStorage.save(LastLoginPhone, this.state.loginPhone);//保存最后一次登录号码
      LoginStore.loginAction(this.state.loginPhone, this.state.loginSmsCode, this.state.isPasswordLogin);
    } else {
      Toast.show('请输入正确的手机号码')
    }
  }

  registeredAction() {
    // if (GCMethods.isPoneAvailable(this.state.registerPhone)) {
    //   if (this.state.registerSmsCode.length == 0) {
    //     Toast.show('请输入验证码')
    //   } else if (this.state.invitationCode.length == 0) {
    //     Toast.show('请输入邀请码')
    //   } else if (this.state.nickname.length == 0) {
    //     Toast.show('请输入昵称')
    //   } else if (!GCMethods.isNoEmoji(this.state.nickname)) {
    //     Toast.show('昵称不能输入表情符')
    //   } else {
    //     this.loginStore.register(this.state.registerSmsCode, this.state.registerPhone, this.state.invitationCode, this.state.nickname)
    //   }
    // } else {
    //   Toast.show('请输入正确的手机号码')
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontSize: 16,
    color: '#0A0A0A'
  },
  item: {
    paddingHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: OKColor.buttonBackgroundColorColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    height: 45
  },
  label: {
    minWidth: 45,
    fontSize: 16,
    color: "#222",
    paddingTop: 8
  },
  closeIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: 30,
    left: 20,
  },
  titleText: {
    fontSize: 27,
    alignSelf: 'flex-start',
    marginLeft: 18,
    color: '#000000',
    marginTop: 76,
    fontWeight: 'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});