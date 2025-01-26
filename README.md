# ScreenNet

ScreenNet es una aplicación web para la gestión de carteleras digitales de locales comerciales.
Permite a los comercios mostrar sus productos y servicios, con la posibilidad de cambiar el contenido en tiempo real.

## Características

- Gestión de productos
- Gestión de pantallas de locales
- Gestión de usuarios
- Creación de plantillas para pantallas

## Tecnologías utilizadas

- Next.js
- TailwindCSS
- Strapi
- ShadCN

## ¿Cómo funciona el manejo de los productos?

El sistema de gestión de productos utiliza una arquitectura centralizada con las siguientes características:

### Almacenamiento y Estado
- Utiliza Zustand como gestor de estado global
- Implementa persistencia local mediante localStorage
- Mantiene un caché de productos para optimizar el rendimiento

### Flujo de Datos
1. **Obtención Inicial**:
   - Los productos se cargan desde Strapi API al montar la aplicación
   - Se implementa paginación (100 items por página) para manejar grandes cantidades de datos
   - Los datos se almacenan en el store de Zustand y se persisten en localStorage

2. **Actualización Automática**:
   - Sistema de polling cada 60 segundos
   - Verifica cambios en productos consultando solo los actualizados desde última sincronización
   - Actualización selectiva de productos modificados para optimizar rendimiento

3. **Manejo de Componentes**:
   - Los componentes acceden a los productos a través de ProductContext
   - Context Provider envuelve la aplicación proporcionando acceso uniforme a los datos
   - Implementa estados de carga y error unificados

4. **Estrategia de Fallback**:
   - Si un producto no se encuentra en caché, intenta obtenerlo individualmente
   - Si falla, recurre a una actualización completa del catálogo
   - Sistema de reintentos automáticos para garantizar consistencia

5. **Optimizaciones**:
   - Caché local para reducir llamadas a API
   - Actualizaciones selectivas para minimizar transferencia de datos
   - Manejo de errores robusto con estados de fallback
   - Limpieza automática de datos obsoletos

## En desarrollo:
### Productos
- [✔️] CRUD de productos
  - [✔️] Los precios pueden variar entre tipos de productos (unidad, kilo, porción)
  - [✔️] Poder cambiar el precio de una categoría/subcategoría fijando un porcentaje sobre el precio original
  - [✔️] Subir fotos de los productos desde el editor
  - [✔️] Importar y exportar productos desde un archivo Excel
  - [❌] Mejorar funcionamiento y comportamiento del drawer (editor) de productos
  - [❌] Poder agregar/modificar/eliminar categorías/subcategorías
  
### Marcas
- [✔️] CRUD de marca con personalización de colores, tipografía y logo

### Pantallas
- [✔️] CRUD de pantallas
  - [✔️] Crear un sistema de edición para las pantallas (asignando plantillas a pantallas)
  - [❌] En el editor de pantallas, poder establecer fechas específicas para que una plantilla se aplique en un rango de fechas (ej.: Black Friday, Navidad, etc.)
  - [❌] Poder seleccionar una pantalla para entrar en modo pantalla completa
  - [❌] Sistema de programación de contenido por fechas
  

### Plantillas
  - [✔️] CRUD de plantillas
  - [✔️] Crear un sistema de edición para las plantillas (asignando productos a plantillas)
  - [❌] Modo pantalla completa
  - [❌] Transiciones entre contenidos
  - [❌] Poder elegir modo claro o oscuro
  - [✔️] Mostrar vista previa de cada componente (resuelto con un popover)
  - [✔️] Elegir tipografía para titulos y texto de la plantilla
  - [❌] Elegir colores para la tipografía y fondos de componentes
  - [❌] Drag and drop de componentes en el grid
  - [❌] Poder establecer mejor el tamaño de los componentes
  - [❌] Bug que permite componentes de más filas de las permitidas


### Locales
- [❌] CRUD de locales
  - [❌] Crear un sistema de edición para los locales (asignando pantallas a locales)

### Usuarios
- [❌] CRUD de usuarios
  - [❌] Crear un sistema de edición para los usuarios (asignando roles a usuarios)

### Generales
- [✔️] Generar dinámicamente JPG de vista previa de pantallas, plantillas y modulos > Se resolvió mostrando el componente
- [❌] Podemos usar Framer Motion para animar el cambio de contenido
- [❌] Podemos usar driver.js para mostrar un tutorial de uso de la aplicación
- [❌] Demasiadas peticiones a la API local, se puede mejorar con un sistema de caché
  
### Analíticas y Reportes
- [❌] Dashboard con estadísticas de uso
- [❌] Registro de tiempo de visualización
- [❌] Reportes de rendimiento
- [❌] Exportación de datos

### Seguridad
- [❌] Autenticación de dos factores
- [❌] Registro de actividad (logs)
- [❌] Control de acceso basado en roles
- [❌] Backups automáticos