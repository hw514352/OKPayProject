// 矿 BTB币
import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native';
import Images from '../../PublicFile/Images';
import { observer } from 'mobx-react/native';
import { observe  } from 'mobx';
import HomeStore from '../../MobxStore/HomeStore';
import Toast from 'react-native-zzy-toast';
import PropTypes from 'prop-types';
import Sound from 'react-native-sound';

@observer
export default class GCCoinsView extends Component {
  static propTypes = {
    id:PropTypes.number,
    itemWidth:PropTypes.number,
    itemHeight:PropTypes.number,
    index:PropTypes.number,
    coinCount:PropTypes.number,
    onClickSuccess:PropTypes.func,
  }
  static defaultProps = {
    itemWidth:31,
    itemHeight:46,
  }

  state = {
    BTBScaleAnimated: new Animated.Value(0),//缩放
  }

  componentDidMount() {
    let { BTBScaleAnimated } = this.state;
    Animated.sequence([
      Animated.timing(BTBScaleAnimated,{
        toValue: 1,
        duration: 1000,
      }),
      Animated.timing(BTBScaleAnimated,{
        toValue: 0.9,
        duration: 200,
      }),
      Animated.timing(BTBScaleAnimated,{
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(BTBScaleAnimated,{
        toValue: 0.95,
        duration: 200,
      }),
      Animated.timing(BTBScaleAnimated,{
        toValue: 1,
        duration: 200,
      })
    ]).start()
  }

  render() {
    let { BTBScaleAnimated } = this.state;
    let { itemWidth,itemHeight } = this.props;
    return (
      <Animated.View style={{...this.props.style, transform:[{scale:BTBScaleAnimated},{perspective: 1000}],opacity:this.state.BTBScaleAnimated,position: 'absolute',width: itemWidth,height: itemHeight}}>

        <TouchableOpacity style={{flex:1,justifyContent: 'space-between',alignItems: 'center'}}
          onPress={()=>{this._BTBCoinClick()}} activeOpacity={1}>
          <Image source={Images.Mineral_jewel_btn} style={{width:itemWidth,height:itemWidth}} />
          <Text style={{fontSize: 14,color:'white'}} numberOfLines={1}>{this.props.coinCount}</Text>
        </TouchableOpacity>

        {this.props.children}
      </Animated.View>
    );
  }

  // 点击BTB币事件
  _BTBCoinClick() {
    // 矿石领取
    HomeStore.gccoinsTakeAction(this.props.id);
    observe(HomeStore, 'gccoinsTakeSuccess', (change) => {
      //矿石领取成功
      let gccoinsTakeSuccess = HomeStore.gccoinsTakeSuccess;
      if (gccoinsTakeSuccess) {
        // 播放声音
        let demoAudio = require('./BTBCoinVoice.mp3');//支持众多格式
        const s = new Sound(demoAudio, (error) => {
          if (error) {
            console.log('播放失败');
            return;
          }
          s.play(() => s.release());
        });

        this.props.onClickSuccess(this.props.index);//收割成功回调
        let { BTBScaleAnimated } = this.state;
        Animated.sequence([
          Animated.timing(BTBScaleAnimated,{
            toValue: 0,
            duration: 400,
          }),
          Animated.timing(BTBScaleAnimated,{
            toValue: 0.2,
            duration: 100,
          }),
          Animated.timing(BTBScaleAnimated,{
            toValue: 0,
            duration: 100,
          }),
          Animated.timing(BTBScaleAnimated,{
            toValue: 0.2,
            duration: 100,
          }),
          Animated.timing(BTBScaleAnimated,{
            toValue: 0,
            duration: 100,
          })
        ]).start()
      }

    });
  }
}
