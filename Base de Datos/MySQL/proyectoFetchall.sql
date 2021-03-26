SELECT * 
FROM Proyecto P, Proyecto_Departamento PD, Departamento D
WHERE estado_proyecto = 1 AND P.id_proyecto = PD.id_proyecto AND PD.id_departamento = D.id_departamento