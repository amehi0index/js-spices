const container = document.querySelector('.container')
const expandSearchBtn = document.querySelector('.expand-search-btn')
const homeBtn = document.querySelector('.home-btn')
const input = document.getElementById('input')
const searchToBackBtn = document.querySelector('.search-back-btn')
const mainSearch = document.querySelector('.search')
const content = document.querySelector('.content')
const welcome = document.querySelector('.welcome')
const backArrow = document.querySelector('.back-arrow')
const searchIconBtn = document.querySelector('.search-icon-btn')
const inputSpan = document.querySelector('.input-span')
const herbList = document.querySelector('.herb-list')
const card = document.querySelector('.card')

let herbs = []
let isEnter = false
let foodIconClicked = false
let foodInfoIsShow = false

getData()

document.addEventListener('DOMContentLoaded', function () {

    expandSearchBtn.addEventListener('click', expandInput)
    
    homeBtn.addEventListener('click', goHome)

    input.addEventListener('input', (event) => getMatches(event.target.value))

    input.addEventListener('keydown', (event) => {

        if (event.code === 'Enter') {
            const value = event.target.value
            let userValue = formatUserEntry(value)
            isEnter = true
            console.log(userValue)
            findHerb(userValue)
        }else{
            isEnter = false
        }

        if (event.code === 'ArrowDown'){
            scrollHerbList(herbList) 
        } 
    })

    input.addEventListener('blur', ()=> scrollHerbList(herbList))
})

async function getData() {
    const res = await fetch('../data/herblist.json')
    const data = await res.json()
    herbs.push(...data)
}

function formatUserEntry (val){

   const valArray = val.split(' ')

    const newArr =  valArray.map(str => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    })

    const formattedValue = newArr.join(' ')
    console.log(formattedValue)
    return formattedValue
}

function getMatches (searchTerm){

    let matches = []

    matches = herbs.filter(herb => {
        const regex = new RegExp(`^${searchTerm}`, 'gi')
        return herb.name.match(regex)
    })

    if (searchTerm.length === 0) {
        matches = []
        herbList.innerHTML = ''
    }
    displayResults(matches)
    handleIconClick(searchTerm)
}

function expandInput() {
   
    mainSearch.classList.remove('hidden')

    welcome.classList.add('hide-welcome')

    expandSearchBtn.style.background = 'transparent'//

    setTimeout(() => {
        searchToBackBtn.innerHTML = 'back'//
        homeBtn.style.background = 'transparent'//
        inputSpan.classList.add('show')
        input.classList.add('slide')

    }, 2000)

    setTimeout(() => {
        searchIconBtn.classList.add('show-icon')
        backArrow.classList.add('show')
    }, 3200)
}

function goHome() {
    
    input.value = ''
    herbList.innerHTML = ''

    mainSearch.classList.add('hidden')
    card.classList.remove('show')
    welcome.style.display = 'block'
    welcome.classList.remove('hide-welcome')
    expandSearchBtn.style.background = 'orangered'

    searchToBackBtn.innerHTML = 'search'
    homeBtn.style.background = 'orangered'
    inputSpan.classList.remove('show')
    input.classList.remove('slide')
    searchIconBtn.classList.remove('show-icon')
    backArrow.classList.remove('show')

    content.classList.remove('adjust-height')
}

function displayResults(matches) {
    herbList.innerHTML = ''

    let list = ''

    if (matches.length > 0) {

        matches.map(herb => {
            list += `<li tabindex="-1">${herb.name}</li>`
        })

        herbList.innerHTML = list

        getHerbListItem(herbList)
    }
}

function getHerbListItem(herbList) {

    const herbItems = herbList.querySelectorAll('li')
    let autoValue

    herbItems.forEach(item => {

        item.addEventListener('click', () => {

            autoValue = item.innerHTML
                
            input.value = autoValue

            input.focus()

            herbList.innerHTML = ''

            if(!isEnter){  //searchicon clicked
                handleIconClick(autoValue)
            }else{
                isEnter = true
                findHerb(autoValue)
            }
        })
    })
}

function scrollHerbList(herbList) {

    const herbItems = herbList.querySelectorAll('li')
    let first = herbList.firstChild

    herbItems.forEach(item => {

        first.classList.add('current')
        first.focus()
        autoValue = first.innerHTML
        input.value = autoValue

        item.addEventListener('keydown', (event) => {
            let selected
            if (event.code === 'ArrowUp') { 
                if(item === first){
                    input.value = ''
                    input.focus()
                }else{
                    if(item.previousElementSibling){
                        selected = item.previousElementSibling
                        handleArrow(item, selected)
                    }
                }
            }else if (event.code === 'ArrowDown'){
                if(item.nextElementSibling){
                    selected = item.nextElementSibling
                    handleArrow(item, selected)
                }
            } 

            if (event.code === 'Enter'){
                findHerb(autoValue)
            }
        })   
    }) 
}

function handleArrow (el, selected) {
    el.classList.remove('current')
    selected.focus()
    selected.classList.add('current')

    autoValue = selected.innerHTML
    input.value = autoValue
}

function findHerb(val){

    let found = herbs.find(match => match.name === val) 
    
    if(!found && !undefined){
        const alert = document.querySelector('.alert')
        /*alert.classList.add('show')  //fix for searchiconclick
        setTimeout(()=> {
            alert.classList.remove('show')   
        }, 3000)*/
        console.log('Name Not Found')
     }else{
       displayHerbCard(found)
    }

    welcome.classList.add('hide-welcome')

    if (input.value !== '') {
        content.classList.add('adjust-height')
        card.classList.add('show')
    }

    herbList.innerHTML =''
    input.value = ''
    input.addEventListener('focus', () => { card.classList.remove('show') })
}

function displayHerbCard (found) {

    console.log(found)

    card.innerHTML = `

        <div class="card-header">
            <h1>${found.name}</h1>
        </div>

        <div class="card-content">

            <div class="info">

                <div class="herb-img-container">
                    <img src=${found.img}>
                    <div class ="overlay"></div>
                </div>
                
                <div class="info-rows">
                    <div class="row-one">
                        <span class="row-span">
                            <h4>Profile</h4>
                            <p>${found.description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est magnam repudiandae ex explicabo mollitia, exercitationem optio.'}</p>
                        </span>
                    </div>
                    
                    <div class="row-two">

                        <div>
                            <span class="row-span">
                                <h4>Origin</h4>
                                <p>${found.origin || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}</p>
                            </span>
                    
                            <span class="row-span">
                                <h4>Other Names</h4>
                                <p>${found.other || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}</p>
                            </span>
                        </div>
                    
                        <div>
                            <span class="row-span">
                                <h4>Cuisines</h4>
                                <p>${found.cuisines || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}</p>
                            </span>
                            
                            <span class="row-span">
                                <h4>Substitutes</h4>
                                <p>${found.substitutes || 'Lorem ipsum dolor sit amet consectetur.'}</p>
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            <div class="food-categories">
                <!--<h4>Categories</h4>-->
                <div class="food-icons">
                    <div id ="grains"><img src="icons/bread.svg" class="white-icon">Grains</div>
                    <div id ="meats"><img src="icons/meat.svg" class="white-icon" >Meats</div>
                    <div id="seafood"><img src="icons/lobster.svg" class="white-icon">Seafood</div>
                    <div id="vegetables"><img src="icons/broccoli.svg" class="white-icon">Vegetables</div>
                    <div id ="beverages"><img src="icons/lemonade.svg" class="white-icon">Beverages</div>
                    <div id ="soups"><img src="icons/soup.svg" class="white-icon">Soup</div>
                    <div id ="desserts"><img src="icons/cupcake.svg" class="white-icon">Desserts</div>
                    <div id="combinations"><img src="icons/leaf.svg" class="white-icon" >Combos</div>
                </div>

                <div class="food-info">
                    <h3 class='title'></h3>
                    <p class='description'></p>
                    <a class="food-info-btn">Recipes</a>
                </div>
            </div>
    
        </div>
    `
    displayFoodInfo(found)
    //toggleCardImage()
    hoverIcons()
}

function toggleCardImage(){

    const imageContainer = document.querySelector('.herb-img-container')
    const cardInfo = document.querySelector('.info-rows')
    const foodInfo = document.querySelector('.food-info')

    imageContainer.addEventListener('mouseenter', ()=>{
        imageContainer.classList.add('hide')
        cardInfo.classList.add('show')
    })
        
    imageContainer.addEventListener('mouseleave', ()=>{
        imageContainer.classList.remove('hide')
        cardInfo.classList.remove('show')
    })
}

function removeCardImageListener(){
    const imageContainer = document.querySelector('.herb-img-container')
    const cardInfo = document.querySelector('.info-rows')
}

function handleIconClick(val) {

    let herbValue

    searchIconBtn.addEventListener('click', () => {
        if(!isEnter){
            herbValue = input.value
            console.log(herbValue)
        }else {
            herbValue = val
        }
        findHerb(herbValue) 
    })
}

function clickOutside (){
    container.addEventListener('click', (e) => {

        if(card.classList.contains('show')){
            const withinCard = e.composedPath().includes(card)
            const withinIcon = e.composedPath().includes(searchIconBtn)
        
            if(withinCard || withinIcon){
                card.classList.add('show')
            }else{
                card.classList.remove('show')
                input.focus()
            }
        }
    })
}

function displayFoodInfo (found) {
    const herbContainer = document.querySelector('.herb-img-container')
    const foodIcons = Array.from(document.querySelectorAll('.food-icons div'))
    const foodIconContainer = document.querySelector('.food-icons')
    const foodInfoTitle = document.querySelector('.food-info h3')
    const foodInfoContent = document.querySelector('.food-info p')
    const foodCategories = document.querySelector('.food-categories')
    const foodInfo = document.querySelector('.food-info')
    const rowTwo = document.querySelector('.row-two')

    const imageContainer = document.querySelector('.herb-img-container')
    const cardInfo = document.querySelector('.info-rows')

    foodIcons.forEach(icon => {
        icon.addEventListener('click', (e)=>{

            removeClasses(icon)
         
            Object.entries(found.categories).forEach(([key, value]) => {
                    
                let content =  value.map(c => formatItem(c)).join(', ')

                if(key === e.target.id){
                    foodInfoTitle.innerHTML = `${key}`
                    foodInfoContent.innerHTML = `${content || 'No Information Available'} `
                }
            })

            if(foodInfo.classList.contains('show')){
                herbContainer.classList.add('hide')
                rowTwo.classList.add('hide')
                foodCategories.classList.add('switch-bg')
                foodIconClicked = true
    
            }else{
                herbContainer.classList.remove('hide')
                rowTwo.classList.remove('hide')
                foodCategories.classList.remove('switch-bg')
                foodIconClicked = false
            }
        })   
        
    })
    const recipesBtn = document.querySelector('.food-info a')
    recipesBtn.addEventListener('click', (e) => getRecipeSearch(e, found.name ))

    clickOutside()
}

function removeClasses(icon) {

    const foodIcons = document.querySelectorAll('.food-icons div')
    const foodInfo = document.querySelector('.food-info')

    foodIcons.forEach((ic) => {
        if(ic === icon) { 
            ic.classList.toggle("active")

            if(ic.classList.contains("active")){
                foodInfo.classList.add('show')
                foodInfoIsShow = true
            }else{
                foodInfo.classList.remove('show')
                foodInfoIsShow = false
            }
        }
        else { 
            ic.classList.remove("active")
        }
    })
}

function hoverIcons (){

    const foodIcons = document.querySelectorAll('.food-icons div')

    foodIcons.forEach(icon => {

        const image = icon.querySelector('img')
        const imageSrc = image.src
        const imStr1 =  imageSrc.substring(0, imageSrc.length - 4)
        const imStr2 =  imageSrc.substring(imageSrc.length - 4)
 
        const imageSrcOrange = imStr1 + '-orange' + imStr2

        icon.addEventListener('mouseenter', () => image.src = imageSrcOrange)
        icon.addEventListener('mouseleave', () => image.src = imageSrc)
    })
}

function getRecipeSearch (e, herbName){

    const recipesBtn = document.querySelector('.food-info a')

    e.preventDefault()
    
    const hName = herbName.charAt(0).toLowerCase() + herbName.slice(1)
    let foodCategory = e.target.parentNode.querySelector('h3').innerHTML

    recipeSearchTerm = `${hName} ${foodCategory}`
    console.log(recipeSearchTerm)
    localStorage.setItem("query", recipeSearchTerm)

    if(recipeSearchTerm !== ''){
        let url = 'recipes.html'
        recipesBtn.setAttribute('href', url )
        window.open(url, '_blank')
    }
}

function formatItem(item){
    
    if (typeof(item) === 'string' && item !== undefined){
        const newCategoryArr = item.split(',')

        const formattedString =  newCategoryArr.map(c => {
            const cStr = c.trim()
            return  cStr.trim().charAt(0).toUpperCase() + cStr.slice(1)
        }).join(', ')

        return formattedString
    }else if(Array.isArray(item)){

        const formattedString =  item.map(c => {
            return  c.charAt(0).toUpperCase() + c.slice(1)
        }).join(', ')

        return formattedString
    }
}


