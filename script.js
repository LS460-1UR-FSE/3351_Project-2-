

//HTML elements to be updated by JS

const command_grid = document.querySelector('#command_grid');
const search_status = document.querySelector('#search_status');
const command_details = document.querySelector('#command_details');

//information display elements
const command_name = document.querySelector('#command_name');
const command_description = document.querySelector('#command_description');
const command_syntax = document.querySelector('#command_syntax');

//displayed information is held in this element
const command_examples = document.querySelector('#command_examples');

//search field input 
const search_input = document.querySelector('#search_input');

//full command list stored here so searches don't remove data
let all_commands =[];

//display command objected when button is pressed
function show_command(command) {
    // plain text converts into html elements
    command_name.textContent = command.name;
    command_description.textContent = command.description;
    command_syntax.textContent = command.syntax;

    // Clear examples from the previously selected command.
    command_examples.replaceChildren();

    // repeats for each example of a command
    command.examples.forEach(function (example) {
        const example_block = document.createElement('pre'); // create elements in memory
        const example_code = document.createElement('code');
        const explanation = document.createElement('p');

        // Insert the example as text and add its explanation from JSON
        example_code.textContent = example.code;
        explanation.textContent = example.explanation;

        // Put the code inside <pre> to save its format and then add both items to the page.
        example_block.append(example_code);
        command_examples.append(example_block, explanation);
    });

    // Reveal the completed details section.
    command_details.hidden = false;

    //move focus to command that is selected
    command_name.focus({ preventScroll: true });

    //bring command details into view
    command_details.scrollIntoView({ behavior: 'instant', block: 'start'    });

}

//builds grid for full command list or searched list 
function display_commands(commands){

    command_grid.replaceChildren(); //remove the previous existing buttons

    commands.forEach(function (command){ // one button for each command in the array

        // mouse or keyboard button
        const command_button = document.createElement('button');
        command_button.type = 'button';
        // button is connected to appearance from css file
        command_button.className = 'command_card';

        //show command name on card
        const name_text = document.createElement('strong');
        name_text.textContent = command.name;


        // append commasnd name to its button
        command_button.append(name_text);

        // runs show_commands when the button is clicked 
        command_button.addEventListener('click', function(){
            show_command(command);
        });

        //placed button in grid
        command_grid.append(command_button);
    });

    search_status.textContent = commands.length + ' commands shown.'; // report number of commands displayed
}

async function load_commands() { // loads command data asynchronously per the project requirements

    try{
        const response = await fetch('commands.json');  // request JSON file

        if (!response.ok) { //error check for missing file
            throw new Error('Failed to fetch commands');
        }

        //converts json into JS objects and store in array
        all_commands = await response.json();

        //display commands 
        display_commands(all_commands);


    } catch (error) {
        search_status.textContent = 'unable to load commands'; // loading, parsing, display error 
        console.error(error); // developer console message
    
    }
}

// function runs when search field is interacted with
search_input.addEventListener('input', function() {

    // remove extra space and ignores capitalization/lowercase
    const search_text = search_input.value.trim().toLowerCase();

    const matching_commands = all_commands.filter(function(command) { //creates array 
        //checks if command matches search 
        const name_matches = command.name.toLowerCase().includes(search_text);

        const description_matches = command.description // checks description for search text
            .toLowerCase()
            .includes(search_text);
        
        return name_matches || description_matches; // keeps command if search matches name or description keyword
    });
    
    display_commands(matching_commands); // rebuilds grid using the commands that match

    command_details.hidden = true; // hide details from the previous selection when search changes
 
    if (matching_commands.length === 0) { // empty search results 
        search_status.textContent = 'No commands found.';
    }
});
load_commands(); // load after deferred script