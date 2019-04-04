import React, { Component, PureComponent } from 'react';
import {
    DeviceEventEmitter,
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    TouchableOpacity,
    SectionList,
    FlatList,
    UIManager
} from 'react-native';
import GlobalParameters from '../../PublicFile/GlobalParameters';
import { observer } from 'mobx-react/native';
import { observe } from 'mobx';
import Images from '../../PublicFile/Images';
import ShopStore from '../../MobxStore/ShopStore';
import AppStore from '../../MobxStore/AppStore';
import PublicMethods from '../../PublicFile/PublicMethods';
import ServiceUrl from '../../PublicFile/ServiceUrl';
import Swiper from 'react-native-swiper';
import CountDownReact from '../../CustomComponents/GroupCountdown';
import moment from "moment/moment";
import Toast from 'react-native-zzy-toast';

const Item_Height = 425;

interface Props { }
@observer
export default class ShopMainPage extends Component<Props> {
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            selectedNow: 0,
            isShowHeaderImg: true,//是否显示头部图片
            isShowHeaderImgAnimated: new Animated.Value(1),
            isShowAdvert: new Animated.Value(1),
            titleArray: [],
            choiceIndex: 0,
            swichAnim: new Animated.Value(1),
            selectAnimated: new Animated.Value(OKScreen.width / 4 / 2 - 25),
        };
        this.notScrollY = 0;
    }

    componentDidMount() {
        // 商品分类列表
        ShopStore.homePageData();
        ShopStore.bannerList(1);//banner数据
        // observe(ShopStore, 'catList', (change) => {
        //     this.setState({
        //         titleArray: ShopStore.catList.slice(),
        //         selectAnimated: new Animated.Value(OKScreen.width / ShopStore.catList.length / 2 - 25),
        //     })
        // });
        observe(ShopStore, 'isMemberIsLikes', (change) => {
            if (ShopStore.isMemberIsLikes) {
                ShopStore.isMemberIsLikes = false;
                //刷新列表
                ShopStore.homePageData();
            }
        })

        // 切换到商城的TAB通知
        DeviceEventEmitter.addListener('changeToShopTab', (data) => {
            // 切换到第一个品类
            this.setState({ choiceIndex: 0 })
        });
        DeviceEventEmitter.addListener('GoodsLikeStatusDidChange', () => {
            ShopStore.homePageData();
        });
    }

    advertisShowAction(isShow: number, duration: number) {
        Animated.timing(this.state.isShowAdvert, {
            toValue: isShow,
            duration: duration
        },
        ).start();
    }

    choiceHeadIndex(index) {
        this.setState({ choiceIndex: index })
        Animated.timing(
            this.state.selectAnimated,
            {
                toValue: OKScreen.width / ShopStore.catList.length * index + (OKScreen.width / 3) / 2 - 25
            }
        ).start();
    }

    layout = (e, index) => {
        var UIManager = require('UIManager');
        UIManager.measure(e.target, (x, y, width, height, left, top) => {
            //console.log(index+'left',left+width/2);
        })
    }

    makeLikeOrDisLike(item) {
        //喜欢或不喜欢  1=不喜欢  2=喜欢
        if (item.isLike != 2) {
            ShopStore.memberIsLikesAction(item.goodsId, 2);
        } else {
            ShopStore.memberIsLikesAction(item.goodsId, 1);
        }
    }

    //是否参团
    isShouldToView(isTimeOut, item) {
        if (!isTimeOut) {
            this.props.navigation.push("GroupBuyDetails", { goodsId: item.goodsId, goodsType: 1, spellGroupId: item.spellGroupId });//
        }
    }

    // 下拉刷新
    sessionListRefresh = () => {
        ShopStore.homePageData();
        ShopStore.bannerList(1);//banner数据
    }
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
                <View style={{ width: OKScreen.width, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#F2F2F2', alignItems: 'center', 
                    paddingTop: OKScreen.statusBarHeight, height: OKScreen.navigationHeight }}>
                    <TouchableOpacity style={{ position: 'absolute', left: 10, top: OKScreen.statusBarHeight + 12 }}
                        onPress={() => {
                            this.props.navigation.push("ShopMallHomePage")
                        }}>
                        <Image resizeMode="cover" source={Images.menu} style={{ height: 18, width: 23 }} />

                    </TouchableOpacity>
                    <Text style={{ color: '#272727', fontSize: 16 }}></Text>

                    <TouchableOpacity style={{ width: OKScreen.width - 148, backgroundColor: 'white', borderRadius: 4, position: 'absolute', left: 45, 
                        bottom: OKDevice.isIPhoneX ? 15 : 7, height: 32, alignSelf: 'center', alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }}
                        onPress={() => {
                            this.props.navigation.push("SearchGoodsPage")
                        }}>
                        <Image source={Images.search} style={{ marginLeft: 13, height: 17, width: 21 }} />
                        <Text style={{ fontSize: 15, color: "#9B9B9B", marginLeft: 6 }}>输入商品名称</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', position: 'absolute', alignItems: 'center', alignSelf: 'center', right: 20, top: OKScreen.statusBarHeight + 10 }}>
                        <TouchableOpacity 
                            onPress={() => { 
                                this.props.navigation.push("likeGoodsPage") 
                            }}>
                            <Image style={{ height: 17, width: 20, justifyContent: 'center' }} source={Images.like_blank} resizeMode="contain" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 15 }}
                            onPress={() => {
                                //进入购物车
                                this.props.navigation.push("ShoppingCartPage");
                            }}>
                            <Image resizeMode="cover" source={Images.shopcart} style={{ height: 22, width: 21 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <SectionList 
                    style={{flex: 1}}
                    stickySectionHeadersEnabled={false}
                    contentContainerStyle={{ }}
                    sections={ShopStore.sectionData}
                    renderItem={({ item, index, section }) => {
                        let sectionIndex = ShopStore.sectionData.indexOf(section);                        
                        if (sectionIndex == 0) {
                            return (
                                <SpellGroupCell item={item} index={index} />
                            )
                        } else {
                            return (
                                <NormalCell item={item} index={index} />
                            )
                        }
                    }}
                    // ListHeaderComponent={this._ListHeaderComponent}
                    renderSectionHeader={this._renderSectionHeader}
                    keyExtractor={(item, index) => item.goodsId}
                />
            </View>
        );
    }
    _renderSectionHeader = ({section}) => {
        let sectionIndex = ShopStore.sectionData.indexOf(section);
        return (
            <View style={{paddingHorizontal: 10}}>
                <View style={{ height: 17 }}></View>
                {sectionIndex == 0 ? <View style={{
                    flex: 1, flexDirection: 'row', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'space-between',
                    borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: 'white'
                }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#272727", }}>拼团专区</Text>
                    <TouchableOpacity style={{ height: 40, justifyContent: 'center' }}
                        onPress={() => {
                            this.props.navigation.push("GroupBuyList")
                        }} >
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: "#B2B2B1", }}>查看更多</Text>
                    </TouchableOpacity>
                </View>:null}
            </View>
        )
    }
    _ListHeaderComponent = () => {
        let images = ShopStore.bannerListDatas;
        let mayImgUrl = String(ShopStore.memberLikesGoodsList.imgUrl).split(',');
        return (
            <View>
                <View style={{ height: 180, width: OKScreen.width }}>
                    {images.length ? 
                    <Swiper autoplay={true} height={180} showsPagination={true} dotColor="white"
                        renderPagination={() => {
                        }}
                        activeDotColor={OKColor.themeColor} horizontal={true}>
                        {images.map((item, index) => {
                            return (
                                <TouchableOpacity key={index + 40} activeOpacity={1} style={{ height: 180, width: OKScreen.width }}
                                    onPress={() => {
                                        //type 1、商品，2、专题活动，3、H5链接，4、公告页，5、店铺 (暂时都是商品)
                                        this.props.navigation.push("GoodsDetailFromIdPage", { goodsId: item.value, goodsType: 1 })
                                    }}>
                                    <Image source={{ uri: item.picUrl }} style={{ flex: 1, width: OKScreen.width }} />
                                </TouchableOpacity>
                            );
                        })}
                    </Swiper> : null}
                </View>

                <View style={{ height: 128, flexDirection: 'row', backgroundColor: 'white', justifyContent: 'space-around', alignItems: 'center' }}>
                    {[{title: "精选超市", icon: Images.icon_supermarket}, 
                        { title: "限时促销", icon: Images.icon_promotions}, 
                        { title: "专题活动", icon: Images.icon_ProjectActivities}, 
                        { title: "我的订单", icon: Images.icon_order}].map((item, index) => {
                        return (
                            <TouchableOpacity key={item.title} style={{ justifyContent: 'center', alignItems: 'center' }} activeOpacity={1}
                                onPress={() => {
                                    if (index == 3) {
                                        this.props.navigation.push("MyOrder")
                                    } else if (index == 2) {
                                        this.props.navigation.push('BaseWebView', {
                                            title: '专题活动',
                                            url: ServiceUrl.projectActivities_h5 + '?token=' + AppStore.userToken,
                                        })
                                    } else {
                                        Toast.show('正在开发中,敬请期待');
                                    }
                                }}>
                                <Image source={item.icon} style={{ height: 70, width: 70 }} />
                                <Text style={{ fontSize: 15, fontWeight: '200', color: "#272727", marginTop: 7, textAlign: 'center' }}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <TouchableOpacity 
                    style={{ height: 420, overflow: 'hidden', marginHorizontal: 10, borderRadius: 6, marginTop: 17, backgroundColor: 'white' }}
                    activeOpacity={1}
                    onPress={() => {
                        this.props.navigation.push("SwipeCardsPage")
                    }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, height: 60 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#272727", }}>淘你喜欢</Text>
                        <Text style={{ fontSize: 12, fontWeight: '200', color: "#B2B2B1", }}>（总数:{ShopStore.memberLikesGoodsList.likesNum}）</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {mayImgUrl && mayImgUrl.length > 0 && mayImgUrl[0] != 'null' ? 
                            <Image resizeMode='cover' style={{ height: 351, position: 'absolute', marginTop: 9, width: '100%', alignSelf: 'center' }} source={{ uri: mayImgUrl[0] }} /> 
                        : 
                            <Image resizeMode="contain" source={Images.chat_bitmap_img} style={{ height: 1261, marginTop: 9, width: OKScreen.width - 60, alignSelf: 'center' }} />
                        }

                        <View style={{ height: 100, marginTop: 252, backgroundColor: 'rgba(255,255,255,0.65)', width: OKScreen.width - 48, borderRadius: 9, alignSelf: 'center', paddingLeft: 17 }}>
                            <Text numberOfLines={2} style={{ fontSize: 16, width: OKScreen.width - 80, fontWeight: 'bold', color: "#111111", lineHeight: 24, marginTop: 14 }}>{ShopStore.memberLikesGoodsList.goodsName}</Text>
                        </View>

                        <View style={{ height: 100, marginTop: 230, backgroundColor: 'rgba(255,255,255,0.65)', width: OKScreen.width - 60, borderRadius: 9, alignSelf: 'center', paddingLeft: 17 }}>
                            <Text numberOfLines={2} style={{ fontSize: 16, width: OKScreen.width - 100, fontWeight: 'bold', color: "#111111", lineHeight: 24, marginTop: 14 }}>{ShopStore.memberLikesGoodsList.goodsName}</Text>

                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, marginTop: 4, fontWeight: 'bold', color: OKColor.TextThemColor, textAlign: 'left' }}>{parseFloat(ShopStore.memberLikesGoodsList.price).toFixed(2)}</Text>
                                <TouchableOpacity style={{ marginTop: 5, height: 18, width: 47, backgroundColor: OKColor.buttonBackgroundColorColor, marginLeft: 6, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                    }}>
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: "#FFFFFF", textAlign: 'center' }}>赠{ShopStore.memberLikesGoodsList.integral}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

//正常商品
class NormalCell extends Component {  //换成PureComponent试试 PureComponent只适应简单的数据 如string 会做浅比较 再确认是否刷新
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            
        };
        const { item, index } = this.props;
        this.item = item;
        this.index = index;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //同个产品不刷新
        if (nextProps.item.goodsId == this.item.goodsId) {
            return false;
        }
        return true;
    }
    render() {
        item = this.item;
        index = this.index;
        console.log('Cell 正在刷新 index: ', index);
        let isShowMore = false;
        if (item.evaluNum > 99) {
            isShowMore = true;
        }
        let likePepleList = [];
        if (item.evaluMemberList) {
            if (item.evaluMemberList.length > 3) {
                for (var i = 0; i < 3; i++) {
                    likePepleList.push(item.evaluMemberList[i]);
                }
            } else {
                likePepleList = item.evaluMemberList;
            }
        }
        let images = String(item.imageUrl).split(',').filter(item => item);
        let tempLike = Images.disLike;
        if (item.isLike == 2) {
            tempLike = Images.love;
        }
        return (
            <TouchableOpacity key={index + 20} style={{ height: Item_Height, alignSelf: 'center', borderRadius: 6, marginBottom: 17, width: OKScreen.width - 20, backgroundColor: 'white' }} 
                activeOpacity={1}
                onPress={() => { 
                    this.props.navigation.push("GoodsDetailFromIdPage", { goodsId: item.goodsId, goodsType: 1 }) 
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, height: 60, width: OKScreen.width - 20, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#272727" }}>{item.shopName}</Text>
                    <TouchableOpacity onPress={() => { this.makeLikeOrDisLike(item) }}>
                        <Image resizeMode='contain' style={{ height: 17, width: 20 }} source={tempLike} />
                    </TouchableOpacity>
                </View>

                <View style={{ width: OKScreen.width - 40, height: 1, marginLeft: 10, backgroundColor: "#DBDBDA" }}></View>

                <View style={{ height: 39 }}>
                    <Text numberOfLines={1} style={{ fontSize: 15, marginHorizontal: 20, marginTop: 9, fontWeight: '200', color: "#272727" }}>
                        {item.name}
                    </Text>
                </View>

                {images && images.length > 0 && images[0] != 'null' ?
                    <Image resizeMode='contain' source={{ uri: images[0] }} style={{ height: 261, width: OKScreen.width - 60, alignSelf: 'center' }} />
                    : <Image resizeMode='contain' source={Images.chat_bitmap_img} style={{ height: 261, width: OKScreen.width - 60, alignSelf: 'center' }} />
                }

                <View style={{ height: 65, width: OKScreen.width - 40, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                        <View style={{}}>
                            <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: 15, width: 39, marginTop: 5, fontWeight: '200', color: "#A0A0A0", }}>
                                热评
                      </Text>
                            <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: 15, width: 39, fontWeight: '200', color: "#A0A0A0", }}>
                                {item.evaluNum}{isShowMore ? '+' : ''}
                            </Text>
                        </View>

                        {likePepleList.map((item, idx) => {
                            return (
                                <Image key={idx + 30} source={{ uri: item }} style={{ height: 36, marginLeft: idx == 0 ? 0 : -10, width: 36, borderRadius: 18, alignSelf: 'flex-end' }} />
                            )
                        })}
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 17, color: '#C17D0D' }}>{parseFloat(item.price).toFixed(2)}</Text>
                        {item.whetherReturnIntegral ?
                            <TouchableOpacity style={{ height: 24, backgroundColor: OKColor.buttonBackgroundColorColor, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                }}>
                                <Text style={{ fontSize: 12, fontWeight: '200', color: "#FFFFFF", textAlign: 'center', paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8 }}>赚{item.integral}积分</Text>
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
}

//拼团商品
class SpellGroupCell extends Component {  //换成PureComponent试试 PureComponent只适应简单的数据 如string 会做浅比较 再确认是否刷新
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {

        };
        const { item, index } = this.props;
        this.item = item;
        this.index = index;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //同个产品不刷新
        if (nextProps.item.goodsId == this.item.goodsId) {
            return false;
        }
        return true;
    }
    render() {
        item = this.item;
        index = this.index;

        let countDownTime = PublicMethods.SpellGroupTime(item.createTime, item.sustain);
        let countDownTimeStr = moment(countDownTime).format("YYYY/MM/DD HH:mm:ss");
        //判断时间是否到期
        //  console.log(Date.parse(new Date()),'llookk');
        let isTimeOut = false;
        if (Date.parse(new Date()) > countDownTime) {
            isTimeOut = true;
        }

        //参团人数
        let isShowMorePerson = false;
        let groupPeople = [];
        if (item.joinNumber > 3) {
            isShowMorePerson = true;
            if (item.memberSpellGroupRecordList.length > 3) {
                for (var i = 0; i < 3; i++) {
                    groupPeople.push(item.memberSpellGroupRecordList[i]);
                }
            }
        } else {
            groupPeople = item.memberSpellGroupRecordList
        }       

        return (
            <TouchableOpacity key={index + 100} activeOpacity={0.6} style={{ height: 256, backgroundColor: 'white', marginHorizontal: 10 }}
                onPress={() => {
                    this.isShouldToView(isTimeOut, item)
                }}>
                <View style={{ height: 37, alignItems: 'center', paddingLeft: 15, flexDirection: 'row', width: OKScreen.width - 20 }}>
                    <Text style={{ fontSize: 12, color: '#272727', fontWeight: 'bold' }}>{item.shopName}</Text>
                    <View style={{ position: 'absolute', right: 12 }}>
                        <CountDownReact
                            date={countDownTimeStr}
                            isTimeOut={isTimeOut}
                        />
                    </View>

                    <View style={{ position: 'absolute', bottom: 1, backgroundColor: OKColor.lineColor, left: 0, height: 1, width: OKScreen.width - 20, }}></View>
                </View>

                <View style={{ flexDirection: 'row', height: 126, alignItems: 'center' }}>

                    {item.goodsUrl != null ? <Image source={{ uri: item.goodsUrl }} style={{ marginLeft: 16, height: 88, width: 88, borderRadius: 6 }} /> : <Image source={Images.chat_bitmap_img} style={{ marginLeft: 16, height: 88, width: 88, borderRadius: 6 }} />}

                    <View style={{ marginLeft: 9, flex: 1, justifyContent: 'space-between', height: 100, justifyContent: 'flex-start' }}>
                        <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '500', color: "#272727", marginTop: 5 }}>{item.goodsName}</Text>
                        <Text style={{ fontSize: 12, color: '#272727', marginTop: 5 }} numberOfLines={1}>规格：{item.goodsspecification ? item.goodsspecification : "默认"}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 14 }}>
                            <Text style={{ fontSize: 15, color: '#FE1313', fontWeight: 'bold' }}>拼团价：{parseFloat(item.threeLevelPrice).toFixed(2)}
                            </Text>
                            <Text style={{ marginLeft: 6, textDecorationLine: 'line-through', fontSize: 11, color: '#4A4A4A' }}>原价：{parseFloat(item.goodsOldPrice).toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', bottom: 1, backgroundColor: OKColor.lineColor, height: 1, width: OKScreen.width - 20, }}></View>

                </View>
                <View style={{ height: 82, width: OKScreen.width - 40, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>

                    <View>
                        <Text numberOfLines={1} style={{ fontSize: 15, marginLeft: 20, fontWeight: '200', lineHeight: 16, color: "#A0A0A0", marginRight: 6 }}>{item.joinNumber}{isShowMorePerson ? '+' : ''}人
                            </Text>
                        <Text style={{ fontSize: 15, marginLeft: 20, fontWeight: '200', lineHeight: 16, color: "#A0A0A0", marginRight: 6 }}>参团</Text>
                    </View>

                    {groupPeople.map((item, idx) => {
                        return (
                            <Image key={idx + 10} source={{ uri: item.memberHeadPortrait }} style={{ height: 40, marginLeft: idx == 0 ? 0 : -10, width: 40, borderRadius: 20 }} />
                        )
                    })}
                    {isShowMorePerson ? <TouchableOpacity source={Images.my_bg} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#F2F2F2', justifyContent: 'center', alignItems: 'center', width: 40, borderRadius: 20 }} onPress={() => {
                        this.props.navigation.push("GroupBuyAllPerson", { memberSpellGroupRecordList: item.memberSpellGroupRecordList });
                    }}>
                        <Text style={{ fontSize: 11, fontWeight: '200', color: "#353535", textAlign: 'center' }}>更多</Text>
                    </TouchableOpacity> : null}


                    <View style={{ height: 34, borderRadius: 3, width: 80, backgroundColor: isTimeOut ? '#F2F2F2' : OKColor.themeColor, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10 }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: OKColor.TextBlackColor, textAlign: 'center' }}>去参团</Text>
                    </View>
                </View>

                <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'white', left: 0, height: index > 1 ? 0 : 15, alignItems: 'center', width: OKScreen.width - 20, overflow: 'hidden', flexDirection: 'row' }}>
                    <View style={{ backgroundColor: '#F0F0F0', left: -8, width: 16, borderRadius: 8, height: 16, position: 'absolute', }}>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: '#F0F0F0', height: 1, width: OKScreen.width, borderStyle: 'dashed' }}>
                    </View>
                    <View style={{ position: 'absolute', right: -8, width: 16, borderRadius: 8, height: 16, backgroundColor: '#F0F0F0', }}>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        paddingLeft: 10,
        paddingRight: 10
    },
    headerImg: {
        height: 150,
        width: OKScreen.width,
        resizeMode: 'stretch'
    },
    activityIcon: {
        height: 44,
        width: 44,
    },
    activityTxt: {
        fontSize: 12,
        color: '#525252',
        marginTop: 8
    },
    activityView: {
        width: 70, height: 68, alignItems: 'center'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    //模块板
    mobTopView: {
        height: 111,
        flex: 1,
        flexDirection: 'row'
    },
    headerImgView: {
        width: OKScreen.width,
        height: 250,
        position: 'absolute'
    },
    advertisIcon: {
        height: 80,
        width: 100,
        position: 'absolute',
        bottom: 20
    }
});