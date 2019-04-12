import * as jwt from 'jsonwebtoken';

export class Utility {
    public static JWTKey = 'sdsdeeef4cfygvhbjkn12375%^$';

    public static ValidateEmail(email: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    public static ValidateName(username: string): boolean {
        const re = /^[a-zA-Z]+$/;
        return re.test(String(username).toLowerCase());
    }

    // Advert validation.
    public static ValidatePrice(price: number): boolean {
        const re = /^[0-9]*$/;
        return re.test(price.toString());
    }

    public static ValidateTitle(title: string): boolean {
        const re = /^(?:[^"\'{};])+?$/;
        return re.test(String(title).toLowerCase());
    }

    public static ValidateAddress(address: string): boolean {
        const re = /^(?:[^"\'{};])+?$/;
        return re.test(String(address).toLowerCase());
    }

    public static ValidatePhone(phone: number): boolean {
        const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/;
        return re.test(phone.toString());
    }

    public static ValidateDescription(description: string): boolean {
        const re = /^(?:[^"\'{};])+?$/;
        return re.test(String(description).toLowerCase());
    }

    public static VerifyToken(token: string): any {
        try {
            let decodedJson = jwt.verify(token, Utility.JWTKey);
            return decodedJson;
        } catch {
            return false;
        }
    }

}