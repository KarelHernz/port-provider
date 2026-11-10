const net = require('node:net');

//If desiredPort is 0, the OS will assign a random free port
function getFreePort(desiredPort){
    return new Promise((resolve, reject) => {
        //Create a server to check if the desired port is free
        const server = net.createServer();

        //Try to listen on the desired port
        server.listen(desiredPort, () => {
            //If successful, get the assigned port and close the server
            const {port} = server.address();

            //Close the server and resolve the promise with the free port
            server.close(() => {
                resolve(port);
            });
        });

        //Handle errors, such as the port being in use
        server.on("error", (err) => {
            //If the desired port is in use, try to find a free port by passing 0
            if (err.code === "EADDRINUSE") {
                getFreePort(0).then(port => resolve(port));
            } else {
                //If there's another error, reject the promise with the error
                reject(err);
            }
        });
    });
}

//Export the getFreePort function for use in other modules
module.exports = {getFreePort};

//Example usage:
getFreePort(3000).then(port => {
    console.log(`Free port found: ${port}`);
}).catch(err => {
    console.error(`Error finding free port: ${err}`);
});