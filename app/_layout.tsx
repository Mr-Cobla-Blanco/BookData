import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import {StyleSheet, Dimensions} from "react-native"
import { View, Text, Image } from 'react-native'
import { DrawerItemList } from '@react-navigation/drawer';

const { width, height } = Dimensions.get('window');

// Responsive sizing utilities based on screen dimensions
// Base screen dimensions: 900x1900 (increased from 720x1520)
const BASE_WIDTH = 444;
const BASE_HEIGHT = 890;

const getResponsiveSize = (size: number, type: 'width' | 'height' = 'width') => {
  const baseSize = type === 'width' ? BASE_WIDTH : BASE_HEIGHT;
  const currentSize = type === 'width' ? width : height;
  return (size * currentSize) / baseSize;
};

const getResponsiveFontSize = (fontSize: number) => {
  return getResponsiveSize(fontSize, 'width');
};

const getResponsivePadding = (padding: number) => {
  return getResponsiveSize(padding, 'width');
};

const getResponsiveMargin = (margin: number) => {
  return getResponsiveSize(margin, 'width');
};

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
    type: "pdf" | "epub" | "unknown"| "fisico"
    
}   //Drawer navigation nao aceita passar variaveis entre telas(props) entao fiz uma gambiarra e usei AsyncStorage no lugar
    //"SelectedBook" => Salva no sistema local apenas o livro que vai ser lido no RendeScreen, tem a mesma interface que o booklist mas um unico objeto
    //"UserData" => Salva todas as informacoes de leitura no geral
export interface UserData {
    SavedDay: Date
    TimeRead: number
    NumOfPageRead: number
    Streak: number
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
                            fontSize: getResponsiveFontSize(24),
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
                                padding: getResponsivePadding(10),
                                backgroundColor: '#01337c',
                                alignItems: 'center',
                                //borderBottomWidth: 1,
                                //borderBottomColor: '#F0F0F0'
                            }}>
                                
                                <Image 
                                    source={require('../assets/Logo.jpeg')}
                                    style={{width: getResponsiveSize(80), height: getResponsiveSize(80), marginBottom: getResponsiveMargin(1)}}
                                />
                                <Text style={{color: '#F0F0F0', fontSize: getResponsiveFontSize(24), fontWeight: 'bold'}}>
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
                        drawerItemStyle: {marginTop: getResponsiveMargin(18),},

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
                            height: getResponsiveSize(80, 'height'),
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

                    <Drawer.Screen name='EpubRender' options={{
                        drawerLabel: 'EpubRender',
                        title:"EpubRender",
                        drawerItemStyle: {display: "none"}
                    }}/>

                    <Drawer.Screen name='FisicoRender' options={{
                        drawerLabel: 'FisicoRender',
                        title:"FisicoRender",
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
        fontSize: getResponsiveFontSize(20),
        fontFamily : "georgia"
    }

})