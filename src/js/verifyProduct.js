let obj;
let county = 0;
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
    $.getJSON("product.json", function (data) {
      var productArtifact = data;
      App.contracts.product = TruffleContract(productArtifact);
      App.contracts.product.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".btn-register", App.getData);
  },

  geData: function (event) {
    event.preventDefault();

    var productInstance;

    var productSN = document.getElementById("productSN").value;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      // document.getElementById("add").innerHTML = account;
      App.contracts.product
        .deployed()
        .then(async function (instance) {
          productInstance = instance;
          document.getElementById("res").innerHTML = "";
          return await productInstance.getArt({ from: account });
        })
        .then(function (result) {
          if (county === 5) {
            document.getElementById("res").innerHTML = "Fake Art";
          } else {
            document.getElementById("res").innerHTML = "Original Art";
          }
          // document.getElementById("logdata").innerHTML = t;
          document.getElementById("add").innerHTML = account;
        })
        .catch(function (err) {
          console.log(err);
          document.getElementById("res").innerHTML = "Fake Art";
        });
    });
  },
  getData: function (event) {
    document.getElementById("bing_chillin").style.display = "none";
    event.preventDefault();
    var productInstance;
    var productSN = document.getElementById("productSN").value;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      // document.getElementById("add").innerHTML = account;
      App.contracts.product
        .deployed()
        .then(async function (instance) {
          productInstance = instance;
          document.getElementById("res").innerHTML = "";
          return await productInstance.saveArt(
            web3.fromAscii(productSN.slice(0, 20)),
            web3.fromAscii("jndshf"),
            web3.fromAscii("jndshf"),
            web3.fromAscii("jnd7shf"),
            web3.fromAscii("76"),
            { from: account }
          );
        })
        .then(function (result) {
          if (county === 5) {
            document.getElementById("Art_name").value = "";
            document.getElementById("Artist_name").value = "";
            document.getElementById("date_name").value = "";
            document.getElementById("Art_Price").value = "";
            document.getElementById("bing_chillin").style.display = "block";
            document.getElementById("res").innerHTML = "Original Art";
            document.getElementById("Art_name").value = obj.art_name;
            document.getElementById("Artist_name").value = obj.artist_name;
            document.getElementById("date_name").value = obj.date_added;
            document.getElementById("Art_Price").value = obj.Art_Tags;
            county = 0;
          } else {
            document.getElementById("res").innerHTML = "Fake Art";
            document.getElementById("bing_chillin").style.display = "none";
          }
          // document.getElementById("logdata").innerHTML = t;
          document.getElementById("add").innerHTML = account;
        })
        .catch(function (err) {
          console.log(err);
          document.getElementById("bing_chillin").style.display = "none";
          document.getElementById("res").innerHTML = "Fake Art";
        });
    });
  },
};
var decodedText = "Enter Product SN";
function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
docReady(function () {
  document.getElementById("bing_chillin").style.display = "none";
  // hide(document.getElementById("bing_chillin"));
  var resultContainer = document.getElementById("qr-reader-results");
  var lastResult,
    countResults = 0;
  function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
      ++countResults;
      lastResult = decodedText;
      var audio = new Audio("beep.wav");
      audio.play();
      // document.getElementById("qr-reader-results").innerHTML = decodedText;
      obj = JSON.parse(decodedText);
      county = Object.keys(obj).length;
      if (county != 5) {
        document.getElementById("productSN").value = decodedText;
      } else {
        document.getElementById("productSN").value = obj.hash_value;
      }
    }
  }

  var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
    fps: 10,
    qrbox: 250,
  });
  html5QrcodeScanner.render(onScanSuccess);
});

$(function () {
  $(window).load(function () {
    App.init();
  });
});
