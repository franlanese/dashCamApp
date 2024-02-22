export const NOMBRE_DE_USUARIO = 'CPATU' as const
export const CONTRASENIA = 123456 as const
export const DEVIDNO = 23061610000 as const
export const INTERVALO_ACTUALIZACION = 10000 as const // 10 segundos
export const LOGIN_URL = `http://190.64.138.21:8088/StandardApiAction_login.action?account=${NOMBRE_DE_USUARIO}&password=${CONTRASENIA}` as const
export const PARAMS_GET_COORDS = `&vehiIdno=${DEVIDNO}&toMap=2&currentPage=1&pageRecords=50&geoaddress=0`
export const URL_GET_COORDS = `http://190.64.138.21:8088/StandardApiAction_vehicleStatus.action?`
export const COLOR_NARANJA = '#f97c3a' as const
