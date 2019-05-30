module.exports = function (sequelize, DataTypes) {
    return sequelize.define('theme',
        {
            name: {
                type: DataTypes.STRING
            }
        });
};