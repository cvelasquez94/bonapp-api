# Utiliza una imagen base de Node.js con Alpine
FROM node:16-alpine

# Crea un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json (si está disponible)
COPY package*.json ./

# Instala las dependencias del proyecto
# Utiliza --production para omitir las dependencias de desarrollo
RUN npm install --production

# Copia los archivos y directorios del proyecto al contenedor
COPY . .

# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "src/core/server.js"]
