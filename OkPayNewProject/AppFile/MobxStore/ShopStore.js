import { action, observable, useStrict } from "mobx";
import { extendObservable } from "mobx";
import DataRequestTool from '../PublicFile/DataRequestTool';
import ServiceUrl from '../PublicFile/ServiceUrl';
import UserDataManager from '../PublicFile/UserDataManager';

class ShopStore {
    @observable sectionData = [];// 商品数据 包括拼团和正规商品
    @observable memberLikesGoodsList = {};  //淘你喜欢(单个数据)
    @action('首页接口') homePageData = () => {
        DataRequestTool.postRequrst(ServiceUrl.homePageData, '').then((ret) => {
            if (ret.state == 0) {
                let SpellGroupsList = ret.dataMap.SpellGroupsList ? ret.dataMap.SpellGroupsList : '';
                let storesList = ret.dataMap.storesList ? ret.dataMap.storesList : '';
                let tempDic = [];
                if (SpellGroupsList) {
                    tempDic.push({ id: 0, data: SpellGroupsList.splice(0, SpellGroupsList.length > 6 ? 6 : SpellGroupsList.length) });
                }
                if (storesList) {
                    tempDic.push({ id: 1, data: storesList });
                }
                this.sectionData = tempDic;                
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