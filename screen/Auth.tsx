import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const Auth = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Auth Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Note')}
        style={{
          alignItems: 'center',
          backgroundColor: '#DDDDDD',
          padding: 10,
        }}>
        <Text>Add Note</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Auth;
