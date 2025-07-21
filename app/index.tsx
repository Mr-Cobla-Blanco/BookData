
//primeira tela que o programa vai renderizar
import { Text } from "react-native-gesture-handler";
import { View } from "react-native"
import { useEffect } from "react";
import { router } from "expo-router";
import FeedScreen from "./Uploader";
import AsyncStorage from "@react-native-async-storage/async-storage";


const index = (bookInfo: string) => {

  //Essa funcao puxa as informacoes armazenadas e printa os dados no terminal, toda vez que o app se inicia
  //useEffect(() => {DataHandler();}, []);

    return (
        <View>
        <Text>Bem Vindo!!!</Text>
        <Text>essa é a Tela index de PlaceHolder</Text>
        </View>
    )
}

 //cria a funcao para adicionat dados ao armazenamento local, sera usada no UploaderScreen
  const SaveBooks = async (value: string) => {
    try{
    //comeca, pegando o valor da lista no armazenamento local como string
    const storageString = await AsyncStorage.getItem("Books_list")

    //transforma o dados locais de string para lista
    const oldList = storageString ? JSON.parse(storageString) : []

    //transforma a variavel input de string em obj
    const objToBeAdded = JSON.parse(value)

    //colocar o valor do input no final da lista que estava armazenada
    oldList.push(objToBeAdded)

    //converte a nova lista de obj para string
    const newlist_str = JSON.stringify(oldList)

    //console.log(newlist_str)

    //salva a nova lista no armazenamento local
    await AsyncStorage.setItem("Books_list",newlist_str)

    } catch (e) {}

  }

/*
const DataHandler = async () => {

  //chama o armazenamento local para ver se existe um lista
  const listString = await AsyncStorage.getItem("Books_list")

  //se existe algum dado armazenado ele apresenta no terminal
  if (listString !== null){
    //pega os valores armazenados na lista e coverte de string para apresentar no terminals
    const lista = JSON.parse(listString)
    console.log(lista)
  }

}*/

export default index
export {SaveBooks}