import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Pdf from 'react-native-pdf';
import {Text, StyleSheet, View, Button, AppState, AppStateStatus, TouchableOpacity, Dimensions} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import { ScreenProps, useFocusEffect, useGlobalSearchParams, useNavigation } from "expo-router";
import { Books_list_model } from "./_layout";
import { GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import WebViewEpub from "./EpubRender";

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
}

const getResponsivePadding = (padding: number) => {
  return getResponsiveSize(padding, 'width');
};

const getResponsiveMargin = (margin: number) => {
  return getResponsiveSize(margin, 'width');
};


//TO-DO: dever haver uma maneira de guarda e paga dados como a ultima pagina


//responsavel por renderizar o PDF para a leitura
const RenderScreen = () => {

  //const [wordCount, setWordCount] = useState(0);
  const [ allowRender, setallowRender] = useState(true)
  //variavel que armazena o URI do pdf ou diz que pdf deve ser usados
  const [selectedFile , setselectedFile] = useState<string | undefined>()
  const [Filetype , setFiletype] = useState()

  //variavel que salva o numero da pagina que o usuario estava antes de fechar o livro
  const lastPage_local = useRef(1)

  const appState = useRef(AppState.currentState)
  //const [appStateVisible,setAppStateVisible] = useState(appState.current)
  
  //const navigation = useNavigation();

  let TimerReading = 0  

  let TimerPageChecker = useRef(0)
  
  //const [TimerPageChecker, setTimerPageChecker] = useState<number>(0)
  let PagesRead_local = useRef(0)

  let totalPages = useRef(0)

  

  //funcao para coletar chamar alguns dados do usuario como tempo lido e contador de paginas
  const getUserData = async () => {

    //comeca, pegando o valor da lista no armazenamento local como string
    const UserData_str = await AsyncStorage.getItem("UserData")

    //transforma o dados locais de string para lista
    const UserData_util =  UserData_str ? JSON.parse(UserData_str) : []

    //mudar o valor das variaveis acima para os valores armazenados localmente
    TimerReading = UserData_util[0].TimeRead
    //console.log(UserData_util)

    PagesRead_local.current = UserData_util[0].NumOfPageRead
  }

  //pega os dados locais de qual livro ele deveria renderizar
  const getSelectedBook = async () => {

    //comeca, pegando o valor da lista no armazenamento local como string
    const SelectedBook_str = await AsyncStorage.getItem("SelectedBook")

    //transforma o dados locais de string para lista
    const SelectedBook_final =  SelectedBook_str ? JSON.parse(SelectedBook_str) : []

    //mudar o valor das variaveis acima para os valores armazenados localmente
    setselectedFile(SelectedBook_final.uri)
    setFiletype(SelectedBook_final.type)
    lastPage_local.current = (SelectedBook_final.lastPage)

  }

  const SaveNewData = async () => {

 //essa parte lida com armazenar os dados de livro

    //comeca, pegando o valor da lista no armazenamento local como string
    const SelectedBook_str = await AsyncStorage.getItem("SelectedBook")

    //transforma o dados locais de string para lista
    const SelectedBook_final =  SelectedBook_str ? JSON.parse(SelectedBook_str) : []

    //pega a estrutura principal que salva toda a informacao de todos os livros
    const Booklist_str = await AsyncStorage.getItem("Books_list")

    //transforma a variavel anterior de string para lista
    const Bookslist_obj = Booklist_str ? JSON.parse(Booklist_str) : []

    //procura na lista de todos os livro e atualiza o valor daquele livro
        const updatedArray = Bookslist_obj.map( (item: Books_list_model) => {
      if (item.uri === SelectedBook_final.uri) { 
        return {
          ...item,
          lastPage: lastPage_local.current,
          //finishedReading: lastPage_local.current > (totalPages.current-5) ? true : false
        };

      }
      //caso n encontre o livro que precisa ser atualizado
      return item;
    });
      
    //console.log(TimerPageChecker)
    //converte a nova lista de obj para string
    const newlist_str = JSON.stringify(updatedArray)

    //salva a nova lista no armazenamento local
    await AsyncStorage.setItem("Books_list",newlist_str)

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 //Daqui para baixo e o codigo para salvar os dados de usuario

    //pegar o valor armazenado
    const UserData_str = await AsyncStorage.getItem("UserData")

    const UserData_obj = UserData_str ? JSON.parse(UserData_str) : []

    //atualizar esse valor 
    UserData_obj[0].TimeRead = TimerReading

    //atualizar o valor do numero de paginas lidas
    //console.log("value of pagesREAD_local in storage " + PagesRead_local)

    UserData_obj[0].NumOfPageRead = PagesRead_local.current

    //guardar esse valor de volta
    const UpdateUserData_str = JSON.stringify(UserData_obj)

    await AsyncStorage.setItem("UserData",UpdateUserData_str)

    //console.log("PART 3")

  }

  //caso o aplicativo foi de ativado para background ou desligado ele chama a funcao para salvar as informacoes de leitura
  const HandleAppStateChanges = (nextAppState : AppStateStatus) => {

    console.log(AppState.currentState)
  
    if (appState.current.match(/active/) &&
      nextAppState == "background" || nextAppState == "inactive") {
        SaveNewData()
      }
    appState.current = nextAppState
  }
 
  const SupremeReader = () => {

    if (Filetype == 'pdf'){

/*
      const countWordsOnPage = async (pageNumber: number) => {
  try {
    // Get the text content of the current page
    const page = await pdfDocumentProxy.getPage(pageNumber);
    const textContent = await page.getTextContent();
    
    // Extract all text items and join them
    const pageText = textContent.items.map(item => item.str).join(' ');
    
    // Count words (split by whitespace and filter empty strings)
    const wordCount = pageText
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;
    
    console.log(`Page ${pageNumber} has ${wordCount} words`);
    return wordCount;
  } catch (error) {
    console.error('Error counting words:', error);
    return 0;
  }
};*/

      
      return (        //se selectedFile n for nulo ele vai rederizar o pdf
            <View style={{ flex: 1 }}>

            {selectedFile && ( 
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Pdf
                  //diz qual arquivo deve ser renderizado
                  source={{ uri: selectedFile, cache:true}}

                  onLoadComplete={(numberOfPages, filePath) => {totalPages.current = numberOfPages}}

                  showsVerticalScrollIndicator = {true}
                  //essa linha abaixo define que o arquivo deve abrir na pagina dita pela variavel lastPage_local
                  page={lastPage_local.current}
                  //spacing={5}       
                  enablePaging={false}
                  enableRTL={false}
                  enableAnnotationRendering={true}

                  //essa funcao vai ser acionada toda vez que mudar de pagina no arquivo
                  onPageChanged={ (page) => { 
                    //isso e usado para salvar a pagina que parou
                    lastPage_local.current = (page)  

                  
                  // console.log("OnPageChanged Value: " + TimerPageChecker.current)

                    if (TimerPageChecker.current >= 25){
                      PagesRead_local.current += 1
                      console.log("Page passed the minimun time"+ PagesRead_local.current)
                    }

                    TimerPageChecker.current = 0
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

            </View>
            )

    }else if (Filetype == "epub"){
      
    console.log("Debug Epub active")
     
    //navigation.setOptions({headerShown: false})

     return(
      <View style={{flex: 1}}>
        <WebViewEpub selectedFile={selectedFile} />
      </View>
     )

    } 
  

  }

    //roda a funcao que coleta os dados toda vez que abre essa tela 
    useFocusEffect(
      
        useCallback(() => {

          (async () => {
          //chama a funcao que pega os dados do livro escolhido
          await getSelectedBook();
          //get the data of the time and keeps it going from this point
          await getUserData();          
          })();
         
          //prepara o programa para ativar a funcao HandleAppStateChanges em caso do estado do app mudar
          const listener = AppState.addEventListener("change",HandleAppStateChanges)

          
          const timerReadingCheck = setInterval(() => {

            TimerPageChecker.current += 1
            //console.log("tempo nessa pagina:" + TimerPageChecker.current) 

          }, 1000)
          //startTimeRef.current

          const interval = setInterval(() => {
            TimerReading = (TimerReading + 1)
            //console.log(TimerReading)
          }, 1000);

          //executa essas funcoe quando a tela e fechada ou reaberta
          return () => {
            
            clearInterval(timerReadingCheck)
            clearInterval(interval) 
            //should use AsyncStorage to save the time 
            SaveNewData()
            //console.log(selectedFile)
            listener.remove()

          }
        
        },[])
    )


    return (
    <View style={{flex: 1}}> 

      {SupremeReader()}

    </View>
    )
};

export default RenderScreen;

const styles = StyleSheet.create({
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B4B6E',
    paddingVertical: getResponsivePadding(10),
    paddingHorizontal: getResponsivePadding(20),
    borderBottomWidth: 1,
    borderBottomColor: '#1E1A78',
  },
  zoomButton: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
    backgroundColor: '#1E1A78',
    borderRadius: getResponsiveSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: getResponsiveMargin(10),
  },
  zoomButtonText: {
    color: '#F0F0F0',
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
  },
  zoomDisplay: {
    backgroundColor: '#2A2A3F',
    paddingHorizontal: getResponsivePadding(15),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveSize(15),
    minWidth: getResponsiveSize(60),
    alignItems: 'center',
  },
  zoomText: {
    color: '#F0F0F0',
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
  },
});


