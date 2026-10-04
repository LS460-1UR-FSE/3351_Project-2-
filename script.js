

//HTML elements to be updated

const command_grid = document.querySelector('#command_grid');
const search_status = document.querySelector('#search_status');
const command_details = document.querySelector('#command_details');

const command_name = document.querySelector('#command_name');
const command_description = document.querySelector('#command_description');
const command_syntax = document.querySelector('#command_syntax');

const command_examples = document.querySelector('#command_examples');
//search field
const search_input = document.querySelector('#search_input');

//store commands to search for later
let all_commands =[];

//Display information for the selected command
// Display the information for one selected command.
function show_command(command) {
    command_name.textContent = command.name;
    command_description.textContent = command.description;
    command_syntax.textContent = command.syntax;

    // Clear examples from the previously selected command.
    command_examples.replaceChildren();

    // Create HTML elements for every example in the array.
    command.examples.forEach(function (example) {
        const example_block = document.createElement('pre');
        const example_code = document.createElement('code');
        const explanation = document.createElement('p');

        // Insert the example as text and add its explanation.
        example_code.textContent = example.code;
        explanation.textContent = example.explanation;

        // Put the code inside <pre>, then add both items to the page.
        example_block.append(example_code);
        command_examples.append(example_block, explanation);
    });

    // Reveal the completed details section.
    command_details.hidden = false;

    //move focus to command that is selected
    //keep focus from scrolling before next user instruction
    command_name.focus({ preventScroll: true });

    //scroll details of command into user view
    command_details.scrollIntoView({ behavior: 'instant', block: 'start'    });

}

//create button for commands in array
function display_commands(commands){

    command_grid.replaceChildren(); //remove the previous buttons

    commands.forEach(function (command){

        // create button for CSS class
        const command_button = document.createElement('button');
        command_button.type = 'button';
        command_button.className = 'command_card';

        //create description and command name
        const name_text = document.createElement('strong');
        name_text.textContent = command.name;


        // append commasnd name to its button
        command_button.append(name_text);

        command_button.addEventListener('click', function(){
            show_command(command);
        });

        //placed button in grid
        command_grid.append(command_button);
    });

    search_status.textContent = commands.length + ' commands shown.';
}

async function load_commands() {

    try{
        const response = await fetch('commands.json');

        if (!response.ok) { //error check
            throw new Error('Failed to fetch commands');
        }

        //converts json into JS objects
        all_commands = await response.json();

        //use data for the grid 
        display_commands(all_commands);


    } catch (error) {
        search_status.textContent = 'unable to load commands';
        console.error(error);
    
    }
}

// function runs when search field is interacted with
search_input.addEventListener('input', function() {

    // remove extra space
    const search_text = search_input.value.trim().toLowerCase();

    const matching_commands = all_commands.filter(function(command) {
        const name_matches = command.name.toLowerCase().includes(search_text);

        const description_matches = command.description
            .toLowerCase()
            .includes(search_text);
        
        return name_matches || description_matches;    
    });
    
    display_commands(matching_commands);

    command_details.hidden = true;

    if (matching_commands.length === 0) {
        search_status.textContent = 'No commands found.';
    }
});
load_commands();