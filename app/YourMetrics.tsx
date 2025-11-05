import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { GlobalStyle } from "./_layout"
import {BarChart, barDataItem, LineChart} from "react-native-gifted-charts"
import  UserData  from "./_layout"
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
//#region ColorSchemes

/*Original
const ColorScheme = {
    text: "#F0F0F0",
    subtext: "#bababa",
    primary: "#40407aff" ,
    secondery: "#262658ff",
    accent: "#1E1A78",
    background: "#1E1E2F"
}*/

/*Enchanted Quill
const ColorScheme = {
    text: "#F2E1D4",
    subtext: "#D9C6B2",
    primary: "#4B3D6F" ,
    secondery: "#4B3D6F",
    accent: "#A67C9D",
    background: "#1C1C2D"
}*/

/*Midnight Studies (8/10) Lack good accent
const ColorScheme = {
    text: "#F7F2F7",
    subtext: "#D6C9E0",
    primary: "#5B4B8A",
    secondery: "#5B4B8A",
    accent: "#D6C9E0",
    background: "#2E2A31"
}*/
 
//There is an ocean vibe to it (9/10)
/*
const ColorScheme = {
    text: "#F9F3EF",
    subtext: "#D2C1B6",
    primary: "#456882",
    secondery: "#456882",
    accent: "#F9F3EF",
    background: "#1B3C53"
}*/
//Made myself
/*
const ColorScheme = {
    text: "#33AB58",
    subtext: "#5bc97c",//"#33AB58",
    primary:  "#34207A",
    secondery: "#34207A",//"#356696",
    accent: "#16aa43ff",
    background: "#08021D"
}*/

//Gostei bastante desse ()
/*Estou Usando esse
const ColorScheme = {
    text: "#14d19fff",
    subtext: "#88ffdfff",//"#F0F3FF",
    primary:  "#211951",
    secondery: "#211951",//"#356696",
    accent: "#17dfa9ff",
    background:"#000429ff"//"#836FFF"
}*/
import { ColorScheme } from "./_layout"


//#endregion


// Step 1: Create the ad (outside component so it persists)
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

interface ExtractedData {
    value: number;
    label: string;
}

const { width , height } = Dimensions.get('window');

// Responsive sizing utilities based on screen dimensions
// Base screen dimensions: 900x1900 (increased from 720x1520) 1080x1920 540x960
const BASE_WIDTH = 540;
const BASE_HEIGHT = 960;

const getResponsiveSize = (size: number, type: 'width' | 'height' = 'width') => {
  const baseSize = type === 'width' ? BASE_WIDTH : BASE_HEIGHT;
  const currentSize = type === 'width' ? width : height;
  return (size * currentSize) / baseSize;
};

const getResponsiveFontSize = (fontSize: number) => {
  return getResponsiveSize(fontSize, 'width');
};

const getResponsivePadding = (padding: number) => {
  return getResponsiveSize(padding, 'width');
};

const getResponsiveMargin = (margin: number) => {
  return getResponsiveSize(margin, 'width');
};

const YourMetrics = () => {

    const [ShowUserTimeRead_general, setShowUserTimeRead_general] = useState(0)
    const [ShowUserTimeRead_used, setShowUserTimeRead_used] = useState(0)
    const [ShowPageRead, setShowPageRead] = useState(0)
    const [ShowUserStreak, setUserStreak] = useState(0)
    const [ShowUserWordCount, setWordCount] = useState(0)

    const [dataChartNPages, setDataChartNPages] = useState<ExtractedData[]>([{ value: 0, label: 'Today' }])
    const [dataChartNWords, setDataChartNWords] = useState<ExtractedData[]>([{ value: 0, label: 'Today' }])
    const [adReady, setAdReady] = useState(true);

    const getUserData = async () => {

    const gotUserData_str = await AsyncStorage.getItem("UserData")
        console.log(gotUserData_str)
    const gotUserData_obj = gotUserData_str? JSON.parse(gotUserData_str) : 0

    setUserStreak(gotUserData_obj[0]?.Streak ?? 0)

    setShowUserTimeRead_general(gotUserData_obj[0].TimeRead_General ?? -50)
    console.log("Debug TimerRead_general:"+ gotUserData_obj[0].TimeRead_General)

    setShowUserTimeRead_used(gotUserData_obj[0].TimeRead_Used ?? 0)
    console.log("Debug TimerRead_used:"+ gotUserData_obj[0].TimeRead_Used)

    setShowPageRead(gotUserData_obj[0]?.NumOfPageRead ?? 0)
    
    setWordCount(gotUserData_obj[0]?.NumOfWordRead ?? 0)

    const temp_dataChartNPages: ExtractedData[] = gotUserData_obj.map((item: { NumOfPageRead: number, SavedDay: string }) => {
        const date = new Date(item.SavedDay)
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
        const day = date.getDate()
        const dayLabel = `${weekday}/ ${day}`
        return {
            value: item.NumOfPageRead,
            label: dayLabel
        }
    })

    //Eu nao sei como esse codigo funciona, to baaad!!!
    setDataChartNPages(temp_dataChartNPages)

    const temp_dataChartNWords: ExtractedData[] = gotUserData_obj.map((item: { NumOfWordRead: number, SavedDay: string }) => {
        const date = new Date(item.SavedDay)
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
        const day = date.getDate()
        const dayLabel = `${weekday}/ ${day}`
        return {
            value: item.NumOfWordRead,
            label: dayLabel
        }
    })
    
    //Eu nao sei como esse codigo funciona, to baaad!!!
    setDataChartNWords(temp_dataChartNWords)
    //const TestData =

    //return {temp_dataChart}

    //const temp_dataChart = Object.values(gotUserData_obj).map((UserData: { NumOfPageRead: any }) => UserData.NumOfPageRead)
    //console.log("Valor da temp: "+ typeof(temp_dataChart))
    //dataChart.current = [1 , 5 ,6 ,8]
    //setDataChart(temp_dataChart)

    }

    useFocusEffect(

         useCallback(() => {

    //essa funcao acontece quando percebe que o Add esta pronto
    // Step 2: Listen for when ad finishes loading
    const loadListener = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        //aqui esta o codigo q vai rodar quando o Ad estiver pronto
        console.log('✅ Ad loaded and ready!');
              console.log('📺 Showing ad now! first');
              interstitial.show()
              
              return (
                <View style={{width:width, height:height , backgroundColor: "#fff"}}>
                </View> )
    
      }
    );

    // Step 3: Listen for when user closes the ad
    const closeListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('👋 User closed the ad');
        setAdReady(false);
        // Load a new ad for next time
        //interstitial.load(); //making sure it only runs once
      }
    );

    //essa e a parte importante,cria o setup para mostrar o AD

    if (interstitial.loaded && adReady == true) {
        console.log('📺 Showing ad now! 2');
        interstitial.show()
        setAdReady(false)    
    }else {    
    console.log('⏳ Loading ad...');
    //interstitial.load();
}

        //dataChart = getUserData()
        //console.log("Chart data inside callBack: "+ dataChart)

        //essa é a copia de uma das linhas de codigo mais feias da minha vida, mas o q importa e q ta funcionado
        const interval = setInterval(() => {
        getUserData()
        clearInterval(interval)
          }, 100);

    // Cleanup when component unmounts
    return () => {
      loadListener();
      closeListener();
    };

         },[])
    )

    const formatTime = (secons: number) => {
        if (secons < 60) return `${secons}s`
        if (secons < 3600) {
        const minutes = Math.floor(secons / 60)
        const remainingsecons = secons % 60
        return remainingsecons > 0 ? `${minutes}m ${remainingsecons}s` : `${minutes}m`}
        const hours = Math.floor(secons / 3600)
        const remainingminutes = secons % 60
        return remainingminutes > 0 ? `${hours}h ${remainingminutes}m` : `${hours}h`
    }

    const formatTimeMinutes = (seconds: number) =>{
        /*
        if (seconds < 60) return `${seconds%60}s`
        if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        const remainingsecons = seconds % 60
        return remainingsecons > 0 ? `${minutes}m ${remainingsecons}s` : `${minutes}m`
        }
        */
       return (seconds/60)
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={[ColorScheme.background, ColorScheme.background]}
                style={styles.gradientBackground}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.headerTitle}>Your Reading Metrics</Text>
                    <Text style={styles.headerSubtitle}>Track your progress and achievements</Text>
                </View>

                {/* Day Streak Section*/}
                <View style={styles.StreakMetric}>
                   <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.secondery]}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    > 
                        <Text style={styles.additionalMetricTitle}>Reading Streak</Text>
                        <Text style={styles.additionalMetricValue}>🔥 {ShowUserStreak} days</Text>
                    </LinearGradient>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsContainer}>
                    {/* Time Read Card */}
                    <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.secondery]}
                        style={styles.statCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.statIconContainer}>
                            <Text style={styles.statIcon}>⏱️</Text>
                        </View>
                        <Text style={styles.statValue}>{formatTime(ShowUserTimeRead_general)}</Text>
                        <Text style={styles.statLabel}>Total Time Read</Text>
                    </LinearGradient>

                    {/* Pages Read Card */}
                    <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.secondery]}
                        style={styles.statCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.statIconContainer}>
                            <Text style={styles.statIcon}>📚</Text>
                        </View>
                        <Text style={styles.statValue}>{ShowPageRead}</Text>
                        <Text style={styles.statLabel}>Pages Read Today</Text>
                    </LinearGradient>
                </View>

                                {/* Additional Metrics */}
                
                <View style={styles.additionalMetricsContainer}>
                    <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.secondery]}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.additionalMetricTitle}>WPM (WordsPerMinute)</Text>
                        <Text style={styles.additionalMetricValue}>🔥 {Math.floor(ShowUserWordCount/formatTimeMinutes(ShowUserTimeRead_used))| 0}</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.secondery]}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.additionalMetricTitle}>Number of words read</Text>
                        <Text style={styles.additionalMetricValue}>📖 {ShowUserWordCount} Words</Text>
                    </LinearGradient>

                {/*    
                    <LinearGradient
                        colors={['#1E1A78', '#2A2A8F']}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.additionalMetricTitle}>Average Speed</Text>
                        <Text style={styles.additionalMetricValue}>📖 2.5 min/page</Text>
                    </LinearGradient>
                */}
                </View>
                
            </LinearGradient>

                {/* Chart Section */}
                <View style={styles.chartContainer}>
                    <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.primary]}
                        style={styles.chartCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Reading Progress</Text>
                            <Text style={styles.chartSubtitle}>Pages read over time</Text>
                        </View>
                        
                        <View style={styles.chartWrapper}>
                            
                            {/*
                            <BarChart
                                data={dataChartNPages}
                                frontColor= {ColorScheme.accent}
                                gradientColor={ColorScheme.subtext}
                                showGradient
                                barWidth={22}
                                spacing={24}
                                hideRules={false}
                                rulesColor={ColorScheme.text}
                                rulesType="solid"
                                xAxisColor={ColorScheme.text}
                                yAxisColor={ColorScheme.text}
                                yAxisTextStyle={{ color: ColorScheme.subtext, fontSize: 12 }}
                                xAxisLabelTextStyle={{ color: ColorScheme.subtext, fontSize: 12 }}
                                noOfSections={4}
                                maxValue={Math.max(...dataChartNPages.map(item => item.value || 0), 10)}
                                width={getResponsiveSize(340)}
                                height={getResponsiveSize(250)}
                            />*/}

                            <LineChart
                                areaChart
                                data={dataChartNPages}
                                //hideDataPoints
                                dataPointsColor1={ColorScheme.subtext}
                                //AREA of XLines
                                //hideRules
                                rulesColor={ColorScheme.subtext}
                                rulesType="solid"
                                //AREA of animation
                                //isAnimated
                                //animationDuration={2000}
                                //AREA of area color
                                startFillColor={ColorScheme.accent}
                                endFillColor1={ColorScheme.background}
                                startOpacity={1}
                                endOpacity={0.3}
                                //Area of spaceing
                                initialSpacing={getResponsiveSize(50)}
                                spacing={getResponsiveSize(90)}                    
                                thickness={3} //Lida com a grossura da linha
                                //hideYAxisText
                                //Area of the Yaxis
                                //stepValue={5}
                                noOfSections={5}
                                yAxisColor="#0BA5A4"
                                yAxisTextStyle={{ color: ColorScheme.subtext, fontSize: 12 }}
                                xAxisLabelTextStyle={{ color: ColorScheme.subtext, fontSize: 12 }}
                                //showVerticalLines
                                //verticalLinesColor={ColorScheme.primary}
                                xAxisColor="#0BA5A4"
                                color={ColorScheme.accent}
                                width={getResponsiveSize(370)}
                                height={getResponsiveSize(250)}
                                //AREA of Pointer

                                pointerConfig={{
                                    pointerStripHeight: 160,
                                    pointerStripColor: ColorScheme.accent,
                                    pointerStripWidth:3,
                                    pointerColor: ColorScheme.text,
                                    radius:6,
                                    activatePointersOnLongPress: true,
                                    activatePointersDelay:50,
                                    autoAdjustPointerLabelPosition:false,
                                    
                                    pointerLabelComponent: dataChartNPages => {
              return (
                <View
                  style={{
                    height: 120,
                    width: 100,
                    justifyContent: 'center',
                    marginTop: -40,
                    marginLeft: -40,
                  }}>
                    <View style={{paddingHorizontal:7,paddingVertical:2, borderRadius:4, backgroundColor:ColorScheme.background}}>

                    <Text style={{fontWeight: 'bold',textAlign:'center',color:ColorScheme.subtext}}>
                      {'Pages: '+ dataChartNPages[0].value }
                    </Text>
                    
                  <Text style={{color: ColorScheme.text, fontSize: 14, marginBottom:1,textAlign:'center'}}>
                    {dataChartNPages[0].label}
                  </Text>

                  </View>
                  
                  {/*
                  <View style={{paddingHorizontal:7,paddingVertical:2, borderRadius:4, backgroundColor:ColorScheme.primary}}>
                    <Text style={{fontWeight: 'bold',textAlign:'center',color:ColorScheme.subtext}}>
                      {'Pages: '+ dataChartNPages[0].value }
                    </Text>
                  </View>
                 */}

                </View>
              );
              },
                                
                                }}
                                
                            />                 

                        </View>
                    </LinearGradient>
                </View>

                {/*Second Chart area*/}
                <View style={styles.chartContainer}>
                    <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.primary]}
                        style={styles.chartCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Word count</Text>
                            <Text style={styles.chartSubtitle}>Number of words read</Text>
                        </View>
                        
                        <View style={styles.chartWrapper}>
                            <BarChart
                                data={dataChartNWords}
                                frontColor={ColorScheme.accent}
                                //gradientColor="#1E1A78"
                                //showGradient
                                barWidth={22}
                                spacing={24}
                                hideRules={false}
                                rulesColor={ColorScheme.text}
                                rulesType="solid"
                                xAxisColor={ColorScheme.text}
                                yAxisColor={ColorScheme.text}
                                yAxisTextStyle={{ color: ColorScheme.subtext, fontSize: 12 }}
                                xAxisLabelTextStyle={{ color: ColorScheme.subtext, fontSize: 12 }}
                                noOfSections={5}
                                maxValue={Math.max(...dataChartNWords.map(item => item.value || 0), 10)}
                                width={getResponsiveSize(340)}
                                height={getResponsiveSize(250)}
                                pointerConfig={{

                                    pointerStripHeight: getResponsivePadding(250),
                                    pointerStripColor: ColorScheme.accent,
                                    pointerStripWidth:0,
                                    pointerColor: ColorScheme.text,
                                    radius:0,
                                    activatePointersOnLongPress: true,
                                    activatePointersDelay:50,
                                    autoAdjustPointerLabelPosition:false,

                                    pointerLabelComponent: dataChartNWords => {
                                        
              return (
                <View
                  style={{
                    height: getResponsiveSize(100),
                    width: getResponsiveSize(80),
                    justifyContent: 'center',
                    marginTop: -10,
                    marginLeft: -20,
                  }}>
                    <View style={{borderRadius:4, backgroundColor:ColorScheme.background}}>

                    <Text style={{fontWeight: 'bold',textAlign:'center',color:ColorScheme.subtext}}>
                      {'Words: '+ dataChartNWords[0].value }
                    </Text>

                  </View>
                  
                  {/*
                  <View style={{paddingHorizontal:7,paddingVertical:2, borderRadius:4, backgroundColor:ColorScheme.primary}}>
                    <Text style={{fontWeight: 'bold',textAlign:'center',color:ColorScheme.subtext}}>
                      {'Pages: '+ dataChartNPages[0].value }
                    </Text>
                  </View>
                 */}

                </View>
              );

                                    }


                                }}  
                            />
                        </View>
                    </LinearGradient>
                </View>

                <View style={{height: getResponsiveSize(100)}}></View>    
        </ScrollView>
    )
}


export default YourMetrics

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorScheme.background,
    },
    gradientBackground: {
        flex: 1,
        paddingTop: getResponsivePadding(20),
        paddingBottom: getResponsivePadding(40),
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: getResponsiveMargin(20),
        paddingHorizontal: getResponsivePadding(20),
    },
    headerTitle: {
        fontSize: getResponsiveFontSize(28),
        fontWeight: 'bold',
        color: ColorScheme.text,
        marginBottom: getResponsiveMargin(8),
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: getResponsiveFontSize(20),
        color: ColorScheme.subtext,
        textAlign: 'center',
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: getResponsivePadding(20),
        marginBottom: getResponsiveMargin(15),
    },
    statCard: {
        width: (width - 50) / 2,
        padding: getResponsivePadding(10),
        borderRadius: getResponsiveSize(16),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: getResponsiveSize(8),
        },
        shadowOpacity: 0.3,
        shadowRadius: getResponsiveSize(16),
        elevation: 8,
    },
    statIconContainer: {
        width: getResponsiveSize(50),
        height: getResponsiveSize(50),
        borderRadius: getResponsiveSize(30),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: getResponsiveMargin(6),
    },
    statIcon: {
        fontSize: getResponsiveFontSize(32),
    },
    statValue: {
        fontSize: getResponsiveFontSize(28),
        fontWeight: 'bold',
        color: ColorScheme.text,
        marginBottom: getResponsiveMargin(4),
    },
    statLabel: {
        fontSize: getResponsiveFontSize(22),
        color: ColorScheme.text,
        textAlign: 'center',
        opacity: 0.9,
    },
    chartContainer: {
        marginTop: getResponsiveMargin(-20),
        paddingHorizontal: getResponsivePadding(20),
        marginBottom: getResponsiveMargin(40),
    },
    chartCard: {
        borderRadius: getResponsiveSize(16),
        padding: getResponsivePadding(20),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: getResponsiveSize(8),
        },
        shadowOpacity: 0.3,
        shadowRadius: getResponsiveSize(16),
        elevation: 8,
    },
    chartHeader: {
        marginBottom: getResponsiveMargin(10),
    },
    chartTitle: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        color: ColorScheme.text,
        marginBottom: getResponsiveMargin(4),
    },
    chartSubtitle: {
        fontSize: getResponsiveFontSize(16),
        color: ColorScheme.subtext,
        opacity: 0.8,
    },
    chartWrapper: {
        alignItems: 'center',
        paddingVertical: getResponsivePadding(10),
        overflow: 'hidden',
        width: '100%',
    },
    additionalMetricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: getResponsivePadding(20),
    },
    StreakMetric: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: getResponsivePadding(20),
        marginBottom: getResponsiveMargin(10),
    },
    additionalMetricCard: {
        width: (width - 50) / 2,
        padding: getResponsivePadding(10),
        borderRadius: getResponsiveSize(8),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: getResponsiveSize(4),
        },
        shadowOpacity: 0.2,
        shadowRadius: getResponsiveSize(8),
        elevation: 4,
    },
    additionalMetricTitle: {
        fontSize: getResponsiveFontSize(20),
        color: ColorScheme.subtext,
        marginBottom: getResponsiveMargin(4),
        textAlign: 'center',
        opacity: 0.9,
    },
    additionalMetricValue: {
        fontSize: getResponsiveFontSize(28),
        fontWeight: '600',
        color: ColorScheme.text,
        textAlign: 'center',
    },
})