[![Contributors][contributors-shield]][contributors-url]
# RECON
### Deploy
http://recon-natdev.azurewebsites.net/users/login

### Installation
Al hacer el clone del repositorio es importante:
* Utilizar los scripts dentro de las carpetas "Base de Datos/MySQL". 
  * Para crear la estructura de la base de datos se utiliza el archivo "create.sql" que debe ejecutarse dentro del DBMS.
  * Para poblarla se ingresar a la nueva base de datos creada "RECON" y se ejecuta el script del archivo "poblar.sql".
* Una vez creada y poblada la base de datos es importante asegurarse de que esté activa.

* Para instalar todas las dependencias necesarias de la aplicación, desde una terminal se debe ingresar a la carpeta "Proyecto" en donde se deberá ejecutar el siguiente comando
```sh
  npm install
  ```
* Una vez finalizada la instalación de las dependencias desde la misma carpeta "Proyecto" se debe ejecutar el siguiente comando para encender el servidor
```sh
  npm start
  ```
* Desde cualquier navegador ingresar a la ruta "localhost:3000/users/login" e ingresar al sistema.

[contributors-shield]: https://img.shields.io/github/contributors/JR-espacial/RECON.svg?style=for-the-badge
[contributors-url]: https://github.com/JR-espacial/RECON/graphs/contributors
