//======================================================================================================================
// App.tsx: COMPONENTE PRINCIPAL DE LA APLICACIÓN. 
// Se manejan cambios en la conexion y se define la Navegacion.
//======================================================================================================================

// IMPORTACIONES 

import React, { useEffect, useState } from 'react';
import { Text, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FullCamara from './comps/FullCamara';
import NetInfo from '@react-native-community/netinfo';
import Home from './comps/Home';
import HistorialVideos from './comps/HistorialVideos';


// CREACION STACK NAVIGATOR
const Stack = createNativeStackNavigator();

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

const App = () => {

  //======================================================================================================================
  // ESTADOS
  
  const [hayConexion, setHayConexion] = useState(true);  // Cambia segun cambios de conexión
  const [reloadKey, setReloadKey] = useState(0); // Clave para forzar la recarga

  //======================================================================================================================
  // EFECTOS

  //--------------------------------------------------------------------------------------------------
  // Efecto manejador del estado de la conexion de Internet del dispositivo

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {       // Se suscribe a cambios de conexión
      const connectionStatus = state.isConnected && state.isInternetReachable;
      setHayConexion(connectionStatus);
      if (!connectionStatus) {                          // Muestra cartel de alerta si no hay conexión
        Alert.alert('Sin Conexión', 'Parece que no estás conectado a Internet. Por favor, verifica tu conexión.', [{ text: 'OK' }]);
      }
    });


    return () => unsubscribe();      // Función de limpieza para desuscribirse
  }, []);

  //--------------------------------------------------------------------------------------------------
  // Efecto para manejar la recarga del componente cuando se recupera la conexión a Internet

  useEffect(() => {
    if (hayConexion) {
      setReloadKey((prevKey) => prevKey + 1);            // Se incrementa una clave para forzar la recarga
    }
  }, [hayConexion]);

  //======================================================================================================================
  // RENDERIZADO DEL COMPONENTE

  return (
    <NavigationContainer style={styles.container}>
      {/* Mensaje de error si no hay conexión */}
      {!hayConexion && (
        <Text style={styles.error}>No hay conexión a Internet.</Text>
      )}
      {/* Navegador Stack con dos pantallas: Home y FullCamara */}
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {props => <Home {...props} hayConexion={hayConexion}/>}
        </Stack.Screen>
        <Stack.Screen name="FullCamara" component={FullCamara} options={{ headerShown: false }} />
        <Stack.Screen name="HistorialVideos" component={HistorialVideos} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//======================================================================================================================
// ESTILOS

const styles = StyleSheet.create({
  navigationcont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

// EXPORTACION
export default App;
