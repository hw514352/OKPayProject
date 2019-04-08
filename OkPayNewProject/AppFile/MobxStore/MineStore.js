import { action, observable, useStrict } from "mobx";
import { extendObservable } from "mobx";
import DataRequestTool from '../PublicFile/DataRequestTool';
import ServiceUrl from '../PublicFile/ServiceUrl';
import UserDataManager from '../PublicFile/UserDataManager';
import AppStore from './AppStore';

class MineStore {
    @observable arrayFriend = []; // 数据
    @observable totalCount; // 总数量
    @observable isLoadAll = false; // 是否加载全部数据
    @observable isUserRefresh = false; // 是否加载全部数据
    @action('获取用户信息') getUserInfo = () => {
        DataRequestTool.getRequest(ServiceUrl.userInfo, '').then((ret) => {
            if (ret.state == 0) {
                UserDataManager.setUserData(ret.dataMap.member, ret.dataMap.member.authToken);
                this.isUserRefresh = true;
            }
        }).catch((error) => {
            Toast.show(err);
        });
    }

    @observable isRefreshingAssets = false;
    @action('上传图片') requestUploadImage = (keyPath, sourceUrlPath) => {
        let file = { uri: 'file://' + sourceUrlPath, type: 'multipart/form-data', name: 'Picture_06_Space.jpg' };
        let formData = new FormData();
        formData.append("payPicUrl", file);
        DataRequestTool.postRequest(ServiceUrl.uploadImageUrlPath, formData).then((ret) => {
            if (ret.status == 1) {
                this.updateMember({ [keyPath]: ret.imageUrl }, true);
            } else {
                Alert.alert('出错了');
            }
        }).catch((error) => {
            Alert.alert('出错了' + error);
        });
    }

    @observable isUpdateMember = false;
    @action setisUpdateMember = (value) => {
        this.isUpdateMember = value;
    }
    @action('修改用户信息') updateMember = (dic, isSaveDisk) => {
        let formData = new FormData();
        formData.append("mobilePhone", dic.mobilePhone ? dic.mobilePhone : '');
        formData.append("realName", dic.realName ? dic.realName : '');
        formData.append("nickName", dic.nickName ? dic.nickName : '');
        formData.append("gender", dic.gender ? dic.gender : '');
        formData.append("headPortraitUrl", dic.headPortraitUrl ? dic.headPortraitUrl : '');
        formData.append("perSingnature", dic.perSingnature ? dic.perSingnature : '');
        formData.append("cofCoverPicurl", dic.cofCoverPicurl ? dic.cofCoverPicurl : '');
        if (dic.payPassword) {
            var md = forge.md.md5.create();
            md.update(String(dic.payPassword));
            let payPassword = md.digest().toHex();
            formData.append("payPassword", payPassword);
        }
        if (dic.password) {
            var md = forge.md.md5.create();
            md.update(String(dic.password));
            let password = md.digest().toHex();
            formData.append("password", password);
        }
        DataRequestTool.postRequest(ServiceUrl.updateMember, formData).then((ret) => {
            if (ret.state == 0) {
                if (isSaveDisk) {
                    // update 2018.10.23 新注册用户不能直接进主页，要充值后才能使用
                    UserDataManager.setUserData( ret.dataMap.member, ret.dataMap.tokenStr);
                    AppStore.setUserData(ret.dataMap.member);
                } else {
                    UserDataManager.cleanStorage();
                }
                this.setisUpdateMember(true);
            }
        }).catch((error) => {
            Toast.show(err);
        });
    }
}

export default new MineStore()