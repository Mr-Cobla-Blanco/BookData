import { useNavigation } from "@react-navigation/native";
import React from "react";
import type { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Pressable, View,StyleSheet,Text,Image,Button } from "react-native";

type RootStackParamList = {
    Render: undefined;
};

type LibraryScreenNavigationProp = StackNavigationProp<RootStackParamList, "Render">;

const LibraryScreen = () => {
    const navigation = useNavigation<LibraryScreenNavigationProp>();

    return (
        <View style={styles.container}>
            
            <View style={styles.ButtomContainer}>
                <Button
                title="Read me"
                onPress={() => navigation.navigate("Render" as never)}
                />

            </View>
        </View>
    );
};

export default LibraryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24 ,
    },
    ButtomContainer: {
        //width: 40,
        //height: 150,
        alignItems: "center",
        justifyContent: "center",
        padding: 6
    }

});

/*
//#region
                <Pressable onPress={() => navigation.navigate("Render" as never)}
                    style={{width:200 , height: 200}}>
                    <Text>Read me Bro</Text> 
                    <Image
                    //source={require("./assets/splash-icon.png")}
                    style={{width:200 , height: 200}}
                    />
                </Pressable>
                */
//#endregion
