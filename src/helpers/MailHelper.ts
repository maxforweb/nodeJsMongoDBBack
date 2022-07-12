import nodemailer from 'nodemailer';

class MailHelper {
    transporter: any;
    login : string;
    host: string;
    password : string;

    constructor () {
        this.host = 'smtp.gmail.com';
        this.login = 'maxkapustian@gmail.com';
        this.password = 'jaghir-naXgaj-nywpu8';

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

    async sendActivationMail ( to: string, link: string ): Promise<void> {
        
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
        .catch( ( err: object ) => {
            throw err;
        })
    }

    async sendResetPasswordEmail ( to: string, link: string ): Promise<void> {
        this.transporter.sendMail({
            from: this.login,
            to,
            subject: "Запрос на восстановление пароля для сервиса GoClean",
            text: '',
            html: 
            `
                <div>
                    <h1> Для восстановления пароля перейдите по ссылке ниже </h1>
                    <a href="${link}" > ${link} </a> 
                </div>
            `
        }).catch((err: object) => {
            throw err
        })
    }
}

export default new MailHelper;