// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract product {
    struct Art {
        bytes32 hashValue;
        string artName;
        string artistName;
        bytes32 date;
        uint256 artPrice;
    }

    mapping(bytes32 => Art) arts;

    function saveArt(
        bytes32 _hashValue,
        string memory _artName,
        string memory _artistName,
        bytes32 _date,
        uint256 _artPrice
    ) public {
        arts[_hashValue] = Art(
            _hashValue,
            _artName,
            _artistName,
            _date,
            _artPrice
        );
    }

    //Verify

    function getArt(
        bytes32 _hashValue
    )
        public
        view
        returns (bytes32, string memory, string memory, bytes32, uint256)
    {
        Art storage art = arts[_hashValue];
        if (art.hashValue == _hashValue) {
            return (
                art.hashValue,
                art.artName,
                art.artistName,
                art.date,
                art.artPrice
            );
        }
        return ("", "", "", "", 0);
    }
}
