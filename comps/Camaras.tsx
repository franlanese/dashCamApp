//======================================================================================================================
// Camaras.tsx: PANTALLA DE CAMARAS.
// Contiene la visualizacion de las camaras
// Recibe componentes Camara.tsx
//======================================================================================================================

// IMPORTACIONES
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { handleTakeScreenshot } from './utils';
import Camara from './Camara';

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

const Camaras = ({ navigation }) => {

  //======================================================================================================================
  // ESTADOS
  const [isLoading, setIsLoading] = useState(false);     // Estado para manejar el indicador de carga

  //======================================================================================================================
  // FUNCIONES

  //--------------------------------------------------------------------------------------------------
  // handleWebViewError()
  // Manejador de error en la carga de la cámara
  const handleWebViewError = () => {                     
    Alert.alert(
      'Error',
      'No se puede cargar la cámara. Por favor, verifica tu conexión a internet y prueba nuevamente.',
      [{ text: 'OK' }]
    );
  };
  //--------------------------------------------------------------------------------------------------
  // openFullCamara()
  // Función para navegar a la vista completa de la cámara en FullCamara.tsx
  const openFullCamara = (camara) => {
    navigation.navigate('FullCamara', { cameraNumber: camara, urlBase: 'http://190.64.138.21:8088'})
  }

  //--------------------------------------------------------------------------------------------------
  // initiateTakeScreenshot
  // Función para iniciar la captura de pantalla de la cámara
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
    <View style={styles.container}>
      {/* Indicador de actividad si isLoading es verdadero */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="gray" style={styles.activityIndicator} />
        </View>
      )}
      {/* Instancias del componente Camara. Una para cada channel de la Dashcam */}
      <Camara
        cameraNumber={0}
        handleWebViewError={handleWebViewError}
        openFullCamara={openFullCamara}
        initiateTakeScreenshot={initiateTakeScreenshot}
      />
      <Camara
        cameraNumber={1}
        handleWebViewError={handleWebViewError}
        openFullCamara={openFullCamara}
        initiateTakeScreenshot={initiateTakeScreenshot}
      />
    </View>
  );
};
//======================================================================================================================
// ESTILOS

const styles = StyleSheet.create({
  container: {
    height: '32%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fondo semi-transparente
    zIndex: 1000,                        // Asegura que la capa esté por encima de todo
  },
  activityIndicator: {
    transform: [{ scale: 5 }],           // Aumenta el tamaño del ActivityIndicator
  },
});

// EXPORTACION
export default Camaras;
