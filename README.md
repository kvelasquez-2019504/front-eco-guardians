# Front Eco-Guardianes

Cliente web para la plataforma escolar **Eco-Guardianes** (Colegio Kinal), desarrollado con **React 19**, **Vite**, **Tailwind CSS 4**, **Axios** y **React Hook Form**.

---

## 1. Variables de Entorno

Crea un archivo `.env` en la raíz de `front-eco-guardianes`:

```env
VITE_API_BASE_URL=http://localhost:3000/eco-guardians/v1
VITE_SERVER_HOST=http://localhost:3000
```

---

## 2. Puntos Clave de Integración con el Backend

### Publicación de Evidencia (`POST /post`)
* **Content-Type:** `multipart/form-data`.
* **Regla importante:** No definir la cabecera `Content-Type` manualmente en Axios o Fetch; el navegador calcula y asigna el `boundary` automáticamente al enviar un `FormData`.
* **Restricciones de Archivos:**
  * Máximo **4 imágenes** por publicación.
  * Tamaño máximo: **5 MB** por archivo.
  * Formatos válidos: `image/jpeg`, `image/png`, `image/webp`, `image/jpg`.
* **Horario Escolar (GMT-6):**
  * Las publicaciones solo se aceptan de lunes a viernes dentro del horario de la jornada escolar del alumno.

```javascript
import axios from 'axios';

export const uploadPostEvidence = async (description, files, token) => {
    const formData = new FormData();
    formData.append('description', description);

    Array.from(files).forEach((file) => {
        formData.append('images', file);
    });

    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/post`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
```

---

### Renderizado de Imágenes del Feed
Las imágenes se sirven mediante streaming binario optimizado desde el backend:
* Cada imagen en el feed contiene una propiedad `url` semántica (por ejemplo `/eco-guardians/v1/post/:id/image/:index`).
* Pueden renderizarse directamente en etiquetas `<img src="..." />` sin requerir tokens en cabeceras:

```jsx
const host = import.meta.env.VITE_SERVER_HOST || 'http://localhost:3000';

<img
    src={`${host}${post.images[0].url}`}
    alt="Evidencia ecológica"
    loading="lazy"
/>
```

---

## 3. Scripts de Desarrollo

* `pnpm dev`: Inicia el servidor de desarrollo en Vite.
* `pnpm build`: Genera el build optimizado de producción.
* `pnpm preview`: Previsualiza la versión compilada.
