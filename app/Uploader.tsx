import { View, Button, StyleSheet, Text, Dimensions } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router, useNavigation } from "expo-router";
import { SaveBooks } from "./index"
import { Books_list_model } from "./_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

// Responsive sizing utilities based on screen dimensions
// Base screen dimensions: 900x1900 (increased from 720x1520)
const BASE_WIDTH = 900;
const BASE_HEIGHT = 1900;

const getResponsiveSize = (size: number, type: 'width' | 'height' = 'width') => {
  const baseSize = type === 'width' ? BASE_WIDTH : BASE_HEIGHT;
  const currentSize = type === 'width' ? width : height;
  return (size * currentSize) / baseSize;
};

const getResponsiveFontSize = (fontSize: number) => {
  return getResponsiveSize(fontSize, 'width');
};

const getResponsivePadding = (padding: number) => {
  return getResponsiveSize(padding, 'width');
};

const getResponsiveMargin = (margin: number) => {
  return getResponsiveSize(margin, 'width');
};

const UploaderScreen = () => {
  
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

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: getResponsiveMargin(6)
  },
  title: {
    fontSize: getResponsiveFontSize(32),
    marginBottom: getResponsiveMargin(16),
  },

});

  const getFileType = (filename: string) => {
  if (filename.endsWith('pdf')) return 'pdf';
  if (filename.endsWith('epub+zip') || filename.endsWith("epub")) return 'epub';
  //if (filename.endsWith('mobi')) return 'mobi';
  //if (filename.endsWith('fb2')) return 'fb2';
  return 'unknown';
};

  //funcao para especificamente usar o URI para armazenar a informacao do arquivo localmente
  const addNewBook = async(bookUri: string , bookName: String, formato: string) => {

    if (typeof bookUri === "string") {
      

      //esse e o objeto generico que cada livro da lista segue
      const objBook: Books_list_model = {
        uri: bookUri,
        name: bookName,
        lastPage: 1,
        N_PagesRead: 0,
        finishedReading: false,
        type: getFileType(formato) ,//placeholder
        HrefCover: "",
        ChapterProgress: {TotalChapterPage: 1, CurrentPage: 0}
      }

     //transforma o obj em uma string para ser armazenada
     const ObjBook_str = JSON.stringify(objBook) 
     //funcao que lida com armazenar propriamente o obj em uma lista de objetos
     SaveBooks(ObjBook_str); //essa funçao esta definida em Index.tsx

//Parte que abre o livro--------------------------------------------------
      //console.log("TEst 01")
      await AsyncStorage.setItem('SelectedBook',ObjBook_str)
      
      router.push('/Render')
      //navigation.navigate("Render" as never)

     //A partir daqui vamo tenta já abrir o livro (Para ja renderizar a capa)


    }

  }

  //funcao para escolher o PDF,e depois chama outras funçoes para armazenar a localizaçao desse pdf
   export async function pickDoc() {

    console.log("PickDoc is activated")

    //pede para o usuario escolher um arquivo que sera armazenado em result
     let result = await DocumentPicker.getDocumentAsync({
    //defini o tipo de arquivo que pode ser escolhido
     type: [
      //'application/pdf',
      'application/epub+zip',
      //'application/x-mobipocket-ebook',
      //text/plain'
     ],
     copyToCacheDirectory: true
    })

    console.log("Resultado do picker "+ JSON.stringify(result))

     //se o resultado for valido (valido = nao ser resultado de um cancelamento e o arquivo escolhido tem alguma funcao) chama a funçao para armazenar localmente
     if (!result.canceled && result.assets && result.assets.length > 0) {

      //função para salvar o URI fora do cache
      const fileName = result.assets[0].name;
      const destUri = `${FileSystem.documentDirectory}${fileName}`

      
      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: destUri
      })
      


      //chama a função addNewBook para armazenar propriamente o arquivo escolhido
       addNewBook(destUri,result.assets[0].name,result.assets[0].mimeType as never)
     }

    }

export default UploaderScreen
//export {pickDoc}
export {addNewBook}
