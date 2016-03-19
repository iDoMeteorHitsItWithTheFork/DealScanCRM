'use strict';

import crypto from 'crypto';
import config from '../../config/environment';

var validatePresenceOf = function (value) {
    return value && value.length;
};

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {

        userID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: {
                msg: 'The specified email address is already in use.'
            },
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING(12),
            validate: {
                isNumeric: {
                    msg: 'Phone number must be numeric'
                }
            }
        },
        role: {
            type: DataTypes.ENUM,
            values: config.userRoles,
            defaultValue: 'sale_rep',
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        provider: DataTypes.STRING,
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['pending', 'active', 'suspended', 'deleted'],
            allowNull: false,
            defaultValue: 'active'
        }

    }, {

        /**
         * Virtual Getters
         */
        getterMethods: {
            // Public profile information
            profile: function () {
                return {
                    'name': this.getDataValue('firstName') + ' ' + this.getDataValue('lastName'),
                    'email': this.getDataValue('email'),
                    'phone': this.getDataValue('phone'),
                    'role': config.getDisplayRole(this.getDataValue('role'))
                };
            },

            // Non-sensitive info we'll be putting in the token
            token: function () {
                return {
                    'userID': this.getDataValue('userID'),
                    'email': this.getDataValue('email'),
                    'phone': this.getDataValue('phone'),
                    'role': this.getDataValue('role')
                };
            }
        },

        /**
         * Pre-save hooks
         */
        hooks: {
            beforeBulkCreate: function (users, fields, fn) {
                var totalUpdated = 0;
                users.forEach(function (user) {
                    user.updatePassword(function (err) {
                        if (err) {
                            return fn(err);
                        }
                        totalUpdated += 1;
                        if (totalUpdated === users.length) {
                            return fn();
                        }
                    });
                });
            },
            beforeCreate: function (user, fields, fn) {
                user.updatePassword(fn);
            },
            beforeUpdate: function (user, fields, fn) {
                if (user.changed('password')) {
                    return user.updatePassword(fn);
                }
                fn();
            }
        },

        /**
         * Instance Methods
         */
        instanceMethods: {
            /**
             * Authenticate - check if the passwords are the same
             *
             * @param {String} password
             * @param {Function} callback
             * @return {Boolean}
             * @api public
             */
            authenticate: function (password, callback) {
                if (!callback) {
                    return this.password === this.encryptPassword(password);
                }

                var _this = this;
                this.encryptPassword(password, function (err, pwdGen) {
                    if (err) {
                        callback(err);
                    }

                    if (_this.password === pwdGen) {
                        callback(null, true);
                    }
                    else {
                        callback(null, false);
                    }
                });
            },

            /**
             * Make salt
             *
             * @param {Number} byteSize Optional salt byte size, default to 16
             * @param {Function} callback
             * @return {String}
             * @api public
             */
            makeSalt: function (byteSize, callback) {
                var defaultByteSize = 16;

                if (typeof arguments[0] === 'function') {
                    callback = arguments[0];
                    byteSize = defaultByteSize;
                }
                else if (typeof arguments[1] === 'function') {
                    callback = arguments[1];
                }

                if (!byteSize) {
                    byteSize = defaultByteSize;
                }

                if (!callback) {
                    return crypto.randomBytes(byteSize).toString('base64');
                }

                return crypto.randomBytes(byteSize, function (err, salt) {
                    if (err) {
                        callback(err);
                    }
                    return callback(null, salt.toString('base64'));
                });
            },

            /**
             * Encrypt password
             *
             * @param {String} password
             * @param {Function} callback
             * @return {String}
             * @api public
             */
            encryptPassword: function (password, callback) {
                if (!password || !this.salt) {
                    if (!callback) {
                        return null;
                    }
                    return callback(null);
                }

                var defaultIterations = 10000;
                var defaultKeyLength = 64;
                var salt = new Buffer(this.salt, 'base64');

                if (!callback) {
                    return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                        .toString('base64');
                }

                return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
                    function (err, key) {
                        if (err) {
                            callback(err);
                        }
                        return callback(null, key.toString('base64'));
                    });
            },

            /**
             * Update password field
             *
             * @param {Function} fn
             * @return {String}
             * @api public
             */
            updatePassword: function (fn) {
                // Handle new/update passwords
                if (this.password) {
                    if (!validatePresenceOf(this.password)) {
                        fn(new Error('Invalid password'));
                    }

                    // Make salt with a callback
                    var _this = this;
                    this.makeSalt(function (saltErr, salt) {
                        if (saltErr) {
                            fn(saltErr);
                        }
                        _this.salt = salt;
                        _this.encryptPassword(_this.password, function (encryptErr, hashedPassword) {
                            if (encryptErr) {
                                fn(encryptErr);
                            }
                            _this.password = hashedPassword;
                            fn(null);
                        });
                    });
                } else {
                    fn(null);
                }
            }
        }
    });

    return User;
};
