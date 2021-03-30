const Airtable = require('airtable');

const workitemlist =[]

let i =0;
const base = new Airtable({apiKey: 'keyHH1HVGMKc8pBDT'}).base('appKYcToWszhvxIHI');

base('Tasks').select({
    // Selecting the first 254 records in Global view:
    maxRecords:255,
    view: "Global view",
    sort :[{field: "Name", direction: "asc"}]
    
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
        //console.log( record.get('Duration'),",",record.get('Estimation'));
        
        workitemlist[i]={};
        workitemlist[i].name = record.get('Name');
        workitemlist[i].assigned = record.get('Assigned');
        workitemlist[i].status = record.get('Status');
        workitemlist[i].estimation = record.get('Estimation');
        workitemlist[i].duration =  record.get('Duration');
        workitemlist[i].finishedDate = record.get('Finished Date');
        i++;   
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});




exports.getTest = (request, response) => {
    console.log(workitemlist.length);
    //console.log(workitemlist);
    response.render('test',{
        title: "test", 
        workitemlist : workitemlist
    });
}