<template>
    <div class="w3-content-midx">
      <InnerNavbar/>
          <Loader v-if="isLoading" />
          <div class="w3-content w3-padding" v-else>

            <div class="w3-xlarge w3-border-left w3-padding">
                Last 10 transactions
            </div>

            <div class="w3-black w3-round w3-margin-top w3-border w3-card w3-padding" v-for="(trx) in data" :key="trx._id">
                <div class="w3-row w3-xlarge">
                    <p class="w3-half">
                    <b>Amount</b> <br/>
                        NGN {{trx.amount/100}}
                    </p>
                   
                    <p class="w3-half">
                        <b>Date:</b> <br/>
                        {{trx.date}}
                    </p>
                </div>
                <p class="truncate">
                    <b>Narration:</b> <br/>
                    {{trx.narration}}
                </p>
                <div class="w3-row w3-xlarge">
                    <p class="w3-half">
                        <b>Balance:</b> <br/>
                        NGN{{trx.balance/100}}
                    </p>
                    <p class="w3-half">
                        <b>Type</b> <br/>
                        {{trx.type}}
                    </p>
                </div>
            </div>

          </div>

    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import InnerNavbar from '../components/InnerNavbar.vue'
  import Loader from '../components/Loader.vue'
  import LoaderMin from '../components/LoaderMin.vue'
  
  export default {
      name: 'Transactions',
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
          ...mapActions('services', ['getAccounts','fetchAccountId', 'getTransactions']),
      },
      created: function () {
        //   this.getAccounts()
        //       .then(res => { this.isLoading = false })
        //       .catch((err) => { this.isLoading = false })
        //   console.log(this.accounts);

        console.log("in trx!")

          this.getTransactions(this.$route.params.id)
            .then(res => { 
                this.isLoading = false
                this.data = res.data.data.slice(0, 10);
                // console.log(res.data);
            })
              .catch((err) => { 
                this.isLoading = false 
            })
    },
    computed: {
      ...mapState('services', ['accounts']),
      ...mapGetters('auth', ['user', ]),
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
    width: 800px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>