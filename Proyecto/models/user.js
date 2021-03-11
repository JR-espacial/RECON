const db = require('../util/database');

module.exports =  class Product{
    constructor(name, imagen){
        this.name = name;
        this.image = imagen;
    }
    save(){ 
        return db.execute('INSERT INTO productos (nombre, imagen) VALUES (?, ?)',
        [this.name, this.image]
    );
    }
    

    static fetchAll(){
        return db.execute('SELECT * FROM productos');
    }

    static fetchOne(id){
        return db.execute('SELECT * FROM productos WHERE id = ?'
        [id]
        );
    }
}