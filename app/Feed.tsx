import { useNavigation } from "expo-router";
import { useContext, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import Pdf from "react-native-pdf";
import  PdfContext  from "./Pdfcontext";
import * as DocumentPicker from 'expo-document-picker';
import Drawer from "expo-router/drawer";
import { DrawerActions } from "@react-navigation/native";


const FeedScreen = () => {
  
  const navigation = useNavigation();
  const [selectedPdf , setSelectedPdf] = useState<string | null>(null) //useContext(PdfContext)


    async function pickDoc(){

     let result = await DocumentPicker.getDocumentAsync({
     type: 'application/pdf',
     copyToCacheDirectory: true})
 
     console.log(result)

     if (!result.canceled && result.assets && result.assets.length > 0) {
       setSelectedPdf(result.assets[0].uri)
     }

     console.log(selectedPdf)
    }


  return (
    <View style={styles.layout}>

      <Text style={styles.title}>Feed</Text>
      <Button
        title="Go to catalog" 
        onPress={() => navigation.navigate("Render" as never)}
      />

      <Button
        title='Escolher Pdf'
        onPress={pickDoc}
      />

      {selectedPdf && (
        <>
            <Pdf
              source={{ uri: selectedPdf, cache:true}}
              singlePage = {true}

              style ={{
                flex: 1,
                width: "80%",
                height: 10,
                justifyContent: "center",
                alignItems:"center"
              }}
            />

        </>
      )}

    </View>
  );
};

export default FeedScreen;


const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
});