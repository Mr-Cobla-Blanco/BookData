import { useNavigation } from "expo-router";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import Pdf from "react-native-pdf";
import  PdfContext  from "./Pdfcontext";
import * as DocumentPicker from 'expo-document-picker';
import Drawer from "expo-router/drawer";
import { DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SaveBooks } from "./index"
import { Books_list_model } from "./_layout";

const UploaderScreen = () => {
  
  //declara a navegacao
  const navigation = useNavigation();
 
  //funcao para especificamente usar o URI para armazenar a informacao do arquivo localmente
  const addNewBook = (bookUri: string , bookName: String) => {

    if (typeof bookUri === "string") {
      
      //esse e o objeto generico que cada livro da lista segue
      const objBook: Books_list_model = {
        uri: bookUri,
        name: bookName,
        lastPage: 1,
        finishedReading: false,
      }
     //transforma o obj em uma string para ser armazenada
     const ObjBook_str = JSON.stringify(objBook) 
     //funcao que lida com armazenar propriamente o obj em uma lista de objetos
     SaveBooks(ObjBook_str); //essa funçao esta definida em Index.tsx

    }

  }

  //funcao para escolher o PDF,e depois chama outras funçoes para armazenar a localizaçao desse pdf
    async function pickDoc() {

    //pede para o usuario escolher um arquivo que sera armazenado em result
     let result = await DocumentPicker.getDocumentAsync({
    //defini o tipo de arquivo que pode ser escolhido
     type: 'application/pdf',
     copyToCacheDirectory: true})

     //se o resultado for valido (valido = nao ser resultado de um cancelamento e o arquivo escolhido tem alguma funcao) chama a funçao para armazenar localmente
     if (!result.canceled && result.assets && result.assets.length > 0) {
      //chama a função addNewBook para armazenar propriamente o arquivo escolhido
       addNewBook(result.assets[0].uri,result.assets[0].name)
     }

    }

  //renderizacao basica da tela
  return (
    <View style={styles.layout}>

      <Button
        title='+Adicionar um novo livro'
        onPress={pickDoc}
      />

    </View>
  );

};

export default UploaderScreen;


const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },

});
