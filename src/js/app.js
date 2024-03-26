App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    admins:['0x4c294e416FCA90Af48CfA8e96cC760652132B201', '0x3F9054A6397eF2e83391207F71E5291115c16793'],




    init: function() {
      return App.initWeb();
    },
   
   
    initWeb:function() {
      // if an ethereum provider instance is already provided by metamask
      const provider = window.ethereum
      if( provider ){
        // currently window.web3.currentProvider is deprecated for known security issues.
        // Therefore it is recommended to use window.ethereum instance instead
        App.webProvider = provider;
      }
      else{
        $("#loader-msg").html('No metamask ethereum provider found')
        console.log('No Ethereum provider')
        // specify default instance if no web3 instance provided
        App.webProvider = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      }
   
   
      return App.initContract();
    },
   
   
   initContract: function() {
   
   
      $.getJSON("MissingDiaries.json", function( data ){
        // instantiate a new truffle contract from the artifict
        App.contracts.MissingDiaries= TruffleContract( data );
   
   
        // connect provider to interact with contract
        App.contracts.MissingDiaries.setProvider( App.webProvider );
   
   
        //App.listenForEvents();
   
   
        return App.render();
      })
   
   
    },
   
   
    render: async function(){
      let electionInstance;
      // const loader = $("#loader");
      const content = $("#content");
   
   
      // loader.show();
      content.show();
     
      // load account data
      if (window.ethereum) {
        try {
          // recommended approach to requesting user to connect mmetamask instead of directly getting the accounts
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          App.account = accounts;
          $("#accountAddress").html("Your Account: " + App.account);
        } catch (error) {
          if (error.code === 4001) {
            // User rejected request
            console.warn('user rejected')
          }
          $("#accountAddress").html("Your Account: Not Connected");
          console.error(error);
        }
      }

 
  
    },
 
    loadMissingPersons: function() {
      var missingInstance;
 
      App.contracts.MissingDiaries.deployed().then(function(instance) {
        missingInstance = instance;
 
      
        return missingInstance.getMissingPersons.call();
      }).then(function(missingPersons) {
        
      }).catch(function(err) {
        console.log(err.message);
      });
    },
 
    handleAddPerson: function(event) {
      event.preventDefault();
 
      
 
      var name = $('#name').val();
      var age = parseInt($('#age').val());
      var height = parseInt($('#height').val());
      var description = $('#description').val();
      var division = $('#division').val();
      var contactNumber = $('#contactNumber').val();
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts) {
            App.account = accounts[0];
            $("#accountAddress").html("Your Account: " + App.account);
            App.addMissingPerson(name, age, height, description, division, contactNumber);
        }).catch(function(error) {
            console.error("Error: ", error);
        });
    } else {
        console.error("MetaMask is not installed!");
    }

    

 
      //App.addMissingPerson(name, age, height, description, division, contactNumber);
    },


    searchByName: function() {
      var nameToSearch = $('#searchName').val();
      var missingDiariesInstance;
      App.contracts.MissingDiaries.deployed().then(function(instance) {
          missingDiariesInstance = instance;
          return missingDiariesInstance.searchByName.call(nameToSearch);
      }).then(function(searchResults) {
          var searchResultsElement = $('#searchResults');
          searchResultsElement.empty();

          if (searchResults.length === 0) {
              searchResultsElement.append('<p>No results found for "' + nameToSearch + '".</p>');
              return;
          }

          searchResults.forEach(function(person) {
              var personDetails = '<div><strong>ID:</strong> ' + person[0] + '<br><strong>Name:</strong> ' + person[1] + '<br><strong>Age:</strong> ' + person[2] + '<br><strong>Height:</strong> ' + person[3] + '<br><strong>Status:</strong> ' + person[4] + '<br><strong>Description:</strong> ' + person[5] + '<br><strong>Division:</strong> ' + person[6] + '<br><strong>Contact Number:</strong> ' + person[7] + '</div><hr>';
              searchResultsElement.append(personDetails);
          });
      }).catch(function(err) {
          console.error("Error while searching:", err);
      });
  },
 
    addMissingPerson: function(name, age, height, description, division, contactNumber) {
      var missingInstance;
 
      App.contracts.MissingDiaries.deployed().then(function(instance) {
        missingInstance = instance;
        return missingInstance.addPerson(name, age, height, description, division, contactNumber, { from: App.account });
      }).then(function(result) {
        App.updateMissingpersonList()
        
      }).catch(function(err) {
        console.error(err);
      });
    },
 
//     updateMissingPersonsList: function() {
//       var missingDiariesInstance;
//       App.contracts.MissingDiaries.deployed().then(function(instance) {
//           missingDiariesInstance = instance;
//           return missingDiariesInstance.getMissingPersons.call();
//       }).then(function(missingPersons) {
//           var missingPersonsList = $('#missingPersonsList');
//           missingPersonsList.empty();

//           for (var i = 0; i < missingPersons.length; i++) {
//               var id = missingPersons[i][0];
//               var name = missingPersons[i][1];
//               var age = missingPersons[i][2];
//               var height = missingPersons[i][3];
//               var description = missingPersons[i][4];
//               var division = missingPersons[i][5];
//               var contactNumber = missingPersons[i][6];
//               var status = missingPersons[i][7];

//               var missingPersonRow = '<tr><td>' + id + '</td><td>' + name + '</td><td>' + age + '</td><td>' + height + '</td><td>' + description + '</td><td>' + division + '</td><td>' + contactNumber + '</td><td>' + status + '</td></tr>';
//               missingPersonsList.append(missingPersonRow);
//           }
//       }).catch(function(err) {
//           console.log(err.message);
//       });
//     },
    updateMissingPersonsList: function() {
      // Assuming your smart contract has a function to fetch all missing persons
      App.contracts.YourContractName.deployed().then(function(instance) {
          return instance.getAllMissingPersons.call(); // Replace with your actual function
      }).then(function(missingPersons) {
          var missingPersonsList = $('#missingPersonsList'); // Ensure this ID matches your HTML
          missingPersonsList.empty();
  
          for (var i = 0; i < missingPersons.length; i++) {
              var person = missingPersons[i];
              var personRow = '<tr><td>' + person.id + '</td><td>' + person.name + '</td><td>' + person.age + '</td><td>' + person.description + '</td><td>' + person.division + '</td><td>' + person.contactNumber + '</td><td>' + (person.found ? 'Found' : 'Missing') + '</td></tr>';
              missingPersonsList.append(personRow);
          }
      }).catch(function(err) {
          console.error(err);
      });
  },
  

    handleUpdateStatus: function(event) {
      event.preventDefault();
 
      var personId = parseInt($(event.target).data('id'));
 
      App.updateStatus(personId, 'found');
    },


    isAdmin: function() {
        return App.admins.includes(App.account.toLowerCase());
      },
 
    updateStatus: function(personId, newStatus) {
      if (!App.isAdmin()) {
        alert("Only admins can update the status.");
        return;
        }  
      var missingInstance;
 
      App.contracts.MissingDiaries.deployed().then(function(instance) {
        missingInstance = instance;
        return missingInstance.updateStatus(personId, newStatus, { from: App.account });
      }).then(function(result) {
        
      }).catch(function(err) {
        console.error(err);
      });
    },
 
    
  };
 
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });

