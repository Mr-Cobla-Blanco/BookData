import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { GlobalStyle } from "./_layout"
import {BarChart, barDataItem} from "react-native-gifted-charts"
import  UserData  from "./_layout"
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';


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

    const [dataChart, setDataChart] = useState<ExtractedData[]>([{ value: 0, label: 'Today' }])
    const [adReady, setAdReady] = useState(true);

    const getUserData = async () => {

    const gotUserData_str = await AsyncStorage.getItem("UserData")
        console.log(gotUserData_str)
    const gotUserData_obj = gotUserData_str? JSON.parse(gotUserData_str) : 0

    setUserStreak(gotUserData_obj[0]?.Streak ?? 0)
    setShowUserTimeRead_general(gotUserData_obj[0].TimeRead_General ?? -50)
    console.log("Debug TimerRead_general:"+ ShowUserTimeRead_general)
    setShowUserTimeRead_used(gotUserData_obj[0].TimeRead_Used ?? 0)
    console.log("Debug TimerRead_general:"+ ShowUserTimeRead_general)
    setShowPageRead(gotUserData_obj[0]?.NumOfPageRead ?? 0)
    setWordCount(gotUserData_obj[0]?.NumOfWordRead ?? 0)

    const temp_dataChart: ExtractedData[] = gotUserData_obj.map((item: { NumOfPageRead: number, SavedDay: string }) => {
        const date = new Date(item.SavedDay)
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
        const day = date.getDate()
        const dayLabel = `${weekday}/ ${day}`
        return {
            value: item.NumOfPageRead,
            label: dayLabel
        }
    })
    
    //console.log(temp_dataChart)


    //Eu nao sei como esse codigo funciona, to baaad!!!
    setDataChart(temp_dataChart)

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
                colors={['#1E1E2F', '#2A2A3F', '#1E1E2F']}
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
                        colors={['#4B4B6E', '#5A5A7F']}
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
                        colors={['#4B4B6E', '#5A5A7F']}
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
                        colors={['#1E1A78', '#2A2A8F']}
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
                        colors={['#4B4B6E', '#5A5A7F']}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.additionalMetricTitle}>WPM (WordsPerMinute)</Text>
                        <Text style={styles.additionalMetricValue}>🔥 {Math.floor(ShowUserWordCount/formatTimeMinutes(ShowUserTimeRead_used))}</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#4B4B6E', '#5A5A7F']}
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
                        colors={['#2A2A3F', '#3A3A4F']}
                        style={styles.chartCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Reading Progress</Text>
                            <Text style={styles.chartSubtitle}>Pages read over time</Text>
                        </View>
                        
                        <View style={styles.chartWrapper}>
                            <BarChart
                                data={dataChart}
                                frontColor="#bababa"
                                gradientColor="#1E1A78"
                                showGradient
                                barWidth={22}
                                spacing={24}
                                hideRules={false}
                                rulesColor="#FFFFFF"
                                rulesType="solid"
                                xAxisColor="#4B4B6E"
                                yAxisColor="#4B4B6E"
                                yAxisTextStyle={{ color: '#bababa', fontSize: 12 }}
                                xAxisLabelTextStyle={{ color: '#bababa', fontSize: 12 }}
                                noOfSections={4}
                                maxValue={Math.max(...dataChart.map(item => item.value || 0), 10)}
                                width={getResponsiveSize(340)}
                                height={getResponsiveSize(250)}
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
        backgroundColor: '#1E1E2F',
    },
    gradientBackground: {
        flex: 1,
        paddingTop: getResponsivePadding(20),
        paddingBottom: getResponsivePadding(40),
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: getResponsiveMargin(30),
        paddingHorizontal: getResponsivePadding(20),
    },
    headerTitle: {
        fontSize: getResponsiveFontSize(28),
        fontWeight: 'bold',
        color: '#F0F0F0',
        marginBottom: getResponsiveMargin(8),
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: getResponsiveFontSize(18),
        color: '#bababa',
        textAlign: 'center',
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: getResponsivePadding(20),
        marginBottom: getResponsiveMargin(30),
    },
    statCard: {
        width: (width - 50) / 2,
        padding: getResponsivePadding(20),
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
        width: getResponsiveSize(60),
        height: getResponsiveSize(60),
        borderRadius: getResponsiveSize(30),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: getResponsiveMargin(12),
    },
    statIcon: {
        fontSize: getResponsiveFontSize(32),
    },
    statValue: {
        fontSize: getResponsiveFontSize(28),
        fontWeight: 'bold',
        color: '#F0F0F0',
        marginBottom: getResponsiveMargin(4),
    },
    statLabel: {
        fontSize: getResponsiveFontSize(22),
        color: '#dbdbdbff',
        textAlign: 'center',
        opacity: 0.9,
    },
    chartContainer: {
        paddingHorizontal: getResponsivePadding(20),
        marginBottom: getResponsiveMargin(30),
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
        marginBottom: getResponsiveMargin(20),
    },
    chartTitle: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: 'bold',
        color: '#F0F0F0',
        marginBottom: getResponsiveMargin(4),
    },
    chartSubtitle: {
        fontSize: getResponsiveFontSize(14),
        color: '#bababa',
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
        marginBottom: getResponsiveMargin(30),
    },
    additionalMetricCard: {
        width: (width - 50) / 2,
        padding: getResponsivePadding(14),
        borderRadius: getResponsiveSize(12),
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
        color: '#bababa',
        marginBottom: getResponsiveMargin(8),
        textAlign: 'center',
        opacity: 0.9,
    },
    additionalMetricValue: {
        fontSize: getResponsiveFontSize(28),
        fontWeight: '600',
        color: '#F0F0F0',
        textAlign: 'center',
    },
})