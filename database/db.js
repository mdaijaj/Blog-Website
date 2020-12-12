var conn={
	host: process.env.DB_HOSexpressT,										
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
}


//knex mysql connect using module of knex
const knex=require("knex")({
	client: "mysql", connection: conn
});
        

module.exports=knex;