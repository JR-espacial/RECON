const Proyecto = require('../models/proyecto');
const Iteracion = require('../models/iteracion');
const Capacidad_Equipo = require('../models/capacidad_equipo');
const Entrega = require('../models/entrega');
const Airtable = require('airtable');

//comentario prueba

exports.getAvanceProyecto = async function (request, response) {
  //Jalar datos airtable
    
        let proyecto_keys = await Proyecto.fetchAirTableKeys( request.session.idProyecto);

        // request.session.alerta = "No hay una base de airtable definida para el proyecto para registrar una haz click en el boton Airtable en la barra de navegacion";
        // response.redirect("/proyectos/iteraciones-desarrollo-proyecto");
   
    
    let num_iter = await Iteracion.fetchOneID(request.session.idIteracion);
    
    let workitemlist =[];
    let i =0;
    
    const base = new Airtable({apiKey: proyecto_keys[0][0].API_key}).base( proyecto_keys[0][0].base);
    base('Tasks').select({
        view: "Global view",
        sort :[{field: "Name", direction: "asc"}]
        
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
            
            let IT = Number (record.get('Name').slice(2,record.get('Name').indexOf('-')));
            
            if(IT == num_iter[0][0].num_iteracion){
                console.log("here");

                workitemlist[i]={};
                workitemlist[i].nombre = record.get('Name');
                workitemlist[i].asignados = record.get('Assigned');
                if(record.get('Estimation')){
                    workitemlist[i].estimacion = record.get('Estimation');
                } 
                else workitemlist[i].estimacion  = 0;

                if(record.get('Status') == 'Done'){
                    workitemlist[i].estado_entrega = 1;
                    workitemlist[i].valor_ganado =  workitemlist[i].estimacion;
                    var hours;
                    if(record.get('Duration')){
                        hours = record.get('Duration')/3600;
                    }
                    else 
                    hours = 0;

                    var num_asign;
                    if(record.get('Assigned')){
                        num_asign =record.get('Assigned').length;
                    }
                    else  
                    num_asign = 0;
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
                else workitemlist[i].entrega_real  = null;
            }
            i++;   
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    },  async function done(err) {
        if (err) { console.error(err); return; }

         workitemlist.forEach( async function (element) {
            await Entrega.updateAirtable(element.nombre, element.entrega_real, element.estimacion, element.valor_ganado, element.costo_real, element.estado_entrega);
        });
        
        request.session.navegacion = 2;
        let iteracion = await Iteracion.fetchOneID(request.session.idIteracion)
        let capacidad = await Capacidad_Equipo.fetchOne(iteracion[0][0].id_capacidad)
        let total_horas_real;
        let date1 = new Date(iteracion[0][0].fecha_inicio);
        let date2 = new Date(iteracion[0][0].fecha_fin);
        let diffTime = Math.abs(date2 - date1);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

       

        if(iteracion[0][0].total_min_real){
            total_horas_real= (iteracion[0][0].total_min_real/60).toFixed(2);
        }
        else{
            total_horas_real = "Sin registrar";
        }
        let velocidad_deseada = parseFloat((total_horas_real/diffDays).toFixed(2));

        let costos = await Entrega.fetchCostosDiarios(request.session.idIteracion);
        let tareas_totales = await Entrega.countAllTareas(request.session.idIteracion);
        let tareas_completadas = await Entrega.countTareasCompletadas(request.session.idIteracion);
        let tareas_pendientes = tareas_totales[0][0].tareas_totales - tareas_completadas[0][0].tareas_completadas;


        response.render('avanceProyecto', {
            navegacion : request.session.navegacion,
            proyecto_actual : request.session.nombreProyecto,
            user: request.session.usuario,
            iteracion: iteracion[0][0],
            capacidad: capacidad[0][0],
            dias_totales: diffDays,
            horas_planeadas: total_horas_real,
            velocidad_deseada: velocidad_deseada,
            costos: costos[0],
            tareas_totales : tareas_totales[0][0].tareas_totales,
            tareas_completadas : tareas_completadas[0][0].tareas_completadas,
            tareas_pendientes: tareas_pendientes,
            title: "Avance del Proyecto",
            csrfToken: request.csrfToken()
        });
    });
}