
    DELIMITER ;

    DROP DATABASE IF EXISTS `RECON`;
    CREATE DATABASE `RECON`; 
    USE `RECON`;

    
    SET NAMES utf8 ;
    SET character_set_client = utf8mb4 ;
    SET time_zone = '-5:00';

    CREATE TABLE puntos_agiles (
        id_ap INT AUTO_INCREMENT NOT NULL,
        ap INT,
        PRIMARY KEY(id_ap)
    );


    CREATE TABLE capacidad_equipo (
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


    CREATE TABLE proyecto (
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


    CREATE TABLE iteracion(
        id_iteracion INT AUTO_INCREMENT NOT NULL,
        id_proyecto INT NOT NULL,
        id_capacidad INT NOT NULL,
        num_iteracion INT NOT NULL,
        descripcion VARCHAR(1000),
        fecha_inicio DATE,
        fecha_fin DATE,
        estado_iteracion BIT,
        iteracion_terminada BIT,
        total_min_real DECIMAL(5,1),
        total_min_maximo DECIMAL(5,1),
        PRIMARY KEY(id_iteracion),
        FOREIGN KEY(id_proyecto) REFERENCES proyecto(id_proyecto),
        FOREIGN KEY(id_capacidad) REFERENCES capacidad_equipo(id_capacidad)
    );


    CREATE TABLE departamento (
        id_departamento INT AUTO_INCREMENT NOT NULL,
        nombre_departamento VARCHAR(64),
        PRIMARY KEY(id_departamento)
    );

    CREATE TABLE proyecto_departamento (
        id_proyecto INT NOT NULL,
        id_departamento INT NOT NULL,
        PRIMARY KEY(id_proyecto, id_departamento), 
        FOREIGN KEY(id_proyecto) REFERENCES proyecto(id_proyecto),
        FOREIGN KEY(id_departamento) REFERENCES departamento(id_departamento)
    );

    CREATE TABLE empleado (
        id_empleado INT AUTO_INCREMENT NOT NULL,
        usuario VARCHAR(14),
        correo VARCHAR(50),
        contrasena VARCHAR(100),
        nombre_empleado VARCHAR(64),
        imagen_empleado VARCHAR(400),
        PRIMARY KEY(id_empleado)
    );


    CREATE TABLE empleado_iteracion (
        id_empleado INT NOT NULL,
        id_iteracion INT NOT NULL,
        horas_semanales INT,
        PRIMARY KEY(id_empleado, id_iteracion),
        FOREIGN KEY(id_empleado) REFERENCES empleado(id_empleado),
        FOREIGN KEY(id_iteracion) REFERENCES iteracion(id_iteracion)
    );

    CREATE TABLE fase (
        id_fase INT AUTO_INCREMENT NOT NULL,
        nombre_fase VARCHAR(64),
        PRIMARY KEY(id_fase)
    );


    CREATE TABLE tarea (
        id_tarea INT AUTO_INCREMENT NOT NULL,
        nombre_tarea VARCHAR(64),
        PRIMARY KEY(id_tarea)
    );


    CREATE TABLE proyecto_fase_tarea (
        id_proyecto INT NOT NULL,
        id_fase INT NOT NULL,
        id_tarea INT NOT NULL,
        PRIMARY KEY(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_proyecto) REFERENCES proyecto(id_proyecto),
        FOREIGN KEY(id_fase) REFERENCES fase(id_fase),
        FOREIGN KEY(id_tarea) REFERENCES tarea(id_tarea)
    );


    CREATE TABLE ap_colaborador (
        id_proyecto INT NOT NULL, 
        id_fase INT NOT NULL, 
        id_tarea INT  NOT NULL,
        id_ap INT NOT NULL, 
        id_empleado INT NOT NULL,
        minutos DECIMAL(5, 1),
        PRIMARY KEY(id_proyecto, id_fase, id_tarea, id_ap, id_empleado),
        FOREIGN KEY(id_proyecto, id_fase, id_tarea) REFERENCES proyecto_fase_tarea(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_ap) REFERENCES puntos_agiles(id_ap),
        FOREIGN KEY(id_empleado) REFERENCES empleado(id_empleado)
    );


    CREATE TABLE ap_promedios(
        id_proyecto INT NOT NULL, 
        id_fase INT NOT NULL, 
        id_tarea INT  NOT NULL,
        id_ap INT NOT NULL,
        promedio_minutos DECIMAL(5, 1), 
        FOREIGN KEY(id_proyecto, id_fase, id_tarea) REFERENCES proyecto_fase_tarea(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_ap) REFERENCES puntos_agiles(id_ap)
    );


    CREATE TABLE casos_uso(
        id_casos INT AUTO_INCREMENT NOT NULL, 
        numero_cu INT,
        id_ap INT NOT NULL, 
        id_iteracion INT NOT NULL,
        yo_como VARCHAR(64),
        quiero VARCHAR(255), 
        para VARCHAR(255), 
        comentario VARCHAR(255), 
        real_minutos DECIMAL(5,1),
        max_minutos_caso_uso DECIMAL(5,1),
        porcentaje_avance DECIMAL(3, 2), 
        PRIMARY KEY(id_casos), 
        FOREIGN KEY(id_ap) REFERENCES puntos_agiles(id_ap), 
        FOREIGN KEY(id_iteracion) REFERENCES iteracion(id_iteracion)
    );


    CREATE TABLE entrega (
        id_proyecto INT NOT NULL,
        id_fase INT NOT NULL,
        id_tarea INT NOT NULL, 
        id_casos INT NOT NULL, 
        nombre VARCHAR(150), 
        entrega_real DATE, 
        estimacion DECIMAL(5, 2), 
        valor_ganado DECIMAL(5, 2), 
        costo_real DECIMAL(5, 2), 
        estado_entrega VARCHAR(20), 
        id_airtable VARCHAR(25),
        PRIMARY KEY(id_proyecto, id_fase ,id_tarea, id_casos),
        FOREIGN KEY(id_proyecto, id_fase, id_tarea) REFERENCES proyecto_fase_tarea(id_proyecto, id_fase, id_tarea),
        FOREIGN KEY(id_casos) REFERENCES casos_uso(id_casos)
    );

    DROP TRIGGER IF EXISTS set_current_date_proyecto;
    DELIMITER //
    CREATE TRIGGER set_current_date_proyecto BEFORE INSERT ON proyecto
    FOR EACH ROW
    BEGIN
        SET NEW.fecha_inicio = (SELECT CURRENT_DATE());
    END //

    DROP PROCEDURE IF EXISTS set_horas_productivas;
    DELIMITER //
    CREATE PROCEDURE set_horas_productivas(
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



    DROP PROCEDURE IF EXISTS elimina_tarea;
    DELIMITER //
    CREATE PROCEDURE elimina_tarea(
        IN SPid_proyecto INT,
        IN SPid_fase INT,
        IN SPid_tarea INT
    )
    BEGIN
    DELETE FROM ap_promedios WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase AND id_tarea = SPid_tarea;
    DELETE FROM ap_colaborador WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase AND id_tarea = SPid_tarea;
    DELETE FROM proyecto_fase_tarea WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase AND id_tarea = SPid_tarea;
    END //


    DROP PROCEDURE IF EXISTS elimina_fase;
    DELIMITER //
    CREATE PROCEDURE elimina_fase(
        IN SPid_proyecto INT,
        IN SPid_fase INT
    )
    BEGIN
    DELETE FROM ap_promedios WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase;
    DELETE FROM ap_colaborador WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase;
    DELETE FROM proyecto_fase_tarea WHERE id_proyecto = SPid_proyecto AND id_fase = SPid_fase;
  	END //

    DROP TRIGGER IF EXISTS campos_promedios;
    DELIMITER //
    CREATE TRIGGER campos_promedios AFTER INSERT ON proyecto_fase_tarea
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


    DROP TRIGGER IF EXISTS ap_empleados_1;
    DELIMITER //
    CREATE TRIGGER ap_empleados_1 AFTER INSERT ON proyecto_fase_tarea
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 1, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER IF EXISTS ap_empleados_2;
    DELIMITER //
    CREATE TRIGGER ap_empleados_2 AFTER INSERT ON proyecto_fase_tarea
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN 
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 2, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion; 
        END IF;
    END //

    DROP TRIGGER IF EXISTS ap_empleados_3;
    DELIMITER //
    CREATE TRIGGER ap_empleados_3 AFTER INSERT ON proyecto_fase_tarea
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 3, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER IF EXISTS ap_empleados_4;
    DELIMITER //
    CREATE TRIGGER ap_empleados_4 AFTER INSERT ON proyecto_fase_tarea
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 4, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER IF EXISTS ap_empleados_5;
    DELIMITER //
    CREATE TRIGGER ap_empleados_5 AFTER INSERT ON proyecto_fase_tarea
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 5, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER IF EXISTS ap_empleados_6;
    DELIMITER //
    CREATE TRIGGER ap_empleados_6 AFTER INSERT ON proyecto_fase_tarea
    FOR EACH ROW
    BEGIN
        IF NEW.id_tarea > 0 THEN
            INSERT INTO ap_colaborador(id_proyecto, id_fase, id_tarea, id_ap, id_empleado, minutos)
            SELECT DISTINCT NEW.id_proyecto, NEW.id_fase, NEW.id_tarea, 6, id_empleado, 0
            FROM empleado_iteracion as EI, iteracion as I WHERE I.id_proyecto = NEW.id_proyecto AND EI.id_iteracion = I.id_iteracion;
        END IF;
    END //

    DROP TRIGGER IF EXISTS set_nombre_estimacion;
    DELIMITER //
    CREATE TRIGGER set_nombre_estimacion BEFORE INSERT ON entrega
    FOR EACH ROW
    BEGIN
        SET NEW.nombre =
        CONCAT("IT",
            (SELECT num_iteracion FROM iteracion I INNER JOIN casos_uso CU ON I.id_iteracion = CU.id_iteracion WHERE id_casos = NEW.id_casos),
            "-",
            (SELECT numero_cu FROM casos_uso WHERE id_casos = NEW.id_casos),
            " - ",
            (SELECT quiero FROM casos_uso WHERE id_casos = NEW.id_casos),
            " - ",
            (SELECT nombre_fase FROM fase WHERE id_fase = NEW.id_fase),
            " (",
            (SELECT nombre_tarea FROM tarea WHERE id_tarea = NEW.id_tarea),
            ")"
        );
    END //

    DROP TRIGGER IF EXISTS actualizar_nombre_estimacion;
    DELIMITER //
    CREATE TRIGGER actualizar_nombre_estimacion AFTER UPDATE ON casos_uso
    FOR EACH ROW
    BEGIN
        UPDATE entrega E SET E.nombre =
        CONCAT("IT",
            (SELECT num_iteracion FROM iteracion I WHERE I.id_iteracion = NEW.id_iteracion),
            "-",
            IFNULL(NEW.numero_cu, ""),
            " - ",
            NEW.quiero,
            " - ",
            (SELECT nombre_fase FROM fase F WHERE F.id_fase = E.id_fase),
            " (",
            (SELECT nombre_tarea FROM tarea T WHERE T.id_tarea = E.id_tarea),
            ")"
        ) WHERE E.id_casos = NEW.id_casos AND OLD.quiero <> NEW.quiero;
    END //


    DROP PROCEDURE IF EXISTS actualiza_tiempos;
    DELIMITER //
    CREATE PROCEDURE actualiza_tiempos(
        IN idProyecto INT,
        IN idEmpleado INT,
        IN idFase INT,
        IN idTarea INT,
        IN idAp INT,
        IN Xminutos INT
    )
    BEGIN
        UPDATE ap_colaborador SET minutos = Xminutos 
        WHERE id_proyecto = idProyecto AND id_empleado = idEmpleado AND id_fase = idFase AND id_tarea = idTarea AND id_ap = idAp;
        
        UPDATE ap_promedios SET promedio_minutos=
            (SELECT AVG(minutos) FROM ap_colaborador 
            WHERE id_proyecto=idProyecto AND id_fase= idFase AND id_tarea=idTarea AND id_ap=idAp)
        WHERE id_proyecto=idProyecto AND id_fase= idFase AND id_tarea=idTarea AND id_ap=idAp;
        
        UPDATE entrega SET estimacion = (SELECT cast(promedio_minutos/60 as decimal(5,2)) FROM ap_promedios WHERE id_proyecto = idProyecto AND id_fase = idFase AND id_tarea = idTarea AND id_ap = idAp)
        WHERE id_proyecto=idProyecto AND id_fase= idFase AND id_tarea=idTarea AND id_casos IN 
            (SELECT CU.id_casos 
            FROM casos_uso CU INNER JOIN iteracion I ON CU.id_iteracion = I.id_iteracion 
            WHERE CU.id_ap = idAp AND I.id_proyecto = idProyecto);

        DROP TEMPORARY TABLE IF EXISTS my_temp_table;
        CREATE TEMPORARY TABLE my_temp_table(
            i INT AUTO_INCREMENT,
            id_casos INT,
            PRIMARY KEY(i));

        INSERT INTO my_temp_table(id_casos) SELECT CU.id_casos
                            FROM casos_uso CU INNER JOIN entrega E ON CU.id_casos = E.id_casos 
                            WHERE CU.id_ap = idAp AND  E.id_proyecto = idProyecto AND E.id_fase = idFase AND E.id_tarea = idTarea;

        SET @nrows = 1;

        WHILE(@nrows <= (SELECT COUNT(*) FROM my_temp_table)) DO
            UPDATE casos_uso SET real_minutos = cast((SELECT SUM(estimacion) FROM entrega E WHERE E.id_casos = (SELECT id_casos FROM my_temp_table WHERE i = @nrows))* 60 as decimal (5,1))
            WHERE id_casos = (SELECT id_casos FROM my_temp_table WHERE i = @nrows);

            UPDATE iteracion SET total_min_real = cast((SELECT SUM(real_minutos) FROM casos_uso CU WHERE CU.id_iteracion = (SELECT id_iteracion FROM casos_uso WHERE id_casos = (SELECT id_casos FROM my_temp_table WHERE i = @nrows)))as decimal(5,1))
            WHERE id_iteracion = (SELECT id_iteracion FROM casos_uso WHERE id_casos = (SELECT id_casos FROM my_temp_table WHERE i = @nrows));

            SET @nrows = @nrows+1;
        END WHILE;

        
  	END //

    DELIMITER ;
