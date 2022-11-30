<template>
  <div class="w3-content-midx">
    <InnerNavbar/>
        <Loader v-if="isLoading" />
        <div v-else>

            <div class="w3-content w3-padding">
                <!-- <h4>Overview</h4> -->

                <div class="w3-row">
                    <div class="w3-black w3-padding w3-margin inline">
                        <div class="w3-small">
                        ACCOUNTS CONNECTED
                        </div>
                        <div class="w3-large">
                        {{ accounts.length }}
                        </div>
                    </div>

                    <div class="w3-black w3-padding" style="display: inline-block">
                        <div class="w3-small">
                        TOTAL BANK BALANCE ACROSS ALL ACCOUNTS
                        </div>
                        <div class="w3-large">
                        NGN {{ (Number(totalBankBalance)/100).toLocaleString() }}
                        </div>
                    </div>
                    </div>
                </div>

                
            </div>

            <div class="w3-center" style="margin-top: 50px" v-if="!Array.isArray(accounts) || !accounts.length">
                No account linked yet.
                <hr class="hr">
                <div @click="launchMono({reauthorise: false, reauthToken:''})"  class="w3-black w3-round w3-padding w3-marginx w3-margin-leftx inline" style="margin-left: 30px">
                    <img class="mono-button" src="@/assets/mono-favicon-lg-1.png" alt="">
                    Link account with Mono
                </div>
                <LoaderMin v-if="mainLoader" />
            </div>

            <div class="w3-content" v-else>
                <div @click="launchMono({reauthorise: false, reauthToken:''})"  class="w3-black w3-round w3-padding w3-marginx w3-margin-leftx inline" style="margin-left: 30px">
                    <img class="mono-button" src="@/assets/mono-favicon-lg-1.png" alt="">
                    Link account with Mono
                </div>
                <LoaderMin v-if="mainLoader" />

                <div class="w3-margin w3-round w3-padding" v-if="reauthCount">
                    <span class="w3-red w3-badge">{{reauthCount}}</span> accounts needs to be re-authorised.
                </div>
                
                <div class="home-second w3-margin-top w3-margin-left">
                    <div class="w3-blackx w3-border w3-card w3-padding" v-for="(account) in accounts" :key="account._id">
                        <p class="w3-large truncate">
                            {{ account.accountName }}
                        </p>
                        <p class="w3-black w3-padding-small w3-round inline w3-large" style="margin-top: -20px; margin-bottom: -45px">
                            {{ account.currency }} {{ (Number(account.balance)/100).toLocaleString() }}
                        </p>
                        <p class="">
                            <b>{{ account.accountNumber }}</b>
                        </p>
                        <p>
                            {{ account.bank }}
                        </p>
                        <p class="w3-small">
                            <span class="w3-red w3-padding-small w3-round" v-if="account.reauthRequired" @click="reauthorise(account.accountId)">Status: Reauthorise</span>
                            <span class="w3-green w3-padding-small w3-round" v-else>Status: OK</span> &nbsp;
                            <span class="w3-black w3-padding-small w3-round" @click="triggerSync(account.accountId)">Refresh</span>
                        </p>
                        <p >
                        <router-link :to="{ name: 'Transactions' , params: {id: account.accountId} }" class="w3-bar-item">
                            View Transactions ->
                        </router-link>
                        </p>
                    </div>
                </div>
                    
                <LoaderMin v-if="mainLoader" />
                
            </div>
            
        </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import InnerNavbar from '../components/InnerNavbar.vue'
import Loader from '../components/Loader.vue'
import LoaderMin from '../components/LoaderMin.vue'
import Connect from '@mono.co/connect.js'

export default {
    name: 'Accounts',
    data() {
        return{
            data: null,
            // reauthCount: 0,
            orders: "",
            isLoading: true,
            mainLoader: false,
            notificationSystem: {
                options: {
                    error: {
                        position: "bottomRight"
                    },
                }
            },
        }
    },
    components: {
        InnerNavbar,
        Loader,
        LoaderMin
    },
    methods: {
        ...mapActions('services', ['addAccount', 'getAccounts','fetchAccountId', 'initiateDataSync', 'initiateReauthorisation']),
        ...mapMutations('services', ['update_account_reauth_status']),
        launchMono({reauthorise, reauthToken}) {
            // this.mainLoader = true;

            self = this;
            const connect = new Connect({
                key: process.env.VUE_APP_ENV_MONO_PUBLIC_KEY,
                onSuccess: ({code}) => {
                    self.mainLoader = true;
                    // Fetch account id and information with token on account endpoint
                    self.fetchAccountId(code)
                        .then(response => {

                            // Ensure unique accounts
                            // let accountFound = self.accounts.find(o => o.accountNumber === response.data.account.accountNumber);

                            // if (accountFound){
                            //     this.$toast.error(`${response.data.account.institution.name} Account already connected.`, 'Message:', this.notificationSystem.options.error)

                            // }else{
                                // Add account to DB
                                console.log("Add account to DB");
                                console.log(response.data);
                                self.addAccount({
                                    userId: self.user.id,
                                    accountId: response.data.account._id,
                                    accountName: response.data.account.name || "n/a",
                                    accountNumber: response.data.account.accountNumber || "n/a",
                                    balance: `${response.data.account.balance}` || "n/a",
                                    currency: response.data.account.currency || "n/a",
                                    bank: response.data.account.institution.name || "n/a",
                                    type: response.data.account.type || "n/a",
                                    bvn: response.data.account.bvn || "n/a",
                                    // bvn: response.data.account.bvn == null ? "n/a" : response.data.account.bvn,
                                })
                            // }

                            self.mainLoader = false;

                        })
                },
                onLoad: () => console.log("widget loaded successfully"),
                onClose: () => {
                    // this.mainLoader = false;
                    console.log("widget has been closed");
                },
                onEvent: (eventName, data) => {
                    console.log(eventName);
                    console.log(data);
                },
                reference: "random_ref_string"
            });

            if (reauthorise) {
                connect.reauthorise(reauthToken);
            }else{
                // const config = {
                //     selectedInstitution: {
                //     id: "5f2d08bf60b92e2888287704",
                //     auth_method: "internet_banking"
                //     }
                // }
                // connect.setup(config);
                connect.setup();
            }

            connect.open();
            // return connect;
        },

        triggerSync(accountId){
            this.mainLoader = true;

            this.initiateDataSync(accountId)
                .then(res => { 
                    this.mainLoader = false;
                    console.log('Inside initiateDataSync handler>>>>>');
                    console.log(res.data);
                    if (res.data.message == "SYNC_SUCCESSFUL") {
                        this.$toast.success('Account synced successfully.', 'Message:', this.notificationSystem.options.success)
                        this.reloadPage();
                    }else if(res.data.message == "REAUTHORISATION_REQUIRED"){
                        // Update account state of reauth to True
                        this.update_account_reauth_status(accountId)

                        this.$toast.error(res.data.message2 || `Account not synced. Re-authorisation required!`, 'Message:', this.notificationSystem.options.error)
                    }else{
                        this.$toast.error(res.data.message2 || 'Sync Error. Please try again later.', 'Message:', this.notificationSystem.options.error)
                    }


                })
                .catch((err) => {  })
        },

        reauthorise(accountId){

            this.mainLoader = true;

            this.initiateReauthorisation(accountId)
                .then(res => {
                    console.log(res.data.message);
                    this.mainLoader = false 
                    this.launchMono({reauthorise:true, reauthToken: res.data.message})
                })
                .catch((err) => {
                    console.log('Error>>> '+err.response.data.message);
                    this.$toast.error(err.response.data.message, 'Message:', this.notificationSystem.options.error)
                    this.mainLoader = false
                })

            console.log(111);
        },

        reloadPage(){
            this.$router.go(0);
        }

    },
    created: function () {
        // this.$toast.error("Hi", 'Error:', this.notificationSystem.options.success)
        // this.$toast.success(`"${this.formData.title}" added to issues.`, 'Issue Created', this.notificationSystem.options.success)
    
        this.getAccounts()
            .then(res => { this.isLoading = false })
            .catch((err) => { this.isLoading = false })
    
        console.log(this.accounts);

        // this.reauthCount = this.accounts.filter(item => item.reauthRequired === true).length;




  },
  computed: {
    ...mapState('services', ['accounts']),
    ...mapGetters('auth', ['user', ]),
    statusStat: function(){
        return ["STANDING", "CANCELLED", "PAYMENT_MADE", "DELIVERED"]
    },
    reauthCount: function () {
      // `this` points to the vm instance
      return this.accounts.filter(item => item.reauthRequired === true).length;
    },
    totalBankBalance: function(){
      return this.accounts
        .map(account => Number(account.balance))
        .reduce((prev,curr) => prev + curr, 0)
    },
  },
}
</script>

<style>
.hr{
    border: none;
}

button{
    border: none;
}
.mono-button{
    width: 20px;
}
.underline{
    text-decoration: underline;
}

.home-second {
  display: grid;
  margin: 0 auto;
  padding: 8px;
  max-width: 1000px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 9px;
}

.inline{
    display: inline-block
}

.truncate {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>