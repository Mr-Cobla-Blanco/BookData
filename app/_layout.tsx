import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { useState } from 'react'
import PdfContext from './Pdfcontext'


const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
const value = {selectedPdf, setSelectedPdf}
  
export default function RootLayout(){  

    return (
        <PdfContext.Provider value={value}>
            <GestureHandlerRootView style={{flex: 1}}>
                <Drawer>

                    <Drawer.Screen name='index' options={{ 
                        drawerLabel: 'Home',
                        title: 'Home',
                        //drawerIcon: './assests/favicon.png'
                    }} />

                    <Drawer.Screen name="Render"
                        options={{drawerItemStyle: {display: 'none' }}}/>

                    <Drawer.Screen name='Library'/>

                    <Drawer.Screen name='App' 
                        options= {{drawerItemStyle : {display: 'none', }}}/>
                    
                    <Drawer.Screen name='Pdfcontext'
                        options={{drawerItemStyle: {display: 'none' }}}/>


                </Drawer>
            </GestureHandlerRootView>
        </PdfContext.Provider>
    )

}


/*
  //const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  //const value = { selectedPdf, setSelectedPdf };

  return (FeedScreen)

  
    /*
    <PdfContext.Provider value={value}>
*/ 