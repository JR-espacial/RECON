    
    DROP DATABASE IF EXISTS `RECON`;
    CREATE DATABASE `RECON`; 
    USE `RECON`;
    
    SET NAMES utf8 ;
    SET character_set_client = utf8mb4 ;

    CREATE TABLE Puntos_Agiles (
        id_ap INT AUTO_INCREMENT NOT NULL,
        ap INT,
        PRIMARY KEY(id_ap)
    );


    CREATE TABLE Capacidad_Equipo (
        id_capacidad INT AUTO_INCREMENT NOT NULL,
        horas_nominales_totales DECIMAL(5, 2),
        horas_nominales_sin_ovh DECIMAL(5, 2),
        horas_nominales_restantes DECIMAL(5, 2),
        horas_productivas DECIMAL(5, 2),
        tiempo_perdido_pc DECIMAL(3, 2),
        errores_registro_pc DECIMAL(3, 2),
        overhead_pc DECIMAL(3, 2),
        productivas_pc DECIMAL(3, 2),
        operativos_pc DECIMAL(3, 2),
        humano_pc DECIMAL(3, 2),
        cmmi_pc DECIMAL(3, 2),
        PRIMARY KEY(id_capacidad)
    );


    CREATE TABLE Proyecto (
        id_proyecto INT AUTO_INCREMENT NOT NULL,
        nombre_proyecto VARCHAR(64),
        descripcion VARCHAR(1000),
        fecha_inicio DATE,
        fecha_fin DATE,
        PRIMARY KEY(id_proyecto)
    );


    CREATE TABLE Iteracion(
        id_iteracion INT AUTO_INCREMENT NOT NULL,
        id_proyecto INT NOT NULL,
        id_capacidad INT NOT NULL,
        num_iteracion INT NOT NULL,
        descripcion VARCHAR(1000),
        fecha_inicio DATE,
        fecha_fin DATE,
        estado_iteracion BIT,
        total_min_real INT,
        total_min_maximo INT,
        PRIMARY KEY(id_iteracion),
        FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
        FOREIGN KEY(id_capacidad) REFERENCES Capacidad_Equipo(id_capacidad)
    );


    CREATE TABLE Departamento (
        id_departamento INT AUTO_INCREMENT NOT NULL,
        nombre_departamento VARCHAR(64),
        PRIMARY KEY(id_departamento)
    );

    CREATE TABLE Proyecto_Departamento (
        id_proyecto INT NOT NULL,
        id_departamento INT NOT NULL,
        PRIMARY KEY(id_proyecto, id_departamento), 
        FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
        FOREIGN KEY(id_departamento) REFERENCES Departamento(id_departamento)
    );

    CREATE TABLE Empleado (
        id_empleado INT AUTO_INCREMENT NOT NULL,
        usuario VARCHAR(14),
        contrasena VARCHAR(16),
        nombre_empleado VARCHAR(64),
        PRIMARY KEY(id_empleado)
    );


    CREATE TABLE Empleado_Iteracion (
        id_empleado INT NOT NULL,
        id_iteracion INT NOT NULL,
        horas_semanales INT,
        PRIMARY KEY(id_empleado, id_iteracion),
        FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado),
        FOREIGN KEY(id_iteracion) REFERENCES Iteracion(id_iteracion)
    );

    CREATE TABLE Fase (
        id_fase INT AUTO_INCREMENT NOT NULL,
        nombre_fase VARCHAR(64),
        PRIMARY KEY(id_fase)
    );


    CREATE TABLE Practica_Trabajo (
        id_trabajo INT AUTO_INCREMENT NOT NULL,
        nombre_practica_trabajo VARCHAR(64),
        PRIMARY KEY(id_trabajo)
    );


    CREATE TABLE Proyecto_Fase_Practica (
        id_proyecto INT NOT NULL,
        id_fase INT NOT NULL,
        id_trabajo INT NOT NULL,
        PRIMARY KEY(id_proyecto, id_fase),
        FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
        FOREIGN KEY(id_fase) REFERENCES Fase(id_fase),
        FOREIGN KEY(id_trabajo) REFERENCES Practica_Trabajo(id_trabajo)
    );


    CREATE TABLE AP_Colaborador (
        id_trabajo INT  NOT NULL,
        id_empleado INT NOT NULL,
        id_ap INT NOT NULL, 
        min_minutos DECIMAL(5, 1),
        max_minutos DECIMAL(5, 1),
        PRIMARY KEY(id_trabajo, id_empleado, id_ap),
        FOREIGN KEY(id_trabajo) REFERENCES Practica_Trabajo(id_trabajo),
        FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado),
        FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap)
    );


    CREATE TABLE AP_Promedios(
        id_ap INT NOT NULL, 
        id_trabajo INT NOT NULL,
        promedio_min_minutos DECIMAL(5, 1),
        promedio_max_minutos DECIMAL(5, 1), 
        PRIMARY KEY(id_ap, id_trabajo), 
        FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap), 
        FOREIGN KEY(id_trabajo) REFERENCES Practica_Trabajo(id_trabajo)
    );


    CREATE TABLE Casos_Uso(
        id_casos INT AUTO_INCREMENT NOT NULL, 
        id_ap INT NOT NULL, 
        id_iteracion INT NOT NULL,
        yo_como VARCHAR(64),
        quiero VARCHAR(255), 
        para VARCHAR(255), 
        comentario VARCHAR(255), 
        real_minutos INT,
        max_minutos_caso_uso INT, 
        porcentaje_avance DECIMAL(3, 2), 
        PRIMARY KEY(id_casos), 
        FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap), 
        FOREIGN KEY(id_iteracion) REFERENCES Iteracion(id_iteracion)
    );


    CREATE TABLE Entrega (
        id_trabajo INT NOT NULL, 
        id_casos INT NOT NULL, 
        entrega_estimada DATE, 
        entrega_real DATE, 
        estimacion TIME, 
        valor_ganado DECIMAL(5, 2), 
        costo_real DECIMAL(5, 2), 
        estado_entrega BIT, 
        PRIMARY KEY(id_trabajo, id_casos),
        FOREIGN KEY(id_trabajo) REFERENCES Practica_Trabajo(id_trabajo),
        FOREIGN KEY(id_casos) REFERENCES Casos_Uso(id_casos)
    );
