import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList,Dimensions ,TouchableOpacity,Image,SafeAreaView,ActivityIndicator} from 'react-native';
import axios from 'axios';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack,useRouter } from 'expo-router';
import { useJobContext } from '@/hooks/useJobContext';

export default function Jobs() {
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const getPageRef = useRef(null);
  const [feedState, setFeedState] = useState({ category: 'jobs' });
  const screenWidth = Dimensions.get('window').width;
  const colorScheme = useColorScheme();
  const Router=useRouter();
  const {jobDetails,setJobDetails}=useJobContext();


  useEffect(() => {
    fetchData();
  }, []);

  const _scrollEnd = (event:any) => {
    // const offsetX = event.nativeEvent.contentOffset.x;
    // const index = Math.round(offsetX / screenWidth); // Assuming screenWidth is defined

    setTimeout(() => {
      setFeedState((prevdata) => ({ ...prevdata, category: 'jobs' }));
    }, 0);
  };

  const fetchData = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
  // console.log(response.data.results)

    setData((oldData:any)=> [...oldData, ...response.data.results]);
    setPage(page + 1);
    setLoading(false);
  };

  const _renderItem = ({ item }:any) => {
  if(!item.id || !item.title){
    return null;
  }

    return (
     <TouchableOpacity 
          onPress={() =>{
            item.Place=item?.primary_details?.Place;
            item.Salary=item?.primary_details?.Salary;
            item.Job_Type=item?.primary_details?.Job_Type;
            item.Experience=item?.primary_details?.Experience;
            item.Qualification=item?.primary_details?.Qualification;
            item.logo=item?.creatives[0]?.thumb_url;
              console.log(item?.creatives[0]?.thumb_url)
            Router.push({ pathname: `/Jobs/${item.id}`, params:item})
          }}
          style={{flexDirection:"row", justifyContent:"space-between", alignItems: 'center', backgroundColor: '#E8E8E8', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, borderWidth: 1, borderColor: '#ddd'}}
        >
      <Image
        source={{ uri: item?.creatives[0]?.thumb_url }}
        alt='image'
        style={{ width: 100, height: 100, borderRadius: 75, marginRight: 20 }}
      />
      <View style={{flex: 1}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colorScheme == 'dark' ? '#333' : '#fff' }}>{item.company_name}</Text>
          <Text style={{ color: colorScheme == 'dark' ? '#666' : '#fff', marginTop: 8 }}>{item?.primary_details?.Place}</Text>
          <Text style={{  fontWeight:"700", color: colorScheme == 'dark' ? '#666' : '#fff', marginTop: 8 }}>{item?.primary_details?.Salary}</Text>
          <Text style={{ fontWeight:"800", color: colorScheme == 'dark' ? '#666' : '#fff', marginTop: 8 }}>{item?.whatsapp_no}</Text>
      </View>
      </TouchableOpacity>
    );
  }
  return (
    <>
    <Stack.Screen options={{ headerShown:true, title: 'JOBs' ,headerTitleAlign: 'center'}} />
      <SafeAreaView style={{flex:1}}>
      <FlatList
      ref={getPageRef}
      data={data}
      contentContainerStyle={{ flexGrow: 1 }}
      renderItem={_renderItem}
      onMomentumScrollEnd={_scrollEnd}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={fetchData}
      onEndReachedThreshold={0.3}
      ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        />
    </SafeAreaView>
  </>
  );
}