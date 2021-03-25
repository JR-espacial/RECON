DELETE FROM entrega WHERE id_trabajo IN (SELECT id_trabajo FROM proyecto_fase_practica WHERE id_proyecto = 1) 
AND id_casos IN (SELECT id_casos FROM casos_uso WHERE id_iteracion IN (SELECT id_iteracion FROM iteracion WHERE id_proyecto = 1));

DELETE FROM casos_uso WHERE id_iteracion IN (SELECT id_iteracion FROM iteracion WHERE id_proyecto = 1);

DELETE FROM ap_promedios WHERE id_trabajo IN (SELECT id_trabajo FROM proyecto_fase_practica WHERE id_proyecto = 1);

DELETE FROM ap_colaborador WHERE id_trabajo IN (SELECT id_trabajo FROM proyecto_fase_practica WHERE id_proyecto = 1);



DELETE FROM practica_trabajo WHERE id_trabajo IN (SELECT id_trabajo FROM proyecto_fase_practica WHERE id_proyecto = 1);

DELETE FROM proyecto_fase_practica WHERE id_proyecto = 1;

DELETE FROM empleado_iteracion WHERE id_iteracion IN (SELECT id_iteracion FROM iteracion WHERE id_proyecto = 1);

DELETE FROM capacidad_equipo WHERE id_capacidad IN (SELECT id_capacidad FROM iteracion WHERE id_proyecto = 1);

DELETE FROM Iteracion WHERE id_proyecto = 1;

DELETE FROM Proyecto_Departamento WHERE id_proyecto = 1;

DELETE FROM Proyecto WHERE id_proyecto = 1;