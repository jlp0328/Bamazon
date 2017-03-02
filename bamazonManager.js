var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var menuOptions = [{
    type: "rawlist",
    name: "menu_options",
    message: "What would you like to do?",
    choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
  }];

var moreInventory = [
    {type: "input",
    name: "product_to_update",
    message: "Which product's inventory would you like to update?"},

    {type: "input",
    name: "new_quantity",
    message: "What would you like the new quantity to be?"}];

var productToBeUpdated;
var newQuantity;

var newProductQuestions = [
   {type: "input",
    name: "new_product_name",
    message: "What is the name of the product you'd like to add?"},

   {type: "input",
    name: "department_name",
    message: "What is the name of the department you'd like to add your new product to?"},

   {type: "input",
    name: "price",
    message: "How much is your new product?"},

   {type: "input",
    name: "stock",
    message: "How many units do you have in stock of your new product?"}
];

var newProductAdded;

var action;
var productArray = [];
var inventoryArray = [];
var productStock;

var connection = mysql.createConnection({

  host:"localhost",
  port: 3306,
  user: "root",
  password: "", //don't need a password
  database: "Bamazon_DB" //indicating the database you're pulling from

});

connection.connect(function(err){
  if (err) throw err;

  managerOptions();

});


//Functions

//Prompt the manager with the menu of available options

function managerOptions(){

  inquirer.prompt(menuOptions).then(function (answers) {

    action = answers.menu_options;
    console.log(action);

      switch(action){
        case "View Products For Sale":
        viewInventory();
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

        case "Exit":
        connection.end();
        break;
      }

    });

}

//View products for sale, once selected should show list of every available item. Same as Customer View.
function viewInventory(){

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
    managerOptions();
});

}


//View low inventory, once selected list all items with an inventory count lower than 5
function lowInventory(){

  connection.query("SELECT * FROM products3", function(err, results){
     if (err) throw err;

     for(var i = 0; i < results.length; i++){

        if (results[i].stock_quantity <= 5){

                inventoryArray.push({
               ID: results[i].id,
               Product: results[i].product_name,
               Department:results[i].department_name,
               Price:results[i].price,
               Stock:results[i].stock_quantity
              });



      }//closing if statement
      }//closing for loop
        console.log("The following items have low inventory(less than 5 items in-stock): ");

        console.table(inventoryArray);
        managerOptions();

  // else{
  //   console.log("All inventory is above 5 units.")
  //   managerOptions();
  // }//closing else statement

});//closing connection query

}

//Add to inventory of an existing product
function addInventory(){

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


  inquirer.prompt(moreInventory).then(function (answers) {

    productToBeUpdated = parseInt(answers.product_to_update -1);
    productToBeUpdated = results[productToBeUpdated].product_name;

    newQuantity = parseInt(answers.new_quantity);

   connection.query("UPDATE products3 SET ? WHERE ?",
   [{stock_quantity: newQuantity},{product_name: productToBeUpdated}], function(err, results){

    if (err) throw err;

    console.log("The quantity of has been updated!");
    viewInventory();

  }); //closing connection.query

  }); //closing inquirer

  }); //closing connection.query Select * From

}//closing function

//Add a completely new product
function addProduct(){

  inquirer.prompt(newProductQuestions).then(function (answers) {

    // newProductAdded = {
    //    Product: answers.new_product_name,
    //    Department:answers.department_name,
    //    Price:answers.price,
    //    Stock:answers.stock
    // }

    newProductName = answers.new_product_name;
    newDepartmentName = answers.department_name;
    newPrice = answers.price;
    newStock = answers.stock;

    connection.query("INSERT INTO products3 SET ?", {product_name:newProductName, department_name:newDepartmentName, price:newPrice, stock_quantity:newStock}, function(err, results){

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
          managerOptions();

       }); //closing connection.query
       }); //closing connection.query

  }); //closing inquirer

}

