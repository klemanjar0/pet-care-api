var express = require('express');
const fetch = require('node-fetch');
const bodyParser = require("body-parser");

const doDropTable = false;
const { Sequelize, DataTypes } = require('sequelize');
const urlencodedParser = bodyParser.urlencoded({extended: false});

const sequelize = new Sequelize("userspetcare", "root", "123456", {
    dialect: "mysql",
    host: "localhost"
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

var userDatabase = sequelize.define('users', {
    idUser: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    body: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true // Колонки createdAt и updatedAt будут созданы автоматически
});

var petDatabase = sequelize.define('pets', {
    idPet: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    idUser: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'users', // 'persons' refers to table name
            key: 'idUser', // 'id' refers to column name in persons table
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    species: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true // Колонки createdAt и updatedAt будут созданы автоматически
});

var sampleDatabase = sequelize.define('samples', {
    idSample: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    idPet: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'pets', // 'persons' refers to table name
            key: 'idPet', // 'id' refers to column name in persons table
        }
    },
    pulse_avg: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    distance_travel: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    calories_burnt: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    weight: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    start_time_measure: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    end_time_measure: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: false // Колонки createdAt и updatedAt будут созданы автоматически
});
userDatabase.hasOne(petDatabase, { foreignKey: 'idUser', foreignKeyConstraint: true })
petDatabase.hasOne(sampleDatabase, { foreignKey: 'idPet', foreignKeyConstraint: true })


sequelize
    .sync({ force: doDropTable })
    .then(function(err) {
        console.log('It worked!');
    }, function (err) {
        console.log('An error occurred while creating the table:', err);
    });

module.exports.getUser = function(login) {
    return new Promise((resolve, reject)=>{
        let userLogin = login;
        userDatabase.findAll({where:{login: userLogin}, raw: true })
            .then(users=>{
                resolve(users);
                console.log(users);
            }).catch(err=>reject(err));
    })
}

module.exports.userDatabase = userDatabase;
module.exports.petDatabase = petDatabase;
module.exports.sampleDatabase = sampleDatabase;
