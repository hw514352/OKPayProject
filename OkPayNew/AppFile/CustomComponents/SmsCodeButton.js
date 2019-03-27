/**
 * 发送短信验证码按钮
 */
 import React, {Component} from 'React';
 import {
    Text,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import PublicMethods from '../PublicFile/PublicMethods';
import Toast from 'react-native-zzy-toast';

const Status = {
    Normal: 1,  //正常状态
    Start: 2,    //倒计时开始状态
    End: 3,//倒计时结束
}

export default class SmsCodeButton extends Component {
  // 定制属性声明 仅测试环境有效
  static propTypes = {
    maxTime: PropTypes.number, //最大时长，默认60秒
    normalTxt: PropTypes.string,//未开始倒计时的文案
    countdownTxt:PropTypes.string,//倒计时秒数后面的文案
    endTxt: PropTypes.string,//倒计时结束文案

    startCountdown: PropTypes.func,//倒计时的回调

    codeButtonStyle: PropTypes.object,
    codeButtonTextStyle: PropTypes.object,
  }
  static defaultProps = {
    maxTime: 60,
    normalTxt: '发送验证码',
    countdownTxt:'秒后重新发送',
    endTxt: '重新发送',
    codeButtonStyle: {},
    codeButtonTextStyle: { color: OKColor.themeColor,fontSize: 14,fontFamily: 'PingFangSC-Regular'},
  }
  constructor(props) {
    super(props);

    this.interval = null;//计时器
    this.state = {
      showTxt:props.normalTxt,
    }
  }

  status = Status.Normal;//计时器状态
  //点击开始
  startCountdown(){
    if (this.status != Status.Start) {
      if (PublicMethods.isPoneAvailable(this.props.phone)){
        this.props.senderMessage()
        // this.startTimer();
      }else{
        Toast.show('请输入正确的手机号码')
      }
    }
  }

  countdownTime = 0;//倒计时时间
  startTimer() {
    const {maxTime, endTxt,countdownTxt,startCountdown} = this.props;
    if(startCountdown){
      startCountdown();
    }
    this.countdownTime = maxTime;//倒计时时间
    this.status = Status.Start;
    this.setState({showTxt:maxTime+countdownTxt});
    this.interval = setInterval(() => {
      var currentTime = this.countdownTime - 1;
      if (currentTime <= 0) {
        this.status = Status.End;
        this.countdownTime = maxTime;
        clearInterval(this.interval);
        this.setState({showTxt:endTxt})
      } else {
        this.countdownTime = currentTime;
        this.setState({showTxt:this.countdownTime+countdownTxt});
      }
    }, 1000)
  }
  render() {
    const {codeButtonStyle,codeButtonTextStyle} = this.props;

    return (
      <TouchableOpacity activeOpacity={this.state.counting ? 1 : 0.8}
        style={codeButtonStyle}
        disabled={(this.status == Status.Start)}
        onPress={() => this.startCountdown()}>
        <Text style={codeButtonTextStyle}>
          {this.state.showTxt}
        </Text>
      </TouchableOpacity>
    )
  }

  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.interval && clearTimeout(this.interval);
  }
}
