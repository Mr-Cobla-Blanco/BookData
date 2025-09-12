import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { GlobalStyle } from "./_layout"
import {BarChart, barDataItem} from "react-native-gifted-charts"
import  UserData  from "./_layout"

interface ExtractedData {
    value: number;
    label: string;
}

const { width } = Dimensions.get('window');

const YourMetrics = () => {
    const [ShowUserTimeRead, setShowUserTimeRead] = useState(0)
    const [ShowPageRead, setShowPageRead] = useState(0)
    const [dataChart, setDataChart] = useState<ExtractedData[]>([{ value: 0, label: 'Today' }])

    const getUserData = async () => {

    const gotUserData_str = await AsyncStorage.getItem("UserData")

    const gotUserData_obj = gotUserData_str? JSON.parse(gotUserData_str) : 0

    setShowUserTimeRead(gotUserData_obj[0]?.TimeRead ?? 0)

    setShowPageRead(gotUserData_obj[0]?.NumOfPageRead ?? 0)

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

        //dataChart = getUserData()
        //console.log("Chart data inside callBack: "+ dataChart)

        //essa é a copia de uma das linhas de codigo mais feias da minha vida, mas o q importa e q ta funcionado
        const interval = setInterval(() => {
        getUserData()
        clearInterval(interval)
          }, 100);

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
                        <Text style={styles.statValue}>{formatTime(ShowUserTimeRead)}</Text>
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
                                width={width - 80}
                                height={200}
                            />
                        </View>
                    </LinearGradient>
                </View>

                {/* Additional Metrics */}
                {/*
                <View style={styles.additionalMetricsContainer}>
                    <LinearGradient
                        colors={['#4B4B6E', '#5A5A7F']}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.additionalMetricTitle}>Reading Streak</Text>
                        <Text style={styles.additionalMetricValue}>🔥 7 days</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#1E1A78', '#2A2A8F']}
                        style={styles.additionalMetricCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.additionalMetricTitle}>Average Speed</Text>
                        <Text style={styles.additionalMetricValue}>📖 2.5 min/page</Text>
                    </LinearGradient>
                </View>
                */}
            </LinearGradient>
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
        paddingTop: 20,
        paddingBottom: 40,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F0F0F0',
        marginBottom: 8,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#bababa',
        textAlign: 'center',
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    statCard: {
        width: (width - 50) / 2,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    statIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statIcon: {
        fontSize: 24,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F0F0F0',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#bababa',
        textAlign: 'center',
        opacity: 0.9,
    },
    chartContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    chartCard: {
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    chartHeader: {
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F0F0F0',
        marginBottom: 4,
    },
    chartSubtitle: {
        fontSize: 14,
        color: '#bababa',
        opacity: 0.8,
    },
    chartWrapper: {
        alignItems: 'center',
        paddingVertical: 10,
        overflow: 'hidden',
        width: '100%',
    },
    additionalMetricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    additionalMetricCard: {
        width: (width - 50) / 2,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    additionalMetricTitle: {
        fontSize: 14,
        color: '#bababa',
        marginBottom: 8,
        textAlign: 'center',
        opacity: 0.9,
    },
    additionalMetricValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F0F0F0',
        textAlign: 'center',
    },
})