// Connect to the Ethereum network and the contract using Web3.js

window.addEventListener('load', async () => {
    // Check if Web3 has been injected by the browser (e.g., MetaMask)
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.enable();
            loadBlockchainData();
        } catch (error) {
            console.error("User denied account access...");
        }
    } else {
        alert("Please install MetaMask!");
    }
});

const loadBlockchainData = async () => {
    const web3 = window.web3;

    // Get the connected account
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    document.getElementById('account').innerText = account;

    // Get the contract instance (Replace with your contract ABI and address)
    const networkId = await web3.eth.net.getId();
    const contractABI = /* Your contract ABI */;
    const contractAddress = /* Your contract address */;
    
    const votingContract = new web3.eth.Contract(contractABI, contractAddress);

    // Fetch candidates from the smart contract
    const candidates = await votingContract.methods.getCandidates().call();
    displayCandidates(candidates);

    // Voting function
    document.getElementById('vote-btn').addEventListener('click', async () => {
        const selectedCandidate = document.querySelector('li.selected');
        if (selectedCandidate) {
            const candidateIndex = selectedCandidate.getAttribute('data-index');
            try {
                await votingContract.methods.vote(candidateIndex).send({ from: account });
                document.getElementById('voting-status').innerText = "Vote cast successfully!";
            } catch (error) {
                document.getElementById('voting-status').innerText = "Error casting vote!";
            }
        } else {
            alert("Please select a candidate.");
        }
    });
};

const displayCandidates = (candidates) => {
    const candidatesList = document.getElementById('candidates-list');
    candidatesList.innerHTML = '';
    candidates.forEach((candidate, index) => {
        const li = document.createElement('li');
        li.innerText = `${candidate.name} (${candidate.voteCount} votes)`;
        li.setAttribute('data-index', index);
        li.addEventListener('click', () => {
            // Highlight selected candidate
            document.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            li.classList.add('selected');
            document.getElementById('vote-btn').disabled = false;
        });
        candidatesList.appendChild(li);
    });
};
