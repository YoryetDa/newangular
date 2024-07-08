# Usa una imagen base de Node.js 20 para construir la aplicación Angular
FROM node:20 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Verifica la versión de Node.js (opcional)
RUN node -v

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Compila la aplicación Angular
RUN npm run build --production

# Usa una imagen base de Nginx para servir la aplicación Angular
FROM nginx:alpine

# Copia los archivos compilados desde la imagen anterior
COPY --from=build /app/dist/mimedisan/browser /usr/share/nginx/html

# Copia la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expon el puerto 80 para el contenedor
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
