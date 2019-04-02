import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import GlobalParameters from '../../PublicFile/GlobalParameters';
import Images from '../../PublicFile/Images';
import PublicMethods from '../../PublicFile/PublicMethods';

import Toast from 'react-native-zzy-toast';
// import NoDataOrNetworkView from '../../components/NoDataOrNetworkView';
import { observer } from 'mobx-react/native';
import { observe  } from 'mobx';
import HomeStore from '../../MobxStore/HomeStore';

@observer
export default class MyHashRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    header: null
  })

  componentDidMount() {
    HomeStore.ownCalForce();
  }
  render() {
    return (
      <View style={styles.container}>
        {/* //列表 */}
        <FlatList contentContainerStyle={{paddingBottom:10}} style={{}}
          data={HomeStore.ownCalForceData.slice()}
          ListHeaderComponent={this._ListHeaderComponent}
          renderItem={this._renderItem}
          // ListEmptyComponent={this._ListEmptyComponent}
          refreshing={false}
          onRefresh={this.refreshData}
          onEndReached={this.loadMoreData}
          onEndReachedThreshold={0.1}
          // extraData={selected: (new Map(): Map<string, boolean>)};
          keyExtractor={(item, index) => item.id.toString()}
        />

        {/* {GCStyle.leftCustomNavigation('我的算力',()=>{this.props.navigation.goBack()})} */}
        <View style={{backgroundColor: 'rgba(255,255,255,0.1)',top:0,position: 'absolute',width: OKScreen.width,height: OKScreen.navigationHeight,justifyContent: 'center',alignItems: 'center'}}>
          <TouchableOpacity style={{ height: OKScreen.navigationHeight - OKScreen.statusBarHeight, position: 'absolute', left: 10, top: OKScreen.statusBarHeight,justifyContent:'center'}}
            onPress={() => {this.props.navigation.goBack()}}>
            <Image source={Images.back_white_btn} style={{height: 18, width: 10,marginHorizontal: 8}} />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18, marginTop: OKScreen.statusBarHeight}}>我的算力</Text>
          <View style={{ height: OKScreen.navigationHeight - OKScreen.statusBarHeight, position: 'absolute', right: 10, top: OKScreen.statusBarHeight,flexDirection:'row',alignItems:'center'}}
            onPress={() => {}}>
            <Image source={Images.my_rank_icon} style={{height: 17, width: 17}} />
            <Text style={{color: 'white',fontSize: 15,marginLeft: 7,marginRight:5}}>{HomeStore.ranking+'名'}</Text>
          </View>
        </View>
      </View>
    )
  }
  _ListHeaderComponent = () => {
    return (
      <View style={{width: OKScreen.width,height: 183,alignItems: 'center'}}>
        <Image style={{position:'absolute',width:'100%',height:'100%'}}
          source={Images.wallet_title_bg} resizeMode='cover'/>
        <Text style={{fontSize: 33,color: 'white',marginTop:77}}>{HomeStore.calculateForce}</Text>
        <Text style={{fontSize: 13,color: 'white',marginTop:12}} numberOfLines={1}>算力越高，挖到okpay越多</Text>
      </View>
    )
  }
  _renderItem = ({item}) => {
    return (
      <TouchableOpacity id={item.id}
        style={{backgroundColor:'white',width: OKScreen.width,height: 48,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 21}}
        onPress={() => {
          const { navigate } = this.props.navigation;
        }}>
        <Text style={{fontSize: 15,color: 'black'}}>{item.type==1?'签到奖励':'邀请奖励'}</Text>
        <Text style={{flex:1,fontSize: 15,color: '#1D86E2',marginLeft:37}} numberOfLines={1}>{'+'+item.calculateForce}</Text>
        <Text style={{ fontSize: 12, color: '#9198AB' }}>{PublicMethods.dateStr(item.createTime/1000)}</Text>
        {/* 分割线 */}
        <View style={{position:'absolute',height: 1,backgroundColor:OKColor.lineColor,left:22,right:22,bottom:0}} />
      </TouchableOpacity>
    )
  }
  // _ListEmptyComponent = () => {
  //   return (
  //     <NoDataOrNetworkView style={{}} type={1}
  //       onClick={this.refreshData} //刷新
  //     />
  //   )
  // }

  // 下拉刷新
  refreshData = () => {
    HomeStore.reloadOwnCalForce()
  }
  // 加载更多
  loadMoreData = () => {
    HomeStore.loadMoreOwnCalForce()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: OKColor.defautBackColor,
  }
});
