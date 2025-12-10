import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import React, { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useCallback, useDebugValue, useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, ScrollView, Dimensions, LogBox} from "react-native"
import Animated, { useSharedValue, useAnimatedProps, Easing, withTiming, runOnJS, useDerivedValue } from 'react-native-reanimated';
import { LinearGradient } from "expo-linear-gradient"
import {BarChart, LineChart} from "react-native-gifted-charts"
import { BannerAd, BannerAdSize, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import { ColorScheme } from "./_layout"

LogBox.ignoreLogs(['[Reanimated]'])

interface ExtractedData {
    value: number;
    label: string;
}

//Coisa de ADS
const adUnitid = TestIds.BANNER // "ca-app-pub-xxxxx/xxxx"
//ca-app-pub-8166650997061733~5453313944
//ca-app-pub-8166650997061733/1356623353

function formatTime(totalSeconds: number) {
    'worklet'
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

    const [ShowUserTimeRead_used, setShowUserTimeRead_used] = useState(0)
    const [ShowUserStreak, setUserStreak] = useState(0)

    //Fazer versão animada Tempo total lido----------------------------------------------------------------------
    const [ShowUserTimeRead_general, setShowUserTimeRead_general] = useState(0)

    const ShowAnimated_TimeRead_general = useSharedValue(0)

    const [displayValue_TimeRead_general, setDisplayValue_TimeRead_general] = React.useState('00:00:00')
    useDerivedValue(() => {
        const formattedTime = formatTime(Math.round(ShowAnimated_TimeRead_general.value))
        runOnJS(setDisplayValue_TimeRead_general)(formattedTime)
    })


    //Versão animada do PagesRead--------------------------------------------------------------------------------
    const [ShowPageRead, setShowPageRead] = useState(0)
    
    const ShowAnimated_PageRead = useSharedValue(0)

    const [displayValue_PageRead, setDisplayValue_PageRead] = React.useState(0)
    useDerivedValue(() => {runOnJS(setDisplayValue_PageRead)(Math.round(ShowAnimated_PageRead.value))})


    //Versão animada do WordCount---------------------------------------------------------------------------------
    const [ShowUserWordCount, setWordCount] = useState(0)
    const ShowAnimated_WordCount = useSharedValue(0);
    //Por razões internas é preciso de 2 variaveis para renderizar um valor em mudança
    const [displayValue_WordCount, setDisplayValue_WordCount] = React.useState(0)
    useDerivedValue(() => {runOnJS(setDisplayValue_WordCount)(Math.round(ShowAnimated_WordCount.value))})


    //Parte que lida com variaveis do grafico--------------------------------------------------------------------
    const [dataChartNPages, setDataChartNPages] = useState<ExtractedData[]>([{ value: 0, label: 'Today' }])
    
    const [dataChartNWords, setDataChartNWords] = useState<ExtractedData[]>([{ value: 0, label: 'Today' }])
    const [adReady, setAdReady] = useState(true);


    const getUserData = async () => {

        const gotUserData_str = await AsyncStorage.getItem("UserData")
        //console.log(gotUserData_str)

        const gotUserData_obj = gotUserData_str? JSON.parse(gotUserData_str) : 0

        setUserStreak(gotUserData_obj[0]?.Streak ?? 0)

        setShowUserTimeRead_general(gotUserData_obj[0].TimeRead_General ?? -50)
        //console.log("Debug TimerRead_general:"+ gotUserData_obj[0].TimeRead_General)

        setShowUserTimeRead_used(gotUserData_obj[0].TimeRead_Used ?? 0)
        //console.log("Debug TimerRead_used:"+ gotUserData_obj[0].TimeRead_Used)

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

    }

    useFocusEffect(

         useCallback(() => {

        //dataChart = getUserData()
        //console.log("Chart data inside callBack: "+ dataChart)

        //essa é a copia de uma das linhas de codigo mais feias da minha vida, mas o q importa e q ta funcionado
        const interval = setInterval(() => {
        getUserData()
        clearInterval(interval)
          }, 300);

         },[])
    )

    //This makes the animation act without a loop
    useEffect(() => {

        ShowAnimated_WordCount.value = withTiming(ShowUserWordCount ,{duration: 2500, easing:Easing.out(Easing.exp)} )
        ShowAnimated_TimeRead_general.value = withTiming(ShowUserTimeRead_general ,{duration: 2500, easing:Easing.out(Easing.exp)} )
        ShowAnimated_PageRead.value = withTiming(ShowPageRead ,{duration: 2500, easing:Easing.out(Easing.exp)} )
  

    }, [ShowUserWordCount])


    /*
    const formatTime = (secons: number) => {
        if (secons < 60) return `${secons}s`
        if (secons < 3600) {
        const minutes = Math.floor(secons / 60)
        const remainingsecons = secons % 60
        return remainingsecons > 0 ? `${minutes}m ${remainingsecons}s` : `${minutes}m`}
        const hours = Math.floor(secons / 3600)
        const remainingminutes = secons % 60
        return remainingminutes > 0 ? `${hours}h ${remainingminutes}m` : `${hours}h`
    }*/

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

            {/*
            <BannerAd
            unitId={adUnitid}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} //ANCHORED_ADAPTIVE_BANNER
            />
            */}

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
                        <Text style={styles.statValue}>{displayValue_TimeRead_general}</Text>
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
                        <Text style={styles.statValue}>{displayValue_PageRead}</Text>
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
                        <Text style={styles.additionalMetricValue}>🔥 {Math.floor(displayValue_WordCount/formatTimeMinutes(ShowUserTimeRead_used))| 0}</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={[ColorScheme.primary, ColorScheme.secondery]}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.additionalMetricTitle}>📖 Words read today</Text>
                        <Text style={styles.additionalMetricValue}>{displayValue_WordCount}</Text>
                        <Text style={styles.statLabel}>Words read</Text>
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
                        {/* <Text style={styles.chartTitle}>↑ {dataChartNPages[1].value !== undefined && (dataChartNPages[0].value/dataChartNPages[1].value *100)}%  </Text> */}
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
                                    
                                    pointerLabelComponent: (dataChartNPages: { label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }[]) => {
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
                      {'Pages: '+ dataChartNPages[0].value}
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

                                    pointerLabelComponent: (dataChartNWords: { value: string }[]) => {
                                        
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

                {/*
                <View style={{bottom: getResponsivePadding(5),alignSelf:"center"}}>
                <BannerAd
                unitId={TestIds.BANNER}
                size={BannerAdSize.BANNER}
                />
                </View>
                */}

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
        opacity: 0.95,
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