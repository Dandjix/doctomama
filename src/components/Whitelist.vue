<template>
    <WhitelistItem v-for="email in emails" :email="email" :key="email" @delete="deleteItem"></WhitelistItem>
</template>

<script>
    import WhitelistItem from './WhitelistItem'



    export default{
        name:'Whitelist-component',
        components:{WhitelistItem},
        methods:
        {
            deleteItem(email){
                // console.log("deleting email : "+email);
                this.$emit('deleteItem',email)
            }
        },
        props:
        {
            emails:{
                type:[String],
                required:true
            }
        }
    }


</script>