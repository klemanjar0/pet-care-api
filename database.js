var express = require('express');
const fetch = require('node-fetch');
const bodyParser = require("body-parser");

const doDropTable = false;
const { Sequelize, DataTypes } = require('sequelize');
const urlencodedParser = bodyParser.urlencoded({extended: false});

const sequelize = new Sequelize("userspetcare", "root", "", {
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

sequelize
    .sync({ force: doDropTable })
    .then(function(err) {
        console.log('It worked!');
    }, function (err) {
        console.log('An error occurred while creating the table:', err);
    });

module.exports.userDatabase = userDatabase;