//======================================================================================================================
// FullCamara.tsx: COMPONENTE DE PANTALLA COMPLETA.
// Muestra la camara pasada como parametro
//======================================================================================================================
// IMPORTACIONES
import React, { useEffect , useState} from 'react';
import { View, TouchableOpacity, StyleSheet , ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview'; // Importación del componente WebView
import Orientation from 'react-native-orientation-locker'; // Para manejar la orientación de la pantalla
import { handleTakeScreenshot } from './utils'; // Función de utilidad para capturar pantalla
import { NOMBRE_DE_USUARIO, CONTRASENIA, DEVIDNO } from './constants'; // Constantes de configuración

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

const FullCamara = ({ route, navigation }) => {

  //======================================================================================================================
  // Extracción del número de cámara y base URL de los parámetros de la ruta
  const { cameraNumber, urlBase } = route.params;

  //======================================================================================================================
  // Estado de carga de la captura
  const [isLoading, setIsLoading] = useState(false);

  //======================================================================================================================
  // Efecto para manejar la orientación de la pantalla al montar y desmontar el componente
  useEffect(() => {
    Orientation.lockToLandscape(); // Bloquea la orientación en horizontal

    return () => {
      Orientation.lockToPortrait(); // Cambia de nuevo a orientación vertical al desmontar
    };
  }, []);

  //======================================================================================================================
  // initiateTakeScreenshot
  // Función para iniciar la captura de pantalla de la cámara. Permite manejar la visibilidad del indicador de carga

  const initiateTakeScreenshot = async (camara) => {
    setIsLoading(true);                         // Activar indicador de carga
    try {
      await handleTakeScreenshot(camara);       // Llamada a la función de captura de pantalla
      // Mostrar el Alert aquí si es necesario
    } catch (error) {
      console.error('Error:', error); // Manejo de errores
    } finally {
      setIsLoading(false); // Desactivar indicador de carga
    }
  };

  //======================================================================================================================
  // RENDERIZADO
  return (
    // Contenedor principal del componente
    <View style={styles.container}>
      {/* Indicador de actividad si isLoading es verdadero */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="gray" style={styles.activityIndicator} />
        </View>
      )}
      {/* Componente WebView para mostrar el feed de la cámara en pantalla completa */}
      <WebView
        source={{
          uri: `${urlBase}/808gps/open/player/video.html?lang=en&devIdno=${DEVIDNO}&account=${NOMBRE_DE_USUARIO}&password=${CONTRASENIA}&channel=1&chns=${cameraNumber}`,
        }}
        style={styles.webView}
      />
      {/* Botón para capturar pantalla */}
      <TouchableOpacity onPress={() => initiateTakeScreenshot(cameraNumber)} style={[styles.circleButton,{left: '5.7%'}]}/>
      {/* Botón para regresar a la vista Home */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={[styles.circleButton, {left: '96%'}]} />
    </View>
  );
};

//======================================================================================================================
// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1, // Toma todo el espacio disponible
    backgroundColor: 'black', // Fondo negro
  },
  webView: {
    flex: 1, // WebView ocupa todo el espacio disponible
  },
  overlay: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fondo semi-transparente
    zIndex: 1000,                        // Asegura que la capa esté por encima de todo
  },
  circleButton: {
    position: 'absolute',
    bottom: '0%',
    width: '4%', // Tamaño del botón
    height: '8%',
    borderRadius: 100, // Redondea los bordes para formar un círculo
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0, // Botón invisible
    backgroundColor: 'black',
  },
  activityIndicator: {
    transform: [{ scale: 5 }],           // Aumenta el tamaño del ActivityIndicator
  },
});

// EXPORTACION
export default FullCamara;
