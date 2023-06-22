const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql');

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

const usersProto = grpc.loadPackageDefinition(packageDefinition);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_db'
});

db.connect((error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Connected to database');
});

const server = new grpc.Server();

server.addService(usersProto.UserService.service, {
  AddUser: (call, callback) => {
    const user = call.request;
    db.query('INSERT INTO users SET ?', user, (error, result) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
      }
      user.id = result.insertId;
      callback(null, { success: true, user });
    });
  },
  // ListUsers: (call, callback) => {
  //   const user = call.request;
  //   db.query('SELECT * FROM users', (error, results) => {
  //     if (error) {
  //       console.error(error);
  //       callback(error, null);
  //       return;
  //     }
  //     const user = results[0];
  //     if (!user) {
  //       callback({ code: grpc.status.NOT_FOUND, details: 'User not found' }, null);
  //       return;
  //     }
  //     callback(null, { success: true, user });
  //   });
  // },
  GetUser: (call, callback) => {
    const id = call.request.id;
    db.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
      }
      const user = results[0];
      if (!user) {
        callback({ code: grpc.status.NOT_FOUND, details: 'User not found' }, null);
        return;
      }
      callback(null, { user });
    });
  },
  UpdateUser: (call, callback) => {
    const user = call.request;
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [user.name, user.email, user.id], (error) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
      }
      callback(null, { success: true, user });
    });
  },
  DeleteUser: (call, callback) => {
    const id = call.request.id;
    db.query('DELETE FROM users WHERE id = ?', [id], (error) => {
      if (error) {
        console.error(error);
        callback(error, null);
        return;
    }
    callback(null, { success: true, user });
    });
  }
});

server.bindAsync('127.0.0.1:3500', grpc.ServerCredentials.createInsecure(),
(error, port) => {
  console.log("Server running at http://127.0.0.1:3500");
  server.start();
}
)