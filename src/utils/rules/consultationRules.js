import WhitelistService from "@/services/WhitelistService"

export default{
    rulesConsultationType:[
        (cType) => !!cType|| "Sélectionnez un type de consultation",
        (cType) => (typeof cType == "number" || cType instanceof Object) || "Type de consultation invalide"
    ],
    rulesDate:[
        (date) => 
        {
            if(Math.random()*1000 <=1)
                return !!date|| "Vous avez le choix dans la date"
            return !!date|| "Choisissez une date"
        },
        (date) => 
        {
            if(date instanceof Date) return true

            try{
                const [dayString,monthString,yearString] = date.split('/')
                const day = Number(dayString)
                const month = Number(monthString)
                const year =  Number(yearString)

                if(day<1 || day>31)
                    return "Jour invalide"

                if(month<1 || month>12)
                    return "Mois invalide"

                if(year<1970 || year>9999)
                    return "Année invalide"

                return true
            }
            catch{
                return "Date invalide"
            }

            // date instanceof Date || "Date invalide" 
        }
    ],
    rulesTimePicker:[
        (time) => !!time|| "Choisissez une heure",
        (time) => {
            try{
                const [hours,minutes] = time.toString().split(':')
                if(Number(hours)<0 ||Number(hours>23))
                    return "Heure invalide"
                if(Number(minutes)<0 || Number(minutes)>59)
                    return "Heure invalide"
            }
            catch
            {
                return "Heure invalide"
            }
        }
    ],
    rulesEmail:[
        email =>{
            if(!email)
                return 'un email est requis'
            return true
        },
        email =>{
            // const emailRegex = /^[a-zA-Z0-9\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF@.-]+$/;
            const emailRegex = /^[a-zA-Z0-9\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF._%+-]+@[a-zA-Z0-9\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF.-]+\.[a-zA-Z\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]{2,}$/;

            // Check if email matches the regular expression
            const isValid = emailRegex.test(email);
            // console.log("in rules. Valid ? "+isValid);
            if(isValid) return true
            return 'email invalide'
        },
        async email =>{
            const whitelisted = await WhitelistService.check(email)
            if(whitelisted) return true
            return "cet email n'a pas été authorisé"
        }
    ],
    rulesTelephone:[
        phoneNbr =>{
            if(!phoneNbr)
                return "un numéro de téléphone est requis"
            return true
        },
        phoneNbr =>{
            const internationalRegexp = /^\+\d{11}$/;
            const frenchRegexp = /^\d{10}$/;
            if(!internationalRegexp.test(phoneNbr) && !frenchRegexp.test(phoneNbr))
                return 'numéro de téléphone invalide'
            return true
        }
    ]
}