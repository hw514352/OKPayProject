// import { action, observable, useStrict } from "mobx";
// import { extendObservable } from "mobx";
// import DataRequestTool from '../PublicFile/DataRequestTool';
// import ServiceUrl from '../PublicFile/ServiceUrl';
// import md5 from "react-native-md5";

class LoginStore {
    // @observable isSuccesslogin = false;
    // @action('登录请求') loginAction = (mobilePhone, password, isPasswordLogin) => {
    //     let formData = new FormData();
    //     formData.append("mobile", mobilePhone);
    //     if (isPasswordLogin) {
    //         formData.append("password", md5.hex_md5(password));
    //     } else {
    //         formData.append("smsCode", password);
    //     }
    //     DataRequestTool.postRequrst(ServiceUrl.login, formData).then((ret) => {
    //         if (ret.state == 0) {
    //             this.isSuccesslogin = true;
    //         } else {
    //         }
    //     }).catch((error) => {
    //         // Toast.show(err);
    //     });
    // }
}
export default new LoginStore()