
const recipeQuery= localStorage.getItem('query')
const pageTitle = document.querySelector('.page-title')

let url = `/api?q=${recipeQuery}`
let recipesReceived = []

displaySkeletonCards()
getData()

window.addEventListener("load", function () {
   removeSkeleton(recipesReceived)
})

async function getData() {

    const res = await fetch(url)
    const data = await res.json()

    console.log(data.hits)

    const recipes =  await data.hits.map(r => {

        const recipeData = {
            img: r.recipe.image,
            ingredients: r.recipe.ingredients,
            title: r.recipe.label,
            cuisine: r.recipe.cuisineType,
            link: r.recipe.shareAs,
            time: r.recipe.totalTime,
            servings: r.recipe.yield,
            calories: r.recipe.calories
        }
        return recipeData
    })

    recipesReceived.push(...recipes)
    //displaySkeletonCards(recipes)
}

function formatPageTitle (){

    const titleArray = recipeQuery.split(' ')

    const newArr =  titleArray.map(str => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    })

    newArr.splice(-1, 0, 'and')
    const newTitle = newArr.join(' ')

    return newTitle
}

function displaySkeletonCards(recipes){

    let titleDescription = formatPageTitle()

    pageTitle.innerHTML = `${titleDescription} Recipes`

    const recipeCards = document.querySelector('.recipe-cards')

    recipeCards.innerHTML = ''

    for( let i = 0; i < 10; i++){

        const skeletonCard = `
            <div class="recipe-card">

                <div class="recipe-card-header">
                    <div class="img-container animated-bg">
                        <img src="" alt="" class="hide">
                    </div>
                    <h5 class="recipe-card-title">
                        <a href="#" class="animated-bg animated-bg-text"></a>
                        <small class="cuisine animated-bg animated-bg-text"> &nbsp;</small>
                    </h5>
                </div>
   
                <div class="recipe-card-content">
                    <div class="recipe-card-icons">
                        <div>
                            <span class="animated-bg animated-bg-text">
                                <i class="fas fa-clock hide"></i>
                                <p class="time"></p>
                            </span>
                            <p class="recipe-card-icon-label time-label animated-bg animated-bg-text"></p>
                        </div>

                        <div>
                            <span class="animated-bg animated-bg-text">
                                <i class="fas fa-user hide"></i>
                                <p class="servings"></p>
                            </span>
                            <p class="recipe-card-icon-label servings-label animated-bg animated-bg-text"></p>
                        </div>

                        <div>
                            <span class="animated-bg animated-bg-text">
                                <i class="fas fa-fire hide"></i>
                                <p class="calories"></p>
                            </span>
                            <p class="recipe-card-icon-label calories-label animated-bg animated-bg-text"></p>
                        </div>
                    </div>
                </div>
         
                <div class="recipe-btn-div">
                    <a href="#" class="recipe-card-btn animated-bg"></a>
                </div>
            </div>
        `
        recipeCards.innerHTML+=skeletonCard
    }
    removeSkeleton(recipes)
}

function removeSkeleton(recipes) {

    if(recipes){
        setTimeout(()=>{

            const recipeCards = document.querySelector('.recipe-cards')
        
            const animated_bgs = document.querySelectorAll('.animated-bg')
            const animated_bg_texts = document.querySelectorAll('.animated-bg-text')
            
            animated_bgs.forEach(bg => bg.classList.remove('animated-bg'))
            animated_bg_texts.forEach(bg => bg.classList.remove('animated-bg-text'))
        
            recipeCards.innerHTML =''
            console.log(recipeCards)
        
            setCardInfo(recipes)
        
        }, 2500)
    }
}

function setCardInfo(recipes){

    recipes.map(recipe => {
        
        const recipeCards = document.querySelector('.recipe-cards')

        const card   = `
            <div class="recipe-card">
        
                <div class="recipe-card-header">
                    <div class="img-container">
                        <img src=${ recipe.img} alt="">
                    </div>
                    <h5 class="recipe-card-title">
                        <a href=${recipe.link}>${recipe.title}</a>
                        <small class="cuisine">${recipe.cuisine}</small>
                    </h5>
                   
                </div>
        
                <div class="recipe-card-content">
            
                    <div class="recipe-card-icons">

                        <div>
                            <span>
                                <i class="fas fa-clock"></i>
                                <p class="time">${recipe.time}</p>
                            </span>
                            <p class="recipe-card-icon-label">Minutes</p>
                        </div>

                        <div>
                            <span>
                                <i class="fas fa-user"></i>
                                <p> ${recipe.servings}</p>
                            </span>
                            <p class="recipe-card-icon-label">Servings</p>
                        </div>

                        <div>
                            <span>
                                <i class="fas fa-fire"></i>
                                <p> ${Math.round(recipe.calories)}</p>
                            </span>
                            <p class="recipe-card-icon-label">Calories</p>
                        </div>
                
                    </div>
                
                </div>
                <div class="recipe-btn-div">
                    <a href=${recipe.link} class="recipe-card-btn">Get Recipe</a>
                </div>
            </div>
        `
        recipeCards.innerHTML+=card
    })
}







