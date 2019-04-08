
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  WebView,
  NativeModules,
  BackHandler,
  StatusBar
} from 'react-native';
// import NoDataOrNetworkView from './NoDataOrNetworkView';
import GlobalParameters from '../PublicFile/GlobalParameters';
import PublicMethods from '../PublicFile/PublicMethods';
import Images from '../PublicFile/Images';

export default class BaseWebView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
    };
    BaseWebViewThis=this
    this.navigateCount = 0;//webView内部跳转了几层
    this.canGoBack =false ;//webView内部跳转了几层

  }
  static navigationOptions = ({navigation, screenProps}) => ({
    title:navigation.getParam('title','网页标题'),
    headerLeft: (
      <TouchableOpacity style={{ height: OKScreen.navigationHeight - OKScreen.statusBarHeight, width: OKScreen.navigationHeight - OKScreen.statusBarHeight, justifyContent: 'center' }} 
        onPress={() => { 
          if (BaseWebViewThis.canGoBack) {
            BaseWebViewThis.refs.webView.goBack();
          } else {
            if (Platform.OS === 'ios') {
              navigation.goBack();
            } else {
              NativeModules.IMModule.closeCurrentActivity().then((data) => {
                if (!data) {
                  navigation.goBack();
                }
              }).catch((err) => {
              });
            }
          }
          if (navigation.state.params.goBackAction) {
            navigation.state.params.goBackAction();
          }
       }}>
        <Image source={Images.Ok_back_btn} style={{ width: '100%', height: '100%', resizeMode: 'center' }} />
      </TouchableOpacity>
    ),
    headerRight: (
      navigation.getParam('right','')?
        <TouchableOpacity style={{height: 35, minWidth: 35,marginRight: 10,justifyContent: 'center'}}
          onPress={() =>{
            navigation.getParam('right','').action();
          }}>
          {navigation.getParam('right','').title?<Text style={{color:'#1B1B1F'}}>{navigation.getParam('right','').title}</Text>:null}
          {navigation.getParam('right','').image?<Image source={navigation.getParam('right','').image} style={{height: 18, minWidth: 18}} />:null}
        </TouchableOpacity>
      :<View></View>
    )
  })


  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.androidBackListener);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.androidBackListener);
  }

  androidBackListener() {
    if (BaseWebViewThis.canGoBack) {
      BaseWebViewThis.refs.webView.goBack();
    } else {
      NativeModules.IMModule.closeCurrentActivity().then((data) => {
        if (!data) {
          BaseWebViewThis.props.navigation.goBack();
        }
      }).catch((err) => {
      });
    }
    return true;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar ref="statusBarView" barStyle="dark-content"/>
        <WebView ref={'webView'} style={styles.webViewStyle} startInLoadingState={true}
          source={{uri: this.props.navigation.getParam('url')}}
          onLoad={() => {
            this.setState({webViewLoadFalse:false})
          }}
          onError={() => {
            this.setState({webViewLoadFalse:true})
          }}
          onNavigationStateChange={(data) => {
            this.canGoBack=data.canGoBack
          }}
          onMessage={(event)=>{
            if(event.nativeEvent.data.length>0){
            this.props.navigation.push("GoodsDetailFromIdPage", { goodsId: event.nativeEvent.data,goodsType: 1})
            }
          }}
          renderError={() => {
            // <NoDataOrNetworkView text={'网页加载失败，请重试'}
            //   onClick={() => {
            //     //
            //   }}/>
          }}
          renderLoading={() => {
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  webViewStyle: {
    flex:1,
    width:OKScreen.width,
    height: OKScreen.height,
    backgroundColor:'white',
  }
});
