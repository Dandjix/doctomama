<template>
    <vue-cal class="calendar vuecal--full-height-delete"
    :events="events"
    :time-from="min"
    :time-to="max"
    :locale="fr"
    :on-event-click="eventClicked"
    @cell-click="cellClicked"
    :editable-events="{ title: false, drag: true, resize: false, delete: true, create: false }"
    
    @event-drop="eventDropped"
    @event-delete="eventDeleted"
    :disable-days="disabledDates"
    ></vue-cal>
</template>

<style scoped>
    .calendar{
        height: 500px;
    }
    :deep(.vuecal__event.vacation) {
        background-color: rgba(253, 156, 66, 0.9);
        border: 1px solid rgb(233, 136, 46);
        color: #fff;
    }

    :deep(.vuecal__event.consultation) {
        background-color: rgb(0, 159, 212);
        border: 1px solid rgb(0, 116, 193);
        color: white;
    }

    :deep(.vuecal__event.consultation_updated) {
        background-color: yellow;
        border: 1px solid rgb(233, 233, 0);
        color: black;
    }

    :deep(.vuecal__event.consultation_new) {
        background-color: rgb(6, 177, 0);
        border: 1px solid rgb(59, 154, 0);
        color: white;
    }

    :deep(.vuecal__event.timeSlot) {
        background-color: rgb(21, 0, 143);
        border: 1px solid rgb(5, 0, 99);
        color: white;
    }

    :deep(.vuecal__cell-events-count) {    background: #fd9c42;}

</style>

<script>
    // import SettingsService from '@/services/SettingsService';
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
        async data()
        {
            const minHour = await SettingsService.getSetting('heure_debut_calendrier')
            const maxHour = await SettingsService.getSetting('heure_fin_calendrier')
            return{
                fr,
                min:minHour,
                max:maxHour
            }
        },
        props:
        {
            events:{
                type:Array,
                required:true
            },
            disabledDates:{
                type:Array,
                default:()=>[]
            }
        },
        watch:
        {
            // async events()
            // {
            //     // const {min,max} = await getMinAndMax(newValue)
            //     this.min = "08:00"
            //     this.max = "18:00"
            // }
        },
        emits:['consultationClick','eventDropped','eventDeleted','cellClicked'],
        methods:
        {
            eventClicked(event)
            {
                if(!event || !event.eventType.startsWith("consultation"))
                    return
                // console.log("clicked at : "+JSON.stringify(event));
                this.$emit('consultationClick',event.id)
            },
            eventDropped(event)
            {
                this.$emit('eventDropped',event)
            },
            eventDeleted(event)
            {
                this.$emit('eventDeleted',event.id)
            },
            cellClicked(date)
            {
                // console.log(typeof date);
                
                if(!(date instanceof Date))
                {
                    // console.log("not a date");
                    
                    return
                }
                // console.log("date : "+JSON.stringify(date));

                this.$emit('cellClicked',date)
            }
        }
    }

    // async function getMinAndMax(events)
    // {
    //     var settingsMin = await SettingsService.getSetting('heure_debut_calendrier')
    //     var settingsMax = await SettingsService.getSetting('heure_fin_calendrier')

    //     settingsMax = hourToMinutes(settingsMax)
    //     settingsMin = hourToMinutes(settingsMin)
    //     // console.log("sm : "+JSON.stringify(settingsMin));

    //     var min = 60*24
    //     var max = 0
    //     // console.log("new value for events : "+newValue);
    //     for (let i = 0; i < events.length; i++) {
    //         const event = events[i];
    //         if(!(event.start instanceof Date) || !(event.end instanceof Date))
    //         {
    //             continue
    //         }
    //         const startMin = event.start.getHours()*60+event.start.getMinutes()
    //         const endMin = event.end.getHours()*60+event.end.getMinutes()
    //         if(startMin<min)
    //             min = startMin
    //         if(endMin>max)
    //             max = endMin
    //     }
    //     // console.log("min : "+min);
        

    //     min = Math.min(min,settingsMin)
    //     max = Math.max(max,settingsMax)
    //     return {min,max}
    // }

    // function hourToMinutes(hour)
    // {
    //     const [hours,minutes] = hour.split(":")

    //     // console.log("h : "+hours+", m : "+minutes);
        

    //     return Number(hours)*60+Number(minutes)
    // }
</script>