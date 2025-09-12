import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import {StyleSheet} from "react-native"
/*
const ColorScheme {
    text: "#F0F0F0" ,
    primary: #4B4B6E ,
    secondery: #bababa,
    accent: #1E1A78,
    background: #1E1E2F
}
*/
//const textColor = "#F0F0F0"


//aqui vou colocar algumas coisas gerais q vai ser usado em todas as telas:
//Chaves para AsyncStorage>
    //"Books_list" = uma lista de objetos que armazena todos os arquivos de livros no sistema
export interface Books_list_model {
    uri: string
    name: String
    lastPage: number
    finishedReading: boolean
}   //Drawer navigation nao aceita passar variaveis entre telas(props) entao fiz uma gambiarra e usei AsyncStorage no lugar
    //"SelectedBook" => Salva no sistema local apenas o livro que vai ser lido no RendeScreen, tem a mesma interface que o booklist mas um unico objeto
    //"UserData" => Salva todas as informacoes de leitura no geral
export interface UserData {
    SavedDay: Date
    TimeRead: number
    NumOfPageRead: number
}

//funcao basica para lidar com a navegacao de telas com o Drawer(gaveta)navigation
export default function RootLayout(){  

    return (

            <GestureHandlerRootView style={{flex: 1,backgroundColor: "#1E1E2F"}}>
                <Drawer 
                    screenOptions={{
                        drawerStyle: {
                            backgroundColor: "#1E1E2F"
                        },
                        headerStyle: {
                            backgroundColor: "#4B4B6E",
                        },
                        headerTintColor: "#F0F0F0" ,
                        headerTitleStyle: {
                            fontWeight: "bold",
                            color: "#F0F0F0" 
                        },
                        drawerLabelStyle: {
                            color: "#F0F0F0" ,
                            fontSize: 16,
                            fontFamily : "georgia"
                        },
                        drawerActiveBackgroundColor: "#4B4B6E",
                        drawerActiveTintColor: "#bababa",
                        //drawerHideStatusBarOnOpen: true
                    }}>

                    <Drawer.Screen name='index' options={{ 
                        drawerLabel: 'Home',
                        title: 'Home',
                        //drawerIcon: './assests/favicon.png'
                    }} />

                    <Drawer.Screen name="Render"
                        options={{drawerItemStyle: {display: 'none' }, headerShown: false}}/>

                    <Drawer.Screen name='Shelf' options={{
                        drawerLabel: "BookShelf",
                        title: "BookShelf"
                    }}/>

                    <Drawer.Screen name='Uploader' options={{
                        drawerLabel: 'Uploader',
                        title:"Uploader",
                        drawerItemStyle: {display: "none"}
                    }}/>

                    <Drawer.Screen name='YourMetrics' options={{
                        drawerLabel: 'YourMetrics',
                        title:"YourMetrics"
                    }}/>

                    <Drawer.Screen name="config" options={{
                        drawerLabel: "config",
                        title: "config"
                    }}/>


                </Drawer>
            </GestureHandlerRootView>
    )

}

export const GlobalStyle = StyleSheet.create({
    Basic: {
        backgroundColor: "#1E1E2F",
        flex : 1
    },
    DText: {
        color:"#F0F0F0" ,
    }

})