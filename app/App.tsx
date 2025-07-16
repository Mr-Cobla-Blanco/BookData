
import "react-native-gesture-handler"
import {registerRootComponent} from 'expo'
import React, { useContext,useState } from 'react';
import { Button, StyleSheet, Text, View,ScrollView } from 'react-native';
import * as DocumentPicker from "expo-document-picker"
import Pdf from 'react-native-pdf';

//import LibraryScreen from "./library"
//import RenderScreen from "./Render"
import { GestureHandlerRootView } from "react-native-gesture-handler";

 /*
const CatalogScreen = () => (
  <View style={styles.layout}>
    <Text style={styles.title}>Catalog</Text>
  </View>
);*/

//const Stack = createStackNavigator();

/*
export const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Feed" component={FeedScreen} />
    <Stack.Screen name="Render" component={RenderScreen}/>
    <Stack.Screen name="Library" component={LibraryScreen} />
  </Stack.Navigator>
);
*/

import FeedScreen from "./Feed";

const App = () => {

  //const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  //const value = { selectedPdf, setSelectedPdf };

  return (FeedScreen)

   
    /*
    <PdfContext.Provider value={value}>
      <NavigationContainer>
        <AppNavigator  />
      </NavigationContainer>s
    </PdfContext.Provider>
  */

};

export default App;

