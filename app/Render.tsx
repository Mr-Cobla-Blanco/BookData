import React, { useContext } from "react";
import Pdf from 'react-native-pdf';
import {Text, StyleSheet, View, Button} from "react-native"
import PdfContext from "./Pdfcontext";

const RenderScreen = () => {

 const {selectedPdf} = useContext(PdfContext)

 return (
    <View
    style={{flex: 1}}>

        <Text>O futuro e pica</Text>

        {selectedPdf && ( 
        <Pdf
         source={{ uri: selectedPdf, cache:true}}

         showsVerticalScrollIndicator = {true}
         page={100}
         spacing={5}

         onLoadComplete={(numberOfPages,filePath) => {
          console.log('Number of pages: ${numberOfPages}')
         }}

         onPageChanged={(page,numberOfPages) => {
          console.log("Current page: ${page}")
         }}

         onError={(error) => console.log(error)}
         onPressLink={(uri) => console.log("link pressed: ${uri}")}

         style ={{
          flex: 1,
          width: "100%",
          height: 600
         }}

        />
      )}

    </View>
  )
};

export default RenderScreen;