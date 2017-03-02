var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var productArray = [];
var quantityPurchased;
var idSelectedArray;
var idSelectedTable;
var updatedStock;
var totalCost;
var price;
var product;

var customerViewQuestions =[
    {type: "input",
    name: "id_to_buy",
    message: "What is the ID of the product you'd like to buy?"},

    {type: "input",
    name: "units_to_buy",
    message: "How many units would you like to buy?"}
];

var anotherOrder = [
    {type: "confirm",
    name: "purchase_again",
    message: "Would you like to make another purchase?",
    default: true}
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

  makeSelection();

});


function makeSelection(){
  //display all of the items for sale on Bamazon//
  connection.query("SELECT * FROM products3", function(err, results){
  if (err) throw err;
  console.log("Bamazon Top Items:");

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

    idSelectedArray = parseInt(answers.id_to_buy - 1);
    idSelectedTable = parseInt(answers.id_to_buy);
    quantityPurchased = parseInt(answers.units_to_buy);

    var itemSelected =[
       {ID: results[idSelectedArray].id,
       Product: results[idSelectedArray].product_name,
       Department: results[idSelectedArray].department_name,
       Price: results[idSelectedArray].price,
       Stock: results[idSelectedArray].stock_quantity}];

    updatedStock = parseInt(results[idSelectedArray].stock_quantity - quantityPurchased);

    price = parseFloat(results[idSelectedArray].price);
    product = results[idSelectedArray].product_name;


// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

    if(parseInt(results[idSelectedArray].stock_quantity) >= parseInt(quantityPurchased)){

          console.log("We have enough!")

// This means updating the SQL database to reflect the remaining quantity.
          connection.query("UPDATE products3 SET ? WHERE ?",
          [{stock_quantity: updatedStock},{id: idSelectedTable}], function(err, results){

          if (err) throw err;

// Once the update goes through, show the customer the total cost of their purchase.
          totalCost = parseFloat(price * parseInt(quantityPurchased));

          console.log("Your order has been placed!");
          console.log("Your total cost for your order of " + product + " is: $" + totalCost);
          productArray = [];

          connection.query("SELECT * FROM products3", function(err, results){
                if (err) throw err;
                console.log("Bamazon Top Items:");

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
          makeAnotherPurchase();

             }); //closing connection.query

        }); //closing update to table

  }//closing if statement

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
      else{
        console.log("Insufficient quantity!");
        makeAnotherPurchase();

      }
// However, if your store does have enough of the product, you should fulfill the customer's order.


}); //closing inquirer prompt

}); //closing connection query SELECT * FROM

}

function makeAnotherPurchase (){

  inquirer.prompt(anotherOrder).then(function (answers) {

    if(answers.purchase_again === true){
      productArray = [];
      makeSelection();
    }

    else{
      connection.end();
    }

  });//closing inquirer

}




