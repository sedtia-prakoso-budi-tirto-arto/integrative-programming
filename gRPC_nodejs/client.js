const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './user.proto';
const options =
{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const UserService = grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new UserService(
  "127.0.0.1:3500",
  grpc.credentials.createInsecure()
);

// function listUsers() {
//     client.ListUsers({}, (error, response) => {
//     if (error) {
//     console.error(error);
//     return;
//     }
//     console.log(response.users);
//     });
// }

function getUser(id) {
    client.GetUser({ id }, (error, response) => {
    if (error) {
    console.error(error);
    return;
    }
    console.log(response.user);
    });
}

function addUser(name, email) {
    const user = { name, email };
    client.AddUser(user, (error, response) => {
    if (error) {
    console.error(error);
    return;
    }
    console.log(response.user);
    });
}

function updateUser(id, name, email) {
    const user = { id, name, email };
    client.UpdateUser(user, (error, response) => {
    if (error) {
    console.error(error);
    return;
    }
    console.log(response);
    });
    }
    
    function deleteUser(id) {
    client.DeleteUser({ id }, (error, response) => {
    if (error) {
    console.error(error);
    return;
    }
    console.log(response);
    });
    }
    
    // listUsers();
    getUser(16);
    addUser('Budi', 'budi@example.com');
    updateUser(16, 'Prakas', 'prakas@example.com');
    deleteUser(9);