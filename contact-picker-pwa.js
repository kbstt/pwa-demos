async function pickContacts(){
  if(!navigator.contacts || !window.ContactsManager) {
    alert("Your device does not support the Contact Picker API. Open this page on Android Chrome to give it a try!");
  }
  else {
      //first we ask the browser to tell us which properties the device support
      //available properties include 'name', 'tel', 'email', 'address' and 'icon'
      let propertiesAvailable = await navigator.contacts.getProperties();

      //then we open the contact picker with these properties
      let contacts = await navigator.contacts.select(propertiesAvailable, {multiple: true});
      console.log(contacts);
  }
}
