import {Text} from '@rneui/base';
import React, {useEffect, useState} from 'react';
import {View, Image, ScrollView, FlatList} from 'react-native';
import {ImageSlider} from 'react-native-image-slider-banner';
import {ActivityIndicator} from 'react-native-paper';

type Props = {};

const Detail = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [images, setImages] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    setLoading(true);
    const response = await fetch(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${props.route.params.id}&with_images=true&with_cast=true`,
    );
    const movieItem = await response.json();
    // console.log('Movie => ', JSON.stringify(movies, null, 2));
    if (movieItem.status === 'ok') {
      setMovie(movieItem.data.movie);
      setImages([
        {img: movieItem.data.movie.medium_screenshot_image1},
        {img: movieItem.data.movie.medium_screenshot_image2},
        {img: movieItem.data.movie.medium_screenshot_image3},
      ]);
      setGenres(movieItem.data.movie.genres);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View />
      {loading ? (
        renderActivityIndicator()
      ) : (
        <View>
          <View style={{marginTop: 0}}>
            <ImageSlider
              data={images}
              autoPlay={false}
              onItemChanged={item => console.log('item', item)}
              closeIconColor="#fff"
            />
          </View>

          <View style={{padding: 12.5}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', width: '35%'}}>
                <Text style={{fontWeight: 'bold'}}>Year: </Text>
                <Text>{movie.year}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Rating: </Text>
                <Text>{movie.rating}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', width: '35%'}}>
                <Text style={{fontWeight: 'bold'}}>Runtime: </Text>
                <Text>{movie.runtime}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Language: </Text>
                <Text>{movie.language}</Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', width: '100%'}}>
              <Text style={{fontWeight: 'bold'}}>Genres: </Text>
              {genres &&
                genres.map((item, idx) => (
                  <Text key={idx}>
                    {item}
                    {idx + 1 !== movie.genres.length ? ', ' : ''}
                  </Text>
                ))}
            </View>

            <View style={{flexDirection: 'row', width: '80%'}}>
              <Text style={{fontWeight: 'bold'}}>Description: </Text>
              <Text>{movie.description_full}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', width: '35%'}}>
                <Text style={{fontWeight: 'bold'}}>Cast</Text>
              </View>
            </View>

            <FlatList
              horizontal
              style={{flex: 1}}
              data={movie.cast}
              keyExtractor={item => item.imdb_code}
              renderItem={({item}) => {
                console.log('Item: ', item);
                return (
                  <View
                    style={{
                      padding: 4,
                      width: 70,
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                    <Image
                      source={{
                        uri: item.url_small_image
                          ? item.url_small_image
                          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png',
                      }}
                      style={{
                        width: 30, // Set the desired width
                        height: 45, // Set the desired height
                        resizeMode: 'cover',
                        borderRadius: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      {item.name}
                    </Text>
                    <Text style={{fontSize: 10, textAlign: 'center'}}>
                      {item.character_name}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Detail;

const renderActivityIndicator = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" />
  </View>
);
