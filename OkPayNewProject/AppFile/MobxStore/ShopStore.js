import { action, observable, useStrict } from "mobx";
import { extendObservable } from "mobx";
import DataRequestTool from '../PublicFile/DataRequestTool';
import ServiceUrl from '../PublicFile/ServiceUrl';
import UserDataManager from '../PublicFile/UserDataManager';

class ShopStore {
    @observable storesList = [];  //商店
    @observable SpellGroupsList = []; //拼团
    @observable memberLikesGoodsList = {};  //淘你喜欢(单个数据)
    @action('首页接口') homePageData = () => {
        DataRequestTool.postRequrst(ServiceUrl.homePageData, '').then((ret) => {
            if (ret.state == 0) {
                this.storesList = ret.dataMap.storesList ? ret.dataMap.storesList : [];
                this.SpellGroupsList = ret.dataMap.SpellGroupsList ? ret.dataMap.SpellGroupsList : [];
                this.memberLikesGoodsList = ret.dataMap.memberLikesGoodsList ? ret.dataMap.memberLikesGoodsList : {};
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    @observable bannerListDatas = [];
    @action('banner列表') bannerList = (bannerType) => {
        DataRequestTool.getRequest(ServiceUrl.bannerList, {bannerType: bannerType}).then((ret) => {
            if (ret.state == 0) {
                this.bannerListDatas = ret.dataMap.list ? ret.dataMap.list : [];
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }

    @observable isMemberIsLikes = false;
    @action('喜欢/不喜欢') memberIsLikesAction = (id, type) => {
        let formData = new FormData();
        formData.append("type", type);
        formData.append("goodId", id);
        DataRequestTool.postRequrst(ServiceUrl.bannerList, formData).then((ret) => {
            if (ret.state == 0) {
                this.isMemberIsLikes = true
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }
}
export default new ShopStore()