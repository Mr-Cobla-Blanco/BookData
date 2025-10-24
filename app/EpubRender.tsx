// WebViewEpubWithWordTracking.tsx

import React, { useState, useEffect, use, useRef } from 'react';
import {Dimensions, StatusBar, ActivityIndicator, Text, Alert} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import ePub from 'epubjs';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const CHUNK_SIZE = 1024 * 1024 ; // 1MB chunks for processing

/*Old HTML
const HTMLstrign = (Chapter: string ,lastPage:number) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      padding: 20px; 
      font-family: Georgia, serif;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  ${atob(Chapter)} <!-- Decode the base64 chapter HTML -->
</body>
</html>`

const HTMLsimplify = (base64: string | undefined ) => `
<!DOCTYPE html>
<html>

<head>

  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <script src="https://unpkg.com/epubjs/dist/epub.min.js"></script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
  margin:0;
  padding:0;
  width: 100%;
  height: 100%;
  }

  #bookArea {
    width: 100%;
    height: 100%;
    top: 0;
    left:0; 
    padding-bottom: 5%;
    padding-top: 7% 
  }
  
      #nav-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      pointer-events: none;
    }
    .nav-zone {
      flex: 1;
      pointer-events: all;
      cursor: pointer;
    }

</style>

</head>

<body>

    <div id="bookArea"></div>
  <div id="nav-overlay">
    <div class="nav-zone" id="prev-zone"></div>
    <div class="nav-zone" id="next-zone"></div>
  </div>


  <script>

  if ("${base64}") {
        var byteCharacters = atob("${base64}");
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {type: "application/epub+zip"});
        var book = ePub(blob);
        var rendition = book.renderTo("bookArea", {width: "100%", height: "100%", spread: "none"});
        rendition.display();
    } 

    
    const WordCounter = () => {
    
      //rendition.getContents
      //rendition.requireView
    } 
    
    

    document.getElementById('next-zone').addEventListener('click', function() {
          rendition.next()
          
    })

    document.getElementById('prev-zone').addEventListener('click', function() {
          rendition.prev()
        
    })


  </script>

</body>
</html>
`*/


const WebViewEpub = ({ selectedFile, lastPage, FileChanger }: { selectedFile?: string; lastPage?: string; FileChanger: any }) => {

  const [HtmlContent, setHtmlContent] = useState("")
  const [loading , setLoading] = useState(true);
  let StarBytePos = 0;
  //lastPage = "epubcfi(/6/4!/4/2[pg-header]/2[pg-header-heading]/1:0)"


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
     console.log("SelectedFIle = "+ selectedFile)

     //Evita erros
     if (!selectedFile){
       setHtmlContent("")
       setLoading(false)
       return
     }
     
     setLoading(true) // Start loading
     
     try {

      const fileInfo = await FileSystem.getInfoAsync(selectedFile) ;
      console.log(fileInfo)
      //const fileSize = fileInfo.size || 0
       const chunks: string[] = [];
       const totalChunks = 10//Math.ceil( / CHUNK_S0E);
       const encoder = new TextEncoder


       //torna o URI em string de Base64
       const Base64DevTest = await FileSystem.readAsStringAsync(selectedFile, { 
          encoding: FileSystem.EncodingType.Base64, 
          position: StarBytePos, 
          //length: (CHUNK_SIZE)
         })

      if (Base64DevTest.length > (1024 * 1024* 6)){
      console.log("File to big to be loaded")
      return 
    }

       // Load the HTML file e Base64
       const [asset] = await Asset.loadAsync(require('../assets/Renderer.html'))
       const htmlBrute = await FileSystem.readAsStringAsync(asset.localUri || asset.uri || '')

       if (lastPage == 1 as never) {lastPage = ""}else{lastPage = JSON.parse(lastPage!)}
       //console.log("LastPage inside EPubRender is= "+lastPage+' '+typeof(lastPage))


      //comeca, pegando o valor da lista no armazenamento local como string
      const UserData_str = await AsyncStorage.getItem("UserData")

      //transforma o dados locais de string para lista
      const UserData_util =  UserData_str ? JSON.parse(UserData_str) : []
        
       let FontSize_local = JSON.stringify(UserData_util[0].FontSize)
       FontSize_local += "%"
      

       //inject data to HTML
       let injectedHtml = htmlBrute.replace("{{BASE64_DATA}}", Base64DevTest || '')
       injectedHtml = injectedHtml.replace("{{PAGE_WEBVIEW}}", lastPage || "" )
       injectedHtml = injectedHtml.replace("{{USER_FONTSIZE}}", (FontSize_local) || "100%")

       setHtmlContent(injectedHtml);
     } catch (error) {
       console.error("Error loading book:", error)
       setHtmlContent("")
     } finally {
       setLoading(false) // Always stop loading
     }
   }

   const MessageDealer = (WebViewMessage: string) => {


    if(WebViewMessage == "Page-Next"){
      console.log("Next-page working"); 
      return
    }
    
    if (WebViewMessage == "Page-Prev") {
      console.log("Prev-Page Working"); 
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

    if (WebViewMessage.startsWith("pageWordCount:")){
      const Num_WordsCounted = JSON.parse(WebViewMessage.replace("pageWordCount:",""))
      //console.log("Recebemos mensagem "+Num_WordsCounted + " Type:" + typeof(Num_WordsCounted))
      FileChanger("",Num_WordsCounted)
      return
    }


    console.log(WebViewMessage)
   }
   //const handleLoadMessage

useEffect( () => {
    
    HtmlLoader()

}, [selectedFile]);


  // Show loading indicator while processing
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2F'}}>
        <ActivityIndicator size="large" color="#bababa" />
        <Text style={{color: '#bababa', marginTop: 10, fontSize: 16}}>Loading book...</Text>
      </View>
    )
  }

  // Show error if no content
  if (!HtmlContent) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2F'}}>
        <Text style={{color: '#bababa', fontSize: 16}}>No book selected</Text>
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
    </View>
  )

};



export default WebViewEpub
