//======================================================================================================================
// Camara.tsx: PANTALLA DE CAMARA INDIVIDUAL.
// Contiene la visualizacion de un canal de una camara
// Muestra WebView de reproductor de la Dash
//======================================================================================================================
// IMPORTACIONES
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { NOMBRE_DE_USUARIO, CONTRASENIA, DEVIDNO } from './constants';

//======================================================================================================================
// DEFINICION DE PROPS
interface CamaraProps {
  cameraNumber: number;
  handleWebViewError: () => void;
  openFullCamara: (camara: number) => void;
  initiateTakeScreenshot: (camara: number) => Promise<void>;
}

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

const Camara = ({ cameraNumber, handleWebViewError, openFullCamara, initiateTakeScreenshot }: CamaraProps) => {
  return (
    // Contenedor principal para el WebView y los botones
    <View style={styles.webViewContainer}>
      {/* Componente WebView para mostrar el feed de la cámara */}
      <WebView
        source={{ uri: `http://190.64.138.21:8088/808gps/open/player/video.html?lang=en&devIdno=${DEVIDNO}&account=${NOMBRE_DE_USUARIO}&password=${CONTRASENIA}&channel=1&chns=${cameraNumber}` }}
        style={styles.webView}
        onError={handleWebViewError} // Manejador de error para el WebView
      />
      {/* Barra de herramientas con botones */}
      <View style={styles.toolbar}>
        {/* Botón para iniciar la captura de pantalla */}
        <TouchableOpacity onPress={() => initiateTakeScreenshot(cameraNumber)} style={[styles.circleButton, {left: '12.5%'}]} />
        {/* Botón para abrir la cámara en vista completa */}
        <TouchableOpacity onPress={() => openFullCamara(cameraNumber)} style={[styles.circleButton, {left: '95%'}]} />
      </View>
    </View>
  );
};

//======================================================================================================================
// ESTILOS

const styles = StyleSheet.create({
  webViewContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // Relación de aspecto de video
    marginBottom: 0,
  },
  webView: {
    flex: 1, // WebView ocupa todo el espacio disponible
  },
  toolbar: {
    width: '100%',
    padding: 5,
    position: 'absolute',   // Permite el posicionamiento absoluto de los iconos hijo.
    bottom: 0,
  },
  circleButton: {
    position: 'absolute',
    bottom: '0%',
    width: '6%',
    height: 30,
    borderRadius: 30, // Hacer el botón completamente redondo
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0, // Hace invisible al boton
    backgroundColor: 'black',
  },
});

// EXPORTACION
export default Camara;
