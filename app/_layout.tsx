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

//Esquema de cores geral do aplicativo
/*
export const ColorScheme = {
    text: "#14d19fff", //"#37ff47ff"
    subtext: "#88ffdfff",
    primary:  "#211951",
    secondery: "#211951",
    accent: "#17dfa9ff", //"#37ff47ff"
    background:"#000429ff"
}*/

export const ColorScheme = {
    text: "#14d19fff", //"#37ff47ff"
    subtext: "#88ffdfff",
    primary:  "#211951",
    secondery: "#211951",
    accent: "#17dfa9ff", //"#37ff47ff"
    background:"#000429ff"
}

//aqui vou colocar algumas coisas gerais q vai ser usado em todas as telas:
//Chaves para AsyncStorage>
    //"Books_list" = uma lista de objetos que armazena todos os arquivos de livros no sistema
export interface Books_list_model {
    uri: string
    name: String
    lastPage: number | string
    N_PagesRead: number
    finishedReading: boolean
    type: "pdf" | "epub" | "unknown"| "fisico"
    HrefCover: string
    
}   //Drawer navigation nao aceita passar variaveis entre telas(props) entao fiz uma gambiarra e usei AsyncStorage no lugar
    //"SelectedBook" => Salva no sistema local apenas o livro que vai ser lido no RendeScreen, tem a mesma interface que o booklist mas um unico objeto
    //"UserData" => Salva todas as informacoes de leitura no geral
    //"UserConfig" => Salva as configurações"
export interface UserData {
    SavedDay: Date
    TimeRead_General: number
    TimeRead_Used: number
    NumOfPageRead: number
    NumOfWordRead: number
    AverageWPM: Number
    Streak: number
}

export interface UserConfig {
    FontSize: number,
    TextFont: "Georgia" | "Time New Roman" | "Arial" | "Verdana" | "Courier New", //Literata,Georgia,Arial
    MinInatividadeTemp: number,
    MinPageCheckerTemp: number,
    //MinLeituraPaStreak: number,
    //EspaçoEntreAsLinhas??? //Não sei se adiciona pq eu nunca usaria isso
    //Tema: "Bug-Retro"(atual); | "MedivalClassical"(JeffBackPack) | "White???" //ainda não é a hora
}


//funcao basica para lidar com a navegacao de telas com o Drawer(gaveta)navigation
export default function RootLayout(){  

    return (

            <GestureHandlerRootView style={{flex: 1}}>
                <Drawer 
                //Configuracoes gerais do Drawer
                //#region General Config
                    screenOptions={{
                        swipeEnabled: true,

                        drawerStyle: {
                            backgroundColor: "#1E1E2F"
                        },
                        headerStyle: {
                            backgroundColor: ColorScheme.primary,
                        },
                        headerTintColor: ColorScheme.subtext ,
                        headerTitleStyle: {
                            fontWeight: "bold",
                            color: ColorScheme.text
                        },
                        drawerLabelStyle: {
                            color: ColorScheme.text ,
                            fontSize: getResponsiveFontSize(24),
                            fontFamily : "georgia"
                        },
                        drawerActiveBackgroundColor: ColorScheme.primary,
                        //drawerActiveTintColor: ColorScheme.background
                        //drawerActiveTintColor: "#ff0000ff",
                        //drawerHideStatusBarOnOpen: true

                //#endregion
                    }}

                    drawerContent={(props) => (
                        <View style={{flex: 1, backgroundColor: ColorScheme.background}}>
                            {/* Configuracoes para criar o topo da gaveta */}
                            <View style={{
                                padding: getResponsivePadding(10),
                                backgroundColor: '#001433ff',//Essa e a única excessao
                                alignItems: 'center',
                                //borderBottomWidth: 1,
                                //borderBottomColor: '#F0F0F0'
                            }}>
                                
                                <Image 
                                    source={require('../assets/Logo.png')}
                                    style={{width: getResponsiveSize(80), height: getResponsiveSize(80), marginBottom: getResponsiveMargin(1)}}
                                />
                                <Text style={{color: ColorScheme.subtext, fontSize: getResponsiveFontSize(24), fontWeight: 'bold'}}>
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
                                style={{ width: size, height: size, tintColor: ColorScheme.subtext  }}
                                resizeMode="contain"
                            /> 
                        )

                    }} />

                    <Drawer.Screen name="Render"
                        options={{drawerItemStyle: {display: 'none' },
                         headerShown: true,
                         headerTitle: "",
                         headerStatusBarHeight:getResponsiveSize(15),                   
                         //headerTintColor:,
                         headerStyle:{
                            //deve ser refeito para diferentes densidades de pixel
                            height: getResponsiveSize(90, 'height'),
                            elevation:0,
                            shadowOpacity:0,
                            //marginVertical: -100
                         }
                        }}/>

                    <Drawer.Screen name='Shelf' options={{
                        drawerLabel: "BookShelf",
                        title: "BookShelf",

                        drawerIcon: ({ color, size }) => (
                            <Image
                                source={require('../assets/shelf_icon.png')}
                                style={{ width: size, height: size, tintColor: ColorScheme.subtext  }}
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
                        drawerItemStyle: {display: "none"},     
                    }}/>

                    <Drawer.Screen name='FisicoRender' options={{
                        drawerLabel: 'FisicoRender',
                        title:"FisicoRender",
                        drawerItemStyle: {display: "none"}
                    }}/>

                    <Drawer.Screen name='YourMetrics' options={{
                        drawerLabel: 'Metrics',
                        title:"Metrics",
                        headerStyle:{
                            //deve ser refeito para diferentes densidades de pixel
                            height: getResponsiveSize(80, 'height'),
                            backgroundColor: ColorScheme.primary
                         },

                        drawerIcon: ({ color, size }) => (
                            <Image
                                source={require('../assets/icon_metrics.png')}
                                style={{ width: size, height: size, tintColor: ColorScheme.subtext   }}
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
                                style={{ width: size, height: size, tintColor: ColorScheme.subtext   }}
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
        backgroundColor: ColorScheme.background,
        flex : 1
    },
    DText: {
        color:"#F0F0F0" ,
        fontSize: getResponsiveFontSize(20),
        fontFamily : "georgia"
    }

})