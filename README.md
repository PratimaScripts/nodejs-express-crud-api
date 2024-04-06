# Node.js Express CRUD API

This repository contains a Node.js Express API for performing CRUD (Create, Read, Update, Delete) operations with a DynamoDB database. The API is designed to be hosted on AWS Elastic Beanstalk.

## Setup

1. **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure AWS Credentials**

    Ensure that your AWS credentials are configured properly on your local machine. You can do this by installing the AWS CLI and running `aws configure`.

4. **Create DynamoDB Table**

    Before deploying the API, create a DynamoDB table named `product-inventory` in the AWS region where you plan to deploy your application.

5. **Deploy the API**

    - Navigate to the AWS Management Console.
    - Open the Elastic Beanstalk service.
    - Click on "Create Application".
    - Enter the application name and description.
    - Choose "Node.js" as the platform.
    - Upload your application code or provide the repository URL.
    - Configure environment variables such as `PORT`, `AWS_REGION`, and `DYNAMODB_TABLE_NAME`.
    - Click "Create Application" to deploy your API.

6. **Access the API**

    Once the deployment is successful, you can access the API at the provided Elastic Beanstalk domain URL.

## API Endpoints

- `GET /product/:productId`: Retrieve a product by its ID.
- `GET /product`: Retrieve all products.
- `POST /product`: Create a new product.
- `PATCH /product`: Update an existing product.
- `DELETE /product/:productId`: Delete a product by its ID.

## Configuration

The API uses environment variables for configuration. You can set these variables in the Elastic Beanstalk environment configuration or use a `.env` file.

- `PORT`: Port number for the Express server (default: `3000`).
- `AWS_REGION`: AWS region where the DynamoDB table is located.
- `DYNAMODB_TABLE_NAME`: Name of the DynamoDB table used by the API (default: `product-inventory`).

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for any improvements or fixes.
