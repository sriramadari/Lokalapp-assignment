import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter,useFocusEffect} from 'expo-router';

const BookmarksScreen = () => {
  const [bookmarks, setBookmarks] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys,"<=======keys")
      // const jobKeys = keys.filter((key) => key.startsWith('job_'));
      const jobBookmarks = await AsyncStorage.multiGet(keys);
      console.log(typeof(jobBookmarks),"<=======jobBookmarks")
      const parsedBookmarks = jobBookmarks.map(([key, value]:any) => JSON.parse(value));
      console.log(parsedBookmarks.length, "<=======parsedBookmarks");
      setBookmarks(parsedBookmarks)
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (id:any) => {
    try {
      await AsyncStorage.removeItem(`job_${id}`);
      fetchBookmarks();
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }:any) => (
    <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }}>
    <Image source={{ uri: item.logo }} style={{ width: 50, height: 50, marginRight: 10 }} />
    <Text style={{ flex: 1 }} onPress={() => router.push({ pathname: `/Jobs/${item.id}`})}>{item.title}</Text>
    <TouchableOpacity onPress={() => handleRemoveBookmark(item.id)}>
      <FontAwesome name="remove" size={24} color="red" />
    </TouchableOpacity>
  </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{headerShown:true,title:"BookMarks",headerTitleAlign: 'center'}}/>
      {loading && (
        <ActivityIndicator size="large" color="red" />
      )}
      {bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No bookmarks found</Text>}
        />
      ):<Text style={{ textAlign: 'center', marginTop: 20 }}>No bookmarks found</Text>
      }
    </View>
  );
};

export default BookmarksScreen;