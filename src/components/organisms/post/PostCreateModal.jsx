import { useState, useEffect } from 'react'
import { X, Upload, Trash2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { validatePostDescription, validatePostImages } from '@/shared/validator/postValidators.js'

// Imágenes de prueba rápidas para demostraciones ecológicas
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
 * Organismo: PostCreateModal
 * Modal interactivo para subir evidencias fotográficas de acciones ecológicas escolares (Multer multipart/form-data).
 * Ubicado en: src/components/organisms/post/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Function} props.onSave - Callback al confirmar ({ description, images } o FormData)
 * @param {boolean} [props.loading=false] - Estado de guardado
 */
export const PostCreateModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
}) => {
  const [description, setDescription] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  // Limpiar URLs de objetos en desmontaje
  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview)
      })
    }
  }, [selectedFiles])

  if (!isOpen) return null

  // Cargar archivos locales binarios
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
    const newEntries = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    setSelectedFiles((prev) => [...prev, ...newEntries])
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
      setErrorMsg('No se pudo procesar la fotografía de muestra.')
    }
  }

  const handleSubmit = (e) => {
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

    setErrorMsg('')

    // Construir FormData con multipart/form-data automático
    const formData = new FormData()
    formData.append('description', description.trim())
    filesArray.forEach((file) => {
      formData.append('images', file)
    })

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-create-post-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <Sparkles size={22} />
            </div>
            <div>
              <H3 id="modal-create-post-title" className="text-eco-text">
                Subir Evidencia Ecológica
              </H3>
              <p className="text-xs text-eco-muted mt-0.5">
                Publica tus acciones sustentables dentro del horario oficial de Kinal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="text-eco-muted hover:text-eco-text p-2 rounded-xl hover:bg-eco-card-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
              Descripción de la Acción *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setErrorMsg('')
              }}
              disabled={loading}
              placeholder="Explica detalladamente la labor realizada (ej: Recolección y clasificación de botellas PET en el punto ecológico de la cafetería)..."
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
                1 a 4 fotos (JPG, PNG, WebP)
              </span>
            </div>

            {/* Selector de archivos */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className={`
                inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer
                ${selectedFiles.length >= 4 || loading
                  ? 'bg-eco-card-hover text-eco-muted cursor-not-allowed opacity-50'
                  : 'bg-eco-bg border border-eco-border hover:border-eco-green text-eco-text shadow-sm'}
              `}>
                <ImageIcon size={15} className="text-eco-green" />
                <span>Elegir fotos desde dispositivo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileUpload}
                  disabled={selectedFiles.length >= 4 || loading}
                  className="hidden"
                />
              </label>

              {/* Muestras rápidas */}
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

            {/* Previsualización en miniaturas */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
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
                        className="p-1 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded-md font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-4 border-t border-eco-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
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
              {loading ? 'Subiendo...' : 'Publicar Evidencia'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
