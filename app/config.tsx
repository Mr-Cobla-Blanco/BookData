import AsyncStorage from "@react-native-async-storage/async-storage"
import { View,Text, Button, StyleSheet } from "react-native"
import { ColorScheme } from "./_layout"
import { useState, useEffect } from "react"
import { DataHandler } from "./index"
import { TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { Alert } from "react-native"
import * as SQLite from "expo-sqlite";

// Step 1: Create the ad (outside component so it persists)
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

const confing = () => {

    const [adReady, setAdReady] = useState(false);
    const [FontSize_local, setFontSize_local] = useState(100)

    const getInfo= async() => {

    //comeca, pegando o valor da lista no armazenamento local como string
    const ConfigInfo_str = await AsyncStorage.getItem("UserConfig")

    console.log(ConfigInfo_str)

    //transforma o dados locais de string para lista
    const ConfigInfo_util =  ConfigInfo_str ? JSON.parse(ConfigInfo_str) : []

    console.log("fontSize:" + ConfigInfo_util[0].FontSize)
    //mudar o valor das variaveis acima para os valores armazenados localmente
    setFontSize_local(ConfigInfo_util[0].FontSize)


    }

      useEffect(() => {
        getInfo()
        
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
    //console.log(UserConfig_obj[0].FontSize)

    //Muda o valor localmente
    setFontSize_local(FontSize_local + amount)

  //Guardar dados-----------------------------------------------------------------
    const UpdatedUserConfig_str = JSON.stringify(UserConfig_obj)

    await AsyncStorage.setItem("UserConfig",UpdatedUserConfig_str)
}

    return (
    <View style={Style.Main}>

        <View style={{marginVertical:32 , marginHorizontal:18}}>

        <Button
        color="#b11313ff"
        title="Erase all the local storage"
        onPress={EraseDecision}
        />

        <View
        style ={{flexDirection: 'row',justifyContent: 'space-between',paddingVertical: 8}}
        >
          <Button
            color= {ColorScheme.primary}
            title="<-Diminuir Fonte"
            onPress={() => {MudarFontSize(-10)}}
            />

          <Text style={{ color:ColorScheme.text, fontSize: 32 }}>
            {FontSize_local} 
          </Text>
          
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

        {/*
        <Button
        color="#640505ff"
        title="Debug SuperWiper"
        onPress={() => {AsyncStorage.clear(), DataHandler()}}
        /> 
        */}

        </View>
        
    </View>
    )
}

const EraseDecision = async() => {

        await new Promise((resolve) => {
              Alert.alert(
          "Decision to delete",  // Título
          "This will delete all your data, including reading habits and saved books",  // Mensagem
          [
            {
              text: "Cancelar",
              onPress: () => {resolve(false)},
              style: "cancel"
            },
            {
              text: "Delete Everything",
              onPress: () => {EraseAllStorage(),resolve(true)}
            }
          ]
        );
  
          })
          
}

const EraseAllStorage = async () => {

  const db = SQLite.openDatabaseSync('TrackReader.db')

  
  try{

      db.execSync(`
      DROP TABLE IF EXISTS books;
      DROP TABLE IF EXISTS metrics;
    `);

    console.log("Tabelas deletadas com sucesso")

  }catch(e){console.log("Erro deletando tabelas"+ e)}
/*
  try {
    // Pega todas as tabelas (exceto tabelas do sistema)
    const tables = db.getAllSync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE 'android_%'
    `);
    
    for (const table of tables) {
      db.execSync(`DROP TABLE IF EXISTS ${table.name}`);
    }

    // Deleta cada tabela
    /*
    for (var i = 0; i < tables.length; i++) {
      db.execSync(`DROP TABLE IF EXISTS ${tables[i]}`);
      console.log(`✅ Tabela ${tables[i]} deletada`);
    }
    
    console.log('✅ Todas as tabelas deletadas');
  } catch (error) {
    console.error('❌ Erro ao deletar tabelas:', error);
  }*/

    //AsyncStorage.clear(), 
    DataHandler()
  /*
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
      FontSize: 100,
      TextFont: "Georgia",
      MinInatividadeTemp: 5,
      MinPageCheckerTemp: 0.5 ,
      //MinLeituraPaStreak: 0,
    }

    const UserConfigList = []

    UserConfigList.push(UserConfig)

    //transforma o obj em uma string para ser armazenada
    const UserConfig_str = JSON.stringify(UserConfigList) 

    AsyncStorage.setItem("UserConfig",UserConfig_str)*/

    alert("Data deleted")
    //console.log(UserDataList)
}

const Style = StyleSheet.create({
    Main: {
        backgroundColor: ColorScheme.background,
        flex : 1,
    },
    DText: {
        color:"#F0F0F0" ,
        //fontSize: getResponsiveFontSize(20),
        fontFamily : "georgia"
    }

})

export default confing
export {EraseAllStorage}
//export {FullScreenAd}


