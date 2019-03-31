'use strict';
import React from 'react';
import {
    AsyncStorage,
} from 'react-native';
import Storage from 'react-native-storage';

let storage = new Storage({
    // Use AsyncStorage for RN, or window.localStorage for web.
    // If not set, data would be lost after reload.
    storageBackend: AsyncStorage,
    // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: null,
    // cache data in the memory. default is true.
    enableCache: true,
    // if data was not found in storage or expired,
    // the corresponding sync method will be invoked and return
    // the latest data.
    sync: {
        // we'll talk about the details later.
    }
})

export default class OKStorage {
    static read(key) {
        return new Promise(function (resolve, reject) {
            storage.load({
                key: key,
            }).then(ret => {
                resolve(ret);
            }).catch(err => {
                resolve('');
            });
        });
    }
    static save(key, data, expires) {
        if (data === undefined || data === null) {
            data = "";
        }
        storage.save({
            key: key,
            data: data,
        });
    }
    static remove(key) {
        storage.remove({
            key: key
        });
    }
}
global.OKStorage = OKStorage;

/*保存的key*/
global.LastLoginPhone = 'LastLoginPhone';
global.MSUserToken = 'MSUserToken'; 
global.MSUserData = 'MSUserData';