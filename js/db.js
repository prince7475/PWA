//offline data
db.enablePersistence()
    .catch(error => {
        if(error.code == 'failed-precondition'){

            // probable mutiple tabs open at once
            console.log('presistence failed')
        } else if (error.code == 'unimplemented'){
            // browser does not support 
            console.log('presistence is not available')
        }
    })

// real -time listener
db.collection('recipes').onSnapshot((snapshot) => {
    // console.log('snapshot.docChanges', snapshot.docChanges())
    snapshot.docChanges().forEach(change => {
        console.log(change)
        switch(change.type){
            case 'added': 
            renderRecipe(change.doc.data(), change.doc.id)
            case 'removed':

            default:
                return null;
        }
    });
})