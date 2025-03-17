# ALGORITCOM TEST GUILLEM PEDRET

¡Bienvenido a este proyecto intergaláctico! En este repositorio encontrarás todo lo necesario para comenzar a hackear la matriz. Para facilitar el proceso, he configurado un Makefile con comandos predefinidos. ¡Sigue estos pasos para que tu setup esté listo en un instante!

## Introducción

Este proyecto está diseñado para facilitar la puesta en marcha de un entorno de desarrollo moderno. Utiliza un Makefile que simplifica la instalación y ejecución a través de comandos como `make welcome` y `make start`. Sigue las instrucciones a continuación para que tu setup sea compatible y funcione sin problemas.

---

## Requisitos Previos

- **Node.js:** Se recomienda utilizar la versión LTS actual. La que he usado yo es la 20.15.0.
- **npm:** Incluido con Node.js.
- **Make:** Asegúrate de tener Make instalado en tu sistema para ejecutar los comandos automatizados.

---

## Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/Guillem231/algoritcom_test.git algoritcom_test_guillem
   cd algoritcom_test_guillem
   ```

2. **Primera ejecución:**
   Para instalar todas las dependencias y arrancar el proyecto por primera vez, ejecuta:
   ```
   make welcome
   ```
   Este comando instalará todas las dependencias necesarias y arrancará el proyecto correctamente.

3. **Ejecuciones posteriores:**
   Para iniciar el proyecto en futuras ocasiones, simplemente ejecuta:
   ```
   make start
   ```

## Controles del Juego

Este proyecto incluye un avatar 3D interactivo con los siguientes controles:

### Movimiento Básico
- **WASD / Teclas de flecha**: Mover el personaje
- **Espacio**: Saltar
- **Shift**: Correr (aumenta la velocidad)

### Acciones Especiales
- **C**: Bailar (realiza una animación de baile)
- **E**: Montar/Desmontar Skateboard (cuando estés cerca de uno)

### Control de Cámara
- **Botón Derecho del Ratón**: Cambiar entre modo de cámara automática y manual
  - **Modo Automático**: La cámara sigue al personaje automáticamente
  - **Modo Manual**: Controlas la cámara libremente
    - **Clic + Arrastrar**: Orbitar la cámara alrededor del personaje
    - **Rueda del Ratón**: Acercar/Alejar (zoom)

### Características Especiales
- **Skateboard**: Acércate al skateboard y presiona E para montarlo. Mientras estás en el skateboard:
  - El movimiento es más fluido y rápido
  - La cámara se ajusta para una mejor visualización
  - Presiona E nuevamente para desmontar

La interfaz de usuario muestra el modo de cámara actual en la esquina superior derecha y todos los controles disponibles en la esquina inferior izquierda para referencia rápida.

