# Wayu Taya — Sistema de Gestión de Procesos

Aplicación web (SPA) para la **Fundación Wayuu Taya** que centraliza la gestión
operativa de la organización: donaciones, inventario, medicamentos, almacenes,
documentos, personas, eventos, proveedores, usuarios y auditoría.

El proyecto está construido con **React 19 + TypeScript + Vite**, **Tailwind CSS 4**,
**React Router 8**, **TanStack Query v5**, **Zustand**, **React Hook Form + Zod**,
**Axios**, **Recharts** y **xlsx**.

> Nota: el módulo de **Salud** es el área principal y más desarrollada. Los módulos
> de **Agua**, **Alimentos** y **Música** existen como rutas, pero están en desarrollo.

---

## 1. El problema principal

### Problema de negocio

La fundación necesitaba gestionar de forma **centralizada y trazable** los procesos
que antes se repartían entre planillas, archivos sueltos y comunicación informal:

- Las donaciones no tenían un registro único asociado a lotes, almacenes y proveedores.
- El inventario de medicamentos e insumos no reflejaba con claridad existencias,
  vencimientos ni movimientos entre almacenes.
- Los documentos de personas y organizaciones quedaban dispersos y sin control de acceso.
- No existía una visión consolidada (KPIs, tendencias, stock crítico) para tomar decisiones.
- No había registro de quién modificaba qué, ni control por roles.

### Problema técnico (foco del plan de correcciones)

El módulo de Salud, al ser el más crítico, concentraba fallos que afectaban la entrega:

- Errores silenciosos: las acciones fallidas no mostraban feedback al usuario.
- Peticiones duplicadas al cambiar filtros o periodos.
- Fechas desfasadas por conversión a UTC (la fecha "por defecto" saltaba al día siguiente).
- Invalidación de caché inconsistente: refetch innecesarios o datos desactualizados.
- Uso de `key={index}` en listas dinámicas, provocando mezcla de estado en los formularios.
- Dependencias invertidas entre servicios y páginas.
- Dashboard de Salud incompleto, sin alertas de vencimiento/stock ni reportes filtrados.
- Ausencia de interfaz de auditoría para administradores.

---

## 2. Cómo se resolvió

La solución fue consolidar todo en una SPA con una arquitectura por capas, una
sesión segura y un manejo uniforme de datos y errores:

- **Un único punto de acceso** a la API mediante un cliente Axios que normaliza las
  respuestas en un sobre común (`success`, `statusCode`, `message`, `data`).
- **Los servicios no lanzan excepciones**: devuelven siempre el sobre, de modo que las
  páginas deciden cómo mostrar el resultado. Los errores de red, validación, sesión y
  servidor se normalizan con mensajes claros.
- **Interceptores de Axios** que inyectan el token, notifican éxitos/errores con
  `toast` y manejan el refresco de sesión.
- **Sesión endurecida**: el access token vive solo en memoria y el refresh token se
  guarda en `sessionStorage`. El refresh token **rota** en cada renovación y se usa una
  **única promesa compartida** para evitar que varias peticiones concurrentes revoquen
  la sesión.
- **Rutas protegidas** por sesión (`ProtectedRouter`) y por rol (`RequireRole`).
- **TanStack Query** para cachear y sincronizar datos, con invalidación **solo cuando la
  operación fue exitosa** y claves de consulta reutilizables.
- **React Hook Form + Zod** para validación de formularios y cargas masivas, con reglas
  compartidas con el backend.
- **Formateo unificado de fechas** para evitar desfases de zona horaria.
- **Tablas reutilizables** con paginación, filtros, columnas configurables y claves
  estables por fila.
- **Reportes y exportaciones** a Excel con filtros por rango, proveedor, lote o almacén.
- **Auditoría** de cambios restringida a administradores.

---

## 3. Módulos del sistema

| Módulo | Ruta base | Funcionalidad |
|---|---|---|
| **Inicio** | `/` | Selección de áreas del sistema y cierre de sesión. |
| **Salud** | `/salud` | Dashboard con KPIs, tendencia de donaciones, distribución por almacén, productos más donados y alertas de vencimiento/stock. |
| Donaciones | `/salud/donaciones` | Registro, edición, eliminación, filtros, resumen, descarga de notas/certificados, plantilla y carga masiva. |
| Inventario | `/salud/inventario` | Existencias por medicina y almacén, historial paginado, traslados entre almacenes, detalles por lote y alertas. |
| Medicamentos e Insumos | `/salud/medicamentos` | Catálogo de medicamentos, categorías, presentaciones, carga masiva desde plantilla. |
| Almacenes | `/salud/almacenes` | Gestión de almacenes, capacidad y ocupación. |
| Reportes | `/salud/reportes` | Métricas del periodo, gráficas y exportaciones de donaciones, inventario y almacén. |
| **Documentos** | `/documentos` | Gestión documental de la fundación. |
| Personas | `/documentos/personas` | Registro de personas (naturales y representantes legales). |
| Eventos | `/documentos/eventos` | Agenda y agrupación de eventos. |
| Documentos | `/documentos/documentos` | Carga, descarga, vista y eliminación de archivos (PDF, DOC, PNG). |
| Proveedores e Instituciones | `/documentos/proveedores` | Catálogo de proveedores e instituciones asociadas. |
| **Usuarios** | `/usuarios` | Gestión de cuentas, roles, restablecimiento de contraseña. Solo Super Admin y Administrador. |
| **Auditoría** | `/auditoria` | Registro de cambios filtrable por entidad, acción, usuario y fecha. Solo Super Admin y Administrador. |
| **Perfil** | `/perfil` | Datos del usuario autenticado y cambio de contraseña. |
| **Agua** | `/agua` | En desarrollo. |
| **Alimentos** | `/alimentos` | En desarrollo. |
| **Música** | `/musica` | En desarrollo. |

### Roles

| Rol | Alcance |
|---|---|
| **Super Admin** | Acceso total, incluida la gestión de usuarios y la auditoría. |
| **Administrador** | Gestión operativa y de usuarios; acceso a auditoría. |
| **Usuarios** | Acceso a los módulos operativos según lo permita la API. |

> El frontend **oculta** acciones y rutas según el rol, pero no es la fuente de
> autorización: la API es la que valida y responde `403` cuando corresponde.

---

## 4. Arquitectura

La aplicación sigue una separación por capas y por dominio:

```
src/
├── pages/            # Pantallas por dominio (salud, documentos, usuarios, auth...)
│   └── <dominio>/    # Componentes, hooks, stores y definición de columnas del dominio
├── components/       # UI reutilizable (tablas, formularios, diálogos, loaders...)
│   └── ui/           # Componentes base estilo shadcn/Radix
├── services/         # Cliente Axios, servicios e interfaces por dominio
├── hooks/            # Utilidades y lógica compartida
├── store/            # Estado global de sesión (Zustand)
├── layout/           # Layout, sidebar, header y guardas de navegación
├── lib/              # Query client, roles, validaciones, utilidades, subida de archivos
├── utils/            # Formateadores de fecha, número y moneda
└── assets/           # Imágenes y logos
```

### Capa de servicios

- `services/api.service.ts`: cliente Axios y funciones `getDataApi`, `postDataApi`,
  `putDataApi`, `deleteDataApi`, además de variantes para archivos.
- `services/interceptors.tsx`: inyección de `Authorization`, notificaciones y refresco
  de sesión.
- Cada dominio tiene su `.service.ts` y su `.interface.ts` con los contratos de datos.
- Todas las respuestas usan el sobre `BaseResponse<T>`.

### Capa de estado y datos

- **TanStack Query** para datos del servidor: cache, reintentos controlados, paginación
  y sincronización tras mutaciones.
- **Zustand** para estado de UI (filtros, paginación) y para la sesión.

### Convenciones del proyecto

| Sufijo | Propósito |
|---|---|
| `*.hook.ts` | Hooks de React Query y lógica del dominio. |
| `*.store.ts` | Stores de Zustand para filtros/paginación de UI. |
| `*.data.tsx` | Definición de columnas de tablas y opciones de menú. |
| `*.interface.ts` | Tipos y contratos de datos del servicio. |
| `*.service.ts` | Llamadas a la API del dominio. |

### Seguridad y sesión

- El **access token** solo vive en memoria (se pierde al recargar).
- El **refresh token** se guarda en `sessionStorage` y se recupera al arrancar mediante
  `hydrate()`.
- El refresh token **rota** en cada renovación; se guardan siempre ambos tokens.
- Ante un fallo irrecuperable se limpian el store, la caché de TanStack Query y la
  sesión, y se redirige al login.
- Las rutas privadas esperan la hidratación antes de renderizar, evitando parpadeos del
  contenido protegido.

### Manejo de errores

- Los servicios devuelven el sobre de la API en vez de lanzar excepciones.
- Los interceptores muestran avisos globales (`toast`) con el mensaje normalizado del
  backend, incluido el detalle de validación por campo.
- Las mutaciones invalidan la caché **solo en caso de éxito**, evitando recargas
  innecesarias tras un fallo.

---

## 5. Documentación relacionada

- `PLAN_CORRECCIONES_FRONTEND.md`: plan detallado de correcciones del módulo Salud
  (bugs, mejoras de rendimiento y funcionalidades añadidas).
- Repositorio del backend: `../wayu-taya-api`, con su propio
  `PLAN_CORRECCIONES_BACKEND.md`.
