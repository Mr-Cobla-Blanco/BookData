import AsyncStorage from "@react-native-async-storage/async-storage"
import { View,Text, Button } from "react-native"

const confing = () => {


    return (
    <View style={{flex: 1}}>
        <Text>Teste basico para a confing</Text>
        <Button
        color="#b11313ff"
        title="Erase all the local storage"
        onPress={EraseAllStorage}/>
        
    </View>
    )
}

const EraseAllStorage = () => {
    AsyncStorage.setItem("Books_list","")
    console.log("Dados apagados")
    //const LocalStorage = AsyncStorage.getItem("Books_list")
    //console.log(LocalStorage)
}


export default confing


