import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import CountDownReact from '../CountDownGroup';

type Props = {};
export default class GroupCountdown extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }
  render() {
    return (
      <View style={styles.container}>
      <CountDownReact
          date={this.props.date}
          daysStyle={[styles.CountDownType,{width: null}]}
          hoursStyle={styles.CountDownType}
          minsStyle={styles.CountDownType}
          secsStyle={styles.CountDownType}
          secondColonStyle={{color: '#272727',fontSize: 12,fontWeight: '200',lineHeight: 21,paddingHorizontal: 2}}
          firstColonStyle={{color: '#272727',fontSize: 12,fontWeight: '200',lineHeight: 21,paddingHorizontal: 2}}
          ref='countDownReact'
          isTimeOut={this.props.isTimeOut}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  CountDownType: {
    height: 24,width:24, textAlign: 'center', paddingHorizontal: 4, borderRadius: 5, backgroundColor: '#F2F2F2', color: '#C17D0D', fontSize: 12, fontWeight: '200', lineHeight: 21
  }
});
