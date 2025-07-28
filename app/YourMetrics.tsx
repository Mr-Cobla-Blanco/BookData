import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Text,View  } from "react-native"





const YourMetrics = () => {

    const [ShowUserTimeRead, setShowUserTimeRead ]= useState()
    const [ShowPageRead , setShowPageRead] = useState()

    const getUserData = async () => {

    const gotUserData_str = await AsyncStorage.getItem("UserData")

    const gotUserData_obj = gotUserData_str? JSON.parse(gotUserData_str) : 0

    setShowUserTimeRead(gotUserData_obj?.TimeRead ?? 0)

    setShowPageRead(gotUserData_obj?.NumOfPageRead ?? 0)

    }

    useEffect(() => {
        getUserData()
    })
    
    return(
        <View>
            <Text>You read for : {ShowUserTimeRead}</Text>
            <Text>Pages read today: {ShowPageRead}</Text>
        </View>
    )
}


export default YourMetrics