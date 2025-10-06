import AsyncStorage from "@react-native-async-storage/async-storage"
import { View,Text, Button } from "react-native"
import { GlobalStyle, UserData } from "./_layout"
import { getTodayString } from "./index"
import defaultStyle  from "./_layout"
import { useState, useEffect } from "react"

import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
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
    interstitial.load();

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

    return (
    <View style={GlobalStyle.Basic}>

        <View style={{marginVertical:32 , marginHorizontal:18}}>
        <Button
         
        color="#b11313ff"
        title="Erase all the local storage"
        onPress={EraseAllStorage}/>
        <Button
         
        color="#0dc0b7ff"
        title="Test Ad"
        onPress={FullScreenAd}
        disabled={!adReady}/>
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
    TimeRead: 0,
    NumOfPageRead: 0
          }

    UserDataList.push(UserData_debug)
        

    //transforma o obj em uma string para ser armazenada
    const UserData_str = JSON.stringify(UserDataList) 

    AsyncStorage.setItem("UserData",UserData_str)


    //PARAMETRO DE TESTE
    //await AsyncStorage.clear();

    console.log("Dados apagados")
    //console.log(UserDataList)
}


export default confing
export {EraseAllStorage}
//export {FullScreenAd}


