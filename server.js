const Joi = require('joi')
const Hapi = require('@hapi/hapi');
const User = require('./Module/user');
const { payload } = require('@hapi/hapi/lib/validation');

const init = async () => {
    const server = Hapi.server({
        port: 8000,
        host: 'localhost'
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);

    //// POST DATA
    server.route({
        method: 'POST',
        path: '/create',
        options: {
            validate: {
                payload: Joi.object({
                    // name: Joi.string().min(3).max(10),
                    // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'org'] } }).required(),
                    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()

                    name: Joi.string().min(3).max(10),
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }), 
            }
        },
        handler: async (req, h) => {
            console.log('ENTERED INTO POST...')
            const { name, email, password } = req.payload;
            console.log(req.payload);                        
            try {
                await User.query().insert({
                    name,
                    email,
                    password
                })
                return h.response(' Congrates Your Data Insert Succesfully');
            } catch (error) {
                return h.response('Duplicate Data are not allowed');
            }  
        },

    });

    //// READ DATA BY ID
    server.route({
        method: 'GET',
        path: '/read/{id}',
        handler: async (req, h) => {
            console.log('ENTERED INTO READ...')
            try {
                const data = await User.query()
                .select("*").from('hapi_table')
                .where('id', req.params.id);
                return h.response(data,"This is your data ,Read succesfully")
            } catch (error) {
                return h.response('Data is unable to READ')   
            }
        }
    });

    //// UPDATE DATA BY ID
    server.route({
        method: 'PUT',
        path: '/update/{id}',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(1).max(40),
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }),
            }
        },
        handler: async (req, h) => {
            console.log('ENTERED INTO UPDATE...')
            const { name, email, password } = req.payload;
            try {
                const data = await User.query()
                .select("*").from('hapi_table')
                .where('id', req.params.id).update({
                    name,email,password
                })
                return h.response('Your new data is UPDATED')
            } catch (error) {
                return h.response('Data is NOT Updated')
            }    
        }
    });
    
    //// DELETE data BY ID
    server.route({
        method: 'DELETE',
        path: '/delete/{id}',
        handler: async (req, h) => {
            console.log('ENTERED INTO DELETE...')
            try {
                const data = await User.query()
                .select("*").from('hapi_table')
                .where('id', req.params.id).delete();
                return h.response('Your data is DELETED')
            } catch (error) {
                return h.response('Data is NOT DELETED')       
            }
        }
    });
};

init();