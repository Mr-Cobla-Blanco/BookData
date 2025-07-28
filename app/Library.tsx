import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
//import type { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Pressable, View,StyleSheet,Text,Image,Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import index from ".";
import { useFocusEffect, useRouter } from "expo-router";
import { Books_list_model } from "./_layout";
import Pdf from 'react-native-pdf';

//funcao responsavel por toda tela de biblioteca
const LibraryScreen = () => {

    //a variavel Shelf sera usada para segurar os dados armazenados para usar no return
    const [shelf , setShelf] = useState<Books_list_model[]>([])
    const navigation = useNavigation()

    
    const openBook = async ( objBook: Books_list_model) => {

        //prepara o objeto "livro" para ser armazenado para ser acessado no render
        const ObjBook_str = JSON.stringify(objBook) 

        console.log(ObjBook_str)

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
            <Text>Your Bookshelf:</Text>
                <FlatList
                    data={shelf}
                    renderItem={({item}) => (
                    <TouchableOpacity onPress={() => (openBook(item)) }>

                        <Pdf
                        //diz qual arquivo deve ser renderizado
                        source={{ uri: item.uri}}
                        //essa linha abaixo define em que pagina o arquivo deve abrir
                        page={1} //eu devia fazer uma opcao para variar entre os valores 1 e item.lastpage
                        singlePage = {true}

                        onLoadComplete={(numberOfPages, filePath) => {}}
                        onError={(error) => console.log(error)}

                        style = {{flex:1,
                            width:"80%",
                            height: 280,
                            alignItems: "flex-end"
                        }}
                        />  

                        //aqui renderiza cada quadrado
                    <View key={item.uri} style={styles.bookItem}>
 
                        <Text> Name: {item.name}</Text>
                        <Text>Stopped at page: {item.lastPage}</Text>
                        
                      


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
        alignContent:"center",
        padding: 5
    },
      bookItem: {
    backgroundColor: '#60598bff',
    borderRadius: 12,
    padding: 5,
    alignContent:"center",
    alignItems: "center",
    justifyContent: "center"

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
