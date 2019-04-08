var is_Test_App = true;

// 需要用服务器调试接口打开以下注释
var HostUrl = is_Test_App ? 'http://dev.ylywcn.com' : 'http://app.okpaycity.com';
var base_project_name = '/btb2-client/'
var shopMall_project_name = '/btb2mall-client/'
var other_project_name = '/zjjoy-client/';

export default {
    is_Test_App: is_Test_App,
    HostUrl: HostUrl,
    login: base_project_name + 'api/zjjoy/login',//登录
    register: base_project_name + 'api/zjjoy/register',//注册

    //Home
    pageHome: base_project_name + "api/member/pageHome",//主页
    myBalance: base_project_name + "api/balance/myBalance",//用户
    gccoins: base_project_name + "api/gccoins",//矿石-列表
    configs: base_project_name + "api/common/configs?keys=about_us,service_telephone,fund_transfer_enabled,issue_token_total,issue_token_in,complaint_service_telephone",
    gccoinsTake: base_project_name + "api/gccoins/take",//矿石-领取
    getCalculateForceRanking: base_project_name + "api/member/task/getCalculateForceRanking",//算力排行榜
    ownCalForce: base_project_name + "api/record/ownCalForce",//我的算力

    //Okpay
    getMemberGcWallet: base_project_name + "api/zjjoy/MemberGcWallet/getMemberGcWallet",//钱包
    walletHomePage: base_project_name + "api/zjjoy/memberEthWallet/walletHomePage",//btb-eth钱包主页
    getWallets: base_project_name + "api/zjjoy/memberEthWallet/getWallets",//获取个人ETH钱包列表
    
    //Shop
    homePageData: shopMall_project_name + 'api/tgoods/homePageData',//首页
    bannerList: shopMall_project_name + 'api//zjjoy/banner/list',//banner列表
    memberIsLikes: "/btb2mall-client//api/guessYouLikeGoods/memberIsLikes", //喜欢/不喜欢
    shopGetUrl: shopMall_project_name + 'api/shop/get',//店主中心 - 店铺信息

    //Mine
    userInfo: base_project_name + "api/member/details", // 用户信息
    updateMember: base_project_name + "api/member/updateMember",//修改用户信息

    uploadImageUrlPath: "http://media.uuschool.cn/image-server/image.do?action=upload", // 上传图片接口

    // H5
    lottery_h5: HostUrl + '/btb2-wms/h5/h5-lottery.html',//抽奖页面
    projectActivities_h5: HostUrl + '/btb2-wms/h5/h5-share.html',//专题活动界面
    invite_h5: HostUrl + '/btb2-wms/h5/h5-invite.html',//邀请好友已



    
    defaultAvatar: "http://image.uuschool.cn/20181205/5b0e6cdc03b34cabb48fa652852d036e", // 默认头像
}
