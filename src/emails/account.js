const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "chiragkapoor_ck@icloud.com",
        subject: "Welcome to Task-Manager App.",
        text: `Thanks for starting this journey with us, ${name}. We are glad to have you with us.`
    }).then((result) => {
        console.log(result.request)
    }).catch((error) => {
        console.log(error.response.body)
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chiragkapoor_ck@icloud.com',
        subject: `Goodbye ${name}`,
        text: "We would love to know your feedback on how we can get better."
    }).then((result) => {
        console.log(result.request)
    }).catch((error) => {
        console.log(error.response.body)
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}