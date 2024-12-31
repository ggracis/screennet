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

## En desarrollo:
### Productos
- [✔️] CRUD de productos
  - [✔️] Los precios pueden variar entre tipos de productos (unidad, kilo, porción)
  - [✔️] Poder cambiar el precio de una categoría/subcategoría fijando un porcentaje sobre el precio original
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

### Modulos
 

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