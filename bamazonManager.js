var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	database: "bamazon_db"
});

connection.connect(function(err) {
	if(err) throw err;
	console.log("connected as id " + connection.threadId);
	managerOptions();
});

function managerOptions() {
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message: "What would you like to do?",
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product"
			]
		})
		.then(function(answer) {
			switch (answer.action) {
				case "View Products for Sale":
				viewProducts();
				break;

				case "View Low Inventory":
				lowInventory();
				break;

				case "Add to Inventory":
				addInventory();
				break;

				case "Add New Product":
				addProduct();
				break;
			}
		});
}

function viewProducts() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
	})
	managerOptions();
}

function lowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5 ", function(err, res) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
	})
	managerOptions();
}

function addInventory() {

}

function addProduct() {

}