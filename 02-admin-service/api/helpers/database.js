global.config = require(`../../config/${process.env.NODE_ENV}`);
var firebase = require("firebase");
// Exportar la configuración de la DB para usar databse o firestore
const db = firebase.initializeApp(global.config.fireConfig);


// console.log('Databse: ', db.database());
// ----------------------------------------------------------------------------
// connect
// ----------------------------------------------------------------------------
module.exports.connect = () => {
    return new Promise ((resolve, reject) => {
        resolve(
            console.log('Databse: ', db.database().ref('/hospital').toString() )
        );
        // reject(
        //     console.log('Error: database.connect')
        // );        
    });
};
// ----------------------------------------------------------------------------
// insert
// ----------------------------------------------------------------------------
module.exports.insert = ( name, data ) => {
    return new Promise ((resolve, reject) => {
        const userReference = db.database().ref( name + data.id);
        
        userReference.update({
            name: data.name,
            email: data.email,
            password: data.password
         }, ( err ) =>{

            if ( err ) {
                reject({
                    success: false,
                    message: 'User not saved, error: ', err
                });
            }

            resolve({
                success: true,
                message: 'User saved successfully'
            });
        })
    });
};
// ----------------------------------------------------------------------------
// getAllUsers
// ----------------------------------------------------------------------------
module.exports.getAll = ( name ) => {
    console.log('Entra en database');
    return new Promise ( (resolve, reject) => {
        const userReference =  db.database().ref( name );
        userReference.on("value", 
            (snapshot) => {
                // console.log('Snapshot', snapshot.val());
                // resolve(JSON.stringify(snapshot.val()));
                resolve( snapshot.val() );
                userReference.off("value");
            },
            ( errorObject ) => {
                console.log("The read failed: " + errorObject);
                reject({
                    success: false,
                    message: 'Not get users '
                });
            }
        );
    });
};

// ----------------------------------------------------------------------------
// findOne
// ----------------------------------------------------------------------------
module.exports.findOne = ( name, id ) => {
    return new Promise ( (resolve, reject) => {
        const userReference =  db.database().ref( name + id );
        userReference.on("value", 
            (snapshot) => {
                // console.log('Snapshot', snapshot.val());
                // resolve(JSON.stringify(snapshot.val()));
                resolve( snapshot.val() );
                userReference.off("value");
            },
            ( errorObject ) => {
                console.log("The read failed: " + errorObject.code);
                reject({
                    success: false,
                    message: 'Not get users '
                });
            }
        );
    });
};
// ----------------------------------------------------------------------------
// delete
// ----------------------------------------------------------------------------
module.exports.update = (name, filter, data) => {
    return new Promise ((resolve, reject) => {

        const user = {
            name: data.name,
            email: data.email,
            password: data.password
        }
        const userReference =  db.database().ref( name + filter.id );
        userReference.set( user, ( err ) =>{
            if ( err ) {
                reject({
                    success: false,
                    message: 'User not saved, error: ', err
                });
            }

            resolve({
                name: data.name,
                email: data.email
            });
        })
    });
};
// ----------------------------------------------------------------------------
// delete
// ----------------------------------------------------------------------------
module.exports.delete = (name, filter) => {
    return new Promise ((resolve, reject) => {
        console.log(filter.id);
        const userReference =  db.database().ref( name + filter.id );
        userReference.remove()
            .then( ( res ) => { resolve('User with id: filter.id removed succesfuly' ) })
            .catch(( err ) => { reject( err ) })
            .finally( console.log( 'Deleted user sended for log system ') )
    });
};