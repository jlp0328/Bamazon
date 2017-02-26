var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var quantityPurchased;
var idSelected;
var updatedStock;


var customerViewQuestions =[
    {type: "input",
    name: "id_to_buy",
    message: "What is the ID of the product you'd like to buy?"},

    {type: "input",
    name: "units_to_buy",
    message: "How many units would you like to buy?"}
];

var connection = mysql.createConnection({

  host:"localhost",
  port: 3306,
  user: "root",
  password: "", //don't need a password
  database: "Bamazon_DB" //indicating the database you're pulling from

});

connection.connect(function(err){
  if (err) throw err;

  //display all of the items for sale on Bamazon//
  connection.query("SELECT * FROM products3", function(err, results){
  if (err) throw err;
  console.log("Bamazon Top Items:");

  var productArray = [];

  for(var i = 0; i < results.length; i++){
    productArray.push({
       ID: results[i].id,
       Product: results[i].product_name,
       Department:results[i].department_name,
       Price:results[i].price,
       Stock:results[i].stock_quantity
      });
  } //closing for loop

console.table(productArray);
console.log("----------------------------");

  inquirer.prompt(customerViewQuestions).then(function (answers) {

    idSelected = answers.id_to_buy - 1;
    quantityPurchased = answers.units_to_buy;

    var itemSelected =[
       {ID: results[idSelected].id,
       Product: results[idSelected].product_name,
       Department: results[idSelected].department_name,
       Price: results[idSelected].price,
       Stock: results[idSelected].stock_quantity}];

    updatedStock = results[idSelected].stock_quantity - quantityPurchased;

    if(parseInt(results[idSelected].stock_quantity) >= parseInt(quantityPurchased)){
    console.log("We have enough!")

    connection.query("UPDATE products3 SET ? WHERE ?", [
    {stock_quantity: updatedStock},
    {id: idSelected}], function(err, results){

      if (err) throw err;

    console.table(itemSelected);

}); //closing update to table

  }

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
  else{
    console.log("Insufficient quantity!");
  }

    // checkInventory();

}); //closing inquirer prompt

}); //closing connection query SELECT * FROM

  connection.end();

});

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
function checkInventory(){

  if(results[idSelected].stock_quantity >= quantityPurchased){
    console.log("We have enough!")
  }

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
  else{
    console.log("Insufficient quantity!");
  }
//    connection.query("UPDATE products3 SET ? WHERE ?", [
//     {stock_quantity: updatedStock},
//     {id: idSelected}], function(err, results){

//       if (err) throw err;

//     console.table(itemSelected);

// }); //closing update to table

}//closing function





// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

