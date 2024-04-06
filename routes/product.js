const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = process.env.DYNAMODB_TABLE_NAME || 'product-inventory';

router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  console.log('Received productId:', productId);
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'productId': productId
    }
  }
  await dynamodb.get(params).promise().then(response => {
    res.json(response.Item);
  }, error => {
    console.error('Do your custom error handling here. I am just ganna log it out: ', error);
    res.status(500).send(error);
  })
})

router.get('/', async (req, res) => {
  const params = {
    TableName: dynamodbTableName
  }
  try {
    const allProducts = await scanDynamoRecords(params, []);
    const body = {
      products: allProducts
    }
    res.json(body);
  } catch(error) {
    console.error('Do your custom error handling here. I am just ganna log it out: ', error);
    res.status(500).send(error);
  }
})

router.post('/', async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Item: req.body,
    ConditionExpression: 'attribute_not_exists(productId)'  // Check if 'productId' doesn't exist
  };

  await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: req.body
    };
    res.json(body);
  }, error => {
    if (error.code === 'ConditionalCheckFailedException') {
      // Handle the case where the item already exists
      res.status(409).send({ message: 'Product with this ID already exists' });
    } else {
      console.error('Error creating product:', error);
      res.status(500).send(error);
    }
  });
});


router.patch('/', async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'productId': req.body.productId
    },
    UpdateExpression: `set productName = :productName, productPrice = :productPrice`,
    ExpressionAttributeValues: {
      ':productName': req.body.updateValue.productName,
      ':productPrice': req.body.updateValue.productPrice
    },
    ReturnValues: 'UPDATED_NEW'
  }
  await dynamodb.update(params).promise().then(response => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    res.json(body);
  }, error => {
    console.error('Do your custom error handling here. I am just ganna log it out: ', error);
    res.status(500).send(error);
  })
})

router.delete('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'productId': productId
    },
    ReturnValues: 'ALL_OLD'
  }
  await dynamodb.delete(params).promise().then(response => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    res.json(body);
  }, error => {
    console.error('Do your custom error handling here. I am just ganna log it out: ', error);
    res.status(500).send(error);
  })
})

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    throw new Error(error);
  }
}

module.exports = router;