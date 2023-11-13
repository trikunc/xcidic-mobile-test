import React from 'react';
import {Button, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';

interface typeForm {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

const AddNote = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      id: '',
      todo: '',
      completed: false,
      userId: 5,
    },
  });

  // Mutations
  const {mutate} = useMutation({
    mutationFn: newTodo => {
      console.log('NEW TODO => ', JSON.stringify(newTodo, null, 2));
      addNote(newTodo);
    },
    onSuccess: () => {
      navigation.navigate('Note');
      // Invalidate and refetch
      // queryClient.invalidateQueries({queryKey: ['todos']});
    },
  });

  const addNote = async (value: typeForm): Promise<any> => {
    const API_URL = 'https://dummyjson.com/todos';
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        todo: value.todo,
        completed: value.completed,
        userId: value.userId,
      }),
    });
    const data = await response.json();
    console.log('DATA POST ==> ', JSON.stringify(data, null, 2));
    return data;
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>AddNote Screen</Text>
      <View style={{marginTop: 32, paddingHorizontal: 24}}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Todo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="todo"
        />
        {errors.todo && <Text>This is required.</Text>}

        <Button title="Submit" onPress={handleSubmit(mutate)} />
        {/* <Button title="Submit" onPress={() => addNote()} /> */}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Note')}
        style={{
          alignItems: 'center',
          backgroundColor: '#DDDDDD',
          padding: 10,
        }}>
        <Text>Note</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNote;
