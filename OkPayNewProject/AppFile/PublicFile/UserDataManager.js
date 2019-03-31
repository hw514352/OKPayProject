
import OKStorage from './OKStorage';
import AppStore from '../MobxStore/AppStore';
import GlobalParameters from './GlobalParameters';

class UserDataManager {
    constructor(props) {
        this.loadData()
    }
    /* 初始化AppStore属性数据 APP启动时 new UserDataManager() 会加载一次*/
    loadData() {
        OKStorage.read(MSUserToken).then((ret) => {
            // AppStore.setUserToken(ret ? ret : '');
        }).catch(() => {
        });
        OKStorage.read(MSUserData).then((ret) => {
            // AppStore.setUserData(ret ? ret : '');
        }).catch(() => {
        });
    }
    //保存用户的信息资料  token 用户信息
    setUserData = (userData, userToken) => {
        //用户信息
        if (userData) {
            OKStorage.save(MSUserData, userData);
            AppStore.setUserData(userData);
        }
        //token
        if (userToken) {
            OKStorage.save(MSUserToken, userToken);
            AppStore.setUserToken(userToken);
        }
    }

    /* 退出登录,清除一些数据*/
    cleanStorage() {
        OKStorage.save(MSUserToken, '');
        AppStore.setUserToken('');
    }
}

const userDataManager = new UserDataManager();
export default userDataManager;
