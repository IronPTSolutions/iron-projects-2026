# Chat Page — Especificacion de Diseno

## 1. Objetivo

Crear una pagina de mensajeria directa entre usuarios de la plataforma. La pagina muestra un layout dividido: panel de conversaciones activas (izquierda) y vista del chat seleccionado (derecha). Permitira enviar mensajes, eliminar mensajes propios no leidos, y mostrara un contador de no leidos en el Navbar.

## 2. Cambios en el Backend (API)

### 2.1 Modelo Message — Eliminar campo `subject`

**Archivo:** `api/models/message.model.js`

Eliminar el campo `subject` del schema. Los mensajes solo tendran `body` como contenido textual, simulando un chat.

**Schema resultante:**

- `sender` — ObjectId ref User (required)
- `receiver` — ObjectId ref User (required)
- `body` — String (required, trim)
- `read` — Boolean (default: false)
- timestamps: solo `createdAt`

### 2.2 Popular sender/receiver en mensajes

**Archivo:** `api/controllers/users.controller.js` — funcion `detail`

Cuando se populan `sentMessages` y `receivedMessages` (perfil propio / ruta "me"), hacer un populate anidado de los campos `sender` y `receiver` con select de `name avatarUrl`.

Esto permitira al frontend construir la lista de conversaciones sin peticiones adicionales.

### 2.3 Fix bug en `destroyMessage`

**Archivo:** `api/controllers/users.controller.js` — funcion `destroyMessage`

Problemas corregidos:

1. Usaba `author` en la query pero el modelo no tiene ese campo; cambiado a `sender`
2. Faltaba `await` en `Message.findOne(...)` — sin await, `message` era un Query, no un documento
3. La logica ahora verifica que el sender sea el usuario autenticado (el emisor borra sus propios mensajes no leidos)

**Logica corregida:**

- Buscar mensaje donde `_id` = messageId, `sender` = usuario autenticado, `read` = false
- Si no existe -> 404
- Si existe -> eliminar y devolver 204

### 2.4 Nuevo endpoint: marcar mensaje como leido

**Archivo:** `api/controllers/users.controller.js` — funcion `markMessageAsRead`
**Ruta:** `PATCH /api/users/:id/messages/:messageId`

**Logica:**

- Buscar mensaje donde `_id` = messageId, `receiver` = usuario autenticado, `read` = false
- Si no existe -> 404
- Si existe -> marcar `read: true`, guardar y devolver el mensaje

## 3. Diseno de la UI

### 3.1 Layout general

```
+----------------------------------------------------------+
|                        Navbar                            |
+-----------------+----------------------------------------+
|  Panel izquierdo|         Panel derecho                  |
|  (conversaciones|         (chat activo)                  |
|   activas)      |                                        |
|                 |  +----------------------------------+  |
|  +-----------+  |  |  Header: avatar + nombre         |  |
|  | Conv 1  * |  |  +----------------------------------+  |
|  +-----------+  |  |                                  |  |
|  | Conv 2    |  |  |  Mensajes (scroll vertical)      |  |
|  +-----------+  |  |  - Burbujas alineadas            |  |
|  | Conv 3    |  |  |    izq (recibidos)                |  |
|  +-----------+  |  |    der (enviados)                 |  |
|                 |  |                                  |  |
|                 |  +----------------------------------+  |
|                 |  |  Input + boton enviar            |  |
|                 |  +----------------------------------+  |
+-----------------+----------------------------------------+
```

- **Panel izquierdo:** ancho fijo (~320px).
- **Panel derecho:** flex-1, ocupa el espacio restante.
- **Altura:** ambos paneles ocupan el viewport disponible (debajo del navbar) con scroll interno independiente.
- **No se requiere** diseno responsive para mobile.

### 3.2 Panel de conversaciones (izquierda)

Cada item de conversacion muestra:

- **Avatar** del otro usuario (imagen circular)
- **Nombre** del otro usuario
- **Preview** del ultimo mensaje (body truncado, ~50 chars)
- **Fecha** del ultimo mensaje (formato relativo: "hace 2h", "ayer", etc.)
- **Indicador de no leidos:** badge numerico visible si hay mensajes recibidos con `read: false`

**Ordenacion:** por `createdAt` del ultimo mensaje de cada conversacion (mas reciente primero).

**Conversacion seleccionada:** fondo destacado con borde indigo lateral.

**Estado vacio:** mensaje "No tienes conversaciones aun".

### 3.3 Panel de chat (derecha)

#### Header

- Avatar y nombre del otro usuario (clickeable, navega a `/users/:id`)
- Separador inferior

#### Area de mensajes

- Scroll vertical con auto-scroll al ultimo mensaje
- **Mensajes enviados** (sender === usuario en sesion): alineados a la derecha, fondo `indigo-500/20`
- **Mensajes recibidos:** alineados a la izquierda, fondo `slate-700/50`
- Cada burbuja muestra:
  - Texto del body
  - Hora (`HH:MM`) debajo del mensaje
  - **Boton eliminar** (icono papelera): visible solo en mensajes enviados por mi Y con `read === false`. Al hacer hover sobre el mensaje.

#### Confirmacion de eliminacion

Al pulsar eliminar, mostrar un popover de confirmacion inline con:

- Texto: "Eliminar mensaje?"
- Boton "Eliminar" (rojo) + "Cancelar"

#### Input de envio

- Input de texto
- Boton de enviar (icono)
- Enviar con Enter
- Deshabilitar boton si el input esta vacio

#### Estado sin conversacion seleccionada

Cuando no hay ninguna conversacion seleccionada, mostrar un estado vacio centrado: "Selecciona una conversacion para empezar".

#### Estado de conversacion vacia

Cuando se navega desde el perfil de un usuario pero no hay mensajes previos: mostrar el header con el nombre del usuario y el input listo para enviar el primer mensaje.

## 4. Navegacion y Rutas

### 4.1 Rutas

**Archivo:** `web/src/App.jsx`

```
/chat            -> Chat page sin conversacion seleccionada
/chat/:userId    -> Chat page con conversacion abierta con ese usuario
```

Rutas autenticadas dentro de `AuthenticatedLayout`.

### 4.2 Puntos de entrada

1. **Navbar:** Icono de chat (burbuja de mensaje) con badge numerico de mensajes no leidos. Navega a `/chat`.
2. **Pagina de perfil de usuario (`/users/:id`):** Boton "Enviar mensaje" que navega a `/chat/:userId`.

## 5. Logica de Negocio (Frontend)

### 5.1 Construccion de conversaciones

A partir de los arrays `sentMessages` y `receivedMessages` del usuario autenticado:

1. Combinar ambos arrays en uno solo
2. Agrupar por "el otro usuario" (si soy sender -> agrupar por receiver; si soy receiver -> agrupar por sender)
3. Dentro de cada grupo, ordenar mensajes por `createdAt` ascendente (mas antiguo primero)
4. Ordenar las conversaciones por el `createdAt` del ultimo mensaje (mas reciente primero)

### 5.2 Marcar mensajes como leidos

**Endpoint:** `PATCH /api/users/:id/messages/:messageId`

**Logica:** Marcar `read: true` solo si el receptor es el usuario autenticado.

**Trigger:** Cuando el usuario abre una conversacion, marcar automaticamente como leidos todos los mensajes recibidos de esa conversacion.

### 5.3 Contador de no leidos (Navbar)

Contar los mensajes en `receivedMessages` donde `read === false`. El navbar hace polling cada 15 segundos para actualizar el badge.

### 5.4 Polling cada 5 segundos (en chat page)

Implementar un `useEffect` con `setInterval` de 5000ms que:

1. Re-solicite los datos del usuario autenticado (`getProfile`)
2. Actualice la lista de conversaciones y el chat activo si hay nuevos mensajes
3. **Limpie el intervalo** al desmontar el componente

### 5.5 Envio de mensaje

1. Llamar a `sendMessage(userId, { body })`
2. Recargar la conversacion
3. Limpiar el input
4. Hacer scroll al nuevo mensaje

### 5.6 Eliminacion de mensaje

1. Mostrar popover de confirmacion
2. Si confirma -> llamar a `deleteMessage(userId, messageId)`
3. Recargar la conversacion
4. Si falla (ej: ya fue leido) -> recargar

## 6. Archivos

### Archivos creados

- `web/src/pages/chat-page.jsx` — Pagina principal del chat
- `web/src/components/conversation-list.jsx` — Panel izquierdo con lista de conversaciones
- `web/src/components/conversation-item.jsx` — Item individual de conversacion
- `web/src/components/chat-view.jsx` — Panel derecho con el chat activo
- `web/src/components/message-bubble.jsx` — Burbuja individual de mensaje
- `web/src/hooks/use-messages.js` — Hook para obtener y gestionar mensajes (polling incluido)

### Archivos modificados

- `api/models/message.model.js` — Eliminado campo `subject`
- `api/controllers/users.controller.js` — Fix destroyMessage, populate anidado, nuevo endpoint markMessageAsRead
- `api/config/routes.config.js` — Anadida ruta PATCH para marcar como leido
- `web/src/services/api-service.js` — Anadida funcion `markMessageAsRead`
- `web/src/App.jsx` — Anadidas rutas `/chat` y `/chat/:userId`
- `web/src/components/navbar.jsx` — Anadido icono de chat con badge de no leidos
- `web/src/pages/user-page.jsx` — Anadido boton "Enviar mensaje"

## 7. Estilo visual

Sigue la paleta existente del proyecto:

- Fondos: `slate-800/50`, `slate-900`
- Bordes: `slate-700/50`
- Acentos: `indigo-500`, `indigo-400`
- Glassmorphism: `backdrop-blur-xl`
- Bordes redondeados: `rounded-2xl` (cards), `rounded-xl` (botones), `rounded-full` (avatares en chat)
- Transiciones: `transition-all duration-200`

## 8. Verificacion

1. Navegar a `/chat` — ver lista vacia o con conversaciones
2. Navegar a `/chat/:userId` — ver conversacion con ese usuario
3. Enviar un mensaje — aparece en la conversacion al instante
4. Eliminar un mensaje no leido propio — confirmacion + desaparece
5. Intentar eliminar un mensaje ya leido — no debe aparecer el boton
6. Verificar badge en navbar refleja los mensajes no leidos
7. Esperar 5+ segundos — verificar que mensajes nuevos aparecen por polling
