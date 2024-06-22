
<template>
    <div id="app">
      <h1>Connexion</h1>
      <p>Page pour changer le mot de passe</p>
      <form action="api/login" method="post">
        <label for="currentPassword"> mot de passe actuel : </label>
        <input type="password" name="currentPassword" id="currentPassword">
        <br>
        <br>
        <label for="newPassword"> nouveau mot de passe : </label>
        <input type="password" name="newPassword" id="newPassword">
        <br>
        <label for="confirmationPassword"> confirmez le mot de passe : </label>
        <input type="password" name="confirmationPassword" id="confirmationPassword">
        <input type="submit">
      </form>

    </div>
  </template>
  
  <script>
  export default {
    name: 'App'
  };
  </script>