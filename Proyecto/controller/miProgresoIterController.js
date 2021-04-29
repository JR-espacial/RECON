const Airtable = require('airtable');
const Usuario = require('../models/user');
const Proyecto = require('../models/proyecto');
const Capacidad_Equipo = require('../models/capacidad_equipo');


exports.getMiProgresoIteracion = (request,response) => {
    request.session.navegacion = 1;
    const id_proyecto = request.session.idProyecto;
    const id_iteracion = request.session.idIteracion;
    let toast = "";
    let alerta = "";
    let pendientes = [];
    let horas_dedicadas = 0;
    let registros = [];
    let estados = [0, 0, 0, 0, 0, 0, 0];
    Usuario.fetchOne(request.session.usuario)
        .then(([user, fieldDate]) => {
            Capacidad_Equipo.fetchProductivasEmpleado(id_iteracion, request.session.usuario)
                .then(([horas_reales, fielData]) => {
                    if(horas_reales[0].horas){
                        horas_reales = horas_reales[0].horas;
                    }
                    else{
                        horas_reales = 0;
                    }
                    Proyecto.fetchAirTableKeys(id_proyecto)
                        .then(([rows, fielData]) => {
                            if(!rows[0].base || !rows[0].API_key){
                                alerta = "Define una base de AirTable para enviar los datos.";
                            }
                            else{
                                const iteracion = "{Iterations} = "+"\"IT"+request.session.numIteracion+"\"";
                                const base = new Airtable({apiKey: rows[0].API_key}).base( rows[0].base);
                                base('Tasks').select({
                                    view: "Global view",
                                    fields: ["Status", "Name", "Assigned", "Duration"],
                                    filterByFormula: iteracion
                                }).eachPage(function page(records, fetchNextPage) {
                                    // This function (`page`) will get called for each page of records.
                                    records.forEach(function(record) {
                                        if(record.get('Assigned')){
                                            let asignados = record.get('Assigned');
                                            asignados.forEach(element => {
                                                if(element.email && element.email == user[0].correo){
                                                    if(record.get('Duration')){
                                                        horas_dedicadas = horas_dedicadas + record.get('Duration');
                                                    }
                                                    if(record.get('Status')){
                                                        switch(record.get('Status')){
                                                            case 'To Do': 
                                                                estados[0] = estados[0] + 1;
                                                                if(record.get('Name')){
                                                                    pendientes.push(record.get('Name'));
                                                                }
                                                                break;
                                                            case 'Working on it': 
                                                                estados[1] = estados[1] + 1;
                                                                break;
                                                            case 'Done': 
                                                                estados[2] = estados[2] + 1;
                                                                break;
                                                            case 'Rejected': 
                                                                estados[3] = estados[3] + 1;
                                                                break;
                                                            case 'Waiting for Review': 
                                                                estados[4] = estados[4] + 1;
                                                                break;
                                                            case 'On Hold': 
                                                                estados[5] = estados[5] + 1;
                                                                break;
                                                            default: 
                                                                estados[6] = estados[6] + 1;
                                                                break;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        else if(record.get('Status') && record.get('Status') == 'To Do'){
                                            registros.push(record.get('Name'));
                                        }
                                    });
                                    fetchNextPage();

                                }, function done(err) {
                                    if (err) {
                                        toast = "Error al cargar datos de AirTable.";
                                        console.error(err); return;
                                    }
                                    else{
                                        horas_dedicadas = (horas_dedicadas / 3600);
                                        response.render('miProgresoIteracion',{
                                            num_iteracion: request.session.numIteracion,
                                            navegacion : request.session.navegacion,
                                            proyecto_actual : request.session.nombreProyecto,
                                            imagen_empleado: request.session.imagen_empleado,
                                            title: "Mi Progreso",
                                            csrfToken: request.csrfToken(),
                                            user: request.session.usuario,
                                            infouser: user[0],
                                            toast: toast,
                                            alerta: alerta,
                                            estados: estados,
                                            horas_dedicadas: horas_dedicadas,
                                            registros: registros,
                                            horas_reales: horas_reales,
                                            pendientes: pendientes
                                        });
                                    }
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })    
}