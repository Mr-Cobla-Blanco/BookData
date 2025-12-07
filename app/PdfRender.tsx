// WebViewEpubWithWordTracking.tsx
import { useNavigation, } from "@react-navigation/native";
import React, { useRef, useState,} from 'react';
import {Dimensions, ActivityIndicator, Text, Alert} from 'react-native';
import { View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ColorScheme } from "./_layout"
import { useKeepAwake } from 'expo-keep-awake';
import * as FileSystem from 'expo-file-system';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import WebView from "react-native-webview";
import { Asset } from "expo-asset";

const { width, height } = Dimensions.get('window');

// Responsive sizing utilities based on screen dimensions
// Base screen dimensions: 900x1900 (increased from 720x1520) 540x960
const BASE_WIDTH = 540;
const BASE_HEIGHT = 960;

const getResponsiveSize = (size: number, type: 'width' | 'height' = 'width') => {
  const baseSize = type === 'width' ? BASE_WIDTH : BASE_HEIGHT;
  const currentSize = type === 'width' ? width : height;
  return (size * currentSize) / baseSize;
};

const WebViewPdf = ({ selectedFile, lastPage, FileChanger }: { selectedFile?: string; lastPage?: any; FileChanger: any }) => {

const [HtmlContent, setHtmlContent] = useState("")
const [loading, setLoading] = useState(true)

useKeepAwake()//Mantem a tela ligada para uma leitura mais confortavel
console.log("Console log inicial")

    const HtmlLoaderPDF = async () => {
 
     //Evita erros
     if (!selectedFile){
       setHtmlContent("")
       setLoading(false)
       return
     }
     
     setLoading(true) // Start loading
     
     try {

      //const fileInfo = await FileSystem.getInfoAsync(selectedFile) ;
       
       //torna o URI em string de Base64
       const Base64DevTest = await FileSystem.readAsStringAsync(selectedFile, { 
          encoding: FileSystem.EncodingType.Base64, 
          //length: (CHUNK_SIZE)
         })

       // Load the HTML file e Base64
       const [asset] = await Asset.loadAsync(require('../assets/PdfRenderer.html'))
       const htmlBrute = await FileSystem.readAsStringAsync(asset.localUri || asset.uri || '')
      
       //if (lastPage == 1) {lastPage = ""}else
        //try{lastPage = JSON.parse(lastPage)}catch (error) {console.log("Erro no lastpage.parse"+error+" lastpage:"+lastPage);lastPage = JSON.stringify(lastPage)}
        //console.log("LastpageCfi:" + lastPage)
        //}
        //lastPage = ""
      
      //comeca, pegando o valor da lista no armazenamento local como string
      //const UserConfig_str = await AsyncStorage.getItem("UserConfig")

      //console.log("FontSize_local:" + UserConfig_str)
      //transforma o dados locais de string para lista
      //const UserConfig_util =  UserConfig_str ? JSON.parse(UserConfig_str) : []

       //let FontSize_local = JSON.stringify(UserConfig_util[0].FontSize)//Eu ja tentei tira o [0], não tente denovo
       //console.log("FontSize_local:" + FontSize_local)
       //FontSize_local += "%"

       //let FontType_local = JSON.stringify(UserConfig_util[0].TextFont) //Sim vc precisa do [0], e não eu nao sei pq entao deixa isso quieto

       //inject data to HTML
       let injectedHtml = htmlBrute.replace("{{BASE64_DATA}}", Base64DevTest || '')
       injectedHtml = injectedHtml.replace("{{PAGE_WEBVIEW}}", lastPage.toString() || "" )
       //injectedHtml = injectedHtml.replace("{{USER_FONTSIZE}}", (FontSize_local) || "100%")
       //injectedHtml = injectedHtml.replace(("{{USER_FONTTYPE}}"), "Time New Roman") //(FontType_local) || isso precisa ser resolvido
       console.log("Tudo certo no HTML ")

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
      //setLoading(false);
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

    HtmlLoaderPDF()

    // Reset WebView when screen comes into focus
  }, [selectedFile])
);


return(
    <View style={{flex:1}}>

     <WebView
     style={{flex:1}}
     source={{ html: HtmlContent}}
     onMessage={(event) => {MessageDealer(event.nativeEvent.data)}}
     javaScriptEnabled
     domStorageEnabled
    showsHorizontalScrollIndicator={false}
     />

    
        {/*loading && ( 
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
          )*/}

    </View>
)

}

export default WebViewPdf

/*
const { width, height } = Dimensions.get('window');
const CHUNK_SIZE = 1024 * 1024 ; // 1MB chunks for processing

// Responsive sizing utilities based on screen dimensions
// Base screen dimensions: 900x1900 (increased from 720x1520) 540x960
const BASE_WIDTH = 540;
const BASE_HEIGHT = 960;

const getResponsiveSize = (size: number, type: 'width' | 'height' = 'width') => {
  const baseSize = type === 'width' ? BASE_WIDTH : BASE_HEIGHT;
  const currentSize = type === 'width' ? width : height;
  return (size * currentSize) / baseSize;
};

const PDFrender = ({ selectedFile, lastPage, FileChanger }: { selectedFile?: string; lastPage?: any; FileChanger: any }) => {

  const [loading , setLoading] = useState(true);

  const WordCount_local = useRef(0)
  //const navigation = useNavigation()

  

  useKeepAwake()//Mantem a tela ligada para uma leitura mais confortavel

  const PDF_WordCounter= async (pageNumber: number) => {
    

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
      return
    }

    if (WebViewMessage.startsWith("HrefCover:")){
      const RealHrefCover = WebViewMessage.replace("HrefCover:","")
      FileChanger("","",RealHrefCover)
      return
    }

    console.log(WebViewMessage)
   }
   //const handleLoadMessage

useFocusEffect(
  React.useCallback(() => {

    

    // Reset WebView when screen comes into focus
  }, [selectedFile])
);

  
  return (
    <View style={{flex: 1}}>

    return (        //se selectedFile n for nulo ele vai rederizar o pdf
            <View style={{ flex: 1 }}>

            {selectedFile && ( 
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Pdf
                  //diz qual arquivo deve ser renderizado
                  source={{ uri: selectedFile, cache:true}}

                  onLoadComplete={(numberOfPages, filePath) => {/*totalPages.current = numberOfPages
                    setLoading(false) 
                    PDF_WordCounter(lastPage)  
                    }}

                  showsVerticalScrollIndicator = {true}
                  //essa linha abaixo define que o arquivo deve abrir na pagina dita pela variavel lastPage_local
                  page={lastPage}
                  //spacing={5}       
                  enablePaging={false}
                  enableRTL={false}
                  enableAnnotationRendering={true}

                  //essa funcao vai ser acionada toda vez que mudar de pagina no arquivo
                  onPageChanged={ (page) => { 
                    //isso e usado para salvar a pagina que parou 
                    MessageDealer("location:"+page)
                    lastPage = page

                    MessageDealer("WordCount:" + WordCount_local.current);
                    PDF_WordCounter(page)

                    //vou ter que colocar o word count para contagem de paginas com tempo
                  }}

                  onError={(error) => console.log(error)}
                  //a linha abaixo disse o que deve acontecer quando o usuario apertar um link dentro do pdf
                  //onPressLink={(uri) => console.log("link pressed: ${uri}")}

                  style ={{
                    flex: 1,
                    width: "100%",
                    height: getResponsiveSize(600, 'height')
                  }}
                  />
                </View>
            </GestureHandlerRootView>

              )}

              {/* Hidden text extractor}
              <PDFTextExtractor
              pdfUri={selectedFile}
              onTextExtracted={}
              />

            </View>
            )

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



export default PDFrender
*/