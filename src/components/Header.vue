<template>
  <header>
    <div class="back" v-if="isStudio()" @click="this.goBack"><img src="../assets/img/icons/ic_back.svg" /><span>Back</span></div>
    <div v-if="!(isStudio())" class="name">
      <router-link to="/"><img src="../assets/img/ic_logo.svg" class="logo" alt="Feeder" /></router-link>
    </div>
    <!--<div class="profile" v-if="isLoggedIn">
      <img src="../assets/img/logo_eformel.png" class="avatar" />
      <ul class="dropdown">
        <li class="logout"><a @click="logout">Logout</a></li>
      </ul>
    </div>-->
  </header>
</template>

<script>
  export default {
    name: 'Header',
    methods: {
      isStudio() {
        return this.$route.path.includes('studio')
      },
      goBack() {
        if (window.history.length > 1) this.$router.go(-1)
        else this.$router.push('/')
      }
    }
  }
</script>

<style scoped>
  header {
    width: 100%;
    max-width: 100vw;
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
    background: var(--white);
    position: fixed;
    top: 0;
    left: 0;
    height: 4rem;
    z-index: 9999;
    padding: 0 2rem 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    box-sizing: border-box;
  }
  .name {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .name .logo {
    margin-right: 1rem;
  }
  .name p {
    font-weight: 700;
  }
  .back {
    text-align: left;
    display: flex;
    align-items: center;
    opacity: 0.64;
    margin-right: auto;
  }
  .back:hover {
    opacity: 1;
    cursor: pointer;
  }
  .back img {
    margin-right: 1rem;
  }
  .logo {
    text-align: center;
    margin-left: .5rem;
  }
  .avatar {
    text-align: right;
    width: 2rem;
    height: 2rem;
  }
  .profile {
    display: flex;
    flex-direction: column;
    margin-left: auto;
  }
  .profile img {
    display: block;
  }
  .profile:hover .dropdown,
  .dropdown:hover {
    display: block;
    visibility: visible;
    opacity: 1;
  }
  .dropdown {
    display: none;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: -1rem;
    right: 2rem;
    background: var(--white);
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
    padding: 1rem;
    list-style-type: none;
    margin-top: 4rem;
  }
  /*.dropdown .logout {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;
    outline: none;
    font-size: 1rem;
    font-family: inherit;
  }*/
  .logout {
    text-decoration: none;
    color: var(--red);
    font-weight: 700;
    cursor: pointer;
    flex: 0;
    text-align: right;
  }
</style>
