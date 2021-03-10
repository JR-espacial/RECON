CREATE TABLE Usuarios(
    
)

CREATE TABLE Roles(
    Id_Rol numeric(5) NOT NULL,
    Descripcion_rol VARCHAR(100) NOT NULL,
    PRIMARY KEY(Id_Rol)
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
