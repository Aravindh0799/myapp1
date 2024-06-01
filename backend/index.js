const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())

app.use(cors({
    origin: "*",
}))

const routes = require('./routes/route')
app.use(routes)

const port = process.env.port || 10080;
require('./conn')

app.listen(port, () => {
    console.log(`server running at port ${port} `);
})