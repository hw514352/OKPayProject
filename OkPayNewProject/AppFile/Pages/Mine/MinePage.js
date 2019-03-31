import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
export default class MinePage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'red' }}>

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