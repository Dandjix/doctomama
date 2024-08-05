export function formatTime(startTime,duration){
    const days = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
    const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Novembre','Décembre']

    const start = new Date(startTime)
    const end = new Date(startTime)
    end.setMinutes(start.getMinutes()+duration)
    
    const day = days[modulo(start.getDay()-1,7)]
    const date = start.getDate()
    const month = months[start.getMonth()]
    const year = start.getFullYear()
    const startHour = `${zeroPad(start.getHours())}:${zeroPad(start.getMinutes())}`
    const endHour = `${zeroPad(end.getHours())}:${zeroPad(end.getMinutes())}`

    return `${day} ${date} ${month} ${year} de ${startHour} à ${endHour}`

    // return "Lundi 18 Janvier 2024 de 08:00 à 9:00"
}

function zeroPad(number)
{
    const res = String(number).padStart(2,'0')
    return res
}

function modulo(x,modulo)
{
    var res = x%modulo
    if(res<0)
        res+=modulo
    if(res>=modulo)
        res -= modulo
    return res
}