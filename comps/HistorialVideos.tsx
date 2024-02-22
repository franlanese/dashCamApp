import React , {useEffect, useState} from 'react'
import { View , Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native'
import Video from 'react-native-video'
import axios from 'axios'
import { COLOR_NARANJA } from './constants'
import { Login } from './utils'

const VideoCam = ({navigation}) => {
  const DUMMYVIDEOURL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  const [listaVideos, setListaVideos] = useState([])
  const [descCompleta, setDescCompleta] = useState(false)
  const [pollingActivo, setPollingActivo] = useState(false)
  const [begValor, setBegValor] = useState(null)
  const [muted, setMuted] = useState(true)
  const [playerKey, setPlayerKey] = useState(0)
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [inicializado, setInicializado] = useState(false)

  const [url, setUrl] = useState(DUMMYVIDEOURL)
  const [videoVisible, setVideoVisible] = useState(false)

  function calcularHora(segundosTotales) {
    // Asumiendo que los segundosTotales son desde la medianoche
    const horas = Math.floor(segundosTotales / 3600);
    const minutos = Math.floor((segundosTotales - (horas * 3600)) / 60);
    const segundos = segundosTotales - (horas * 3600) - (minutos * 60);

    // Formatear la hora, minutos y segundos para que siempre tengan dos dígitos
    const horaFormateada = horas.toString().padStart(2, '0');
    const minutosFormateados = minutos.toString().padStart(2, '0');
    const segundosFormateados = segundos.toString().padStart(2, '0');

    return `${horaFormateada}:${minutosFormateados}:${segundosFormateados}`;
  }

  const agregarJsessionAUrl = (url,newJsession) => {

    let [baseUrl, queryString] = url.split('?')

    let params = queryString ? queryString.split('&') : [];

    let paramIndex = params.findIndex(param => param.startsWith ('jsession='));

    if (paramIndex !== -1) {
      params[paramIndex] = `jsession=${newJsession}`;
    } else {
      params.push(`jsession=${newJsession}`)
    }
    queryString = params.join('&')
    const urlNueva = `${baseUrl}?${queryString}`;
    return urlNueva;

  }

  const pedirDescargaAlServidor = async () => {
    try {
      console.log("begValor: ",begValor)
      const videoEncontrado = listaVideos.find(video => video.beg == begValor)

      if (videoEncontrado){
        const jsession = await Login()
        if (!jsession) {
          throw new Error('La jsession es undefined')
        }
        const apiUrl = videoEncontrado.url

        const urlCustom = agregarJsessionAUrl(apiUrl,jsession)


        const response = await axios.get(urlCustom)
        //console.log('Video encontrado y orden al servidor realizada; ', response.data)
      } else {
        console.error("No se encontró el video solicitado.")
      }

      if (!videoEncontrado.url || typeof videoEncontrado.url !== 'string') {
        throw new Error("La URL del video es inválida o no está definida.");
      }

    } catch (error) {
      console.error("Error al pedir la descarga del video al servidor", error);
    }
  }

  const QueryVideo = async () => {
    try{
      const url = 'http://190.64.138.21:8088/StandardApiAction_getVideoFileInfo.action?DevIDNO=23061610000&LOC=1&CHN=-1&YEAR=2023&MON=12&DAY=29&RECTYPE=-1&FILEATTR=2&BEG=0&END=86399&ARM1=0&ARM2=0&RES=0&STREAM=0&STORE=0&jsession=863fa703e6c0422a87c6a0e7e6ffb14b';
      const response = await axios.get(url);
      const datos = response.data.files

      const listaFiltrada = datos.map(item => ({
        url: item.DownTaskUrl,
        chn: item.chn,
        beg: item.beg,
        end: item.end,
        year: item.year,
        mon: item.mon,
        day: item.day,
      }))
      setListaVideos(listaFiltrada)
    }
    catch (error) {
      console.error('Error al obtener la lista de videos', error);
    }
  };

  const verificarDescarga = async () => {
    try {

      console.log("asd")
      const response = await axios.get("http://190.64.138.21:8088/StandardApiAction_getVideoFileInfo.action?DevIDNO=23061610000&LOC=2&CHN=-1&YEAR=2023&MON=12&DAY=29&RECTYPE=-1&FILEATTR=2&BEG=0&END=86399&ARM1=0&ARM2=0&RES=0&STREAM=0&STORE=0&jsession=863fa703e6c0422a87c6a0e7e6ffb14b")
      const datos = response.data.files;
      let objetoDescarga;

      if (datos) {
         objetoDescarga = datos.find(objeto => objeto.beg === begValor);
      }

      if (objetoDescarga) {
        setMuted(false)
        setUrl(objetoDescarga.DownUrl)
        //setVideoVisible(true)
        setLoadingVideo(false)
        setDescCompleta(true);
        setPollingActivo(false);
      }
    } catch (error) {
      console.error('Error al verificar la descarga:', error)
    }
  }
  
  useEffect(() => {
    let intervalo;

    if (pollingActivo) {
      intervalo = setInterval(verificarDescarga, 10000); // Llama cada 10 segundos
    }

    // Limpieza del intervalo
    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }
    };
  }, [pollingActivo]);

  const iniciarPolling = (beg) => {
    setBegValor(beg);
    setPollingActivo(true);
    setLoadingVideo(true)
  }



  const handleVideoError = (error) => {
    // Loguea el error en la consola
    console.error("Error en la reproducción del video:", error);
  };

  const handleLoad = () => {
    if (url !== DUMMYVIDEOURL) {
      setVideoVisible(true)
    }
  }


  useEffect(() => {
    QueryVideo();
  },[])

  useEffect(() => {
    if (inicializado) {
      pedirDescargaAlServidor();
      verificarDescarga()
    } else {
      setInicializado(true)
    }
  }, [begValor])


  const renderItem = ({item}) =>
  <View style={{ padding: 10 }}>
    <TouchableOpacity style={styles.button2} onPress={() => iniciarPolling(item.beg)}>
      <Text style={styles.buttonText2}>Beg: {calcularHora(item.beg)}, End: {calcularHora(item.end)}, Camara: {item.chn+1}</Text>
    </TouchableOpacity>
  </View>

  return (
    <View style={{flex:1}}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={{fontSize: 32}}> Atras </Text>
      </TouchableOpacity>
      {pollingActivo && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="gray"/>
        </View>
      )}
      <Video
        //source={require('./png/asd2.mp4')}
        source={{uri: url}}   // URL del video                                   // Referencia del componente
        //onEnd={handleEnd}               
        //onError={this.videoError}             
        onLoad={handleLoad}
        muted={muted}
        paused={false}
        key={playerKey}
        style={videoVisible ? styles.visibleVideo : styles.hiddenVideo} 
        onError={handleVideoError}
        resizeMode='contain'
        controls
      />
      <FlatList
        data={listaVideos}
        renderItem={renderItem}
        keyExtractor = {(item, index) => 'key' + index}
        style={{flex:2}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  hiddenVideo: {
    width: 0,
    height: 0,
  },
  visibleVideo: {
    height: 250,
  },
  button2: {
    backgroundColor: COLOR_NARANJA,
    paddingHorizontal: 50,
    paddingVertical: 5,
    marginBottom: 0,
    marginTop: 0,
    borderRadius: 10,
    alignItems: 'center', // Alinea verticalmente el texto y el círculo
    justifyContent: 'center' // Centra el contenido en el botón
  },
  buttonText2: {
    color: 'black',
    fontSize: 13,
    textAlign: 'center',
  },
})

export default VideoCam
