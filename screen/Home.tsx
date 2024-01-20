import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {SearchBar} from '@rneui/themed';
import {ActivityIndicator} from 'react-native-paper';

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [noData, setNoData] = useState(false);

  const [listData, setListData] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchItem();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchListRiwayatLoadMore();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [page]);

  const fetchItem = async () => {
    setLoading(true);
    setNoData(false);
    try {
      const response = await fetch(
        `https://yts.am/api/v2/list_movies.json?limit=10&page=${page}&query_term=${search}`,
      );
      const movies = await response.json();
      // console.log('Movie => ', JSON.stringify(movies, null, 2));
      if (movies.status === 'ok') {
        if (movies.data.movie_count === 0) {
          setNoData(true);
        }

        setListData(movies.data.movies);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async info => {
    console.log(info);
    setPage(prevState => prevState + 1);
    // fetchListRiwayatLoadMore();
  };

  const fetchListRiwayatLoadMore = async () => {
    setMoreLoading(true);
    try {
      const response = await fetch(
        `https://yts.am/api/v2/list_movies.json?limit=10&page=${page}&query_term=${search}`,
      );
      const movies = await response.json();
      // console.log('Movie => ', JSON.stringify(movies, null, 2));
      if (movies.status === 'ok') {
        if (movies.data.movie_count === 0) {
          setNoData(true);
        }
        setListData([...listData, ...movies.data.movies]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMoreLoading(false);
    }
  };

  const updateSearch = search => {
    setSearch(search);
  };

  console.log('List Data => ', JSON.stringify(listData));

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{padding: 10}}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={updateSearch}
          value={search}
          lightTheme={true}
          round={true}
          inputStyle={{
            fontSize: 14,
            color: 'black',
            // backgroundColor: 'lightgrey',
          }}
          inputContainerStyle={{
            backgroundColor: 'lightgrey',
          }}
          containerStyle={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          // leftIconContainerStyle={{
          //   backgroundColor: 'white',
          // }}
        />
      </View>

      {loading ? (
        renderActivityIndicator()
      ) : (
        <FlatList
          style={{flex: 1}}
          data={listData}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.01}
          onEndReached={info => {
            loadMore(info);
          }}
          renderItem={({item}) => {
            console.log('Item: ', item);
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Detail', {
                    id: item.id,
                    title: item.title,
                  })
                }
                style={{flexDirection: 'row', padding: 12.5, gap: 5}}>
                <Image
                  source={{uri: item.medium_cover_image}}
                  style={{
                    width: 45, // Set the desired width
                    height: 67, // Set the desired height
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}
                />
                <View style={{justifyContent: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginBottom: 3,
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: 'lightgray',
                      fontSize: 12,
                      fontWeight: 'regular',
                    }}>
                    rating: {item.rating}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={renderFooter(moreLoading, noData)}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

export default Home;

const renderActivityIndicator = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" />
  </View>
);

const renderFooter = (moreLoading, noData) => {
  console.log('nodata1 =', noData);
  if (!noData) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {moreLoading && <ActivityIndicator />}
      </View>
    );
  }
};
const renderEmptyState = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text
      style={{
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 3,
      }}>
      No data available
    </Text>
  </View>
);
