let sliceLine = require('./index')


let options = {
    api_base_uri: '/mail/',
    activeLogRequest: true,
    active_cors: true,
    collection_name: "mail",
    collection_template_name: "mail_template",
    mailTransporter: {
        host:'smtp.hostinger.com',
        port:465,
        secure:true,
        auth:{
            user:"admin@mygeek.zone",
            pass:"XXXXXXXXXXXXXXXX"
        }
    }
}

let mail = new sliceLine('mongodb://localhost/mail', 3010, options)
mail.initialize()
mail.start()
