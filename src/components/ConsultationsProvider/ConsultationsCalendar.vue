<template>
    <vue-cal class="calendar vuecal--full-height-delete"
    :events="events"
    :time-from="min_minutes"
    :time-to="max_minutes"
    :locale="fr"
    :on-event-click="eventClicked"
    @cell-click="cellClicked"
    :editable-events="{ title: false, drag: true, resize: false, delete: true, create: false }"
    
    @event-drop="eventDropped"
    @event-delete="eventDeleted"
    :disable-days="disabledDates"

    :special-hours="specialHours"

    :min-date="minDate"
    ></vue-cal>
    <h1>values</h1>
    {{ min_minutes }}
    {{ max_minutes }}
    <h1>bottom text</h1>
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


    .business-hours {
        background-color: rgba(255, 255, 0, 0.15);
        border: solid rgba(255, 210, 0, 0.3);
        border-width: 2px 0;
    }

</style>

<script>
    // import SettingsService from '@/services/SettingsService';
import SettingsService from '@/services/SettingsService';
import WeekPlanningService from '@/services/WeekPlanningService';
import VueCal from 'vue-cal';
import { mapState } from 'vuex';

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
            const minDate = new Date()
            minDate.setHours(0,0,0,0)
            return{
                fr,
                min_minutes:480,
                max_minutes:1024,
                minDate:minDate,
                specialHours: {

                }
            }
        },
        computed:
        {
            ...mapState(['session'])
        },
        async mounted()
        {
            const min = await SettingsService.getSetting('heure_debut_calendrier')
            const max = await SettingsService.getSetting('heure_fin_calendrier')

            this.specialHours = this.toBusinessHours(await WeekPlanningService.getPlagesHorairesRaw(this.session))
            // const min = "8:00"
            // const max = "18:00"

            const [minHours,minMinutes] = min.split(':')
            const [maxHours,maxMinutes] = max.split(':')

            const minSum = Number(minHours)*60+Number(minMinutes)
            const maxSum = Number(maxHours)*60+Number(maxMinutes)

            // console.log("minSum : "+minSum);
            // console.log("maxSum : "+maxSum);
            this.min_minutes = minSum
            this.max_minutes = maxSum
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
                this.applyBounds(event.event)
                this.$emit('eventDropped',event)
            },
            applyBounds(event)
            {
                // console.log("event : "+JSON.stringify(event));
                
                const endMinutes = event.end.getHours()*60+event.end.getMinutes()
                if(endMinutes>this.max_minutes)
                {
                    const duration = endMinutes - event.start.getHours()*60+event.start.getMinutes()
                    const newStartMinutes = this.max_minutes-duration

                    const minutesStart = newStartMinutes%60
                    const hoursStart = Math.floor(newStartMinutes/60)

                    const minutesEnd = this.max_minutes%60
                    const hoursEnd = Math.floor(this.max_minutes/60)

                    event.start.setHours(hoursStart,minutesStart,0,0)
                    event.end.setHours(hoursEnd,minutesEnd,0,0)
                }
                else
                {
                    const startMinutes = event.start.getHours()*60 + event.start.getMinutes()
                    if(startMinutes<this.min_minutes)
                    {
                        const duration = endMinutes - event.start.getHours()*60+event.start.getMinutes()
                        const newEndMinutes = this.min_minutes+duration

                        const minutesStart = this.min_minutes%60
                        const hoursStart = Math.floor(this.min_minutes/60)

                        const minutesEnd = newEndMinutes%60
                        const hoursEnd = Math.floor(newEndMinutes/60)

                        event.start.setHours(hoursStart,minutesStart,0,0)
                        event.end.setHours(hoursEnd,minutesEnd,0,0)
                    }
                }
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
            },
            toBusinessHours(plages)
            {
                // console.log("plages : "+JSON.stringify(plages));
                const businessHours = {
                    1:this.businessDay(0,plages),
                    2:this.businessDay(1,plages),
                    3:this.businessDay(2,plages),
                    4:this.businessDay(3,plages),
                    5:this.businessDay(4,plages),
                    6:this.businessDay(5,plages),
                    7:this.businessDay(6,plages),
                }
                return businessHours
            },
            businessDay(index,plages)
            {
                // console.log(index,plages);
                
                const plagesForDay = plages.filter((x)=>{
                    return x.jour_semaine_id == index
                })
                const businessDay = []

                for (let i = 0; i < plagesForDay.length; i++) {
                    const plage = plagesForDay[i];
                    const from = toMinutes(plage.heure_debut)
                    const to = toMinutes(plage.heure_fin)
                    businessDay.push({ from: from, to: to, class: 'business-hours' })
                }

                return businessDay
                // const dayPlages = plages.
            }
        }
    }

    function toMinutes(time){
        const [hours,minutes] = time.split(':')
        return Number(hours)*60+Number(minutes)
    }
</script>