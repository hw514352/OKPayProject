import React, { Component } from 'react';
import { StyleSheet, Easing, Text, View, Image, TouchableOpacity, ScrollView, Animated, RefreshControl, DeviceEventEmitter } from 'react-native';
import AppStore from '../../MobxStore/AppStore';
import GlobalParameters from '../../PublicFile/GlobalParameters';
import Images from '../../PublicFile/Images';
import { observer } from 'mobx-react/native';
import { observe } from 'mobx';
import HomeStore from '../../MobxStore/HomeStore';
import PublicMethods from '../../PublicFile/PublicMethods';
import ServiceUrl from '../../PublicFile/ServiceUrl';
import Toast from 'react-native-zzy-toast';
import GCCoinsView from './GCCoinsView';
import Video from 'react-native-video';

// 矿点尺寸
const BTBItemWidth = 54;
const BTBItemHeight = BTBItemWidth + 20;
// 最大随机区域
const MaxBTBItemShowWidth = BTBItemWidth * 1.5;
const MaxBTBItemShowHeight = BTBItemHeight * 1.5;
// 顶部组件高度
const TopComponentHeight = 25 + 10 * 2;
// 矿池宽高
const BtBWidth = OKScreen.width;
// 5:topComponent与statusBar间距
const BtBheight = OKScreen.height - OKScreen.tabBarHeight - OKScreen.statusBarHeight - TopComponentHeight - 124;
//流星图片大小
let shootingWt = OKScreen.height;
let shootingHg = OKScreen.height * 0.7;
@observer
export default class HomePage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            allGCCoinPoints: [],//根据数据生成随机矿点
            didFinishDataCounts: 0,//记录已收割的数量

            didNoDatas: false,//所有矿石全部采集完后
            didNoDatasText: '...',
        };
        // animation
        this.bgViewScale = new Animated.Value(0),//背景地球组件缩放动画
        this.bgViewRotateZ = new Animated.Value(0),//背景地球组件旋转动画

        this.shakeAnimation = new Animated.Value(-5);// 振动动画
        this.top = 5

        this.timeString = PublicMethods.dateStr((new Date()).getTime() / 1000);//当前时间        

        this.allRandomPoints = [];// 所有可用随机点
        this._findAllTBTPoints();

        this._startToMiningBTB();
    }

    componentDidMount() {
        HomeStore.pageHomeDataAction();//主页基本数据
        HomeStore.GetmyBalance();//当前资产
        this.shakeSpin();
    }
    // 震动动画
    shakeSpin() {
        this.top = -this.top;
        this.shakeAnimation.setValue(this.top);
        let toValue = -this.top;
        Animated.timing(this.shakeAnimation, {
            toValue: toValue,
            duration: 1000,
            velocity: 7,
            tension: -20,
            delay: 0,
            easing: Easing.linear
        }).start(() => this.shakeSpin());
    }
    _startRotateZAnimation() {
        this.bgViewRotateZ.setValue(0);
        Animated.timing(this.bgViewRotateZ, {
            toValue: -1,
            duration: 30 * 1000,
            easing: Easing.linear
        }).start(() => this._startRotateZAnimation());
    }
    // 开始挖矿 展示背景地球
    _startToMiningBTB() {
        this._startRotateZAnimation();
        //背景地球显示
        Animated.timing(this.bgViewScale, {
            toValue: 1,
            duration: 2000,
        }).start();

        //矿石-列表
        HomeStore.gccoinsAction(this.allRandomPoints.length);
        // 矿池数据监听 分组
        observe(HomeStore, 'gccoinsDatas', (change) => {
            if (HomeStore.gccoinsDatas.length == 0) {
                // 无更多数据页
                this.setState({ didNoDatas: true });
            } else {
                this.setState({ didNoDatas: false });
            }
            this._didNoDatasInterval();
            this._findBTBPoints();
        });
    }

    //努力挖矿中的动画计时器
    intervalTime = 0;
    interval = null;//计时器
    _didNoDatasInterval() {
        if (this.state.didNoDatas) {
            if (!this.interval) {
                this.interval = setInterval(() => {
                    let index = this.intervalTime % 4;
                    if (index == 0) {
                        this.setState({ didNoDatasText: '' });
                    } else if (index == 1) {
                        this.setState({ didNoDatasText: '.' });
                    } else if (index == 2) {
                        this.setState({ didNoDatasText: '..' });
                    } else {
                        this.setState({ didNoDatasText: '...' });
                    }
                    this.intervalTime += 1;
                }, 1000)
            }
        } else {
            this.interval && clearTimeout(this.interval);
        }
    }
    // 获取算力 玩转okpay
    _activityClick(index) {
        const { navigate, push } = this.props.navigation
        if (index == 0) {
            navigate('GetHashRate', { totalHashRate: HomeStore.calculateForce });
        } else if (index == 2) {
            // navigate('GamePage');
            push('HomePage');
            // Toast.show('正在建设中');
        } else {
            // Toast.show('功能升级中');
            // return;
            // navigate('PlayBTBPage');
            push('BaseWebView', {
                title: '玩转okpay',
                right: {
                    title: '用户帮助',
                    action: () => { navigate('PlayBTBPage') }
                },
                url: ServiceUrl.lottery_h5 + '?token=' + AppStore.userToken,
            })
        }
    }

    _findAllTBTPoints() {
        // 所有可用随机点
        let width = BtBWidth;
        let height = BtBheight;

        let xnum = Math.floor(width / MaxBTBItemShowWidth);
        let itemMaxWidth = width / xnum;
        let ynum = Math.floor(height / MaxBTBItemShowHeight);
        let itemMaxHeight = height / ynum;
        for (var i = 0; i < ynum; i++) {
            for (var j = 0; j < xnum; j++) {
                //在一个范围内随机
                let rangex = Math.random() * (itemMaxWidth - BTBItemWidth);
                let rangey = Math.random() * (itemMaxHeight - BTBItemHeight);
                this.allRandomPoints.push({ x: rangex + j * itemMaxWidth, y: rangey + i * itemMaxHeight });
            }
        }
    }

    _findBTBPoints() {
        // 所有可用随机点
        this.allRandomPoints = []
        this._findAllTBTPoints()

        // 根据数据确定位置点
        let randomPoints = this.allRandomPoints.slice();
        if (HomeStore.gccoinsDatas.length == randomPoints.length) {
            this.setState({ allGCCoinPoints: randomPoints });
            return
        }

        let tempPoints = [];
        for (var j = 0; j < HomeStore.gccoinsDatas.length; j++) {
            let randomIndex = parseInt(Math.random() * (randomPoints.length - 1))
            let point = randomPoints[randomIndex]
            tempPoints.push(point)
            randomPoints.splice(randomIndex, 1)//删除元素
        }
        this.setState({ allGCCoinPoints: tempPoints });
    }

    render() {
        // 映射
        const spin = this.bgViewRotateZ.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        return (
            <View style={styles.container}>
                {/* 背景 */}
                <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <Video
                        source={require('./HomeBgVideo.mp4')}
                        style={{ flex: 1 }}
                        rate={1}// 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                        paused={false}
                        volume={0}         // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                        muted={true}        // true代表静音，默认为false.
                        resizeMode='cover'   //视频的自适应伸缩铺放行为，
                        onLoad={() => { }}//当视频加载完毕时的回调函数
                        onLoadStart={() => { }}//当视频开始加载时的回调函数
                        onProgress={() => { }}//进度控制，每250ms调用一次，以获取视频播放的进度
                        onEnd={() => { }}//当视频播放完毕后的回调函数
                        onError={() => { }}//当视频不能加载，或出错后的回调函数
                        onAudioBecomingNoisy={() => { }}
                        onAudioFocusChanged={() => { }}
                        repeat={true}// 是否重复播放
                    />
                </View>

                <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0)' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width: OKScreen.width }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            HomeStore.pageHomeDataAction();//主页基本数据
                            HomeStore.configs();//请求项目配置
                            HomeStore.GetmyBalance();//当前资产
                            //重新请求矿石列表
                            this.state.didFinishDataCounts = 0;
                            this.state.allGCCoinPoints = [];
                            HomeStore.gccoinsAction(this.allRandomPoints.length);
                        }}
                        tintColor='white'
                        title='加载中...'
                        titleColor='white'
                        progressBackgroundColor='#ffffff'
                    />} >

                    {/* 顶部固定视图 */}
                    <View style={{ marginTop: OKScreen.statusBarHeight, height: TopComponentHeight, width: OKScreen.width, flexDirection: 'row', alignItems: 'center' }}>
                        {/* 总算力 */}
                        <TouchableOpacity style={{ marginLeft: 22, height: 25, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(190,152,86,0.17)', borderRadius: 5 }} activeOpacity={1}
                            onPress={() => {
                                this.props.navigation.navigate('HashRateRanking');
                            }}>
                            <Image style={{ width: 15, height: 18, marginLeft: 6 }} source={Images.computing_power_icon} resizeMode='contain' />
                            <Text style={{ marginLeft: 9, color: 'white', fontSize: 14 }}>总算力</Text>
                            <Text style={{ marginHorizontal: 10, color: 'white', fontSize: 14 }}>{HomeStore.calculateForce}</Text>
                        </TouchableOpacity>
                        {/* ok积分 */}
                        <TouchableOpacity style={{ marginLeft: 25, height: 25, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(190,152,86,0.17)', borderRadius: 5 }} activeOpacity={1}
                            onPress={() => {
                                // this.props.navigation.navigate('MyHashRate');
                            }}>
                            <Image style={{ width: 16, height: 17, marginLeft: 6 }} source={Images.mineral_jifen_icon} resizeMode='contain' />
                            <Text style={{ marginLeft: 4, color: 'white', fontSize: 14 }}>ok积分</Text>
                            <Text style={{ marginHorizontal: 10, color: 'white', fontSize: 14 }}>{PublicMethods.changeTwoDecimal_f(HomeStore.integralAmount)}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 矿池 */}
                    <View style={{ width: OKScreen.width, height: BtBheight }}>
                        {/* 地球背景 居中*/}
                        <Animated.View style={{
                            transform: [{ scale: this.bgViewScale }, { perspective: 1000 }],
                            position: 'absolute', width: OKScreen.width, height: BtBheight, top: 0, left: 0
                        }}>

                            <Image style={{ position: 'absolute', width: OKScreen.width * 0.64, height: OKScreen.width * 0.64, top: (BtBheight - OKScreen.width * 0.64) / 2, left: OKScreen.width * 0.18 }}
                                source={Images.Mineral_star_img} resizeMode='contain' />

                            <Image style={{ position: 'absolute', width: 46, height: 33, top: (BtBheight - OKScreen.width * 0.64) / 2 - 10, left: OKScreen.width * 0.18 - 6 }}
                                source={Images.mineral_ufo_img} resizeMode='contain' />

                            <Animated.View style={{
                                transform: [{ rotate: spin }],
                                position: 'absolute', width: OKScreen.width * 0.64 + 8, height: OKScreen.width * 0.64 + 44, top: (BtBheight - OKScreen.width * 0.64 - 44) / 2, left: OKScreen.width * 0.18 - 4, justifyContent: 'flex-end', alignItems: 'flex-end',
                            }}>
                                <Image style={{ width: 39, height: 48 }}
                                    source={Images.mineral_yuhangyuan_img} resizeMode='contain' />

                            </Animated.View>
                        </Animated.View>

                        {/* 无数据时显示 */}
                        {this.state.didNoDatas ?
                            <View style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
                                <Animated.Image source={Images.Mineral_jewel_btn} style={{ width: BTBItemWidth, top: this.shakeAnimation, height: BTBItemWidth }} />
                                <View style={{ height: 20, marginTop: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, color: 'black' }} numberOfLines={1}>努力挖矿中</Text>
                                    <Text style={{ position: 'absolute', left: 70, bottom: 0, fontSize: 14, color: 'black' }} numberOfLines={1}>{this.state.didNoDatasText}</Text>
                                </View>
                            </View>
                            : null
                        }

                        {/* 矿池 */}
                        <Animated.View style={{ flex: 1, top: this.shakeAnimation }}>
                            {this.BTBItemView()}
                        </Animated.View>
                    </View>

                    {/* 获取算力 OK抽奖 玩转okpay */}
                    <View style={{ height: 80, justifyContent: 'space-around', width: OKScreen.width, flexDirection: 'row', }}>
                        {this.row1View(Images.mineral_huoqusuanli_btn, '获取算力', 0)}
                        {this.row1View(Images.mineral_wanzhuanokpay_btn, 'OK抽奖', 1)}
                        {this.row1View(Images.gema_yxrk, 'OK游戏', 2)}
                    </View>
                </ScrollView>
            </View>
        );
    }

    //矿 BTB币
    BTBItemView() {
        let allGCCoinPoints = this.state.allGCCoinPoints;
        let gccoinsDatas = HomeStore.gccoinsDatas;
        return (
            allGCCoinPoints.map((point, index) => {
                let data = gccoinsDatas[index];
                return (
                    <GCCoinsView key={data.id} style={{ top: point.y, left: point.x }} id={data.id} itemWidth={BTBItemWidth} itemHeight={BTBItemHeight} index={index} coinCount={data.quantity}
                        onClickSuccess={(clickIndex) => {
                            //刷新当前资产 并发通知
                            HomeStore.GetmyBalance();
                            DeviceEventEmitter.emit('GetGCCoinSuccess', 'send a message');
                            // 记录挖成功的
                            this.state.didFinishDataCounts += 1;
                            //本组矿池挖完时
                            if (this.state.didFinishDataCounts >= allGCCoinPoints.length) {
                                this.state.didFinishDataCounts = 0;
                                this.state.allGCCoinPoints = [];
                                // 请求下一页
                                HomeStore.gccoinsAction(this.allRandomPoints.length);
                            }
                        }}
                    />
                );
            })
        )
    }

    row1View(bgImage, title, index) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ width: 53, height: 53 }}
                    onPress={() => { this._activityClick(index) }} activeOpacity={1}>
                    <Image source={bgImage} style={{ width: 53, height: 53 }} />
                </TouchableOpacity>
                <Text style={{ color: OKColor.themeColor, fontSize: 14 }} numberOfLines={1}>{title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
});