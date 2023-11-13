import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';

const Note = ({navigation}) => {
  const getAPi = async (): Promise<any> => {
    const API_URL = 'https://dummyjson.com/todos';
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('DATA ==> ', JSON.stringify(data, null, 2));
    return data;
  };

  // Queries
  const query = useQuery({queryKey: ['todos'], queryFn: getAPi});
  console.log('Query => ', JSON.stringify(query.data, null, 2));

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Note Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddNote')}
        style={{
          alignItems: 'center',
          backgroundColor: '#DDDDDD',
          padding: 10,
        }}>
        <Text>AddNote</Text>
      </TouchableOpacity>

      <FlatList
        data={query.data.todos}
        style={{flex: 1, paddingVertical: 30}}
        keyExtractor={item => `${item.id}`}
        renderItem={({item}) => (
          <View
            style={{
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '10%'}}>
                <Text style={{}}>{item.id}</Text>
              </View>
              <View style={{width: '80%'}}>
                <Text style={{}}>{item.todo}</Text>
              </View>
              <View>
                <Text style={{}}>delete</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Note;
