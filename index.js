const AWS = require('aws-sdk')
AWS.config.update({
    region: 'us-east-1',
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTable = productTable
const healthPath =  '/health'
const productPath = '/product'

exports.handler = async function(event){
    let response 
    switch(true){
        // Like this you can perform all the CRUD operations
        case event.httpMethod === 'GET' && event.path === healthPath:
            response =  buildresponse(200,'Your Api is working successfully')
            break

        case event.httpMethod === 'POST' && event.path === productPath:
            response = await createProduct(JSON.parse(event.body))
            break
    }

    return response
}

async function createProduct(reqbody) {
    const params = {
        TableName: dynamodbTable,
        Item:reqbody
    }

    return await dynamodb.put(params).promise().then(()=>{
        const body ={
            message:'Product created successfully',
            Product:reqbody
        }

        return buildresponse(200,body)
    }).catch((error)=>{
        return buildresponse(404,'Unable to create Product')
    })
}

function buildresponse(statusCode, body){
    return {
        statusCode: statusCode,
        headers: {
        'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    }
}