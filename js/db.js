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
        switch(change.type){
            case 'added': 
            // add the document to the web page
            renderRecipe(change.doc.data(), change.doc.id)
            case 'removed':
            // remove the document data from the web page
            removeRecipe(change.doc.id)
            default:
                return null;
        }
    });
})


// Add new recipe 
const form = document.querySelector('form')

form.addEventListener('submit', evt => {
    evt.preventDefault();

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    }

    db.collection('recipes').add(recipe).catch(err => {console.log(err)})

    form.title.value = "";
    form.ingredients.value = "";
})


//delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
    if(evt.target.tagName === 'I'){
        const id = evt.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete();
    }
    console.log('evt', evt)
})