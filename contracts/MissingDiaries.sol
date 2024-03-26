// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract MissingDiaries {
    struct MissingPerson {
        uint id;
        string name;
        uint age;
        uint height;
        string status; // "missing" or "found"
        string description;
        string division;
        string contactNumber;
    }

    address public admin;
    mapping(uint => MissingPerson) public missingPersons;
    uint public missingCount;

    
    mapping(string => uint) public missingCountByDivision;

    event PersonAdded(uint id, string name, string division);
    event StatusUpdated(uint id, string newStatus);

    constructor() {
        admin = msg.sender;
    }

    function addPerson(string memory _name, uint _age, uint _height, string memory _description, string memory _division, string memory _contactNumber) public {
        missingCount ++;
        missingPersons[missingCount] = MissingPerson(missingCount, _name, _age, _height, "missing", _description, _division, _contactNumber);
        missingCountByDivision[_division]++;
        emit PersonAdded(missingCount, _name, _division);
    }

    function updateStatus(uint _personId, string memory _newStatus) public {
        require(msg.sender == admin, "Only admin can update status");
        require(keccak256(bytes(missingPersons[_personId].status)) != keccak256(bytes(_newStatus)), "Status is already updated");
        missingPersons[_personId].status = _newStatus;
        emit StatusUpdated(_personId, _newStatus);
    }

    
    function getMissingCountByDivision(string memory _division) public view returns (uint) {
        return missingCountByDivision[_division];
    }

    
    
    function searchByName(string memory _name) public view returns (MissingPerson[] memory) {
        MissingPerson[] memory results = new MissingPerson[](missingCount);
        uint counter = 0;
        for (uint i = 1; i <= missingCount; i++) {
            if (keccak256(bytes(missingPersons[i].name)) == keccak256(bytes(_name))) {
                results[counter] = missingPersons[i];
                counter++;
            }
        }
        return results;
    }

}