# Getting Started

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000)

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn build`

Builds the app for production to the `build` folder.\

### End Points

# Create product

/products
method: POST

## Use FormData

payload {
product_name:'',
product_description:'',
size:'',
color:'',
quantity:'',
price:'',
images:''
}

# Add variety to existing product

/products/variety/7
Method: POST
payload: {
size:'',
color:'',
quantity:'',
price:'',
images:''
}

# Edit a product variety

/products/variety/7/purple the color here is used to find the product in which the variety can be updated
Method: PUT
payload: {
size:'',
color:'',
quantity:'',
price:'',
}

# Delete product

/products/29
Method: DELETE

# Delete variety

/variety/productId/color Color here is used to find the variety to be deleted
Method: DELETE
