//======================================================================================================================
// Mapa.tsx: PANTALLA DE MAPA.
// Contiene la interaccion con el mapa Leaflet.
// Se maneja la solicitud de coordenadas y comunicacion de las mismas al mapa Leaflet, y la visibilidad del mismo
// en un WebView.
//======================================================================================================================

// IMPORTACIONES
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { INTERVALO_ACTUALIZACION, PARAMS_GET_COORDS, URL_GET_COORDS} from './constants';
import { Login } from './utils';

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

const Mapa = () => {

  //======================================================================================================================
  // ESTADOS

  const mapRef = useRef(null);
  const [webViewCargado, setWebViewCargado] = useState(false);      
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [jsession, setJsession] = useState(null);
  const [counter, setCounter] = useState(0);  // Contador para manejar efectos

  //======================================================================================================================
  // FUNCIONES

  //--------------------------------------------------------------------------------------------------
  // Login()
  // Función asincrónica para realizar el inicio de sesión y conseguir el numero de jsession
  
  Login().then(js => {
    setJsession(js);
  }).catch(error => {
    console.error('Error al establecer la jsession', error);
  });
  

  //--------------------------------------------------------------------------------------------------
  // llamarMapa()
  // Función asincrónica para obtener las ultimas coordenadas del vehiculo
  const llamarMapa = async () => {
    try {

      const url = `${URL_GET_COORDS}jsession=${jsession}${PARAMS_GET_COORDS}`
      const response = await axios.get(url);

      setLat(response.data.infos[0].mlat);          // Actualiza las coordenadas con los datos obtenidos
      setLng(response.data.infos[0].mlng);
    } catch (error) {
      console.error("Error", "Hubo un problema al cargar el mapa.");
      console.error(error);
    }
  };

  //======================================================================================================================
  // EFECTOS

  //--------------------------------------------------------------------------------------------------
  // Efecto para enviar las coordenadas al mapa cuando están disponibles
  useEffect(() => {
    if (lat && lng && webViewCargado && mapRef.current) {
      mapRef.current.postMessage(JSON.stringify({ lat, lng }));       // Guarda en mapRef mensaje para que lo reciba el html del WebView
    }
  }, [lat, lng, webViewCargado]);

  //--------------------------------------------------------------------------------------------------
  // Efecto para llamar al mapa cuando el componente se monta y cada vez que cambia el valor de counter
  useEffect(() => {
    const fetchData = async () => {
      await Login();
      llamarMapa();
    };
    fetchData();
  }, [counter]);

  //--------------------------------------------------------------------------------------------------
  // Efecto para actualizar contador en un intervalo de tiempo. Definido por INTERVALO_ACTUALIZACION
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, INTERVALO_ACTUALIZACION);

    return () => clearInterval(interval);
  }, []);

  //======================================================================================================================
  // RENDERIZACION
  return (
    <View style={styles.container}>
      <View style={styles.webViewContainer}>
        <WebView
          ref={mapRef}
          source={{ uri: 'file:///android_asset/leaflet_map.html' }}
          style={styles.webView}
          allowFileAccess={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          mixedContentMode="always"
          originWhitelist={['*']}
          onMessage={(event) => {
            console.log("Mensaje recibido del WebView:", event.nativeEvent.data);
            if (event.nativeEvent.data === 'WebView Loaded') {
              setWebViewCargado(true);
            }
          }}
        />
      </View>
    </View>
  );
};

//======================================================================================================================
// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewContainer: {
    width: '100%',
    height: '100%',
  },
  webView: {
    width: '100%',
    height: '100%',
  },
});

export default Mapa;
