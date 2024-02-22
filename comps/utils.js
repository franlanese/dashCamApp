//======================================================================================================================
// utils.js: FUNCIONES.
// Contiene funciones comunes entre componentes
//======================================================================================================================

// IMPORTACIONES
import RNFS from 'react-native-fs';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import axios from 'axios';
import { LOGIN_URL, DEVIDNO } from './constants';

//======================================================================================================================
// requestStoragePermission()
// Solicita permisos de almacenamiento en Android

async function requestStoragePermission() {
  let granted;
  // Para Android API nivel 33 y superior, solicita permisos específicos
  if (Platform.Version >= 33) {
    granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);
    // Retorna true si ambos permisos son concedidos
    return granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === 'granted' &&
           granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === 'granted';
  } else {
    // Para versiones anteriores, solicita el permiso de escritura en almacenamiento externo
    granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
}

//======================================================================================================================
// getFormattedDate()
// Obtiene una fecha formateada para nombrar archivos

const getFormattedDate = () => {
    const now = new Date();
    // Formatea cada componente de la fecha para garantizar dos dígitos
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    // Retorna la fecha formateada como una cadena
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

//======================================================================================================================
// Login()
// Función para iniciar sesión y obtener un token de sesión

export const Login = async () => {
    try{
      const url = LOGIN_URL;
      const response = await axios.get(url);
      return response.data.jsession;
    }
    catch (error) {
      console.error('Error al obtener la jsession', error);
      return null;
    }
};

//======================================================================================================================
// getCapturaURL()
// Obtiene la URL de una captura de pantalla de la cámara, utilizando el API de la Dashcam

const getCapturaURL = async (camara) => {
    try {
      const jsession = await Login(); // Obtiene el token de sesión
      const url = `http://190.64.138.21:8088/StandardApiAction_capturePicture.action?jsession=${jsession}&Type=1&Resolution=4&DevIDNO=${DEVIDNO}&Chn=${camara}`;
      const response = await axios.get(url);
      return response.data.DownUrl; // Retorna la URL de descarga de la captura
    }
    catch (error) {
      console.error('Error obteniendo la URL de la captura', error);
      return null;
    }
};

//======================================================================================================================
// downloadAndSaveImage()
// Descarga y guarda una imagen en el dispositivo

const downloadAndSaveImage = async (imageUrl, camara) => {
  try {
    const formattedDate = getFormattedDate(); // Obtiene fecha formateada
    const fileName = `captura_${formattedDate}.png`; // Define el nombre del archivo
    let path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    if (Platform.OS === 'android' && Platform.Version >= 29) {
      path = `${RNFS.DownloadDirectoryPath}/${fileName}`; // Usa el directorio de descargas en Android 10+
    }

    const options = {
      fromUrl: imageUrl,
      toFile: path
    };

    await RNFS.downloadFile(options).promise // Descarga la imagen
    .then (() => {
      RNFS.scanFile(path)                 // Notifica al MediaScanner de Android para que aparezca en las apps de Galeria
    })

    Alert.alert(`Captura guardada en Descargas.`); // Alerta al usuario
    return path; // Retorna la ruta del archivo guardado
  } catch (error) {
    console.error('Error al descargar y guardar la imagen:', error);
    throw error;
  }
};

//======================================================================================================================
// handleTakeScreenshot()
// Función para manejar la captura de pantalla de la cámara
export const handleTakeScreenshot = async (camara) => {
  requestStoragePermission(); // Solicita permisos de almacenamiento

  try {
    const imageUrl = await getCapturaURL(camara); // Obtiene la URL de la imagen

    Alert.alert(
      "Confirmar descarga",
      "¿Deseas descargar la captura de pantalla?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Descarga cancelada"),
          style: "cancel"
        },
        { 
          text: "Descargar", 
          onPress: () => downloadAndSaveImage(imageUrl, camara) // Descarga la imagen
        }
      ],
      { cancelable: false }
    );
  } catch (error) {
    console.error('Error al obtener la URL de la captura:', error);
  }
};
