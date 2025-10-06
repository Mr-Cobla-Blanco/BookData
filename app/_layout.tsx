import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import {StyleSheet} from "react-native"
import { View, Text, Image } from 'react-native'
import { DrawerItemList } from '@react-navigation/drawer';

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
    type: "pdf" | "epub" | "mobi" | "unknown" | "fb2"
    
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
                //Configuracoes gerais do Drawer
                //#region General Config
                    screenOptions={{
                        swipeEnabled: true,

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
                            fontSize: 24,
                            fontFamily : "georgia"
                        },
                        drawerActiveBackgroundColor: "#4B4B6E",
                        drawerActiveTintColor: "#bababa",
                        //drawerHideStatusBarOnOpen: true

                //#endregion
                    }}

                    drawerContent={(props) => (
                        <View style={{flex: 1, backgroundColor: '#1E1E2F'}}>
                            {/* Configuracoes para criar o topo da gaveta */}
                            <View style={{
                                padding: 10,
                                backgroundColor: '#01337c',
                                alignItems: 'center',
                                //borderBottomWidth: 1,
                                //borderBottomColor: '#F0F0F0'
                            }}>
                                
                                <Image 
                                    source={require('../assets/Logo.jpeg')}
                                    style={{width: 80, height: 80, marginBottom: 1}}
                                />
                                <Text style={{color: '#F0F0F0', fontSize: 24, fontWeight: 'bold'}}>
                                    Track Reader
                                </Text>
                            </View>
                            <DrawerItemList {...props} />
                        </View>
                    )}
        >

                //#region Gaveta config
            
                    <Drawer.Screen name='index' options={{ 
                        drawerLabel: 'Home',
                        title: 'Home',
                        drawerItemStyle: {marginTop:18,},

                        drawerIcon: ({ color, size }) => (
                            <Image
                                source={require('../assets/favicon.png')}
                                style={{ width: size, height: size, tintColor: "#F0F0F0"  }}
                                resizeMode="contain"
                            /> 
                        )

                    }} />

                    <Drawer.Screen name="Render"
                        options={{drawerItemStyle: {display: 'none' },
                         headerShown: true,
                         headerTitle: "",
                         headerStatusBarHeight:0,
                         headerTintColor:"#000000ff",
                         headerStyle:{
                            //deve ser refeito para diferentes densidades de pixel
                            height: 80,
                            elevation:0,
                            shadowOpacity:0,
                         }
                        }}/>

                    <Drawer.Screen name='Shelf' options={{
                        drawerLabel: "BookShelf",
                        title: "BookShelf",

                        drawerIcon: ({ color, size }) => (
                            <Image
                                source={require('../assets/shelf_icon.png')}
                                style={{ width: size, height: size, tintColor: "#F0F0F0"  }}
                                resizeMode="contain"
                            /> 
                        )
                    }}/>

                    <Drawer.Screen name='Uploader' options={{
                        drawerLabel: 'Uploader',
                        title:"Uploader",
                        drawerItemStyle: {display: "none"}
                    }}/>

                    <Drawer.Screen name='YourMetrics' options={{
                        drawerLabel: 'YourMetrics',
                        title:"YourMetrics",

                        drawerIcon: ({ color, size }) => (
                            <Image
                                source={require('../assets/icon_metrics.png')}
                                style={{ width: size, height: size, tintColor: "#F0F0F0"  }}
                                resizeMode="contain"
                            /> 
                        )
                    }}/>

                    <Drawer.Screen name="config" options={{
                        drawerLabel: "config",
                        title: "config",

                        drawerIcon: ({ color, size }) => (
                            <Image
                                source={require('../assets/config_icon.png')}
                                style={{ width: size, height: size, tintColor: "#F0F0F0"  }}
                                resizeMode="contain"
                            /> 
                        )
                    }}/>

                //#endregion

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
        fontSize: 20,
        fontFamily : "georgia"
    }

})