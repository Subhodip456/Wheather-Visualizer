const axios = require('axios');
const { random } = require('lodash'); // To generate random numbers
const { DateTime } = require('luxon'); // To handle date and time
const url = "http://ec2-52-10-248-119.us-west-2.compute.amazonaws.com:3000/data";

const isoString = DateTime.utc().toISO();
const timeString = DateTime.fromISO(isoString).toFormat('HH.mm');

console.log(timeString);
// Function to generate random data
function generateData() {
    return {
        timestamp: timeString,
        temperature: parseFloat((Math.random() * (30.0 - 20.0) + 20.0).toFixed(2)),
        humidity: parseFloat((Math.random() * (70.0 - 40.0) + 40.0).toFixed(2)),
        pressure: parseFloat((Math.random() * (1020.0 - 1000.0) + 1000.0).toFixed(2))
    };
}



// Function to send data to the server
async function sendData(url, data) {
    try {
        const response = await axios.post(url, data);
        console.log(`Status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error(`Error sending data: ${error}`);
    }
}

// Main function to generate and send data every 10 seconds
async function main() {
    while (true) {
        const data = generateData();
        console.log("data = ", data);
        await sendData(url, data);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 10 seconds
    }
}

// Run the main function
main();
