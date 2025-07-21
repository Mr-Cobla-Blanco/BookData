import React, { useCallback, useContext, useEffect, useState } from "react";
import Pdf from 'react-native-pdf';
import {Text, StyleSheet, View, Button} from "react-native"
import PdfContext from "./Pdfcontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import { ScreenProps, useFocusEffect, useGlobalSearchParams } from "expo-router";

//responsavel por renderizar o PDF para a leitura
const RenderScreen = () => {

  //variavel que armazena o URI do pdf ou diz que pdf deve ser usados
  const [selectedPdf , setSelectedPdf] = useState<string | null>()
  //variavel que salva o numero da pagina que o usuario estava antes de fechar o livro
  let lastPage = 1

  //pega os dados locais de qual livro ele deveria renderizar
  const getSelectedBook = async () => {

    //comeca, pegando o valor da lista no armazenamento local como string
    const SelectedBook_str = await AsyncStorage.getItem("SelectedBook")

    //transforma o dados locais de string para lista
    const SelectedBook_final =  SelectedBook_str ? JSON.parse(SelectedBook_str) : []

    //mudar o valor das variaveis acima para os valores armazenados localmente
    setSelectedPdf(SelectedBook_final.uri)
    lastPage = (SelectedBook_final.lastPage)

  }

    //roda a funcao que coleta os dados toda vez que abre essa tela 
    useFocusEffect(
        useCallback(() => {getSelectedBook();},[])
    )

 return (
    <View
    style={{flex: 1}}>

        //se SelectedPdf n for nulo ele vai rederizar o pdf
        {selectedPdf && ( 
        <Pdf
        //diz qual arquivo deve ser renderizado
         source={{ uri: selectedPdf, cache:true}}

         showsVerticalScrollIndicator = {true}
         //essa linha abaixo define que o arquivo deve abrir na pagina dita pela variavel lastPage
         page={lastPage}
         spacing={5}

         //essa funcao vai ser acionada toda vez que mudar de pagina no arquivo
         onPageChanged={ () => {
          //console.log("Concertar a variavel page: ${page}")
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


