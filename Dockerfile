# Usa una imagen base de Node.js 18 para construir la aplicación Angular
FROM node:18 AS build

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
RUN npm run build -- --configuration production

# Usa una imagen base de Apache para servir la aplicación Angular
FROM httpd:2.4

# Copia los archivos compilados desde la imagen anterior
COPY --from=build /app/dist/mimedisan /usr/local/apache2/htdocs/

# Expon el puerto 80 para el contenedor
EXPOSE 80

# Comando para ejecutar Apache
CMD ["httpd-foreground"]
