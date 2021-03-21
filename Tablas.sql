CREATE TABLE Puntos_Agiles (
    id_ap CHAR(4),
    ap INT,
    PRIMARY KEY(id_ap)
);

CREATE TABLE AP_Colaborador (
    id_trabajo CHAR(6),
    id_empleado CHAR(6),
    id_ap CHAR(4), 
    max_minutos DECIMAL(5, 1),
    min_minutos DECIMAL(5, 1),
    PRIMARY KEY(id_trabajo, id_empleado, id_ap),
    FOREIGN KEY(id_trabajo) REFERENCES Practica_Trabajo(id_trabajo),
    FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap)
);

CREATE TABLE AP_Promedios(
    id_ap CHAR(4), 
    id_trabajo CHAR(6),
    promedio_max_minutos DECIMAL(5, 1), 
    promedio_min_minutos DECIMAL(5, 1),
    PRIMARY KEY(id_ap, id_trabajo), 
    FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap), 
    FOREIGN KEY(id_trabajo) REFERENCES Practica_Trabajo(id_trabajo)
);

CREATE TABLE Casos_Uso(
    id_casos CHAR(6), 
    id_ap CHAR(4), 
    id_proyecto CHAR(6),
    yo_como VARCHAR(16),
    quiero VARCHAR(64), 
    para VARCHAR(64), 
    comentario VARCHAR(255), 
    real_minutos INT,
    max_minutos_caso_uso INT, 
    porcentaje_avance DECIMAL(3, 2), 
    PRIMARY KEY id_casos, 
    FOREIGN KEY(id_ap) REFERENCES Puntos_Agiles(id_ap), 
    FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto)
);

CREATE TABLE Entrega (
    id_trabajo CHAR(6), 
    id_casos CHAR(6), 
    entrega_estimada DATE, 
    entrega_real DATE, 
    estimacion TIME, 
    valor_ganado DECIMAL(5, 2), 
    costo_real DECIMAL(5, 2), 
    estado BOOLEAN, 
    PRIMARY KEY(id_trabajo, id_casos),
    FOREIGN KEY(id_trabajo) REFERENCES Practica_Trabajo(id_trabajo),
    FOREIGN KEY(id_casos) REFERENCES Casos_Uso(id_casos)
);

CREATE TABLE Empleado_Entrega (
    id_trabajo CHAR(6),
    id_casos CHAR(6), 
    id_empleado CHAR(6),
    PRIMARY KEY(id_trabajo, id_casos, id_empleado),
    FOREIGN KEY(id_trabajo) REFERENCES Entrega(id_trabajo),
    FOREIGN KEY(id_casos) REFERENCES Entrega(id_casos), 
    FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado)
);

CREATE TABLE Capacidad_Equipo(
    id_capacidad CHAR(6),
    horas_nominales_totales INT,
    tiempo_perdido DECIMAL(5, 2),
    errores_registro DECIMAL(5, 2),
    horas_nominales_sin_ovh INT,
    overhead DECIMAL(5, 2),
    horas_nominales_restantes INT,
    productivas DECIMAL(5, 2),
    horas_productivas INT,
    operativos DECIMAL(5, 2),
    humano DECIMAL(5, 2),
    cmmi DECIMAL(5, 2),
    PRIMARY KEY(id_capacidad)
);

CREATE TABLE Proyecto(
	id_proyecto CHAR(6),
    nombre CHAR(64),
    descripcion VARCHAR(1000),
    foto VARBINARY(max),
    fecha_inicio DATE,
    estado BOOLEAN,
    total_minutos_real INT,
    total_minutos_maximo INT,
    id_capacidad CHAR(6),
    PRIMARY KEY(id_proyecto),
    FOREIGN KEY(id_capacidad) REFERENCES Capacidad_Equipo(id_capacidad)
);

CREATE TABLE Departamento(
    id_departamento CHAR(6),
    nombre CHAR(64),
    PRIMARY KEY(id_departamento)
);

CREATE TABLE Proyectos_Departamento(
    id_proyecto CHAR(6),
    id_departamento CHAR(6),
    PRIMARY KEY(id_proyecto, id_departamento), 
    FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
    FOREIGN KEY(id_departamento) REFERENCES Departamento(id_departamento)
);

CREATE TABLE Empleado(
    id_empleado CHAR(6),
    contrasena CHAR(64),
    nombre CHAR(64),
    foto VARBINARY(max),
    PRIMARY KEY(id_empleado)
);

CREATE TABLE Empleado_Proyecto(
    id_empleado CHAR(6),
    id_proyecto CHAR(6),
    horas_semanales INT,
    PRIMARY KEY(id_empleado, id_proyecto),
    FOREIGN KEY(id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto)
);

CREATE TABLE Fase(
    id_fase CHAR(6),
    nombre CHAR(64),
    PRIMARY KEY(id_fase)
);

CREATE TABLE Proyecto_Fase(
	id_proyecto CHAR(6),
    id_fase CHAR(6),
    PRIMARY KEY(id_proyecto, id_fase),
    FOREIGN KEY(id_proyecto) REFERENCES Proyecto(id_proyecto),
    FOREIGN KEY(id_fase) REFERENCES Fase(id_fase)
);

CREATE TABLE Practica_Trabajo(
	id_trabajo CHAR(6),
    nombre CHAR(64),
    id_fase CHAR(6),
    id_proyecto CHAR(6),
    PRIMARY KEY(id_trabajo),
    FOREIGN KEY(id_fase, id_proyecto) REFERENCES Proyecto_Fase(id_fase, id_proyecto)
)