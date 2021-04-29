const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Capacidad_Equipo = require('../models/capacidad_equipo');
const Entrega = require('../models/entrega');
const Airtable = require('airtable');


let data = [0, 0, 0, 0, 0, 0, 0];
exports.getAvanceProyecto = async function (request, response) {
    //Jalar datos airtable
    let proyecto_keys = await Proyecto.fetchAirTableKeys( request.session.idProyecto);

    data = [0, 0, 0, 0, 0, 0, 0];

    if(!proyecto_keys[0][0].base || !proyecto_keys[0][0].API_key){
        fetchAvance(request, response, "", "Define una base de AirTable para ver más datos");
    }
    else{
        let num_iter = request.session.numIteracion;
        let workitemlist =[];
        let i =0;
        const iteracion = "{Iterations} = "+"\"IT"+num_iter+"\"";
        
        const base = new Airtable({apiKey: proyecto_keys[0][0].API_key}).base( proyecto_keys[0][0].base);
        
        base('Tasks').select({
            view: "Global view",
            sort :[{field: "Name", direction: "asc"}],
            filterByFormula: iteracion
            
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            records.forEach(function(record) {
                let IT = Number (record.get('Name').slice(2,record.get('Name').indexOf('-')));
                
               
                    workitemlist[i] = {};
                    workitemlist[i].nombre = record.get('Name');
                    workitemlist[i].asignados = record.get('Assigned');
                    if(record.get('Estimation')){
                        workitemlist[i].estimacion = record.get('Estimation');
                    } 
                    else {
                        workitemlist[i].estimacion  = 0;
                    }
                    
                    let status_tarea = record.get('Status');
                    if(record.get('Status') == 'Done'){
                        workitemlist[i].estado_entrega = "Done";
                        workitemlist[i].valor_ganado =  workitemlist[i].estimacion;
                        var hours;
                        if(record.get('Duration')){
                            hours = record.get('Duration')/3600;
                        }
                        else {
                            hours = 0;
                        }

                        var num_asign;
                        if(record.get('Assigned')){
                            num_asign = record.get('Assigned').length;
                        }
                        else {
                            num_asign = 0;
                        }
                        
                        workitemlist[i].costo_real = hours * num_asign;
                    }
                    else{
                        workitemlist[i].estado_entrega = 0;
                        workitemlist[i].valor_ganado = 0;
                        workitemlist[i].costo_real = 0;
                    }
                    if(record.get('Finished Date')) {
                        workitemlist[i].entrega_real = record.get('Finished Date');
                    }
                    else {
                        workitemlist[i].entrega_real  = null;
                    }

                    // Sumar cantidad de tareas en el estado actual
                    switch(status_tarea){
                        case 'To Do': 
                            data[0] = data[0] + 1;
                            break;
                        case 'Working on it': 
                            data[1] = data[1] + 1;
                            break;
                        case 'Done': 
                            data[2] = data[2] + 1;
                            break;
                        case 'Rejected': 
                            data[3] = data[3] + 1;
                            break;
                        case 'Waiting for Review': 
                            data[4] = data[4] + 1;
                            break;
                        case 'On Hold': 
                            data[5] = data[5] + 1;
                            break;
                        default: 
                            data[6] = data[6] + 1;
                            break;
                    }
                    
                
                i++;   
            });
        
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
        
        },  async function done(err) {
            if (err) {
                 //console.error(err); 
                fetchAvance(request, response, "La base o Apikey de AirTable no son correctas", "");
                return;
            }

            workitemlist.forEach( async function (element) {
                await Entrega.updateAirtable(element.nombre, element.entrega_real, element.estimacion, element.valor_ganado, element.costo_real, element.estado_entrega);
            });

            fetchAvance(request, response, "", "");
            
        });
    }
}

async function fetchAvance(request, response, alerta, toast){
    request.session.navegacion = 2;
    let iteracion = await Iteracion.fetchOneID(request.session.idIteracion)
    let capacidad = await Capacidad_Equipo.fetchOne(iteracion[0][0].id_capacidad)
    let total_min_real;
    let total_horas_real;
    let velocidad_deseada;
    let date1 = new Date(iteracion[0][0].fecha_inicio);
    let date2 = new Date(iteracion[0][0].fecha_fin);
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));



    if(iteracion[0][0].total_min_real){
        total_min_real = iteracion[0][0].total_min_real;
        total_horas_real= (iteracion[0][0].total_min_real/60).toFixed(2);
        velocidad_deseada = parseFloat((total_horas_real/diffDays).toFixed(2));
    }
    else{
        total_min_real = "Sin registrar";
        total_horas_real = "Sin registrar";
        velocidad_deseada = "Sin registrar";
    }

    let costos = await Entrega.fetchCostosDiarios(request.session.idIteracion);


    let horas_semanales;
    let total_semanas_real;
    let total_meses_real;

    if(capacidad[0][0].horas_productivas){
        horas_semanales = (capacidad[0][0].horas_productivas);
        total_meses_real = (total_semanas_real/4.28).toFixed(2);
    }
    else{
        horas_semanales = "Sin registrar";
        total_meses_real = "Sin registrar";
    }

    if(iteracion[0][0].total_min_real && capacidad[0][0].productivas_pc){
        total_semanas_real = (total_horas_real/horas_semanales).toFixed(2);
        total_meses_real = (total_semanas_real/4.28).toFixed(2);
    }
    else{
        total_semanas_real = "Sin registrar";
        total_meses_real = "Sin regresar";
    }

    response.render('avanceProyecto', {
        navegacion : request.session.navegacion,
        proyecto_actual : request.session.nombreProyecto,
        imagen_empleado: request.session.imagen_empleado,
        user: request.session.usuario,
        iteracion: iteracion[0][0],
        num_iteracion: request.session.numIteracion,
        dias_totales: diffDays,
        horas_planeadas: total_horas_real,
        velocidad_deseada: velocidad_deseada,
        costos: costos[0],
        total_min_real: total_min_real,
        total_horas_real: total_horas_real,
        horas_semanales: horas_semanales,
        total_semanas_real: total_semanas_real,
        total_meses_real: total_meses_real,
        toast: toast,
        alerta: alerta,
        tareas_data: data,
        title: "Avance del Proyecto",
        csrfToken: request.csrfToken()
    });
}