import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { PlusCircle, Upload, Trash2, Image as ImageIcon, AlertCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { H1 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { SchoolScheduleBanner } from '@/components/molecules/SchoolScheduleBanner.jsx'
import { createPost } from '@/service/post.api.js'
import { validatePostDescription, validatePostImages } from '@/shared/validator/postValidators.js'

const SAMPLE_PRESET_IMAGES = [
  {
    label: 'Clasificación de Plásticos',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Limpieza de Instalaciones',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Puntos Verdes Kinal',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
]

/**
 * Página: CreatePostPage
 * Vista dedicada para el registro y carga de evidencias ecológicas escolares (Multer multipart/form-data).
 * Ruta: /posts/new
 */
export const CreatePostPage = () => {
  const navigate = useNavigate()

  const [description, setDescription] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Revocar ObjectURLs al desmontar para evitar fugas de memoria
  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview)
      })
    }
  }, [selectedFiles])

  const handleFileUpload = (e) => {
    const incomingFiles = Array.from(e.target.files || [])
    if (incomingFiles.length === 0) return

    setErrorMsg('')
    const remainingSlots = 4 - selectedFiles.length

    if (remainingSlots <= 0) {
      setErrorMsg('Has alcanzado el límite máximo de 4 fotografías de evidencia.')
      return
    }

    const filesToAdd = incomingFiles.slice(0, remainingSlots)
    if (incomingFiles.length > remainingSlots) {
      toast.warning(`Solo se agregaron ${remainingSlots} fotos. El límite oficial es de 4 imágenes.`)
    }

    const newEntries = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    setSelectedFiles((prev) => [...prev, ...newEntries])
    // Resetear valor del input para permitir re-selección
    e.target.value = ''
  }

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prev) => {
      const target = prev[indexToRemove]
      if (target?.preview) {
        URL.revokeObjectURL(target.preview)
      }
      return prev.filter((_, idx) => idx !== indexToRemove)
    })
  }

  const handleAddPreset = async (preset) => {
    if (selectedFiles.length >= 4) {
      setErrorMsg('Has alcanzado el límite máximo de 4 fotografías de evidencia.')
      return
    }
    setErrorMsg('')

    try {
      const response = await fetch(preset.url)
      const blob = await response.blob()
      const fileName = `${preset.label.toLowerCase().replace(/\s+/g, '-')}.jpg`
      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' })

      const newEntry = {
        file,
        preview: URL.createObjectURL(file),
        name: fileName,
      }

      setSelectedFiles((prev) => [...prev, newEntry])
    } catch {
      setErrorMsg('No se pudo cargar la imagen de muestra como archivo binario.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const descVal = validatePostDescription(description)
    if (descVal !== true) {
      setErrorMsg(descVal)
      return
    }

    const filesArray = selectedFiles.map((item) => item.file)
    const imgVal = validatePostImages(filesArray)
    if (imgVal !== true) {
      setErrorMsg(imgVal)
      return
    }

    setLoading(true)
    setErrorMsg('')

    // Construir FormData con multipart/form-data automático
    const formData = new FormData()
    formData.append('description', description.trim())
    filesArray.forEach((file) => {
      formData.append('images', file)
    })

    const response = await createPost(formData)

    if (response.error) {
      setLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        setErrorMsg(serverData.errors[0]?.msg || 'Error de validación al registrar evidencia.')
        return
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'No se pudo registrar la evidencia ecológica. Verifica el horario escolar de Kinal.'
      setErrorMsg(msg)
      toast.error(msg)
      return
    }

    setLoading(false)
    toast.success('¡Evidencia ecológica registrada exitosamente!')
    navigate('/feed')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Botón Volver */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-heading font-bold text-eco-muted hover:text-eco-text transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Volver</span>
      </button>

      {/* Encabezado */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
          <PlusCircle size={14} /> Módulo Ecológico
        </div>
        <H1 variant="gradient">Subir Evidencia Ecológica</H1>
        <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
          Documenta tus actividades ambientales dentro del horario escolar de Kinal con fotografías adjuntas (de 1 a 4 archivos).
        </p>
      </div>

      {/* Horarios Oficiales */}
      <SchoolScheduleBanner />

      {/* Formulario de Carga */}
      <form
        onSubmit={handleSubmit}
        className="bg-eco-card border border-eco-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5"
      >
        {/* Descripción */}
        <div className="space-y-1.5">
          <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
            Descripción de la Acción Ecológica *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setErrorMsg('')
            }}
            disabled={loading}
            placeholder="Explica qué actividad realizaste (ej: Clasificación y depósito correcto de botellas plásticas en el punto ecológico del patio central)..."
            className="w-full px-3.5 py-2.5 rounded-xl font-body text-sm bg-eco-bg text-eco-text border border-eco-border focus:border-eco-green outline-hidden transition-all resize-none placeholder:text-eco-muted"
          />
          <span className="text-[11px] text-eco-muted font-body block text-right">
            {description.length} / 500 caracteres
          </span>
        </div>

        {/* Carga de Fotografías Binarias */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
              Fotografías de Evidencia * ({selectedFiles.length} de 4)
            </label>
            <span className="text-[11px] text-eco-muted">
              Máximo 4 imágenes (JPG, PNG, WebP)
            </span>
          </div>

          {/* Selector de archivos */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer
              ${selectedFiles.length >= 4 || loading
                ? 'bg-eco-card-hover text-eco-muted cursor-not-allowed opacity-50'
                : 'bg-eco-bg border border-eco-border hover:border-eco-green text-eco-text shadow-sm'}
            `}>
              <ImageIcon size={16} className="text-eco-green" />
              <span>Seleccionar desde dispositivo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileUpload}
                disabled={selectedFiles.length >= 4 || loading}
                className="hidden"
              />
            </label>

            {/* Muestras rápidas institucionales */}
            {selectedFiles.length < 4 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    disabled={loading}
                    className="text-[11px] font-body text-eco-muted hover:text-eco-green bg-eco-bg/70 px-2 py-1 rounded-lg border border-eco-border cursor-pointer transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Previsualización en grid de hasta 4 fotos */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {selectedFiles.map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border border-eco-border group bg-black/40 shadow-sm"
                >
                  <img
                    src={item.preview}
                    alt={`Evidencia ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      disabled={loading}
                      aria-label={`Eliminar imagen ${idx + 1}`}
                      className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded-md font-mono">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-eco-border">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => navigate('/feed')}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            leftIcon={<Upload size={16} />}
          >
            {loading ? 'Subiendo evidencia...' : 'Publicar Evidencia'}
          </Button>
        </div>
      </form>
    </div>
  )
}
export default CreatePostPage
