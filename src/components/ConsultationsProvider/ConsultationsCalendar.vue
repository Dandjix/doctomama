<template>
    <vue-cal class="calendar" 
    :events="events"
    :time-from="min"
    :time-to="max"
    :locale="fr"
    :on-event-click="eventClicked">
    </vue-cal>
</template>

<style scoped>
    .calendar{
        height: 500px;
    }
    >>>.vuecal__event.vacation {background-color: rgba(253, 156, 66, 0.9);border: 1px solid rgb(233, 136, 46);color: #fff;}

    >>>.vuecal__event.consultation {
        background-color: green;
        border: 1px solid rgb(5, 99, 0);
        color: white;
    }

    >>>.vuecal__event.timeSlot {
        background-color: rgb(21, 0, 143);
        border: 1px solid rgb(5, 0, 99);
        color: white;
    }

    >>>.vuecal__cell-events-count {    background: #fd9c42;}

</style>

<script>
    import SettingsService from '@/services/SettingsService';
import VueCal from 'vue-cal';

    const fr = {
        "weekDays": ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
        "weekDaysShort": ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"],
        "months": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
        "years": "Années",
        "year": "Année",
        "month": "Mois",
        "week": "Semaine",
        "day": "Jour",
        "today": "Aujourd'hui",
        "noEvent": "Aucun événement",
        "allDay": "Toute la journée",
        "deleteEvent": "Supprimer",
        "createEvent": "Créer un événement",
        "dateFormat": "D MMMM YYYY dddd"
        };


    export default{
        name:"ConsultationsCalendar",
        components:
        {
            VueCal
        },
        data()
        {
            return{
                min:0,
                max:60*24,
                fr
            }
        },
        props:
        {
            events:{
                type:Array,
                required:true
            }
        },
        watch:
        {
            async events(newValue)
            {
                const {min,max} = await getMinAndMax(newValue)
                this.min = min
                this.max = max
            }
        },
        emits:['consultationClick'],
        methods:
        {
            eventClicked(event)
            {
                if(!event || event.eventType!="consultation")
                    return
                // console.log("clicked at : "+JSON.stringify(event));
                this.$emit('consultationClick',event.id)
            }
        }
    }

    async function getMinAndMax(events)
    {
        var settingsMin = await SettingsService.getSetting('heure_debut_calendrier')
        var settingsMax = await SettingsService.getSetting('heure_fin_calendrier')

        settingsMax = hourToMinutes(settingsMax)
        settingsMin = hourToMinutes(settingsMin)
        // console.log("sm : "+JSON.stringify(settingsMin));

        var min = 60*24
        var max = 0
        // console.log("new value for events : "+newValue);
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const startMin = event.start.getHours()*60+event.start.getMinutes()
            const endMin = event.end.getHours()*60+event.end.getMinutes()
            if(startMin<min)
                min = startMin
            if(endMin>max)
                max = endMin
        }
        // console.log("min : "+min);
        

        min = Math.min(min,settingsMin)
        max = Math.max(max,settingsMax)
        return {min,max}
    }

    function hourToMinutes(hour)
    {
        const [hours,minutes] = hour.split(":")

        // console.log("h : "+hours+", m : "+minutes);
        

        return Number(hours)*60+Number(minutes)
    }
</script>