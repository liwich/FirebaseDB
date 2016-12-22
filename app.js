
const config = {
  apiKey: "AIzaSyCe8_z5uwUwhznzIEnkt1rsZw5_cbKcTGw",
  authDomain: "fir-db-602d0.firebaseapp.com",
  databaseURL: "https://fir-db-602d0.firebaseio.com",
  storageBucket: "fir-db-602d0.appspot.com",
  messagingSenderId: "50361932512"
};

firebase.initializeApp(config);

const dbRef = firebase.database().ref();
const users = dbRef.child('users');

/// controller
const userApp = {
  init:function(){
    this.selectedUserName =null;
    userListView.init();
    userDetailView.init();
  },

  setuserName: function(name){
    this.selectedUserName = name;
  },

  getUserName: function(){
    return this.selectedUserName;
  },

  getUserInfoDBRef: function(){
    return dbRef.child('users/' + this.getUserName());
  }

}


///view

let userListView = {
  init: function(){
    this.cacheDom();
    this.render();
  },
  cacheDom: function(){
    this.$userList = document.querySelector('.userList');
  },
  clickListItem:function(name){
    return function(){
      userApp.setuserName(name);
      userDetailView.render();
    }
  },

  render:function(){
    this.$userList.innerHTML = '<h2>User List</h2>';

    users.on('child_added', snap => {
      let liElement = document.createElement('li');
      liElement.innerHTML = snap.key

      liElement.addEventListener('click', this.clickListItem(snap.key));
      liElement.id= snap.key;
      this.$userList.append(liElement)
    }).bind(this);

    users.on('child_changed', snap =>{
      const liChanged = document.getElementById(snap.key)
      liChanged.innerText = snap.val()
    });

    users.on('child_removed', snap=> {
      const liRemove = document.getElementById(snap.key)
      liRemove.remove()
    })
  }
}

let userDetailView = {
  init:function(){
    this.cacheDom();
    this.render();
  },

  cacheDom:function(){
    this.$detailName = document.querySelector('.detailName');
    this.$detailAge= document.querySelector('.detailAge');
    this.$detailEmail = document.querySelector('.detailEmail');
  },

  render:function(){
    let getUserName = userApp.getUserName();
    this.$detailName.innerText= getUserName;

    let userDetailRef = userApp.getUserInfoDBRef();

    userDetailRef.on('child_added', snap=>{
      if(snap.key=='age'){
        this.$detailAge.innerText = snap.val();
      }else{
        this.$detailEmail.innerText= snap.val();
      }
    }).bind(this);
  }

}

userApp.init();
