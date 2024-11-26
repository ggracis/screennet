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
  - [❌] Poder cambiar el precio de una categoría/subcategoría fijando un porcentaje sobre el precio original
  
### Marcas
- [✔️] CRUD de marca con personalización de colores, tipografía y logo

### Pantallas
- [✔️] CRUD de pantallas
  - [✔️] Crear un sistema de edición para las pantallas (asignando plantillas a pantallas)
  - [❌] En el editor de pantallas, poder establecer fechas específicas para que una plantilla se aplique en un rango de fechas (ej.: Black Friday, Navidad, etc.)

### Plantillas
- [✔️] CRUD de plantillas
  - [✔️] Crear un sistema de edición para las plantillas (asignando productos a plantillas)

### Modulos
 

### Locales
- [❌] CRUD de locales
  - [❌] Crear un sistema de edición para los locales (asignando pantallas a locales)

### Usuarios
- [❌] CRUD de usuarios
  - [❌] Crear un sistema de edición para los usuarios (asignando roles a usuarios)

### Generales
- [❌] Generar dinámicamente JPG de vista previa de pantallas, plantillas y modulos