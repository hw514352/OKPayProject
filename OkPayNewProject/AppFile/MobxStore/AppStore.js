import {
    observable,
    action,
    useStrict
} from 'mobx';

let instance = null;
class AppStore {
    constructor() {
        //单例模式
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    @observable userToken = '';//相关子账号token
    @observable userData = {};//用户信息
    //项目配置
    @observable configsData = {}
    //项目配置客服信息
    @observable customerServiceData = {}
    //系统通知监听名称
    @observable outLign = 'outLign';

    @action('用户信息') setUserData = (value) => {
        this.userData = value ? value : {};
    }
    @action('userToken') setUserToken = (value) => {
        this.userToken = value ? value : '';
    }
    @action('项目配置') setConfigsData = (value) => {
        this.configsData = value ? value : {};
    }
    @action('项目配置客服信息') setCustomerServiceData = (value) => {
        this.customerServiceData = value ? value : {};
    }
}
const store = new AppStore();
export default store;
