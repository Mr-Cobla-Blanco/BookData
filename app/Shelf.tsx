import {useNavigation} from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList,View, StyleSheet, Text, Image, Alert, Button, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useRouter } from "expo-router";
import { Books_list_model, ColorScheme } from "./_layout";
import {pickDoc} from "./Uploader"
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from "react-native-gesture-handler";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

//import addNewBook from "./Uploader"

const { width, height } = Dimensions.get('window');

//ADS id desse local 
const Id_for_ADs = TestIds.BANNER//"ca-app-pub-8166650997061733/2035280201" //TestIds.BANNER
//ca-app-pub-8166650997061733~5453313944
//ca-app-pub-8166650997061733/2035280201

// Responsive sizing utilities based on screen dimensions
// Base screen dimensions: 900x1900 (increased from 720x1520) 540x960
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

//funcao responsavel por toda tela de biblioteca
const ShelfScreen = () => {

    //a variavel Shelf sera usada para segurar os dados armazenados para usar no return
    const [shelf , setShelf] = useState<Books_list_model[]>([])
    const [isFocused, setFocused] = useState(false)
    //const [coverUri, setCoverUri] = useState<string | undefined>(undefined)
    const navigation = useNavigation()
    let MaxPage = 100

    //Função para quando o usuario selecionar um livro
    const openBook = async ( objBook: Books_list_model) => {

        //prepara o objeto "livro" para ser armazenado para ser acessado no render
        const ObjBook_str = JSON.stringify(objBook) 

        //console.log(ObjBook_str)

        //armazena o objeto "livro" para ser acessado no render
        await AsyncStorage.setItem('SelectedBook',ObjBook_str)

        navigation.navigate("Render" as never)
    }

    //funcao para pegar os dados de todos os livros armazenados no sistema e colocar na variavel loca Shelf
    const getData = async () => {

    try {

    //comeca, pegando o valor da lista no armazenamento local como string
    const storageString = await AsyncStorage.getItem("Books_list")

    //transforma o dados locais de string para lista, caso nao tenha retorna uma lista vazia
    const oldList = storageString ? JSON.parse(storageString) : []

    setShelf(oldList)

    //console.log("BooksData: "+storageString)
    //muda o valor de shelf
    //setShelf(oldList)

    } catch (e) {
        console.log("Erro em coletar dados na biblioteca")
        console.log(e)
    }

    } 

  //roda a funcao que coleta os dados do armazenamento local toda vez que abre essa tela 
    useFocusEffect(
        useCallback(() => {

        getData();

        //essa é uma das linhas de codigo mais feias da minha vida, mas o q importa e q ta funcionado
        const interval = setInterval(() => {
        getData()
        clearInterval(interval)
          }, 100);

        },[])

    )

    const AddAlert = () => {

        Alert.alert(
                    "Add a Book",
                    "Choose a type of book to add",
                    [
                    { text: "Fisico", onPress: () => AdicionarLivrosFisicos()},
                    { text: "Ebook", onPress: () => customPickDoc() },
                    //{ text: "Cancel"}
                     ],
                    { cancelable: true }
                )
    }

    //Funcao usada para adicionar Livros
    const AdicionarLivrosFisicos = () => {
        router.push('../FisicoRender')
    }

    //Funcao usada para adicionar Ebooks
    const customPickDoc = () => {

        pickDoc()
    
        const interval = setInterval(() => {
        getData()
        clearInterval(interval)
          }, 300);

    }

    const formatBookName = (name: string) => {
        if (name.length > 20) {
            return name.substring(0, 20) + '...';
        }
        if (name.endsWith(".epub")){
            return name.replace(".epub","")
        }

        return name;
    }

    const DeleteDecison = async (objBook: Books_list_model) => {


        const DeleteBook = async (objBook: Books_list_model) => {
        const newlist = shelf.filter(shelf => shelf.name !== objBook.name)

        //Usado para atualizar UI
        setShelf(newlist)

        //Usado para atualizar na memoria
        const newlist_str = JSON.stringify(newlist)
        await AsyncStorage.setItem("Books_list",newlist_str)
        }

                await new Promise((resolve) => {
                      Alert.alert(
                  "Delete Decision",  // Título
                  `Do you want to delete ${objBook.name} ?`,  // Mensagem
                  [
                    {
                      text: "Cancelar",
                      onPress: () => {resolve(false)},
                      style: "cancel"
                    },
                    {
                      text: "Delete",
                      onPress: () => {DeleteBook(objBook),resolve(true)}
                    }
                  ]
                );
          
                  })

    }

    const SaveNewTitle = async () => {

            //console.log("Save new title chamado")
            if (shelf.length != 0){
            //console.log("Relaxa paizão")    
            //converte a nova lista de obj para string
            const newlist_str = JSON.stringify(shelf)
            console.log(newlist_str)
            //salva a nova lista no armazenamento local
            await AsyncStorage.setItem("Books_list",newlist_str)
            }

    }

    const EditingName = (id:string , newName:string) => {

        setShelf(prevItems =>
             prevItems.map(item =>
                 item.uri == id 
                 ? {...item, name:newName} : item))

    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Bookshelf</Text>
                <Text style={styles.headerSubtitle}>{shelf.length} book{shelf.length !== 1 ? 's' : ''} in your collection</Text>
            </View>
            
            {/* Books List */}
            <FlatList
                data={shelf}
                renderItem={({item}) => {
                    // Find cover from Covers array if available
                    ///const coverItem = Covers.find((c: any) => c.uri === item.uri) || item;
                    const coverUri = item.HrefCover//(coverItem as any).coverUri;

                    //if (coverUri){console.log("CoverUri "+coverUri.length)}

                    return (
                    <TouchableOpacity onPress={() => (openBook(item))} style={styles.bookCard}>
                        {/* Book Cover */}
                        <View style={styles.bookCoverContainer}>
                            { item.type === "epub" && coverUri ? (
                                <Image 
                                    source={{uri: coverUri}} //{ require('../assets/The_Catcher.jpg') } //{{uri: coverUri}}
                                    style={styles.bookCover}
                                    resizeMode="cover"
                                    defaultSource={require('../assets/DefaultCover.png')}
                                />
                            ) : <Image //Essa parte lida com a falta de coverUri
                                    source={require('../assets/DefaultCover2.png')}
                                    style={styles.bookCover}
                                    resizeMode="cover"
                                    defaultSource={require('../assets/DefaultCover.png')}
                                />}
                        </View>

                        {/* Book Information */}
                        <View style={styles.bookInfo}>

                            {/*
                            <TouchableOpacity onPress={() => ({})}>
                            <Text style={styles.bookTitle}>{formatBookName(String(item.name))}</Text>
                            </TouchableOpacity>*/}

                            <TextInput
                                style={[styles.bookTitle, isFocused && (styles.bookTitle,{backgroundColor: ColorScheme.background})]}
                                value={String(item.name)}
                                onEndEditing={() => {SaveNewTitle()}}
                                onChangeText={(newText) => {EditingName(item.uri,newText)}}
                                onFocus={() => {setFocused(true)}}
                                onBlur={() => {setFocused(false)}}
                            />
                            
                            {/* Futuro botão de remover livro*/}
                            <TouchableOpacity style={styles.TrashStyle} onPress={() => {DeleteDecison(item)}}  >
                                <MaterialIcons name="delete" size={23} color="#e01515da" />  
                            </TouchableOpacity>
                            
                            {/*
                            <TouchableOpacity onPress={() => ({})} style={styles.editCard}></TouchableOpacity>
                            */}

                            <View style={styles.bookDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Number of pages read</Text>
                                    <Text style={styles.detailValue}>{item.N_PagesRead/*typeof(item.lastPage) !== "string" ? item.lastPage : ""*/}</Text>
                                </View>
                                
                                {/*
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Status</Text>
                                    <Text style={[styles.statusText, { 
                                        color: item.finishedReading ? '#4CAF50' : ColorScheme.text 
                                    }]}>
                                        {item.finishedReading ? 'Completed' : 'In Progress'}
                                    </Text>
                                </View>
                                */}

                                    {/*
                            <TouchableOpacity onPress={() => ({})} style={styles.editCard}></TouchableOpacity>
                                    */}

                            </View>

                            {/* Progress Bar */}
                            
                            <View style={styles.progressContainer}>
                                <Text style={[styles.detailValue,{fontSize: getResponsiveFontSize(22)}]}>Chapter:{item.ChapterProgress.CurrentPage}/{item.ChapterProgress.TotalChapterPage} Pages</Text>
                                <View style={styles.progressBar}>
                                    <View 
                                        style={[
                                            styles.progressFill, 
                                            { width: `${Math.min((item.ChapterProgress.CurrentPage / item.ChapterProgress.TotalChapterPage) * 100, 100)}%` }
                                        ]} 
                                    />
                                </View>
                                {/*<Text style={styles.progressText}>{item.lastPage}%</Text>*/}

                            </View> 

                        {/* Futura barra de progresso
                            <StepProgress
                            totalSteps={4}
                            currentStep={2}
                            onStepPress={() => {}}
                        />*/}
                        

                        </View>
                    </TouchableOpacity>
                    );
                }} 
                keyExtractor={(item, index) => item.uri || index.toString()}
                contentContainerStyle={styles.booksList}
                showsVerticalScrollIndicator={false}
                
            />

            {/*
            <View style={{position: "absolute",bottom: getResponsivePadding(5),alignSelf:"center"}}>
            <BannerAd
            unitId={Id_for_ADs}
            size={BannerAdSize.BANNER}
            />
            </View>
            */}
            
            {/* Add Book Button */}
            <TouchableOpacity onPress={customPickDoc} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {/* PopUp to Add Books*/}
            { /*ShowPop &&
        
        <View style={{flex:1}}>

        <Button
        color="#0dc0b7ff"
        title="Add Physcial Book"
        onPress={customPickDoc() as never}
        //disabled={true}
        />

        <Button
        color="#0dc0b7ff"
        title="Add Ebook"
        onPress={pickDoc() as never}
        />

        </View>

            */}

            {/* Empty State */}
            {shelf.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>📚</Text>
                    <Text style={styles.emptyStateTitle}>Your bookshelf is empty</Text>
                    <Text style={styles.emptyStateSubtitle}>Tap the + button to add your first book</Text>
                </View>
            )}
            
        </View>
        
    );
};

export default ShelfScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorScheme.background,
        paddingTop: getResponsivePadding(10),
    },
    header: {
        alignItems: 'center',
        marginBottom: getResponsiveMargin(10),
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
        fontSize: getResponsiveFontSize(16),
        color: ColorScheme.subtext,
        textAlign: 'center',
        opacity: 0.9,
    },
    booksList: {
        paddingHorizontal: getResponsivePadding(20),
        paddingBottom: getResponsivePadding(420),
    },
    bookCard: {
        backgroundColor: '#1E1A78',
        borderRadius: getResponsiveSize(4),
        padding: getResponsivePadding(7),
        marginBottom: getResponsiveMargin(16),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: getResponsiveSize(4),
        },
        borderColor: ColorScheme.subtext,
        borderWidth:2,
        shadowOpacity: 0.3,
        shadowRadius: getResponsiveSize(8),
        elevation: 6,
    },
    editCard: {

        /*
        backgroundColor: "#f7ce18ff",
        fontSize: getResponsiveFontSize(36),
        fontWeight: 'bold',
        color: ColorScheme.text,
        marginHorizontal:getResponsiveMargin(30),
        marginTop: getResponsiveMargin(-30),
        marginBottom: getResponsiveMargin(30),
        lineHeight: getResponsiveSize(45),*/
        
        backgroundColor: '#160aeeff',
        borderRadius: getResponsiveFontSize(2),
        padding: getResponsivePadding(18),
        lineHeight: getResponsiveSize(45),
        paddingStart: getResponsiveMargin(-20),
        marginBottom: getResponsiveMargin(40),
        marginTop:getResponsiveMargin(-30),
        borderColor: ColorScheme.subtext,
        borderWidth:2,
        elevation: 12,

    },
    TrashStyle:{
        position: "absolute",
        top: 102,
        right: 0,
        zIndex: 1,
        padding:5,
    },
    bookCoverContainer: {
        marginRight: getResponsiveMargin(16),
        flexShrink: 0,
    },
    bookCover: {
        //Normal ratio is 1:1.6 ,, w100;h160
        width: getResponsiveSize(125),
        height: getResponsiveSize(200),
        borderRadius: getResponsiveSize(3),
        backgroundColor: '#4B4B6E',
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'space-between',
        height: getResponsiveSize(100, 'height'),
    },
    bookTitle: {
        //backgroundColor: ColorScheme.background,
        fontSize: getResponsiveFontSize(28),
        fontWeight: 'bold',
        color: ColorScheme.text,
        marginHorizontal:getResponsiveMargin(10),
        paddingInlineStart: getResponsivePadding(0),
        marginTop: getResponsiveMargin(-55),
        marginBottom: getResponsiveMargin(3),
        lineHeight: getResponsiveSize(45),
    },
    TextEdit: {
        backgroundColor: ColorScheme.background,
                //backgroundColor: ColorScheme.background,
        fontSize: getResponsiveFontSize(25),
        fontWeight: 'bold',
        color: ColorScheme.text,
        marginHorizontal:getResponsiveMargin(10),
        paddingInlineStart: getResponsivePadding(20),
        marginTop: getResponsiveMargin(-30),
        marginBottom: getResponsiveMargin(30),
        lineHeight: getResponsiveSize(45),
    },
    bookDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: getResponsiveMargin(12),
        marginTop: getResponsiveMargin(-8),
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: getResponsiveFontSize(18),
        color: ColorScheme.text,
        opacity: 0.8,
        marginBottom: getResponsiveMargin(4),
    },
    detailValue: {
        fontSize: getResponsiveFontSize(26),
        fontWeight: '600',
        color: ColorScheme.text,
    },
    statusText: {
        fontSize: getResponsiveFontSize(22),
        fontWeight: '600',
    },
    progressContainer: {
        alignItems: 'flex-start',
        marginTop: getResponsiveMargin(-7)
    },
    progressBar: {
        width: '95%',
        height: getResponsiveSize(16),
        backgroundColor: ColorScheme.background,
        borderRadius: getResponsiveSize(18),
        marginBottom: getResponsiveMargin(6),
        overflow: 'hidden',
        //marginHorizontal: getResponsiveMargin(4)
    },
    progressFill: {
        height: '100%',
        backgroundColor: ColorScheme.accent,//"#6b0096ff"  , //accent
        borderRadius: getResponsiveSize(18),
    },
    progressText: {
        fontSize: getResponsiveFontSize(12),
        color: '#bababa',
        fontWeight: '500',
    },
    addButton: {
        backgroundColor: ColorScheme.accent, //'#bababa'
        position: 'absolute',
        bottom: getResponsiveMargin(95),
        right: getResponsiveMargin(25),
        width: getResponsiveSize(80),
        height: getResponsiveSize(80),
        borderRadius: getResponsiveSize(90),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: getResponsiveSize(4),
        },
        shadowOpacity: 0.3,
        shadowRadius: getResponsiveSize(8),
        elevation: 6,
    },
    addButtonText: {
        fontSize: getResponsiveFontSize(32),
        color: '#1E1A78',
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: getResponsivePadding(20),
        marginVertical: getResponsivePadding(222)
    },
    emptyStateIcon: {
        fontSize: getResponsiveFontSize(70),
        marginBottom: getResponsiveMargin(1),
    },
    emptyStateTitle: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        color: ColorScheme.text,
        textAlign: 'center',
        marginBottom: getResponsiveMargin(8),
    },
    emptyStateSubtitle: {
        fontSize: getResponsiveFontSize(22),
        color: '#bababa',
        textAlign: 'center',
        opacity: 0.8,
        lineHeight: getResponsiveSize(22),
    },
});
