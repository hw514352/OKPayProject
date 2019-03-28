// import { action, observable, useStrict } from "mobx";
// import { extendObservable } from "mobx";
// import DataRequestTool from '../PublicFile/DataRequestTool';
// import ServiceUrl from '../PublicFile/ServiceUrl';
// import md5 from "react-native-md5";

// class LoginStore {
//     @observable isSuccesslogin = false;
//     @action('登录请求') loginAction = (memberId, mobilePhone, isPwdLogin) => {

//         let formData = new FormData();
//         formData.append("mobile", '17688791108');
//         formData.append("password", md5.hex_md5('123456'));
//         DataRequestTool.postRequrst(ServiceUrl.login, formData).then((ret) => {
//             if (ret.state == 0) {
//                 Toast.show('成功');
//             } else {
//                 Toast.show(ret.errorMessage);
//             }
//         }).catch((error) => {
//             Toast.show(err);
//         });
//     }
// }
// export default new LoginStore()