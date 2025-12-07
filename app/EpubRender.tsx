// WebViewEpubWithWordTracking.tsx
import { useNavigation, } from "@react-navigation/native";
import React, { useState,} from 'react';
import {Dimensions, ActivityIndicator, Text, Alert} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { View } from 'react-native';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { ColorScheme } from "./_layout"
import { useKeepAwake } from 'expo-keep-awake';

const { width, height } = Dimensions.get('window');
const CHUNK_SIZE = 1024 * 1024 ; // 1MB chunks for processing

const WebViewEpub = ({ selectedFile, lastPage, FileChanger }: { selectedFile?: string; lastPage?: any; FileChanger: any }) => {

  const [HtmlContent, setHtmlContent] = useState("")
  const [loading , setLoading] = useState(false);
  //const webViewRef = useRef(null)
  let StarBytePos = 0;

  const [webViewKey, setWebViewKey] = useState(0);
  const navigation = useNavigation()

  useKeepAwake()//Mantem a tela ligada para uma leitura mais confortavel
  
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


      //Isso verifica se o livro não passa do tamanho de 5MB na primeira vez que abre
      if (fileSize > (1024 * 1024* 5) && lastPage == 1){
      //alert("File to big to be loaded"+" Limit: 5MB")
      setHtmlContent("")

      await new Promise((resolve) => {
            Alert.alert(
        "The file is too big",  // Título
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
       const [asset] = await Asset.loadAsync(require('../assets/EpubRenderer.html'))
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

       let FontSize_local = JSON.stringify(UserConfig_util[0].FontSize)//Eu ja tentei tira o [0], não tente denovo
       //console.log("FontSize_local:" + FontSize_local)
       FontSize_local += "%"

       let FontType_local = JSON.stringify(UserConfig_util[0].TextFont) //Sim vc precisa do [0], e não eu nao sei pq entao deixa isso quieto

       //inject data to HTML
       let injectedHtml = htmlBrute.replace("{{BASE64_DATA}}", Base64DevTest || '')
       injectedHtml = injectedHtml.replace("{{PAGE_WEBVIEW}}", lastPage || "" )
       injectedHtml = injectedHtml.replace("{{USER_FONTSIZE}}", (FontSize_local) || "100%")
       injectedHtml = injectedHtml.replace(("{{USER_FONTTYPE}}"), "Time New Roman") //(FontType_local) || isso precisa ser resolvido
       
       //console.log("Injected HTML Type "+ typeof(injectedHtml))

       setHtmlContent(injectedHtml);


     } catch (e) {
       console.log("Error loading book:",e)
       setHtmlContent("")
     } 

   }

   const MessageDealer = async (WebViewMessage: string) => {
        
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

    if (WebViewMessage.startsWith(`Chapter progress:`)){
      //console.log('FILECHANGER: '+ WebViewMessage)
      const ChapterProgres_str = WebViewMessage.replace("Chapter progress:","").replace("[","").replace("]","")
      const [CurrentPage_local, TotalChap_local] = ChapterProgres_str.split(',');
      
      const ChapProgress_obj = {TotalChapterPage: Number(TotalChap_local), CurrentPage: Number(CurrentPage_local)} //[Number(TotalChap_local),Number(CurrentPage_local)]
      
      FileChanger("","","",ChapProgress_obj)

      return
    }

    //Responsavel por desativar a tela de loading
    if (WebViewMessage.startsWith("Hide loadingScreen")){
      setLoading(false);
      console.log("Loading ="+loading)
      return
    }

    if (WebViewMessage.startsWith("HrefCover:")){
      const RealHrefCover = WebViewMessage.replace("HrefCover:","")

      FileChanger("","",RealHrefCover)
      return
    }

    console.log(WebViewMessage)
   }

useFocusEffect(
  React.useCallback(() => {

    HtmlLoader()

    // Reset WebView when screen comes into focus
  }, [selectedFile])
);

/*
useEffect( () => {
    return () => {

      if (webViewRef.current) {
        webViewRef.current.stopLoading()
      }
    }
}, []);*/


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
