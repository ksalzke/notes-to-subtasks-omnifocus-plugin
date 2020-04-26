# About

This is an Omni Automation plug-in bundle for OmniFocus that provides a function and action to 'expand' a TaskPaper note into subtasks; it is designed with "checklist" items in mind.

_Please note that Omni Automation for OmniFocus is still in development and details are subject to change before it officially ships. If you have questions, please refer to [Omni's Slack #automation channel](https://www.omnigroup.com/slack/)._

_In addition, please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from a random amateur on the internet!)_

## Known issues 

None so far! 🤞

# Installation & Set-Up

1. Click on the green `Clone or download` button above to download a `.zip` file of all the files in this GitHub repository.
2. Unzip the downloaded file.
3. Open the configuration file located at `Resources/noteToSubtasksConfig.js` and make any changes needed to reflect your OmniFocus set-up. Further explanations of the options are included within that file as comments.
4. Rename the entire folder to anything you like, with the extension `.omnifocusjs`
5. Move the resulting file to your OmniFocus plug-in library folder.

# Actions

This plug-in contains the following action:

## Note To Subtasks

This action simply runs the below `noteToSubtasks` function on the selected task.

# Functions

This plugin contains the following function within the `noteToSubtasksLib` library:

## noteToSubtasks

This function takes a task object as input and:
1. Builds the TaskPaper text to be used to create subtasks of that task.
2. Creates the subtasks by "pasting" the generated TaskPaper into OmniFocus (using the existing URL scheme).
3. If only one subtask is created, recursively runs on the created subtask as well.
4. Attempts to return the user to their starting perspective.

Subtasks are tagged with:
* any tags that the original task is tagged with, _unless_ they are included in the `uninheritedTags` option in the config file,
* a checklist tag (which defaults to `✓` and is set in the config file), and
* any tags specified in the regular TaskPaper format

To allow for multiple iterations of checklists, there are three 'levels' of 'task markers':
1. ` - ` or `[ ]` will be expanded the first time the function is run
2. `( )` will be expanded the second time the function is run
3. `< >` will be expanded the third time the function is run

In the process of creating the TaskPaper text, this function:
* Ignores everything up to the first `[ ]`, `- `, or `_` in the note
* Replaces underscores before `[ ` with tabs (this is to assist with Taskpaper generated from Shortcuts, as Shortcuts doesn't retain the tab characters)