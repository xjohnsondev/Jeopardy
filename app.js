// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

// const $spinner = $('<div>')
//     .addClass('spinner')
//     .html(
//         '<div class="loader"></div>'
// );

let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const body = document.body; 

const startBtn = document.createElement('button');
startBtn.innerText = 'Start'
startBtn.addEventListener('click', setupAndStart);
body.append(startBtn);

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let catIDs = [];
    while (catIDs.length < NUM_CATEGORIES){
        let catNum = Math.floor(Math.random() * 20000 + 1);
        if (!catIDs.includes(catNum)) catIDs.push(catNum);
    }
    console.log(`catIDs: ${catIDs}`)
    getCategory(catIDs); 
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView()
    categories = [];
    getCategoryIds()

}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catIDs) {
    for (let cat of catIDs){
        let res = await axios.get(`https://jservice.io/api/category`, {
            params: {
                id : cat,
            }
        });
        
        for (let clue of res.data.clues) {
            delete clue.airdate;
            delete clue.category_id;
            delete clue.game_id;
            delete clue.id;
            delete clue.invalid_count;
            clue.showing = null;
        }
      
        //push current formated category into categories
        categories.push(res.data);
    }
    console.log("Categories: ", categories);
    fillTable();
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
    const board = document.createElement('table');
    body.append(board);

    // construct title cells
    for (let i = 0; i < NUM_CATEGORIES; i++){
        const header = document.createElement('th');
        header.setAttribute('id', i)
        header.setAttribute('class', 'title-box');
        header.innerText = categories[i].title.toUpperCase();
        board.append(header);
    };

    // construct question/ answer cells
    for (let row = 0; row < NUM_QUESTIONS_PER_CAT; row++){
        for (let i = 0; i < NUM_CATEGORIES; i++){
            const box = document.createElement('td');
            box.setAttribute('id', i)
            box.setAttribute('class', 'question-box');
            box.innerText = "?";

            box.addEventListener('click', handleClick);
            
            board.append(box);
        }
    }
    // getCategory(categories);
}

//get the category pertaining to the clicked cell
// function getCategoryNum(evt) {
//     const categoryNum = parseInt(evt.target.id.slice(0, 1));
//     console.log(categoryNum);
//     return categoryNum;
// }
//   //get the clue pertaining to the clicked cell
// function getClueNum(evt) {
//     const clueNum = parseInt(evt.target.id.slice(2));
//     return clueNum;
// }

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
     
    let clue = categories[this.id].clues[Math.floor(Math.random() * categories[this.id].clues.length)]
    console.log(clue)
    
    if (clue.showing === null){
        this.innerHTML = `<div class="cell-container">${clue.question}</div>`;
        clue.showing = 'question';
        return; 
    } 

    if (clue.showing === "question") {
        this.innerText = clue.answer;
        clue.showing = "answer";
        this.removeEventListener('click', handleClick);
        return;
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $spinner.fadeIn();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $spinner.fadeOut();
}




/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

// setupAndStart()