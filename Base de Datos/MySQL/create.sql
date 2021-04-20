
    
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
        imagen VARCHAR(400),
        fecha_inicio DATE,
        fecha_fin DATE,
        estado_proyecto BIT,
        proyecto_terminado BIT,
        API_key VARCHAR(50),
        base VARCHAR(50),
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
        iteracion_terminada BIT,
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
        contrasena VARCHAR(100),
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


    CREATE TABLE tarea (
        id_tarea INT AUTO_INCREMENT NOT NULL,
        nombre_tarea VARCHAR(64),
        PRIMARY KEY(id_tarea)
    );


    CREATE TABLE Proyecto_Fase_Practica (
        id_proyecto INT NOT NULL,
        id_fase INT NOT NULL,
        id_tarea INT NOT NULL,
        PRIMARY KEY(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
        FOREIGN KEY(id_fase) REFERENCES Fase(id_fase),
        FOREIGN KEY(id_tarea) REFERENCES tarea(id_tarea)
    );


    CREATE TABLE AP_Colaborador (
        id_proyecto INT NOT NULL, 
        id_fase INT NOT NULL, 
        id_tarea INT  NOT NULL,
        id_ap INT NOT NULL, 
        id_empleado INT NOT NULL,
        minutos DECIMAL(5, 1),
        PRIMARY KEY(id_proyecto, id_fase, id_tarea, id_ap, id_empleado),
        FOREIGN KEY(id_proyecto, id_fase, id_tarea) REFERENCES Proyecto_Fase_Practica(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap),
        FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado)
    );


    CREATE TABLE AP_Promedios(
        id_proyecto INT NOT NULL, 
        id_fase INT NOT NULL, 
        id_tarea INT  NOT NULL,
        id_ap INT NOT NULL,
        promedio_minutos DECIMAL(5, 1), 
        FOREIGN KEY(id_proyecto, id_fase, id_tarea) REFERENCES Proyecto_Fase_Practica(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap)
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
        id_proyecto INT NOT NULL,
        id_fase INT NOT NULL,
        id_tarea INT NOT NULL, 
        id_casos INT NOT NULL, 
        nombre VARCHAR(150), 
        entrega_real DATE, 
        estimacion DECIMAL(5, 2), 
        valor_ganado DECIMAL(5, 2), 
        costo_real DECIMAL(5, 2), 
        estado_entrega BIT, 
        PRIMARY KEY(id_proyecto, id_fase ,id_tarea, id_casos),
        FOREIGN KEY(id_proyecto, id_fase, id_tarea) REFERENCES Proyecto_Fase_Practica(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_casos) REFERENCES Casos_Uso(id_casos)
    );

        -- Calcular y Almacenar Horas Productivas
    DROP PROCEDURE IF EXISTS setHorasProductivas;
    DELIMITER //
    CREATE PROCEDURE setHorasProductivas(
        IN SP_id_capacidad INT,
        IN SP_id_iteracion INT
    )
    BEGIN
        UPDATE capacidad_equipo SET horas_productivas = cast(
            ((SELECT SUM(horas_semanales) FROM empleado_iteracion WHERE id_iteracion = SP_id_iteracion) *
            (1 - tiempo_perdido_pc - errores_registro_pc) * (1 - overhead_pc) * productivas_pc)
            as decimal(5,2)
        ) 
        WHERE id_capacidad = SP_id_capacidad;
    END //

    -- Elimina tarea con sus dependencias
    DROP PROCEDURE IF EXISTS eliminaTarea;
    DELIMITER //
    CREATE PROCEDURE eliminaTarea(
        IN SPid_proyecto INT,
        IN SPid_fase INT,
        IN SPid_tarea INT
    )
    BEGIN
    DELETE FROM ap_promedios WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase AND id_tarea = SPid_tarea;
    DELETE FROM ap_colaborador WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase AND id_tarea = SPid_tarea;
    DELETE FROM proyecto_fase_practica WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase AND id_tarea = SPid_tarea;
    END //

    -- Actualizar Promedios cuando Empleado actualiza su estimación 
    DROP TRIGGER promedio;
    DELIMITER //
    CREATE TRIGGER promedio AFTER UPDATE ON ap_colaborador
    FOR EACH ROW
    BEGIN
        UPDATE ap_promedios SET promedio_minutos=(SELECT AVG(minutos) FROM ap_colaborador WHERE id_proyecto=NEW.id_proyecto AND id_fase=NEW.id_fase AND id_tarea=NEW.id_tarea AND id_ap=NEW.id_ap) WHERE id_proyecto=NEW.id_proyecto AND id_fase=NEW.id_fase AND id_tarea=NEW.id_tarea AND id_ap=NEW.id_ap;
    END //

    -- Crear registros de promedios por AP cuando se relaciona/crea tarea con fase
    DROP TRIGGER CamposPromedios;
    DELIMITER //
    CREATE TRIGGER CamposPromedios AFTER INSERT ON Proyecto_Fase_Practica
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_promedios (id_proyecto, id_fase, id_tarea, id_ap, promedio_minutos) 
            VALUES
            (NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 1, 0),
            (NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 2, 0),
            (NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 3, 0),
            (NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 4, 0),
            (NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 5, 0),
            (NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 6, 0);
        END IF;
    END //

    -- Crear Registros para la tabla ap_colaborador
    DROP TRIGGER APempleados1;
    DELIMITER //
    CREATE TRIGGER APempleados1 AFTER INSERT ON proyecto_fase_practica
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 1, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER APempleados2;
    DELIMITER //
    CREATE TRIGGER APempleados2 AFTER INSERT ON proyecto_fase_practica
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN 
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 2, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion; 
        END IF;
    END //

    DROP TRIGGER APempleados3;
    DELIMITER //
    CREATE TRIGGER APempleados3 AFTER INSERT ON proyecto_fase_practica
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 3, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER APempleados4;
    DELIMITER //
    CREATE TRIGGER APempleados4 AFTER INSERT ON proyecto_fase_practica
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 4, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER APempleados5;
    DELIMITER //
    CREATE TRIGGER APempleados5 AFTER INSERT ON proyecto_fase_practica
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 5, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER APempleados6;
    DELIMITER //
    CREATE TRIGGER APempleados6 AFTER INSERT ON proyecto_fase_practica
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 6, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //       