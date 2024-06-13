import React, { useState, useEffect } from 'react';
import { View, Text,Image, Button, StyleSheet, ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Stack, useGlobalSearchParams, useLocalSearchParams} from 'expo-router';
import { useJobContext } from '@/hooks/useJobContext';
import { useFocusEffect,usePathname } from 'expo-router';


const Job = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const jobParams:any=useLocalSearchParams();
  const gg=useGlobalSearchParams();
  // const {jobDetails} = useJobContext();
  // console.log(gg)
  const path=usePathname();
  const id=path.split("/")[2];
  const fetchBookmarkStatus = async () => {
    try {
      const jobDetailsString:any = await AsyncStorage.getItem(`job_${id}`);
      console.log(jobParams.id,jobDetailsString,"<======jobDetailsString")
      const item:any = JSON.parse(jobDetailsString);
      if(item){
        console.log(item,"<======item")
        setJobDetails(item)
      }else{
        setJobDetails(jobParams)
      }
      setIsBookmarked(item?.is_bookmarked || false);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookmarkStatus();
    }, [])
  );

  const handleBookmarkToggle = async () => {
    try {
      jobDetails.is_bookmarked = !isBookmarked;
      await AsyncStorage.setItem(`job_${jobDetails.id}`, JSON.stringify(jobDetails));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error(error);
    }
  };

  if(!jobDetails) return <Text style={{color:"fff"}}>NOT DATA FOUND</Text>;

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#fff" }}>
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown:true, title: jobDetails.company_name }} />
      <View style={{flexDirection:"row" ,alignItems:"center",justifyContent:"center"}}>
        <Image
          source={{ uri: jobDetails?.logo }}
          alt='image'
          style={{ width: 130, height: 120, borderRadius: 75, marginRight: 20 }}
        />
      </View>
      <Text style={styles.title}>{jobDetails.company_name}</Text>
      <Text style={styles.company}><Text style={styles.boldText}>Description:</Text> {jobDetails.title}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>Place:</Text> {jobDetails?.Place}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>Salary:</Text> {jobDetails?.Salary}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>Job Type:</Text> {jobDetails?.Job_Type}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>Experience:</Text> {jobDetails?.Experience}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>Qualification:</Text> {jobDetails?.Qualification}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>Role:</Text> {jobDetails.job_role}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>Contact:</Text> {jobDetails.whatsapp_no}</Text>
      <Text style={styles.detail}><Text style={styles.boldText}>No of Applicants:</Text> {jobDetails.num_applications}</Text>
      <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmarkToggle}>
        <Text style={styles.bookmarkText}>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 70
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  company: {
    fontSize: 18,
    marginBottom: 8
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  bookmarkButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#0E56A8',
    alignItems: 'center',
    borderRadius: 5
  },
  bookmarkText: {
    color: '#fff',
    fontSize: 16
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18
},
});

export default Job;
