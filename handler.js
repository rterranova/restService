'use strict';
const SquareConnect = require('square-connect');
const crypto = require('crypto');

module.exports.charge = async (event, context, callback) => 
{
  (SquareConnect.ApiClient.instance).authentications["oauth2"].accessToken = process.env.ACCESS_TOKEN;
  
  const locationId = process.env.LOCATION_ID;
  const formData = JSON.parse(event.body); 
  
  let data = formData["payload"];
  let buff = new Buffer(data, 'base64');  
  let decode = buff.toString('ascii');
  let chargeData = JSON.parse(decode);  
  
  let idempotency_key = crypto.randomBytes(48).toString('base64'); 
  chargeData["idempotency_key"] = idempotency_key;
  
  const transActionsAPI = new SquareConnect.TransactionsApi();
  await transActionsAPI.charge(locationId, chargeData).then(function(transactionResponse)
  {
    const response = 
    {
      statusCode: 200,
      body: JSON.stringify(transactionResponse)
    };

    callback(null, response);    
  }
  ).catch(error => 
  {
      console.log(JSON.stringify(error, null, 2));      
      callback(error);
  });
};

module.exports.chargeTest = async (event, context, callback) => 
{
  const locationId = process.env.LOCATION_ID;
  const formData = JSON.parse(event.body); 
  
  let data = formData["payload"];
  let buff = new Buffer(data, 'base64');  
  let decode = buff.toString('ascii');
  let chargeData = JSON.parse(decode);  
  
  let idempotency_key = crypto.randomBytes(48).toString('base64'); 
  chargeData["idempotency_key"] = idempotency_key;  
  
  return {
    statusCode: 200,
    body: JSON.stringify(
    {
      message: 'Charge - Go Serverless v1.0! Your function executed successfully!',      
      data: chargeData,      
      id: locationId,
    }, null, 2),
  };  
};