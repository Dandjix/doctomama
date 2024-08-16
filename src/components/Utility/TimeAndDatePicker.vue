<template>
    <v-row>
        <v-col cols="12" md="6">

                <v-date-picker 
                v-model="date"
                color="primary" 
                first-day-of-week="1" 
                :title="dateLabel"
                placeholder="jj/mm/aaaa"
                @update:model-value="updateDate"

                :allowed-dates="checkAllowedDates"

                :min="minDate"
                :max="maxDate"
                ></v-date-picker>

        </v-col>
        <v-col cols="12" md="6">

                <v-time-picker
                v-model="hour"
                :title="hoursLabel"
                format="24hr"
                @update:hour="updateHoursHour"
                @update:minute="updateHoursMinute"

                :min="minHour"
                :max="maxHour"

                ></v-time-picker>

        </v-col>
        <!-- <v-col>
            <h1>debug</h1>
            {{ disabledDates }}
        </v-col> -->
    </v-row>


</template>

<script>
    import { VTimePicker } from 'vuetify/labs/VTimePicker'
    export default{
        name:"TimeAndDatePicker",
        components:{
            VTimePicker
        },
        props:{
            modelValue:{
                type:Date,
                required:true
            },
            dateLabel:{
                type:String,
                default:"date label"
            },
            hoursLabel:{
                type:String,
                default:"hours label"
            },
            minHour:{
                type:String,
                default:"00:00"
            },
            maxHour:{
                type:String,
                default:"23:59"
            },
            minDate:{
                type:Date,
                default:new Date('1970-01-01')
            },
            maxDate:{
                type:Date,
                default:new Date('9999-01-01')
            },
            disabledDates:{
                type:Array,
                default:()=>[]
            }
        },
        data(){
            const date = new Date(this.modelValue)
            date.setHours(0,0,0,0)

            const hour = `${this.modelValue.getHours()}:${this.modelValue.getMinutes()}`
            return {
                date: date,
                hour:hour
            }
        },
        computed:{
            time:{
                get()
                {
                    return this.modelValue
                },
                set(value)
                {
                    // this.setTime(value)
                    this.$emit('update:modelValue',value)
                }
            },
            // min:{
            //     get()
            //     {
            //         const hours = Math.floor(this.minMinutes/60)
            //         const minutes = this.minMinutes%60
            //         return `${hours}:${minutes}`
            //     }
            // },
            // max:{
            //     get()
            //     {
            //         const hours = Math.floor(this.maxMinutes/60)
            //         const minutes = this.maxMinutes%60
            //         return `${hours}:${minutes}`
            //     }
            // }
        },
        watch:{
            maxHour()
            {
                this.checkUpperBound()
            }
        },
        async mounted()
        {
            this.checkUpperBound()
        },
        methods:{
            checkUpperBound()
            {
                const [hoursMax,minutesMax] = this.maxHour.split(':')
                const maxMinutes = Number(hoursMax)*60+Number(minutesMax)
                const currentMinutes = this.modelValue.getHours()*60+this.modelValue.getMinutes()

                if(currentMinutes>maxMinutes)
                {

                    
                    const newTime = new Date(this.time)
                    newTime.setHours(hoursMax,minutesMax)

                    // console.log("after : "+newTime);

                    this.hour = `${hoursMax}:${minutesMax}`
                    this.time = newTime
                    // this.$emit('update:modelValue',newTime)
                }
            },
            updateDate(newValue)
            {
                // console.log("upd d");
                

                const time = new Date(this.time)

                time.setFullYear(newValue.getFullYear())
                time.setMonth(newValue.getMonth())
                time.setDate(newValue.getDate())

                this.$emit('update:model-value',time)
            },
            updateHours(newValue)
            {
                // console.log("upd h : "+newValue);

                const time = new Date(this.time)

                const [hours,minutes] = newValue.split(':')
                time.setHours(hours,minutes,0,0)

                this.hour = newValue

                this.$emit('update:model-value',time)
            },
            updateHoursHour(hour)
            {
                var minutes
                const split = this.hour.split(':')
                if(split.length>=2)
                    minutes = split[1]
                else
                    minutes = '00'

                
                this.updateHours(`${hour}:${minutes}`)
            },
            updateHoursMinute(minutes)
            {
                var hour
                const split = this.hour.split(':')
                if(split.length>=2)
                    hour = split[0]
                else
                    hour = '00'

                
                this.updateHours(`${hour}:${minutes}`)
            },
            checkAllowedDates(date){ 
                // console.log("date : "+JSON.stringify(date));
                const time = date.getTime()
                // console.log("time : "+time);

                // console.log("disabled dates : "+JSON.stringify(this.disabledDates));
                
                
                const isInDisabledDates = this.disabledDates.some(
                    (x)=>{
                        // console.log("x : "+x);
                        
                        // const disabledDate = new Date(x)
                        // console.log("dd : "+disabledDate);
                        
                        // disabledDate.setHours(0,0,0,0)
                        // console.log("dd after"+disabledDate)
                        const disabledDate = stringToDate(x)
                        
                        const inDisabled = disabledDate.getTime()==time
                        return inDisabled;
                    })
                // console.log("in disabled ? "+isInDisabledDates);
                
                return !isInDisabledDates
                // return false
            }
        }
    }

    function stringToDate(dateString)
    {
        const date = new Date()
        const [year,month,day] = dateString.split("-")
        date.setFullYear(year,Number(month)-1,day)
        date.setHours(0,0,0,0)

        // console.log("date : "+date+", from : "+dateString);
        

        return date
    }
</script>