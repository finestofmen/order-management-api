import express from 'express'

const app = express()
const  port = 3000

app.use(express.json())

let teaData = [{id: 1, name: 'green tea', price: 50}, { id: 2, name: "Black Tea", price: 12.00 }]
let id = 1
let newOrders = []


//Create a new order
app.post('/orders', (req, res) => {
    // destructure the req tea order to an object
    const {customerName, teaId, quantity} = req.body

    // check if the tea id exist
    const tea = teaData.find(t => t.id === teaId)

    //if not found send a 404 status
    if(!tea) {
       return res.status(404).send('not found!')
    }

    // store the total price in a variable
    const totalPrice =  tea.price * quantity

    // create a new object and store the new order
    const order = { 
        orderId: id++,
        customerName: customerName,
        teaId: teaId,
        quantity: quantity,
        totalPrice: totalPrice,
        status: 'pending...'
    }

    // push the new order 
    newOrders.push(order)

    //send 201 status and the new order details
    return res.status(201).send(newOrders)

})

// rerieve all order list
app.get('/orders', (req, res) => {
    console.log("GET /orders route hit"); // New log at the start
    
    const status = req.query.status;
    console.log("Query status:", status); // Log the query parameter value

    console.log(newOrders)
    
    const tea = status ? newOrders.filter(t => t.status === status) : newOrders;
    console.log("Filtered orders:", tea); // Log the filtered orders array

    if (status && tea.length === 0) {
        return res.status(404).send('No orders with the given status');
    }

    return res.status(200).send(tea);
});


// retrive order list with id
app.get('/orders/:id', (req, res) => {
    // find the order details with id 
    const tea = newOrders.find(t => t.orderId === parseInt(req.params.id, 10))

    // if not found send a 404 status
    if(!tea) {
        return res.status(404).send('Not found!')
    }

    // if found send a 200 status with the order details
    return res.status(200).send(tea)
})


// update order status 
app.put('/orders/:id', (req, res) => {
    // find the order id 
    const tea = newOrders.find(t => t.orderId === parseInt(req.params.id))

    // if not found send a 404 status 
    if(!tea) {
        return res.status(404).send('Not found!')
    }

    // store the intended status of the order in a variable
    const newStatus = req.body.status

    // update the status
    tea.status = newStatus

    // send a 200 status and a sucess message
    return res.status(200).send(tea)

})


// update order details
app.put('/orders/:id', (req, res) => {
    // find the order id 
    const tea = newOrders.find(t => t.orderId === parseInt(req.params.id, 10))

    // if not found send a 404 status 
    if(!tea) {
        return res.status(404).send('not found')
    }

   

    // update the order deatails
    tea.customerName = req.body.customerName
    tea.teaId = req.body.teaId
    tea.quantity = req.body.quantity
    tea.status = req.body.status

     

    const selectedTea = teaData.find(t => t.id === tea.teaId)

    if(selectedTea) {
        tea.totalPrice = tea.quantity * selectedTea.price
    } else {
        return res.status(400).send('Invalid teaId')
    }

    // return the updated order details
    return res.status(200).send(tea);

})




// delete order details
app.delete('/orders/:id', (req, res) => {
    // find the index of the order 
    const index = newOrders.findIndex(t => t.orderId === parseInt(req.params.id, 10))

    // if not found send a 404 status
    if(index === -1) {
        return res.status(404).send('Not found!')
    }

    // if found delete ans send a sucess message
    newOrders.splice(index, 1)
    return res.status(200).send('Deleted Sucessfully')
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})