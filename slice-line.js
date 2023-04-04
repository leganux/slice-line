const fs = require('fs');
const http = require('http');
const https = require('https');

const nodemailer = require("nodemailer");
const multer = require("multer");
const makeDir = require('make-dir');

const express = require('express');
const bodyParser = require('body-parser');
const getId = require('docker-container-id');

const morgan = require('morgan');
const moment = require('moment');
let osu = require('node-os-utils')
let hooli = require("hooli-logger-client")


const {v4: uuidv4} = require('uuid');


let sliceLine = function (mongoDBUri, port = 3010, options = {
    api_base_uri: false,
    activeLogRequest: false,
    active_cors: false,
    collection_name: "mail",
    mailTransporter: false
}, ssl_config = {}) {

    console.log(`
    v1.0.0
    Welcome to Slice-Line
        
 __ _ _              __ _            
/ _\\ (_) ___ ___    / /(_)_ __   ___ 
\\ \\| | |/ __/ _ \\  / / | | '_ \\ / _ \\
_\\ \\ | | (_|  __/ / /__| | | | |  __/
\\__/_|_|\\___\\___| \\____/_|_| |_|\\___|
                                                                                                                                                      
               This is a project made by leganux.net (c) 2021-2023 
                      ______________________________________
               Read the docs at https://www.npmjs.com/package/slice-line
                                
                                                                                                                            
`)

    try {
        this.mongoose = require("mongoose");
        if (!mongoDBUri) {
            throw new Error('You must to add the mongo db URI')
        }

        if (!options?.mailTransporter) {
            throw new Error('You must to add the mail configuration')
        }
        this.app = express()
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());


        this.activeLogRequest = false
        if (ssl_config && ssl_config.private && ssl_config.cert && ssl_config.port) {
            this.privateKey = fs.readFileSync(ssl_config.private, 'utf8');
            this.certificate = fs.readFileSync(ssl_config.cert, 'utf8');
            this.credentials = {key: this.privateKey, cert: this.certificate};
            this.httpsServer = https.createServer(this.credentials, this.app);
        }

        this.httpServer = http.createServer(this.app);
        this.mongoose.connect(mongoDBUri, {useUnifiedTopology: true, useNewUrlParser: true,});
        this.mongoose.set('strictQuery', true);
        this.db = this.mongoose.connection;
        this.api_base_uri = '/mail/';
        this.mailTransporter = options?.mailTransporter
        this.secure = false

        this.collection_name = "mail"
        this.collection_template_name = "mail_template"
        this.secure = false


        if (options.secure) {
            this.secure = options.secure
        }
        if (options.api_base_uri) {
            this.api_base_uri = options.api_base_uri
        }
        if (options.activeLogRequest) {
            this.activeLogRequest = options.activeLogRequest
        }
        if (options?.active_cors) {
            this.app.use((_req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
                res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
                next();
            });
        }
        if (options?.collection_name) {
            this.collection_name = options.collection_name
        }
        if (options?.collection_template_name) {
            this.collection_template_name = options.collection_template_name
        }

        let el__ = this
        el__.db_timestamps = true

        let Schema = this.mongoose.Schema;
        this.MSchema = new Schema({
            host: {
                type: String
            },
            template: {
                type: String
            },
            replaces: {
                type: Schema.Types.Mixed
            },
            port: {
                type: Number
            },
            secure: {
                type: Boolean
            },
            from: {
                type: String
            },
            fromName: {
                type: String
            },
            to: {
                type: String
            },
            subject: {
                type: String
            },
            text: {
                type: String
            },
            html: {
                type: Boolean
            },
            attachments: [{
                filename: String,
                content: String
            }],
            response: {
                type: Schema.Types.Mixed
            },

        }, {timestamps: el__.db_timestamps})
        this.templatesSchema = new Schema({
            subject: {
                type: String
            },
            name: {
                type: String
            },
            text: {
                type: String
            },
            html: {
                type: Boolean
            },
            attachments: [{
                filename: String,
                content: String
            }],

        }, {timestamps: el__.db_timestamps})

        this.mailModel = this.mongoose.model(el__.collection_name, this.MSchema, el__.collection_name)
        this.templateModel = this.mongoose.model(el__.collection_template_name, this.templatesSchema, el__.collection_template_name)

        this.transporter = nodemailer.createTransport(el__.mailTransporter);

        this.getWordsBetweenBrackets = function (str) {
            var results = [], re = /{{([^}]+)}}/g, text;

            while (text = re.exec(str)) {
                results.push(text[1]);
            }
            return results;
        }

        this.decodeBase64 = function (data) {
            return Buffer.from(data, 'base64').toString('utf8')
        }
        this.initialize = function () {
            let el = this
            if (el.activeLogRequest) {
                el.app.use(morgan(function (tokens, req, res) {
                    return [
                        moment().format('YYYY-MM-DD hh:mm:ss'),
                        tokens.method(req, res),
                        tokens.url(req, res),
                        tokens.status(req, res),
                        tokens['response-time'](req, res), 'ms'
                    ].join('  ');
                }))
            }

            let upload = {}

            const storage = multer.diskStorage({
                destination: async function (req, file, cb) {
                    let path_ = await makeDir('attachments/');
                    cb(null, path_)
                },
                filename: function (req, file, cb) {
                    cb(null, uuidv4() + file.originalname)
                }
            })

            upload = multer({
                storage: storage
            })
            let middleware = async function (req, res, next) {
                if (!el.secure) {
                    next()
                    return
                }
                if (!el?.secure?.user || !el?.secure?.password) {
                    res.status(403).json({
                        success: true,
                        code: 403,
                        error: 'The user or password is not set',
                        message: '403 - Forbidden ',
                        container_id: await getId(),

                    })
                    return
                }


                if (!req?.headers?.authorization && !req?.query?.authorization) {
                    res.status(403).json({
                        success: true,
                        code: 403,
                        error: 'Token or header not present',
                        message: '403 - Forbidden ',
                        container_id: await getId(),
                    })
                    return
                }

                let auth = (req?.headers?.authorization?.replace('Basic ', '')) || (req?.query?.authorization?.replace('Basic ', ''))


                let decoded = el.decodeBase64(auth)


                if (decoded != (el.secure.user + ':' + el.secure.password)) {
                    res.status(403).json({
                        success: true,
                        code: 403,
                        error: 'Invalid Access or credentials',
                        message: '403 - Forbidden ',
                        container_id: await getId(),

                    })
                    return
                }

                next()
            }

            el.app.get('/', async function (_req, res) {
                res.status(200).json({
                    success: true,
                    code: 200,
                    error: '',
                    message: 'Slice Line has been successful started',
                    container_id: await getId()
                })
            })

            el.app.post(el.api_base_uri + 'attachments/upload/', upload.any(), middleware, async function (req, res) {

                try {
                    let response = []
                    for (let item of req.files) {
                        let newfile = {
                            filename: item.originalname,
                            path_filename: item?.filename || '',
                            path: item?.path || '',
                            content: item?.destination || '',
                            extension: item.contentType
                        }
                        response.push(newfile)
                    }
                    res.status(200).json({
                        success: true,
                        code: 200,
                        error: false,
                        message: 'Upload OK',
                        container_id: await getId(),
                        data: response
                    })
                } catch (e) {
                    console.error(e)
                    res.status(500).json({
                        success: false,
                        code: 500,
                        error: e,
                        message: 'Upload Error',
                        container_id: await getId()
                    })
                }


            })

            el.app.post(el.api_base_uri + 'send/', middleware, async function (req, res) {

                try {
                    let response = []
                    let {fromName, from, to, subject, html, text, template, replaces, attachments} = req.body

                    if ((!fromName || fromName.trim() == '' || !subject || subject.trim() == '' || !to || to.trim() == '')) {
                        res.status(400).json({
                            success: false,
                            code: 400,
                            error: 'Bad Request',
                            message: 'Incomplete data in body',
                            container_id: await getId(),
                            data: response
                        })
                        return
                    }
                    if ((!to.trim().includes('@') || !to.trim().includes('.'))) {
                        res.status(400).json({
                            success: false,
                            code: 400,
                            error: 'Bad Request',
                            message: 'Invalid TO mail',
                            container_id: await getId(),
                            data: response
                        })
                        return
                    }
                    if ((!from.trim().includes('@') || !from.trim().includes('.'))) {
                        res.status(400).json({
                            success: false,
                            code: 400,
                            error: 'Bad Request',
                            message: 'Invalid FROM mail',
                            container_id: await getId(),
                            data: response
                        })
                        return
                    }

                    let prepareMail = {
                        from: fromName + ' <' + from + '>',
                        to: to,
                        subject: subject,
                        text: text || undefined,
                        html: html || undefined,
                    }

                    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
                        prepareMail.attachments = attachments
                    }

                    if (template) {
                        let tmp = await el.templateModel.findOne({name: template})
                        if (tmp) {
                            let optSubject = el.getWordsBetweenBrackets(tmp.subject)
                            for (let item of optSubject) {
                                tmp.subject = tmp.subject.replace('{{' + item + '}}', replaces[item])
                            }
                            let optText = el.getWordsBetweenBrackets(tmp.text)
                            for (let item of optText) {
                                tmp.text = tmp.text.replace('{{' + item + '}}', replaces[item])
                            }
                            let optHTML = el.getWordsBetweenBrackets(tmp.html)
                            for (let item of optHTML) {
                                tmp.html = tmp.html.replace('{{' + item + '}}', replaces[item])
                            }
                            prepareMail.html = tmp.html
                            prepareMail.subject = tmp.subject
                            prepareMail.text = tmp.text
                        }

                    }

                    let info = await el.transporter.sendMail(prepareMail);

                    prepareMail.template = template
                    prepareMail.replaces = replaces
                    prepareMail.fromName = fromName
                    prepareMail.host = el?.mailTransporter?.host
                    prepareMail.port = el?.mailTransporter?.port
                    prepareMail.secure = el?.mailTransporter?.secure
                    prepareMail.response = info

                    let newMail = new el.mailModel(prepareMail)
                    newMail = await newMail.save()


                    res.status(200).json({
                        success: true,
                        code: 200,
                        error: false,
                        message: 'Upload OK',
                        container_id: await getId(),
                        data: newMail
                    })
                } catch (e) {
                    console.error(e)
                    res.status(500).json({
                        success: false,
                        code: 500,
                        error: e,
                        message: 'Upload Error',
                        container_id: await getId()
                    })
                }


            })

            el.app.post(el.api_base_uri + 'template/', middleware, async function (req, res) {

                try {
                    let response = []
                    let {subject, html, text, name, attachments} = req.body

                    if ((!name || name.trim() == '' || !subject || subject.trim() == '')) {
                        res.status(400).json({
                            success: false,
                            code: 400,
                            error: 'Bad Request',
                            message: 'Incomplete data in body',
                            container_id: await getId(),
                            data: response
                        })
                        return
                    }

                    let newtempl = new el.templateModel({
                        subject,
                        name,
                        text,
                        html,
                        attachments
                    })

                    newtempl = await newtempl.save()


                    res.status(200).json({
                        success: true,
                        code: 200,
                        error: false,
                        message: 'Upload OK',
                        container_id: await getId(),
                        data: newtempl
                    })
                } catch (e) {
                    console.error(e)
                    res.status(500).json({
                        success: false,
                        code: 500,
                        error: e,
                        message: 'Upload Error',
                        container_id: await getId()
                    })
                }


            })

            el.app.get(el.api_base_uri + 'template/', middleware, async function (req, res) {

                try {

                    let {where, like, paginate, sort} = req?.query


                    let find = {}
                    if (where) {
                        for (let [key, value] of Object.entries(where)) {
                            find[key] = value
                        }
                    }
                    if (like) {
                        for (let [key, value] of Object.entries(like)) {
                            find[key] = {$regex: value, $options: 'i'}
                        }
                    }
                    let one = el.templateModel.find(find)

                    let order = {}
                    if (sort) {
                        for (let [key, value] of Object.entries(sort)) {
                            order[key] = value
                        }
                    }
                    one.sort(order)

                    if (paginate && paginate.limit && paginate.page) {
                        one.skip(Number(paginate.limit) * Number(paginate.page))
                        one.limit(Number(paginate.limit))
                    }

                    one = await one.exec()

                    if (!one || one.length == 0) {
                        res.status(404).json({
                            success: false,
                            code: 404,
                            error: 'Templates no found',
                            message: '404 - Not- Found ',
                            container_id: await getId(),

                        })
                        return
                    }

                    res.status(200).json({
                        success: true,
                        code: 200,
                        error: false,
                        message: 'OK',
                        container_id: await getId(),
                        data: one
                    })
                } catch (e) {
                    console.error(e)
                    res.status(500).json({
                        success: false,
                        code: 500,
                        error: e,
                        message: 'Upload Error',
                        container_id: await getId()
                    })
                }


            })

            el.app.get(el.api_base_uri + 'list/', middleware, async function (req, res) {

                try {

                    let {where, like, paginate, sort} = req?.query


                    let find = {}
                    if (where) {
                        for (let [key, value] of Object.entries(where)) {
                            find[key] = value
                        }
                    }
                    if (like) {
                        for (let [key, value] of Object.entries(like)) {
                            find[key] = {$regex: value, $options: 'i'}
                        }
                    }
                    let one = el.mailModel.find(find)

                    let order = {}
                    if (sort) {
                        for (let [key, value] of Object.entries(sort)) {
                            order[key] = value
                        }
                    }
                    one.sort(order)

                    if (paginate && paginate.limit && paginate.page) {
                        one.skip(Number(paginate.limit) * Number(paginate.page))
                        one.limit(Number(paginate.limit))
                    }

                    one = await one.exec()

                    if (!one || one.length == 0) {
                        res.status(404).json({
                            success: false,
                            code: 404,
                            error: 'Mails no found',
                            message: '404 - Not- Found ',
                            container_id: await getId(),

                        })
                        return
                    }

                    res.status(200).json({
                        success: true,
                        code: 200,
                        error: false,
                        message: ' OK',
                        container_id: await getId(),
                        data: one
                    })
                } catch (e) {
                    console.error(e)
                    res.status(500).json({
                        success: false,
                        code: 500,
                        error: e,
                        message: 'Upload Error',
                        container_id: await getId()
                    })
                }


            })


        }

        this.addHooliLogger = async function (host = "http://localhost:3333", AppName = 'tres-comas') {
            let el = this
            let logger = new hooli(host, AppName, await getId() || 'API-REST')
            const _privateLog = console.log;
            const _privateError = console.error;
            const _privateInfo = console.info;
            const _privateWarn = console.warn;
            const _privateDebug = console.debug;

            console.log = async function (message) {
                _privateLog.apply(console, arguments);
                logger.log(arguments)
            };
            console.error = async function (message) {
                _privateError.apply(console, arguments);
                logger.error(arguments)
            };
            console.info = async function (message) {
                _privateInfo.apply(console, arguments);
                logger.info(arguments)
            };
            console.warn = async function (message) {
                _privateWarn.apply(console, arguments);
                logger.warn(arguments)
            };
            console.debug = async function (message) {
                _privateDebug.apply(console, arguments);
                logger.debug(arguments)
            };
            el.app.use(morgan(function (tokens, req, res) {
                /*  Implement request logger  */
                logger.request(JSON.stringify({
                    method: tokens.method(req, res),
                    url: tokens.url(req, res),
                    status: tokens.status(req, res),
                    body: req.body,
                    query: req.query,
                    params: req.params,
                }))
                return '';
            }));
        }
        this.publishServerStats = async function () {
            let el = this
            let {cpu, drive, osCmd, mem, netstat, os} = osu
            el.app.get(el.api_base_uri + 'STATS', async function (_req, res) {
                try {
                    let obj_counts = []

                    res.status(200).json({
                        success: true,
                        code: 200,
                        error: '',
                        message: 'APIed-Piper server statistics',
                        data: {
                            model_counts: obj_counts,
                            cpu_usage: await cpu.usage(),
                            cpu_average: await cpu.average(),
                            cpu_free: await cpu.free(),
                            cpu_count: await cpu.count(),
                            osCmd_whoami: await osCmd.whoami(),
                            drive_info: await drive.info(),
                            drive_free: await drive.free(),
                            drive_used: await drive.used(),
                            mem_used: await mem.used(),
                            mem_free: await mem.free(),

                            netstat_inout: await netstat.inOut(),
                            os_info: await os.oos(),
                            os_uptime: await os.uptime(),
                            os_platform: await os.platform(),
                            os_ip: await os.ip(),
                            os_hostname: await os.hostname(),
                            os_arch: await os.arch(),
                        },
                        container_id: await getId()
                    })
                } catch (e) {
                    console.error(e)
                    res.status(500).json({
                        success: false,
                        code: 500,
                        error: 'Internal server error',
                        message: e.message,
                    })
                }
            })
        }
        this.start = async function () {
            this.app.get('*', async function (_req, res) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    error: 'Resource not found',
                    message: 'APIed Piper has been successful started',
                    container_id: await getId()
                })
            })
            if (ssl_config && ssl_config.private && ssl_config.cert && ssl_config.port) {
                this.httpsServer.listen(ssl_config.port, () => {
                    console.log("https server start al port", ssl_config.port);
                });
            }
            this.httpServer.listen(port ? port : 3000, () => {
                console.log("http server start al port", port ? port : 3000);
            });
            this.db.once("open", function () {
                console.log("MongoDB database connection established successfully", mongoDBUri);
            });
            return true
        }
    } catch (e) {
        console.error(e)
        throw e
    }
}
module.exports = sliceLine
