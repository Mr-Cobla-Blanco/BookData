// WebViewEpubWithWordTracking.tsx

import React, { useState, useEffect, use, useRef } from 'react';
import {Dimensions, StatusBar, ActivityIndicator, Text} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import ePub from 'epubjs';
import { Asset } from 'expo-asset';

const { width, height } = Dimensions.get('window');
const CHUNK_SIZE = 1024 * 1024 ; // 1MB chunks for processing

/*Old HTML
const HTMLstrign = (Chapter: string ,lastPage:number) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      padding: 20px; 
      font-family: Georgia, serif;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  ${atob(Chapter)} <!-- Decode the base64 chapter HTML -->
</body>
</html>`

const HTMLsimplify = (base64: string | undefined ) => `
<!DOCTYPE html>
<html>

<head>

  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <script src="https://unpkg.com/epubjs/dist/epub.min.js"></script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
  margin:0;
  padding:0;
  width: 100%;
  height: 100%;
  }

  #bookArea {
    width: 100%;
    height: 100%;
    top: 0;
    left:0; 
    padding-bottom: 5%;
    padding-top: 7% 
  }
  
      #nav-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      pointer-events: none;
    }
    .nav-zone {
      flex: 1;
      pointer-events: all;
      cursor: pointer;
    }

</style>

</head>

<body>

    <div id="bookArea"></div>
  <div id="nav-overlay">
    <div class="nav-zone" id="prev-zone"></div>
    <div class="nav-zone" id="next-zone"></div>
  </div>


  <script>

  if ("${base64}") {
        var byteCharacters = atob("${base64}");
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {type: "application/epub+zip"});
        var book = ePub(blob);
        var rendition = book.renderTo("bookArea", {width: "100%", height: "100%", spread: "none"});
        rendition.display();
    } 

    
    const WordCounter = () => {
    
      //rendition.getContents
      //rendition.requireView
    } 
    
    

    document.getElementById('next-zone').addEventListener('click', function() {
          rendition.next()
          
    })

    document.getElementById('prev-zone').addEventListener('click', function() {
          rendition.prev()
        
    })


  </script>

</body>
</html>
`*/


const WebViewEpub = ({selectedFile} : {selectedFile: string | undefined} ) => {

  const [HtmlContent, setHtmlContent] = useState("")
  const [loading , setLoading] = useState(true);
  let StarBytePos = 0;

  //console.log("WebViewEpub was called")

  /*
  const ExtracBook = async() => {

  
    console.log("01.")
    //O real responsavel por transforma o URI em um arquivo string
    const arrayBuffer = await fetch(selectedFile!).then(r => r.arrayBuffer())
    console.log("02.")

    try {

    var book = Epub(arrayBuffer)

    await book.ready//.then(() => {console.log("Tha baby")})

    //var bookMetaData = await book.loaded.metadata //.then((metadata) => {console.log("Metadata "+metadata)}).catch(error => {console.log("Metadata failed", error)})

  //the bitch
          const spine = await book.loaded.spine
        
        console.log("=== BOOK STRUCTURE ===")
        console.log("Total sections:", spine.length)

   // var bookSpine = await book.loaded.spine//.then((spine) => {"Spine of the word: "+console.log(spine)})
      
    //console.log(bookSpine)

   
    //var bookPage =  book.loaded.pageList.then((pageList) => {"Page List: "+console.log(pageList)})

   //console.log("Full spine object: "+ JSON.stringify(bookMetaData, null, 2))
   console.log("04.")



  } catch (error) {
    console.log("oooops "+ error)
  }

    /*
      const bookInstance = ePub(selectedFile as never)
      console.log("Relax!")
     
      //await bookInstance.ready
      
      const spine = bookInstance.spine
      const ChapTobeRead = spine.get(0)
    
      //console.log(totalChapter)
      const content = await ChapTobeRead.load(bookInstance.load.bind(bookInstance))

      const chapterHtml = content.documentElement.outerHTML;

      const ChapterBase64 = btoa(unescape(encodeURIComponent(chapterHtml)))

      setBase64Epub(ChapterBase64)
  }*/
  
   //Tudo q ele faz e pegar o arquivo de HTML e o Arquivo de texto e junta em um só
   const HtmlLoader = async() => {

     //console.log de teste
     console.log("SelectedFIle = "+ selectedFile)

     //Evita erros
     if (!selectedFile){
       setHtmlContent("")
       setLoading(false)
       return
     }
     
     setLoading(true) // Start loading
     
     try {

      const fileInfo = await FileSystem.getInfoAsync(selectedFile) ;
      console.log(fileInfo)
      //const fileSize = fileInfo.size || 0
       const chunks: string[] = [];
       const totalChunks = 10//Math.ceil( / CHUNK_S0E);
       const encoder = new TextEncoder


       //torna o URI em string de Base64
       const Base64DevTest = await FileSystem.readAsStringAsync(selectedFile, { 
          encoding: FileSystem.EncodingType.Base64, 
          position: StarBytePos, 
          //length: (CHUNK_SIZE)
         })


       // Load the HTML file e Base64
       const [asset] = await Asset.loadAsync(require('../assets/Renderer.html'))
       const htmlBrute = await FileSystem.readAsStringAsync(asset.localUri || asset.uri || '')

       //inject data to HTML
       let injectedHtml = htmlBrute.replace("{{BASE64_DATA}}", Base64DevTest || '')
       injectedHtml = injectedHtml.replace("{{BASE64_boolean}}","true" )

       setHtmlContent(injectedHtml);
     } catch (error) {
       console.error("Error loading book:", error)
       setHtmlContent("")
     } finally {
       setLoading(false) // Always stop loading
     }
   }

   //const handleLoadMessage

useEffect( () => {

  /*
  // Use chunked reading for large files
      const chunks: string[] = [];
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        
        // Read chunk
        const chunk = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
          position: start,
          length: end - start
        });
        
        chunks.push(chunk);*/
    
    HtmlLoader()

}, [selectedFile]);


  // Show loading indicator while processing
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2F'}}>
        <ActivityIndicator size="large" color="#bababa" />
        <Text style={{color: '#bababa', marginTop: 10, fontSize: 16}}>Loading book...</Text>
      </View>
    )
  }

  // Show error if no content
  if (!HtmlContent) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2F'}}>
        <Text style={{color: '#bababa', fontSize: 16}}>No book selected</Text>
      </View>
    )
  }

  
  return (
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        source={{ html: HtmlContent }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        // Performance optimizations
        startInLoadingState={false}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )

};

export default WebViewEpub


/*
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const HTMLclaude = (base64: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <script src="https://unpkg.com/epubjs/dist/epub.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #bookArea {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    #nav-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      pointer-events: none;
    }
    .nav-zone {
      flex: 1;
      pointer-events: all;
      cursor: pointer;
    }
    .nav-zone:active {
      background: rgba(0, 0, 0, 0.1);
    }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 18px;
      color: #776c6cff;
    }
    #error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: red;
      padding: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="loading">Loading book...</div>
  <div id="error" style="display: none;"></div>
  <div id="bookArea"></div>
  <div id="nav-overlay">
    <div class="nav-zone" id="prev-zone"></div>
    <div class="nav-zone" id="next-zone"></div>
  </div>

  <script>
    (function() {
      try {
        console.log('Starting EPUB load...');
        
        // Decode base64
        var byteCharacters = atob("${base64}");
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {type: "application/epub+zip"});
        
        console.log('Blob created, size:', blob.size);
        
        // Create book
        var book = ePub(blob);
        
        // Render book
        var rendition = book.renderTo("bookArea", {
          width: "100%",
          height: "100%",
          flow: "paginated",
          spread: "none"
        });
        
        // Display first page
        rendition.display().then(function() {
          document.getElementById('loading').style.display = 'none';
          console.log('Book displayed successfully');
          
          // Send message to React Native
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'loaded',
              success: true
            }));
          }
        });
        
        // Navigation
        document.getElementById('prev-zone').addEventListener('click', function() {
          rendition.prev().then(function() {
            console.log('Previous page');
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'navigation',
                action: 'prev'
              }));
            }
          });
        });
        
        document.getElementById('next-zone').addEventListener('click', function() {
          rendition.next().then(function() {
            console.log('Next page');
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'navigation',
                action: 'next'
              }));
            }
          });
        });
        
        // Track location changes
        rendition.on('relocated', function(location) {
          console.log('Location:', location);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'relocated',
              location: location
            }));
          }
        });
        
        // Swipe navigation
        var startX = 0;
        var startY = 0;
        
        document.addEventListener('touchstart', function(e) {
          startX = e.touches[0].pageX;
          startY = e.touches[0].pageY;
        });
        
        document.addEventListener('touchend', function(e) {
          var endX = e.changedTouches[0].pageX;
          var endY = e.changedTouches[0].pageY;
          var diffX = startX - endX;
          var diffY = startY - endY;
          
          // Only trigger if horizontal swipe is dominant
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
              // Swipe left - next page
              rendition.next();
            } else {
              // Swipe right - previous page
              rendition.prev();
            }
          }
        });
        
      } catch(error) {
        console.error('Error loading book:', error);
        document.getElementById('loading').style.display = 'none';
        var errorDiv = document.getElementById('error');
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = '<strong>Error loading book:</strong><br>' + error.message;
        
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            error: error.message
          }));
        }
      }
    })();
  </script>
</body>
</html>
`;


/*
const WebViewEpub = ({selectedFile}: {selectedFile: string | undefined}) => {
  const [base64Epub, setBase64Epub] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (selectedFile) {
      setLoading(true);
      FileSystem.readAsStringAsync(selectedFile, { 
        encoding: FileSystem.EncodingType.Base64 
      })
        .then((base64) => {
          console.log('File read successfully, size:', base64.length);
          setBase64Epub(base64);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error reading file:', error);
          setLoading(false);
        });
    }
  }, [selectedFile]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', data);
      
      if (data.type === 'relocated') {
        // Update current page if needed
        if (data.location && data.location.start) {
          console.log('Current location:', data.location);
        }
      } else if (data.type === 'loaded') {
        console.log('Book loaded successfully');
      } else if (data.type === 'error') {
        console.error('WebView error:', data.error);
      }
    } catch (error) {
      console.log('Raw message:', event.nativeEvent.data);
    }
  };

  const nextPage = () => {
    webViewRef.current?.injectJavaScript(`
      if (window.rendition) {
        window.rendition.next();
      }
      true;
    `);
  };

  const prevPage = () => {
    webViewRef.current?.injectJavaScript(`
      if (window.rendition) {
        window.rendition.prev();
      }
      true;
    `);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#108ec9ff" />
        <Text style={styles.loadingText}>Loading EPUB...</Text>
      </View>
    );
  }

  if (!base64Epub) {
    return (
      <View style={styles.centerContainer}>
        <Text>No file selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: HTMLsimplify(base64Epub) }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        onMessage={handleMessage}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        style={styles.webview}
      />
      
      {/* Optional: External navigation buttons *//*}
      <View style={styles.navButtons}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={prevPage}
        >
          <Text style={styles.navButtonText}>← Prev</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={nextPage}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#aa8181ff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: '#108ec9ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WebViewEpub;
*/