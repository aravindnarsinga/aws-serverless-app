const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "FullStackApp";

exports.handler = async (event) => {

try {

    // Default GET if method missing
    const method = event.httpMethod || "GET";

    // GET → Fetch all items
    if (method === "GET") {

        const result = await dynamodb.send(
            new ScanCommand({
                TableName: TABLE_NAME
            })
        );

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(result.Items)
        };
    }

    // POST → Add item
    if (method === "POST") {

        const data = JSON.parse(event.body);

        const item = {
            id: data.id,
            type: data.type,
            name: data.name,
            extra: data.extra || ""
        };

        await dynamodb.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: item
            })
        );

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
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            message: "Unsupported request"
        })
    };

} catch (error) {

    console.error(error);

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
