
//primeira tela que o programa vai renderizar
import { Text } from "react-native-gesture-handler";
import { Button, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from "react-native"
import { useEffect, useState } from "react";
import { router } from "expo-router";
import FeedScreen from "./Uploader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "./_layout";
import { GlobalStyle } from "./_layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import EraseAllStorage from "./config"
//import 'expo-router/entry'

const { width } = Dimensions.get('window');

  const getTodayString = () => new Date()//.toISOString().split('T')[0];
  const CurrentDay = getTodayString()
  let Timer = 0;
  //console.log(CurrentDay)

const index = (bookInfo: string) => {

  const [showTutorial, setShowTutorial] = useState(true);

  //Essa funcao puxa as informacoes armazenadas e printa os dados no terminal, toda vez que o app se inicia
  useEffect(() => {
    DataHandler();

          const interval = setInterval(() => {
            Timer = Timer + 1
            DataHandler();
          }, 3*3600*1000);

    //CLEANUP FUNCTION - limpa o interval quando o componente desmonta
    return () => {
      clearInterval(interval);
    };

  }, []);

    return (
      <SafeAreaView style={GlobalStyle.Basic}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['#1E1E2F', '#2A2A3F', '#1E1E2F']}
            style={styles.gradientBackground}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.welcomeTitle}>Welcome to TrackReader!</Text>
              <Text style={styles.welcomeSubtitle}>Your personal and private reading companion</Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <LinearGradient
                colors={['#4B4B6E', '#5A5A7F']}
                style={styles.statCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statIcon}>📚</Text>
                <Text style={styles.statValue}>Track Books</Text>
                {/*<Text style={styles.statLabel}>Manage your library</Text>*/}
              </LinearGradient>

              <LinearGradient
                colors={['#1E1A78', '#2A2A8F']}
                style={styles.statCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statValue}>Time Reading</Text>
                {/*<Text style={styles.statLabel}>Monitor progress</Text>*/}
              </LinearGradient>
            </View>

            {/* Tutorial Section */}
            {showTutorial && (
              <View style={styles.tutorialContainer}>
                <Text style={styles.tutorialTitle}>How to Use TrackReader</Text>
                
                {/* Step 1 */}
                <View style={styles.tutorialStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Add Your First Book</Text>
                    <Text style={styles.stepDescription}>
                      Go to the BookShelf and tap the + button to upload a PDF file from your device.
                    </Text>
                    <View style={styles.stepVisual}>
                      <Text style={styles.visualIcon}>📁</Text>
                      <Text style={styles.visualText}>Upload PDF</Text>
                    </View>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={styles.tutorialStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Start Reading</Text>
                    <Text style={styles.stepDescription}>
                      Tap on any book in your shelf to open it in the reader. It saves the readig time and number of pages read automatically. All locally where only you can acess this data
                    </Text>
                    <View style={styles.stepVisual}>
                      <Text style={styles.visualIcon}>📖</Text>
                      <Text style={styles.visualText}>Read & Zoom</Text>
                    </View>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={styles.tutorialStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Track Progress</Text>
                    <Text style={styles.stepDescription}>
                      View your reading statistics in YourMetrics. See time spent reading and pages completed.All your data is saved locally. It is not shared with anyone or sent to any server
                    </Text>
                    <View style={styles.stepVisual}>
                      <Text style={styles.visualIcon}>📊</Text>
                      <Text style={styles.visualText}>View Stats</Text>
                    </View>
                  </View>
                </View>

                {/* Step 4 */}
                <View style={styles.tutorialStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Build Your Library</Text>
                    <Text style={styles.stepDescription}>
                      Continue adding books to build your personal reading collection. Track multiple books simultaneously.
                    </Text>
                    <View style={styles.stepVisual}>
                      <Text style={styles.visualIcon}>🏗️</Text>
                      <Text style={styles.visualText}>Grow Library</Text>
                    </View>
                  </View>
                </View>

                {/* Hide Tutorial Button */}
                <TouchableOpacity 
                  style={styles.hideTutorialButton}
                  onPress={() => setShowTutorial(false)}
                >
                  <Text style={styles.hideTutorialText}>Got it! Hide tutorial</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Show Tutorial Button (when hidden) */}
            {!showTutorial && (
              <TouchableOpacity 
                style={styles.showTutorialButton}
                onPress={() => setShowTutorial(true)}
              >
                <Text style={styles.showTutorialText}>📚 Show Tutorial</Text>
              </TouchableOpacity>
            )}

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              {/* First Row - Horizontal */}
              <View style={styles.navRow}>
                <TouchableOpacity 
                  style={styles.navButtonHorizontal}
                  onPress={() => router.push('/Shelf')}
                >
                  <LinearGradient
                    colors={['#01337c',"#01337c"]}
                    style={styles.navButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image 
                      source={require('../assets/book_add_green.png')}
                      style={{width: 60, height: 60, marginBottom: 10}}
                     />
                    <Text style={styles.navButtonText}>  BookShelf  </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.navButtonHorizontal}
                  onPress={() => router.push('/YourMetrics')}
                >
                  <LinearGradient
                    colors={['#1E1A78', '#2A2A8F']}
                    style={styles.navButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.navButtonIcon}>📊</Text>
                    <Text style={styles.navButtonText}>  Your Metrics   </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Second Row - Single Button */}
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => Linking.openURL('https://archive.org/details/encyclopaediabritannicagreatbooksofthewesternworld/Encyclop%C3%A6dia%20Britannica%20-%20Great%20Books%20of%20the%20Western%20World%2C%20Volume%201%20-%20The%20Great%20Conversation/')}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45A049']}
                  style={styles.navButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.navButtonIcon}>🌟</Text>
                  <Text style={styles.navButtonText}>Book Recommendation</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Debug Button (Hidden by default) */}
            {/*
            <View style={styles.debugContainer}>
              <Button 
                title="DEBUG: Create Random Data" 
                onPress={(event: GestureResponderEvent) => {DebugDaySkip()}}
                color="#bababa"
              />
            </View>
            */}
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    )
}

 //cria a funcao para adicionat dados ao armazenamento local, sera usada no UploaderScreen
  const SaveBooks = async (value: string) => {
    try{
    //comeca, pegando o valor da lista no armazenamento local como string
    const storageString = await AsyncStorage.getItem("Books_list")

    //transforma o dados locais de string para lista
    const oldList = storageString ? JSON.parse(storageString) : []

    //transforma a variavel input de string em obj
    const objToBeAdded = JSON.parse(value)

    //colocar o valor do input no final da lista que estava armazenada
    oldList.push(objToBeAdded)

    //converte a nova lista de obj para string
    const newlist_str = JSON.stringify(oldList)

    //console.log(newlist_str)

    //salva a nova lista no armazenamento local
    await AsyncStorage.setItem("Books_list",newlist_str)

    } catch (e) {}

  }


const DataHandler = async () => {

    //comeca, pegando o valor da lista no armazenamento local como string
    const UserData_str = await AsyncStorage.getItem("UserData")

    //transforma de String para objeto (str => obj)
    const UserData_useful =  UserData_str ? JSON.parse(UserData_str) : []

    console.log(UserData_useful)


    //esse codigo roda se o valor de UserData estiver vazio
    if (!UserData_useful || UserData_useful?.length == 0) {

      //EraseAllStorage()
  console.log("Creating data for new user")
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

    console.log("Done")
    console.log(UserData_str)
 
    } else{

    //bloco responsavel por lidar com as datas
    const achatempo = new Date(UserData_useful[0].SavedDay)
    //console.log("Ultimo dia salvo " + (achatempo.getTime()))
    const diffTime = Math.abs(CurrentDay.getTime() - achatempo.getTime())
    const diffDays = Math.floor(diffTime / (1000* 60 * 60 * 24 ))

    console.log("Muito foda se passaram " + diffDays + " dias desde a ultima vez")

    if (diffDays >= 1) {

      //as linha de codigo a seguir devem resetar os valores
      console.log("Data reseted because of change of day")

      //comeca, pegando o valor da lista no armazenamento local como string
      const UserData_str = await AsyncStorage.getItem("UserData")

      //transforma de String para objeto (str => obj)
      const UserData_useful =  UserData_str ? JSON.parse(UserData_str) : []

      //responsavel por criar os dados entre hj e o ultimo de q foi logado
      if (diffDays > 1) {
        //const i = diffDays
        console.log("If primeiro ativado")

        for (let i = (diffDays-1) ; i > 0 ; i --) {
          
          const RawDateData = (CurrentDay.getTime() - (1000* 60 * 60 * 24 * i))
          const DayToBeSaved = new Date(RawDateData)

          console.log("Saved on the days " + DayToBeSaved)

          const UserData_debugreset: UserData= {
            SavedDay: DayToBeSaved ,
            TimeRead: 0,
            NumOfPageRead: 0
          }

          UserData_useful.unshift(UserData_debugreset)
        }


      }

      //modelo para o final do dia, represensa o dia de hoje
      const UserData_debugreset: UserData= {
        SavedDay: CurrentDay,
        TimeRead: 0,
        NumOfPageRead: 0
      }

      UserData_useful.unshift(UserData_debugreset)

      console.log(UserData_useful)

      const UserDataList_str = JSON.stringify(UserData_useful)

      await AsyncStorage.setItem("UserData",UserDataList_str)

      }
    }


/*
  //chama o armazenamento local para ver se existe um lista
  const listString = await AsyncStorage.getItem("Books_list")

  //se existe algum dado armazenado ele apresenta no terminal
  if (listString !== null){
    //pega os valores armazenados na lista e coverte de string para apresentar no terminals
    const lista = JSON.parse(listString)
    console.log(lista)
  }*/

}


const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const DebugDaySkip = async () => {

    //console.log("Shit happens bro")
    //comeca, pegando o valor da lista no armazenamento local como string
    const UserData_str = await AsyncStorage.getItem("UserData")

    //console.log("String: " + UserData_str)

    //transforma de String para objeto (str => obj)
    const UserData_useful =  UserData_str ? JSON.parse(UserData_str) : [] as never

    const debugDate = new Date( CurrentDay.getTime() - (1000* 60 * 60 * 24 * 0))
    console.log(debugDate)

    const UserData_debugreset: UserData = {
      SavedDay: debugDate,
      TimeRead: 5000, //getRandomInt(600,10),
      NumOfPageRead: getRandomInt(300,1)
    }

    UserData_useful.unshift(UserData_debugreset)

    //console.log(UserData_useful.length)

    const UserDataList_str = JSON.stringify(UserData_useful)

    await AsyncStorage.setItem("UserData",UserDataList_str)
    
}

export default index
export {SaveBooks}
export {getTodayString}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginTop: 1,
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    width: width * 0.4,
    height: 120,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 40,
    marginBottom: 10,
    color: '#fff',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#ccc',
  },
  tutorialContainer: {
    backgroundColor: '#1E1E2F',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  tutorialStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4B4B6E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  stepVisual: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visualIcon: {
    fontSize: 30,
    marginRight: 10,
    color: '#fff',
  },
  visualText: {
    fontSize: 14,
    color: '#ccc',
  },
  hideTutorialButton: {
    backgroundColor: '#4B4B6E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  hideTutorialText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  showTutorialButton: {
    backgroundColor: '#1E1A78',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  showTutorialText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    gap: 15,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: 'space-around',
    width: width * 0.8,
    marginBottom: 10,
  },
  navButtonHorizontal: {
    width: width * 0.35, // Adjust as needed for horizontal layout
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    width: width * 0.8,
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButtonGradient: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonIcon: {
    fontSize: 30,
    marginBottom: 10,
    color: '#fff',
  },
  navButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  debugContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
});