var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	database: "bamazon_db"
});

var id;
var quantity;
var canBuy = false;
var remainder;
var totalPrice;

connection.connect(function(err) {
	if(err) throw err;
	console.log("connected as id " + connection.threadId);
	displayInventory();
});

function displayInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
	})

	inquirer
		.prompt([
		{
			name: "id",
			type: "input",
			message: "What is the id of the product you would like to buy?",
		}, {
			name: "quantity",
			type: "input",
			message: "How many would you like to buy?"
		}
		]).then(function(answer) {
			id = parseInt(answer.id);
			quantity = parseInt(answer.quantity);
			console.log(id, quantity);
			checkQuantity(id);
		})
}

function checkQuantity(id) {
	connection.query("SELECT stock_quantity FROM products WHERE id=?", [id], function(err, res) {
		if (err) {
			throw err;
		}
		var stockQuantity = (res[0].stock_quantity);
		remainder = stockQuantity - quantity;
		if(remainder >= 0){
			canBuy = true;
			changeQuantity(remainder, id);
		}else{
			canBuy = false;
			console.log("Insufficient quantity!");
			displayInventory();
		}
	})
}

function changeQuantity(newQuantity, numberId) {
	connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [newQuantity, numberId], function (err, res) {
		if (err) {
			throw err;
		}
		getPrice(id);
	})
}

function getPrice(id) {
	connection.query("SELECT price FROM products WHERE id=?", [id], function(err, res) {
		if (err) {
			throw err;
		}
		var price = res[0].price;
		totalPrice = (price * quantity);
		console.log("Total: $" + totalPrice);
		setTimeout(function(){
			displayInventory();
		}, 2000);		
	})
}