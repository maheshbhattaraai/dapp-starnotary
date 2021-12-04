import Web3 from "web3";
import starNotary from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const {web3} = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = starNotary.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotary.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];


    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  createStar: async function () {
    const {createStar} = this.meta.methods;
    let starName = document.getElementById('starName').value;
    let tokenId = document.getElementById('starId').value;
    if (starName && tokenId) {
      await createStar(starName, tokenId).send({from: this.account});
      App.setStatus("New star Owner is " + this.account);
    }

  },
  tokenIdToStarInfo: async function () {
    const {lookUptokenIdToStarInfo} = this.meta.methods;
    let tokenId = document.getElementById('lookUpStarInfo').value;
    if (tokenId) {
      let starName = await lookUptokenIdToStarInfo(tokenId).call().then((name) => {
        App.setStatus('Star Name is' + name);
      });

    }
  },
  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
