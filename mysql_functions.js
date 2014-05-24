var mysql = require('mysql');

// Connect to the MySQL server
var con = mysql.createClient({
	user: 'clientapps',
	password: 'theking',
	});

con.query('USE clientapps');

con.query( "select id, username, password from carpool_members", function(err, results, fields) {
	if (err) { throw err; }
	console.log(results);
	});

/*
// function to create employee
exports.add_employee = function(data, callback) {
 client.query("insert into employees (name, salary) values (?,?)", [data.name, data.salary], function(err, info) {
    // callback function returns last insert id
    callback(info.insertId);
    console.log('Employee '+data.name+' has salary '+data.salary); 
  });
}

// function to get list of employees
exports.get_employees = function(callback) {
  client.query("select * from employees", function(err, results, fields) {
    // callback function returns employees array
    callback(results);
  });
}
*/
