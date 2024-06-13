import { Redirect } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  return ( <Redirect href={"/(tabs)/Jobs"} /> )
}
