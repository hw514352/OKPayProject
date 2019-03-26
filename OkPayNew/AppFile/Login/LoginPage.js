import React, { Component } from 'react';
import { Platform, TouchableOpacity, KeyboardAvoidingView, TextInput, Image, ScrollView, StyleSheet, Text, View, YellowBox } from 'react-native';
import GlobalParameters from '../PublicFile/GlobalParameters';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chooseIndex:0,// 选择登录还是注册
      loginPhone:'',
      loginSmsCode: '',
      registerPhone:'',
      registerSmsCode: '',
      invitationCode:'',
      areaCode: ['+86', "+99", "+66", "+88", "+99", "+66", "+88", "+99", "+66", "+88"],
      areaCodeStr: '+86',
      nickname:'',
      isPwdLogin: true //是否密码登录模式
    };
    // this.loginStore = new LoginStore()
    // 检索最后一次登录的号码
    // GCStorage.read('lastLoginPhone').then((ret) => {
    //   if (ret) {
    //     this.setState({ loginPhone: ret })
    //   }
    // }).catch(() => {
    // });
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    header: null
  })

  componentDidMount() {
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
  }

  changeLoginAndRegister(index) {
    if (this.state.chooseIndex != index) {
      this.refs.scrollView.scrollTo({x: OKScreen.width*index, y: 0, animated: Platform.OS === 'ios'});
      this.setState({chooseIndex:index});
    }
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{flex:1,backgroundColor: 'white' }} >

        <View style={{marginTop:100,height:25,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:this.state.chooseIndex==0?'#24387E':'#D7D7D7',fontSize:25,marginRight:76}}
            onPress={()=>{
              this.changeLoginAndRegister(0)
            }}>登录</Text>
          <Text style={{color:this.state.chooseIndex==1?'#24387E':'#D7D7D7',fontSize:25}}
            onPress={()=>{
              this.changeLoginAndRegister(1)
            }}>注册</Text>
        </View>
        <ScrollView ref='scrollView' style={{flex:1}}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{width:OKScreen.width*2}}
          horizontal={true}
          pagingEnabled={true}
          scrollEnabled={false}
          >
          {this.loginComponent()}
          {this.registerComponent()}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // 登录组件
  loginComponent() {
    return (
      <View style={{width:OKScreen.width,paddingHorizontal:30}}>
        <View style={[styles.item, {marginTop:40}]}>
          <TextInput
            clearButtonMode={'while-editing'}
            maxLength={11}
            onChangeText={(loginPhone) => {this.setState({ loginPhone })}}
            value={this.state.loginPhone}
            underlineColorAndroid="transparent"
            keyboardType={"numeric"}
            style={[styles.textInput]}
            placeholder="请填写手机号"
            placeholderTextColor="#aaa" />
        </View>

        <View style={{marginTop:20,flexDirection:'row',justifyContent:'space-between'}}>
          <View style={[styles.item, {flex:1}]}>
            <TextInput
              onChangeText={(loginSmsCode) => {this.setState({ loginSmsCode })}}
              value={this.state.loginSmsCode}
              clearButtonMode={'while-editing'}
              secureTextEntry={this.state.isPwdLogin}
              keyboardType={Platform.OS === 'ios' && this.state.isPwdLogin ? "email-address" : "number-pad"}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              placeholder={this.state.isPwdLogin ? "请填写密码" : "请输入验证码"}
              placeholderTextColor="#aaa" />
          </View>

            {/* {this.state.isPwdLogin ? null :
              <SmsCodeButton ref='loginSmsCodeBn'
                phone={this.state.loginPhone}
                countdownTxt='s'
                codeButtonStyle={{marginLeft:20,backgroundColor:OKColor.themeColor,height:45,width:103,borderRadius:3,overflow:'hidden',justifyContent:'center',alignItems:'center'}}
                codeButtonTextStyle={{fontSize:15,color:'white'}}
                senderMessage={()=>{
                  this.loginStore.valiCode(this.state.loginPhone)
                }} />
            } */}
        </View>

        {/* 快捷登录 密码登录 忘记密码*/}
        <View style={{marginTop: 20,justifyContent: this.state.isPwdLogin ? 'space-between' : 'flex-start', flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
            this.setState({
              isPwdLogin: !this.state.isPwdLogin,
              loginSmsCode: ''
            })
          }} >
            <Text style={{ fontSize: 16, color: "#7C7B8E" }}>{this.state.isPwdLogin ? "快捷登录" : "密码登录"}</Text>
          </TouchableOpacity>

          {this.state.isPwdLogin ?
            <TouchableOpacity onPress={() => {
              const { navigate } = this.props.navigation;
              navigate("ModifyLoginSecret", { isHideInputPhone:false})
            }}>
              <Text style={{ fontSize: 16, color: "#7C7B8E" }}>忘记密码</Text>
            </TouchableOpacity>
            : null
          }
        </View>

        <TouchableOpacity style={{marginTop:60,height:45,width:OKColor.width-60,backgroundColor:OKColor.themeColor,justifyContent:'center',alignItems:'center',borderRadius:3,overflow:'hidden'}}
          onPress={() => {this.liginAction()}}>
          <Text style={{fontSize: 15, color: "#F9F9F9"}}>登录</Text>
        </TouchableOpacity>
      </View>
    )
  }
  // 注册组件
  registerComponent() {
    return (
      <View style={{width:OKColor.GCWidth,paddingHorizontal:30}}>
        <View style={[styles.item, {marginTop:40}]}>
          <TextInput clearButtonMode='while-editing'
            maxLength={11}
            underlineColorAndroid={'transparent'}
            onChangeText={(registerPhone) => {
              this.setState({registerPhone});
            }}
            value={this.state.registerPhone}
            underlineColorAndroid="transparent"
            keyboardType={"phone-pad"}
            style={[styles.textInput]}
            placeholder="请填写手机号"
            placeholderTextColor="#aaa"/>
        </View>

        <View style={{marginTop:20,flexDirection:'row',justifyContent:'space-between'}}>
          <View style={[styles.item,{flex:1,marginRight:20}]}>
            <TextInput
              clearButtonMode= 'while-editing'
              onChangeText={(registerSmsCode) => {
                this.setState({registerSmsCode});
              }}
              value={this.state.registerSmsCode}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              placeholder="请输入验证码"
              placeholderTextColor="#aaa"
              keyboardType={'number-pad'}/>
          </View>
          {/* <SmsCodeButton ref='registerSmsCodeBn'
            phone={this.state.registerPhone}
            countdownTxt='s'
            codeButtonStyle={{backgroundColor:OKColor.themeColor,height:45,width:103,borderRadius:3,overflow:'hidden',justifyContent:'center',alignItems:'center'}}
            codeButtonTextStyle={{fontSize:15,color:'white'}}
            senderMessage={()=>{
              this.loginStore.valiCodeRegi(this.state.registerPhone,"Reg")
            }} /> */}
        </View>

        <View style={[styles.item, {marginTop:20}]}>
          <TextInput clearButtonMode= 'while-editing'
            onChangeText={(invitationCode) => {
              this.setState({invitationCode});
            }}
            clearButtonMode={'while-editing'}
            underlineColorAndroid={'transparent'}
            value={this.state.invitationCode}
            underlineColorAndroid="transparent"
            style={styles.textInput}
            placeholder="请输入邀请码(必填)"
            placeholderTextColor="#aaa"/>
        </View>
        <View style={[styles.item, {marginTop:20}]}>
          <TextInput clearButtonMode= 'while-editing'
            onChangeText={(nickname) => {
              this.setState({nickname});
             if(GCMethods.isNoEmoji(nickname)){
             }else{
               Toast.show('昵称不能输入表情符')
             }
            }}
            clearButtonMode={'while-editing'}
            underlineColorAndroid={'transparent'}
            value={this.state.nickname}
            underlineColorAndroid="transparent"
            style={styles.textInput}
            placeholder="请输入昵称"
            placeholderTextColor="#aaa"/>
        </View>

        <TouchableOpacity style={{marginTop:60,height:45,width:OKColor.width-60,backgroundColor:OKColor.themeColor,justifyContent:'center',alignItems:'center',borderRadius:3,overflow:'hidden'}}
          onPress={() => {this.registeredAction()}}>
          <Text style={{fontSize: 15, color: "#F9F9F9"}}>下一步</Text>
        </TouchableOpacity>
      </View>
    )
  }

  senderMessage() {
    // this.loginStore.valiCode(this.state.phone);
  }
  liginAction() {
    // if (GCMethods.isPoneAvailable(this.state.loginPhone)) {
    //   if (this.state.loginSmsCode.length == 0) {
    //     if (this.state.isPwdLogin) {
    //       Toast.show('请输入密码')
    //     } else {
    //       Toast.show('请输入验证码')
    //     }
    //
    //   } else {
    //     // this.loginStore.selectAccount(this.state.phone, this.state.smsCode)
    //     GCStorage.save('lastLoginPhone', this.state.loginPhone);//保存最后一次登录号码
    //     this.loginStore.UserLogin(this.state.loginSmsCode, this.state.loginPhone,this.state.isPwdLogin)
    //   }
    // } else {
    //   Toast.show('请输入正确的手机号码')
    // }
  }
  registeredAction(){
  //   if (GCMethods.isPoneAvailable(this.state.registerPhone)) {
  //     if (this.state.registerSmsCode.length == 0) {
  //       Toast.show('请输入验证码')
  //     }else if(this.state.invitationCode.length == 0){
  //       Toast.show('请输入邀请码')
  //     }else if(this.state.nickname.length == 0){
  //       Toast.show('请输入昵称')
  //     }else if(!GCMethods.isNoEmoji(this.state.nickname)){
  //       Toast.show('昵称不能输入表情符')
  //     } else {
  //       this.loginStore.register(this.state.registerSmsCode,this.state.registerPhone,this.state.invitationCode,this.state.nickname)
  //     }
  //   } else {
  //     Toast.show('请输入正确的手机号码')
  //   }
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
    paddingHorizontal:20,
    borderRadius:3,
    overflow:'hidden',
    borderWidth: 1,
    borderColor: OKColor.themeColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center',
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
