/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import LoginPage from './AppFile/Login/LoginPage';
import { TabBarRouter } from './AppFile/PublicFile/MainTabBar';

AppRegistry.registerComponent(appName, () => TabBarRouter);
