import { DataTypes } from "sequelize"
import sequelize from "../sequelize"

export const Todo = sequelize.define('Todo', {
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    content:{
        type: DataTypes.STRING,
        allowNull: false
    },
    statut:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    timestamps: false,
    tableName: 'Company'
})
