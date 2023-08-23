async function pickContacts(){
  if(!navigator.contacts || !window.ContactsManager) {
     alert("Your device does not support the Contact Picker API. Open this page on Android Chrome to give it a try!");
  }
  else {
      //first we ask the browser to tell us which properties the device supports
      //available properties include 'name', 'tel', 'email', 'address', and 'icon'
      let propertiesAvailable = await navigator.contacts.getProperties();

      //then we open the contact picker with these properties
      let contacts = await navigator.contacts.select(propertiesAvailable, {multiple: true});
      addContactsToTable(contacts)
  }
}

function addContactsToTable(contacts){
  let defaultAvatar = "https://progressier.com/assets/img/profile-picture.svg";
  let table = document.querySelector('.contacts-table');
  contacts.forEach(function(contact){
     let newRow = document.createElement('tr');
     newRow.innerHTML = `
	<td><img src="`+(contact.icon||defaultAvatar)+`"/></td>
	<td>`+(contact.name || "unknown")+`</td>
	<td>`+(contact.email || "unknown")+`</td>
	<td>`+(contact.tel || "unknown")+`</td>
	<td>`+(contact.address || "unknown")+`</td>
     `;
     table.appendChild(newRow);
  });
}
