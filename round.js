module.exports = {
    number: 1,
    end: new Date(2019, 02, 25),
    pass: function(tags){
        if(tags.length > 2)
            return true
        else return false
    }
}
