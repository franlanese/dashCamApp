//======================================================================================================================
// Home.tsx: PANTALLA PRINCIPAL. 
// Se unen los componentes Mapa.tsx y Camaras.tsx.
// Se maneja la visibilidad de las camaras.
//======================================================================================================================

// IMPORTACIONES

import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Camaras from './Camaras';
import Mapa from './Mapa';
import { COLOR_NARANJA , DEVIDNO, INTERVALO_ACTUALIZACION} from './constants';
import { Login } from './utils';
import Video from 'react-native-video'

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

const Home = ({ navigation }) => {

  //======================================================================================================================
  // ESTADOS

  const [camarasON, setCamarasON] = useState(false);     // Maneja visibilidad de las camaras
  const [jsession, setJsession] = useState(null)
  const [onlineCamaras, setOnlineCamaras] = useState(false)
  const [counter, setCounter] = useState(0);  // Contador para manejar efectos
  const [url, setUrl] = useState({
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  })
  const [videoVisible, setVideoVisible] = useState(false)


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
  // llamarOnlineCamara()
  // Función asincrónica para obtener las ultimas coordenadas del vehiculo
  const llamarOnlineCamara = async () => {
    try {

      const url = `http://190.64.138.21:8088/StandardApiAction_getDeviceOlStatus.action?jsession=${jsession}&devIdno=${DEVIDNO}`
      const response = await axios.get(url);
      

      response.data.onlines[0].online ? (setOnlineCamaras(true)) : (setOnlineCamaras(false))
      console.log(response.data.onlines[0].online)


    } catch (error) {
      console.error("Error", "Hubo un problema al cargar el mapa.");
      console.error(error);
    }
  };


  const handleVideoError = (error) => {
    // Loguea el error en la consola
    console.error("Error en la reproducción del video:", error);
  };

  const handleBuffer = ({ isBuffering }) => {
    if (isBuffering) {
      // Cambia la fuente del video cuando empieza a bufferizar
      setUrl({
        uri: "http://190.64.138.21:6604/3/5?DownType=3&jsession=&DevIDNO=23061610000&FILELOC=2&FLENGTH=1475776&FOFFSET=0&MTYPE=1&FPATH=D:/gStorage/STOMEDIA/23061610000/2023-12-14/23061610000-231214-130131-130159-20010100.mp4&SAVENAME="
      });
    }
  };

  const handleEnd = () => {
    setUrl({uri: "http://190.64.138.21:6604/3/5?DownType=3&jsession=&DevIDNO=23061610000&FILELOC=2&FLENGTH=1475776&FOFFSET=0&MTYPE=1&FPATH=D:/gStorage/STOMEDIA/23061610000/2023-12-14/23061610000-231214-130131-130159-20010100.mp4&SAVENAME="})
    setVideoVisible(true)
  }


  //======================================================================================================================
  // EFECTOS

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, INTERVALO_ACTUALIZACION);

    return () => clearInterval(interval);
  }, []);

  //======================================================================================================================
  // RENDERIZADO

  llamarOnlineCamara()

  return (
    // Contenedor principal
    <View style={{ flex: 1 }}>
      {/* Contenedor para el mapa */}
      <View style={{ flex: 2 }}>
        <Mapa />
      </View>

    {/* Contenedor para centrar el botón */}
    <View style={styles.centeredContainer}>

        {/* Botón para habilitar/deshabilitar cámaras */}
        <TouchableOpacity onPress={() => setCamarasON(!camarasON)} style={styles.button}>
          <Text style={styles.buttonText}>HABILITAR CAMARAS</Text>
        </TouchableOpacity>
         {/* Barra que muestra el estado de onlineCamaras */}
        <View style={[styles.statusCircle, onlineCamaras ? styles.online : styles.offline]} />
        <TouchableOpacity onPress={() => navigation.navigate('HistorialVideos')} style={styles.button2}>
          <Text style={styles.buttonText2}>VIDEOS</Text>
        </TouchableOpacity>
    </View>
      {/* Renderizar componente Camaras si camarasON es verdadero */}
      {camarasON && (
        <View style={{ flex: 1 , backgroundColor: 'black'}}>
          <Camaras navigation={navigation} />
        </View>
      )}
      
    </View>
  );
};

//======================================================================================================================
// ESTILOS

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLOR_NARANJA,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row', // Alinea horizontalmente el texto y el círculo
    alignItems: 'center', // Alinea verticalmente el texto y el círculo
    justifyContent: 'center' // Centra el contenido en el botón
  },
  button2: {
    backgroundColor: COLOR_NARANJA,
    paddingHorizontal: 50,
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center', // Alinea verticalmente el texto y el círculo
    justifyContent: 'center' // Centra el contenido en el botón
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonText2: {
    color: 'black',
    fontSize: 13,
    textAlign: 'center',
  },
  camarasContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  buttonAndCircleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCircle: {
    width: 100,
    height: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  online: {
    backgroundColor: 'green',
  },
  offline: {
    backgroundColor: 'red',
  },

  centeredContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// EXPORTACION
export default Home;
