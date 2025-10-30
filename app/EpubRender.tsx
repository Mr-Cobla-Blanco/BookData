// WebViewEpubWithWordTracking.tsx
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, use, useRef, useCallback } from 'react';
import {Dimensions, StatusBar, ActivityIndicator, Text, Alert} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import ePub from 'epubjs';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { ColorScheme } from "./_layout"

const { width, height } = Dimensions.get('window');
const CHUNK_SIZE = 1024 * 1024 ; // 1MB chunks for processing

const WebViewEpub = ({ selectedFile, lastPage, FileChanger }: { selectedFile?: string; lastPage?: any; FileChanger: any }) => {

  const [HtmlContent, setHtmlContent] = useState("")
  const [loading , setLoading] = useState(true);
  let StarBytePos = 0;

  const [webViewKey, setWebViewKey] = useState(0);
  const navigation = useNavigation()



  /*
  const ExtracBook = async() => {

  
    console.log("01.")
    //O real responsavel por transforma o URI em um arquivo string
    const arrayBuffer = await fetch(selectedFile!).then(r => r.arrayBuffer())
    console.log("02.")

    try {

    var book = Epub(arrayBuffer)

    await book.ready//.then(() => {console.log("Tha baby")})

    //var bookMetaData = await book.loaded.metadata //.then((metadata) => {console.log("Metadata "+metadata)}).catch(error => {console.log("Metadata failed", error)})

  //the bitch
          const spine = await book.loaded.spine
        
        console.log("=== BOOK STRUCTURE ===")
        console.log("Total sections:", spine.length)

   // var bookSpine = await book.loaded.spine//.then((spine) => {"Spine of the word: "+console.log(spine)})
      
    //console.log(bookSpine)

   
    //var bookPage =  book.loaded.pageList.then((pageList) => {"Page List: "+console.log(pageList)})

   //console.log("Full spine object: "+ JSON.stringify(bookMetaData, null, 2))
   console.log("04.")



  } catch (error) {
    console.log("oooops "+ error)
  }

    /*
      const bookInstance = ePub(selectedFile as never)
      console.log("Relax!")
     
      //await bookInstance.ready
      
      const spine = bookInstance.spine
      const ChapTobeRead = spine.get(0)
    
      //console.log(totalChapter)
      const content = await ChapTobeRead.load(bookInstance.load.bind(bookInstance))

      const chapterHtml = content.documentElement.outerHTML;

      const ChapterBase64 = btoa(unescape(encodeURIComponent(chapterHtml)))

      setBase64Epub(ChapterBase64)
  }*/
  
   //Tudo q ele faz e pegar o arquivo de HTML e o Arquivo de texto e junta em um só
   const HtmlLoader = async() => {

     //console.log de teste
     //console.log("SelectedFIle = "+ selectedFile)

     //Evita erros
     if (!selectedFile){
       setHtmlContent("")
       setLoading(false)
       return
     }
     
     setLoading(true) // Start loading
     
     try {

      const fileInfo = await FileSystem.getInfoAsync(selectedFile) ;
      //console.log(fileInfo)
      if (fileInfo.exists){
      const fileSize = fileInfo.size

      if (fileSize > (1024 * 1024* 5)){
      //alert("File to big to be loaded"+" Limit: 5MB")
      setHtmlContent("")

      await new Promise((resolve) => {
            Alert.alert(
        "The file is to big",  // Título
        "Track Reader has limit of 5MB. Do you wish to continue anyways?",  // Mensagem
        [
          {
            text: "Cancelar",
            onPress: () => {navigation.navigate("Shelf" as never),resolve(false),selectedFile=""},
            style: "cancel"
          },
          {
            text: "Continue",
            onPress: () => resolve(true)
          }
        ]
      );

        })


      }
      }


      /*
       const chunks: string[] = [];
       const totalChunks = 10//Math.ceil( / CHUNK_S0E);
       const encoder = new TextEncoder*/


       //torna o URI em string de Base64
       const Base64DevTest = await FileSystem.readAsStringAsync(selectedFile, { 
          encoding: FileSystem.EncodingType.Base64, 
          position: StarBytePos, 
          //length: (CHUNK_SIZE)
         })

       // Load the HTML file e Base64
       const [asset] = await Asset.loadAsync(require('../assets/Renderer.html'))
       const htmlBrute = await FileSystem.readAsStringAsync(asset.localUri || asset.uri || '')
      
       if (lastPage == 1) {lastPage = ""}else
        {
        //try{lastPage = JSON.parse(lastPage)}catch (error) {console.log("Erro no lastpage.parse"+error+" lastpage:"+lastPage);lastPage = JSON.stringify(lastPage)}
        //console.log("LastpageCfi:" + lastPage)
        }
        //lastPage = ""
      


      //comeca, pegando o valor da lista no armazenamento local como string
      const UserConfig_str = await AsyncStorage.getItem("UserConfig")
      //console.log("FontSize_local:" + UserConfig_str)
      //transforma o dados locais de string para lista
      const UserConfig_util =  UserConfig_str ? JSON.parse(UserConfig_str) : []

       let FontSize_local = JSON.stringify(UserConfig_util[0].FontSize)
       //console.log("FontSize_local:" + FontSize_local)
       FontSize_local += "%"
      

       //inject data to HTML
       let injectedHtml = htmlBrute.replace("{{BASE64_DATA}}", Base64DevTest || '')
       injectedHtml = injectedHtml.replace("{{PAGE_WEBVIEW}}", lastPage || "" )
       injectedHtml = injectedHtml.replace("{{USER_FONTSIZE}}", (FontSize_local) || "100%")
       
       //console.log("Injected HTML Type "+ typeof(injectedHtml))

       setHtmlContent(injectedHtml);


     } catch (e) {
       console.log("Error loading book:",e)
       setHtmlContent("")
     } 

   }

   const MessageDealer = (WebViewMessage: string) => {
        
    if(WebViewMessage == "Page-Next"){
      //console.log("Next-page working"); 
      return
    }
  

    if (WebViewMessage == "Page-Prev") {
      //console.log("Prev-Page Working"); 
      return
    }

    if (WebViewMessage.startsWith("pageWordCount:")){ //esse aqui ta sendo chamado indevidamente?
      const Num_WordsCounted = JSON.parse(WebViewMessage.replace("pageWordCount:",""))
      //console.log("Recebemos mensagem "+Num_WordsCounted + " Type:" + typeof(Num_WordsCounted))
      FileChanger("",Num_WordsCounted)
      return
    }

    //Essa é a parte que recebe informaçao da localizaçao do Epub
    if (WebViewMessage.startsWith("location:")) {
      const RealLocation = WebViewMessage.replace("location:","")
      //a partir desse ponto nos temos a localização do livro
      FileChanger(RealLocation,"")
      //console.log("FIle changer called")
      return
    }

    //Responsavel por desativar a tela de loading
    if (WebViewMessage.startsWith("Hide loadingScreen")){
      setLoading(false);
      return
    }

    console.log(WebViewMessage)
   }
   //const handleLoadMessage
/*
useEffect( () => {
    
    HtmlLoader()

}, [selectedFile]);*/


useFocusEffect(
  React.useCallback(() => {

    HtmlLoader()
    // Reset WebView when screen comes into focus
  }, [selectedFile])
);

/*
useEffect( () => {
    
    HtmlLoader()

}, [selectedFile]);*/


  // Show error if no content
  if (!HtmlContent) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: ColorScheme.background}}>
        <Text style={{color: ColorScheme.text, fontSize: 32}}>No book selected</Text>
      </View>
    )
  }

  
  return (
    <View style={{flex: 1}}>

      <WebView
        
        style={{flex: 1}}
        source={{ html: HtmlContent }}
        onMessage={(event) => { MessageDealer(event.nativeEvent.data)}}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        // Performance optimizations
        startInLoadingState={false}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />

    {loading && ( 
      <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: ColorScheme.background
      }}>
        <ActivityIndicator size="large" color={ColorScheme.text} />
        <Text style={{color: ColorScheme.text, marginTop: 10, fontSize: 28}}>Loading book...</Text>
      </View>
      )}


    </View>
  )

};



export default WebViewEpub
