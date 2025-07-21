import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'

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


//funcao basica para lidar com a navegacao de telas com o Drawer(gaveta)navigation
export default function RootLayout(){  

    return (

            <GestureHandlerRootView style={{flex: 1}}>
                <Drawer>

                    <Drawer.Screen name='index' options={{ 
                        drawerLabel: 'Home',
                        title: 'Home',
                        //drawerIcon: './assests/favicon.png'
                    }} />

                    <Drawer.Screen name="Render"
                        options={{drawerItemStyle: {display: 'none' }}}/>

                    <Drawer.Screen name='Library' options={{
                        drawerLabel: "Library",
                        title: "Library"
                    }}/>

                    <Drawer.Screen name='App' 
                        options= {{drawerItemStyle : {display: 'none', }}}/>
                    
                    <Drawer.Screen name='Pdfcontext'
                        options={{drawerItemStyle: {display: 'none' }}}/>

                    <Drawer.Screen name='Uploader' options={{
                        drawerLabel: 'Uploader',
                        title:"Uploader"
                    }}/>


                </Drawer>
            </GestureHandlerRootView>
    )

}

