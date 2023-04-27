App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: function () {
    if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.proviers.HttpProvider(
        "http://localhost:7545"
      );
    }

    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Artregistry.json", function (data) {
      var productArtifact = data;
      App.contracts.product = TruffleContract(productArtifact);
      App.contracts.product.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".btn-register", App.registerProduct);
  },

  registerProduct: function (event) {
    event.preventDefault();

    var productInstance;

    var imgHash = document.getElementById("result").textContent;
    var artistName = document.getElementById("artistName").value;
    var artName = document.getElementById("artName").value;
    var date = document.getElementById("todayDate").value;
    var artPrice = document.getElementById("arttags").value;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      console.log(account);
      console.log(imgHash.slice(0, 20));

      App.contracts.product
        .deployed()
        .then(function (instance) {
          productInstance = instance;
          return productInstance.saveArt(
            web3.fromAscii(imgHash.slice(0, 20)),
            web3.fromAscii(artistName),
            web3.fromAscii(artName),
            web3.fromAscii(date),
            web3.fromAscii(artPrice),
            { from: account }
          );
        })
        .then(function (result) {
          console.log(result);
          document.getElementById("userImage").value = "";
          document.getElementById("result").value = "";
          document.getElementById("artName").value = "";
          document.getElementById("artistName").value = "";
          document.getElementById("arttags").value = "";
        })
        .catch(function (err) {
          console.log(err);
          console.log(err.message);
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
