import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
//import type { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Pressable, View,StyleSheet,Text,Image,Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import index from ".";
import { useFocusEffect, useRouter } from "expo-router";
import { Books_list_model } from "./_layout";

//funcao responsavel por toda tela de biblioteca
const LibraryScreen = () => {

    //a variavel Shelf sera usada para segurar os dados armazenados para usar no return
    const [shelf , setShelf] = useState<Books_list_model[]>([])
    const navigation = useNavigation()

    
    const openBook = async ( objBook: object) => {

        //prepara o objeto "livro" para ser armazenado para ser acessado no render
        const ObjBook_str = JSON.stringify(objBook) 

        //armazena o objeto "livro" para ser acessado no render
        await AsyncStorage.setItem('SelectedBook',ObjBook_str)

        navigation.navigate("Render" as never)
    }

    //funcao para pegar os dados de todos os livros armazenados no sistema e colocar na variavel loca Shelf
    const getData = async () => {

    try {

    //comeca, pegando o valor da lista no armazenamento local como string
    const storageString = await AsyncStorage.getItem("Books_list")

    //transforma o dados locais de string para lista, caso nao tenha retorna uma lista vazia
    const oldList = storageString ? JSON.parse(storageString) : []
    
    //muda o valor de shelf
    setShelf(oldList)

    } catch (e) {console.log("Erro em coletar dados na biblioteca")}

    } 

  //roda a funcao que coleta os dados do armazenamento local toda vez que abre essa tela 
    useFocusEffect(
        useCallback(() => {getData();},[])
    )



    return (
        <View style={styles.container}>
            <Text>Basic Text</Text>
                <FlatList
                    data={shelf}
                    renderItem={({item}) => (
                    <TouchableOpacity onPress={() => (openBook(item)) }>
                        //aqui renderiza cada quadrado
                    <View key={item.uri} style={styles.bookItem}>
                        <Text> Name: {item.name}</Text>
                        <Text>Stopped at page: {item.lastPage}</Text>
                        <Text>Finished this book: {item.finishedReading}</Text>

                    </View>
                    </TouchableOpacity>
                )} 
                keyExtractor={(item, index) => item.uri || index.toString()}
                //define cria um espaço entre os quadrados
                contentContainerStyle={{gap: 16 , paddingTop: 12 }}
            
                />
        </View>
    );
};

export default LibraryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8 ,
    },
    ButtomContainer: {
        //width: 40,
        //height: 150,
        alignItems: "center",
        justifyContent: "center",
        padding: 6
    },
      bookItem: {
    backgroundColor: '#60598bff',
    borderRadius: 12,
    padding: 16,
  },

});

/*
//#region
                <Pressable onPress={() => navigation.navigate("Render" as never)}
                    style={{width:200 , height: 200}}>
                    <Text>Read me Bro</Text> 
                    <Image
                    //source={require("./assets/splash-icon.png")}
                    style={{width:200 , height: 200}}
                    />
                </Pressable>
                */
//#endregion
