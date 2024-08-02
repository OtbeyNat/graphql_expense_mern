import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null};

export const connectDB = async () => {
    
    if (cached.conn) return cached.conn;
    // if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');
    cached.promise = cached.promise || mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'expense-gql',
        bufferCommands: false,
    })
    
    cached.conn = await cached.promise;
    console.log(cached.conn.connection.host)
    return cached.conn;
}


// export const connectDB = async () => {
// 	try {
// 		const conn = await mongoose.connect(process.env.MONGO_URI,{
        //     dbName: 'expense-gql',
        //     bufferCommands: false,
        // });
// 		console.log(`MongoDB Connected: ${conn.connection.host}`);
// 	} catch (err) {
// 		console.error(`Error: ${err.message}`);
// 		process.exit(1);
// 	}
// };


// // serverless functions for environments where code can be executed multiple times, but not in single continuous server process; need to manage database connections efficiently
// // each invocation of serverless function can result in new connection to database
// // can exhaust database resources
// // server actions have to connect to database each time