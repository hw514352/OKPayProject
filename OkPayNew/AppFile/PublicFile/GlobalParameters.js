import {Dimensions,Platform,StatusBar,PixelRatio} from  'react-native';

const {width, height} = Dimensions.get('window');
const OS = Platform.OS;
const ios = (OS == 'ios');
const android = (OS == 'android');
const isIPhoneX = (ios && height == 812 && width == 375);
const statusBarHeight = (ios ? (isIPhoneX ? 44 : 20) : StatusBar.currentHeight);

global.OKScreen = {
    width:width,
    height:height,
    statusBarHeight:statusBarHeight,
    onePixelRatio:1/PixelRatio.get(),
};

global.OKDevice = {
    ios:ios,
    android:android,
    isIPhoneX:isIPhoneX,
};

global.OKColor = {
    themeColor:'#213679',//主风格颜色
    lineColor:'#EDEDED',//线颜色
};
