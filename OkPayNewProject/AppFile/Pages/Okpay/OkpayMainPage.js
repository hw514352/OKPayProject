import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
export default class OkpayMainPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'yellow' }}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
});