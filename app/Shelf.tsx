import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, View, StyleSheet, Text, Image, Alert, Button, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import ePub from 'epubjs';
import { router, useFocusEffect, useRouter } from "expo-router";
import { Books_list_model, ColorScheme } from "./_layout";
import Pdf from 'react-native-pdf';
import {pickDoc} from "./Uploader"
//import addNewBook from "./Uploader"

const { width, height } = Dimensions.get('window');

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
    const [Covers, setCovers] = useState([])
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

        const getCover = async (filePath: string): Promise<string | null> => {
            /*try {
                
                console.log("Get Cover.01 shelf.uri: " + filePath)

                const book = ePub(filePath, {
                    openAs: "epub",
                });

                console.log("Get Cover.01.5")

                await book.ready;

                console.log("Get Cover.02")

                const coverUrl = await book.coverUrl();

                console.log("Get Cover.03")

                return coverUrl;

            } catch (error) {
                console.error('Erro ao extrair capa:', error);
                return null;
            }*/
           return null;
        };    

    try {

    //comeca, pegando o valor da lista no armazenamento local como string
    const storageString = await AsyncStorage.getItem("Books_list")

    //transforma o dados locais de string para lista, caso nao tenha retorna uma lista vazia
    const oldList = storageString ? JSON.parse(storageString) : []

    setShelf(oldList)
    /*
    const booksData = await Promise.all(    
        oldList.map(async (shelf: { uri: any; }) =>{
            try{
                console.log("Chamando Get Cover")
                const coverUri = await getCover(shelf.uri);
                console.log("Saindo do Get Cover")
                return{...shelf, coverUri}
            }catch(e){
                console.error("Eroo no loadCover: "+e)
                return{ ...shelf, coverUri: null}
            }
        })
    )*/
    
    //setCovers(booksData as never)
    //console.log("BooksData: "+booksData)
    //muda o valor de shelf
    //setShelf(oldList)

    } catch (e) {console.log("Erro em coletar dados na biblioteca")}

    } 

 /*   const loadCover = async (Uri : any)  => {

        const getCover = async (filePath: string): Promise<string | null> => {
            try {
                const book = ePub(filePath);
                await book.ready;
                
                const coverUrl = await book.coverUrl();
                return coverUrl;
            } catch (error) {
                console.error('Erro ao extrair capa:', error);
                return null;
            }
        };

    /*
    try{
        const book = ePub(Uri);
        await book.ready


        let CoverUri = await book.coverUrl()
        if (CoverUri == null) { CoverUri = undefined}
        return CoverUri;

    }catch(e){console.log(e)}

    }*/

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
        return name;
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
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => (openBook(item))} style={styles.bookCard}>
                        {/* Book Cover */}
                        <View style={styles.bookCoverContainer}>
                            { (item.type == "pdf") && (<Pdf
                                source={{ uri: item.uri}}
                                page={1}
                                singlePage={true}
                                onLoadComplete={(numberOfPages, filePath) => {MaxPage = numberOfPages}}
                                onError={(error) => console.log(error)}
                                style={styles.bookCover}
                            />) 
                             }

                             {/*
                            <Image 
                                source={{}}
                                style={{ width: getResponsiveSize(120), height:getResponsiveSize(180) }}
                                //defaultSource={require('./shelf_icon.png')}
                            /> 
                             */}

                        </View>

                        {/* Book Information */}
                        <View style={styles.bookInfo}>
                            <Text style={styles.bookTitle}>{formatBookName(String(item.name))}</Text>
                            
                            <View style={styles.bookDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Number of pages read</Text>
                                    <Text style={styles.detailValue}>{item.N_PagesRead/*typeof(item.lastPage) !== "string" ? item.lastPage : ""*/}</Text>
                                </View>
                                
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Status</Text>
                                    <Text style={[styles.statusText, { 
                                        color: item.finishedReading ? '#4CAF50' : ColorScheme.text 
                                    }]}>
                                        {item.finishedReading ? 'Completed' : 'In Progress'}
                                    </Text>
                                </View>
                            </View>

                            {/* Progress Bar */}
                            {/*
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View 
                                        style={[
                                            styles.progressFill, 
                                            { width: `${Math.min((item.lastPage / MaxPage) * 100, 100)}%` }
                                        ]} 
                                    />
                                </View>
                                <Text style={styles.progressText}>{item.lastPage}%</Text>
                            </View> */}
                        </View>
                    </TouchableOpacity>
                )} 
                keyExtractor={(item, index) => item.uri || index.toString()}
                contentContainerStyle={styles.booksList}
                showsVerticalScrollIndicator={false}
            />
            
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
        paddingBottom: getResponsivePadding(100),
    },
    bookCard: {
        backgroundColor: '#1E1A78',
        borderRadius: getResponsiveSize(4),
        padding: getResponsivePadding(16),
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
    bookCoverContainer: {
        marginRight: getResponsiveMargin(16),
        flexShrink: 0,
    },
    bookCover: {
        width: getResponsiveSize(80),
        height: getResponsiveSize(100),
        borderRadius: getResponsiveSize(80),
        backgroundColor: '#4B4B6E',
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'space-between',
        height: getResponsiveSize(100, 'height'),
    },
    bookTitle: {
        fontSize: getResponsiveFontSize(22),
        fontWeight: 'bold',
        color: ColorScheme.text,
        marginBottom: getResponsiveMargin(12),
        lineHeight: getResponsiveSize(20),
    },
    bookDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: getResponsiveMargin(12),
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: getResponsiveFontSize(18),
        color: '#bababa',
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
    },
    progressBar: {
        width: '100%',
        height: getResponsiveSize(4),
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderRadius: getResponsiveSize(2),
        marginBottom: getResponsiveMargin(6),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: getResponsiveSize(2),
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
