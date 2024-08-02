<template>
    <v-combobox 
        :items="items"
        label="Type de consultation"

        v-model="selected"

    ></v-combobox>
    <!-- <h1>
        valeurs : 
    </h1>
    <p>
        {{ selected }}
    </p>
    <p>
        {{ selectedValue }}
    </p>
    <p>
        {{ modelValue }}
    </p> -->
</template>

<script>
    // import { mapState } from 'vuex';
    import consultationTypesService from '@/services/ConsultationTypesService';

    export default {
        name:"ConsultationsTypeSelector",
        data(){
            return {
                items:[],
                selected: null
            }
        },
        watch:{
            selected(newValue) {
                // console.log("changed selected to : "+JSON.stringify(newValue));
                this.$emit('update:modelValue', newValue);
            }
        },
        props:{
            modelValue:{
                type:String,
                required:true
            }
        },
        computed:{
            selectedValue:{
                get(){
                    return this.selected;
                },
                set(val){
                    this.selected = val;
                    this.$emit('update:modelValue', val);
                }
            }
            // ...mapState(['session'])
        },
        async mounted()
        {
            const consultationTypes = await consultationTypesService.getConsultationTypes();

            // console.log(JSON.stringify(consultationTypes));

            const items = consultationTypes.map((x)=>{
                return {
                    title:`${x.nom} (${x.duree_minutes} min)`,
                    value:x.id,
                    duration:x.duree_minutes
                }
            });

            this.items = items;

            if(this.modelValue) {
                // console.log("modelValue truthy : "+this.modelValue);
                // const selectedValue = items.find((x)=>{x.id==this.modelValue})
                this.selected =  this.modelValue;   

            } else if(items.length>0) {
                // console.log("setting selected : "+JSON.stringify(items[0]));
                this.selected = items[0];
                // this.$emit('update:modelValue', items[0].value);
            }
        }
    }
</script>
