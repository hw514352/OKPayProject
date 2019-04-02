
import { observable, action } from 'mobx';
// import HomeApi from '../apis/HomeApi';
import AppStore from './AppStore';
// import PropertyApi from '../apis/PropertyApi';

import ServiceUrl from '../PublicFile/ServiceUrl';
import DataRequestTool from '../PublicFile/DataRequestTool';

class HomeStore {
    @observable text: any; // 注册变量，使其成为可检测的
    @observable num: any;

    constructor() {
        this.num = 0; // 初始化变量，可以定义默认值
        this.text = "Hello, this is homePage!!!";
    }

    @observable all = 0;//居民
    @observable invitation = 0;//总邀请数
    @observable calculateForce = 0;//算力
    @observable signState = 1;//0未签到 1已签到
    @observable homeBulletin = {};//公告
    @observable rankingListData = [];//排行榜
    @observable walltNum = 1;//个人钱包数 默认有1个
    @action('主页') pageHomeDataAction = () => {
        DataRequestTool.getRequest(ServiceUrl.pageHome, { 'pageNo': 1, 'pageSize': 10 }).then((ret) => {
            if (ret.state == 0) {
                this.all = ret.dataMap.all;
                this.invitation = ret.dataMap.invitation;
                this.calculateForce = ret.dataMap.calculateForce;
                this.signState = ret.dataMap.singState;
                this.homeBulletin = ret.dataMap.homeBulletin ? ret.dataMap.homeBulletin : {};
                this.rankingListData = ret.dataMap.pageTmember.data ? ret.dataMap.pageTmember.data : [];
                this.walltNum = ret.dataMap.walltNum ? ret.dataMap.walltNum : 0;
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    //刷新首页当前资产
    @observable integralAmount = 0;
    @action('用户账号资金信息') GetmyBalance = () => {
        DataRequestTool.getRequest(ServiceUrl.myBalance, '').then((ret) => {
            if (ret.state == 0) {
                this.integralAmount = ret.dataMap.memberInfo.integralAmount ? ret.dataMap.memberInfo.integralAmount : 0;
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    // createTime:1536645174000
    // disabled:0
    // id:6
    // memberId:632554581
    // memo:"memo1"
    // quantity:11
    // state:0
    // type:1
    // updateTime:null
    @observable gccoinsDatas = [];
    @action('矿石-列表') gccoinsAction = (pageSize) => {
        let parames = { 'memberId': AppStore.userData.id, 'state': 0, 'pageSize': pageSize };
        DataRequestTool.getRequest(ServiceUrl.gccoins, parames).then((ret) => {
            if (ret.state == 0) {
                this.gccoinsDatas = ret.dataMap.data.data ? ret.dataMap.data.data : [];
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    @observable appConfigs = [];
    @action('App配置') configs = () => {
        DataRequestTool.getRequest(ServiceUrl.configs, '').then((ret) => {
            if (ret.state == 0) {
                AppStore.setConfigsData(ret.dataMap.data);
                AppStore.setCustomerServiceData(ret.dataMap.member);
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    @observable gccoinsTakeSuccess = false;
    @action('矿石-领取') gccoinsTakeAction = (gccoinsId) => {
        let formData = new FormData();
        formData.append("id", gccoinsId);
        DataRequestTool.postRequest(ServiceUrl.gccoinsTake, formData).then((ret) => {
            if (ret.state == 0) {
                this.gccoinsTakeSuccess = true;
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    // "id": 37618,
    // "mobilePhone": "18015263111",
    // "gender": 1,
    // "realName": "",
    // "nickName": "180****3111",
    // "otherName": "",
    // "headPortraitUrl": "http://image.uuschool.cn/20180910/234a3bb186b045a8aef0fe5ea094feac",
    // "calculateForce": 310             //排行榜个人算力值
    @observable calculateForceRankingData = [];
    @observable memberData = {};//自己的算力数据
    @action('算力排行榜') getCalculateForceRanking = () => {
        DataRequestTool.getRequest(ServiceUrl.getCalculateForceRanking, '').then((ret) => {
            if (ret.state == 0) {
                this.calculateForceRankingData = ret.dataMap.data ? ret.dataMap.data : [];
                this.memberData = ret.dataMap.member ? ret.dataMap.member : {};
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    ownCalForce_pageNo = 1;
    ownCalForce_pageSize = 10;
    ownCalForce_noMoreData = false;

    reloadOwnCalForce() {
        ownCalForce_pageNo = 1;
        ownCalForce_noMoreData = false;
        this.ownCalForce();
    }
    loadMoreOwnCalForce() {
        if (!this.ownCalForce_noMoreData) {
            this.ownCalForce_pageNo += 1;
            this.ownCalForce();
        }
    }

    @observable ranking = 0;
    @observable calculateForce = 0;
    @observable ownCalForceData = [];  // 1:签到奖励； 2:邀请奖励
    @action('我的算力') ownCalForce = () => {
        DataRequestTool.getRequest(ServiceUrl.ownCalForce, { 'pageNo': pageNo, 'pageSize': pageSize }).then((ret) => {
            if (ret.state == 0) {
                this.ranking = ret.dataMap.ranking ? ret.dataMap.ranking : 0
                this.calculateForce = ret.dataMap.calculateForce ? ret.dataMap.calculateForce : 0

                let arr = ret.dataMap.pageData.data
                if (this.ownCalForce_pageNo == 1) {
                    this.ownCalForceData = arr ? arr : []
                } else {
                    this.ownCalForceData = this.ownCalForceData.concat(arr ? arr : []);
                }
                let totalPage = ret.dataMap.pageData.totalPage
                if (this.ownCalForceData.length >= totalPage) {
                    this.ownCalForce_noMoreData = true;
                }
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }


    // @observable totalCount = 1;
    // @observable didLoadAllData = false;
    // //type 1-挂单通知，2-转余额通知，3-奖励通知
    // @observable messageList = [];
    // @action('系统信息列表') messageListAction = (pageNo, pageSize) => {
    //     HomeApi.getMessageListData(pageNo, pageSize).then((ret) => {
    //         if (ret.state == 0) {
    //             let arr = ret.dataMap.messList.data
    //             if (pageNo == 1) {
    //                 this.messageList = arr ? arr : [];
    //             } else {
    //                 let temp = this.messageList.slice();
    //                 temp = temp.concat(arr ? arr : []);
    //                 this.messageList = temp;
    //             }
    //             this.totalCount = ret.dataMap.messList.totalCount;
    //             this.didLoadAllData = arr.length < pageSize;
    //         }
    //     }).catch((err) => {
    //     });
    // }

    // @observable hashs = '';// 算力
    // @observable totalGc = '';// 我的GC
    // @observable fruits = [];// 可收割的GC
    // @action('首页可收割的GC，算力') GCOrdersFruitsAction = () => {
    //     HomeApi.getGCOrdersFruitsData().then((ret) => {
    //         if (ret.state == 0) {
    //             this.hashs = ret.dataMap.hashs ? ret.dataMap.hashs : '0';
    //             this.totalGc = ret.dataMap.totalGc ? ret.dataMap.totalGc : '0';
    //             this.fruits = ret.dataMap.fruits ? ret.dataMap.fruits : [];
    //         }
    //     }).catch((err) => {
    //     });
    // }

    // @observable signInSuccess = false;
    // @action('签到（添加算力）') signIn = () => {
    //     HomeApi.signInAction().then((ret) => {
    //         if (ret.state == 0) {
    //             this.signInSuccess = true;
    //         }
    //     }).catch((err) => {
    //     });
    // }

    

    // @observable problemList = [];
    // @action('玩转btb-问题列表') getProblemList = () => {
    //     HomeApi.getProblemListData().then((ret) => {
    //         if (ret.state == 0) {
    //             this.problemList = ret.dataMap.ProblemList ? ret.dataMap.ProblemList : [];
    //         }
    //     }).catch((err) => {
    //     });
    // }
    // @action('玩转btb-已阅读') didReadProblem = (id) => {
    //     HomeApi.didReadProblem(id).then((ret) => {
    //         if (ret.state == 0) {
    //             console.log('已阅读：id:', id);
    //         }
    //     }).catch((err) => {
    //     });
    // }

    
    // // 获取我的好友列表
    // friend_pageNo = 1;
    // friend_pageSize = 10;
    // friend_noMoreData = false;
    // reloadGetFriendList(type) {
    //     this.friend_pageNo = 1;
    //     this.friend_noMoreData = false;
    //     this.getFriendList(type);
    // }
    // loadMoreFriendList(type) {
    //     if (!this.friend_noMoreData) {
    //         this.friend_pageNo += 1;
    //         this.getFriendList(type);
    //     }
    // }

    // @observable invitesList = [];
    // @observable invitesCount = 0;//总条数
    // @observable friendCalculateForce = 0;//总算力
    // //type 1=我的好友 2=邀请好友
    // @action('获取我的好友列表') getFriendList = (type) => {
    //     HomeApi.getFriendList(this.friend_pageNo, this.friend_pageSize, type).then((ret) => {
    //         if (ret.state == 0) {
    //             let arr = ret.dataMap.invitesList
    //             if (this.friend_pageNo == 1) {
    //                 this.invitesList = arr ? arr : []
    //             } else {
    //                 this.invitesList = this.invitesList.concat(arr ? arr : []);
    //             }
    //             this.invitesCount = ret.dataMap.invitesCount ? ret.dataMap.invitesCount : 0
    //             this.friendCalculateForce = ret.dataMap.calculateForce ? ret.dataMap.calculateForce : 0
    //             if (this.invitesList.length >= this.invitesCount) {
    //                 this.friend_noMoreData = true;
    //             }
    //         }
    //     }).catch((err) => {
    //     });
    // }

    // @observable QRCodeUrl = '';
    // @action('获取邀请二维码') getQRCode = (url1, parentPhone, invitationCode) => {
    //     HomeApi.getQRCodeWithStr(url1, parentPhone, invitationCode).then((ret) => {
    //         if (ret.state == 0) {
    //             this.QRCodeUrl = ret.dataMap.url ? ret.dataMap.url : '';
    //         }
    //     }).catch((err) => {
    //     });
    // }

    

    

    

    // //      "id": 3,
    // //       "memberId": 123456,
    // //       "inviteFriends": false,        //是否已邀请用户
    // //       "sendDynamic": false,        //是否发生朋友圈
    // //       "isOnMessage": true,            //是否发生消息信息
    // //       "isTransaction": false,            //是否转账、充值等
    // //       "createTime": 1543831568000,
    // //       "updateTime": 1543831582000,
    // //       "totalCalculateForce": null     //总算力
    // @observable hashRateData = {};
    // @observable totalCalculateForce = 0;
    // @action('增加算力任务接口') getTaskStatus = () => {
    //     HomeApi.getTaskStatus().then((ret) => {
    //         if (ret.state == 0) {
    //             this.hashRateData = ret.dataMap.data ? ret.dataMap.data : {};
    //             this.totalCalculateForce = ret.dataMap.totalCalculateForce ? ret.dataMap.totalCalculateForce : 0;
    //         }
    //     }).catch((error) => {

    //     });
    // }
}

export default new HomeStore();