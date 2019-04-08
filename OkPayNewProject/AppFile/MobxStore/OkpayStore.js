import { action, observable, useStrict } from "mobx";
import { extendObservable } from "mobx";
import DataRequestTool from '../PublicFile/DataRequestTool';
import ServiceUrl from '../PublicFile/ServiceUrl';
import UserDataManager from '../PublicFile/UserDataManager';
import AppStore from './AppStore'

class OkpayStore {
    @observable isGetWalletListSuccess = false;
    @observable ETCWalletListData = [];
    @action('区块链钱包') GetETCWalletData = () => {
        DataRequestTool.postRequest(ServiceUrl.getWallets, '').then((ret) => {
            if (ret.state == 0) {
                this.ETCWalletListData = ret.dataMap.wallets.data ? ret.dataMap.wallets.data : [];
                this.isGetWalletListSuccess = value;
            }
        }).catch((error) => {
            Toast.show(err);
        });
    }

    @observable ETHWalletPageDetail;
    @observable walletPassword = '';
    @observable memberEthWalletInfoList = []
    @action setETHWalletPageDetail = (value) => {
        this.ETHWalletPageDetail = value;
        this.memberEthWalletInfoList = value.memberEthWalletInfoList ? value.memberEthWalletInfoList : [];
    }
    @action('btb-eth钱包主页') GetETHWalletPageData = (id) => {
        let formData = new FormData();
        formData.append("id", id);
        DataRequestTool.postRequest(ServiceUrl.walletHomePage, formData).then((ret) => {
            if (ret.state == 0) {
                this.walletPassword = ret.dataMap.Walle.walletPassword;
                this.setETHWalletPageDetail(ret.dataMap.Walle);
            }
        }).catch((error) => {
            Toast.show(err);
        });
    }
}

export default new OkpayStore()