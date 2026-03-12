const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE = 'FullStackApp';

exports.handler = async (event) => {

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const method = event.httpMethod;

    if (method === 'POST') {

        const data = JSON.parse(event.body);

        await dynamo.put({
            TableName: TABLE,
            Item: data
        }).promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Item added successfully' })
        };
    }

    if (method === 'GET') {

        const result = await dynamo.scan({
            TableName: TABLE
        }).promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Items)
        };
    }

    return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Unsupported HTTP method' })
    };
};
