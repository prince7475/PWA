// real -time listener
db.collection('recipes').onSnapshot((snapshot) => {
    // console.log('snapshot.docChanges', snapshot.docChanges())
    snapshot.docChanges().forEach(change => {
        console.log('change', change)
        console.log('change.doc.data()', change.doc.data(), change.doc.id)

        switch(change.type){
            case 'added': 
            renderRecipe(change.doc.data(), change.doc.id)
            case 'removed':

            default:
                return null;
        }
    });
})