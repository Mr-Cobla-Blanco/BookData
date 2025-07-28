import AsyncStorage from "@react-native-async-storage/async-storage"
import { View,Text, Button } from "react-native"

const confing = () => {


    return (
    <View style={{flex: 1,marginHorizontal:50,marginVertical:30}}>
        <Button 
        color="#b11313ff"
        title="Erase all the local storage"
        onPress={EraseAllStorage}/>
        
    </View>
    )
}

const EraseAllStorage = () => {
    AsyncStorage.setItem("Books_list","")
    AsyncStorage.setItem("UserData","")
    console.log("Dados apagados")
}


export default confing


