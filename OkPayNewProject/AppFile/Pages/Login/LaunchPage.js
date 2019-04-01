import React, { Component } from 'react';
import { TouchableOpacity, Platform, TextInput, StyleSheet, Text, View, ScrollView } from 'react-native';
import GlobalParameters from '../../PublicFile/GlobalParameters';
import AppStore from '../../MobxStore/AppStore';
import OKStorage from '../../PublicFile/OKStorage';
import UserDataManager from '../../PublicFile/UserDataManager';

export default class LaunchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        OKStorage.read(MSUserToken).then((ret) => {
            //是否已经登录
            if (ret.length > 0) {
                this.props.navigation.navigate('NormalModalNavigator');
            } else {
                this.props.navigation.navigate('LoginStackNavigator');
            }
        }).catch(() => {
            this.props.navigation.navigate('LoginStackNavigator');
        });
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: "LaunchPage"
    })

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ marginBottom: 50 }}
                    onPress={() => {
                        this.props.navigation.navigate('LoginStackNavigator');
                    }}>
                    LoginStackNavigator</Text>
                <Text style={{}}
                    onPress={() => {
                        this.props.navigation.navigate('NormalModalNavigator');
                    }}>
                    NormalModalNavigator</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        fontSize: 15,
        color: 'black',
        height: 45,
        width: OKScreen.width - 15,
        marginLeft: 15,
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: 1
    },
});