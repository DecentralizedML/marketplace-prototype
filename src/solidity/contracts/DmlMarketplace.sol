pragma solidity ^0.4.22;

contract DmlMarketplace {
    // Public Variables
    address public owner;
    address public token;
    
    // bountyFactory address
    DmlBountyFactory public bountyFactory;
    
    
    mapping(bytes32 => uint) public totals;
    mapping(address => mapping(bytes32 => bool)) public hasPurchased;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function isReady() view public returns (bool success) {
        if (token == address(0) || bountyFactory == address(0)) {
            return false;
        }

        return true;
    }
    
    function init (address newTokenAddress) public returns (bool success) {
        require(msg.sender == owner);
        token = newTokenAddress;
        DmlBountyFactory f = new DmlBountyFactory(owner, token);
        bountyFactory = f;
        return true;
    }
    
    function buy(bytes32 algoId, uint value) public returns (bool success) {
        address sender = msg.sender;
        
        require(!hasPurchased[msg.sender][algoId]);

        ERC20Interface c = ERC20Interface(token);
        
        require(c.transferFrom(sender, address(this), value));

        hasPurchased[sender][algoId] = true;
        
        if (totals[algoId] < 1) {
            totals[algoId] = 1;
        } else {
            totals[algoId]++;
        }
        
        return true;
    }
    
    function transferToken (address receiver, uint amount) public {
        require(msg.sender == owner);
        
        ERC20Interface c = ERC20Interface(token);
        require(c.transfer(receiver, amount));
    }
}

contract DmlBountyFactory {
    address public marketplace;
    address public owner;
    address public token;
    address[] public allBountyAddresses;
    mapping(address => address[]) public bountyAddressByCreator;
    mapping(address => address[]) public bountyAddressByParticipant;
    
    constructor(address ownerAddress, address tokenAddress) public {
        marketplace = msg.sender;
        owner = ownerAddress;
        token = tokenAddress;
    }

    function getAllBounties() view public returns (address[] bounties) {
        return allBountyAddresses;
    }

    function getBountiesByCreator(address creatorAddress) view public returns (address[] bounties) {
        return bountyAddressByCreator[creatorAddress];
    }

    function getBountiesByParticipant(address participantAddress) view public returns (address[] bounties) {
        return bountyAddressByParticipant[participantAddress];
    }
    
    function createBounty(string name, uint[] prizes) public {
        address creator = msg.sender;
        address newBounty = new Bounty(token, creator, owner, name, prizes);
        allBountyAddresses.push(newBounty);
        bountyAddressByCreator[msg.sender].push(newBounty);
    }
    
    function joinBounty(address bountyAddress) public {
        Bounty b = Bounty(bountyAddress);
        
        require(b.join(msg.sender));
        
        bountyAddressByParticipant[msg.sender].push(bountyAddress);
    }
}

contract Bounty {
    // contract addresses
    address public factory;
    
    // public constants
    address public creator;
    address public moderator;
    address public token;

    // state variables
    string public name;
    uint[] public prizes;
    address[] public winners;
    address[] public participants;
    Status public status;
    mapping(address => bool) public participantsMap;

    enum Status {
        Initialized,
        ReadyForEnrollment,
        EnrollmentStart,
        EnrollmentEnd,
        BountyStart,
        BountyEnd,
        Completed,
        Paused
    }
    
    constructor(address tokenAddress, address creatorAddress, address ownerAddress, string initName, uint[] initPrizes) public {
        factory = msg.sender;
        creator = creatorAddress;
        moderator = ownerAddress;
        token = tokenAddress;
        prizes = initPrizes;
        status = Status.Initialized;
        name = initName;
    }
    
    function isFunded() public view returns (bool success) {
        ERC20Interface c = ERC20Interface(token);
        require(getTotalPrize() <= c.balanceOf(address(this)));
        return true;
    }

    function getData() public view returns (string retName, uint[] retPrizes, address[] retWinenrs, address[] retParticipants, Status retStatus) {
        return (name, prizes, winners, participants, status);
    }
    
    function join(address participantAddress) public returns (bool success) {
        if (status != Status.EnrollmentStart) {
            return false;
        }
        
        if (participantsMap[participantAddress] == true) {
            return false;
        }
        
        participants.push(participantAddress);
        participantsMap[participantAddress] = true;
        
        return true;
    }

    function updateBounty(string newName, uint[] newPrizes) public {
        require(updateName(newName));
        require(updatePrizes(newPrizes));
    }

    function updateName(string newName) public returns (bool success) {
        require(msg.sender == moderator || msg.sender == creator);
        name = newName;
        return true;
    }
    
    function updatePrizes(uint[] newPrizes) public returns (bool success) {
        require(msg.sender == moderator || msg.sender == creator);
        prizes = newPrizes;
        return true;
    }

    function setStatus(Status newStatus) private returns (bool success) {
        require(msg.sender == moderator || msg.sender == creator);
        status = newStatus;
        return true;
    }
    
    function startEnrollment() public {
        require(prizes.length > 0);
        require(isFunded());
        setStatus(Status.EnrollmentStart);
    }
    
    function stopEnrollment() public {
        require(status == Status.EnrollmentStart);
        setStatus(Status.EnrollmentEnd);
    }
    
    function startBounty() public {
        require(status == Status.EnrollmentStart);
        setStatus(Status.BountyStart);
    }
    
    function stopBounty() public {
        require(status == Status.BountyStart);
        setStatus(Status.BountyEnd);
    }

    function updateWinners(address[] newWinners) public {
        require(msg.sender == moderator || msg.sender == creator);
        require(status == Status.BountyEnd);
        require(newWinners.length == prizes.length);
        winners = newWinners;
    }

    function payoutWinners() public {
        require(msg.sender == moderator || msg.sender == creator);
        ERC20Interface c = ERC20Interface(token);
        require(isFunded());
        require(winners.length == prizes.length);
        require(status == Status.BountyEnd);

        for (uint i = 0; i < prizes.length; i++) {
            require(c.transfer(winners[i], prizes[i]));
        }
        
        setStatus(Status.Completed);
    }
    
    function getTotalPrize() public constant returns (uint total) {
        uint t = 0;
        for (uint i = 0; i < prizes.length; i++) {
            t = t + prizes[i];
        }
        return t;
    }

    function transferToken (address receiver, uint amount) public {
        require(msg.sender == moderator);
        ERC20Interface c = ERC20Interface(token);
        require(c.transfer(receiver, amount));
    }
    
}

contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
}