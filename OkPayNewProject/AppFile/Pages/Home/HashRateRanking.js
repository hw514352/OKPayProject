import React, {Component} from 'react';
import {
  Image, StyleSheet, Text, View, ScrollView
} from 'react-native';
import GlobalParameters from '../../PublicFile/GlobalParameters';
import Images from '../../PublicFile/Images';
import HomeStore from '../../MobxStore/HomeStore';
import ServiceUrl from '../../PublicFile/ServiceUrl';
import AppStore from '../../MobxStore/AppStore';
import { observer } from 'mobx-react/native';
import { observe  } from 'mobx';

import LinearGradient from 'react-native-linear-gradient';

@observer
export default class HashRateRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    title:'算力排行榜',
  })

  componentDidMount() {
    HomeStore.getCalculateForceRanking();
  }

  render() {
    let headerurl = AppStore.userData.headPortraitUrl ? AppStore.userData.headPortraitUrl : ServiceUrl.defaultAvatar;
    return (
      <ScrollView style={{flex: 1,backgroundColor: 'white'}} showsVerticalScrollIndicator={false}
      contentContainerStyle={{alignItems: 'center',paddingHorizontal:21,paddingVertical:15}}>
        <View style={{width:'100%',height:143}}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#CFA762', '#E6C997']}
          style={{flex:1,borderRadius:5}}>

            <View style={{marginTop:9,marginHorizontal:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Image source={{uri:headerurl}} style={{width: 35, height: 35, borderRadius:17.5}} />
              <Text style={{flex:1,fontSize:17,color:'white',marginLeft:10,marginRight:10}} numberOfLines={1}>{AppStore.userData.nickName}</Text>
              <Text style={{ fontSize: 17, color: 'white' }}>位于{HomeStore.memberData.ranking ? HomeStore.memberData.ranking:0}名</Text>
            </View>

            <Text style={{fontSize:14,color:'white',marginTop:7,marginHorizontal:15,lineHeight:20}} numberOfLines={2}>贡献越多算力，ok积分生长越快，还有机会获得余额哦！</Text>

            <View style={{flex:1,marginTop:12,marginHorizontal:15,flexDirection:'row',alignItems:'center',borderTopColor:'rgba(237, 220, 209, 0.48)',borderTopWidth:1}}>
              <Text style={{ fontSize: 17, color: 'white' }}>{HomeStore.memberData.calculateForce ? HomeStore.memberData.calculateForce:0}</Text>
              <Text style={{fontSize:17,color:'white',marginLeft:10}}>总算力</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={{fontSize:18,color:'#303D69',marginTop:22}}>算力排行榜 TOP10</Text>



        <View style={{ width: '100%', height: 35 + HomeStore.calculateForceRankingData.length*48,backgroundColor:'#F9F7F0',marginTop:20,borderRadius:10,borderColor:'#DFB678',borderWidth:3,marginBottom:0}}>
          {HomeStore.calculateForceRankingData.slice().map((item,index) => {
            let icon = '';
            if (index == 0) {
              icon = Images.rank_first_icon;
            } else if (index == 1) {
              icon = Images.rank_second_icon;
            } else if (index == 2) {
              icon = Images.rank_third_icon;
            }

            let avatar = item.headPortraitUrl ? item.headPortraitUrl : ServiceUrl.defaultAvatar;
            return (
              <View key={item.id}
                style={{marginTop:index==0?17.5:0,height: 48,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 21}}>
                {icon ?
                  <Image source={icon} style={{width: 18, height: 21}} />
                  :
                  <Text style={{width:18,fontSize: 15,color: '#303D69',textAlign:'center'}}>{index+1}</Text>
                }

                <Image source={{uri:avatar}} style={{width: 34, height: 34, borderRadius:17,marginLeft:10,backgroundColor:'white'}} />
                <Text style={{flex:1,fontSize: 14,color: '#303D69',marginHorizontal:10}} numberOfLines={1}>{item.realName ? item.realName : item.nickName}</Text>
                <Text style={{fontSize: 14,color: '#303D69'}}>{item.calculateForce}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: OKColor.defautBackColor,
    paddingHorizontal:21
  }
});