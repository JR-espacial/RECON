IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Entrega')
DROP TABLE   Entrega

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Casos_Uso')
DROP TABLE Casos_Uso

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AP_Promedios')
DROP TABLE AP_Promedios

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AP_Colaborador')
DROP TABLE AP_Colaborador

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Proyecto_Fase_Practica')
DROP TABLE Proyecto_Fase_Practica

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tarea')
DROP TABLE tarea

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Fase')
DROP TABLE Fase

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Empleado_Iteracion')
DROP TABLE Empleado_Iteracion

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Empleado')
DROP TABLE Empleado


IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Proyecto_Departamento')
DROP TABLE Proyecto_Departamento;

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Departamento')
DROP TABLE Departamento;

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Iteracion')
DROP TABLE Iteracion;

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Proyecto')
DROP TABLE  Proyecto;

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Capacidad_Equipo')
DROP TABLE Capacidad_Equipo;

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Puntos_Agiles')
DROP TABLE Puntos_Agiles;


--Puntos_Agiles

CREATE TABLE Puntos_Agiles (
    id_ap CHAR(4) NOT NULL,
    ap INT,
    PRIMARY KEY(id_ap)
);
BULK INSERT Equip01.Equip01.[Puntos_Agiles]
	FROM 'e:\wwwroot\Equip01\puntos_agiles.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Capacidad_Equipo

CREATE TABLE Capacidad_Equipo (
    id_capacidad CHAR(6) NOT NULL,
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
BULK INSERT Equip01.Equip01.[Capacidad_Equipo]
	FROM 'e:\wwwroot\Equip01\capacidad_equipo.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Proyecto

CREATE TABLE Proyecto (
	id_proyecto CHAR(6) NOT NULL,
    nombre_proyecto VARCHAR(64),
    descripcion VARCHAR(1000),
    fecha_inicio DATE,
	fecha_fin DATE,
    PRIMARY KEY(id_proyecto)
);
BULK INSERT Equip01.Equip01.[Proyecto]
	FROM 'e:\wwwroot\Equip01\proyecto.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Iteracion

CREATE TABLE Iteracion(
	id_iteracion CHAR(6) NOT NULL,
	id_proyecto CHAR(6) NOT NULL,
	id_capacidad CHAR(6) NOT NULL,
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
BULK INSERT Equip01.Equip01.[Iteracion]
	FROM 'e:\wwwroot\Equip01\iteracion.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Departamento

CREATE TABLE Departamento (
    id_departamento CHAR(6) NOT NULL,
    nombre_departamento VARCHAR(64),
    PRIMARY KEY(id_departamento)
);
BULK INSERT Equip01.Equip01.[Departamento]
	FROM 'e:\wwwroot\Equip01\departamento.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Proyecto_Departamento

CREATE TABLE Proyecto_Departamento (
    id_proyecto CHAR(6) NOT NULL,
    id_departamento CHAR(6) NOT NULL,
    PRIMARY KEY(id_proyecto, id_departamento), 
    FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
    FOREIGN KEY(id_departamento) REFERENCES Departamento(id_departamento)
);
BULK INSERT Equip01.Equip01.[Proyecto_Departamento]
	FROM 'e:\wwwroot\Equip01\proyecto_departamento.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Empleado

CREATE TABLE Empleado (
    id_empleado CHAR(6) NOT NULL,
	usuario VARCHAR(14),
    contrasena VARCHAR(16),
    nombre_empleado VARCHAR(64),
    PRIMARY KEY(id_empleado)
);
BULK INSERT Equip01.Equip01.[Empleado]
	FROM 'e:\wwwroot\Equip01\empleado.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Empleado_Iteracion

CREATE TABLE Empleado_Iteracion (
    id_empleado CHAR(6) NOT NULL,
    id_iteracion CHAR(6) NOT NULL,
    horas_semanales INT,
    PRIMARY KEY(id_empleado, id_iteracion),
    FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY(id_iteracion) REFERENCES Iteracion(id_iteracion)
);
BULK INSERT Equip01.Equip01.[Empleado_Iteracion]
	FROM 'e:\wwwroot\Equip01\empleado_iteracion.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Fase

CREATE TABLE Fase (
    id_fase CHAR(6) NOT NULL,
    nombre_fase VARCHAR(64),
    PRIMARY KEY(id_fase)
);
BULK INSERT Equip01.Equip01.[Fase]
	FROM 'e:\wwwroot\Equip01\fase.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--tarea

CREATE TABLE tarea (
	id_tarea CHAR(6) NOT NULL,
    nombre_tarea VARCHAR(64),
    PRIMARY KEY(id_tarea),
);
BULK INSERT Equip01.Equip01.[tarea]
	FROM 'e:\wwwroot\Equip01\tarea.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Proyecto_Fase_Practica

CREATE TABLE Proyecto_Fase_Practica (
	id_proyecto CHAR(6) NOT NULL,
    id_fase CHAR(6) NOT NULL,
	id_tarea CHAR(6)NOT NULL,
    PRIMARY KEY(id_proyecto, id_fase, id_tarea),
    FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
    FOREIGN KEY(id_fase) REFERENCES Fase(id_fase),
	FOREIGN KEY(id_tarea) REFERENCES tarea(id_tarea)
);
BULK INSERT Equip01.Equip01.[Proyecto_Fase_Practica]
	FROM 'e:\wwwroot\Equip01\proyecto_fase_practica.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--AP_Colaborador

CREATE TABLE AP_Colaborador (
    id_tarea CHAR(6) NOT NULL,
    id_empleado CHAR(6) NOT NULL,
    id_ap CHAR(4) NOT NULL, 
    min_minutos DECIMAL(5, 1),
    max_minutos DECIMAL(5, 1),
    PRIMARY KEY(id_tarea, id_empleado, id_ap),
    FOREIGN KEY(id_tarea) REFERENCES tarea(id_tarea),
    FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap)
);
BULK INSERT Equip01.Equip01.[AP_Colaborador]
	FROM 'e:\wwwroot\Equip01\ap_colaborador.csv'
	WITH
	(
	CODEPAGE = 'ACP',
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--AP_Promedios

CREATE TABLE AP_Promedios(
    id_ap CHAR(4) NOT NULL, 
    id_tarea CHAR(6) NOT NULL,
    promedio_min_minutos DECIMAL(5, 1),
    promedio_max_minutos DECIMAL(5, 1), 
    PRIMARY KEY(id_ap, id_tarea), 
    FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap), 
    FOREIGN KEY(id_tarea) REFERENCES tarea(id_tarea)
);

BULK INSERT Equip01.Equip01.[AP_Promedios]
	FROM 'e:\wwwroot\Equip01\ap_promedio.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Casos_Uso

CREATE TABLE Casos_Uso(
    id_casos CHAR(6) NOT NULL, 
    id_ap CHAR(4) NOT NULL, 
    id_iteracion CHAR(6) NOT NULL,
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
BULK INSERT Equip01.Equip01.[Casos_Uso]
	FROM 'e:\wwwroot\Equip01\casos_uso.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)


--Entrega

CREATE TABLE Entrega (
    id_tarea CHAR(6) NOT NULL, 
    id_casos CHAR(6) NOT NULL, 
    entrega_estimada DATE, 
    entrega_real DATE, 
    estimacion TIME, 
    valor_ganado DECIMAL(5, 2), 
    costo_real DECIMAL(5, 2), 
    estado_entrega BIT, 
    PRIMARY KEY(id_tarea, id_casos),
    FOREIGN KEY(id_tarea) REFERENCES tarea(id_tarea),
    FOREIGN KEY(id_casos) REFERENCES Casos_Uso(id_casos)
);
BULK INSERT Equip01.Equip01.[Entrega]
	FROM 'e:\wwwroot\Equip01\entrega.csv'
	WITH
	(
	CODEPAGE = 'ACP', 
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '\n'
	)