import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Pdf from 'react-native-pdf';
import {Text, StyleSheet, View, Button, AppState, AppStateStatus} from "react-native"
import PdfContext from "./Pdfcontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import { ScreenProps, useFocusEffect, useGlobalSearchParams } from "expo-router";
import { Books_list_model } from "./_layout";

//TO-DO: dever haver uma maneira de guarda e paga dados como a ultima pagina


//responsavel por renderizar o PDF para a leitura
const RenderScreen = () => {

  //variavel que armazena o URI do pdf ou diz que pdf deve ser usados
  const [selectedPdf , setSelectedPdf] = useState<string | null>()
  //variavel que salva o numero da pagina que o usuario estava antes de fechar o livro
  const lastPage_local = useRef(1)

  const appState = useRef(AppState.currentState)
  //const [appStateVisible,setAppStateVisible] = useState(appState.current)
  let TimerReading = 0

  //const Storadepage = useRef(30)

  //funcao para coletar chamar alguns dados do usuario como tempo lido e contador de paginas
  const getTimerReading = async () => {

    //comeca, pegando o valor da lista no armazenamento local como string
    const UserData_str = await AsyncStorage.getItem("UserData")

    //transforma o dados locais de string para lista
    const UserData_util =  UserData_str ? JSON.parse(UserData_str) : []

    //mudar o valor das variaveis acima para os valores armazenados localmente
    TimerReading = UserData_util.TimeRead
  }

  //pega os dados locais de qual livro ele deveria renderizar
  const getSelectedBook = async () => {

    //comeca, pegando o valor da lista no armazenamento local como string
    const SelectedBook_str = await AsyncStorage.getItem("SelectedBook")

    //transforma o dados locais de string para lista
    const SelectedBook_final =  SelectedBook_str ? JSON.parse(SelectedBook_str) : []

    //mudar o valor das variaveis acima para os valores armazenados localmente
    setSelectedPdf(SelectedBook_final.uri)
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
        };

      }
      //caso n encontre o livro que precisa ser atualizado
      return item;
    });

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
    UserData_obj.TimeRead = TimerReading

    //UserData_obj.NumOfPageRead = ???

    //guardar esse valor de volta
    const UpdateUserData_str = JSON.stringify(UserData_obj)

    await AsyncStorage.setItem("UserData",UpdateUserData_str)

  }

  //caso o aplicativo foi de ativado para background ou desligado ele chama a funcao para salvar as informacoes de leitura
  const HandleAppStateChanges = (nextAppState : AppStateStatus) => {
  
    if (appState.current.match(/active/) &&
      nextAppState == "background" || nextAppState == "inactive") {
        SaveNewData()
      }
    appState.current = nextAppState
  }
 

    //roda a funcao que coleta os dados toda vez que abre essa tela 
    useFocusEffect(
      
        useCallback(() => {
          //chama a funcao que pega os dados do livro escolhido
          getSelectedBook();
          
          //get the data of the time and keeps it going from this point
          getTimerReading();
         
          //prepara o programa para ativar a funcao HandleAppStateChanges em caso do estado do app mudar
          const listener = AppState.addEventListener("change",HandleAppStateChanges)

          //TimerFunction()
          //startTimeRef.current
          const interval = setInterval(() => {
            TimerReading = (TimerReading + 1)
          }, 1000);

          //executa essas funcoe quando a tela e fechada ou reaberta
          return () => {
            
            clearInterval(interval) 
            //should use AsyncStorage to save the time 
            SaveNewData()
            //console.log(selectedPdf)
            listener.remove()

          }
        
        },[])
    )

    return (
    <View style={{flex: 1}}> 

        //se SelectedPdf n for nulo ele vai rederizar o pdf
        {selectedPdf && ( 
        <Pdf
        //diz qual arquivo deve ser renderizado
         source={{ uri: selectedPdf, cache:true}}

         onLoadComplete={(numberOfPages, filePath) => {}}

         showsVerticalScrollIndicator = {true}
         //essa linha abaixo define que o arquivo deve abrir na pagina dita pela variavel lastPage_local
         page={lastPage_local.current}
         spacing={5}

         //essa funcao vai ser acionada toda vez que mudar de pagina no arquivo
         onPageChanged={ (page) => { //isso e usado para salvar a pagina que parou
          lastPage_local.current =(page)
         }}

         onError={(error) => console.log(error)}
         //a linha abaixo disse o que deve acontecer quando o usuario apertar um link dentro do pdf
         //onPressLink={(uri) => console.log("link pressed: ${uri}")}

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


