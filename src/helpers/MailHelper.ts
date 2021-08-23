import nodemailer from 'nodemailer';

class MailHelper {
    transporter: any;
    login : string;
    host: string;
    password : string;

    constructor () {
        this.host = 'smtp.gmail.com';
        this.login = 'maxkapustian@gmail.com';
        this.password = '07hopore';

        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: 587,
            secure: false,
            auth: {
                user: this.login,
                pass: this.password,
            }
        });

    }    

    sendActivationMail ( to: string, link: string ) {
        console.log(link);
        this.transporter.sendMail({
            from: this.login,
            to,
            subject: "Активация аккаунта для сервиса GoClean",
            text: '',
            html: 
                `
                    <div>
                        <h1> Для активации аккаунта перейдите по ссылке снизу</h1>
                        <a href="${link}"> ${link} </a>
                    </div>
                `
        })
    }
}

export default new MailHelper;