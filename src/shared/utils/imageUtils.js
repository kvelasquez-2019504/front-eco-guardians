/**
 * Utilidades para manejo y conversión bidireccional de imágenes y Base64.
 * Ubicado en: src/shared/utils/imageUtils.js
 */

/**
 * 1. Convertir un archivo de imagen (File o Blob) a una cadena Base64 (Data URL)
 * @param {File | Blob} file - Objeto de archivo o blob de imagen
 * @returns {Promise<string>} Promesa que resuelve a la cadena Base64 (data:image/...;base64,...)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se proporcionó ningún archivo para convertir.'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 2. Convertir una cadena Base64 de vuelta a un objeto Blob
 * @param {string} base64String - Cadena en formato data URL o Base64 puro
 * @param {string} [defaultMimeType='image/jpeg'] - Tipo MIME por defecto si no viene en el encabezado
 * @returns {Blob} Objeto Blob de la imagen
 */
export const base64ToBlob = (base64String, defaultMimeType = 'image/jpeg') => {
  if (!base64String || typeof base64String !== 'string') {
    throw new Error('La cadena Base64 proporcionada no es válida.')
  }

  let mimeType = defaultMimeType
  let byteCharacters

  // Comprobar si incluye el encabezado "data:image/...;base64,"
  if (base64String.includes(',')) {
    const parts = base64String.split(',')
    const mimeMatch = parts[0].match(/:(.*?);/)
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1]
    }
    byteCharacters = atob(parts[1])
  } else {
    byteCharacters = atob(base64String)
  }

  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

/**
 * 3. Convertir una cadena Base64 de vuelta a un objeto File (para formularios o re-envíos multipart)
 * @param {string} base64String - Cadena Base64
 * @param {string} [filename='evidence.jpg'] - Nombre que tendrá el archivo generado
 * @param {string} [defaultMimeType='image/jpeg'] - Tipo MIME de respaldo
 * @returns {File} Objeto File estándar de navegador
 */
export const base64ToFile = (base64String, filename = 'evidence.jpg', defaultMimeType = 'image/jpeg') => {
  const blob = base64ToBlob(base64String, defaultMimeType)
  return new File([blob], filename, { type: blob.type })
}

/**
 * 4. Convertir una cadena Base64 a una URL de objeto temporal (blob:http...) para renderizado rápido
 * @param {string} base64String - Cadena Base64
 * @returns {string} URL de objeto revocable (URL.createObjectURL)
 */
export const base64ToObjectUrl = (base64String) => {
  const blob = base64ToBlob(base64String)
  return URL.createObjectURL(blob)
}

/**
 * 5. Descargar una imagen Base64 directamente al almacenamiento del usuario
 * @param {string} base64String - Cadena Base64
 * @param {string} [filename='descarga-evidencia.jpg'] - Nombre del archivo de descarga
 */
export const downloadBase64Image = (base64String, filename = 'descarga-evidencia.jpg') => {
  const blob = base64ToBlob(base64String)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default {
  fileToBase64,
  base64ToBlob,
  base64ToFile,
  base64ToObjectUrl,
  downloadBase64Image,
}
