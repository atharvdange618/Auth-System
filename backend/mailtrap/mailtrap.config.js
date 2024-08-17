import { MailtrapClient } from "mailtrap";

const TOKEN = "2f6c59d3cc5b99d23b2c55433690555b";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "AtharV",
};
const recipients = [
    {
        email: "atharvdange.dev@gmail.com",
    }
];

client
    .send({
        from: sender,
        to: recipients,
        subject: "You are awesome!",
        text: "Congrats for sending test email with Mailtrap!",
        category: "Integration Test",
    })
    .then(console.log, console.error);