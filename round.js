module.exports = {
    number: 1,
    end: new Date(2019, 02, 25),
    canClaim: function(tags, tag){
        if(tags.length < 2)
            return true
        else return false
    }
}
