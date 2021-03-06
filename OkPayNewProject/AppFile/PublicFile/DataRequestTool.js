'use strict';
import { DeviceEventEmitter } from 'react-native';
import ServiceUrl from './ServiceUrl';
import Toast from 'react-native-zzy-toast';
import AppStore from '../MobxStore/AppStore'
/**
 * fetch 网络请求的header，可自定义header 内容
 * @type {{Accept: string, Content-Type: string, accessToken: *}}
 */
let header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "Connection": "close",
    "type": "getUserData"
}

/**
 * GET 请求时，拼接请求URL
 * @param url 请求URL
 * @param params 请求参数
 * @returns {*}
 */
const handleUrl = (url, params) => {
    if (params) {
        let paramsArray = []
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(params[key])))
        if (url.search(/\?/) === -1) {
            typeof (params) === 'object' ? url += '?' + paramsArray.join('&') : url
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return url
}

/**
 * fetch 网络请求超时处理
 * @param original_promise 原始的fetch
 * @param timeout 超时时间 30s
 * @returns {Promise.<*>}
 */
const timeoutFetch = (original_fetch, timeout = 1500) => {
    let timeoutBlock = () => { }
    let timeout_promise = new Promise((resolve, reject) => {
        timeoutBlock = () => {
            // 请求超时处理
            reject('timeout promise')
        }
    })
    // Promise.race(iterable)方法返回一个promise
    // 这个promise在iterable中的任意一个promise被解决或拒绝后，立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。
    let abortable_promise = Promise.race([
        original_fetch,
        timeout_promise
    ])

    setTimeout(() => {
        timeoutBlock()
    }, timeout)

    return abortable_promise
}

export default class DataRequestTool {
    /**
   * 基于fetch 封装的GET 网络请求
   * @param url 请求URL
   * @param params 请求参数
   * @returns {Promise}
   */
    static getRequest = (url, params, isLoading) => {
        if (isLoading == 1) {
            Toast.showLoading();
        } else if (isLoading != 0) {
            Toast.showLoading(isLoading);
        }
        header.token = AppStore.userToken ? AppStore.userToken : '';
        return timeoutFetch(fetch(handleUrl(ServiceUrl.HostUrl + url, params), {
            method: 'GET',
            headers: header
        })).then((response) => { 
            Toast.hide();
            // 成功后检查数据
            if (response.ok) {
                return response.json()
            } else {
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }).then((json) => {
            //解析数据
            console.log('json:', json, ",path:", ServiceUrl.HostUrl + url);  
            if (json.state == 301 || json.state == 302) {
                //登录失效
                DeviceEventEmitter.emit(AppStore.logout, '登录失效，请重新登录');
            }
            return json
        }).catch(error => {
            Toast.show(error);
            throw error
        })
    }

    /**
     * 基于fetch 的 POST 请求
     * @param url 请求的URL
     * @param params 请求参数
     * @returns {Promise}
     */
    static postRequest = (url, params, isLoading) => {
        if (isLoading == 1) {
            Toast.showLoading();
        } else if (isLoading != 0) {
            Toast.showLoading(isLoading);
        }

        header.token = AppStore.userToken ? AppStore.userToken : '';
        url = url.indexOf("http") != -1 ? url : ServiceUrl.HostUrl + url;
        return timeoutFetch(fetch(url, {
            method: 'POST',
            headers: header,
            body: params
        })).then(response => {
            Toast.hide();
            // 成功后检查数据
            if (response.ok) {
                return response.json()
            } else {
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }).then(json => { 
            //解析数据
            console.log('json:', json, ",path:", ServiceUrl.HostUrl + url); 
            if(json.state == 301 || json.state == 302){
                //登录失效
                DeviceEventEmitter.emit(AppStore.logout, '登录失效，请重新登录');
            }
            return json
        }).catch(error => {
            Toast.show(error);
            throw error
        })
    }
}
