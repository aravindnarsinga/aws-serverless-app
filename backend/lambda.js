const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "FullStackApp";

exports.handler = async (event) => {

try {

    // GET request → fetch all items
    if (event.httpMethod === "GET") {

        const result = await dynamodb.scan({
            TableName: TABLE_NAME
        }).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(result.Items)
        };
    }

    // POST request → add new item
    if (event.httpMethod === "POST") {

        const data = JSON.parse(event.body);

        const item = {
            id: data.id,
            type: data.type,
            name: data.name,
            extra: data.extra || ""
        };

        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: item
        }).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                message: "Backend updated via Jenkins CI/CD",
                item: item
            })
        };
    }

    // Unsupported request
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Unsupported request"
        })
    };

} catch (error) {

    return {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            error: error.message
        })
    };

}

};
