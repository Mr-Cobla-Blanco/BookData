import AsyncStorage from "@react-native-async-storage/async-storage"
import { View,Text, Button } from "react-native"
import { GlobalStyle, UserData, UserConfig,ColorScheme } from "./_layout"
import { getTodayString } from "./index"
import { useState, useEffect } from "react"

import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { LinearGradient } from "expo-linear-gradient"

// Step 1: Create the ad (outside component so it persists)
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);


const confing = () => {

    const [adReady, setAdReady] = useState(false);

      useEffect(() => {

        
    //essa funcao acontece quando percebe que o Add esta pronto
    // Step 2: Listen for when ad finishes loading
    const loadListener = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        //aqui esta o codigo q vai rodar quando o Ad estiver pronto
        console.log('✅ Ad loaded and ready!');
        setAdReady(true);
      }
    );

    // Step 3: Listen for when user closes the ad
    const closeListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('👋 User closed the ad');
        setAdReady(false);
        // Load a new ad for next time
        interstitial.load();
      }
    );

    //essa e a parte importante,cria o setup para mostrar o AD
    // Step 4: Start loading the ad
    console.log('⏳ Loading ad...');
    //interstitial.load();

    // Cleanup when component unmounts
    return () => {
      loadListener();
      closeListener();
    };
  }, []);

  //Codigo que lida com Ads
const FullScreenAd = async() => {
 
    if (adReady) {

      console.log('📺 Showing ad now!');
      interstitial.show()

      return (
        <View style={{width:screen.availWidth, height:screen.availHeight , backgroundColor: "#fff"}}>
        </View> )

    } else {
      console.log('⚠️ Ad not ready yet, please wait...');
    }

}

const MudarFontSize = async(amount : number) => {

  //Pegar dados ------------------------------------------------------------------
    //pegar o valor armazenado
    const UserConfig_str = await AsyncStorage.getItem("UserConfig")

    const UserConfig_obj = UserConfig_str ? JSON.parse(UserConfig_str) : []

    UserConfig_obj[0].FontSize += amount
    console.log(UserConfig_obj[0].FontSize)

  //Guardar dados-----------------------------------------------------------------
    const UpdatedUserConfig_str = JSON.stringify(UserConfig_obj)

    await AsyncStorage.setItem("UserConfig",UpdatedUserConfig_str)
}


    return (
    <View style={GlobalStyle.Basic}>

        <View style={{marginVertical:32 , marginHorizontal:18}}>

        <Button
        color="#b11313ff"
        title="Erase all the local storage"
        onPress={EraseAllStorage}
        />

        <View
        style ={{flexDirection: 'row',justifyContent: 'space-between',paddingVertical: 8}}
        >
        <Button
          color= {ColorScheme.primary}
          title="<-Diminuir Fonte"
          onPress={() => {MudarFontSize(-10)}}
          />

        <Text>67?</Text>
        
        <Button
          color= {ColorScheme.primary}
          title="Aumentar Fonte->"
          onPress={() => {MudarFontSize(10)}}
          />
                      
         </View>      
      {/*
        <Button
        color="#0dc0b7ff"
        title="Test Ad"
        onPress={FullScreenAd}
        disabled={!adReady}
        />
      */}

        </View>
        
    </View>
    )
}

const EraseAllStorage = async () => {
    AsyncStorage.setItem("Books_list","")

    //era para dizer today mas eu gostei do toady
    //const toady = getTodayString()

    const UserDataList = []
    

    const UserData_debug: UserData= {
    SavedDay: getTodayString(),
    TimeRead_General: 0,
    TimeRead_Used: 0,
    NumOfPageRead: 0,
    Streak: 0,
    NumOfWordRead: 0,
    AverageWPM: 0,
          }

    UserDataList.push(UserData_debug)
        

    //transforma o obj em uma string para ser armazenada
    const UserData_str = JSON.stringify(UserDataList) 

    AsyncStorage.setItem("UserData",UserData_str)

    //Cria UserConfig-----------------------------------------------

    const UserConfig: UserConfig = {
      FontSize: 100
    }

    //transforma o obj em uma string para ser armazenada
    const UserConfig_str = JSON.stringify(UserDataList) 

    AsyncStorage.setItem("UserConfig",UserConfig_str)


    console.log("Dados apagados")
    //console.log(UserDataList)
}


export default confing
export {EraseAllStorage}
//export {FullScreenAd}


