module.exports = {
    number: 1,
    end: new Date(2019, 03, 9),
    canClaim: function(collectedTags, tag){
        return collectedTags.length < 2;
    }
}
