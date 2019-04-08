import { action, observable, useStrict } from "mobx";
import { extendObservable } from "mobx";
import DataRequestTool from '../PublicFile/DataRequestTool';
import ServiceUrl from '../PublicFile/ServiceUrl';
import UserDataManager from '../PublicFile/UserDataManager';
import md5 from "react-native-md5";

class LoginStore {
    @observable isSuccesslogin = false;
    @action('登录请求') loginAction = (mobilePhone, password, isPasswordLogin) => {
        let formData = new FormData();
        formData.append("mobile", mobilePhone);
        if (isPasswordLogin) {
            formData.append("password", md5.hex_md5(password));
        } else {
            formData.append("smsCode", password);
        }
        DataRequestTool.postRequest(ServiceUrl.login, formData).then((ret) => {
            if (ret.state == 0) {
                //本地保存用户信息 同事内存保存
                UserDataManager.setUserData( ret.dataMap.member, ret.dataMap.tokenStr );
                this.isSuccesslogin = true;
            } else {
            }
        }).catch((error) => {
            // Toast.show(err);
        });
    }
}
export default new LoginStore()