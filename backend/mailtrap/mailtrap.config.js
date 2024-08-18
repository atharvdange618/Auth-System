import { MailtrapClient } from "mailtrap";

const TOKEN = "2f6c59d3cc5b99d23b2c55433690555b";
const ENDPOINT = "https://send.api.mailtrap.io/";

export const mailtrapClient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Auth System",
};
