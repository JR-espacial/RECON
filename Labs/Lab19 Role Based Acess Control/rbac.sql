CREATE TABLE Empleado (
    id_empleado CHAR(6) NOT NULL,
	usuario VARCHAR(14),
    contrasena VARCHAR(16),
    nombre_empleado VARCHAR(64),
    PRIMARY KEY(id_empleado)
);

CREATE TABLE Roles(
    Id_Rol numeric NOT NULL AUTO_INCREMENT,
    Descripcion_rol VARCHAR(100) NOT NULL,
    PRIMARY KEY(Id_Rol)
)

CREATE TABLE Usuarios_Roles(
    id_empleado numeric(5) NOT NULL,
    Id_Rol numeric(5) NOT NULL,
    PRIMARY KEY(id_empleado, Id_Rol),
    FOREIGN KEY (Id_Rol) REFERENCES Roles(Id_Rol),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
)

CREATE TABLE Privilegios(
    Id_Privilegio numeric(5) NOT NULL,
    Accion VARCHAR(100) NOT NULL,
    PRIMARY KEY(Id_Privilegio)
)

CREATE TABLE Roles_Privilegios(
    Id_Rol numeric(5) NOT NULL,
    Id_Privilegio numeric(5) NOT NULL,
    PRIMARY KEY(Id_Rol, Id_Privilegio),
    FOREIGN KEY (Id_Rol) REFERENCES Roles(Id_Rol),
    FOREIGN KEY (Id_Privilegio) REFERENCES Privilegios(Id_Privilegio)
)
