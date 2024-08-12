<template>
    <v-autocomplete  v-model="email" color="primary" label="email" :rules="rulesEmail" :items="emails"></v-autocomplete>
</template>

<script>
    import WhitelistService from '@/services/WhitelistService';
import { mapState } from 'vuex';

    export default{
        name:"EmailSearchField",
        props:{
            modelValue:{
                type:String,
                required:true
            }
        },
        data()
        {
            return {
                emails:[],

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
            }
        },
        computed:{
            email:{
                get(){
                    return this.modelValue
                },
                set(value){
                    this.$emit('update:modelValue',value)
                }
            },
            ...mapState(['session'])
        },
        async mounted()
        {
            // console.log("session : "+this.session);
            
            this.emails = await WhitelistService.getAllItems(this.session,"")
        },
        // watch:{
        //     async email(newValue)
        //     {
        //         console.log("email changed to : "+newValue);
                
        //         this.emails = await WhitelistService.getItems(this.session,0,newValue)
        //     }
        // }
    }
</script>