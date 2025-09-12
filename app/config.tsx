import AsyncStorage from "@react-native-async-storage/async-storage"
import { View,Text, Button } from "react-native"
import { GlobalStyle, UserData } from "./_layout"
import { getTodayString } from "./index"
import defaultStyle  from "./_layout"

const today = getTodayString()

const confing = () => {


    return (
    <View style={GlobalStyle.Basic}>

        <View style={{marginVertical:32 , marginHorizontal:18}}>
        <Button
         
        color="#b11313ff"
        title="Erase all the local storage"
        onPress={EraseAllStorage}/>
        </View>
        
    </View>
    )
}

const EraseAllStorage = () => {
    AsyncStorage.setItem("Books_list","")

    //era para dizer today mas eu gostei do toady
    //const toady = getTodayString()

    const UserDataList = []
    
    const UserData_debug: UserData= {
    SavedDay: today,
    TimeRead: 0,
    NumOfPageRead: 0
          }

    UserDataList.push(UserData_debug)
        

    //transforma o obj em uma string para ser armazenada
    const UserData_str = JSON.stringify(UserDataList) 

    AsyncStorage.setItem("UserData",UserData_str)


    console.log("Dados apagados")
    console.log(UserDataList)
}


export default confing


